// Mock data aligned with Prisma schema

// Mock users data aligned with Prisma User model
export const mockUsers = [
  {
    id: "1",
    role: "admin",
    fullName: "Admin User",
    email: "admin@ustp.edu.ph",
    passwordHash: "hashed_password",
    contact: "+63 912 345 6777",
    studentId: null,
    emailVerified: true,
    verificationCode: null,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    role: "staff",
    fullName: "John Doe",
    email: "john@ustp.edu.ph",
    passwordHash: "hashed_password",
    contact: "+63 912 345 6789",
    studentId: null,
    emailVerified: false,
    verificationCode: "1234",
    createdAt: "2024-01-02T00:00:00Z",
  },
];

// Mock orders data aligned with Prisma Order model
export const mockOrders = [
  {
    id: "ORD-001",
    userId: "user-001",
    status: "pending",
    pickupType: "dine_in",
    pickupTime: "2024-01-15T15:15:00Z",
    totalPrice: 145.0,
    paymentStatus: "pending",
    createdAt: "2024-01-15T15:00:00Z",
    user: {
      fullName: "Jennie Kim",
      studentId: "2023300123",
    },
    orderItems: [
      { 
        id: "item-001",
        item: { name: "Chicken Adobo" },
        quantity: 1, 
        priceAtOrder: 85.0 
      },
      { 
        id: "item-002",
        item: { name: "Rice" },
        quantity: 1, 
        priceAtOrder: 15.0 
      },
      { 
        id: "item-003",
        item: { name: "Lumpia" },
        quantity: 1, 
        priceAtOrder: 45.0 
      },
    ],
  },
  {
    id: "ORD-002",
    userId: "user-002",
    status: "pending",
    pickupType: "take_out",
    pickupTime: "2024-01-15T15:15:00Z",
    totalPrice: 145.0,
    paymentStatus: "pending",
    createdAt: "2024-01-15T15:00:00Z",
    user: {
      fullName: "Maria Santos",
      studentId: "2023300124",
    },
    orderItems: [
      { 
        id: "item-004",
        item: { name: "Chicken Adobo" },
        quantity: 1, 
        priceAtOrder: 85.0 
      },
      { 
        id: "item-005",
        item: { name: "Rice" },
        quantity: 1, 
        priceAtOrder: 15.0 
      },
      { 
        id: "item-006",
        item: { name: "Lumpia" },
        quantity: 1, 
        priceAtOrder: 45.0 
      },
    ],
  },
  {
    id: "ORD-003",
    userId: "user-003",
    status: "preparing",
    pickupType: "dine_in",
    pickupTime: "2024-01-15T15:30:00Z",
    totalPrice: 110.0,
    paymentStatus: "cash_on_pickup",
    createdAt: "2024-01-15T15:10:00Z",
    user: {
      fullName: "Juan Dela Cruz",
      studentId: "2023300125",
    },
    orderItems: [
      { 
        id: "item-007",
        item: { name: "Beef Steak" },
        quantity: 1, 
        priceAtOrder: 95.0 
      },
      { 
        id: "item-008",
        item: { name: "Rice" },
        quantity: 1, 
        priceAtOrder: 15.0 
      },
    ],
  },
  {
    id: "ORD-004",
    userId: "user-004",
    status: "ready",
    pickupType: "take_out",
    pickupTime: "2024-01-15T15:45:00Z",
    totalPrice: 105.0,
    paymentStatus: "paid",
    createdAt: "2024-01-15T15:20:00Z",
    user: {
      fullName: "Ana Rodriguez",
      studentId: "2023300126",
    },
    orderItems: [
      { 
        id: "item-009",
        item: { name: "Pork Sisig" },
        quantity: 1, 
        priceAtOrder: 75.0 
      },
      { 
        id: "item-010",
        item: { name: "Rice" },
        quantity: 2, 
        priceAtOrder: 15.0 
      },
    ],
  },
];

// Mock API functions
export class MockApiService {
  static users = [...mockUsers];
  static orders = [...mockOrders];
  static currentUser: any = null;

  // User methods
  static async login(email, password) {
    await new Promise((resolve) => setTimeout(resolve, 500)); // Simulate API delay

    const user = {
      id: "1",
      role: "staff",
      fullName: "Demo User",
      email: email,
      passwordHash: "hashed_password",
      contact: "+63 912 345 6789",
      studentId: null,
      emailVerified: false,
      verificationCode: "1234",
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
      role: "staff",
      fullName: userData.fullName,
      email: userData.email,
      passwordHash: "hashed_password",
      contact: userData.contact || null,
      studentId: null,
      emailVerified: false,
      verificationCode: "1234",
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
