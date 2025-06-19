import { Client, SlashCommandBuilder, Events, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ChannelType, PermissionFlagsBits } from 'discord.js';
import type { BotConfig } from '../shared/schema';

export interface BotSettings {
  // Configurações gerais
  vendas: "ON" | "OFF";
  color: {
    padrao: string;
  };
  canais: {
    logs_adm?: string;
    logs_publica?: string;
    categoria?: string;
    cargo_cliente?: string;
  };
  
  // Configurações de pagamento
  paymentauto: {
    access_token?: string;
    pix: "ON" | "OFF";
    pagarsite: "ON" | "OFF";
    tempopagar: string;
  };
  
  paymentsemi: {
    pix: "ON" | "OFF";
    chavepix?: string;
    qrcode?: string;
    tipochave?: string;
  };
  
  saldo: {
    saldo: "ON" | "OFF";
    bonus: string;
    minimo: string;
  };
  
  // Configurações visuais
  images: {
    banner?: string;
    thumbnail?: string;
  };
  
  status: {
    presence: "online" | "idle" | "dnd" | "invisible";
    atividade: "Playing" | "Streaming" | "Listening" | "Watching" | "Competing";
    texto?: string;
    url?: string;
  };
  
  // Produtos e cupons serão gerenciados separadamente
  produtos: Record<string, any>;
  cupons: Record<string, any>;
}

export class BotCommandManager {
  private client: Client;
  private config: BotConfig;
  private settings: BotSettings;

  constructor(client: Client, config: BotConfig) {
    this.client = client;
    this.config = config;
    this.settings = this.parseConfig(config.config);
    this.setupCommands();
  }

  private getColorValue(): number {
    try {
      return parseInt(this.settings.color.padrao.replace('#', ''), 16);
    } catch {
      return 0x090b0c; // Default color
    }
  }

  private parseConfig(configString: string | null): BotSettings {
    if (!configString) {
      return this.getDefaultSettings();
    }

    try {
      return JSON.parse(configString);
    } catch {
      return this.getDefaultSettings();
    }
  }

  private getDefaultSettings(): BotSettings {
    return {
      vendas: "ON",
      color: {
        padrao: "#090b0c"
      },
      canais: {},
      paymentauto: {
        pix: "OFF",
        pagarsite: "OFF",
        tempopagar: "15"
      },
      paymentsemi: {
        pix: "OFF"
      },
      saldo: {
        saldo: "OFF",
        bonus: "0",
        minimo: "0"
      },
      images: {},
      status: {
        presence: "online",
        atividade: "Playing",
        texto: "Seven Bots | Vendas"
      },
      produtos: {},
      cupons: {}
    };
  }

  private async setupCommands() {
    // Registra comandos slash
    const commands = [
      new SlashCommandBuilder()
        .setName('config')
        .setDescription('🔧 Painel de configuração do bot')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
        
      new SlashCommandBuilder()
        .setName('produto')
        .setDescription('📦 Gerenciar produtos da loja')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
          subcommand
            .setName('criar')
            .setDescription('Criar um novo produto')
            .addStringOption(option =>
              option.setName('nome')
                .setDescription('Nome do produto')
                .setRequired(true))
            .addNumberOption(option =>
              option.setName('preco')
                .setDescription('Preço do produto')
                .setRequired(true))
        )
        .addSubcommand(subcommand =>
          subcommand
            .setName('listar')
            .setDescription('Listar todos os produtos')
        ),
        
      new SlashCommandBuilder()
        .setName('cupom')
        .setDescription('🎫 Gerenciar cupons de desconto')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addSubcommand(subcommand =>
          subcommand
            .setName('criar')
            .setDescription('Criar um novo cupom')
            .addStringOption(option =>
              option.setName('codigo')
                .setDescription('Código do cupom')
                .setRequired(true))
            .addNumberOption(option =>
              option.setName('desconto')
                .setDescription('Porcentagem de desconto (0-100)')
                .setRequired(true))
        ),
        
      new SlashCommandBuilder()
        .setName('vendas')
        .setDescription('💰 Ativar/desativar sistema de vendas')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
          option.setName('status')
            .setDescription('Status das vendas')
            .setRequired(true)
            .addChoices(
              { name: 'Ativar', value: 'ON' },
              { name: 'Desativar', value: 'OFF' }
            )
        ),
        
      new SlashCommandBuilder()
        .setName('painel')
        .setDescription('🛍️ Criar painel de vendas')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    ];

    try {
      if (this.client.isReady()) {
        await this.client.application?.commands.set(commands);
        console.log(`[Bot ${this.config.id}] Comandos slash registrados com sucesso`);
      }
    } catch (error) {
      console.error(`[Bot ${this.config.id}] Erro ao registrar comandos:`, error);
    }

    // Setup event handlers
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isChatInputCommand()) return;

      try {
        switch (interaction.commandName) {
          case 'config':
            await this.handleConfigCommand(interaction);
            break;
          case 'produto':
            await this.handleProdutoCommand(interaction);
            break;
          case 'cupom':
            await this.handleCupomCommand(interaction);
            break;
          case 'vendas':
            await this.handleVendasCommand(interaction);
            break;
          case 'painel':
            await this.handlePainelCommand(interaction);
            break;
        }
      } catch (error) {
        console.error(`[Bot ${this.config.id}] Erro no comando ${interaction.commandName}:`, error);
        
        const reply = {
          content: '❌ Ocorreu um erro ao executar o comando.',
          ephemeral: true
        };
        
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(reply);
        } else {
          await interaction.reply(reply);
        }
      }
    });

    // Setup button interactions
    this.client.on(Events.InteractionCreate, async (interaction) => {
      if (!interaction.isButton()) return;
      await this.handleButtonInteraction(interaction);
    });
  }

  private async handleConfigCommand(interaction: any) {
    const embed = new EmbedBuilder()
      .setTitle('🔧 Painel de Configuração')
      .setDescription('Configure seu bot de vendas usando os botões abaixo:')
      .setColor(this.getColorValue())
      .addFields([
        {
          name: '💰 Status das Vendas',
          value: this.settings.vendas === "ON" ? '✅ Ativo' : '❌ Inativo',
          inline: true
        },
        {
          name: '🎨 Cor Padrão',
          value: this.settings.color.padrao,
          inline: true
        },
        {
          name: '📊 Produtos',
          value: `${Object.keys(this.settings.produtos).length} cadastrados`,
          inline: true
        }
      ]);

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId(`${interaction.user.id}_config_canais`)
          .setLabel('📺 Canais')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId(`${interaction.user.id}_config_pagamentos`)
          .setLabel('💳 Pagamentos')
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId(`${interaction.user.id}_config_aparencia`)
          .setLabel('🎨 Aparência')
          .setStyle(ButtonStyle.Primary)
      );

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: true
    });
  }

  private async handleProdutoCommand(interaction: any) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'criar') {
      const nome = interaction.options.getString('nome');
      const preco = interaction.options.getNumber('preco');

      // Adiciona produto às configurações
      this.settings.produtos[nome.toLowerCase()] = {
        nome: nome,
        desc: "Produto criado via comando",
        preco: preco,
        estoque: [],
        cor: this.settings.color.padrao,
        cupom: "ON",
        categoria: null
      };

      await this.saveSettings();

      const embed = new EmbedBuilder()
        .setTitle('✅ Produto Criado')
        .setDescription(`Produto **${nome}** foi criado com sucesso!`)
        .addFields([
          { name: 'Nome', value: nome, inline: true },
          { name: 'Preço', value: `R$ ${preco.toFixed(2)}`, inline: true }
        ])
        .setColor(this.getColorValue());

      await interaction.reply({ embeds: [embed], ephemeral: true });

    } else if (subcommand === 'listar') {
      const produtos = Object.values(this.settings.produtos);
      
      if (produtos.length === 0) {
        await interaction.reply({
          content: '📦 Nenhum produto cadastrado ainda.',
          ephemeral: true
        });
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle('📦 Produtos Cadastrados')
        .setColor(this.getColorValue());

      produtos.forEach((produto: any) => {
        embed.addFields({
          name: produto.nome,
          value: `💰 R$ ${produto.preco.toFixed(2)}\n📦 ${produto.estoque.length} em estoque`,
          inline: true
        });
      });

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }

  private async handleCupomCommand(interaction: any) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'criar') {
      const codigo = interaction.options.getString('codigo');
      const desconto = interaction.options.getNumber('desconto');

      this.settings.cupons[codigo.toUpperCase()] = {
        nome: codigo.toUpperCase(),
        porcentagem: desconto,
        valormin: 0,
        quantidade: 999,
        cargo: "todos"
      };

      await this.saveSettings();

      const embed = new EmbedBuilder()
        .setTitle('✅ Cupom Criado')
        .setDescription(`Cupom **${codigo.toUpperCase()}** foi criado com sucesso!`)
        .addFields([
          { name: 'Código', value: codigo.toUpperCase(), inline: true },
          { name: 'Desconto', value: `${desconto}%`, inline: true }
        ])
        .setColor(this.getColorValue());

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }
  }

  private async handleVendasCommand(interaction: any) {
    const status = interaction.options.getString('status');
    
    this.settings.vendas = status as "ON" | "OFF";
    await this.saveSettings();

    const embed = new EmbedBuilder()
      .setTitle('✅ Status das Vendas Atualizado')
      .setDescription(`Sistema de vendas foi **${status === "ON" ? "ativado" : "desativado"}**`)
      .setColor(this.getColorValue());

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }

  private async handlePainelCommand(interaction: any) {
    if (this.settings.vendas === "OFF") {
      await interaction.reply({
        content: '❌ As vendas estão desativadas. Use `/vendas ON` para ativar.',
        ephemeral: true
      });
      return;
    }

    const produtos = Object.values(this.settings.produtos);
    
    if (produtos.length === 0) {
      await interaction.reply({
        content: '📦 Nenhum produto cadastrado. Use `/produto criar` para adicionar produtos.',
        ephemeral: true
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle('🛍️ Loja - Seven Bots')
      .setDescription('Selecione um produto para comprar:')
      .setColor(this.getColorValue());

    if (this.settings.images.banner) {
      embed.setImage(this.settings.images.banner);
    }

    if (this.settings.images.thumbnail) {
      embed.setThumbnail(this.settings.images.thumbnail);
    }

    produtos.forEach((produto: any) => {
      embed.addFields({
        name: `${produto.nome}`,
        value: `💰 R$ ${produto.preco.toFixed(2)}\n📦 ${produto.estoque.length} disponíveis`,
        inline: true
      });
    });

    // Cria botões para cada produto (máximo 5 por row)
    const rows = [];
    const produtoKeys = Object.keys(this.settings.produtos);
    
    for (let i = 0; i < Math.min(produtoKeys.length, 25); i += 5) {
      const row = new ActionRowBuilder();
      const slice = produtoKeys.slice(i, i + 5);
      
      slice.forEach(key => {
        const produto = this.settings.produtos[key];
        row.addComponents(
          new ButtonBuilder()
            .setCustomId(`comprar_${key}`)
            .setLabel(`${produto.nome}`)
            .setStyle(ButtonStyle.Success)
            .setEmoji('🛒')
        );
      });
      
      rows.push(row);
    }

    await interaction.reply({
      embeds: [embed],
      components: rows
    });
  }

  private async handleButtonInteraction(interaction: any) {
    const customId = interaction.customId;
    
    if (customId.startsWith('comprar_')) {
      // Handle product purchase
      const productKey = customId.replace('comprar_', '');
      const produto = this.settings.produtos[productKey];
      
      if (!produto) {
        await interaction.reply({
          content: '❌ Produto não encontrado.',
          ephemeral: true
        });
        return;
      }

      if (produto.estoque.length === 0) {
        await interaction.reply({
          content: '❌ Produto fora de estoque.',
          ephemeral: true
        });
        return;
      }

      // Aqui implementaria o sistema de pagamento
      await interaction.reply({
        content: `🛒 Iniciando compra do produto **${produto.nome}** por R$ ${produto.preco.toFixed(2)}\n\n⏳ Sistema de pagamento será implementado em breve...`,
        ephemeral: true
      });
    }
  }

  private async saveSettings() {
    // Salva configurações no formato JSON string para o banco
    const configString = JSON.stringify(this.settings);
    console.log(`[Bot ${this.config.id}] Configurações atualizadas:`, configString);
    
    // Aqui integraria com a API para salvar no banco
    // Por enquanto apenas logs as mudanças
  }

  public updateSettings(newSettings: Partial<BotSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    this.saveSettings();
  }

  public getSettings(): BotSettings {
    return this.settings;
  }
}