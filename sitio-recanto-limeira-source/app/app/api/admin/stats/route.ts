

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const nextThirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Estatísticas gerais
    const totalReservations = await prisma.reservation.count();
    const pendingReservations = await prisma.reservation.count({
      where: { status: 'PENDING' }
    });
    const confirmedReservations = await prisma.reservation.count({
      where: { status: 'CONFIRMED' }
    });

    // Reservas recentes (últimos 30 dias)
    const recentReservations = await prisma.reservation.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });

    // Próximas reservas (próximos 30 dias)
    const upcomingReservations = await prisma.reservation.count({
      where: {
        checkIn: {
          gte: now,
          lte: nextThirtyDays
        },
        status: 'CONFIRMED'
      }
    });

    // Taxa de ocupação estimada (próximos 30 dias)
    const totalDays = 30;
    const occupiedDays = await prisma.reservation.findMany({
      where: {
        checkIn: {
          gte: now,
          lte: nextThirtyDays
        },
        status: 'CONFIRMED'
      },
      select: {
        checkIn: true,
        checkOut: true
      }
    });

    let occupiedDaysCount = 0;
    occupiedDays.forEach(reservation => {
      const checkIn = new Date(reservation.checkIn);
      const checkOut = new Date(reservation.checkOut);
      const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      occupiedDaysCount += days;
    });

    const occupancyRate = Math.min((occupiedDaysCount / totalDays) * 100, 100);

    // Receita estimada (se preços estiverem definidos)
    const totalRevenue = await prisma.reservation.aggregate({
      _sum: {
        totalPrice: true
      },
      where: {
        status: 'COMPLETED',
        totalPrice: {
          not: null
        }
      }
    });

    return NextResponse.json({
      general: {
        totalReservations,
        pendingReservations,
        confirmedReservations,
        recentReservations,
        upcomingReservations,
      },
      occupancy: {
        rate: Math.round(occupancyRate),
        occupiedDays: occupiedDaysCount,
        totalDays
      },
      revenue: {
        total: totalRevenue._sum.totalPrice || 0
      },
      generatedAt: now.toISOString()
    });
  } catch (error) {
    console.error('Erro ao gerar estatísticas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

