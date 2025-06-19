import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertPlanSchema, insertSubscriptionSchema, insertBotConfigSchema } from "../shared/schema";
import jwt from "jsonwebtoken";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "seven-bots-secret-key";

// Middleware de autenticação
const authenticateToken = async (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token de acesso requerido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    const user = await storage.getUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido' });
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Rota de registro
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(userData.email);
      
      if (existingUser) {
        return res.status(400).json({ message: "Email já está em uso" });
      }

      const user = await storage.createUser(userData);
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
      
      res.json({ 
        user: { ...user, password: undefined }, 
        token 
      });
    } catch (error: any) {
      console.error("Erro no registro:", error);
      res.status(400).json({ message: error.message || "Erro ao criar usuário" });
    }
  });

  // Rota de login
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.verifyPassword(email, password);
      
      if (!user) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });
      
      res.json({ 
        user: { ...user, password: undefined }, 
        token 
      });
    } catch (error: any) {
      console.error("Erro no login:", error);
      res.status(400).json({ message: error.message || "Erro ao fazer login" });
    }
  });

  // Rota para obter planos
  app.get("/api/plans", async (req, res) => {
    try {
      const plans = await storage.getPlans();
      res.json(plans);
    } catch (error: any) {
      console.error("Erro ao buscar planos:", error);
      res.status(500).json({ message: "Erro ao buscar planos" });
    }
  });

  // Rota para criar plano (admin)
  app.post("/api/plans", async (req, res) => {
    try {
      const planData = insertPlanSchema.parse(req.body);
      const plan = await storage.createPlan(planData);
      res.json(plan);
    } catch (error: any) {
      console.error("Erro ao criar plano:", error);
      res.status(400).json({ message: error.message || "Erro ao criar plano" });
    }
  });

  // Rotas protegidas (requerem autenticação)
  
  // Obter assinaturas do usuário
  app.get("/api/user/subscriptions", authenticateToken, async (req: any, res) => {
    try {
      const subscriptions = await storage.getUserSubscriptions(req.user.id);
      res.json(subscriptions);
    } catch (error: any) {
      console.error("Erro ao buscar assinaturas:", error);
      res.status(500).json({ message: "Erro ao buscar assinaturas" });
    }
  });

  // Criar assinatura
  app.post("/api/user/subscriptions", authenticateToken, async (req: any, res) => {
    try {
      const subscriptionData = insertSubscriptionSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      const subscription = await storage.createSubscription(subscriptionData);
      res.json(subscription);
    } catch (error: any) {
      console.error("Erro ao criar assinatura:", error);
      res.status(400).json({ message: error.message || "Erro ao criar assinatura" });
    }
  });

  // Obter configurações de bots do usuário
  app.get("/api/user/bots", authenticateToken, async (req: any, res) => {
    try {
      const botConfigs = await storage.getBotConfigs(req.user.id);
      res.json(botConfigs);
    } catch (error: any) {
      console.error("Erro ao buscar configurações de bots:", error);
      res.status(500).json({ message: "Erro ao buscar configurações de bots" });
    }
  });

  // Criar configuração de bot
  app.post("/api/user/bots", authenticateToken, async (req: any, res) => {
    try {
      const botConfigData = insertBotConfigSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      const botConfig = await storage.createBotConfig(botConfigData);
      res.json(botConfig);
    } catch (error: any) {
      console.error("Erro ao criar configuração de bot:", error);
      res.status(400).json({ message: error.message || "Erro ao criar configuração de bot" });
    }
  });

  // Atualizar configuração de bot
  app.put("/api/user/bots/:id", authenticateToken, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const botConfig = await storage.updateBotConfig(id, updates);
      res.json(botConfig);
    } catch (error: any) {
      console.error("Erro ao atualizar configuração de bot:", error);
      res.status(400).json({ message: error.message || "Erro ao atualizar configuração de bot" });
    }
  });

  // Deletar configuração de bot
  app.delete("/api/user/bots/:id", authenticateToken, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteBotConfig(id);
      res.json({ message: "Configuração de bot deletada com sucesso" });
    } catch (error: any) {
      console.error("Erro ao deletar configuração de bot:", error);
      res.status(400).json({ message: error.message || "Erro ao deletar configuração de bot" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}