import { BrowserRouter, useRoutes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { CartProvider } from '@/shared/contexts/cartContext';
import { UserProvider } from '@/shared/contexts/UserContext';
import { APP_ROUTES } from '@/shared/routes';

import './i18n/i18n';

const queryClient = new QueryClient();

function AppRoutes() {
  return useRoutes(APP_ROUTES);
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <UserProvider>
        <BrowserRouter>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </BrowserRouter>
      </UserProvider>
    </QueryClientProvider>
  );
}
