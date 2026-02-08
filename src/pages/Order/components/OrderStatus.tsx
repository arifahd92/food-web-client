import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Check, Package, Truck, ChefHat } from 'lucide-react';

import { ROUTES } from '@/shared/utils/routes';
import { reqUrl } from '@/shared/services/reqUrl.service';
import { httpServices } from '@/shared/services/http.service';
import { useOrderStream } from '@/hooks/useOrderStream';
import type { Order } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const STATUS_ICONS: Record<string, React.ReactNode> = {
  RECEIVED: <ChefHat className="h-6 w-6" />,
  PREPARING: <Package className="h-6 w-6" />,
  OUT_FOR_DELIVERY: <Truck className="h-6 w-6" />,
  DELIVERED: <Check className="h-6 w-6" />,
};

const STATUS_KEYS: Record<string, string> = {
  RECEIVED: 'app.orderReceived',
  PREPARING: 'app.preparing',
  OUT_FOR_DELIVERY: 'app.outForDelivery',
  DELIVERED: 'app.delivered',
};

const FLOW = ['RECEIVED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED'];

export default function OrderStatus() {
  const { orderId } = useParams<{ orderId: string }>();
  const { t } = useTranslation();
  useOrderStream();

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => httpServices.getData<Order>(reqUrl.orderById(orderId!)),
    enabled: !!orderId,
  });

  if (!orderId) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">Missing order ID</p>
        <Link to={ROUTES.menu}>
          <Button className="mt-4">{t('app.backToMenu')}</Button>
        </Link>
      </div>
    );
  }

  if (isLoading || !order) {
    return (
      <div className="py-12 flex justify-center">
        <div className="animate-pulse text-muted-foreground">Loading order...</div>
      </div>
    );
  }

  const currentIdx = FLOW.indexOf(order.status);

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{t('app.orderStatus')}</h1>
      <Card className="mb-6">
        <CardHeader>
          <p className="text-sm text-muted-foreground">{t('app.orderId')}</p>
          <p className="font-mono text-sm">{order.id}</p>
        </CardHeader>
      </Card>
      <div className="flex justify-between mb-8">
        {FLOW.map((status, i) => (
          <motion.div
            key={status}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className={`flex flex-col items-center gap-2 ${
              i <= currentIdx ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
                i <= currentIdx
                  ? 'border-primary bg-primary/10'
                  : 'border-muted'
              }`}
            >
              {STATUS_ICONS[status]}
            </div>
            <span className="text-xs font-medium">{t(STATUS_KEYS[status])}</span>
          </motion.div>
        ))}
      </div>
      <Card>
        <CardHeader>
          <h2 className="font-semibold">{t('app.yourOrder')}</h2>
        </CardHeader>
        <CardContent className="space-y-2">
          {order.items?.map((item) => (
            <div
              key={item.id}
              className="flex justify-between text-sm"
            >
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>${(item.unit_price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-semibold pt-2 border-t">
            <span>{t('app.total')}</span>
            <span>${order.total_amount.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
      <div className="mt-6 text-center">
        <Link to={ROUTES.menu}>
          <Button variant="outline">{t('app.backToMenu')}</Button>
        </Link>
      </div>
    </div>
  );
}
