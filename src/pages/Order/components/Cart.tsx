import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Minus, Plus, Trash2 } from 'lucide-react';

import { ROUTES } from '@/shared/utils/routes';
import { useCart } from '@/shared/contexts/cartContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Cart() {
  const { t } = useTranslation();
  const { items, updateQuantity, removeItem, totalAmount, totalItems } = useCart();

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
      <h1 className="text-2xl font-bold mb-6">{t('app.cart')}</h1>
      <div className="max-w-2xl space-y-4">
        {items.map((item) => (
          <Card key={item.menu_item_id}>
            <CardContent className="p-4 flex flex-row gap-4 items-center">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-24 h-24 object-cover rounded-md"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-sm text-muted-foreground">
                  ${item.price.toFixed(2)} × {item.quantity}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.menu_item_id, item.quantity - 1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => updateQuantity(item.menu_item_id, item.quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeItem(item.menu_item_id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="mt-6 max-w-2xl">
        <CardHeader className="flex flex-row justify-between items-center">
          <span className="text-lg font-semibold">{t('app.total')}</span>
          <span>${totalAmount.toFixed(2)}</span>
        </CardHeader>
        <CardContent>
          <Link to={ROUTES.checkout}>
            <Button className="w-full">{t('app.checkout')}</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
