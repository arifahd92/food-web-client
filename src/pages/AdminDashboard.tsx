import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const adminId = localStorage.getItem('adminId');
    const adminPassword = localStorage.getItem('adminPassword');

    if (!adminId || !adminPassword) {
      navigate('/admin/login');
      return;
    }

    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    const adminId = localStorage.getItem('adminId');
    const adminPassword = localStorage.getItem('adminPassword');
    try {
      await axios.patch(
        `http://localhost:3000/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            'x-admin-id': adminId,
            'x-admin-password': adminPassword,
          },
        }
      );
      fetchOrders(); // Refresh list
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Check credentials?');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="overflow-x-auto">
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
            {orders.map((order: any) => (
              <tr key={order.id} className="text-center">
                <td className="py-2 px-4 border-b">{order.id}</td>
                <td className="py-2 px-4 border-b">{order.customer_name}</td>
                <td className="py-2 px-4 border-b">${order.total_amount}</td>
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
    </div>
  );
};

export default AdminDashboard;
