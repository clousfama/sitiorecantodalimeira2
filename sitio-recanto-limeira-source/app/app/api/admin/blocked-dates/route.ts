

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

// GET - Buscar datas bloqueadas
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const blockedDates = await prisma.blockedDate.findMany({
      orderBy: [
        { date: 'asc' },
        { startDate: 'asc' }
      ]
    });

    // Compatibilidade: converter novos formatos para o formato antigo para a interface
    const formattedDates = blockedDates.map(bd => ({
      ...bd,
      date: bd.date || bd.startDate // Prioriza o campo antigo, se existir
    })).filter(bd => bd.date); // Remove entradas sem data válida

    return NextResponse.json(formattedDates);
  } catch (error) {
    console.error('Erro ao buscar datas bloqueadas:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST - Bloquear nova data
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { date, reason } = await request.json();

    if (!date) {
      return NextResponse.json(
        { error: 'Data é obrigatória' },
        { status: 400 }
      );
    }

    const blockDate = new Date(date);
    
    // Verificar se já existe (compatibilidade com ambos os formatos)
    const existing = await prisma.blockedDate.findFirst({
      where: {
        OR: [
          { date: blockDate },
          { 
            AND: [
              { startDate: { lte: blockDate } },
              { endDate: { gte: blockDate } }
            ]
          }
        ]
      }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Data já está bloqueada' },
        { status: 409 }
      );
    }

    const blockedDate = await prisma.blockedDate.create({
      data: {
        date: blockDate,
        startDate: blockDate,
        endDate: blockDate,
        reason: reason || 'Indisponível',
        createdBy: 'manual'
      }
    });

    return NextResponse.json({
      message: 'Data bloqueada com sucesso',
      blockedDate
    });
  } catch (error) {
    console.error('Erro ao bloquear data:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

