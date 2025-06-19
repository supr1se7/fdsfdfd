import { db } from "./db";
import { plans } from "../shared/schema";

async function setupDatabase() {
  console.log("🔧 Configurando banco de dados...");

  // Criar planos iniciais
  const initialPlans = [
    {
      name: "Bot de Ticket",
      description: "Sistema completo de suporte com tickets privados",
      price: 1999, // R$ 19,99
      features: [
        "Sistema de tickets privados",
        "Categorias personalizáveis", 
        "Sistema de prioridades",
        "Histórico completo",
        "Auto-close de tickets",
        "Notificações automáticas"
      ],
      botType: "ticket",
      isActive: true,
    },
    {
      name: "Bot de Vendas",
      description: "Automatize suas vendas com sistema de pagamento integrado",
      price: 2999, // R$ 29,99
      features: [
        "Pagamentos automáticos",
        "Produtos digitais",
        "Sistema de cupons",
        "Relatórios de vendas",
        "Entrega automática",
        "Gestão de estoque"
      ],
      botType: "sales",
      isActive: true,
    },
    {
      name: "Bot de Moderação",
      description: "Mantenha seu servidor seguro com auto-moderação",
      price: 1599, // R$ 15,99
      features: [
        "Auto-moderação inteligente",
        "Sistema de warns",
        "Anti-spam avançado",
        "Filtro de palavrões",
        "Logs de moderação",
        "Banimentos temporários"
      ],
      botType: "moderation",
      isActive: true,
    },
  ];

  try {
    // Verificar se já existem planos
    const existingPlans = await db.select().from(plans);
    
    if (existingPlans.length === 0) {
      console.log("📦 Criando planos iniciais...");
      await db.insert(plans).values(initialPlans);
      console.log("✅ Planos criados com sucesso!");
    } else {
      console.log("📋 Planos já existem no banco de dados");
    }

    console.log("🎉 Configuração do banco concluída!");
  } catch (error) {
    console.error("❌ Erro ao configurar banco:", error);
    process.exit(1);
  }
}

setupDatabase();