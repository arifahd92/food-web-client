/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { getData } from '@/shared/utils/helper';
import { CONSTANT } from '@/shared/utils/constant';
import { ROUTES } from '@/shared/utils/routes';

// const baseURL = 'http://localhost:3000';
const baseURL = 'http://16.170.17.138:3000';

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
  getData: <T>(url: string, config?: any) => instance.get<T>(url, config) as Promise<T>,
  postData: <T>(url: string, data: unknown, config?: any) =>
    instance.post<T>(url, data, config) as Promise<T>,
  putData: <T>(url: string, data: unknown, config?: any) =>
    instance.put<T>(url, data, config) as Promise<T>,
  patchData: <T>(url: string, data: unknown, config?: any) =>
    instance.patch<T>(url, data, config) as Promise<T>,
  deleteData: <T>(url: string, config?: any) => instance.delete<T>(url, config) as Promise<T>,
};
