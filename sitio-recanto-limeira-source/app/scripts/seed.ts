
import { PrismaClient } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  try {
    // Limpar dados existentes (cuidado em produção!)
    console.log('Limpando dados existentes...');
    
    // Criar usuário administrador
    console.log('Criando usuário administrador...');
    const hashedPassword = await bcryptjs.hash('admin123', 12);
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'drarenatacamposdermato@gmail.com' },
      update: {},
      create: {
        email: 'drarenatacamposdermato@gmail.com',
        name: 'Renata Campos',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    // Criar conta de teste (obrigatória)
    const testPassword = await bcryptjs.hash('johndoe123', 12);
    const testUser = await prisma.user.upsert({
      where: { email: 'john@doe.com' },
      update: {},
      create: {
        email: 'john@doe.com',
        name: 'John Doe',
        password: testPassword,
        role: 'ADMIN'
      }
    });

    console.log('Usuários criados:', { adminUser: adminUser.email, testUser: testUser.email });

    // Criar algumas reservas de exemplo
    console.log('Criando reservas de exemplo...');
    
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    const weekAfter = new Date(nextWeek);
    weekAfter.setDate(nextWeek.getDate() + 3);

    const reservation1 = await prisma.reservation.create({
      data: {
        guestName: 'Maria Silva',
        guestEmail: 'maria@example.com',
        guestPhone: '(31) 99999-9999',
        checkIn: nextWeek,
        checkOut: weekAfter,
        guests: 8,
        totalDays: 3,
        totalPrice: 1500,
        observations: 'Festa de aniversário',
        status: 'CONFIRMED'
      }
    });

    // Criar algumas datas bloqueadas
    console.log('Criando datas bloqueadas...');
    
    const blockedDate1 = new Date(today);
    blockedDate1.setDate(today.getDate() + 20);
    
    await prisma.blockedDate.create({
      data: {
        date: blockedDate1,
        reason: 'Manutenção da piscina'
      }
    });

    console.log('Seed concluído com sucesso!');
  } catch (error) {
    console.error('Erro durante o seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
