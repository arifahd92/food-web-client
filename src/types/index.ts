export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  created_at: string;
}

export type OrderStatus =
  | 'order_received'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered';

export interface OrderItemRow {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  unit_price: number;
  name?: string;
  image_url?: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_address: string;
  customer_phone: string;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  updated_at: string;
  items?: OrderItemRow[];
}

export interface CartItem {
  menu_item_id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  quantity: number;
}
