import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';

import { ROUTES, orderStatusPath } from '@/shared/utils/routes';
import { addOrderToHistory } from '@/shared/utils/helper';
import { reqUrl } from '@/shared/services/reqUrl.service';
import { httpServices } from '@/shared/services/http.service';
import { useCart } from '@/shared/contexts/cartContext';
import { checkoutSchema, defaultCheckoutValues } from '../schema';
import type { CheckoutFormData } from '../schema';
import type { Order } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';

export default function Checkout() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCart();

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: defaultCheckoutValues,
  });

  const placeOrder = useMutation({
    mutationFn: async (data: CheckoutFormData) => {
      const body = {
        customer_name: data.customer_name,
        customer_address: data.customer_address,
        customer_phone: data.customer_phone,
        items: items.map((i) => ({
          menu_item_id: i.menu_item_id,
          quantity: i.quantity,
          unit_price: i.price,
        })),
      };
      return httpServices.postData<Order>(reqUrl.orders, body);
    },
    onSuccess: (order) => {
      addOrderToHistory(order.id);
      clearCart();
      navigate(orderStatusPath(order.id));
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
        <Card>
          <CardHeader className="flex flex-row justify-between">
            <span>{t('app.yourOrder')}</span>
            <span>${totalAmount.toFixed(2)}</span>
          </CardHeader>
        </Card>
        <Button
          type="submit"
          className="w-full"
          disabled={placeOrder.isPending}
        >
          {placeOrder.isPending ? '...' : t('app.placeOrder')}
        </Button>
      </form>
    </div>
  );
}
