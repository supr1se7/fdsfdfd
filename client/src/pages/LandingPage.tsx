import React from 'react';
import { Link } from 'wouter';
import { Bot, Zap, Shield, Users, Star, ChevronRight, Code, Settings } from 'lucide-react';

function LandingPage() {
  return (
    <div className="min-h-screen bg-deep-black text-white overflow-hidden">
      {/* Background particles */}
      <div className="particles fixed inset-0 z-0"></div>
      
      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <nav className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="w-8 h-8 text-neon-red animate-pulse-neon" />
            <span className="text-2xl font-bold neon-text">Seven Bots</span>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/plans" className="hover:text-neon-red transition-colors">Planos</Link>
            <Link href="/login" className="hover:text-neon-red transition-colors">Login</Link>
            <Link href="/register" className="bg-neon-gradient px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:animate-glow transition-all">
              Começar Agora
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 animate-fade-in-up neon-text">
            Bots Discord
            <br />
            <span className="bg-neon-gradient bg-clip-text text-transparent">Profissionais</span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-gray-300 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Criamos e vendemos bots Discord personalizados para transformar seu servidor.
            <br />
            Bot de ticket, vendas e moderação configuráveis pelo nosso dashboard.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Link href="/plans" className="bg-neon-gradient px-8 py-4 rounded-lg font-semibold text-lg hover:animate-glow transition-all transform hover:scale-105">
              Ver Planos <ChevronRight className="inline ml-2" />
            </Link>
            <Link href="/register" className="border-2 border-neon-red px-8 py-4 rounded-lg font-semibold text-lg hover:bg-neon-red hover:text-white transition-all transform hover:scale-105 neon-border">
              Teste Grátis
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 neon-text">
            Nossos Bots
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Bot de Ticket */}
            <div className="glass p-8 rounded-xl hover:animate-float transition-all transform hover:scale-105">
              <div className="w-16 h-16 bg-neon-gradient rounded-lg flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-neon-red">Bot de Ticket</h3>
              <p className="text-gray-300 mb-6">
                Sistema completo de suporte com tickets privados, categorias personalizadas e histórico de conversas.
              </p>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Tickets privados automáticos</li>
                <li>• Categorias customizáveis</li>
                <li>• Sistema de prioridades</li>
                <li>• Logs completos</li>
              </ul>
            </div>

            {/* Bot de Vendas */}
            <div className="glass p-8 rounded-xl hover:animate-float transition-all transform hover:scale-105" style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 bg-neon-gradient rounded-lg flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-neon-pink">Bot de Vendas</h3>
              <p className="text-gray-300 mb-6">
                Automatize suas vendas com sistema de pagamento integrado, produtos digitais e entregas automáticas.
              </p>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Pagamentos automáticos</li>
                <li>• Entrega de produtos</li>
                <li>• Sistema de cupons</li>
                <li>• Relatórios de vendas</li>
              </ul>
            </div>

            {/* Bot de Moderação */}
            <div className="glass p-8 rounded-xl hover:animate-float transition-all transform hover:scale-105" style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 bg-neon-gradient rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-crimson">Bot de Moderação</h3>
              <p className="text-gray-300 mb-6">
                Mantenha seu servidor seguro com auto-moderação, sistema de warns e banimentos inteligentes.
              </p>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>• Auto-moderação inteligente</li>
                <li>• Sistema de warns</li>
                <li>• Anti-spam avançado</li>
                <li>• Logs de moderação</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="relative z-10 px-6 py-20 bg-dark-gradient">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 neon-text">
            Dashboard Intuitivo
          </h2>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
            Configure seus bots facilmente através do nosso dashboard web. 
            Sem necessidade de conhecimento técnico, tudo na palma da sua mão.
          </p>
          <div className="glass p-8 rounded-xl">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-left">
                <h3 className="text-2xl font-bold mb-4 text-neon-red">Configuração Simples</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Settings className="w-5 h-5 text-neon-red" />
                    <span>Interface drag-and-drop</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Code className="w-5 h-5 text-neon-pink" />
                    <span>Sem código necessário</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-crimson" />
                    <span>Configuração em tempo real</span>
                  </div>
                </div>
              </div>
              <div className="bg-dark-gray p-6 rounded-lg neon-border">
                <div className="text-center">
                  <Bot className="w-24 h-24 text-neon-red mx-auto mb-4 animate-pulse-neon" />
                  <p className="text-neon-red font-bold">Dashboard Preview</p>
                  <p className="text-sm text-gray-400 mt-2">Configure facilmente seus bots</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 neon-text">
            Pronto para Começar?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Junte-se a milhares de servidores que já usam nossos bots.
            Comece hoje mesmo e transforme seu Discord!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-neon-gradient px-10 py-4 rounded-lg font-bold text-xl hover:animate-glow transition-all transform hover:scale-105">
              Criar Conta Grátis
            </Link>
            <Link href="/plans" className="border-2 border-neon-red px-10 py-4 rounded-lg font-bold text-xl hover:bg-neon-red hover:text-white transition-all transform hover:scale-105 neon-border">
              Ver Preços
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Bot className="w-6 h-6 text-neon-red" />
            <span className="text-xl font-bold neon-text">Seven Bots</span>
          </div>
          <p className="text-gray-400">
            © 2024 Seven Bots. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;