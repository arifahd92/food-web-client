import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';

import { apiService, type MenuItem } from '@/shared/services/api.service';
import { useCart } from '@/shared/contexts/cartContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Menu() {
  const { t } = useTranslation();
  const { addToCart } = useCart();

  const { data: items = [], isLoading, isError, error } = useQuery({
    queryKey: ['menu'],
    queryFn: apiService.getMenu,
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-testid="menu-loading">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-muted rounded-t-lg" />
            <CardHeader />
            <CardContent />
          </Card>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
        <p className="font-medium text-destructive">Failed to load menu</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Make sure the backend is running (e.g. <code className="rounded bg-muted px-1">cd back && npm run dev</code>) and
          MongoDB is up (e.g. <code className="rounded bg-muted px-1">docker compose up -d</code>).
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {(error as Error)?.message ?? 'Network or server error'}
        </p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">{t('app.menu')}</h1>
        <div className="rounded-lg border bg-muted/50 p-8 text-center">
          <p className="font-medium">No menu items yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Seed the database: in the <code className="rounded bg-muted px-1">back</code> folder run{' '}
            <code className="rounded bg-muted px-1">npm run db:seed</code> (with MongoDB and the backend env configured).
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">{t('app.menu')}</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3" data-testid="menu-list">
        {items.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="overflow-hidden">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <CardHeader className="pb-2">
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <span className="font-medium">${item.price.toFixed(2)}</span>
                <Button
                  size="sm"
                  onClick={() => addToCart(item.id)}
                  data-testid={`add-${item.id}`}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {t('app.addToCart')}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
