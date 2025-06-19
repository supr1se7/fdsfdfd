import React from 'react';
import { Link } from 'wouter';
import { Bot, Users, Zap, Shield, Check, Star, Crown } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '../lib/queryClient';
import { useAuth } from '../hooks/useAuth';

function Plans() {
  const { user } = useAuth();

  const { data: plans, isLoading } = useQuery({
    queryKey: ['/api/plans'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/plans');
      return response.json();
    },
  });

  const subscribeMutation = useMutation({
    mutationFn: async (planId: number) => {
      const response = await apiRequest('POST', '/api/user/subscriptions', { planId });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/user/subscriptions'] });
      alert('Assinatura criada com sucesso!');
    },
    onError: (error: any) => {
      alert(error.message || 'Erro ao criar assinatura');
    },
  });

  const getBotIcon = (botType: string) => {
    switch (botType) {
      case 'ticket': return <Users className="w-8 h-8" />;
      case 'sales': return <Zap className="w-8 h-8" />;
      case 'moderation': return <Shield className="w-8 h-8" />;
      default: return <Bot className="w-8 h-8" />;
    }
  };

  const getBotColor = (botType: string) => {
    switch (botType) {
      case 'ticket': return 'from-red-600 to-red-800';
      case 'sales': return 'from-pink-600 to-pink-800';
      case 'moderation': return 'from-purple-600 to-purple-800';
      default: return 'from-gray-600 to-gray-800';
    }
  };

  const getFeaturesList = (botType: string) => {
    switch (botType) {
      case 'ticket':
        return [
          'Sistema de tickets privados',
          'Categorias personalizáveis',
          'Sistema de prioridades',
          'Histórico completo',
          'Auto-close de tickets',
          'Notificações automáticas',
        ];
      case 'sales':
        return [
          'Pagamentos automáticos',
          'Produtos digitais',
          'Sistema de cupons',
          'Relatórios de vendas',
          'Entrega automática',
          'Gestão de estoque',
        ];
      case 'moderation':
        return [
          'Auto-moderação inteligente',
          'Sistema de warns',
          'Anti-spam avançado',
          'Filtro de palavrões',
          'Logs de moderação',
          'Banimentos temporários',
        ];
      default:
        return [];
    }
  };

  const handleSubscribe = (planId: number) => {
    if (!user) {
      alert('Você precisa estar logado para assinar um plano');
      return;
    }
    subscribeMutation.mutate(planId);
  };

  return (
    <div className="min-h-screen bg-deep-black text-white">
      <div className="particles fixed inset-0 z-0"></div>
      
      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Bot className="w-8 h-8 text-neon-red animate-pulse-neon" />
            <span className="text-2xl font-bold neon-text">Seven Bots</span>
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <Link href="/dashboard" className="hover:text-neon-red transition-colors">Dashboard</Link>
            ) : (
              <>
                <Link href="/login" className="hover:text-neon-red transition-colors">Login</Link>
                <Link href="/register" className="bg-neon-gradient px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:animate-glow transition-all">
                  Começar Agora
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in-up neon-text">
            Escolha Seu
            <br />
            <span className="bg-neon-gradient bg-clip-text text-transparent">Plano Perfeito</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Transforme seu servidor Discord com nossos bots profissionais.
            <br />
            Configure facilmente através do nosso dashboard intuitivo.
          </p>
        </div>
      </section>

      {/* Plans Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-neon-red border-t-transparent rounded-full mx-auto"></div>
              <p className="mt-4 text-gray-400">Carregando planos...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {plans?.map((plan: any, index: number) => (
                <div 
                  key={plan.id} 
                  className={`glass p-8 rounded-xl hover:animate-float transition-all transform hover:scale-105 ${
                    plan.botType === 'sales' ? 'border-2 border-neon-pink relative' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {plan.botType === 'sales' && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-neon-gradient px-4 py-2 rounded-full flex items-center space-x-1">
                        <Crown className="w-4 h-4" />
                        <span className="text-sm font-bold">MAIS POPULAR</span>
                      </div>
                    </div>
                  )}

                  <div className={`w-16 h-16 bg-gradient-to-r ${getBotColor(plan.botType)} rounded-lg flex items-center justify-center mb-6 text-white`}>
                    {getBotIcon(plan.botType)}
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-6">{plan.description}</p>
                  
                  <div className="text-center mb-8">
                    <span className="text-4xl font-bold neon-text">
                      R$ {(plan.price / 100).toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-gray-400">/mês</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {getFeaturesList(plan.botType).map((feature, idx) => (
                      <li key={idx} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={subscribeMutation.isPending}
                    className={`w-full py-3 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${
                      plan.botType === 'sales' 
                        ? 'bg-neon-gradient hover:animate-glow' 
                        : 'border-2 border-neon-red hover:bg-neon-red hover:text-white neon-border'
                    }`}
                  >
                    {subscribeMutation.isPending ? 'Processando...' : 'Escolher Plano'}
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Custom Plans */}
          <div className="mt-16 text-center">
            <div className="glass p-12 rounded-xl">
              <Star className="w-16 h-16 text-neon-red mx-auto mb-6 animate-pulse-neon" />
              <h3 className="text-3xl font-bold mb-4 neon-text">Precisa de Algo Personalizado?</h3>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Oferecemos soluções personalizadas para servidores grandes ou necessidades específicas.
                Entre em contato conosco para um orçamento personalizado.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="https://discord.gg/sevenbots" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-neon-gradient px-8 py-4 rounded-lg font-semibold hover:animate-glow transition-all transform hover:scale-105"
                >
                  Falar no Discord
                </a>
                <a 
                  href="mailto:contato@sevenbots.com.br"
                  className="border-2 border-neon-red px-8 py-4 rounded-lg font-semibold hover:bg-neon-red hover:text-white transition-all transform hover:scale-105 neon-border"
                >
                  Enviar Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 px-6 py-20 bg-dark-gradient">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12 neon-text">Perguntas Frequentes</h2>
          <div className="grid md:grid-cols-2 gap-8 text-left">
            <div className="glass p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3 text-neon-red">Como funciona o teste grátis?</h3>
              <p className="text-gray-300">
                Você pode testar qualquer bot por 7 dias gratuitamente. Sem compromisso, sem cobrança automática.
              </p>
            </div>
            <div className="glass p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3 text-neon-pink">Posso cancelar a qualquer momento?</h3>
              <p className="text-gray-300">
                Sim! Você pode cancelar sua assinatura a qualquer momento pelo dashboard ou entrando em contato.
              </p>
            </div>
            <div className="glass p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3 text-crimson">Preciso saber programar?</h3>
              <p className="text-gray-300">
                Não! Nosso dashboard é intuitivo e permite configurar tudo sem conhecimento técnico.
              </p>
            </div>
            <div className="glass p-6 rounded-xl">
              <h3 className="text-xl font-bold mb-3 text-neon-red">Tem suporte técnico?</h3>
              <p className="text-gray-300">
                Oferecemos suporte completo via Discord e email para todos os nossos clientes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <Bot className="w-6 h-6 text-neon-red" />
            <span className="text-xl font-bold neon-text">Seven Bots</span>
          </Link>
          <p className="text-gray-400">
            © 2024 Seven Bots. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Plans;