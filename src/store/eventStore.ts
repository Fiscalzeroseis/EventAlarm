import { create } from 'zustand';

export interface EventItem {
  id: string;
  title: string;
  description: string | null;
  event_date_time: string;
  alert_date_time: string;
  is_notified: boolean;
  created_at: string;
}

interface EventStore {
  events: EventItem[];
  setEvents: (events: EventItem[]) => void;
  addEvent: (event: EventItem) => void;
  updateEvent: (id: string, updatedFields: Partial<EventItem>) => void;
}

export const useEventStore = create<EventStore>((set) => ({
  events: [],
  setEvents: (events) => set({ events }),
  addEvent: (event) => set((state) => ({ events: [event, ...state.events] })),
  updateEvent: (id, updatedFields) => set((state) => ({
    events: state.events.map((evt) => evt.id === id ? { ...evt, ...updatedFields } : evt)
  })),
}));
