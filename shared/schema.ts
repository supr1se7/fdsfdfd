import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  planType: text("plan_type").$type<"tickets" | "sales" | "moderation" | null>(),
  planActive: boolean("plan_active").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const botConfigs = pgTable("bot_configs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  planType: text("plan_type").$type<"tickets" | "sales" | "moderation">().notNull(),
  botToken: text("bot_token"),
  botStatus: text("bot_status").$type<"online" | "offline" | "error">().default("offline"),
  config: text("config"), // JSON string for bot-specific configuration
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  planType: text("plan_type").$type<"tickets" | "sales" | "moderation">().notNull(),
  amount: integer("amount").notNull(), // in cents
  status: text("status").$type<"pending" | "completed" | "failed">().default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
  name: true,
});

export const insertBotConfigSchema = createInsertSchema(botConfigs).pick({
  planType: true,
  botToken: true,
  config: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  planType: true,
  amount: true,
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertBotConfig = z.infer<typeof insertBotConfigSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type User = typeof users.$inferSelect;
export type BotConfig = typeof botConfigs.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
