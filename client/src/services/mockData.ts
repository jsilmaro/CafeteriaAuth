import { User, Order, InsertUser, InsertOrder } from '../types/schema';

// Mock users data
export const mockUsers = [
  {
    id: "1",
    fullname: "Admin User",
    staffId: "STAFF001",
    email: "admin@ustp.edu.ph",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    fullname: "John Doe",
    staffId: "STAFF002",
    email: "john@ustp.edu.ph",
    createdAt: "2024-01-02T00:00:00Z",
  },
];

// Mock orders data
export const mockOrders = [
  {
    id: "ORD-001",
    studentName: "Jennie Kim",
    studentId: "2023300123",
    items: [
      { name: "Chicken Adobo", quantity: 1, price: 85.0 },
      { name: "Rice", quantity: 1, price: 15.0 },
      { name: "Lumpia", quantity: 1, price: 45.0 },
    ],
    total: 145.0,
    status: "Pending",
    pickupTime: "3:15 PM",
    orderTime: "3:00 PM",
    paymentMethod: "G-Cash",
  },
  {
    id: "ORD-002",
    studentName: "Maria Santos",
    studentId: "2023300124",
    items: [
      { name: "Chicken Adobo", quantity: 1, price: 85.0 },
      { name: "Rice", quantity: 1, price: 15.0 },
      { name: "Lumpia", quantity: 1, price: 45.0 },
    ],
    total: 145.0,
    status: "Pending",
    pickupTime: "3:15 PM",
    orderTime: "3:00 PM",
    paymentMethod: "G-Cash",
  },
  {
    id: "ORD-003",
    studentName: "Juan Dela Cruz",
    studentId: "2023300125",
    items: [
      { name: "Beef Steak", quantity: 1, price: 95.0 },
      { name: "Rice", quantity: 1, price: 15.0 },
    ],
    total: 110.0,
    status: "Preparing",
    pickupTime: "3:30 PM",
    orderTime: "3:10 PM",
    paymentMethod: "Cash",
  },
  {
    id: "ORD-004",
    studentName: "Ana Rodriguez",
    studentId: "2023300126",
    items: [
      { name: "Pork Sisig", quantity: 1, price: 75.0 },
      { name: "Rice", quantity: 2, price: 30.0 },
    ],
    total: 105.0,
    status: "Ready",
    pickupTime: "3:45 PM",
    orderTime: "3:20 PM",
    paymentMethod: "G-Cash",
  },
];

// Mock API functions
export class MockApiService {
  static users = [...mockUsers];
  static orders = [...mockOrders];
  static currentUser = null;

  // User methods
  static async login(email, password) {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

    const user = {
      id: "1",
      fullname: "Demo User",
      staffId: "STAFF001",
      email: email,
      createdAt: new Date().toISOString(),
    };

    this.currentUser = user;
    return user;
  }

  static async register(userData) {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

    const existingUser = this.users.find((u) => u.email === userData.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const newUser = {
      id: String(this.users.length + 1),
      fullname: userData.fullname,
      staffId: userData.staffId,
      email: userData.email,
      createdAt: new Date().toISOString(),
    };

    this.users.push(newUser);
    this.currentUser = newUser;
    return newUser;
  }

  static async getCurrentUser() {
    await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate API delay
    return this.currentUser;
  }

  static async logout() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    this.currentUser = null;
  }

  // Order methods
  static async getOrders() {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return [...this.orders];
  }

  static async updateOrder(id, updates) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const orderIndex = this.orders.findIndex((o) => o.id === id);
    if (orderIndex === -1) {
      throw new Error(`Order with id ${id} not found`);
    }

    this.orders[orderIndex] = { ...this.orders[orderIndex], ...updates };
    return this.orders[orderIndex];
  }

  static async deleteOrder(id) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const orderIndex = this.orders.findIndex((o) => o.id === id);
    if (orderIndex === -1) {
      throw new Error(`Order with id ${id} not found`);
    }

    this.orders.splice(orderIndex, 1);
  }

  static async createOrder(orderData) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newOrder = {
      ...orderData,
      id: `ORD-${String(this.orders.length + 1).padStart(3, "0")}`,
    };

    this.orders.push(newOrder);
    return newOrder;
  }
}
