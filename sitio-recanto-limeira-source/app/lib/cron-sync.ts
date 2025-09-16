
import * as cron from 'node-cron';
import { syncAirbnbBookings } from './ical-sync';

const AIRBNB_ICAL_URL = 'https://www.airbnb.com/calendar/ical/1472647101580205867.ics?s=b97d414e9cafe42dca0b119cca0a25f7&locale=pt';

let syncJob: cron.ScheduledTask | null = null;

export function startAutoSync() {
  // Se já existe um job rodando, para ele primeiro
  if (syncJob) {
    syncJob.destroy();
  }

  // Sincroniza a cada 4 horas
  syncJob = cron.schedule('0 */4 * * *', async () => {
    console.log('🔄 Iniciando sincronização automática com Airbnb...');
    
    try {
      const result = await syncAirbnbBookings(AIRBNB_ICAL_URL);
      
      if (result.success) {
        console.log(`✅ Sincronização automática concluída: ${result.message}`);
      } else {
        console.error(`❌ Erro na sincronização automática: ${result.message}`);
      }
    } catch (error) {
      console.error('❌ Erro na sincronização automática:', error);
    }
  }, {
    timezone: 'America/Sao_Paulo'
  });

  console.log('🚀 Sincronização automática iniciada (a cada 4 horas)');
  return syncJob;
}

export function stopAutoSync() {
  if (syncJob) {
    syncJob.destroy();
    syncJob = null;
    console.log('🛑 Sincronização automática parada');
  }
}

export function getAutoSyncStatus() {
  return {
    isRunning: syncJob ? syncJob.getStatus() !== 'destroyed' : false,
    schedule: '0 */4 * * *', // A cada 4 horas
    timezone: 'America/Sao_Paulo'
  };
}

// Auto-iniciar sincronização quando o servidor for iniciado (apenas em produção)
if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
  // Aguardar 30 segundos após inicialização e então iniciar
  setTimeout(() => {
    startAutoSync();
    console.log('🚀 Sincronização automática com Airbnb iniciada automaticamente');
  }, 30000);
}
