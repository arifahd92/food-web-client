export const ROUTES = {
  home: '/',
  menu: '/',
  cart: '/cart',
  checkout: '/checkout',
  orderStatus: '/order/:orderId',
  orderStatusBase: '/order',
  orders: '/orders',
  admin: '/admin',
} as const;

export function orderStatusPath(orderId: string): string {
  return `/order/${orderId}`;
}
