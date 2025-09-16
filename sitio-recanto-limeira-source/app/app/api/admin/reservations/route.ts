
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { sendReservationNotification } from '@/lib/email';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.email !== 'admin@sitiorecantodalimeira.com') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
    }

    const {
      guestName,
      guestEmail,
      guestPhone,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      observations
    } = await request.json();

    // Validações básicas
    if (!guestName || !guestEmail || !checkIn || !checkOut || !guests) {
      return NextResponse.json({ 
        error: 'Campos obrigatórios: nome, email, check-in, check-out e número de hóspedes' 
      }, { status: 400 });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return NextResponse.json({ 
        error: 'Data de check-out deve ser posterior ao check-in' 
      }, { status: 400 });
    }

    // Calcular total de dias
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // Verificar conflitos de reservas
    const conflictingReservation = await prisma.reservation.findFirst({
      where: {
        AND: [
          {
            status: {
              in: ['CONFIRMED', 'PENDING']
            }
          },
          {
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
        ]
      }
    });

    if (conflictingReservation) {
      return NextResponse.json({ 
        error: 'Já existe uma reserva confirmada para este período' 
      }, { status: 409 });
    }

    // Verificar datas bloqueadas
    const blockedDates = await prisma.blockedDate.findMany({
      where: {
        OR: [
          {
            date: {
              gte: checkInDate,
              lt: checkOutDate
            }
          },
          {
            AND: [
              { startDate: { lte: checkOutDate } },
              { endDate: { gte: checkInDate } }
            ]
          }
        ]
      }
    });

    if (blockedDates.length > 0) {
      return NextResponse.json({ 
        error: 'Existem datas bloqueadas no período selecionado' 
      }, { status: 409 });
    }

    // Criar a reserva
    const reservation = await prisma.reservation.create({
      data: {
        guestName,
        guestEmail,
        guestPhone: guestPhone || '',
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: parseInt(guests),
        totalDays,
        totalPrice: totalPrice ? parseFloat(totalPrice) : null,
        observations: observations || null,
        status: 'CONFIRMED' // Reserva manual já vem confirmada
      }
    });

    // Enviar notificação por email para reserva manual
    try {
      await sendReservationNotification({
        guestName,
        guestEmail,
        guestPhone: guestPhone || '',
        checkIn: checkInDate.toISOString(),
        checkOut: checkOutDate.toISOString(),
        guests: parseInt(guests),
        observations: observations || undefined,
        source: 'Site'
      });
      console.log('✅ Notificação de reserva manual enviada por email');
    } catch (emailError) {
      console.error('⚠️ Erro ao enviar notificação de reserva manual por email:', emailError);
      // Não falha a criação da reserva se o email não for enviado
    }

    return NextResponse.json({
      success: true,
      message: 'Reserva criada com sucesso',
      reservation
    });

  } catch (error) {
    console.error('Erro ao criar reserva manual:', error);
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      }, 
      { status: 500 }
    );
  }
}
