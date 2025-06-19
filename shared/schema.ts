import { pgTable, serial, text, varchar, timestamp, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Usuários
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  username: varchar("username", { length: 100 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  discordId: varchar("discord_id", { length: 100 }).unique(),
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Planos disponíveis
export const plans = pgTable("plans", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  price: integer("price").notNull(), // em centavos
  features: text("features").array(),
  botType: varchar("bot_type", { length: 50 }).notNull(), // 'ticket', 'sales', 'moderation'
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Assinaturas dos usuários
export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  planId: integer("plan_id").references(() => plans.id).notNull(),
  isActive: boolean("is_active").default(true),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Configurações dos bots
export const botConfigs = pgTable("bot_configs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  subscriptionId: integer("subscription_id").references(() => subscriptions.id).notNull(),
  serverId: varchar("server_id", { length: 100 }).notNull(),
  serverName: varchar("server_name", { length: 255 }),
  botType: varchar("bot_type", { length: 50 }).notNull(),
  config: jsonb("config").notNull(), // Configurações específicas do bot
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Schemas de inserção
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertPlanSchema = createInsertSchema(plans).omit({ id: true, createdAt: true });
export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({ id: true, createdAt: true });
export const insertBotConfigSchema = createInsertSchema(botConfigs).omit({ id: true, createdAt: true, updatedAt: true });

// Tipos
export type User = typeof users.$inferSelect;
export type Plan = typeof plans.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type BotConfig = typeof botConfigs.$inferSelect;

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertPlan = z.infer<typeof insertPlanSchema>;
export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type InsertBotConfig = z.infer<typeof insertBotConfigSchema>;