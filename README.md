# 🚀 DevStash

**DevStash** é um hub centralizado de conhecimento para desenvolvedores, projetado para armazenar e organizar snippets de código, prompts de IA, comandos de terminal, notas e links em um único lugar pesquisável e aprimorado por IA.

## 📌 O Problema
Desenvolvedores frequentemente dispersam informações essenciais em diversas ferramentas (Notion, chats de IA, bookmarks, históricos de terminal). Isso causa perda de contexto, fadiga de decisão e dificuldade em recuperar conhecimentos valiosos rapidamente.

## ✨ O Conceito
Prover uma plataforma unificada onde todo o "arsenal" de um desenvolvedor esteja a um clique de distância, com organização por coleções, busca global e assistência de IA para sumarização e otimização.

## 🛠️ Tech Stack
- **Framework:** Next.js 15+ (React 19)
- **Estilização:** Tailwind CSS v4 + ShadCN UI
- **Banco de Dados:** PostgreSQL (Neon) + Prisma ORM
- **Autenticação:** NextAuth.js v5

## 📈 Status do Projeto

### ✅ Já concluído
- Setup inicial do projeto Next.js com TypeScript.
- Configuração do Tailwind CSS v4 (Baseado em CSS).
- Estrutura de documentação e diretrizes de codificação (`GEMINI.md`, `/context`).

### 🚀 Próximas Tarefas (MVP)
1. **Modelagem de Dados:** Implementar o schema Prisma (User, Item, Collection, Tag).
2. **Autenticação:** Configurar NextAuth (GitHub & Email).
3. **CRUD de Itens:** Criar interface e lógica para gerenciar Snippets, Prompts e Links.
4. **Coleções:** Implementar sistema de pastas/agrupamentos.
5. **Busca:** Implementar busca textual global.

## 🛠️ Como Executar

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Configure as variáveis de ambiente:**
   Crie um arquivo `.env` com suas credenciais do banco de dados e provedores de auth.

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.

4. **Build para produção:**
   ```bash
   npm run build
   ```

---
🏗️ *DevStash — Store Smarter. Build Faster.*
