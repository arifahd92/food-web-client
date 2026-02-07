import { Outlet } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ShoppingCart, Shield, Package } from 'lucide-react';

import { ROUTES } from '@/shared/utils/routes';
import { useCart } from '@/shared/contexts/cartContext';
import { Button } from '@/components/ui/button';

export default function PublicLayout() {
  const { t } = useTranslation();
  const { totalItems } = useCart();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-card sticky top-0 z-10">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <Link to={ROUTES.menu} className="font-semibold text-lg">
            {t('app.title')}
          </Link>
          <div className="flex items-center gap-2">
            <Link to={ROUTES.orders}>
              <Button variant="ghost" size="sm">
                <Package className="h-4 w-4 mr-1" />
                {t('app.myOrders')}
              </Button>
            </Link>
            <Link to={ROUTES.admin}>
              <Button variant="ghost" size="sm">
                <Shield className="h-4 w-4 mr-1" />
                {t('app.admin')}
              </Button>
            </Link>
            <Link to={ROUTES.cart}>
            <Button variant="outline" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
