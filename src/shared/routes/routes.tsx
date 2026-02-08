import { Navigate, Outlet } from 'react-router-dom';

import PublicLayout from '@/layouts/PublicLayout';
import Menu from '@/pages/Order/components/Menu';
import Cart from '@/pages/Order/components/Cart';
import Checkout from '@/pages/Order/components/Checkout';
import OrderStatus from '@/pages/Order/components/OrderStatus';
// import AdminOrders from '@/pages/Admin/AdminOrders'; // Deprecated/Unused?
import MyOrders from '@/pages/Orders/MyOrders';
import NotFound from '@/pages/NotFound';
// import AdminLogin from '@/pages/AdminLogin'; // Replaced by RoleSelection
import AdminDashboard from '@/pages/AdminDashboard'; // This will be the main Admin view
import RoleSelection from '@/pages/RoleSelection';
import { useUser } from '@/shared/contexts/UserContext';

const BuyerRoute = () => {
  const { role } = useUser();
  if (role === 'SELLER') return <Navigate to="/admin/orders" replace />;
  if (!role) return <Navigate to="/" replace />;
  return <Outlet />;
};

const SellerRoute = () => {
  const { role } = useUser();
  if (role === 'BUYER') return <Navigate to="/menu" replace />;
  if (!role) return <Navigate to="/" replace />;
  return <Outlet />;
};

export const APP_ROUTES = [
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <RoleSelection /> },
      
      // Buyer Routes
      {
        element: <BuyerRoute />,
        children: [
          { path: 'menu', element: <Menu /> },
          { path: 'cart', element: <Cart /> },
          { path: 'checkout', element: <Checkout /> },
          { path: 'orders', element: <MyOrders /> },
          { path: 'order/:orderId', element: <OrderStatus /> },
        ],
      },

      // Seller Routes
      {
        path: 'admin',
        element: <SellerRoute />,
        children: [
          { path: 'orders', element: <AdminDashboard /> },
          // Redirect /admin to /admin/orders
          { index: true, element: <Navigate to="orders" replace /> },
        ],
      },
    ],
  },
  { path: '/404', element: <NotFound /> },
  { path: '*', element: <Navigate to="/404" replace /> },
];
