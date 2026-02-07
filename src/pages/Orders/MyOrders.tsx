import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Package, ChevronRight } from 'lucide-react';

import { ROUTES, orderStatusPath } from '@/shared/utils/routes';
import { getOrderHistoryIds } from '@/shared/utils/helper';
import { reqUrl } from '@/shared/services/reqUrl.service';
import { httpServices } from '@/shared/services/http.service';
import { useOrderStream } from '@/hooks/useOrderStream';
import type { Order } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const STATUS_KEYS: Record<string, string> = {
  order_received: 'app.orderReceived',
  preparing: 'app.preparing',
  out_for_delivery: 'app.outForDelivery',
  delivered: 'app.delivered',
};

function formatOrderDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return dateStr;
  }
}

export default function MyOrders() {
  const { t } = useTranslation();
  useOrderStream();
  const orderIds = getOrderHistoryIds();

  const orderQueries = useQueries({
    queries: orderIds.map((id) => ({
      queryKey: ['order', id],
      queryFn: () => httpServices.getData<Order>(reqUrl.orderById(id)),
      staleTime: 2000,
    })),
  });

  const orders = orderQueries
    .map((q) => q.data)
    .filter((o): o is Order => o != null);
  const isLoading = orderQueries.some((q) => q.isLoading);

  if (orderIds.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Package className="h-7 w-7" />
          {t('app.myOrders')}
        </h1>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">{t('app.noOrdersYet')}</p>
            <Link to={ROUTES.menu}>
              <Button>{t('app.backToMenu')}</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Package className="h-7 w-7" />
        {t('app.myOrders')}
      </h1>
      <p className="text-muted-foreground text-sm mb-6">
        {t('app.myOrdersSubtitle')}
      </p>

      {isLoading && orders.length === 0 ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-24" />
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between gap-4 flex-wrap">
                  <div>
                    <p className="text-xs text-muted-foreground font-mono">
                      {order.id}
                    </p>
                    <p className="font-medium">{order.customer_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatOrderDate(order.created_at)} · $
                      {order.total_amount.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium rounded-full bg-muted px-3 py-1">
                      {t(STATUS_KEYS[order.status] ?? order.status)}
                    </span>
                    <Link to={orderStatusPath(order.id)}>
                      <Button variant="outline" size="sm">
                        {t('app.trackOrder')}
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
