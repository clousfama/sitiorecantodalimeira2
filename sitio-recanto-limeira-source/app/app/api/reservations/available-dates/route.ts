
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const currentDate = new Date();
    const nextYear = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate());

    // Buscar reservas confirmadas
    const confirmedReservations = await prisma.reservation.findMany({
      where: {
        status: {
          in: ['CONFIRMED', 'PENDING']
        },
        checkOut: {
          gte: currentDate
        }
      },
      select: {
        checkIn: true,
        checkOut: true
      }
    });

    // Buscar datas bloqueadas
    const blockedDates = await prisma.blockedDate.findMany({
      where: {
        OR: [
          {
            date: {
              gte: currentDate,
              lte: nextYear
            }
          },
          {
            startDate: {
              lte: nextYear
            },
            endDate: {
              gte: currentDate
            }
          }
        ]
      },
      select: {
        date: true,
        startDate: true,
        endDate: true
      }
    });

    // Gerar array de datas ocupadas
    const unavailableDates: string[] = [];

    // Adicionar datas das reservas
    confirmedReservations.forEach(reservation => {
      const currentDate = new Date(reservation.checkIn);
      const endDate = new Date(reservation.checkOut);

      while (currentDate < endDate) {
        unavailableDates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    // Adicionar datas bloqueadas
    blockedDates.forEach(blockedDate => {
      const blockDate = blockedDate.date || blockedDate.startDate;
      if (blockDate) {
        unavailableDates.push(blockDate.toISOString().split('T')[0]);
      }
      
      // Para períodos (startDate/endDate), adicionar todas as datas do período
      if (blockedDate.startDate && blockedDate.endDate) {
        const currentDate = new Date(blockedDate.startDate);
        const endDate = new Date(blockedDate.endDate);
        
        while (currentDate <= endDate) {
          unavailableDates.push(currentDate.toISOString().split('T')[0]);
          currentDate.setDate(currentDate.getDate() + 1);
        }
      }
    });

    return NextResponse.json({
      unavailableDates: [...new Set(unavailableDates)] // Remove duplicatas
    });
  } catch (error) {
    console.error('Erro ao buscar datas disponíveis:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
