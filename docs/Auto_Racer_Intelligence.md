# Auto Racer Intelligence - Base de Conhecimento

Bem-vindo ao córtex central da plataforma **Auto Racer**. Este documento serve como ponto de partida (MOC - Map of Content) para entender a arquitetura, o fluxo de negócios e as decisões técnicas da aplicação.

## 🧠 Core Architecture
O sistema foi desenvolvido como uma plataforma B2B SaaS (Software as a Service) no modelo de "vitrine desintermediada".

- **Frontend:** React + Vite + TypeScript
- **Estilização:** TailwindCSS (Foco em UI High-End / Dark Mode)
- **Backend:** FastAPI (Python)
- **Banco de Dados:** Supabase (PostgreSQL)

## 🌐 Fluxo de Negócios (B2B SaaS)
A Auto Racer **não intermedeia vendas**. O valor do nosso SaaS está em fornecer uma vitrine premium e um painel de inteligência para o lojista.

1. O cliente final acessa a vitrine pública (`/stores/:slug`).
2. O cliente clica em "Negociar" ou "Detalhes" em um veículo.
3. O sistema redireciona o cliente **diretamente para o WhatsApp do lojista**, usando a propriedade `store.phone` cadastrada no painel.

🔗 Veja mais em: [[Fluxo de Vendas B2B]]

## 🎨 Design System & UI/UX
O painel administrativo foi desenhado para ser uma ferramenta executiva de alto contraste, separando a visão pública da visão de gestão.

### Paleta Administrativa (Modo Executivo)
- **Background (Canva):** `#d2dae2` (Hint of Elusive Blue)
- **Sidebar & Cards:** `#2d3436` (Dracula Orchid)
- **Acentos:** `#1dd1a1` (Neon Green), `#00d2d3` (Cyan), `#ff9f43` (Vibrant Orange).

### Paleta Pública (Vitrine de Luxo)
- O site do cliente final mantém o tema **Dark Absoluto** (`bg-black`), com cards em `#14181C` e bordas finas `#262626` para destacar os carros.

🔗 Veja mais em: [[Guia de Estilo e Tailwind]]

## 📊 Módulos Principais

### Painel Admin (O "Cérebro")
O lojista acessa o sistema via `/admin`. As rotas principais são:
- [[Dashboard Visão Geral]] (`/admin`)
- [[Gestão de Frota]] (`/admin/veiculos`)
- [[Relatórios e Analytics]] (`/admin/relatorios`)
- [[Second Brain IA]] (`/admin/second-brain`)
- [[Perfil da Unidade]] (`/admin/loja`)

### Middleware de Acesso
O acesso ao painel é restrito. Lojistas inadimplentes são bloqueados pelo `tenant_middleware.py` no FastAPI.
*Nota de Manutenção:* Em ambiente local (`localhost`), o middleware força o login na conta `auto-r` (Auto Racer Premium) garantindo um "Passe Livre" para os desenvolvedores.

## 🚀 Próximos Passos (Roadmap)
- [x] Dashboards Dinâmicos com Recharts
- [x] Integração Direta de WhatsApp
- [x] Tema Executivo do Admin
- [ ] Otimização de Upload de Imagens (Comprimir antes de enviar ao Supabase)
- [ ] Geração de Descrição de Carros via LLM (OpenAI)

---
*Atualizado em: Abril de 2026*
