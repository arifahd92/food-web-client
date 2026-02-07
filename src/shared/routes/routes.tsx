import { Navigate } from 'react-router-dom';

import PublicLayout from '@/layouts/PublicLayout';
import Menu from '@/pages/Order/components/Menu';
import Cart from '@/pages/Order/components/Cart';
import Checkout from '@/pages/Order/components/Checkout';
import OrderStatus from '@/pages/Order/components/OrderStatus';
import AdminOrders from '@/pages/Admin/AdminOrders';
import MyOrders from '@/pages/Orders/MyOrders';
import NotFound from '@/pages/NotFound';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';

export const PUBLIC_ROUTES = [
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <Menu /> },
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <Checkout /> },
      { path: 'orders', element: <MyOrders /> },
      { path: 'order/:orderId', element: <OrderStatus /> },
      { path: 'admin', element: <AdminOrders /> },
      { path: 'admin/login', element: <AdminLogin /> },
      { path: 'admin/dashboard', element: <AdminDashboard /> },
    ],
  },
  { path: '/404', element: <NotFound /> },
  { path: '*', element: <Navigate to="/404" replace /> },
];
