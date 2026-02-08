import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { httpServices } from '@/shared/services/http.service';
import { Button } from '@/components/ui/button';
import type { Order } from '@/types';

interface PaginatedResponse {
  data: Order[];
  meta: {
    nextCursor: string | null;
    limit: number;
    hasMore: boolean;
  };
}

const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const adminId = localStorage.getItem('adminId');
    const adminPassword = localStorage.getItem('adminPassword');

    if (!adminId || !adminPassword) {
      navigate('/admin/login');
      return;
    }

    // Initial fetch
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchOrders = async (cursor?: string) => {
    setIsLoading(true);
    const adminId = localStorage.getItem('adminId');
    const adminPassword = localStorage.getItem('adminPassword');

    try {
      const url = cursor 
        ? `/api/orders/admin?limit=10&cursor=${cursor}`
        : `/api/orders/admin?limit=10`;

      const response = await httpServices.getData<PaginatedResponse>(
         url,
         {
           headers: {
             'x-admin-id': adminId,
             'x-admin-password': adminPassword,
           }
         }
      );

      if (cursor) {
        setOrders((prev) => [...prev, ...response.data]);
      } else {
        setOrders(response.data);
      }
      
      setNextCursor(response.meta.nextCursor);
      setHasMore(response.meta.hasMore);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadMore = () => {
    if (nextCursor) {
      fetchOrders(nextCursor);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    const adminId = localStorage.getItem('adminId');
    const adminPassword = localStorage.getItem('adminPassword');
    try {
      await httpServices.patchData(
        `/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            'x-admin-id': adminId,
            'x-admin-password': adminPassword,
          },
        }
      );
      
      // Update local state without refetching all
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status: newStatus as any } : o
      ));
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Check credentials?');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="overflow-x-auto mb-4">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Order ID</th>
              <th className="py-2 px-4 border-b">Customer</th>
              <th className="py-2 px-4 border-b">Total</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="text-center">
                <td className="py-2 px-4 border-b">{order.id}</td>
                <td className="py-2 px-4 border-b">{order.customer_name}</td>
                <td className="py-2 px-4 border-b">${order.total_amount.toFixed(2)}</td>
                <td className="py-2 px-4 border-b capitalize">{order.status.replace('_', ' ')}</td>
                <td className="py-2 px-4 border-b">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="p-1 border rounded"
                  >
                    <option value="order_received">Order Received</option>
                    <option value="preparing">Preparing</option>
                    <option value="out_for_delivery">Out for Delivery</option>
                    <option value="delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {hasMore && (
        <div className="flex justify-center">
          <Button onClick={handleLoadMore} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Load More'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
