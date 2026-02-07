import axios from 'axios';
import { getData } from '@/shared/utils/helper';
import { CONSTANT } from '@/shared/utils/constant';
import { ROUTES } from '@/shared/utils/routes';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? '';

const instance = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

instance.interceptors.request.use((config) => {
  const token = getData<string>(CONSTANT.ACCESS_TOKEN);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

instance.interceptors.response.use(
  (response) => response?.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(CONSTANT.ACCESS_TOKEN);
      window.location.href = ROUTES.home;
    }
    return Promise.reject(error);
  }
);

export const httpServices = {
  getData: <T>(url: string) => instance.get<T>(url) as Promise<T>,
  postData: <T>(url: string, data: unknown) =>
    instance.post<T>(url, data) as Promise<T>,
  putData: <T>(url: string, data: unknown) =>
    instance.put<T>(url, data) as Promise<T>,
  patchData: <T>(url: string, data: unknown) =>
    instance.patch<T>(url, data) as Promise<T>,
  deleteData: <T>(url: string) => instance.delete<T>(url) as Promise<T>,
};
