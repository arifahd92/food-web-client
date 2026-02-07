import { z } from 'zod';

export const checkoutSchema = z.object({
  customer_name: z.string().min(1, 'Name is required').max(255),
  customer_address: z.string().min(1, 'Address is required'),
  customer_phone: z.string().min(1, 'Phone is required').max(50),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const defaultCheckoutValues: CheckoutFormData = {
  customer_name: '',
  customer_address: '',
  customer_phone: '',
};
