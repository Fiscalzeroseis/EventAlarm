import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useEventStore, type EventItem } from '../store/eventStore';
import { parseISO, isBefore, isPast } from 'date-fns';

export function useEventMonitor() {
  const { events, updateEvent, setEvents } = useEventStore();
  const [activeAlert, setActiveAlert] = useState<EventItem | null>(null);

  // Inscrever-se em mudanças realtime
  useEffect(() => {
    const channel = supabase
      .channel('public:events')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'events' },
        (payload) => {
          const updatedEvent = payload.new as EventItem;
          // Atualiza a store
          updateEvent(updatedEvent.id, updatedEvent);
          
          // Se o evento que foi atualizado (ex: is_notified mudou para true) for o que está tocando, fechar o alerta
          if (activeAlert && activeAlert.id === updatedEvent.id && updatedEvent.is_notified) {
            setActiveAlert(null);
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'events' },
        (payload) => {
          // Lógica opcional para adicionar na store automaticamente se outro cliente criar (mas já temos no form local)
          // setEvents([...events, payload.new as EventItem])
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeAlert, updateEvent, events, setEvents]);

  // Monitorar a cada minuto
  useEffect(() => {
    const checkAlerts = () => {
      const now = new Date();
      
      // Encontrar primeiro evento não notificado cujo alert_date_time já passou ou é agora
      const triggeredEvent = events.find((event) => {
        if (event.is_notified) return false;
        
        const alertTime = parseISO(event.alert_date_time);
        return isPast(alertTime); // Retorna true se alertTime for menor que agora
      });

      if (triggeredEvent) {
        setActiveAlert(triggeredEvent);
      }
    };

    // Checar imediatamente e depois a cada segundo/minuto
    // Usamos um intervalo menor (10s) apenas para o alerta disparar rapidamente na demo
    checkAlerts();
    const interval = setInterval(checkAlerts, 10000); 

    return () => clearInterval(interval);
  }, [events]);

  const dismissAlert = async (eventId: string) => {
    // 1. Ocultar o modal localmente de imediato
    setActiveAlert(null);
    
    // 2. Atualizar no banco de dados
    const { error } = await supabase
      .from('events')
      .update({ is_notified: true })
      .eq('id', eventId);
      
    if (error) {
      console.error('Erro ao atualizar notificação:', error);
      // Se falhar, talvez precisemos exibir novamente ou tentar novamente, mas ignoraremos para simplificar
    } else {
      // Atualizar store local
      updateEvent(eventId, { is_notified: true });
    }
  };

  return {
    activeAlert,
    dismissAlert
  };
}
