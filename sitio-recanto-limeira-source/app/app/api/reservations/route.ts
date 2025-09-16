
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sendReservationNotification } from '@/lib/email';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { guestName, guestEmail, guestPhone, checkIn, checkOut, guests, observations } = data;

    if (!guestName || !guestEmail || !guestPhone || !checkIn || !checkOut || !guests) {
      return NextResponse.json(
        { error: 'Todos os campos obrigatórios devem ser preenchidos' },
        { status: 400 }
      );
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Verificar se as datas são válidas
    if (checkInDate >= checkOutDate) {
      return NextResponse.json(
        { error: 'A data de saída deve ser posterior à data de entrada' },
        { status: 400 }
      );
    }

    // Verificar se não há conflito com reservas existentes
    const existingReservation = await prisma.reservation.findFirst({
      where: {
        status: {
          in: ['PENDING', 'CONFIRMED']
        },
        OR: [
          {
            AND: [
              { checkIn: { lte: checkInDate } },
              { checkOut: { gt: checkInDate } }
            ]
          },
          {
            AND: [
              { checkIn: { lt: checkOutDate } },
              { checkOut: { gte: checkOutDate } }
            ]
          },
          {
            AND: [
              { checkIn: { gte: checkInDate } },
              { checkOut: { lte: checkOutDate } }
            ]
          }
        ]
      }
    });

    if (existingReservation) {
      return NextResponse.json(
        { error: 'Já existe uma reserva confirmada para este período' },
        { status: 409 }
      );
    }

    // Verificar se há datas bloqueadas no período
    const blockedDates = await prisma.blockedDate.findMany({
      where: {
        date: {
          gte: checkInDate,
          lte: checkOutDate
        }
      }
    });

    if (blockedDates.length > 0) {
      return NextResponse.json(
        { error: 'Algumas datas do período selecionado não estão disponíveis' },
        { status: 409 }
      );
    }

    // Calcular total de dias
    const totalDays = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

    // Criar reserva
    const reservation = await prisma.reservation.create({
      data: {
        guestName,
        guestEmail,
        guestPhone,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: parseInt(guests),
        totalDays,
        totalPrice: 0, // Será definido pelo proprietário
        observations: observations || null,
        status: 'PENDING'
      }
    });

    // Enviar notificação por email
    try {
      await sendReservationNotification({
        guestName,
        guestEmail,
        guestPhone,
        checkIn: checkInDate.toISOString(),
        checkOut: checkOutDate.toISOString(),
        guests: parseInt(guests),
        observations: observations || undefined,
        source: 'Site'
      });
      console.log('✅ Notificação de reserva enviada por email');
    } catch (emailError) {
      console.error('⚠️ Erro ao enviar notificação por email:', emailError);
      // Não falha a reserva se o email não for enviado
    }

    return NextResponse.json({
      message: 'Reserva solicitada com sucesso! Entraremos em contato em breve.',
      reservation: {
        id: reservation.id,
        checkIn: reservation.checkIn,
        checkOut: reservation.checkOut,
        totalDays: reservation.totalDays
      }
    });
  } catch (error) {
    console.error('Erro ao criar reserva:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(reservations);
  } catch (error) {
    console.error('Erro ao buscar reservas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
