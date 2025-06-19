import { Client, GatewayIntentBits, Events, ActivityType, PresenceStatusData } from 'discord.js';
import type { BotConfig } from '../shared/schema';
import { BotCommandManager } from './bot-commands';

interface BotInstance {
  client: Client;
  config: BotConfig;
  isConnected: boolean;
  commandManager?: BotCommandManager;
}

class BotManager {
  private bots: Map<number, BotInstance> = new Map();

  async connectBot(botConfig: BotConfig): Promise<{ success: boolean; error?: string }> {
    try {
      // Verifica se o bot já está conectado
      if (this.bots.has(botConfig.id)) {
        await this.disconnectBot(botConfig.id);
      }

      // Cria nova instância do cliente Discord
      const client = new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.MessageContent,
          GatewayIntentBits.GuildMembers,
          GatewayIntentBits.DirectMessages
        ]
      });

      // Configura eventos do bot
      this.setupBotEvents(client, botConfig);

      // Verifica se o token existe
      if (!botConfig.botToken) {
        throw new Error('Bot token is required');
      }

      // Conecta o bot
      await client.login(botConfig.botToken);

      // Cria o gerenciador de comandos para bots de vendas
      let commandManager: BotCommandManager | undefined;
      if (botConfig.planType === 'sales') {
        commandManager = new BotCommandManager(client, botConfig);
      }

      // Armazena a instância
      this.bots.set(botConfig.id, {
        client,
        config: botConfig,
        isConnected: true,
        commandManager
      });

      console.log(`[BotManager] Bot ${botConfig.id} conectado com sucesso`);
      return { success: true };

    } catch (error: any) {
      console.error(`[BotManager] Erro ao conectar bot ${botConfig.id}:`, error.message);
      return { 
        success: false, 
        error: error.message || 'Erro desconhecido ao conectar o bot'
      };
    }
  }

  async disconnectBot(botConfigId: number): Promise<void> {
    const botInstance = this.bots.get(botConfigId);
    
    if (botInstance) {
      try {
        botInstance.client.destroy();
        this.bots.delete(botConfigId);
        console.log(`[BotManager] Bot ${botConfigId} desconectado`);
      } catch (error) {
        console.error(`[BotManager] Erro ao desconectar bot ${botConfigId}:`, error);
      }
    }
  }

  isConnected(botConfigId: number): boolean {
    const botInstance = this.bots.get(botConfigId);
    return botInstance?.isConnected && botInstance.client.isReady() || false;
  }

  getBotInfo(botConfigId: number) {
    const botInstance = this.bots.get(botConfigId);
    if (!botInstance || !botInstance.client.user) {
      return null;
    }

    return {
      username: botInstance.client.user.username,
      discriminator: botInstance.client.user.discriminator,
      avatar: botInstance.client.user.displayAvatarURL(),
      id: botInstance.client.user.id,
      guilds: botInstance.client.guilds.cache.size
    };
  }

  private setupBotEvents(client: Client, botConfig: BotConfig) {
    client.once(Events.ClientReady, (readyClient) => {
      console.log(`[Bot ${botConfig.id}] Conectado como ${readyClient.user.tag}`);
      
      // Configura presença baseada na configuração (será implementado quando houver config)
      this.updateBotPresence(client, botConfig);
    });

    client.on(Events.Error, (error) => {
      console.error(`[Bot ${botConfig.id}] Erro:`, error);
    });

    client.on(Events.Warn, (warning) => {
      console.warn(`[Bot ${botConfig.id}] Aviso:`, warning);
    });

    // Aqui será implementada a lógica do bot de vendas baseada no tipo de plano
    this.setupBotCommands(client, botConfig);
  }

  private updateBotPresence(client: Client, botConfig: BotConfig) {
    try {
      // Por enquanto usa configuração padrão, depois será baseada na config do usuário
      const defaultConfig = {
        status: 'online' as PresenceStatusData,
        activities: [{
          name: `Seven Bots | ${botConfig.planType}`,
          type: ActivityType.Playing
        }]
      };

      client.user?.setPresence(defaultConfig);
    } catch (error) {
      console.error(`[Bot ${botConfig.id}] Erro ao definir presença:`, error);
    }
  }

  private setupBotCommands(client: Client, botConfig: BotConfig) {
    // Implementará comandos baseados no tipo de plano
    switch (botConfig.planType) {
      case 'sales':
        this.setupSalesBot(client, botConfig);
        break;
      case 'tickets':
        this.setupTicketBot(client, botConfig);
        break;
      case 'moderation':
        this.setupModerationBot(client, botConfig);
        break;
    }
  }

  private setupSalesBot(client: Client, botConfig: BotConfig) {
    // Aqui implementará a lógica do bot de vendas baseada no código do Cakto
    console.log(`[Bot ${botConfig.id}] Configurando bot de vendas...`);
    
    // Por enquanto só log, depois implementará os comandos slash e eventos
    client.on(Events.MessageCreate, (message) => {
      if (message.author.bot) return;
      
      // Implementará lógica de vendas aqui
    });
  }

  private setupTicketBot(client: Client, botConfig: BotConfig) {
    console.log(`[Bot ${botConfig.id}] Configurando bot de tickets...`);
    // Implementará sistema de tickets
  }

  private setupModerationBot(client: Client, botConfig: BotConfig) {
    console.log(`[Bot ${botConfig.id}] Configurando bot de moderação...`);
    // Implementará sistema de moderação
  }

  // Método para aplicar configurações do usuário
  async updateBotConfig(botConfigId: number, newSettings: any) {
    const botInstance = this.bots.get(botConfigId);
    if (!botInstance) return;

    // Atualiza configurações no gerenciador de comandos
    if (botInstance.commandManager) {
      botInstance.commandManager.updateSettings(newSettings);
    }
    
    // Aplica mudanças na presença se necessário
    this.updateBotPresence(botInstance.client, botInstance.config);
  }

  // Método para obter configurações atuais do bot
  getBotSettings(botConfigId: number) {
    const botInstance = this.bots.get(botConfigId);
    if (!botInstance || !botInstance.commandManager) {
      return null;
    }

    return botInstance.commandManager.getSettings();
  }

  // Limpa todos os bots (útil para shutdown)
  async disconnectAllBots() {
    const botIds = Array.from(this.bots.keys());
    for (const id of botIds) {
      await this.disconnectBot(id);
    }
  }
}

export const botManager = new BotManager();