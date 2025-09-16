
# 🏡 Sítio Recanto da Limeira - Sistema de Locação

Um sistema completo de locação desenvolvido com **Next.js 14**, **TypeScript**, **Tailwind CSS** e **PostgreSQL** para gerenciar reservas de um sítio em Minas Gerais.

## 🚀 **Funcionalidades Principais**

### 🌐 **Site Público:**
- ✅ Homepage com galeria de fotos
- ✅ Sistema de reservas online  
- ✅ Seção sobre o sítio e localização
- ✅ Formulário de contato
- ✅ Design responsivo e moderno

### 🔐 **Painel Administrativo:**
- ✅ Login seguro com NextAuth.js
- ✅ Dashboard com estatísticas
- ✅ Gerenciamento de reservas
- ✅ Criação manual de reservas
- ✅ Sistema de bloqueio de datas
- ✅ Detecção de conflitos automática

### 🔄 **Sincronização Airbnb:**
- ✅ Importação automática via iCal
- ✅ Cron job executando a cada 4 horas
- ✅ Sincronização manual pelo painel
- ✅ Controle de ativação/desativação

### 📧 **Notificações por Email:**
- ✅ Notificação automática para novas reservas
- ✅ Templates profissionais em HTML
- ✅ Integração com SendGrid
- ✅ Suporte a 100 emails/dia gratuitos

### 🗄️ **Banco de Dados:**
- ✅ PostgreSQL com Prisma ORM
- ✅ Modelos para reservas, usuários, datas bloqueadas
- ✅ Relacionamentos e validações
- ✅ Seeds para dados iniciais

## 🛠️ **Tecnologias Utilizadas**

- **Framework:** Next.js 14 (App Router)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Banco de Dados:** PostgreSQL + Prisma ORM
- **Autenticação:** NextAuth.js
- **UI Components:** Radix UI + Shadcn/ui
- **Email:** SendGrid API
- **Cron Jobs:** node-cron
- **Validação:** Zod + Yup

## 📦 **Instalação e Configuração**

### **1. Clone o repositório:**
```bash
git clone https://github.com/seu-usuario/sitio-recanto-limeira.git
cd sitio-recanto-limeira
```

### **2. Instale as dependências:**
```bash
cd app
yarn install
```

### **3. Configure as variáveis de ambiente:**
Crie um arquivo `.env` baseado no `.env.example`:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/sitio_db"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="seu-secret-muito-seguro"

# Email (SendGrid)
SENDGRID_API_KEY="sua-chave-sendgrid"
FROM_EMAIL="seu-email@exemplo.com"

# Airbnb Sync (opcional)
AIRBNB_ICAL_URL="https://airbnb.com/calendar/ical/seu-id.ics"
```

### **4. Configure o banco de dados:**
```bash
# Gerar o cliente Prisma
yarn prisma generate

# Executar migrações
yarn prisma migrate dev

# Popular com dados iniciais
yarn prisma db seed
```

### **5. Execute o projeto:**
```bash
# Modo desenvolvimento
yarn dev

# Build de produção
yarn build
yarn start
```

## 📁 **Estrutura do Projeto**

```
sitio-recanto-limeira/
├── app/
│   ├── app/                 # Pages e API routes (App Router)
│   │   ├── admin/           # Painel administrativo
│   │   ├── api/             # API routes
│   │   ├── layout.tsx       # Layout principal
│   │   └── page.tsx         # Homepage
│   ├── components/          # Componentes React
│   │   ├── ui/              # Componentes base (Shadcn)
│   │   ├── header.tsx       # Header do site
│   │   ├── hero-section.tsx # Seção principal
│   │   └── ...              # Outros componentes
│   ├── lib/                 # Utilitários e configurações
│   │   ├── db.ts            # Cliente Prisma
│   │   ├── auth.ts          # Configuração NextAuth
│   │   ├── email.ts         # Serviço de email
│   │   └── ...              # Outros utilitários
│   ├── prisma/              # Esquema e migrações
│   │   ├── schema.prisma    # Modelos do banco
│   │   └── seed.ts          # Dados iniciais
│   ├── public/              # Arquivos estáticos
│   │   ├── images/          # Imagens do sítio
│   │   └── ...              # Outros assets
│   ├── package.json         # Dependências
│   └── ...                  # Configurações
├── CONFIGURACAO_EMAIL.md    # Guia de configuração de email
├── SISTEMA_RESERVAS.md      # Documentação do sistema
└── README.md               # Este arquivo
```

## 🔧 **Scripts Disponíveis**

```bash
# Desenvolvimento
yarn dev                     # Servidor de desenvolvimento
yarn build                   # Build de produção
yarn start                   # Servidor de produção
yarn lint                    # Linter

# Banco de dados
yarn prisma generate         # Gerar cliente Prisma
yarn prisma migrate dev      # Executar migrações
yarn prisma db seed          # Popular banco com dados
yarn prisma studio          # Interface visual do banco

# Utilitários
yarn type-check             # Verificar tipos TypeScript
```

## 📧 **Configuração de Email (SendGrid)**

1. Crie uma conta gratuita no [SendGrid](https://sendgrid.com/)
2. Obtenha sua API key
3. Verifique seu email remetente
4. Configure no arquivo `.env`

Consulte `CONFIGURACAO_EMAIL.md` para instruções detalhadas.

## 🚀 **Deploy**

### **Abacus.AI (Recomendado):**
1. Faça upload do projeto
2. Configure variáveis de ambiente
3. Configure domínio personalizado
4. Deploy automático

### **Vercel:**
```bash
npm install -g vercel
vercel
```

### **Outros providers:**
O projeto é compatível com qualquer provedor que suporte Next.js.

## 📊 **Funcionalidades Administrativas**

### **Dashboard:**
- Estatísticas de reservas
- Gráficos de ocupação
- Resumo mensal/anual

### **Gerenciamento de Reservas:**
- Lista de todas as reservas
- Filtros por status e datas
- Edição e cancelamento
- Exportação de dados

### **Sincronização Airbnb:**
- Status da última sincronização
- Logs de importação
- Controle manual
- Configuração de URL iCal

### **Datas Bloqueadas:**
- Bloqueio manual de períodos
- Motivos personalizados
- Remoção em lote
- Calendario visual

## 🐛 **Solução de Problemas**

### **Erro de conexão com banco:**
- Verifique se PostgreSQL está rodando
- Confira a URL de conexão no `.env`
- Execute `yarn prisma migrate dev`

### **Emails não chegam:**
- Verifique a chave SendGrid no `.env`
- Confirme se o email remetente foi verificado
- Verifique logs do servidor

### **Sincronização Airbnb falha:**
- Confirme a URL iCal no `.env`
- Teste a URL manualmente
- Verifique logs da sincronização

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 **Licença**

Este projeto é licenciado sob a MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 **Suporte**

- **Email:** drarenatacamposdermato@gmail.com
- **Site:** [sitiorecantodalimeira.com.br](https://sitiorecantodalimeira.com.br)

---

**Desenvolvido com ❤️ para o Sítio Recanto da Limeira**
