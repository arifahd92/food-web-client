import { useInfiniteQuery } from '@tanstack/react-query';
import { apiService } from '@/shared/services/api.service';
import type { PaginatedOrderResponse } from '@/shared/services/api.service';
import { useOrderStream } from '@/hooks/useOrderStream';
import { Button } from '@/components/ui/button';

const STATUS_LABELS: Record<string, string> = {
  RECEIVED: 'Order Received',
  PREPARING: 'Preparing',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
};

const AdminDashboard = () => {
  // Enable real-time updates
  useOrderStream();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error
  } = useInfiniteQuery({
    queryKey: ['admin', 'orders'],
    queryFn: ({ pageParam }) => apiService.getAdminOrders(10, pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage: PaginatedOrderResponse) => lastPage.nextCursor || undefined,
  });

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await apiService.updateOrderStatus(orderId, newStatus);
      // No need to manually update state, the socket event will trigger invalidation
    } catch (error) {
      console.error('Error updating status:', error);
      alert(`Failed to update status: ${(error as Error).message}`);
    }
  };

  const orders = data?.pages.flatMap((page: PaginatedOrderResponse) => page.items) || [];

  if (isLoading) return <div className="p-8">Loading orders...</div>;
  if (isError) return <div className="p-8 text-red-500">Error: {(error as Error).message}</div>;

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
                <td className="py-2 px-4 border-b text-sm font-mono">{order.id}</td>
                <td className="py-2 px-4 border-b">
                  {order.customer_name}
                  <br/>
                  <span className="text-xs text-gray-500">{order.customer_email}</span>
                </td>
                <td className="py-2 px-4 border-b">${(order.total_amount || 0).toFixed(2)}</td>
                <td className="py-2 px-4 border-b">
                  <span className="px-2 py-1 rounded bg-gray-100 text-sm">
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                </td>
                <td className="py-2 px-4 border-b">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="p-1 border rounded"
                  >
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="flex justify-center gap-4 py-4">
          {hasNextPage && (
            <Button 
              onClick={() => fetchNextPage()} 
              disabled={isFetchingNextPage}
            >
                {isFetchingNextPage ? 'Loading more...' : 'Load More'}
            </Button>
          )}
      </div>
    </div>
  );
};

export default AdminDashboard;
