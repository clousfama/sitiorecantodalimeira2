
'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Calendar, 
  Users, 
  Mail, 
  Phone, 
  CheckCircle, 
  XCircle, 
  Clock,
  LogOut,
  AlertTriangle,
  Plus,
  Trash2,
  Ban,
  Shield,
  TrendingUp,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

interface Reservation {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  totalDays: number;
  totalPrice: number | null;
  observations: string | null;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  createdAt: string;
}

interface BlockedDate {
  id: string;
  date: string;
  reason: string;
  createdAt: string;
}

interface Conflict {
  type: 'OVERLAP' | 'SAME_DAY';
  message: string;
  reservations: Reservation[];
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export default function AdminDashboard() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'reservations' | 'conflicts' | 'blocked' | 'sync' | 'manual-booking'>('reservations');
  
  // Estados para bloquear datas
  const [newBlockDate, setNewBlockDate] = useState('');
  const [blockReason, setBlockReason] = useState('');
  
  // Estados para sincronização Airbnb
  const [icalUrl, setIcalUrl] = useState('https://www.airbnb.com/calendar/ical/1472647101580205867.ics?s=b97d414e9cafe42dca0b119cca0a25f7&locale=pt');
  const [syncLoading, setSyncLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{ message: string; success: boolean } | null>(null);
  const [autoSyncRunning, setAutoSyncRunning] = useState(false);

  // Estados para reserva manual
  const [manualBooking, setManualBooking] = useState({
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    totalPrice: '',
    observations: ''
  });
  const [manualBookingLoading, setManualBookingLoading] = useState(false);
  const [manualBookingStatus, setManualBookingStatus] = useState<{ message: string; success: boolean } | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    } else if (status === 'authenticated') {
      fetchAllData();
    }
  }, [status, router]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchReservations(),
        fetchBlockedDates(),
        fetchConflicts()
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await fetch('/api/reservations');
      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      }
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
    }
  };

  const fetchBlockedDates = async () => {
    try {
      const response = await fetch('/api/admin/blocked-dates');
      if (response.ok) {
        const data = await response.json();
        setBlockedDates(data);
      }
    } catch (error) {
      console.error('Erro ao buscar datas bloqueadas:', error);
    }
  };

  const fetchConflicts = async () => {
    try {
      const response = await fetch('/api/admin/reservations/conflicts');
      if (response.ok) {
        const data = await response.json();
        setConflicts(data.conflicts);
      }
    } catch (error) {
      console.error('Erro ao buscar conflitos:', error);
    }
  };

  const blockDate = async () => {
    if (!newBlockDate) return;

    try {
      const response = await fetch('/api/admin/blocked-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: newBlockDate,
          reason: blockReason || 'Indisponível'
        })
      });

      if (response.ok) {
        setNewBlockDate('');
        setBlockReason('');
        fetchBlockedDates();
      } else {
        const error = await response.json();
        alert(error.error);
      }
    } catch (error) {
      console.error('Erro ao bloquear data:', error);
      alert('Erro ao bloquear data');
    }
  };

  const unblockDate = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/blocked-dates/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchBlockedDates();
      }
    } catch (error) {
      console.error('Erro ao desbloquear data:', error);
    }
  };

  const updateReservationStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/reservations/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        await fetchAllData(); // Recarregar tudo para atualizar conflitos
      }
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const syncWithAirbnb = async () => {
    if (!icalUrl.trim()) {
      setSyncStatus({ message: 'URL do iCal é obrigatória', success: false });
      return;
    }

    setSyncLoading(true);
    setSyncStatus(null);

    try {
      const response = await fetch('/api/admin/sync-airbnb', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ icalUrl: icalUrl.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSyncStatus({ 
          message: data.message, 
          success: true 
        });
        // Atualizar os dados após sync
        await fetchBlockedDates();
      } else {
        setSyncStatus({ 
          message: data.error || data.message || 'Erro na sincronização', 
          success: false 
        });
      }
    } catch (error) {
      setSyncStatus({ 
        message: 'Erro de conexão. Tente novamente.', 
        success: false 
      });
    } finally {
      setSyncLoading(false);
    }
  };

  const createManualReservation = async () => {
    if (!manualBooking.guestName || !manualBooking.guestEmail || !manualBooking.checkIn || !manualBooking.checkOut) {
      setManualBookingStatus({ message: 'Preencha os campos obrigatórios', success: false });
      return;
    }

    setManualBookingLoading(true);
    setManualBookingStatus(null);

    try {
      const response = await fetch('/api/admin/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(manualBooking),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setManualBookingStatus({ 
          message: data.message, 
          success: true 
        });
        
        // Limpar o formulário
        setManualBooking({
          guestName: '',
          guestEmail: '',
          guestPhone: '',
          checkIn: '',
          checkOut: '',
          guests: 1,
          totalPrice: '',
          observations: ''
        });
        
        // Atualizar as reservas
        await fetchAllData();
      } else {
        setManualBookingStatus({ 
          message: data.error || 'Erro ao criar reserva', 
          success: false 
        });
      }
    } catch (error) {
      setManualBookingStatus({ 
        message: 'Erro de conexão. Tente novamente.', 
        success: false 
      });
    } finally {
      setManualBookingLoading(false);
    }
  };

  const toggleAutoSync = async (action: 'start' | 'stop') => {
    try {
      const response = await fetch('/api/admin/auto-sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();

      if (response.ok) {
        setAutoSyncRunning(data.isRunning);
        setSyncStatus({ message: data.message, success: true });
      } else {
        setSyncStatus({ message: data.error || 'Erro ao alterar sincronização automática', success: false });
      }
    } catch (error) {
      setSyncStatus({ message: 'Erro de conexão', success: false });
    }
  };

  const checkAutoSyncStatus = async () => {
    try {
      const response = await fetch('/api/admin/auto-sync');
      if (response.ok) {
        const data = await response.json();
        setAutoSyncRunning(data.isRunning);
      }
    } catch (error) {
      console.error('Erro ao verificar status da sincronização:', error);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      checkAutoSyncStatus();
    }
  }, [status]);

  const getStatusBadge = (status: string) => {
    const statusMap = {
      PENDING: { label: 'Pendente', variant: 'secondary' as const, icon: Clock },
      CONFIRMED: { label: 'Confirmada', variant: 'default' as const, icon: CheckCircle },
      CANCELLED: { label: 'Cancelada', variant: 'destructive' as const, icon: XCircle },
      COMPLETED: { label: 'Concluída', variant: 'outline' as const, icon: CheckCircle }
    };

    const statusInfo = statusMap[status as keyof typeof statusMap];
    const Icon = statusInfo.icon;

    return (
      <Badge variant={statusInfo.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {statusInfo.label}
      </Badge>
    );
  };

  if (status === 'loading' || loading) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  if (status === 'unauthenticated') {
    return null;
  }

  // Helper functions
  const getConflictBadge = (priority: string) => {
    const priorityMap = {
      HIGH: { variant: 'destructive' as const, label: 'Alto' },
      MEDIUM: { variant: 'secondary' as const, label: 'Médio' },
      LOW: { variant: 'outline' as const, label: 'Baixo' }
    };
    const info = priorityMap[priority as keyof typeof priorityMap];
    return <Badge variant={info.variant}>{info.label}</Badge>;
  };

  // Stats calculations
  const pendingCount = reservations.filter(r => r.status === 'PENDING').length;
  const confirmedCount = reservations.filter(r => r.status === 'CONFIRMED').length;
  const highPriorityConflicts = conflicts.filter(c => c.priority === 'HIGH').length;
  const totalBlockedDates = blockedDates.length;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Painel Administrativo</h1>
            <p className="text-gray-600">Sítio Recanto da Limeira</p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={fetchAllData}
              variant="outline"
              className="flex items-center gap-2"
            >
              <TrendingUp className="h-4 w-4" />
              Atualizar
            </Button>
            <Button 
              onClick={() => signOut({ callbackUrl: '/' })} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 mb-6">
          <Button
            variant={activeTab === 'reservations' ? 'default' : 'outline'}
            onClick={() => setActiveTab('reservations')}
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Reservas ({reservations.length})
          </Button>
          <Button
            variant={activeTab === 'conflicts' ? 'default' : 'outline'}
            onClick={() => setActiveTab('conflicts')}
            className="flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            Conflitos ({conflicts.length})
          </Button>
          <Button
            variant={activeTab === 'blocked' ? 'default' : 'outline'}
            onClick={() => setActiveTab('blocked')}
            className="flex items-center gap-2"
          >
            <Ban className="h-4 w-4" />
            Datas Bloqueadas ({totalBlockedDates})
          </Button>
          <Button
            variant={activeTab === 'sync' ? 'default' : 'outline'}
            onClick={() => setActiveTab('sync')}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Sincronização Airbnb
          </Button>
          <Button
            variant={activeTab === 'manual-booking' ? 'default' : 'outline'}
            onClick={() => setActiveTab('manual-booking')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Nova Reserva
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Reservas Pendentes</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingCount}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Reservas Confirmadas</p>
                  <p className="text-2xl font-bold text-green-600">{confirmedCount}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Conflitos Críticos</p>
                  <p className="text-2xl font-bold text-red-600">{highPriorityConflicts}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Datas Bloqueadas</p>
                  <p className="text-2xl font-bold text-gray-600">{totalBlockedDates}</p>
                </div>
                <Shield className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'reservations' && (
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Reservas</CardTitle>
            </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reservations.map((reservation) => (
                <motion.div
                  key={reservation.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-800">{reservation.guestName}</h3>
                        <p className="text-sm text-gray-600">{reservation.guestEmail}</p>
                      </div>
                    </div>
                    {getStatusBadge(reservation.status)}
                  </div>

                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span>
                        {new Date(reservation.checkIn).toLocaleDateString('pt-BR')} - {new Date(reservation.checkOut).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{reservation.guests} hóspedes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{reservation.guestPhone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{reservation.totalDays} dias</span>
                    </div>
                  </div>

                  {reservation.observations && (
                    <div className="mt-3 p-2 bg-gray-50 rounded text-sm">
                      <strong>Observações:</strong> {reservation.observations}
                    </div>
                  )}

                  {reservation.status === 'PENDING' && (
                    <div className="mt-4 flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => updateReservationStatus(reservation.id, 'CONFIRMED')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Confirmar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => updateReservationStatus(reservation.id, 'CANCELLED')}
                      >
                        Cancelar
                      </Button>
                    </div>
                  )}
                </motion.div>
              ))}

              {reservations.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma reserva encontrada
                </div>
              )}
            </div>
            </CardContent>
          </Card>
        )}

        {/* Conflicts Tab */}
        {activeTab === 'conflicts' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Conflitos de Reservas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conflicts.map((conflict, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`p-4 border rounded-lg ${
                      conflict.priority === 'HIGH' ? 'border-red-200 bg-red-50' : 
                      conflict.priority === 'MEDIUM' ? 'border-yellow-200 bg-yellow-50' : 
                      'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">{conflict.message}</h3>
                        <p className="text-sm text-gray-600">
                          Tipo: {conflict.type === 'OVERLAP' ? 'Sobreposição de datas' : 'Mesmo dia de entrada/saída'}
                        </p>
                      </div>
                      {getConflictBadge(conflict.priority)}
                    </div>
                    
                    <div className="space-y-2">
                      {conflict.reservations.map((res) => (
                        <div key={res.id} className="flex justify-between items-center bg-white p-2 rounded border-l-4 border-blue-400">
                          <div>
                            <span className="font-medium">{res.guestName}</span>
                            <span className="text-sm text-gray-500 ml-2">
                              {new Date(res.checkIn).toLocaleDateString('pt-BR')} - {new Date(res.checkOut).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                          {getStatusBadge(res.status)}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
                
                {conflicts.length === 0 && (
                  <div className="text-center py-8 text-green-600">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2" />
                    <p className="font-semibold">Nenhum conflito detectado!</p>
                    <p className="text-sm text-gray-600">Todas as reservas estão organizadas corretamente.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Blocked Dates Tab */}
        {activeTab === 'blocked' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ban className="h-5 w-5" />
                Gerenciar Datas Bloqueadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Form to block new date */}
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold mb-3">Bloquear Nova Data</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <Input
                    type="date"
                    value={newBlockDate}
                    onChange={(e) => setNewBlockDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <Input
                    placeholder="Motivo (opcional)"
                    value={blockReason}
                    onChange={(e) => setBlockReason(e.target.value)}
                  />
                  <Button 
                    onClick={blockDate}
                    disabled={!newBlockDate}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Bloquear Data
                  </Button>
                </div>
              </div>

              {/* Blocked dates list */}
              <div className="space-y-3">
                {blockedDates.map((blocked) => (
                  <motion.div
                    key={blocked.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border"
                  >
                    <div>
                      <span className="font-medium">
                        {new Date(blocked.date).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="text-sm text-gray-600 ml-2">
                        - {blocked.reason}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => unblockDate(blocked.id)}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-3 w-3" />
                      Desbloquear
                    </Button>
                  </motion.div>
                ))}
                
                {blockedDates.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                    <p className="font-semibold">Nenhuma data bloqueada</p>
                    <p className="text-sm">Use o formulário acima para bloquear datas específicas.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Sync Tab */}
        {activeTab === 'sync' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Sincronização com Airbnb
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Informações sobre a sincronização */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Como funciona
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    A sincronização importa automaticamente as reservas do Airbnb para evitar conflitos de agendamento. 
                    As datas ocupadas no Airbnb serão bloqueadas automaticamente no sistema.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-blue-600">
                    <ExternalLink className="h-3 w-3" />
                    <a 
                      href="https://www.airbnb.com.br/rooms/1472647101580205867" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="underline hover:text-blue-800"
                    >
                      Ver listagem no Airbnb
                    </a>
                  </div>
                </div>

                {/* Controle de Sincronização Automática */}
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Sincronização Automática
                  </h3>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        Status: <span className={`font-medium ${autoSyncRunning ? 'text-green-600' : 'text-red-600'}`}>
                          {autoSyncRunning ? 'Ativa (a cada 4 horas)' : 'Inativa'}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500">
                        Sincroniza automaticamente as reservas do Airbnb
                      </p>
                    </div>
                    <Button 
                      variant={autoSyncRunning ? 'destructive' : 'default'}
                      onClick={() => toggleAutoSync(autoSyncRunning ? 'stop' : 'start')}
                      className="flex items-center gap-2"
                    >
                      {autoSyncRunning ? 'Parar' : 'Iniciar'}
                    </Button>
                  </div>
                </div>

                {/* Formulário de sincronização manual */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      URL do iCal do Airbnb
                    </label>
                    <Input
                      type="url"
                      value={icalUrl}
                      onChange={(e) => setIcalUrl(e.target.value)}
                      placeholder="https://www.airbnb.com.br/calendar/ical/..."
                      className="w-full"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      URL do calendário iCal fornecida pelo Airbnb para sincronização
                    </p>
                  </div>

                  <Button 
                    onClick={syncWithAirbnb}
                    disabled={syncLoading || !icalUrl.trim()}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${syncLoading ? 'animate-spin' : ''}`} />
                    {syncLoading ? 'Sincronizando...' : 'Sincronizar Agora (Manual)'}
                  </Button>
                </div>

                {/* Status da sincronização */}
                {syncStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg ${
                      syncStatus.success 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {syncStatus.success ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <p className={`font-medium ${
                        syncStatus.success ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {syncStatus.success ? 'Sincronização concluída!' : 'Erro na sincronização'}
                      </p>
                    </div>
                    <p className={`text-sm mt-1 ${
                      syncStatus.success ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {syncStatus.message}
                    </p>
                  </motion.div>
                )}

                {/* Instruções */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Instruções para obter o link iCal:</h3>
                  <ol className="text-sm text-gray-600 space-y-1">
                    <li>1. Acesse sua listagem no Airbnb</li>
                    <li>2. Vá em "Calendário" → "Disponibilidade"</li>
                    <li>3. Clique em "Exportar calendário"</li>
                    <li>4. Copie o link iCal fornecido</li>
                    <li>5. Cole o link acima e clique em "Sincronizar"</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Manual Booking Tab */}
        {activeTab === 'manual-booking' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Criar Nova Reserva
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Informações sobre a reserva manual */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Reserva Manual</h3>
                  <p className="text-sm text-gray-600">
                    Use este formulário para criar reservas diretamente no sistema. A reserva será criada com status "Confirmada" automaticamente.
                  </p>
                </div>

                {/* Formulário de reserva */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nome do Hóspede *
                    </label>
                    <Input
                      value={manualBooking.guestName}
                      onChange={(e) => setManualBooking({...manualBooking, guestName: e.target.value})}
                      placeholder="Nome completo"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      value={manualBooking.guestEmail}
                      onChange={(e) => setManualBooking({...manualBooking, guestEmail: e.target.value})}
                      placeholder="email@exemplo.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Telefone
                    </label>
                    <Input
                      value={manualBooking.guestPhone}
                      onChange={(e) => setManualBooking({...manualBooking, guestPhone: e.target.value})}
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Hóspedes *
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      value={manualBooking.guests}
                      onChange={(e) => setManualBooking({...manualBooking, guests: parseInt(e.target.value) || 1})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-in *
                    </label>
                    <Input
                      type="date"
                      value={manualBooking.checkIn}
                      onChange={(e) => setManualBooking({...manualBooking, checkIn: e.target.value})}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Check-out *
                    </label>
                    <Input
                      type="date"
                      value={manualBooking.checkOut}
                      onChange={(e) => setManualBooking({...manualBooking, checkOut: e.target.value})}
                      min={manualBooking.checkIn || new Date().toISOString().split('T')[0]}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor Total (R$)
                    </label>
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      value={manualBooking.totalPrice}
                      onChange={(e) => setManualBooking({...manualBooking, totalPrice: e.target.value})}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações
                  </label>
                  <Textarea
                    value={manualBooking.observations}
                    onChange={(e) => setManualBooking({...manualBooking, observations: e.target.value})}
                    placeholder="Observações adicionais sobre a reserva..."
                    rows={3}
                  />
                </div>

                <Button 
                  onClick={createManualReservation}
                  disabled={manualBookingLoading || !manualBooking.guestName || !manualBooking.guestEmail || !manualBooking.checkIn || !manualBooking.checkOut}
                  className="flex items-center gap-2"
                >
                  <Plus className={`h-4 w-4 ${manualBookingLoading ? 'animate-spin' : ''}`} />
                  {manualBookingLoading ? 'Criando Reserva...' : 'Criar Reserva'}
                </Button>

                {/* Status da criação */}
                {manualBookingStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-lg ${
                      manualBookingStatus.success 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {manualBookingStatus.success ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                      <p className={`font-medium ${
                        manualBookingStatus.success ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {manualBookingStatus.success ? 'Reserva criada com sucesso!' : 'Erro ao criar reserva'}
                      </p>
                    </div>
                    <p className={`text-sm mt-1 ${
                      manualBookingStatus.success ? 'text-green-700' : 'text-red-700'
                    }`}>
                      {manualBookingStatus.message}
                    </p>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
