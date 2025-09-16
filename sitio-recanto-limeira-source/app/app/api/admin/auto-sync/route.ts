
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { startAutoSync, stopAutoSync, getAutoSyncStatus } from '@/lib/cron-sync';

export async function GET() {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.email !== 'admin@sitiorecantodalimeira.com') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
    }

    const status = getAutoSyncStatus();
    return NextResponse.json(status);
    
  } catch (error) {
    console.error('Erro ao obter status da sincronização:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.email !== 'admin@sitiorecantodalimeira.com') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
    }

    const { action } = await request.json();

    if (action === 'start') {
      const job = startAutoSync();
      return NextResponse.json({ 
        success: true, 
        message: 'Sincronização automática iniciada',
        isRunning: true 
      });
    } else if (action === 'stop') {
      stopAutoSync();
      return NextResponse.json({ 
        success: true, 
        message: 'Sincronização automática parada',
        isRunning: false 
      });
    } else {
      return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
    }
    
  } catch (error) {
    console.error('Erro na API de auto-sync:', error);
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      }, 
      { status: 500 }
    );
  }
}
