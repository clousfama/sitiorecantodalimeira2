
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { syncAirbnbBookings, removeOldAirbnbBookings } from '@/lib/ical-sync';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticação
    const session = await getServerSession(authOptions);
    
    if (!session || session.user?.email !== 'admin@sitiorecantodalimeira.com') {
      return NextResponse.json({ error: 'Acesso negado' }, { status: 401 });
    }

    const { icalUrl } = await request.json();

    if (!icalUrl) {
      return NextResponse.json({ error: 'URL do iCal é obrigatória' }, { status: 400 });
    }

    // Remover bookings antigos primeiro
    await removeOldAirbnbBookings();

    // Fazer a sincronização
    const result = await syncAirbnbBookings(icalUrl);

    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Erro na API de sync:', error);
    return NextResponse.json(
      { 
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      }, 
      { status: 500 }
    );
  }
}
