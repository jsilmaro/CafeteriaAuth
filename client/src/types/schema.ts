import { z } from "zod";

// User schemas
export const insertUserSchema = z.object({
  fullname: z.string().min(1, "Full name is required"),
  staffId: z.string().min(1, "Staff ID is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// Order schemas
export const orderStatusEnum = z.enum(['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled']);

export const orderItemSchema = z.object({
  name: z.string(),
  quantity: z.number().min(1),
  price: z.number().min(0),
});

export const orderSchema = z.object({
  id: z.string(),
  studentName: z.string(),
  studentId: z.string(),
  items: z.array(orderItemSchema),
  total: z.number().min(0),
  status: orderStatusEnum,
  pickupTime: z.string().optional(),
  orderTime: z.string().optional(),
  paymentMethod: z.string().default('G-Cash'),
});

export const insertOrderSchema = orderSchema.omit({ id: true });

// Type exports
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = {
  id: string;
  fullname: string;
  staffId: string;
  email: string;
  createdAt: string;
};
export type LoginData = z.infer<typeof loginSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type Order = z.infer<typeof orderSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderStatus = z.infer<typeof orderStatusEnum>;
