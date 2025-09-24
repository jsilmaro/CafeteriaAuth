import { User, Order, InsertUser, InsertOrder } from '../types/schema';

// Mock users data
export const mockUsers: User[] = [
  {
    id: "1",
    fullname: "Admin User",
    staffId: "STAFF001",
    email: "admin@ustp.edu.ph",
    createdAt: "2024-01-01T00:00:00Z"
  },
  {
    id: "2", 
    fullname: "John Doe",
    staffId: "STAFF002",
    email: "john@ustp.edu.ph",
    createdAt: "2024-01-02T00:00:00Z"
  }
];

// Mock orders data
export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    studentName: "Jennie Kim",
    studentId: "2023300123",
    items: [
      { name: "Chicken Adobo", quantity: 1, price: 85.00 },
      { name: "Rice", quantity: 1, price: 15.00 },
      { name: "Lumpia", quantity: 1, price: 45.00 }
    ],
    total: 145.00,
    status: "Pending",
    pickupTime: "3:15 PM",
    orderTime: "3:00 PM",
    paymentMethod: "G-Cash"
  },
  {
    id: "ORD-002",
    studentName: "Maria Santos",
    studentId: "2023300124",
    items: [
      { name: "Chicken Adobo", quantity: 1, price: 85.00 },
      { name: "Rice", quantity: 1, price: 15.00 },
      { name: "Lumpia", quantity: 1, price: 45.00 }
    ],
    total: 145.00,
    status: "Pending",
    pickupTime: "3:15 PM",
    orderTime: "3:00 PM",
    paymentMethod: "G-Cash"
  },
  {
    id: "ORD-003",
    studentName: "Juan Dela Cruz",
    studentId: "2023300125",
    items: [
      { name: "Beef Steak", quantity: 1, price: 95.00 },
      { name: "Rice", quantity: 1, price: 15.00 }
    ],
    total: 110.00,
    status: "Preparing",
    pickupTime: "3:30 PM",
    orderTime: "3:10 PM",
    paymentMethod: "Cash"
  },
  {
    id: "ORD-004",
    studentName: "Ana Rodriguez",
    studentId: "2023300126",
    items: [
      { name: "Pork Sisig", quantity: 1, price: 75.00 },
      { name: "Rice", quantity: 2, price: 30.00 }
    ],
    total: 105.00,
    status: "Ready",
    pickupTime: "3:45 PM",
    orderTime: "3:20 PM",
    paymentMethod: "G-Cash"
  }
];

// Mock API functions
export class MockApiService {
  private static users = [...mockUsers];
  private static orders = [...mockOrders];
  private static currentUser: User | null = null;

  // User methods
  static async login(email: string, password: string): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    // For demo purposes, accept any email/password combination
    // In a real app, you'd verify credentials against the database
    const user: User = {
      id: "1",
      fullname: "Demo User",
      staffId: "STAFF001", 
      email: email,
      createdAt: new Date().toISOString()
    };
    
    // Store the current user
    this.currentUser = user;
    return user;
  }

  static async register(userData: InsertUser): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    const existingUser = this.users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    const newUser: User = {
      id: String(this.users.length + 1),
      fullname: userData.fullname,
      staffId: userData.staffId,
      email: userData.email,
      createdAt: new Date().toISOString()
    };

    this.users.push(newUser);
    // Store the current user
    this.currentUser = newUser;
    return newUser;
  }

  static async getCurrentUser(): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
    
    // In a real app, this would check the session/token
    // Return the currently logged in user
    return this.currentUser;
  }

  static async logout(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
    // Clear the current user
    this.currentUser = null;
  }

  // Order methods
  static async getOrders(): Promise<Order[]> {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
    return [...this.orders];
  }

  static async updateOrder(id: string, updates: Partial<Order>): Promise<Order> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    const orderIndex = this.orders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      throw new Error(`Order with id ${id} not found`);
    }

    this.orders[orderIndex] = { ...this.orders[orderIndex], ...updates };
    return this.orders[orderIndex];
  }

  static async deleteOrder(id: string): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    const orderIndex = this.orders.findIndex(o => o.id === id);
    if (orderIndex === -1) {
      throw new Error(`Order with id ${id} not found`);
    }

    this.orders.splice(orderIndex, 1);
  }

  static async createOrder(orderData: InsertOrder): Promise<Order> {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
    
    const newOrder: Order = {
      ...orderData,
      id: `ORD-${String(this.orders.length + 1).padStart(3, '0')}`,
    };

    this.orders.push(newOrder);
    return newOrder;
  }
}
