const API = '/api';

export const reqUrl = {
  menu: `${API}/menu`,
  orders: `${API}/orders`,
  orderById: (id: string) => `${API}/orders/${id}`,
  orderStatus: (id: string) => `${API}/orders/${id}/status`,
} as const;
