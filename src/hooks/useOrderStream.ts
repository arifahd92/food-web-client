import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { io, Socket } from 'socket.io-client';
import { useParams } from 'react-router-dom';

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export function useOrderStream() {
  const queryClient = useQueryClient();
  const { orderId } = useParams<{ orderId: string }>();

  useEffect(() => {
    const socket: Socket = io(SOCKET_URL);

    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      if (orderId) {
        socket.emit('joinOrderRoom', orderId);
      }
    });

    socket.on('orderStatusUpdated', (data: any) => {
      console.log('Order status updated:', data);
      queryClient.invalidateQueries({ queryKey: ['order', data.orderId] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] });
    });

    return () => {
      socket.disconnect();
    };
  }, [queryClient, orderId]);
}
