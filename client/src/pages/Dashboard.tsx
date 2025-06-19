import React, { useState } from 'react';
import { Link } from 'wouter';
import { Bot, Plus, Settings, Users, Zap, Shield, LogOut, Server } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest, queryClient } from '../lib/queryClient';
import { useAuth } from '../hooks/useAuth';

function Dashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('bots');

  const { data: subscriptions, isLoading: subsLoading } = useQuery({
    queryKey: ['/api/user/subscriptions'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/user/subscriptions');
      return response.json();
    },
  });

  const { data: botConfigs, isLoading: botsLoading } = useQuery({
    queryKey: ['/api/user/bots'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/user/bots');
      return response.json();
    },
  });

  const getBotIcon = (botType: string) => {
    switch (botType) {
      case 'ticket': return <Users className="w-6 h-6" />;
      case 'sales': return <Zap className="w-6 h-6" />;
      case 'moderation': return <Shield className="w-6 h-6" />;
      default: return <Bot className="w-6 h-6" />;
    }
  };

  const getBotColor = (botType: string) => {
    switch (botType) {
      case 'ticket': return 'text-neon-red';
      case 'sales': return 'text-neon-pink';
      case 'moderation': return 'text-crimson';
      default: return 'text-white';
    }
  };

  return (
    <div className="min-h-screen bg-deep-black text-white">
      <div className="particles fixed inset-0 z-0"></div>
      
      {/* Header */}
      <header className="relative z-10 px-6 py-4 border-b border-gray-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Bot className="w-8 h-8 text-neon-red animate-pulse-neon" />
            <span className="text-2xl font-bold neon-text">Seven Bots</span>
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">Olá, {user?.username}</span>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 bg-dark-gray rounded-lg hover:bg-gray-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass p-6 rounded-xl">
              <h2 className="text-xl font-bold mb-6 neon-text">Dashboard</h2>
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab('bots')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'bots' 
                      ? 'bg-neon-red text-white' 
                      : 'hover:bg-gray-700'
                  }`}
                >
                  <Bot className="inline w-5 h-5 mr-3" />
                  Meus Bots
                </button>
                <button
                  onClick={() => setActiveTab('subscriptions')}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === 'subscriptions' 
                      ? 'bg-neon-red text-white' 
                      : 'hover:bg-gray-700'
                  }`}
                >
                  <Settings className="inline w-5 h-5 mr-3" />
                  Assinaturas
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'bots' && (
              <div>
                <div className="flex items-center justify-between mb-8">
                  <h1 className="text-3xl font-bold neon-text">Meus Bots</h1>
                  <Link
                    href="/plans"
                    className="flex items-center space-x-2 bg-neon-gradient px-6 py-3 rounded-lg font-semibold hover:animate-glow transition-all"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Adicionar Bot</span>
                  </Link>
                </div>

                {botsLoading ? (
                  <div className="glass p-8 rounded-xl text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-neon-red border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-4 text-gray-400">Carregando bots...</p>
                  </div>
                ) : botConfigs?.length === 0 ? (
                  <div className="glass p-12 rounded-xl text-center">
                    <Bot className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Nenhum bot configurado</h3>
                    <p className="text-gray-400 mb-6">
                      Você ainda não tem nenhum bot ativo. Escolha um plano para começar!
                    </p>
                    <Link
                      href="/plans"
                      className="bg-neon-gradient px-6 py-3 rounded-lg font-semibold hover:animate-glow transition-all inline-block"
                    >
                      Ver Planos
                    </Link>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {botConfigs?.map((bot: any) => (
                      <div key={bot.id} className="glass p-6 rounded-xl hover:animate-float transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className={`${getBotColor(bot.botType)}`}>
                              {getBotIcon(bot.botType)}
                            </div>
                            <div>
                              <h3 className="font-bold">{bot.serverName || 'Servidor'}</h3>
                              <p className="text-sm text-gray-400 capitalize">{bot.botType}</p>
                            </div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs ${
                            bot.isActive 
                              ? 'bg-green-900 text-green-300' 
                              : 'bg-red-900 text-red-300'
                          }`}>
                            {bot.isActive ? 'Ativo' : 'Inativo'}
                          </div>
                        </div>
                        <div className="flex items-center text-sm text-gray-400 mb-4">
                          <Server className="w-4 h-4 mr-2" />
                          <span>ID: {bot.serverId}</span>
                        </div>
                        <button className="w-full bg-dark-gray hover:bg-gray-700 py-2 rounded-lg transition-colors">
                          Configurar Bot
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'subscriptions' && (
              <div>
                <h1 className="text-3xl font-bold mb-8 neon-text">Minhas Assinaturas</h1>

                {subsLoading ? (
                  <div className="glass p-8 rounded-xl text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-neon-red border-t-transparent rounded-full mx-auto"></div>
                    <p className="mt-4 text-gray-400">Carregando assinaturas...</p>
                  </div>
                ) : subscriptions?.length === 0 ? (
                  <div className="glass p-12 rounded-xl text-center">
                    <Settings className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Nenhuma assinatura ativa</h3>
                    <p className="text-gray-400 mb-6">
                      Você não possui nenhuma assinatura ativa. Escolha um plano para começar!
                    </p>
                    <Link
                      href="/plans"
                      className="bg-neon-gradient px-6 py-3 rounded-lg font-semibold hover:animate-glow transition-all inline-block"
                    >
                      Ver Planos
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {subscriptions?.map((sub: any) => (
                      <div key={sub.id} className="glass p-6 rounded-xl">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-xl font-bold">Plano Ativo</h3>
                            <p className="text-gray-400">ID da assinatura: {sub.id}</p>
                          </div>
                          <div className={`px-4 py-2 rounded-full ${
                            sub.isActive 
                              ? 'bg-green-900 text-green-300' 
                              : 'bg-red-900 text-red-300'
                          }`}>
                            {sub.isActive ? 'Ativo' : 'Inativo'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;