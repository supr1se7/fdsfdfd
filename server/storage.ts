import { users, botConfigs, transactions, type User, type InsertUser, type BotConfig, type InsertBotConfig, type Transaction, type InsertTransaction } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;

  // Bot config methods
  getBotConfig(userId: number, planType: string): Promise<BotConfig | undefined>;
  createBotConfig(config: InsertBotConfig & { userId: number }): Promise<BotConfig>;
  updateBotConfig(id: number, updates: Partial<BotConfig>): Promise<BotConfig | undefined>;
  getBotConfigsByUser(userId: number): Promise<BotConfig[]>;

  // Transaction methods
  createTransaction(transaction: InsertTransaction & { userId: number }): Promise<Transaction>;
  getTransactionsByUser(userId: number): Promise<Transaction[]>;
  updateTransaction(id: number, updates: Partial<Transaction>): Promise<Transaction | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private botConfigs: Map<number, BotConfig>;
  private transactions: Map<number, Transaction>;
  private currentUserId: number;
  private currentBotConfigId: number;
  private currentTransactionId: number;

  constructor() {
    this.users = new Map();
    this.botConfigs = new Map();
    this.transactions = new Map();
    this.currentUserId = 1;
    this.currentBotConfigId = 1;
    this.currentTransactionId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      ...insertUser,
      id,
      planType: null,
      planActive: false,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getBotConfig(userId: number, planType: string): Promise<BotConfig | undefined> {
    return Array.from(this.botConfigs.values()).find(
      config => config.userId === userId && config.planType === planType
    );
  }

  async createBotConfig(config: InsertBotConfig & { userId: number }): Promise<BotConfig> {
    const id = this.currentBotConfigId++;
    const botConfig: BotConfig = {
      ...config,
      id,
      botStatus: "offline",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.botConfigs.set(id, botConfig);
    return botConfig;
  }

  async updateBotConfig(id: number, updates: Partial<BotConfig>): Promise<BotConfig | undefined> {
    const config = this.botConfigs.get(id);
    if (!config) return undefined;
    
    const updatedConfig = { ...config, ...updates, updatedAt: new Date() };
    this.botConfigs.set(id, updatedConfig);
    return updatedConfig;
  }

  async getBotConfigsByUser(userId: number): Promise<BotConfig[]> {
    return Array.from(this.botConfigs.values()).filter(
      config => config.userId === userId
    );
  }

  async createTransaction(transaction: InsertTransaction & { userId: number }): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const txn: Transaction = {
      ...transaction,
      id,
      status: "pending",
      createdAt: new Date(),
    };
    this.transactions.set(id, txn);
    return txn;
  }

  async getTransactionsByUser(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values()).filter(
      txn => txn.userId === userId
    );
  }

  async updateTransaction(id: number, updates: Partial<Transaction>): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;
    
    const updatedTransaction = { ...transaction, ...updates };
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }
}

export const storage = new MemStorage();
