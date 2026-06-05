import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useEventStore, type EventItem } from '../store/eventStore';
import { format, isPast, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { CalendarDays, Clock, Bell, BellRing } from 'lucide-react';

export function EventDashboard() {
  const { events, setEvents } = useEventStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date_time', { ascending: true });
        
      if (error) {
        console.error('Erro ao buscar eventos:', error);
      } else if (data) {
        setEvents(data as EventItem[]);
      }
      setLoading(false);
    };

    fetchEvents();
  }, [setEvents]);

  const now = new Date();

  // Separar eventos em próximos e passados
  const upcomingEvents = events.filter(e => !isPast(parseISO(e.event_date_time)));
  const pastEvents = events.filter(e => isPast(parseISO(e.event_date_time)));

  const EventCard = ({ event }: { event: EventItem }) => {
    const eventDate = parseISO(event.event_date_time);
    const alertDate = parseISO(event.alert_date_time);
    
    return (
      <div className="bg-slate-800 p-5 rounded-lg border border-slate-700 shadow-md hover:shadow-lg transition-shadow">
        <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
        {event.description && <p className="text-slate-400 text-sm mb-4">{event.description}</p>}
        
        <div className="space-y-2 text-sm text-slate-300">
          <div className="flex items-center gap-2">
            <CalendarDays size={16} className="text-blue-400" />
            <span>{format(eventDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-blue-400" />
            <span>{format(eventDate, "HH:mm")}</span>
          </div>
          <div className={`flex items-center gap-2 ${event.is_notified ? 'text-green-400' : 'text-yellow-400'}`}>
            {event.is_notified ? <Bell size={16} /> : <BellRing size={16} />}
            <span>
              Alerta: {format(alertDate, "dd/MM HH:mm")} 
              {event.is_notified ? ' (Notificado)' : ' (Pendente)'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return <div className="text-center text-slate-400 py-10">Carregando eventos...</div>;
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700 pb-2">
          Próximos Eventos <span className="text-sm font-normal text-slate-400 ml-2">({upcomingEvents.length})</span>
        </h2>
        {upcomingEvents.length === 0 ? (
          <p className="text-slate-500 italic">Nenhum evento próximo.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents.map(event => <EventCard key={event.id} event={event} />)}
          </div>
        )}
      </section>

      <section className="opacity-75">
        <h2 className="text-2xl font-bold text-white mb-4 border-b border-slate-700 pb-2">
          Eventos Passados <span className="text-sm font-normal text-slate-400 ml-2">({pastEvents.length})</span>
        </h2>
        {pastEvents.length === 0 ? (
          <p className="text-slate-500 italic">Nenhum evento passado.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastEvents.map(event => <EventCard key={event.id} event={event} />)}
          </div>
        )}
      </section>
    </div>
  );
}
