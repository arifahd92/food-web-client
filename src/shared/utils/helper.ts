import { CONSTANT } from '@/shared/utils/constant';

export function getData<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  } catch {
    return null;
  }
}

export function setData<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeData(key: string): void {
  localStorage.removeItem(key);
}

export function getOrderHistoryIds(): string[] {
  return getData<string[]>(CONSTANT.ORDER_HISTORY) ?? [];
}

export function addOrderToHistory(orderId: string): void {
  const ids = getOrderHistoryIds();
  const next = [orderId, ...ids.filter((id) => id !== orderId)].slice(0, 50);
  setData(CONSTANT.ORDER_HISTORY, next);
}
