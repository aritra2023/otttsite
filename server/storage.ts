import { type User, type InsertUser, type Product, type InsertProduct, type CustomPricingOption, type PasswordResetOtp, type InsertPasswordResetOtp } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPassword(id: string, password: string): Promise<boolean>;
  
  getProducts(): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  
  createPasswordResetOtp(otp: InsertPasswordResetOtp): Promise<PasswordResetOtp>;
  getPasswordResetOtp(id: string): Promise<PasswordResetOtp | undefined>;
  verifyPasswordResetOtp(id: string): Promise<boolean>;
  cleanupExpiredOtps(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private otps: Map<string, PasswordResetOtp>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.otps = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async updateUserPassword(id: string, password: string): Promise<boolean> {
    const user = this.users.get(id);
    if (!user) return false;
    this.users.set(id, { ...user, password });
    return true;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category === category,
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const customOptions: CustomPricingOption[] = (insertProduct.customOptions ?? []) as CustomPricingOption[];
    const product: Product = { 
      ...insertProduct,
      id,
      inStock1Month: insertProduct.inStock1Month ?? true,
      inStock3Month: insertProduct.inStock3Month ?? true,
      inStock6Month: insertProduct.inStock6Month ?? true,
      inStock12Month: insertProduct.inStock12Month ?? true,
      customOptions,
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const customOptions = updates.customOptions !== undefined 
      ? (updates.customOptions as CustomPricingOption[])
      : product.customOptions;
    
    const updatedProduct: Product = { ...product, ...updates, customOptions };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<boolean> {
    return this.products.delete(id);
  }

  async createPasswordResetOtp(insertOtp: InsertPasswordResetOtp): Promise<PasswordResetOtp> {
    const id = randomUUID();
    const otp: PasswordResetOtp = { ...insertOtp, id };
    this.otps.set(id, otp);
    return otp;
  }

  async getPasswordResetOtp(id: string): Promise<PasswordResetOtp | undefined> {
    return this.otps.get(id);
  }

  async verifyPasswordResetOtp(id: string): Promise<boolean> {
    const otp = this.otps.get(id);
    if (!otp) return false;
    this.otps.set(id, { ...otp, verified: true });
    return true;
  }

  async cleanupExpiredOtps(): Promise<void> {
    const now = Date.now();
    Array.from(this.otps.entries()).forEach(([id, otp]) => {
      if (otp.expiresAt < now) {
        this.otps.delete(id);
      }
    });
  }
}

import { MongoStorage } from "./mongo-storage";

const mongoStorage = new MongoStorage();
mongoStorage.connect().catch(console.error);

export const storage = mongoStorage;
