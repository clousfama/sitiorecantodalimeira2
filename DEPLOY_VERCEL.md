
# Deploy do Sítio Recanto da Limeira na Vercel

## ✅ PROBLEMA RESOLVIDO!

Corrigi os conflitos de dependências do ESLint e configurei o projeto para deploy na Vercel.

## 🚀 Como fazer o deploy:

### 1. Acesse a Vercel
- Vá para [vercel.com/new](https://vercel.com/new)
- Faça login com sua conta

### 2. Importe o Repositório
- Clique em "Continue with GitHub" 
- Procure por `clousfama/sitiorecantodalimeira2`
- Clique em "Import"

### 3. Configure o Projeto
- **Framework Preset**: Next.js (detectado automaticamente)
- **Root Directory**: `sitio-recanto-limeira-source/app`
- **Build Command**: `npm install --legacy-peer-deps && npx prisma generate && npm run build`
- **Output Directory**: `.next` (padrão)
- **Install Command**: `npm install --legacy-peer-deps`

### 4. Variáveis de Ambiente (IMPORTANTE!)
Clique em "Environment Variables" e adicione:

```
DATABASE_URL=sua_url_do_banco_postgresql
NEXTAUTH_SECRET=uma_chave_secreta_aleatoria_de_32_caracteres
NEXTAUTH_URL=https://seu-projeto.vercel.app
```

### 5. Deploy
- Clique em "Deploy"
- Aguarde 3-5 minutos

## ✅ Correções Aplicadas:
- ESLint atualizado para versão 8.57.0
- TypeScript ESLint parser/plugin atualizados para 7.18.0
- Prettier adicionado
- Arquivo vercel.json configurado
- .npmrc com legacy-peer-deps
- **Prisma schema.prisma corrigido** - removido output path customizado
- **Configuração depreciada removida** - package.json#prisma migrado
- **Script postinstall adicionado** - prisma generate automático
- **Binary targets atualizados** para compatibilidade Vercel
- **Engine type configurado** para library mode
- Todas as dependências compatíveis

## 🎯 Resultado:
Seu site estará disponível em `https://seu-projeto.vercel.app`

## 🔄 Deploy Automático:
A partir de agora, qualquer alteração no repositório GitHub será automaticamente deployada na Vercel!
