import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, loginSchema, insertBotConfigSchema, insertTransactionSchema } from "@shared/schema";
import { z } from "zod";
import { botManager } from "./bot-manager";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Simple session middleware
  const sessions = new Map();

  const requireAuth = (req: any, res: any, next: any) => {
    const sessionId = req.headers.authorization?.replace('Bearer ', '');
    if (!sessionId || !sessions.has(sessionId)) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    req.user = sessions.get(sessionId);
    next();
  };

  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await storage.createUser(userData);
      const sessionId = Math.random().toString(36).substring(7);
      sessions.set(sessionId, user);
      
      res.json({ user: { id: user.id, email: user.email, name: user.name }, sessionId });
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const loginData = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(loginData.email);
      if (!user || user.password !== loginData.password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const sessionId = Math.random().toString(36).substring(7);
      sessions.set(sessionId, user);
      
      res.json({ user: { id: user.id, email: user.email, name: user.name, planType: user.planType, planActive: user.planActive }, sessionId });
    } catch (error) {
      res.status(400).json({ message: "Invalid login data" });
    }
  });

  app.post("/api/auth/logout", requireAuth, (req, res) => {
    const sessionId = req.headers.authorization?.replace('Bearer ', '');
    if (sessionId) {
      sessions.delete(sessionId);
    }
    res.json({ message: "Logged out" });
  });

  app.get("/api/auth/me", requireAuth, (req, res) => {
    res.json({ user: req.user });
  });

  // Plan routes
  app.post("/api/plans/select", requireAuth, async (req, res) => {
    try {
      const { planType } = req.body;
      
      if (!["tickets", "sales", "moderation"].includes(planType)) {
        return res.status(400).json({ message: "Invalid plan type" });
      }

      // Create transaction
      const prices = { tickets: 2900, sales: 4900, moderation: 3900 }; // in cents
      const transaction = await storage.createTransaction({
        userId: req.user.id,
        planType,
        amount: prices[planType as keyof typeof prices],
      });

      // Simulate payment success and activate plan
      await storage.updateTransaction(transaction.id, { status: "completed" });
      const updatedUser = await storage.updateUser(req.user.id, { planType, planActive: true });

      // Update session with new user data
      const sessionId = req.headers.authorization?.replace('Bearer ', '');
      if (sessionId && updatedUser) {
        sessions.set(sessionId, updatedUser);
      }

      res.json({ message: "Plan activated successfully", transaction, user: updatedUser });
    } catch (error) {
      res.status(400).json({ message: "Failed to select plan" });
    }
  });

  // Bot config routes
  app.get("/api/bot-configs", requireAuth, async (req, res) => {
    try {
      const configs = await storage.getBotConfigsByUser(req.user.id);
      
      // Verifica status real dos bots conectados
      const configsWithStatus = configs.map(config => ({
        ...config,
        botStatus: botManager.isConnected(config.id) ? "online" : "offline",
        botInfo: botManager.getBotInfo(config.id)
      }));
      
      res.json(configsWithStatus);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bot configs" });
    }
  });

  app.post("/api/bot-configs", requireAuth, async (req, res) => {
    try {
      const configData = insertBotConfigSchema.parse(req.body);
      
      // Check if user has an active plan for this bot type
      const user = await storage.getUser(req.user.id);
      if (!user?.planActive || user.planType !== configData.planType) {
        return res.status(400).json({ message: "No active plan for this bot type" });
      }

      // Check if config already exists
      const existingConfig = await storage.getBotConfig(req.user.id, configData.planType);
      if (existingConfig) {
        return res.status(400).json({ message: "Bot config already exists for this plan" });
      }

      const config = await storage.createBotConfig({
        ...configData,
        userId: req.user.id,
      });

      res.json(config);
    } catch (error) {
      res.status(400).json({ message: "Invalid bot config data" });
    }
  });

  app.put("/api/bot-configs/:id", requireAuth, async (req, res) => {
    try {
      const configId = parseInt(req.params.id);
      const updates = req.body;

      const config = await storage.updateBotConfig(configId, updates);
      if (!config) {
        return res.status(404).json({ message: "Bot config not found" });
      }

      res.json(config);
    } catch (error) {
      res.status(400).json({ message: "Failed to update bot config" });
    }
  });

  // Bot status routes
  app.post("/api/bot-configs/:id/connect", requireAuth, async (req, res) => {
    try {
      const configId = parseInt(req.params.id);
      
      // Busca a configuração do bot
      const configs = await storage.getBotConfigsByUser(req.user.id);
      const config = configs.find(c => c.id === configId);
      
      if (!config) {
        return res.status(404).json({ message: "Bot config not found" });
      }

      if (!config.botToken) {
        return res.status(400).json({ message: "Bot token is required to connect" });
      }

      // Tenta conectar o bot Discord
      const result = await botManager.connectBot(config);
      
      if (result.success) {
        // Atualiza status no banco de dados
        const updatedConfig = await storage.updateBotConfig(configId, { botStatus: "online" });
        
        res.json({ 
          message: "Bot connected successfully", 
          config: updatedConfig,
          botInfo: botManager.getBotInfo(configId)
        });
      } else {
        // Atualiza status como erro
        await storage.updateBotConfig(configId, { botStatus: "error" });
        
        res.status(400).json({ 
          message: "Failed to connect bot", 
          error: result.error 
        });
      }
    } catch (error: any) {
      console.error("Error connecting bot:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/bot-configs/:id/disconnect", requireAuth, async (req, res) => {
    try {
      const configId = parseInt(req.params.id);
      
      // Desconecta o bot Discord
      await botManager.disconnectBot(configId);
      
      // Atualiza status no banco de dados
      const config = await storage.updateBotConfig(configId, { 
        botStatus: "offline" 
      });
      
      if (!config) {
        return res.status(404).json({ message: "Bot config not found" });
      }

      res.json({ message: "Bot disconnected successfully", config });
    } catch (error: any) {
      console.error("Error disconnecting bot:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Rota para atualizar configurações do bot
  app.post("/api/bot-configs/:id/settings", requireAuth, async (req, res) => {
    try {
      const configId = parseInt(req.params.id);
      const newSettings = req.body;

      // Verifica se o bot pertence ao usuário
      const configs = await storage.getBotConfigsByUser(req.user.id);
      const config = configs.find(c => c.id === configId);
      
      if (!config) {
        return res.status(404).json({ message: "Bot config not found" });
      }

      // Atualiza configurações no banco
      const updatedConfig = await storage.updateBotConfig(configId, {
        config: JSON.stringify(newSettings)
      });

      // Aplica configurações no bot em tempo real se estiver conectado
      if (botManager.isConnected(configId)) {
        botManager.updateBotConfig(configId, newSettings);
      }

      res.json({ 
        message: "Settings updated successfully", 
        config: updatedConfig 
      });
    } catch (error: any) {
      console.error("Error updating bot settings:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Rota para buscar configurações atuais do bot
  app.get("/api/bot-configs/:id/settings", requireAuth, async (req, res) => {
    try {
      const configId = parseInt(req.params.id);
      
      // Verifica se o bot pertence ao usuário
      const configs = await storage.getBotConfigsByUser(req.user.id);
      const config = configs.find(c => c.id === configId);
      
      if (!config) {
        return res.status(404).json({ message: "Bot config not found" });
      }

      // Retorna configurações do bot
      const settings = botManager.getBotSettings(configId);
      
      res.json({ settings });
    } catch (error: any) {
      console.error("Error fetching bot settings:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
