import { io, Socket } from 'socket.io-client';

const SOCKET_URL = 'http://16.170.17.138:3000';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    if (!this.socket) {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket'],
        autoConnect: true,
      });

      this.socket.on('connect', () => {
        console.log('Connected to socket server:', this.socket?.id);
      });

      this.socket.on('disconnect', () => {
        console.log('Disconnected from socket server');
      });
    }
  }

  joinOrderRoom(orderId: string) {
    if (this.socket) {
      this.socket.emit('joinOrderRoom', orderId);
    }
  }

  onOrderStatusUpdate(callback: (data: { orderId: string; status: string }) => void) {
    if (this.socket) {
      this.socket.on('orderStatusUpdated', callback);
    }
  }

  offOrderStatusUpdate() {
    if (this.socket) {
      this.socket.off('orderStatusUpdated');
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }
}

export const socketService = new SocketService();
