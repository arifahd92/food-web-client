import axios from 'axios';

// Assuming backend runs on port 3000 locally
const API_URL = 'https://cooperation-obvious-off-weekly.trycloudflare.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
}


export interface OrderItem {
  menu_item_id: string;
  quantity: number;
}

export interface CreateOrderDto {
  customer_name: string;
  customer_address: string;
  customer_phone: string;
  items: OrderItem[];
  idempotency_key?: string;
}


export const OrderStatus = {
  OrderReceived: 'order_received',
  Preparing: 'preparing',
  OutForDelivery: 'out_for_delivery',
  Delivered: 'delivered',
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus];

export interface OrderResponse {
  id: string;
  status: string;
  total_amount: number;
  customer_name: string;
  items: {
    id: string;
    menu_item_id: string;
    name: string;
    quantity: number;
    unit_price: number;
    image_url?: string;
  }[];
  created_at: string;
  updated_at: string;
}

export const getMenu = async (): Promise<MenuItem[]> => {
  const response = await api.get<MenuItem[]>('/menu');
  return response.data;
};

export const createOrder = async (
  createOrderDto: CreateOrderDto,
): Promise<OrderResponse> => {
  const response = await api.post<OrderResponse>('/orders', createOrderDto);
  return response.data;
};

export const getOrder = async (orderId: string): Promise<OrderResponse> => {
  const response = await api.get<OrderResponse>(`/orders/${orderId}`);
  return response.data;
};

export default api;
