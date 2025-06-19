import { db } from "./db";
import { users, plans, subscriptions, botConfigs, type User, type Plan, type Subscription, type BotConfig, type InsertUser, type InsertPlan, type InsertSubscription, type InsertBotConfig } from "../shared/schema";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";

export interface IStorage {
  // User operations
  createUser(user: InsertUser): Promise<User>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserById(id: number): Promise<User | undefined>;
  verifyPassword(email: string, password: string): Promise<User | undefined>;
  
  // Plan operations
  getPlans(): Promise<Plan[]>;
  getPlanById(id: number): Promise<Plan | undefined>;
  createPlan(plan: InsertPlan): Promise<Plan>;
  
  // Subscription operations
  getUserSubscriptions(userId: number): Promise<Subscription[]>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  getSubscriptionById(id: number): Promise<Subscription | undefined>;
  
  // Bot Config operations
  getBotConfigs(userId: number): Promise<BotConfig[]>;
  createBotConfig(config: InsertBotConfig): Promise<BotConfig>;
  updateBotConfig(id: number, config: Partial<BotConfig>): Promise<BotConfig>;
  deleteBotConfig(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async createUser(userData: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const [user] = await db
      .insert(users)
      .values({ ...userData, password: hashedPassword })
      .returning();
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async getUserById(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async verifyPassword(email: string, password: string): Promise<User | undefined> {
    const user = await this.getUserByEmail(email);
    if (!user) return undefined;
    
    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : undefined;
  }

  async getPlans(): Promise<Plan[]> {
    return await db.select().from(plans).where(eq(plans.isActive, true));
  }

  async getPlanById(id: number): Promise<Plan | undefined> {
    const [plan] = await db.select().from(plans).where(eq(plans.id, id));
    return plan;
  }

  async createPlan(planData: InsertPlan): Promise<Plan> {
    const [plan] = await db.insert(plans).values(planData).returning();
    return plan;
  }

  async getUserSubscriptions(userId: number): Promise<Subscription[]> {
    return await db.select().from(subscriptions).where(eq(subscriptions.userId, userId));
  }

  async createSubscription(subscriptionData: InsertSubscription): Promise<Subscription> {
    const [subscription] = await db.insert(subscriptions).values(subscriptionData).returning();
    return subscription;
  }

  async getSubscriptionById(id: number): Promise<Subscription | undefined> {
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.id, id));
    return subscription;
  }

  async getBotConfigs(userId: number): Promise<BotConfig[]> {
    return await db.select().from(botConfigs).where(eq(botConfigs.userId, userId));
  }

  async createBotConfig(configData: InsertBotConfig): Promise<BotConfig> {
    const [config] = await db.insert(botConfigs).values(configData).returning();
    return config;
  }

  async updateBotConfig(id: number, configData: Partial<BotConfig>): Promise<BotConfig> {
    const [config] = await db
      .update(botConfigs)
      .set({ ...configData, updatedAt: new Date() })
      .where(eq(botConfigs.id, id))
      .returning();
    return config;
  }

  async deleteBotConfig(id: number): Promise<void> {
    await db.delete(botConfigs).where(eq(botConfigs.id, id));
  }
}

export const storage = new DatabaseStorage();