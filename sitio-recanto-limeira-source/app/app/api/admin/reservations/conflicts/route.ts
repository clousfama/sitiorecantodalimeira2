

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

// GET - Verificar conflitos de reservas
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const currentDate = new Date();
    
    // Buscar reservas que podem ter conflitos
    const allReservations = await prisma.reservation.findMany({
      where: {
        status: {
          in: ['PENDING', 'CONFIRMED']
        },
        checkOut: {
          gte: currentDate
        }
      },
      orderBy: { checkIn: 'asc' }
    });

    const conflicts = [];

    // Verificar conflitos entre reservas
    for (let i = 0; i < allReservations.length; i++) {
      for (let j = i + 1; j < allReservations.length; j++) {
        const res1 = allReservations[i];
        const res2 = allReservations[j];

        // Verificar se há sobreposição de datas
        const hasOverlap = (
          res1.checkIn < res2.checkOut && res2.checkIn < res1.checkOut
        );

        if (hasOverlap) {
          conflicts.push({
            type: 'OVERLAP',
            message: `Conflito entre reservas: ${res1.guestName} e ${res2.guestName}`,
            reservations: [res1, res2],
            priority: 'HIGH'
          });
        }
      }
    }

    // Verificar reservas próximas ao limite (mesmo dia)
    for (let i = 0; i < allReservations.length - 1; i++) {
      const current = allReservations[i];
      const next = allReservations[i + 1];

      const currentCheckOut = new Date(current.checkOut);
      const nextCheckIn = new Date(next.checkIn);

      // Se a saída de uma é no mesmo dia da entrada da outra
      if (currentCheckOut.toDateString() === nextCheckIn.toDateString()) {
        conflicts.push({
          type: 'SAME_DAY',
          message: `Reservas consecutivas no mesmo dia: ${current.guestName} → ${next.guestName}`,
          reservations: [current, next],
          priority: 'MEDIUM'
        });
      }
    }

    return NextResponse.json({
      conflicts,
      totalConflicts: conflicts.length,
      lastChecked: new Date().toISOString()
    });
  } catch (error) {
    console.error('Erro ao verificar conflitos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

