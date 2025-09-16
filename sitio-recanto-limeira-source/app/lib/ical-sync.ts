
import { PrismaClient } from '@prisma/client';
import ical from 'ical';
import { sendReservationNotification } from '@/lib/email';

const prisma = new PrismaClient();

export interface AirbnbBooking {
  startDate: string;
  endDate: string;
  summary: string;
  uid: string;
}

export async function parseICalData(icalData: string): Promise<AirbnbBooking[]> {
  try {
    const events = ical.parseICS(icalData);
    const bookings: AirbnbBooking[] = [];

    Object.values(events).forEach((event: any) => {
      if (event.type === 'VEVENT' && event.start && event.end) {
        // Converter datas para formato ISO
        const startDate = new Date(event.start).toISOString().split('T')[0];
        const endDate = new Date(event.end).toISOString().split('T')[0];
        
        bookings.push({
          startDate,
          endDate,
          summary: event.summary || 'Reserva Airbnb',
          uid: event.uid || `airbnb-${startDate}-${endDate}`
        });
      }
    });

    return bookings;
  } catch (error) {
    console.error('Erro ao processar iCal:', error);
    throw error;
  }
}

export async function syncAirbnbBookings(icalUrl: string): Promise<{ success: boolean; bookingsAdded: number; message: string }> {
  try {
    // Buscar dados do iCal
    const response = await fetch(icalUrl);
    if (!response.ok) {
      throw new Error(`Erro ao buscar iCal: ${response.status}`);
    }
    
    const icalData = await response.text();
    const bookings = await parseICalData(icalData);
    
    let bookingsAdded = 0;

    // Processar cada booking
    for (const booking of bookings) {
      // Verificar se já existe
      const existingBlock = await prisma.blockedDate.findFirst({
        where: {
          startDate: new Date(booking.startDate),
          endDate: new Date(booking.endDate),
          reason: {
            contains: 'Airbnb'
          }
        }
      });

      if (!existingBlock) {
        // Criar bloqueio de data
        await prisma.blockedDate.create({
          data: {
            startDate: new Date(booking.startDate),
            endDate: new Date(booking.endDate),
            reason: `Reserva Airbnb: ${booking.summary}`,
            createdBy: 'airbnb-sync'
          }
        });

        // Enviar notificação por email para nova reserva do Airbnb
        try {
          // Extrair informações do guest do summary do Airbnb (se disponível)
          const guestName = booking.summary.includes('Reserved') 
            ? booking.summary.replace('Reserved', '').trim() 
            : booking.summary || 'Hóspede Airbnb';
          
          // Calcular número de pessoas (não disponível no iCal, usar padrão)
          const guests = 4; // Valor padrão, pois iCal do Airbnb não fornece esta informação

          await sendReservationNotification({
            guestName,
            guestEmail: 'Não informado via Airbnb',
            guestPhone: 'Consultar no Airbnb',
            checkIn: new Date(booking.startDate).toISOString(),
            checkOut: new Date(booking.endDate).toISOString(),
            guests,
            observations: `Reserva importada automaticamente do Airbnb. UID: ${booking.uid}`,
            source: 'Airbnb'
          });
          
          console.log(`✅ Notificação enviada para nova reserva Airbnb: ${guestName}`);
        } catch (emailError) {
          console.error('⚠️ Erro ao enviar notificação de reserva Airbnb por email:', emailError);
          // Não falha a sincronização se o email não for enviado
        }

        bookingsAdded++;
      }
    }

    return {
      success: true,
      bookingsAdded,
      message: `Sincronização concluída. ${bookingsAdded} novas reservas adicionadas.`
    };

  } catch (error) {
    console.error('Erro na sincronização:', error);
    return {
      success: false,
      bookingsAdded: 0,
      message: `Erro na sincronização: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
    };
  }
}

export async function removeOldAirbnbBookings(): Promise<void> {
  // Remove bookings do Airbnb que já passaram há mais de 30 dias
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  await prisma.blockedDate.deleteMany({
    where: {
      endDate: {
        lt: thirtyDaysAgo
      },
      createdBy: 'airbnb-sync'
    }
  });
}
