import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { format } from 'date-fns';
import { CalendarDays, Plus, Calendar as CalendarIcon } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import NewEvaluationModal from '../components/modals/NewEvaluationModal';
import axios from 'axios';

const Calendar = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [scheduledEvaluations, setScheduledEvaluations] = useState([]);
  const [environments, setEnvironments] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentView, setCurrentView] = useState('calendar');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  useEffect(() => {
    const jwt = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem('user'));
    setToken(jwt);
    setUser(currentUser);

    const fetchData = async () => {
      try {
        const [evalRes, envRes, usersRes] = await Promise.all([
          axios.get('http://localhost:5000/api/schedules', { headers: { Authorization: `Bearer ${jwt}` } }),
          axios.get('http://localhost:5000/api/environments', { headers: { Authorization: `Bearer ${jwt}` } }),
          axios.get('http://localhost:5000/api/users', { headers: { Authorization: `Bearer ${jwt}` } }),
        ]);

        setScheduledEvaluations(evalRes.data);
        setEnvironments(envRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error('Erro ao carregar dados do calendário:', error);
      }
    };

    fetchData();
  }, []);

  const calendarEvents = scheduledEvaluations.map(s => {
    const environment = environments.find(e => e.id === s.environmentId);
    const inspector = users.find(u => u.id === s.inspectorId);
    return {
      id: s.id,
      title: environment?.name || 'Ambiente',
      start: s.scheduledDate,
      end: s.scheduledDate,
      color: s.status === 'completed' ? '#22c55e' : s.status === 'canceled' ? '#ef4444' : '#0056A4',
      extendedProps: {
        environmentId: s.environmentId,
        inspectorId: s.inspectorId,
        status: s.status,
        environmentName: environment?.name,
        inspectorName: inspector?.name,
      },
    };
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvaluations = scheduledEvaluations
    .filter(s => new Date(s.scheduledDate).setHours(0, 0, 0, 0) >= today && s.status !== 'completed')
    .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate));

  const handleScheduleEvaluation = (data) => {
    console.log('Agendar avaliação:', data);
    setIsNewModalOpen(false);
  };

  return (
    <div className="page-container">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="page-title mb-2 sm:mb-0">Calendário de Vistorias</h1>

        {user?.role !== 'student' && (
          <div className="flex space-x-3">
            <Button variant="primary" leftIcon={<Plus className="h-4 w-4" />} onClick={() => setIsNewModalOpen(true)}>
              Agendar Vistoria
            </Button>
            <div className="inline-flex rounded-md shadow-sm">
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                  currentView === 'calendar' ? 'bg-primary-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300`}
                onClick={() => setCurrentView('calendar')}
              >
                <CalendarIcon className="h-4 w-4" />
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                  currentView === 'list' ? 'bg-primary-500 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                } border border-gray-300`}
                onClick={() => setCurrentView('list')}
              >
                <CalendarDays className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className={`lg:col-span-${currentView === 'calendar' ? '2' : '3'}`}>
          {currentView === 'calendar' ? (
            <Card className="p-0 overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Calendário de Vistorias</h2>
              </div>
              <div className="p-4">
                <FullCalendar
                  plugins={[dayGridPlugin]}
                  initialView="dayGridMonth"
                  events={calendarEvents}
                  headerToolbar={{ left: 'prev,next today', center: 'title', right: 'dayGridMonth' }}
                  height="auto"
                  eventContent={(eventInfo) => (
                    <div className="p-1 text-xs">
                      <div className="font-semibold truncate">{eventInfo.event.title}</div>
                      <div className="text-xs truncate">{eventInfo.event.extendedProps.inspectorName}</div>
                    </div>
                  )}
                />
              </div>
            </Card>
          ) : (
            <Card>
              <h2 className="text-lg font-semibold mb-4">Lista de Vistorias</h2>
              <div className="space-y-4">
                {scheduledEvaluations.map(s => {
                  const environment = environments.find(e => e.id === s.environmentId);
                  const inspector = users.find(u => u.id === s.inspectorId);
                  const date = new Date(s.scheduledDate);

                  return (
                    <div key={s.id} className="flex items-center border rounded-lg p-3 hover:bg-gray-50">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mr-3 ${
                        s.status === 'completed' ? 'bg-green-100 text-green-600'
                        : s.status === 'canceled' ? 'bg-red-100 text-red-600'
                        : 'bg-blue-100 text-blue-600'}`}>
                        <div className="text-center">
                          <div className="text-xs font-semibold">{format(date, 'MMM')}</div>
                          <div className="text-lg font-bold">{format(date, 'dd')}</div>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{environment?.name}</div>
                        <div className="text-sm text-gray-500">Inspetor: {inspector?.name}</div>
                        <div className="text-xs text-gray-400">{format(date, 'dd/MM/yyyy')}</div>
                      </div>
                      <div className="ml-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          s.status === 'completed' ? 'bg-green-100 text-green-800'
                          : s.status === 'canceled' ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'}`}>
                          {s.status === 'completed' ? 'Concluída' : s.status === 'canceled' ? 'Cancelada' : 'Agendada'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </div>

        {currentView === 'calendar' && (
          <div className="lg:col-span-1">
            <Card title="Próximas Vistorias">
              {upcomingEvaluations.length > 0 ? (
                <div className="divide-y">
                  {upcomingEvaluations.slice(0, 5).map(s => {
                    const environment = environments.find(e => e.id === s.environmentId);
                    const inspector = users.find(u => u.id === s.inspectorId);
                    return (
                      <div key={s.id} className="py-3">
                        <div className="font-medium">{environment?.name}</div>
                        <div className="text-sm text-gray-500">{format(new Date(s.scheduledDate), 'dd/MM/yyyy')}</div>
                        <div className="text-sm text-gray-500">Inspetor: {inspector?.name}</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-4">Não há vistorias agendadas</div>
              )}
            </Card>

            <Card title="Legenda" className="mt-6">
              <div className="space-y-2">
                <div className="flex items-center"><div className="w-4 h-4 rounded-full bg-primary-500 mr-2" /><span className="text-sm">Agendada</span></div>
                <div className="flex items-center"><div className="w-4 h-4 rounded-full bg-success-500 mr-2" /><span className="text-sm">Concluída</span></div>
                <div className="flex items-center"><div className="w-4 h-4 rounded-full bg-error-500 mr-2" /><span className="text-sm">Cancelada</span></div>
              </div>
            </Card>
          </div>
        )}
      </div>

      <NewEvaluationModal isOpen={isNewModalOpen} onClose={() => setIsNewModalOpen(false)} onSubmit={handleScheduleEvaluation} />
    </div>
  );
};

export default Calendar;
