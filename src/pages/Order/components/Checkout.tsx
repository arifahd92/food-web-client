import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

import { ROUTES, orderStatusPath } from '@/shared/utils/routes';
import { addOrderToHistory } from '@/shared/utils/helper';
import { apiService } from '@/shared/services/api.service';
import { useCart } from '@/shared/contexts/cartContext';
import { useUser } from '@/shared/contexts/UserContext';
import { checkoutSchema, defaultCheckoutValues } from '../schema';
import type { CheckoutFormData } from '../schema';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Checkout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const { email } = useUser();

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      ...defaultCheckoutValues,
      customer_email: email || '',
    },
  });

  const placeOrder = useMutation({
    mutationFn: async (data: CheckoutFormData) => {
      return apiService.createOrder({
        customer_name: data.customer_name,
        customer_address: data.customer_address,
        customer_phone: data.customer_phone,
        customer_email: data.customer_email,
        items: items.map((i) => ({
          menu_item_id: i.menu_item_id,
          quantity: i.quantity,
        })),
      });
    },
    onSuccess: (order) => {
      addOrderToHistory(order.id);
      clearCart();
      navigate(orderStatusPath(order.id));
    },
    onError: (error) => {
      console.error('Failed to place order:', error);
      alert('Failed to place order. Please try again.');
    },
  });

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <p className="text-muted-foreground">{t('app.emptyCart')}</p>
        <Link to={ROUTES.menu}>
          <Button>{t('app.backToMenu')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('app.checkout')}</h1>
      <form
        className="max-w-xl space-y-6"
        onSubmit={form.handleSubmit((data) => placeOrder.mutate(data))}
      >
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">{t('app.deliveryDetails')}</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="customer_name">{t('app.name')}</Label>
              <Input
                id="customer_name"
                {...form.register('customer_name')}
                className="mt-1"
              />
              {form.formState.errors.customer_name && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.customer_name.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="customer_address">{t('app.address')}</Label>
              <Input
                id="customer_address"
                {...form.register('customer_address')}
                className="mt-1"
              />
              {form.formState.errors.customer_address && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.customer_address.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="customer_email">{t('app.email')}</Label>
              <Input
                id="customer_email"
                type="email"
                {...form.register('customer_email')}
                className="mt-1"
                placeholder="john@example.com"
              />
              {form.formState.errors.customer_email && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.customer_email.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="customer_phone">{t('app.phone')}</Label>
              <Input
                id="customer_phone"
                type="tel"
                {...form.register('customer_phone')}
                className="mt-1"
              />
              {form.formState.errors.customer_phone && (
                <p className="text-sm text-destructive mt-1">
                  {form.formState.errors.customer_phone.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="text-sm text-muted-foreground mb-4">
          Note: Total amount will be calculated by the backend.
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={placeOrder.isPending}
        >
          {placeOrder.isPending ? 'Processing...' : t('app.placeOrder')}
        </Button>
      </form>
    </div>
  );
}
