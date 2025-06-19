# Replit.md

## Overview

Seven Bots é uma plataforma web para venda e configuração de bots Discord profissionais. O site oferece três tipos de bots (ticket, vendas e moderação) com um sistema completo de autenticação, dashboard intuitivo e configuração através de interface web. O projeto utiliza uma arquitetura full-stack moderna com React/TypeScript no frontend e Node.js/Express no backend.

## System Architecture

**Frontend:**
- React 18 com TypeScript
- Wouter para roteamento
- TanStack Query para gerenciamento de estado
- Tailwind CSS com tema dark red/neon personalizado
- Animações e efeitos visuais avançados

**Backend:**
- Node.js com Express
- Drizzle ORM com PostgreSQL
- Autenticação JWT
- API RESTful para gerenciamento de usuários, planos e bots

**Database:**
- PostgreSQL com Drizzle ORM
- Tabelas: users, plans, subscriptions, bot_configs

## Key Components

**Páginas implementadas:**
- Landing Page com visual neon e animações
- Sistema de login/registro
- Dashboard para gerenciar bots
- Página de planos com preços
- Sistema de autenticação completo

**Backend:**
- API de autenticação (login/registro)
- Rotas para gerenciar planos e assinaturas
- Sistema de configuração de bots
- Middleware de autenticação JWT

## Data Flow

1. Usuário acessa a landing page
2. Faz registro/login através da API
3. Visualiza planos disponíveis
4. Cria assinatura para um plano
5. Configura bots através do dashboard
6. Gerencia configurações em tempo real

## External Dependencies

**Principais dependências:**
- React, TypeScript, Vite
- Express, CORS, Helmet
- Drizzle ORM, PostgreSQL
- TanStack Query, Wouter
- Tailwind CSS, Lucide Icons
- JWT, bcryptjs

## Deployment Strategy

O projeto está configurado para deployment no Replit com:
- Servidor Express servindo API e frontend
- PostgreSQL database integrado
- Configuração de build otimizada

## Changelog

```
Changelog:
- June 19, 2025: Criação completa do site Seven Bots
  * Landing page com visual dark red/neon
  * Sistema de autenticação completo
  * Dashboard para configuração de bots
  * Página de planos com três opções
  * Backend com APIs RESTful
  * Database schema implementado
```

## User Preferences

```
Preferred communication style: Português, linguagem simples e direta.
Visual theme: Dark red com efeitos neon, muita animação, profissional.
```

## Development Notes

**Próximos passos:**
- Configurar workflow para executar o servidor
- Inicializar banco de dados com dados de exemplo
- Testar todas as funcionalidades
- Implementar configurações específicas de cada tipo de bot

**Características técnicas:**
- Visual dark red com gradientes neon
- Animações fluidas e efeitos de hover
- Interface responsiva e intuitiva
- Sistema de autenticação robusto
- Dashboard para configuração sem código