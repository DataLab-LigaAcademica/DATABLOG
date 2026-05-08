# DataLab Platform - Documentação

Este projeto é uma plataforma integrada para o **DataLab**, um núcleo acadêmico de excelência em inteligência de dados. A aplicação combina uma landing page institucional, um blog científico e um painel administrativo completo (Admin OS) para gestão de conteúdo e membros.

## 🚀 Stack Tecnológica

- **Framework:** Next.js 15 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS v4 (Light Mode Premium)
- **Animações:** Framer Motion (`motion/react`)
- **Backend/DB:** Supabase (PostgreSQL + Auth + Storage)
- **Ícones:** Lucide React
- **Markdown:** React Markdown (para posts do blog)

## 📁 Estrutura de Pastas

- `/app`: Rotas e páginas (Home, Blog, Login, Management).
- `/components`: Componentes reutilizáveis (Navbar, Footer, Search, etc).
- `/lib`: Configurações de clientes (Supabase) e utilitários.
- `/hooks`: Custom hooks para integração com Supabase.
- `/public`: Ativos estáticos e imagens.

## 🛠 Funcionalidades Principais

### 1. Landing Page (`/`) - **100% Responsiva**
- Design limpo e moderno com foco em legibilidade e experiência mobile-first.
- **Responsividade Completa:** Otimizada para dispositivos móveis (414x816px) com hamburger menus, imagens responsivas e tabelas com scroll horizontal.
- Seções: Hero, Núcleos Estratégicos, Parcerias, Blog Preview e **Formulário de Candidatura Funcional**.
- **Formulário de Adesão:** Formulário totalmente funcional que salva candidaturas no banco de dados Supabase com validação em tempo real.

### 2. DataBlog (`/posts`)
- Listagem dinâmica de postagens científicas.
- Páginas de post individuais com suporte a Markdown.
- Sistema de categorias e tags.
- **Responsivo:** Layout adaptável para mobile com navegação otimizada.

### 3. Painel Administrativo (`/management`) - **Admin OS**
- **Overview:** Dashboard com estatísticas de engajamento e atividade recente.
- **Journal:** CRUD completo de postagens com editor Markdown e upload de imagens.
- **Applications:** **NOVO** - Gestão completa de candidaturas recebidas via formulário, com status (pending/approved/rejected) e filtros.
- **System:** Configurações do sistema e controle de acesso (em desenvolvimento).
- **Interface Mobile:** Menu hambúrguer responsivo para dispositivos móveis.
- **Autenticação:** Login protegido para administradores.

### 4. Autenticação e Segurança
- Login via Google Auth.
- Porta de entrada protegida para administradores.
- API routes protegidas com validação de sessão.
## 🗄 Banco de Dados
O esquema está organizado sob o schema `site`:

- `site.posts`: Armazena os artigos do blog com imagens, status (draft/published) e timestamps.
- `site.candidaturas`: **NOVO** - Armazena as candidaturas do formulário com nome, email, área de interesse e status.
- `site.authors`: Perfis vinculados aos usuários autenticados.
- `site.tags`: Categorias para organização do blog.

### Regras de Negócio Implementadas (SQL):
- **Limite Diário:** Máximo de 2 postagens por autor por dia.
- **RLS:** Apenas usuários autenticados podem gerenciar posts e ver candidaturas.
- **Validação de Candidaturas:** Email único por candidatura, campos obrigatórios validados.

---

## 💻 Como Rodar Localmente (Guia Passo a Passo)

Siga estas instruções exatas para configurar o ambiente de desenvolvimento em sua máquina Windows, Mac ou Linux:

### 1. Pré-requisitos
Antes de começar, você precisa ter instalado:
- **Node.js** (Versão 18.17 ou superior) -> [Baixar aqui](https://nodejs.org/)
- **Terminal** (PowerShell, Bash, Zsh ou CMD)

### 2. Passo a Passo Completo

**Passo 1: Navegar até a pasta do projeto**
Abra o seu terminal e entre na pasta onde você extraiu o ZIP do projeto:
```bash
cd caminho/para/a/pasta/do-projeto
```
*(Dica: No Windows, você pode digitar `cd` e arrastar a pasta para dentro do terminal)*

**Passo 2: Instalar as Dependências**
Diferente do Python onde usamos `pip install -r requirements.txt`, no ecossistema JavaScript/Next.js usamos o **npm**. Todas as bibliotecas estão listadas no arquivo `package.json`. Execute:
```bash
npm install
```
*Isso criará uma pasta chamada `node_modules` com todos os arquivos necessários.*

**Passo 3: Configurar as Variáveis de Ambiente**
O projeto precisa saber como se conectar ao seu banco de dados Supabase:
1. Na raiz do projeto, crie um arquivo chamado `.env.local`
2. Copie o conteúdo do arquivo `.env.example` para dentro dele.
3. Preencha os valores:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=COLE_SUA_URL_AQUI
   NEXT_PUBLIC_SUPABASE_ANON_KEY=COLE_SUA_CHAVE_ANON_AQUI
   ```

**Passo 4: Subir o App em Modo Desenvolvimento**
Agora, basta iniciar o servidor local:
```bash
npm run dev
```

**Passo 5: Acessar a Plataforma**
Assim que o terminal mostrar "Ready in...", abra o seu navegador e acesse:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🛠 Estado Atual da Plataforma (Maio 2026)

A plataforma encontra-se em uma fase de **Protótipo Funcional Completo**. 

### ✅ Funcionalidades Implementadas:
- **Interface 100% Responsiva:** Design mobile-first otimizado para dispositivos móveis com hamburger menus e navegação touch-friendly.
- **Formulário Funcional:** Sistema completo de candidaturas com API backend, validação e persistência no Supabase.
- **Painel Administrativo Completo:** Gestão de posts e candidaturas com interface moderna e filtros avançados.
- **Sistema de Autenticação:** Login seguro via Google Auth com proteção de rotas.
- **Blog Dinâmico:** CRUD completo de posts com upload de imagens e editor Markdown.

### 🔄 Em Desenvolvimento:
- Sistema de notificações por email para novas candidaturas.
- Export de dados em múltiplos formatos (CSV, PDF).
- Sistema de permissões avançado para múltiplos administradores.
- Analytics e métricas detalhadas de engajamento.

## 🔌 APIs Implementadas

### Candidaturas API (`/api/candidaturas/create`)
- **Método:** POST
- **Função:** Recebe e valida dados do formulário de candidatura
- **Validações:** Email único, campos obrigatórios, formato de email
- **Resposta:** Sucesso ou erro com mensagem detalhada

### Posts API (`/api/posts/create`)
- **Método:** POST
- **Função:** Cria novas postagens no blog com upload de imagens
- **Autenticação:** Requer sessão válida do administrador
- **Funcionalidades:** Upload para Supabase Storage, status draft/published

### Auth API (`/api/auth/login`)
- **Método:** POST
- **Função:** Autenticação via Google OAuth
- **Resposta:** Token de sessão para acesso ao painel administrativo

## 🎨 Design System & UX

### Responsividade Mobile-First
- **Breakpoints:** Otimizado para 414x816px (iPhone standard)
- **Navegação:** Hamburger menus com animações suaves em todas as telas
- **Imagens:** Responsivas com lazy loading e otimização automática
- **Tabelas:** Scroll horizontal em dispositivos móveis
- **Inputs:** Touch-friendly com validação visual em tempo real

### Tema Light Mode Premium
- **Paleta:** Tons suaves com accent colors do DataLab
- **Tipografia:** Font weights variados para hierarquia clara
- **Espaçamento:** Sistema consistente de padding e margins
- **Sombras:** Subtis para profundidade visual sem sobrecarga

### Componentes Reutilizáveis
- **NucleoCard:** Cards responsivos para seções estratégicas
- **DataTable:** Tabelas com scroll horizontal e filtros
- **ModalSystem:** Modais animados com backdrop blur
- **FormControls:** Inputs validados com estados de loading

## 🔧 Configuração e Manutenção

### Gerenciamento de Candidaturas
- Acesse `/management` > Aba "Applications" para visualizar e gerenciar candidaturas
- Status disponíveis: Pending, Approved, Rejected
- Dados salvos automaticamente no Supabase com timestamps

### Upload de Imagens nos Posts
- Imagens são armazenadas no Supabase Storage
- Suporte a PNG, JPG, WEBP até 5MB
- URLs públicas geradas automaticamente

### Adicionando Novos Núcleos
Para adicionar um novo núcleo estratégico na Home, edite o array de componentes `NucleoCard` em `app/page.tsx`.

### Atualizando Logos de Parceiros
As imagens dos parceiros estão em `app/page.tsx`. Certifique-se de que o domínio da imagem esteja autorizado em `next.config.ts` se for externo.


---
© 2026 DataLab. Desenvolvido com foco em inovação e ciência.
