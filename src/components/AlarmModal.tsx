import React from 'react';
import type { EventItem } from '../store/eventStore';
import { AlertTriangle } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface AlarmModalProps {
  event: EventItem | null;
  onDismiss: (eventId: string) => void;
}

export function AlarmModal({ event, onDismiss }: AlarmModalProps) {
  React.useEffect(() => {
    if (event) {
      // Áudio de alarme tocando em loop
      const audio = new Audio('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg');
      audio.loop = true;
      audio.play().catch(err => console.log('Áudio bloqueado pelo navegador:', err));

      // Disparar Notificação Nativa do Sistema Operacional
      if (Notification.permission === 'granted') {
        new Notification('Alarme: ' + event.title, {
          body: event.description || 'Está na hora do seu evento!',
          requireInteraction: true, // Mantém a notificação na tela até o usuário interagir
        });
      }

      return () => {
        audio.pause();
        audio.currentTime = 0;
      };
    }
  }, [event]);

  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="bg-red-600 w-full max-w-2xl rounded-2xl shadow-[0_0_100px_rgba(220,38,38,0.8)] border-4 border-yellow-400 p-8 flex flex-col items-center justify-center text-center animate-alarm-shake">
        
        <AlertTriangle className="text-yellow-400 w-32 h-32 mb-6 animate-pulse" />
        
        <h1 className="text-5xl font-black text-white uppercase tracking-wider mb-2 drop-shadow-lg">
          Alerta de Evento!
        </h1>
        
        <div className="bg-black/40 w-full p-6 rounded-xl mt-6 mb-8 border border-red-400">
          <h2 className="text-4xl font-bold text-yellow-300 mb-4">{event.title}</h2>
          {event.description && (
            <p className="text-xl text-white/90 mb-4">{event.description}</p>
          )}
          <div className="inline-block bg-yellow-400 text-black px-4 py-2 rounded-full font-bold text-xl">
            Agendado para: {format(parseISO(event.event_date_time), "HH:mm")}
          </div>
        </div>

        <button
          onClick={() => onDismiss(event.id)}
          className="bg-black hover:bg-slate-900 text-yellow-400 text-3xl font-black py-6 px-12 rounded-full border-4 border-yellow-400 uppercase tracking-widest hover:scale-105 transition-transform shadow-2xl active:scale-95"
        >
          Estou Ciente!
        </button>
      </div>
    </div>
  );
}
