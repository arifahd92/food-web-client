import { httpServices } from './http.service';
import { reqUrl } from './reqUrl.service';

// Simple UUID generator to avoid external dependency
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export interface MenuItem {
    id: string;
    _id: string;
    name: string;
    description: string;
    price: number;
    image_url: string;
    category: string;
    available: boolean;
}

export interface OrderItem {
    menu_item_id: string;
    quantity: number;
}

export interface CreateOrderPayload {
    customer_name: string;
    customer_address: string;
    customer_phone: string;
    customer_email: string;
    items: OrderItem[];
}

export interface OrderResponse {
    id: string;
    customer_name: string;
    customer_address: string;
    customer_phone: string;
    customer_email: string;
    status: 'RECEIVED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
    total_amount: number;
    created_at: string;
    updated_at: string;
    items: {
        id: string;
        menu_item_id: string;
        name: string;
        image_url: string;
        quantity: number;
        unit_price: number;
    }[];
}

export interface PaginatedOrderResponse {
    items: OrderResponse[];
    nextCursor: string | null;
    limit: number;
}

export const apiService = {
    getMenu: async () => {
        return httpServices.getData<MenuItem[]>(reqUrl.menu);
    },

    createOrder: (payload: CreateOrderPayload) => {
        const idempotencyKey = generateUUID();
        return httpServices.postData<OrderResponse>(reqUrl.orders, payload, {
            headers: { 'Idempotency-Key': idempotencyKey },
        });
    },

    getMyOrders: (email: string) => {
        return httpServices.getData<OrderResponse[]>(reqUrl.orders, {
            params: { email },
        });
    },

    getAdminOrders: (limit = 10, cursor?: string) => {
        return httpServices.getData<PaginatedOrderResponse>(reqUrl.ordersAdmin, {
            params: { limit, cursor },
        });
    },

    getOrderById: (id: string) => httpServices.getData<OrderResponse>(reqUrl.orderById(id)),

    updateOrderStatus: (id: string, status: string) => {
        return httpServices.patchData<OrderResponse>(reqUrl.orderStatus(id), { status }, {
            headers: {
                'x-admin-id': 'admin',
                'x-admin-password': 'admin123',
            }
        });
    },
};
