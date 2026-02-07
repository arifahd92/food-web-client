import { BrowserRouter, useRoutes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { CartProvider } from '@/shared/contexts/cartContext';
import { PUBLIC_ROUTES } from '@/shared/routes';

import './i18n/i18n';

const queryClient = new QueryClient();

function AppRoutes() {
  return useRoutes(PUBLIC_ROUTES);
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CartProvider>
          <AppRoutes />
        </CartProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
