import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { subMinutes } from 'date-fns';
import { useEventStore } from '../store/eventStore';

export function EventForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [alertPreset, setAlertPreset] = useState('0'); // minutes before
  const [loading, setLoading] = useState(false);

  const { addEvent } = useEventStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !eventDate || !eventTime) {
      alert('Por favor, preencha os campos obrigatórios (título, data e hora).');
      return;
    }

    setLoading(true);

    const eventDateTimeString = `${eventDate}T${eventTime}:00`;
    const eventDateTime = new Date(eventDateTimeString);

    let alertDateTime = new Date(eventDateTime);
    const presetMinutes = parseInt(alertPreset, 10);
    
    if (presetMinutes > 0) {
      alertDateTime = subMinutes(alertDateTime, presetMinutes);
    }

    const newEvent = {
      title,
      description: description || null,
      event_date_time: eventDateTime.toISOString(),
      alert_date_time: alertDateTime.toISOString(),
      is_notified: false,
    };

    const { data, error } = await supabase
      .from('events')
      .insert([newEvent])
      .select()
      .single();

    setLoading(false);

    if (error) {
      console.error('Erro ao criar evento:', error);
      alert('Erro ao criar evento. Verifique o console.');
    } else if (data) {
      addEvent(data);
      setTitle('');
      setDescription('');
      setEventDate('');
      setEventTime('');
      setAlertPreset('0');
      alert('Evento criado com sucesso!');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-lg shadow-xl mb-8 border border-slate-700">
      <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
        Criar Novo Evento
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">Título do Evento *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Reunião importante..."
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">Descrição</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
            placeholder="Detalhes adicionais..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Data *</label>
          <input
            type="date"
            required
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">Hora *</label>
          <input
            type="time"
            required
            value={eventTime}
            onChange={(e) => setEventTime(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-medium text-slate-300 mb-1">Me avise com antecedência de:</label>
          <select
            value={alertPreset}
            onChange={(e) => setAlertPreset(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-md py-2 px-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="0">Na hora exata (0 min)</option>
            <option value="5">5 Minutos antes</option>
            <option value="15">15 Minutos antes</option>
            <option value="30">30 Minutos antes</option>
            <option value="60">1 Hora antes</option>
            <option value="1440">1 Dia antes</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Salvando...' : 'Criar Evento e Configurar Alerta'}
      </button>
    </form>
  );
}
