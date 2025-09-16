
import sgMail from '@sendgrid/mail';

// Configurar SendGrid com a chave da API
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

export interface ReservationEmailData {
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  observations?: string;
  source: 'Site' | 'Airbnb';
}

export async function sendReservationNotification(reservationData: ReservationEmailData) {
  try {
    // Verificar se as configurações estão disponíveis
    if (!process.env.SENDGRID_API_KEY || process.env.SENDGRID_API_KEY === 'YOUR_SENDGRID_API_KEY_HERE') {
      console.log('⚠️ SendGrid não configurado - email não será enviado');
      return { success: false, message: 'SendGrid não configurado' };
    }

    if (!process.env.NOTIFICATION_EMAIL) {
      console.log('⚠️ Email de notificação não configurado');
      return { success: false, message: 'Email de notificação não configurado' };
    }

    // Formatar as datas
    const checkInFormatted = new Date(reservationData.checkIn).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const checkOutFormatted = new Date(reservationData.checkOut).toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    // Calcular número de dias
    const checkInDate = new Date(reservationData.checkIn);
    const checkOutDate = new Date(reservationData.checkOut);
    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const totalDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // Construir o conteúdo do email
    const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #059669, #10b981); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 28px;">🏡 Nova Reserva</h1>
        <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 18px;">Sítio Recanto da Limeira</p>
      </div>
      
      <div style="background: white; padding: 30px; border: 1px solid #e5e5e5; border-radius: 0 0 10px 10px;">
        <p style="font-size: 18px; color: #059669; font-weight: bold; margin-bottom: 20px;">
          Uma nova reserva foi realizada através do ${reservationData.source}!
        </p>
        
        <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #374151; margin-top: 0; border-bottom: 2px solid #059669; padding-bottom: 10px;">
            📋 Informações da Reserva
          </h3>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 120px;">
                👤 Hóspede:
              </td>
              <td style="padding: 8px 0; color: #6b7280;">
                ${reservationData.guestName}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">
                📧 Email:
              </td>
              <td style="padding: 8px 0; color: #6b7280;">
                <a href="mailto:${reservationData.guestEmail}" style="color: #059669; text-decoration: none;">
                  ${reservationData.guestEmail}
                </a>
              </td>
            </tr>
            ${reservationData.guestPhone ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">
                📱 Telefone:
              </td>
              <td style="padding: 8px 0; color: #6b7280;">
                <a href="tel:${reservationData.guestPhone}" style="color: #059669; text-decoration: none;">
                  ${reservationData.guestPhone}
                </a>
              </td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">
                📅 Check-in:
              </td>
              <td style="padding: 8px 0; color: #6b7280;">
                ${checkInFormatted}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">
                📅 Check-out:
              </td>
              <td style="padding: 8px 0; color: #6b7280;">
                ${checkOutFormatted}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">
                🗓️ Duração:
              </td>
              <td style="padding: 8px 0; color: #6b7280;">
                ${totalDays} ${totalDays === 1 ? 'dia' : 'dias'}
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">
                👥 Pessoas:
              </td>
              <td style="padding: 8px 0; color: #6b7280;">
                ${reservationData.guests} ${reservationData.guests === 1 ? 'pessoa' : 'pessoas'}
              </td>
            </tr>
            ${reservationData.observations ? `
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151; vertical-align: top;">
                📝 Observações:
              </td>
              <td style="padding: 8px 0; color: #6b7280;">
                ${reservationData.observations}
              </td>
            </tr>
            ` : ''}
            <tr>
              <td style="padding: 8px 0; font-weight: bold; color: #374151;">
                🌐 Origem:
              </td>
              <td style="padding: 8px 0;">
                <span style="background: ${reservationData.source === 'Site' ? '#dcfce7' : '#fef3c7'}; 
                           color: ${reservationData.source === 'Site' ? '#059669' : '#d97706'}; 
                           padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 12px;">
                  ${reservationData.source}
                </span>
              </td>
            </tr>
          </table>
        </div>
        
        <div style="background: #f0fdf4; border-left: 4px solid #059669; padding: 15px; margin: 20px 0;">
          <p style="margin: 0; color: #374151; font-weight: bold;">
            💡 Próximos passos:
          </p>
          <p style="margin: 10px 0 0 0; color: #6b7280;">
            Entre em contato com o hóspede para acertar detalhes, valores e confirmar a reserva.
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/login" 
             style="background: #059669; color: white; padding: 12px 24px; text-decoration: none; 
                    border-radius: 6px; font-weight: bold; display: inline-block;">
            🔧 Acessar Painel Administrativo
          </a>
        </div>
        
        <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 30px 0;">
        
        <p style="text-align: center; color: #9ca3af; font-size: 14px; margin: 0;">
          Este é um email automático do sistema de reservas do Sítio Recanto da Limeira.
        </p>
      </div>
    </div>
    `;

    const msg = {
      to: process.env.NOTIFICATION_EMAIL,
      from: {
        email: process.env.NOTIFICATION_EMAIL, // SendGrid requer um email verificado como remetente
        name: 'Sítio Recanto da Limeira'
      },
      subject: `🏡 Nova Reserva - ${reservationData.guestName} (${reservationData.source})`,
      html: emailContent
    };

    await sgMail.send(msg);

    console.log(`✅ Email de notificação enviado para ${process.env.NOTIFICATION_EMAIL}`);
    return { success: true, message: 'Email enviado com sucesso' };

  } catch (error) {
    console.error('❌ Erro ao enviar email:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Erro desconhecido ao enviar email' 
    };
  }
}
