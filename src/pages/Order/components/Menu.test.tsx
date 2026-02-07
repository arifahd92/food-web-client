import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

import { CartProvider } from '@/shared/contexts/cartContext';
import Menu from './Menu';

const mockMenuItems = [
  {
    id: '1',
    name: 'Pizza',
    description: 'Good',
    price: 12,
    image_url: 'https://example.com/pizza.jpg',
    created_at: new Date().toISOString(),
  },
];

vi.mock('@/shared/services/http.service', () => ({
  httpServices: {
    getData: vi.fn(() => Promise.resolve(mockMenuItems)),
  },
}));

function wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CartProvider>{children}</CartProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

describe('Menu', () => {
  it('renders menu list when data is loaded', async () => {
    render(<Menu />, { wrapper });
    const list = await screen.findByTestId('menu-list');
    expect(list).toBeInTheDocument();
    expect(screen.getByText('Pizza')).toBeInTheDocument();
    expect(screen.getByText('Add to Cart')).toBeInTheDocument();
  });
});
