import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';
import { useParams } from 'react-router-dom';

const SOCKET_URL = 'https://cooperation-obvious-off-weekly.trycloudflare.com';

import { useUser } from '@/shared/contexts/UserContext';

export function useOrderStream() {
  const queryClient = useQueryClient();
  const { orderId } = useParams<{ orderId: string }>();
  const { role } = useUser();

  useEffect(() => {
    const socket: Socket = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      if (orderId) {
        socket.emit('joinOrderRoom', orderId);
      }
      if (role === 'SELLER') {
        socket.emit('joinAdminRoom');
      }
    });

    socket.on('orderStatusUpdated', (data: any) => {
      console.log('Order status updated:', data);
      queryClient.invalidateQueries({ queryKey: ['order', data.orderId] });
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
    });

    socket.on('orderUpdated', (data: any) => {
      console.log('Global order update:', data);
      // Invalidate admin orders list
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
      // Invalidate specific order if cached
      queryClient.invalidateQueries({ queryKey: ['order', data.orderId] });
      // Also invalidate my-orders for buyers
      queryClient.invalidateQueries({ queryKey: ['my-orders'] });
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient, orderId, role]);
}
