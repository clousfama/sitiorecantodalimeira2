
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { 
  Calendar, 
  Users, 
  Phone, 
  Mail, 
  User, 
  MessageSquare, 
  AlertCircle,
  CheckCircle,
  ShieldAlert
} from 'lucide-react';


interface ReservationData {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  observations: string;
}

export default function ReservationSection() {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  const [formData, setFormData] = useState<ReservationData>({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    observations: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error' | 'conflict'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [loadingDates, setLoadingDates] = useState(true);

  // Buscar datas indisponíveis
  useEffect(() => {
    fetchUnavailableDates();
  }, []);

  const fetchUnavailableDates = async () => {
    try {
      const response = await fetch('/api/reservations/available-dates');
      if (response.ok) {
        const data = await response.json();
        setUnavailableDates(data.unavailableDates || []);
      }
    } catch (error) {
      console.error('Erro ao buscar datas disponíveis:', error);
    } finally {
      setLoadingDates(false);
    }
  };

  // Verificar se a data está disponível
  const isDateAvailable = (dateString: string) => {
    return !unavailableDates.includes(dateString);
  };

  // Verificar conflito de datas no período selecionado
  const hasDateConflict = (checkIn: string, checkOut: string) => {
    if (!checkIn || !checkOut) return false;
    
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const current = new Date(start);

    while (current < end) {
      const dateString = current.toISOString().split('T')[0];
      if (!isDateAvailable(dateString)) {
        return true;
      }
      current.setDate(current.getDate() + 1);
    }
    return false;
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    // Verificar conflito de datas antes de enviar
    if (hasDateConflict(formData.checkIn, formData.checkOut)) {
      setSubmitStatus('conflict');
      setErrorMessage('Algumas datas do período selecionado não estão disponíveis');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setSubmitStatus('conflict');
          setErrorMessage(data.error || 'Conflito de datas');
        } else {
          setSubmitStatus('error');
          setErrorMessage(data.error || 'Erro ao enviar reserva');
        }
        return;
      }

      setSubmitStatus('success');
      setFormData({
        guestName: '',
        guestEmail: '',
        guestPhone: '',
        checkIn: '',
        checkOut: '',
        guests: 1,
        observations: ''
      });
      
      // Atualizar datas indisponíveis
      fetchUnavailableDates();
      
    } catch (error) {
      console.error('Erro ao enviar reserva:', error);
      setSubmitStatus('error');
      setErrorMessage('Erro de conexão. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'guests' ? parseInt(value) || 1 : value
    }));
  };

  return (
    <section id="reservas" className="py-20 bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-6">
            Faça sua <span className="text-green-600">Reserva</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Garante já sua estadia no Sítio Recanto da Limeira. 
            Preencha o formulário e entraremos em contato para confirmar sua reserva.
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {/* Formulário de Reserva */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="shadow-xl border-green-100">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-800">Dados da Reserva</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nome */}
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      name="guestName"
                      type="text"
                      placeholder="Nome completo"
                      required
                      value={formData.guestName}
                      onChange={handleChange}
                      className="pl-12 border-green-200 focus:border-green-500"
                    />
                  </div>

                  {/* Email */}
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      name="guestEmail"
                      type="email"
                      placeholder="E-mail para contato"
                      required
                      value={formData.guestEmail}
                      onChange={handleChange}
                      className="pl-12 border-green-200 focus:border-green-500"
                    />
                  </div>

                  {/* Telefone */}
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      name="guestPhone"
                      type="tel"
                      placeholder="Telefone/WhatsApp"
                      required
                      value={formData.guestPhone}
                      onChange={handleChange}
                      className="pl-12 border-green-200 focus:border-green-500"
                    />
                  </div>

                  {/* Datas */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        name="checkIn"
                        type="date"
                        required
                        value={formData.checkIn}
                        onChange={handleChange}
                        className="pl-12 border-green-200 focus:border-green-500"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        name="checkOut"
                        type="date"
                        required
                        value={formData.checkOut}
                        onChange={handleChange}
                        className="pl-12 border-green-200 focus:border-green-500"
                        min={formData.checkIn || new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  {/* Número de hóspedes */}
                  <div className="relative">
                    <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <select
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                      className="w-full pl-12 pr-4 py-2 border border-green-200 rounded-md focus:border-green-500 focus:outline-none"
                    >
                      {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>
                          {num} {num === 1 ? 'pessoa' : 'pessoas'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Observações */}
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Textarea
                      name="observations"
                      placeholder="Observações especiais (opcional)"
                      value={formData.observations}
                      onChange={handleChange}
                      className="pl-12 border-green-200 focus:border-green-500 min-h-[100px]"
                    />
                  </div>

                  {/* Date Conflict Warning */}
                  {formData.checkIn && formData.checkOut && hasDateConflict(formData.checkIn, formData.checkOut) && (
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-md flex items-center">
                      <ShieldAlert className="h-5 w-5 text-orange-600 mr-2" />
                      <span className="text-orange-800">
                        Atenção: Algumas datas do período selecionado não estão disponíveis. 
                        Escolha outras datas para prosseguir.
                      </span>
                    </div>
                  )}

                  {/* Loading dates indicator */}
                  {loadingDates && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md flex items-center">
                      <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="text-blue-800 text-sm">Carregando disponibilidade...</span>
                    </div>
                  )}

                  {/* Status Messages */}
                  {submitStatus === 'success' && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-md flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-green-800">
                        Reserva solicitada com sucesso! Entraremos em contato em breve para confirmação.
                      </span>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-md flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
                      <span className="text-red-800">
                        {errorMessage || 'Erro ao enviar reserva. Tente novamente ou entre em contato conosco.'}
                      </span>
                    </div>
                  )}

                  {submitStatus === 'conflict' && (
                    <div className="p-4 bg-orange-50 border border-orange-200 rounded-md flex items-center">
                      <ShieldAlert className="h-5 w-5 text-orange-600 mr-2" />
                      <span className="text-orange-800">
                        {errorMessage || 'Período indisponível. Por favor, escolha outras datas.'}
                      </span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-lg py-6 disabled:bg-gray-400"
                    disabled={
                      isSubmitting || 
                      loadingDates || 
                      Boolean(formData.checkIn && formData.checkOut && hasDateConflict(formData.checkIn, formData.checkOut))
                    }
                  >
                    {isSubmitting ? 'Enviando...' : 
                     loadingDates ? 'Carregando...' : 
                     (formData.checkIn && formData.checkOut && hasDateConflict(formData.checkIn, formData.checkOut)) ? 
                     'Datas Indisponíveis' : 'Solicitar Reserva'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
