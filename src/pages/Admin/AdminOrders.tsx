import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield } from 'lucide-react';

import { httpServices } from '@/shared/services/http.service';
import { reqUrl } from '@/shared/services/reqUrl.service';
import { useOrderStream } from '@/hooks/useOrderStream';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { Order, OrderStatus } from '@/types';

const STATUS_OPTIONS: OrderStatus[] = [
  'order_received',
  'preparing',
  'out_for_delivery',
  'delivered',
];

const STATUS_KEYS: Record<OrderStatus, string> = {
  order_received: 'app.orderReceived',
  preparing: 'app.preparing',
  out_for_delivery: 'app.outForDelivery',
  delivered: 'app.delivered',
};

export default function AdminOrders() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  useOrderStream();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: () => httpServices.getData<Order[]>(reqUrl.orders),
  });

  const updateStatus = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: OrderStatus }) =>
      httpServices.patchData<Order>(reqUrl.orderStatus(orderId), { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-24" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Shield className="h-7 w-7" />
        {t('app.admin')}
      </h1>
      <p className="text-muted-foreground text-sm mb-6">
        {t('app.adminSubtitle')}
      </p>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            {t('app.noOrders')}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {orders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.03 }}
              >
                <Card>
                  <CardHeader className="pb-2 flex flex-row items-center justify-between gap-4 flex-wrap">
                    <div>
                      <p className="font-mono text-xs text-muted-foreground">
                        {order.id}
                      </p>
                      <p className="font-medium">{order.customer_name}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.customer_phone} · ${order.total_amount.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-sm font-medium whitespace-nowrap">
                        {t('app.status')}:
                      </label>
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateStatus.mutate({
                            orderId: order.id,
                            status: e.target.value as OrderStatus,
                          })
                        }
                        disabled={updateStatus.isPending}
                        className="rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50 min-w-[180px]"
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>
                            {t(STATUS_KEYS[s])}
                          </option>
                        ))}
                      </select>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0 text-sm text-muted-foreground">
                    {order.customer_address}
                    {order.items && order.items.length > 0 && (
                      <span className="ml-2">
                        · {order.items.length} item(s)
                      </span>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
