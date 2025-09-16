

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const prisma = new PrismaClient();
export const dynamic = 'force-dynamic';

// DELETE - Desbloquear data
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { id } = params;

    await prisma.blockedDate.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'Data desbloqueada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao desbloquear data:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

