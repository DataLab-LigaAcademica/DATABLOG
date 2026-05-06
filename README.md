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

### 1. Landing Page (`/`)
- Design limpo e moderno com foco em legibilidade.
- Seções: Hero, Núcleos Estratégicos, Parcerias, Blog Preview e Formulário de Adesão.

### 2. DataBlog (`/posts`)
- Listagem dinâmica de postagens científicas.
- Páginas de post individuais com suporte a Markdown.
- Sistema de categorias e tags.

### 3. Painel Administrativo (`/management`)
- **Overview:** Dashboard com estatísticas de engajamento e atividade recente.
- **Journal:** CRUD completo de postagens com editor Markdown.
- **Network:** Visualização de candidatos e novos membros interessados.
- **System:** Gestão de permissões e configurações do núcleo.

### 4. Autenticação e Segurança
- Login via Google Auth / Supabase.
- Porta de entrada protegida para administradores.
- RLS (Row Level Security) configurado no banco de dados para proteção de dados sensíveis.

## 🗄 Banco de Dados (Supabase)

O esquema está organizado sob o schema `site`:

- `site.posts`: Armazena os artigos do blog.
- `site.members`: Armazena os dados do formulário de adesão publico.
- `site.authors`: Perfis vinculados aos usuários autenticados.
- `site.tags`: Categorias para organização do blog.

### Regras de Negócio Implementadas (SQL):
- **Limite Diário:** Máximo de 2 postagens por autor por dia (via Trigger).
- **RLS:** Apenas usuários autenticados podem gerenciar posts e ver membros.

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

A plataforma encontra-se em uma fase de **Protótipo Funcional Avançado**. A interface (UI) está 100% finalizada seguindo os padrões de design do DataLab, enquanto a lógica de backend está sendo integrada progressivamente.

### 📊 Status dos Módulos (Admin OS)
- **Login:** Interface finalizada com simulação de autenticação (Mock). Pronto para ativação do Supabase Auth.
- **Overview (Dashboard):** Layout estruturado com placeholders para métricas em tempo real.
- **Journal (Blog Admin):** Sistema de rascunho visual integrado. Botões de ação em modo de "Segurança" (Indisponível).
- **Network (Membros):** Tabela de visualização preparada para consumir dados da tabela `site.members`.
- **System (Config):** Interface de controle de acesso preparada para integração com políticas de RLS.

---

## 🚀 Como Ativar as Funcionalidades "Indisponíveis"

Atualmente, no módulo de **Criação de Post**, os botões "Deploy to Journal" e "Save as Draft" acionam um estado de erro visual (vermelho) indicando indisponibilidade. Para torná-los funcionais, siga os passos abaixo:

### 1. Remover o Bloqueio Visual
No arquivo `app/management/page.tsx`, remova o estado `actionUnavailable` e a lógica de `onClick` que dispara o `setActionUnavailable(true)`.

### 2. Implementar a Persistência (Supabase)
Substitua o `onClick` por uma função assíncrona (Server Action ou API Route) que realize o seguinte:
```typescript
const { data, error } = await supabase
  .from('posts')
  .insert([
    { 
      title: titleFromInput, 
      content: contentFromTextarea,
      status: 'published', // ou 'draft' para o botão de rascunho
      author_id: currentUser.id 
    }
  ]);
```

### 3. Requisitos de Infraestrutura
Para que a gravação funcione, certifique-se de que:
- As chaves `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` estejam configuradas no `.env.local`.
- A tabela `site.posts` exista no banco de dados com as colunas corretas.
- As políticas de RLS (Row Level Security) permitam `INSERT` para usuários autenticados.

---

## 🔧 Configuração e Manutenção

### Variáveis de Ambiente (`.env`)
Certifique-se de configurar as seguintes chaves no seu ambiente:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (apenas server-side)

### Adicionando Novos Núcleos
Para adicionar um novo núcleo estratégico na Home, edite o array de componentes `NucleoCard` em `app/page.tsx`.

### Atualizando Logos de Parceiros
As imagens dos parceiros estão em `app/page.tsx`. Certifique-se de que o domínio da imagem esteja autorizado em `next.config.ts` se for externo.

## 📈 Próximos Passos (Backlog)
- [ ] Implementar sistema de comentários via Supabase.
- [ ] Otimização de SEO dinâmica nos posts.
- [ ] Painel de métricas em tempo real com Recharts.
- [ ] Exportação de relatórios de membros em PDF/Excel.

---
© 2026 DataLab. Desenvolvido com foco em inovação e ciência.
