import { useState, useEffect } from "react";
import { Navigation } from "@/components/navigation";
import { AuthModal } from "@/components/auth-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { 
  Settings, 
  Bot, 
  Eye, 
  EyeOff, 
  Zap, 
  Shield, 
  AlertCircle,
  CheckCircle,
  BarChart3,
  ArrowUp,
  CreditCard,
  Box,
  Ticket,
  ShoppingCart,
  Plus,
  Edit,
  Trash2,
  Hash,
  Users,
  Image,
  Palette,
  DollarSign,
  Package,
  Tag,
  FileText,
  Activity
} from "lucide-react";

interface BotConfig {
  id: number;
  userId: number;
  planType: "tickets" | "sales" | "moderation";
  botToken?: string;
  botStatus: "online" | "offline" | "error";
  config?: string;
}

export default function Dashboard() {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [showToken, setShowToken] = useState(false);
  const [tokenInput, setTokenInput] = useState("");
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  // Fetch user data with React Query for real-time updates
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["/api/auth/me"],
    enabled: isAuthenticated,
  });

  const user = userData?.user;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, isLoading, setLocation]);

  const { data: botConfigs, isLoading: configsLoading } = useQuery({
    queryKey: ["/api/bot-configs"],
    enabled: isAuthenticated,
  });

  const createConfigMutation = useMutation({
    mutationFn: async (data: { planType: string; botToken: string }) => {
      const response = await apiRequest("POST", "/api/bot-configs", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bot-configs"] });
      toast({
        title: "Configuração criada com sucesso!",
        description: "Seu bot foi configurado.",
      });
      setTokenInput("");
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar configuração",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const connectBotMutation = useMutation({
    mutationFn: async (configId: number) => {
      const response = await apiRequest("POST", `/api/bot-configs/${configId}/connect`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bot-configs"] });
      toast({
        title: "Bot conectado com sucesso!",
        description: "Seu bot está agora online.",
      });
    },
    onError: () => {
      toast({
        title: "Erro ao conectar bot",
        description: "Verifique o token e tente novamente.",
        variant: "destructive",
      });
    },
  });

  const disconnectBotMutation = useMutation({
    mutationFn: async (configId: number) => {
      const response = await apiRequest("POST", `/api/bot-configs/${configId}/disconnect`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/bot-configs"] });
      toast({
        title: "Bot desconectado",
        description: "Seu bot foi desconectado com sucesso.",
      });
    },
  });

  const openAuthModal = (mode: "login" | "register") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleCreateConfig = () => {
    if (!user?.planType) {
      toast({
        title: "Nenhum plano ativo",
        description: "Você precisa de um plano ativo para configurar um bot.",
        variant: "destructive",
      });
      return;
    }

    if (!tokenInput.trim()) {
      toast({
        title: "Token obrigatório",
        description: "Por favor, insira o token do seu bot Discord.",
        variant: "destructive",
      });
      return;
    }

    createConfigMutation.mutate({
      planType: user.planType,
      botToken: tokenInput,
    });
  };

  const currentConfig = Array.isArray(botConfigs) ? botConfigs.find((config: BotConfig) => config.planType === user?.planType) : undefined;

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case "tickets":
        return <Ticket className="w-6 h-6" />;
      case "sales":
        return <ShoppingCart className="w-6 h-6" />;
      case "moderation":
        return <Shield className="w-6 h-6" />;
      default:
        return <Bot className="w-6 h-6" />;
    }
  };

  const getPlanName = (planType: string) => {
    switch (planType) {
      case "tickets":
        return "Bot de Tickets";
      case "sales":
        return "Bot de Vendas";
      case "moderation":
        return "Bot de Moderação";
      default:
        return "Bot";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <Navigation onAuthModal={openAuthModal} />
      
      <div className="pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Dashboard <span className="gradient-text">Seven Bots</span>
            </h1>
            <p className="text-gray-400">
              Gerencie seus bots Discord de forma profissional
            </p>
          </div>

          {/* User Info Card */}
          <Card className="bg-dark-card border-red-500/30 mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-neon-red rounded-full mr-4 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{user?.name}</h3>
                    <p className="text-gray-400">
                      {user?.planType ? `Plano ${getPlanName(user.planType)} Ativo` : "Nenhum plano ativo"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {currentConfig && (
                    <div className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-2 ${
                        currentConfig.botStatus === "online" 
                          ? "bg-green-500 animate-pulse" 
                          : "bg-red-500"
                      }`}></div>
                      <span className={`text-sm ${
                        currentConfig.botStatus === "online" 
                          ? "text-green-400" 
                          : "text-red-400"
                      }`}>
                        {currentConfig.botStatus === "online" ? "Bot Online" : "Bot Offline"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {user?.planType ? (
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-dark-card border border-red-500/20">
                <TabsTrigger value="overview" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
                  Visão Geral
                </TabsTrigger>
                <TabsTrigger value="config" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
                  Configuração
                </TabsTrigger>
                <TabsTrigger value="analytics" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
                  Analytics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-dark-card border-red-500/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm mb-1">
                            {user.planType === "sales" ? "Vendas Hoje" : 
                             user.planType === "tickets" ? "Tickets Hoje" : "Ações Hoje"}
                          </p>
                          <p className="text-2xl font-bold text-white">
                            {user.planType === "sales" ? "R$ 1.249" : "47"}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <ArrowUp className="w-6 h-6 text-green-400" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-dark-card border-red-500/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Total do Mês</p>
                          <p className="text-2xl font-bold text-white">
                            {user.planType === "sales" ? "R$ 15.320" : "1.243"}
                          </p>
                        </div>
                        <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                          {user.planType === "sales" ? (
                            <CreditCard className="w-6 h-6 text-blue-400" />
                          ) : (
                            getPlanIcon(user.planType)
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-dark-card border-red-500/20">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-400 text-sm mb-1">Status do Bot</p>
                          <p className="text-2xl font-bold text-white">
                            {currentConfig?.botStatus === "online" ? "Online" : "Offline"}
                          </p>
                        </div>
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          currentConfig?.botStatus === "online" 
                            ? "bg-green-500/20" 
                            : "bg-red-500/20"
                        }`}>
                          {currentConfig?.botStatus === "online" ? (
                            <CheckCircle className="w-6 h-6 text-green-400" />
                          ) : (
                            <AlertCircle className="w-6 h-6 text-red-400" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Bot Status Card */}
                <Card className="bg-dark-card border-red-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      {getPlanIcon(user.planType)}
                      <span className="ml-3">{getPlanName(user.planType)}</span>
                    </CardTitle>
                    <CardDescription>
                      Status e configurações do seu bot
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {currentConfig ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Status:</span>
                          <Badge variant={currentConfig.botStatus === "online" ? "default" : "destructive"}>
                            {currentConfig.botStatus === "online" ? "Online" : "Offline"}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">Token configurado:</span>
                          <Badge variant="outline">
                            {currentConfig.botToken ? "Sim" : "Não"}
                          </Badge>
                        </div>

                        <div className="flex space-x-4">
                          {currentConfig.botStatus === "offline" ? (
                            <Button
                              onClick={() => connectBotMutation.mutate(currentConfig.id)}
                              disabled={connectBotMutation.isPending}
                              className="bg-gradient-to-r from-green-500 to-green-600 hover:shadow-lg"
                            >
                              <Zap className="w-4 h-4 mr-2" />
                              {connectBotMutation.isPending ? "Conectando..." : "Conectar Bot"}
                            </Button>
                          ) : (
                            <Button
                              onClick={() => disconnectBotMutation.mutate(currentConfig.id)}
                              disabled={disconnectBotMutation.isPending}
                              variant="destructive"
                            >
                              <Zap className="w-4 h-4 mr-2" />
                              {disconnectBotMutation.isPending ? "Desconectando..." : "Desconectar Bot"}
                            </Button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">
                          Nenhum bot configurado para este plano
                        </p>
                        <p className="text-sm text-gray-500">
                          Configure seu bot na aba "Configuração"
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="config" className="space-y-6">
                <Card className="bg-dark-card border-red-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Settings className="w-5 h-5 mr-3 text-neon-red" />
                      Configuração do Bot
                    </CardTitle>
                    <CardDescription>
                      Configure o token e outras configurações do seu bot Discord
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {currentConfig ? (
                      <div className="space-y-6">
                        <div>
                          <Label className="text-gray-300 mb-2 block">Token do Bot</Label>
                          <div className="relative">
                            <Input
                              type={showToken ? "text" : "password"}
                              value={currentConfig.botToken || ""}
                              readOnly
                              className="bg-dark-bg border-red-500/30 text-white pr-12"
                              placeholder="Token não configurado"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                              onClick={() => setShowToken(!showToken)}
                            >
                              {showToken ? (
                                <EyeOff className="w-4 h-4" />
                              ) : (
                                <Eye className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Seu token é criptografado e seguro
                          </p>
                        </div>

                        {/* Sub-tabs para configurações detalhadas */}
                        <Tabs defaultValue="general" className="space-y-6">
                          <TabsList className="bg-dark-surface border border-red-500/20">
                            <TabsTrigger value="general" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
                              Geral
                            </TabsTrigger>
                            <TabsTrigger value="payments" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
                              Pagamentos
                            </TabsTrigger>
                            <TabsTrigger value="products" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
                              Produtos
                            </TabsTrigger>
                            <TabsTrigger value="coupons" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
                              Cupons
                            </TabsTrigger>
                            <TabsTrigger value="appearance" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
                              Aparência
                            </TabsTrigger>
                          </TabsList>

                          {/* Configuração Geral */}
                          <TabsContent value="general" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <Label className="text-gray-300 mb-2 block">Plano Ativo</Label>
                                <div className="flex items-center p-3 bg-dark-bg border border-red-500/30 rounded-lg">
                                  {getPlanIcon(user.planType)}
                                  <span className="ml-3 text-white">{getPlanName(user.planType)}</span>
                                </div>
                              </div>
                              
                              <div>
                                <Label className="text-gray-300 mb-2 block">Status do Bot</Label>
                                <div className="flex items-center p-3 bg-dark-bg border border-red-500/30 rounded-lg">
                                  <div className={`w-2 h-2 rounded-full mr-3 ${
                                    currentConfig.botStatus === "online" 
                                      ? "bg-green-500 animate-pulse" 
                                      : "bg-red-500"
                                  }`}></div>
                                  <span className={`text-sm ${
                                    currentConfig.botStatus === "online" 
                                      ? "text-green-400" 
                                      : "text-red-400"
                                  }`}>
                                    {currentConfig.botStatus === "online" ? "Online" : "Offline"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4">
                              <h3 className="text-lg font-semibold flex items-center">
                                <Hash className="w-5 h-5 mr-2 text-neon-red" />
                                Configuração de Canais
                              </h3>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-gray-300 mb-2 block">Canal de Logs Administrativos</Label>
                                  <Input
                                    placeholder="ID do canal (ex: 1236078196718309437)"
                                    className="bg-dark-bg border-red-500/30 text-white"
                                  />
                                </div>
                                <div>
                                  <Label className="text-gray-300 mb-2 block">Canal de Logs Públicos</Label>
                                  <Input
                                    placeholder="ID do canal"
                                    className="bg-dark-bg border-red-500/30 text-white"
                                  />
                                </div>
                                <div>
                                  <Label className="text-gray-300 mb-2 block">Categoria dos Carrinhos</Label>
                                  <Input
                                    placeholder="ID da categoria"
                                    className="bg-dark-bg border-red-500/30 text-white"
                                  />
                                </div>
                                <div>
                                  <Label className="text-gray-300 mb-2 block">
                                    <Users className="w-4 h-4 inline mr-2" />
                                    Cargo de Cliente
                                  </Label>
                                  <Input
                                    placeholder="ID do cargo"
                                    className="bg-dark-bg border-red-500/30 text-white"
                                  />
                                </div>
                              </div>

                              <div className="flex items-center justify-between p-4 bg-dark-surface border border-red-500/20 rounded-lg">
                                <div>
                                  <h4 className="font-semibold text-white">Sistema de Vendas</h4>
                                  <p className="text-sm text-gray-400">Ativar/desativar vendas no servidor</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-green-500 text-green-400 hover:bg-green-500/10"
                                  >
                                    Ativar
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="border-red-500 text-red-400 hover:bg-red-500/10"
                                  >
                                    Pausar
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </TabsContent>

                          {/* Configuração de Pagamentos */}
                          <TabsContent value="payments" className="space-y-6">
                            <div className="space-y-6">
                              {/* Mercado Pago */}
                              <div className="border border-green-500/30 rounded-lg p-6 bg-green-500/5">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                  <CreditCard className="w-5 h-5 mr-2 text-green-400" />
                                  Mercado Pago (Automático)
                                </h3>
                                <div className="space-y-4">
                                  <div>
                                    <Label className="text-gray-300 mb-2 block">Access Token</Label>
                                    <Input
                                      type="password"
                                      placeholder="APP_USR-xxxxxxxx-xxxxxx-xxxxxxxx"
                                      className="bg-dark-bg border-green-500/30 text-white"
                                    />
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="flex items-center justify-between">
                                      <Label className="text-gray-300">PIX</Label>
                                      <Button variant="outline" size="sm" className="border-green-500 text-green-400">
                                        ON
                                      </Button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                      <Label className="text-gray-300">Pagar no Site</Label>
                                      <Button variant="outline" size="sm" className="border-green-500 text-green-400">
                                        ON
                                      </Button>
                                    </div>
                                    <div>
                                      <Label className="text-gray-300 mb-2 block">Tempo (min)</Label>
                                      <Input
                                        type="number"
                                        defaultValue="15"
                                        className="bg-dark-bg border-green-500/30 text-white"
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* PIX Manual */}
                              <div className="border border-yellow-500/30 rounded-lg p-6 bg-yellow-500/5">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                  <DollarSign className="w-5 h-5 mr-2 text-yellow-400" />
                                  PIX Manual (Semiautomático)
                                </h3>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <Label className="text-gray-300 mb-2 block">Chave PIX</Label>
                                      <Input
                                        placeholder="email@exemplo.com"
                                        className="bg-dark-bg border-yellow-500/30 text-white"
                                      />
                                    </div>
                                    <div>
                                      <Label className="text-gray-300 mb-2 block">Tipo de Chave</Label>
                                      <select className="w-full bg-dark-bg border border-yellow-500/30 rounded-md px-3 py-2 text-white">
                                        <option value="">Selecione</option>
                                        <option value="email">Email</option>
                                        <option value="cpf">CPF</option>
                                        <option value="cnpj">CNPJ</option>
                                        <option value="telefone">Telefone</option>
                                        <option value="random">Aleatória</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-gray-300 mb-2 block">QR Code (URL da Imagem)</Label>
                                    <Input
                                      placeholder="https://exemplo.com/qrcode.png"
                                      className="bg-dark-bg border-yellow-500/30 text-white"
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Sistema de Saldo */}
                              <div className="border border-blue-500/30 rounded-lg p-6 bg-blue-500/5">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                  <DollarSign className="w-5 h-5 mr-2 text-blue-400" />
                                  Sistema de Saldo
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div className="flex items-center justify-between">
                                    <Label className="text-gray-300">Status</Label>
                                    <Button variant="outline" size="sm" className="border-green-500 text-green-400">
                                      ON
                                    </Button>
                                  </div>
                                  <div>
                                    <Label className="text-gray-300 mb-2 block">Bônus (%)</Label>
                                    <Input
                                      type="number"
                                      defaultValue="0"
                                      className="bg-dark-bg border-blue-500/30 text-white"
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-gray-300 mb-2 block">Valor Mínimo</Label>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      defaultValue="0"
                                      className="bg-dark-bg border-blue-500/30 text-white"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TabsContent>

                          {/* Configuração de Produtos */}
                          <TabsContent value="products" className="space-y-6">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold flex items-center">
                                <Package className="w-5 h-5 mr-2 text-neon-red" />
                                Gerenciar Produtos
                              </h3>
                              <Button className="bg-gradient-to-r from-red-500 to-neon-red hover:shadow-neon">
                                <Plus className="w-4 h-4 mr-2" />
                                Novo Produto
                              </Button>
                            </div>

                            <div className="space-y-4">
                              {/* Produto de exemplo baseado no JSON */}
                              <div className="border border-red-500/20 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                  <div>
                                    <h4 className="font-semibold text-white">Produto Teste</h4>
                                    <p className="text-sm text-gray-400">R$ 10,00 • 0 itens em estoque</p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Badge variant="outline" className="text-green-400 border-green-400">
                                      Cupom: ON
                                    </Badge>
                                    <Button variant="ghost" size="sm">
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="text-sm text-gray-300">
                                  <p><strong>Descrição:</strong> Não configurado ainda</p>
                                  <p><strong>Cor:</strong> #090b0c</p>
                                  <p><strong>Categoria:</strong> Não definida</p>
                                </div>
                              </div>

                              <div className="border-2 border-dashed border-red-500/30 rounded-lg p-8 text-center">
                                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-400 mb-4">Adicione produtos para sua loja</p>
                                <p className="text-sm text-gray-500 mb-4">
                                  Configure nome, preço, estoque, banner e outras opções
                                </p>
                                <Button variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/10">
                                  <Plus className="w-4 h-4 mr-2" />
                                  Criar Produto
                                </Button>
                              </div>
                            </div>
                          </TabsContent>

                          {/* Configuração de Cupons */}
                          <TabsContent value="coupons" className="space-y-6">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold flex items-center">
                                <Tag className="w-5 h-5 mr-2 text-neon-red" />
                                Cupons de Desconto
                              </h3>
                              <Button className="bg-gradient-to-r from-red-500 to-neon-red hover:shadow-neon">
                                <Plus className="w-4 h-4 mr-2" />
                                Novo Cupom
                              </Button>
                            </div>

                            <div className="space-y-4">
                              {/* Cupons baseados no JSON do bot */}
                              <div className="border border-red-500/20 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-semibold flex items-center">
                                      <Tag className="w-4 h-4 mr-2 text-yellow-400" />
                                      SAMUEL
                                    </h4>
                                    <p className="text-sm text-gray-400">99% de desconto • Valor mín: R$ 0,10 • 1 uso disponível</p>
                                    <p className="text-xs text-gray-500">Cargo: todos</p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Badge variant="outline" className="text-green-400 border-green-400">
                                      Ativo
                                    </Badge>
                                    <Button variant="ghost" size="sm">
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>

                              <div className="border border-red-500/20 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-semibold flex items-center">
                                      <Tag className="w-4 h-4 mr-2 text-blue-400" />
                                      LOJA FROSTZIN
                                    </h4>
                                    <p className="text-sm text-gray-400">10% de desconto • Valor mín: R$ 3,80 • 35 usos disponíveis</p>
                                    <p className="text-xs text-gray-500">Cargo: todos</p>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Badge variant="outline" className="text-green-400 border-green-400">
                                      Ativo
                                    </Badge>
                                    <Button variant="ghost" size="sm">
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>

                              <div className="border-2 border-dashed border-red-500/30 rounded-lg p-8 text-center">
                                <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-400 mb-4">Crie cupons para oferecer descontos</p>
                                <p className="text-sm text-gray-500 mb-4">
                                  Configure porcentagem, valor mínimo, quantidade de usos e cargos
                                </p>
                                <Button variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/10">
                                  <Plus className="w-4 h-4 mr-2" />
                                  Criar Cupom
                                </Button>
                              </div>
                            </div>
                          </TabsContent>

                          {/* Configuração de Aparência */}
                          <TabsContent value="appearance" className="space-y-6">
                            <div className="space-y-6">
                              <div>
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                  <Palette className="w-5 h-5 mr-2 text-neon-red" />
                                  Personalização Visual
                                </h3>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <Label className="text-gray-300 mb-2 block">
                                      <Palette className="w-4 h-4 inline mr-2" />
                                      Cor Padrão (Hex)
                                    </Label>
                                    <div className="flex items-center space-x-3">
                                      <Input
                                        placeholder="#090b0c"
                                        className="bg-dark-bg border-red-500/30 text-white"
                                      />
                                      <div className="w-10 h-10 bg-[#090b0c] border border-red-500/30 rounded"></div>
                                    </div>
                                  </div>

                                  <div>
                                    <Label className="text-gray-300 mb-2 block">
                                      <Activity className="w-4 h-4 inline mr-2" />
                                      Status de Presença
                                    </Label>
                                    <select className="w-full bg-dark-bg border border-red-500/30 rounded-md px-3 py-2 text-white">
                                      <option value="online">Online</option>
                                      <option value="idle">Ausente</option>
                                      <option value="dnd">Não Perturbe</option>
                                      <option value="invisible">Invisível</option>
                                    </select>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <Label className="text-gray-300 mb-2 block">Tipo de Atividade</Label>
                                    <select className="w-full bg-dark-bg border border-red-500/30 rounded-md px-3 py-2 text-white">
                                      <option value="Playing">Jogando</option>
                                      <option value="Streaming">Transmitindo</option>
                                      <option value="Listening">Ouvindo</option>
                                      <option value="Watching">Assistindo</option>
                                      <option value="Competing">Competindo</option>
                                    </select>
                                  </div>

                                  <div>
                                    <Label className="text-gray-300 mb-2 block">Texto da Atividade</Label>
                                    <Input
                                      placeholder="Ex: Gerenciando vendas..."
                                      className="bg-dark-bg border-red-500/30 text-white"
                                    />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div>
                                    <Label className="text-gray-300 mb-2 block">
                                      <Image className="w-4 h-4 inline mr-2" />
                                      Banner Padrão
                                    </Label>
                                    <Input
                                      placeholder="URL da imagem (https://...)"
                                      className="bg-dark-bg border-red-500/30 text-white"
                                    />
                                  </div>

                                  <div>
                                    <Label className="text-gray-300 mb-2 block">
                                      <Image className="w-4 h-4 inline mr-2" />
                                      Miniatura Padrão
                                    </Label>
                                    <Input
                                      placeholder="URL da imagem (https://...)"
                                      className="bg-dark-bg border-red-500/30 text-white"
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="pt-4 border-t border-red-500/20">
                                <Button className="bg-gradient-to-r from-red-500 to-neon-red hover:shadow-neon">
                                  <Settings className="w-4 h-4 mr-2" />
                                  Salvar Configurações
                                </Button>
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="text-center py-8">
                          <Bot className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">Configure seu Bot</h3>
                          <p className="text-gray-400 mb-6">
                            Insira o token do seu bot Discord para começar
                          </p>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="token" className="text-gray-300 mb-2 block">
                              Token do Bot Discord
                            </Label>
                            <div className="relative">
                              <Input
                                id="token"
                                type={showToken ? "text" : "password"}
                                value={tokenInput}
                                onChange={(e) => setTokenInput(e.target.value)}
                                placeholder="Cole o token do seu bot aqui"
                                className="bg-dark-bg border-red-500/30 text-white pr-12 focus:border-red-500"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                                onClick={() => setShowToken(!showToken)}
                              >
                                {showToken ? (
                                  <EyeOff className="w-4 h-4" />
                                ) : (
                                  <Eye className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>

                          <div className="bg-dark-surface border border-red-500/20 rounded-lg p-4">
                            <h4 className="font-medium mb-2 text-white">Como obter o token:</h4>
                            <ol className="text-sm text-gray-400 space-y-1">
                              <li>1. Acesse o Discord Developer Portal</li>
                              <li>2. Crie uma nova aplicação ou selecione uma existente</li>
                              <li>3. Vá para a seção "Bot"</li>
                              <li>4. Copie o token do bot</li>
                              <li>5. Cole o token no campo acima</li>
                            </ol>
                          </div>

                          <Button
                            onClick={handleCreateConfig}
                            disabled={createConfigMutation.isPending}
                            className="w-full bg-gradient-to-r from-red-500 to-neon-red hover:shadow-neon transition-all duration-300"
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            {createConfigMutation.isPending ? "Configurando..." : "Configurar Bot"}
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-6">
                <Card className="bg-dark-card border-red-500/30">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BarChart3 className="w-5 h-5 mr-3 text-neon-red" />
                      Analytics do Bot
                    </CardTitle>
                    <CardDescription>
                      Métricas e relatórios do seu bot
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-12">
                      <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Analytics em Desenvolvimento</h3>
                      <p className="text-gray-400">
                        Relatórios detalhados estarão disponíveis em breve
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          ) : (
            <Card className="bg-dark-card border-red-500/30">
              <CardContent className="p-12 text-center">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold mb-4">Nenhum Plano Ativo</h3>
                <p className="text-gray-400 mb-6">
                  Você precisa de um plano ativo para acessar o dashboard.
                </p>
                <Button
                  onClick={() => setLocation("/")}
                  className="bg-gradient-to-r from-red-500 to-neon-red hover:shadow-neon transition-all duration-300"
                >
                  Ver Planos Disponíveis
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
}
