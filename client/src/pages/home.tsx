import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { AuthModal } from "@/components/auth-modal";
import { PlanCard } from "@/components/plan-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Ticket, 
  ShoppingCart, 
  Shield, 
  Settings, 
  Zap, 
  ShieldCheck, 
  BarChart3, 
  Headphones, 
  RefreshCw,
  Rocket,
  Play,
  CheckCircle,
  ArrowUp,
  CreditCard,
  Box
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { authStorage } from "@/lib/auth";

interface PlanData {
  name: string;
  description: string;
  price: string;
  icon: React.ReactNode;
  type: "tickets" | "sales" | "moderation";
}

const planData: Record<string, PlanData> = {
  tickets: {
    name: "Bot de Tickets",
    description: "Sistema completo de suporte ao cliente",
    price: "R$ 29",
    icon: <Ticket className="w-6 h-6 text-white" />,
    type: "tickets"
  },
  sales: {
    name: "Bot de Vendas",
    description: "Plataforma completa de e-commerce",
    price: "R$ 49",
    icon: <ShoppingCart className="w-6 h-6 text-white" />,
    type: "sales"
  },
  moderation: {
    name: "Bot de Moderação",
    description: "Proteção e moderação avançada",
    price: "R$ 39",
    icon: <Shield className="w-6 h-6 text-white" />,
    type: "moderation"
  }
};

export default function Home() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const selectPlanMutation = useMutation({
    mutationFn: async (planType: string) => {
      const response = await apiRequest("POST", "/api/plans/select", { planType });
      return response.json();
    },
    onSuccess: (data) => {
      // Update localStorage with new user data
      if (data.user) {
        authStorage.setUser(data.user);
      }
      
      // Invalidate auth queries to refetch user data
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      
      toast({
        title: "Plano ativado com sucesso!",
        description: "Redirecionando para o dashboard...",
      });
      setPlanModalOpen(false);
      setLocation("/dashboard");
    },
    onError: () => {
      toast({
        title: "Erro ao ativar plano",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const openAuthModal = (mode: "login" | "register") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handlePlanSelect = (planType: string) => {
    if (!isAuthenticated) {
      openAuthModal("login");
      return;
    }
    setSelectedPlan(planType);
    setPlanModalOpen(true);
  };

  const confirmPlan = () => {
    if (selectedPlan) {
      selectPlanMutation.mutate(selectedPlan);
    }
  };

  const scrollToPlans = () => {
    const plansSection = document.getElementById("plans");
    plansSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <Navigation onAuthModal={openAuthModal} />
      
      {/* Hero Section */}
      <section id="home" className="pt-16 min-h-screen flex items-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon-red/10 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-red-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "-3s" }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-5xl lg:text-7xl font-bold mb-6">
                <span className="text-white">Bots Discord</span><br />
                <span className="gradient-text animate-glow">Profissionais</span>
              </h1>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Potencialize seu servidor Discord com nossa plataforma completa de bots. 
                Configure, gerencie e monitore tudo em um só lugar.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button
                  onClick={scrollToPlans}
                  className="bg-gradient-to-r from-red-500 to-neon-red hover:shadow-neon-strong transition-all duration-300 transform hover:scale-105"
                  size="lg"
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  Começar Agora
                </Button>
                <Button
                  variant="outline"
                  className="border-red-500 text-red-400 hover:bg-red-500/10 hover:shadow-neon transition-all duration-300"
                  size="lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Ver Demo
                </Button>
              </div>
            </div>
            <div className="relative">
              {/* Discord-style mockup interface */}
              <Card className="bg-dark-card border-red-500/30 shadow-2xl backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse-neon"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div className="ml-4 text-sm text-gray-400">Dashboard - Seven Bots</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-dark-surface rounded-lg border border-red-500/20">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                        <span className="text-sm">Bot de Vendas</span>
                      </div>
                      <Badge variant="outline" className="text-green-400 border-green-400">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-dark-surface rounded-lg border border-red-500/20">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                        <span className="text-sm">Bot de Tickets</span>
                      </div>
                      <Badge variant="outline" className="text-green-400 border-green-400">Online</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-dark-surface rounded-lg border border-red-500/20">
                      <div className="flex items-center">
                        <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                        <span className="text-sm">Bot de Moderação</span>
                      </div>
                      <Badge variant="outline" className="text-red-400 border-red-400">Configurando</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-20 bg-dark-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Escolha seu <span className="gradient-text">Plano</span>
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Cada plano foi desenvolvido para atender necessidades específicas do seu servidor Discord
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <PlanCard
              type="tickets"
              title="Bot de Tickets"
              description="Sistema completo de suporte ao cliente"
              price="R$ 29"
              features={[
                "Sistema de tickets automático",
                "Categorização por departamento",
                "Logs e relatórios completos",
                "Configuração via dashboard",
                "Suporte 24/7"
              ]}
              icon={<Ticket className="w-8 h-8 text-white" />}
              onSelect={handlePlanSelect}
            />
            
            <PlanCard
              type="sales"
              title="Bot de Vendas"
              description="Plataforma completa de e-commerce"
              price="R$ 49"
              features={[
                "Sistema de produtos e estoque",
                "Pagamentos automatizados",
                "Cupons e promoções",
                "Relatórios de vendas",
                "Integração com gateways"
              ]}
              icon={<ShoppingCart className="w-8 h-8 text-white" />}
              isPopular
              onSelect={handlePlanSelect}
            />
            
            <PlanCard
              type="moderation"
              title="Bot de Moderação"
              description="Proteção e moderação avançada"
              price="R$ 39"
              features={[
                "Auto-moderação inteligente",
                "Sistema de warns e punições",
                "Filtros de conteúdo",
                "Logs de moderação",
                "Proteção anti-raid"
              ]}
              icon={<Shield className="w-8 h-8 text-white" />}
              onSelect={handlePlanSelect}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Por que escolher <span className="gradient-text">Seven Bots</span>?
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Nossa plataforma oferece recursos avançados para maximizar o potencial do seu servidor Discord
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Settings className="w-6 h-6 text-white" />,
                title: "Configuração Intuitiva",
                description: "Interface web moderna para configurar todos os aspectos dos seus bots sem código."
              },
              {
                icon: <Zap className="w-6 h-6 text-white" />,
                title: "Alta Performance",
                description: "Bots otimizados com 99.9% de uptime e resposta instantânea aos comandos."
              },
              {
                icon: <ShieldCheck className="w-6 h-6 text-white" />,
                title: "Segurança Avançada",
                description: "Tokens criptografados e protocolo de segurança enterprise para proteger seus dados."
              },
              {
                icon: <BarChart3 className="w-6 h-6 text-white" />,
                title: "Analytics Detalhados",
                description: "Relatórios completos sobre o desempenho e uso dos seus bots em tempo real."
              },
              {
                icon: <Headphones className="w-6 h-6 text-white" />,
                title: "Suporte 24/7",
                description: "Equipe especializada disponível a qualquer momento para ajudar com suas necessidades."
              },
              {
                icon: <RefreshCw className="w-6 h-6 text-white" />,
                title: "Atualizações Automáticas",
                description: "Sempre com as últimas funcionalidades e melhorias sem interrupção do serviço."
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-dark-card border-red-500/20 hover:border-red-500/40 hover:shadow-neon transition-all duration-300">
                <CardContent className="p-6">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-red-500 to-neon-red rounded-lg mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-20 bg-dark-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">
              Dashboard <span className="gradient-text">Intuitivo</span>
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
              Gerencie todos os seus bots em uma interface moderna e fácil de usar
            </p>
          </div>

          {/* Dashboard Mockup */}
          <Card className="bg-dark-card border-red-500/30 shadow-2xl">
            <CardContent className="p-8">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-8 border-b border-red-500/20 pb-6">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-neon-red rounded-full mr-4"></div>
                  <div>
                    <h3 className="text-lg font-semibold">João Silva</h3>
                    <p className="text-gray-400 text-sm">Plano Bot de Vendas Ativo</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                    <span className="text-sm">Bot Online</span>
                  </div>
                </div>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-dark-surface border-red-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Vendas Hoje</p>
                        <p className="text-2xl font-bold text-white">R$ 1.249</p>
                      </div>
                      <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <ArrowUp className="w-6 h-6 text-green-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-dark-surface border-red-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Transações</p>
                        <p className="text-2xl font-bold text-white">47</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-dark-surface border-red-500/20">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">Produtos Ativos</p>
                        <p className="text-2xl font-bold text-white">23</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                        <Box className="w-6 h-6 text-purple-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Configuration Panel */}
              <Card className="bg-dark-surface border-red-500/20">
                <CardContent className="p-6">
                  <h4 className="text-lg font-semibold mb-6 flex items-center">
                    <Settings className="w-5 h-5 text-neon-red mr-3" />
                    Configuração do Bot
                  </h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Token do Bot</label>
                      <div className="relative">
                        <input
                          type="password"
                          placeholder="Insira o token do seu bot Discord"
                          className="w-full bg-dark-bg border border-red-500/30 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all"
                          readOnly
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Seu token é criptografado e seguro</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Status do Bot</label>
                      <div className="flex items-center justify-between bg-dark-bg border border-red-500/30 rounded-lg px-4 py-3">
                        <span className="text-white">Estado Atual</span>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                          <span className="text-sm text-red-400">Offline</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Button className="bg-gradient-to-r from-red-500 to-neon-red hover:shadow-neon transition-all duration-300">
                      <Settings className="w-4 h-4 mr-2" />
                      Conectar Bot
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-card border-t border-red-500/20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold mb-4">
                <span className="text-neon-red animate-glow">Seven</span> Bots
              </h3>
              <p className="text-gray-400 mb-6 max-w-md">
                A plataforma mais completa para gerenciar bots Discord profissionais. 
                Configure, monitore e otimize seus bots em um só lugar.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Produtos</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Bot de Tickets</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Bot de Vendas</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Bot de Moderação</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentação</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Central de Ajuda</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-red-500/20 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 Seven Bots. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />

      {/* Plan Selection Modal */}
      <Dialog open={planModalOpen} onOpenChange={setPlanModalOpen}>
        <DialogContent className="sm:max-w-lg bg-dark-card border-red-500/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Confirmar Plano <span className="text-neon-red">{selectedPlan && planData[selectedPlan]?.name}</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedPlan && (
            <div className="space-y-6">
              <Card className="bg-dark-surface border-red-500/20">
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-neon-red rounded-xl mb-4">
                    {planData[selectedPlan].icon}
                  </div>
                  <h4 className="text-xl font-semibold mb-2">{planData[selectedPlan].name}</h4>
                  <p className="text-gray-400 mb-4">{planData[selectedPlan].description}</p>
                  <div className="text-3xl font-bold text-white">{planData[selectedPlan].price}/mês</div>
                </CardContent>
              </Card>
              
              <p className="text-gray-300 text-center">
                Você será redirecionado para o dashboard após a confirmação do pagamento.
              </p>
              
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  onClick={() => setPlanModalOpen(false)}
                  className="flex-1 border-red-500/30 text-gray-300 hover:bg-red-500/10"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={confirmPlan}
                  disabled={selectPlanMutation.isPending}
                  className="flex-1 bg-gradient-to-r from-red-500 to-neon-red hover:shadow-neon transition-all duration-300"
                >
                  {selectPlanMutation.isPending ? "Processando..." : "Confirmar Pagamento"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
