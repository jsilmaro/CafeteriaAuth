import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, decimal, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullname: text("fullname").notNull(),
  staffId: varchar("staff_id", { length: 10 }).notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  fullname: true,
  staffId: true,
  email: true,
  password: true,
}).extend({
  confirmPassword: z.string().min(1, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
});

export const forgotPasswordSchema = createInsertSchema(users).pick({
  email: true,
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

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type LoginData = z.infer<typeof loginSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type Order = z.infer<typeof orderSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type OrderStatus = z.infer<typeof orderStatusEnum>;
