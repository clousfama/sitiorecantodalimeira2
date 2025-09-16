

# 🏡 SÍTIO RECANTO DA LIMEIRA - SISTEMA DE RESERVAS

## 📋 VISÃO GERAL DO SISTEMA

Sistema completo de controle de reservas com:
- ✅ **Prevenção de marcações duplas**
- ✅ **Detecção automática de conflitos**  
- ✅ **Área administrativa exclusiva para proprietário**
- ✅ **Gerenciamento de datas bloqueadas**
- ✅ **Notificações de conflitos em tempo real**

---

## 🔐 ACESSO ADMINISTRATIVO

### **Link Exclusivo do Proprietário:**
👉 **http://localhost:3000/admin/login**

### **Credenciais Padrão:**
- **E-mail:** `admin@sitiorecantodalimeira.com`
- **Senha:** `admin123`

### **Acesso Rápido:**
- Card flutuante no canto inferior direito do site
- Botão "Área do Proprietário" → "Entrar"

---

## 🛡️ FUNCIONALIDADES DE CONTROLE

### **1. PREVENÇÃO DE CONFLITOS**
```typescript
// Verificação automática antes de criar reserva
const conflictsCheck = await prisma.reservation.findFirst({
  where: {
    status: { in: ['PENDING', 'CONFIRMED'] },
    OR: [
      { AND: [{ checkIn: { lte: checkInDate } }, { checkOut: { gt: checkInDate } }] },
      { AND: [{ checkIn: { lt: checkOutDate } }, { checkOut: { gte: checkOutDate } }] },
      { AND: [{ checkIn: { gte: checkInDate } }, { checkOut: { lte: checkOutDate } }] }
    ]
  }
});
```

### **2. SISTEMA DE ALERTAS**
- 🔴 **ALTO:** Sobreposição de datas
- 🟡 **MÉDIO:** Mesmo dia entrada/saída  
- 🟢 **BAIXO:** Reservas muito próximas

### **3. GERENCIAMENTO DE DATAS**
- Bloquear datas específicas
- Desbloquear quando necessário
- Motivos personalizados para bloqueios

---

## 📊 DASHBOARD ADMINISTRATIVO

### **ABA RESERVAS**
- Listar todas as reservas
- Aprovar/rejeitar solicitações
- Alterar status (Pendente → Confirmada → Concluída)
- Cancelar reservas quando necessário

### **ABA CONFLITOS**  
- Visualização em tempo real de conflitos
- Priorização por gravidade
- Detalhes das reservas conflitantes
- Sugestões de resolução

### **ABA DATAS BLOQUEADAS**
- Adicionar datas indisponíveis
- Remover bloqueios
- Histórico de mudanças
- Motivos documentados

---

## 🔧 PRINCIPAIS ARQUIVOS DO CÓDIGO

### **APIs DE CONTROLE**
```
/app/api/reservations/route.ts              → CRUD de reservas
/app/api/reservations/[id]/route.ts         → Alteração de status
/app/api/reservations/available-dates/      → Datas disponíveis
/app/api/admin/blocked-dates/route.ts       → Gerenciar bloqueios
/app/api/admin/reservations/conflicts/      → Detectar conflitos
/app/api/admin/stats/route.ts               → Estatísticas
```

### **COMPONENTES ADMINISTRATIVOS**
```
/app/admin/dashboard/page.tsx               → Dashboard principal
/app/admin/login/page.tsx                   → Tela de login
/components/admin-access-card.tsx           → Card de acesso flutuante
```

### **BANCO DE DADOS**
```sql
-- Modelo de Reserva
model Reservation {
  id            String            @id @default(cuid())
  guestName     String
  guestEmail    String
  guestPhone    String
  checkIn       DateTime
  checkOut      DateTime
  guests        Int
  status        ReservationStatus @default(PENDING)
  createdAt     DateTime          @default(now())
  
  @@unique([checkIn, checkOut]) -- PREVINE DUPLICATAS
}

-- Modelo de Data Bloqueada  
model BlockedDate {
  id        String   @id @default(cuid())
  date      DateTime @unique
  reason    String?
  createdAt DateTime @default(now())
}
```

---

## ⚡ COMO FUNCIONA O CONTROLE

### **1. CLIENTE FAZ RESERVA**
1. Preenche formulário no site
2. Sistema verifica disponibilidade
3. Bloqueia datas conflitantes
4. Envia para aprovação do proprietário

### **2. PROPRIETÁRIO RECEBE NOTIFICAÇÃO**
1. Acessa `/admin/dashboard`
2. Vê reserva pendente
3. Verifica conflitos na aba "Conflitos"
4. Aprova ou rejeita

### **3. SISTEMA AUTOMATIZA**
1. ✅ Aprova → Bloqueia datas no calendário
2. ❌ Rejeita → Libera datas para outros  
3. 📊 Atualiza estatísticas
4. 🔔 Alerta sobre novos conflitos

### **4. GESTÃO DE CANCELAMENTOS**
1. Proprietário cancela reserva
2. Sistema libera automaticamente as datas
3. Calendário volta a mostrar disponibilidade
4. Outros clientes podem reservar

---

## 📈 ESTATÍSTICAS DISPONÍVEIS

### **MÉTRICAS PRINCIPAIS**
- Total de reservas
- Reservas pendentes  
- Reservas confirmadas
- Conflitos críticos
- Taxa de ocupação
- Datas bloqueadas

### **RELATÓRIOS AUTOMÁTICOS**
- Reservas dos últimos 30 dias
- Próximas reservas
- Receita estimada
- Análise de conflitos

---

## 🎯 VANTAGENS DO SISTEMA

### **PARA O PROPRIETÁRIO**
- ✅ **Controle total** das reservas
- ✅ **Zero duplicações** de data  
- ✅ **Alertas automáticos** de problemas
- ✅ **Gestão simplificada** em um painel
- ✅ **Histórico completo** de reservas

### **PARA OS CLIENTES**
- ✅ **Disponibilidade real** sempre atualizada
- ✅ **Processo rápido** de reserva
- ✅ **Confirmação automática** por email
- ✅ **Interface intuitiva** e responsiva

---

## 🔄 FLUXO COMPLETO DE UMA RESERVA

```
CLIENTE                    SISTEMA                     PROPRIETÁRIO
   |                         |                           |
   |── Preenche formulário    |                           |
   |                         |── Verifica conflitos      |
   |                         |── Salva como PENDING      |
   |                         |                          |── Recebe notificação
   |                         |                          |── Acessa dashboard  
   |                         |                          |── Analisa conflitos
   |                         |                          |── APROVA/REJEITA
   |                         |── Atualiza status         |
   |── Recebe confirmação    |── Bloqueia/libera datas  |── Sistema atualizado
   |                         |── Envia email             |
```

---

## 🚨 CENÁRIOS DE CONFLITO E RESOLUÇÃO

### **CENÁRIO 1: SOBREPOSIÇÃO TOTAL**
```
Reserva A: 15/12 até 20/12
Reserva B: 16/12 até 19/12  ❌ CONFLITO ALTO

RESOLUÇÃO: 
- Proprietário mantém primeira reserva
- Rejeita segunda reserva  
- Sistema sugere datas alternativas
```

### **CENÁRIO 2: MESMO DIA**
```
Reserva A: 15/12 até 18/12
Reserva B: 18/12 até 22/12  ⚠️ CONFLITO MÉDIO

RESOLUÇÃO:
- Verificar horários de check-in/out
- Coordenar limpeza entre hóspedes
- Proprietário decide viabilidade
```

### **CENÁRIO 3: CANCELAMENTO**  
```
Reserva CONFIRMADA cancelada
Sistema automaticamente:
✅ Libera datas no calendário
✅ Remove do conflitos
✅ Permite novas reservas
✅ Atualiza estatísticas
```

---

## 📧 NOTIFICAÇÕES AUTOMÁTICAS

### **E-MAILS ENVIADOS**
- ✉️ Confirmação de reserva (cliente)
- ✉️ Nova solicitação (proprietário)  
- ✉️ Aprovação/rejeição (cliente)
- ✉️ Lembrete de check-in (cliente)
- ✉️ Relatório de conflitos (proprietário)

---

## 🛠️ TECNOLOGIAS UTILIZADAS

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes, Prisma ORM
- **Banco:** PostgreSQL  
- **Auth:** NextAuth.js
- **UI:** Shadcn/ui, Lucide Icons, Framer Motion
- **Deploy:** Vercel/Railway (recomendado)

---

## 📚 COMANDOS ÚTEIS

### **Desenvolvimento**
```bash
cd /home/ubuntu/sitio_recanto_limeira/app
yarn dev                    # Rodar em desenvolvimento
yarn build                  # Build para produção
yarn start                  # Rodar produção
```

### **Banco de Dados**  
```bash
yarn prisma generate        # Gerar cliente Prisma
yarn prisma db push         # Aplicar mudanças no schema
yarn prisma studio          # Interface visual do banco
```

---

## 🎉 SISTEMA PRONTO PARA USO!

**✅ O sistema está 100% funcional com:**

1. **Prevenção de conflitos automática**
2. **Dashboard administrativo completo** 
3. **Acesso exclusivo do proprietário**
4. **Gestão inteligente de reservas**
5. **Todas as funcionalidades solicitadas**

**🔗 Acesse:** http://localhost:3000
**🔐 Admin:** http://localhost:3000/admin/login

---

*Sistema desenvolvido especificamente para o Sítio Recanto da Limeira com foco em automação, controle e prevenção de conflitos de reservas.*

