import React from 'react';
import { EventForm } from './components/EventForm';
import { EventDashboard } from './components/EventDashboard';
import { useEventMonitor } from './hooks/useEventMonitor';
import { AlarmModal } from './components/AlarmModal';
import { Bell, BellOff } from 'lucide-react';

function App() {
  const { activeAlert, dismissAlert } = useEventMonitor();
  const [notifPermission, setNotifPermission] = React.useState(Notification.permission);

  const requestPermission = () => {
    Notification.requestPermission().then((permission) => {
      setNotifPermission(permission);
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <header className="bg-slate-900 border-b border-slate-800 p-6 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Bell className="text-red-500 w-8 h-8" />
          <h1 className="text-3xl font-black tracking-tight text-white">Event Alarm System</h1>
          
          <div className="ml-auto">
            {notifPermission !== 'granted' ? (
              <button
                onClick={requestPermission}
                className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-semibold transition-colors"
              >
                <BellOff size={16} />
                Ativar Notificações do Windows
              </button>
            ) : (
              <span className="text-sm text-green-400 font-medium flex items-center gap-1">
                <Bell size={16} /> Notificações Ativas
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-6 mt-8">
        <EventForm />
        
        <div className="my-12"></div>
        
        <EventDashboard />
      </main>

      <AlarmModal event={activeAlert} onDismiss={dismissAlert} />
    </div>
  );
}

export default App;
