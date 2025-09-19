import { users, type User, type InsertUser, type Order, type InsertOrder } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import { nanoid } from "nanoid";
import crypto from "crypto";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByStaffId(staffId: string): Promise<User | undefined>;
  createUser(user: Omit<InsertUser, 'confirmPassword'>): Promise<User>;
  getOrders(): Promise<Order[]>;
  getOrder(id: string): Promise<Order | undefined>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined>;
  deleteOrder(id: string): Promise<boolean>;
  sessionStore: any;
}

export class DatabaseStorage implements IStorage {
  sessionStore: any;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true 
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByStaffId(staffId: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.staffId, staffId));
    return user || undefined;
  }

  async createUser(insertUser: Omit<InsertUser, 'confirmPassword'>): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getOrders(): Promise<Order[]> {
    throw new Error("Method not implemented for database storage");
  }

  async getOrder(id: string): Promise<Order | undefined> {
    throw new Error("Method not implemented for database storage");
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    throw new Error("Method not implemented for database storage");
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined> {
    throw new Error("Method not implemented for database storage");
  }

  async deleteOrder(id: string): Promise<boolean> {
    throw new Error("Method not implemented for database storage");
  }
}

// Memory Storage for mock development
export class MemoryStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private orders: Map<string, Order> = new Map();
  sessionStore: any;

  constructor() {
    // Simple memory-based session store for development
    this.sessionStore = new session.MemoryStore();
    this.initializeMockData();
  }

  private initializeMockData() {
    // Add mock users
    const mockUser: User = {
      id: "user-1",
      fullname: "John Doe",
      staffId: "STAFF001",
      email: "admin@ustp.edu.ph",
      password: "password123", // In real app, this would be hashed
      createdAt: new Date(),
    };
    this.users.set(mockUser.id, mockUser);

    // Add mock orders
    const mockOrders: Order[] = [
      {
        id: "ORD-001",
        studentName: "Jennie Kim",
        studentId: "2023300123",
        items: [
          { name: "Chicken Adobo xl", quantity: 1, price: 85.00 },
          { name: "Rice xl", quantity: 1, price: 15.00 },
          { name: "Summit xl", quantity: 1, price: 45.00 }
        ],
        total: 145.00,
        status: "Pending",
        pickupTime: "3:30 PM",
        orderTime: "3:00 PM",
        paymentMethod: "G-Cash"
      },
      {
        id: "ORD-002",
        studentName: "Jennie Kim",
        studentId: "2023300123",
        items: [
          { name: "Chicken Adobo xl", quantity: 1, price: 85.00 },
          { name: "Rice xl", quantity: 1, price: 15.00 },
          { name: "Summit xl", quantity: 1, price: 45.00 }
        ],
        total: 145.00,
        status: "Pending",
        pickupTime: "3:30 PM",
        orderTime: "3:00 PM",
        paymentMethod: "G-Cash"
      }
    ];

    mockOrders.forEach(order => this.orders.set(order.id, order));
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    for (const user of Array.from(this.users.values())) {
      if (user.email === email) return user;
    }
    return undefined;
  }

  async getUserByStaffId(staffId: string): Promise<User | undefined> {
    for (const user of Array.from(this.users.values())) {
      if (user.staffId === staffId) return user;
    }
    return undefined;
  }

  async createUser(insertUser: Omit<InsertUser, 'confirmPassword'>): Promise<User> {
    const user: User = {
      id: nanoid(),
      ...insertUser,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const order: Order = {
      id: `ORD-${String(this.orders.size + 1).padStart(3, '0')}`,
      ...insertOrder,
      orderTime: new Date().toLocaleTimeString(),
    };
    this.orders.set(order.id, order);
    return order;
  }

  async updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, ...updates };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  async deleteOrder(id: string): Promise<boolean> {
    return this.orders.delete(id);
  }
}

// Use DatabaseStorage for production with PostgreSQL
export const storage = new DatabaseStorage();
