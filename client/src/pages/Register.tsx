import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Bot, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';
import { useAuth } from '../hooks/useAuth';

function Register() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const { login } = useAuth();

  const registerMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (data.password !== data.confirmPassword) {
        throw new Error('As senhas não coincidem');
      }
      const response = await apiRequest('POST', '/api/auth/register', {
        email: data.email,
        username: data.username,
        password: data.password,
      });
      return response.json();
    },
    onSuccess: (data) => {
      login(data.user, data.token);
      setLocation('/dashboard');
    },
    onError: (error: any) => {
      alert(error.message || 'Erro ao criar conta');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-deep-black text-white flex items-center justify-center px-6">
      <div className="particles fixed inset-0 z-0"></div>
      
      <div className="relative z-10 w-full max-w-md">
        <div className="glass p-8 rounded-xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-2">
              <Bot className="w-10 h-10 text-neon-red animate-pulse-neon" />
              <span className="text-3xl font-bold neon-text">Seven Bots</span>
            </Link>
            <p className="text-gray-400 mt-2">Crie sua conta gratuita</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Nome de usuário</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-dark-gray border border-gray-700 rounded-lg focus:border-neon-red focus:outline-none transition-colors"
                  placeholder="Seu nome de usuário"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-dark-gray border border-gray-700 rounded-lg focus:border-neon-red focus:outline-none transition-colors"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-12 py-3 bg-dark-gray border border-gray-700 rounded-lg focus:border-neon-red focus:outline-none transition-colors"
                  placeholder="Sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirmar senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 bg-dark-gray border border-gray-700 rounded-lg focus:border-neon-red focus:outline-none transition-colors"
                  placeholder="Confirme sua senha"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full bg-neon-gradient py-3 rounded-lg font-semibold hover:animate-glow transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {registerMutation.isPending ? 'Criando conta...' : 'Criar Conta'}
            </button>
          </form>

          {/* Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-gray-400">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-neon-red hover:text-neon-pink transition-colors">
                Faça login
              </Link>
            </p>
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-400 transition-colors">
              ← Voltar ao início
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;