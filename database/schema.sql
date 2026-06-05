-- Desabilitar RLS (Row Level Security) temporariamente para testes locais
-- AVISO: EM PRODUÇÃO, VOCÊ DEVE HABILITAR O RLS E CONFIGURAR AS POLÍTICAS ADEQUADAS!
-- alter table "public"."events" enable row level security;

CREATE TABLE public.events (
  id uuid DEFAULT gen_random_uuid() NOT NULL,
  title text NOT NULL,
  description text,
  event_date_time timestamp with time zone NOT NULL,
  alert_date_time timestamp with time zone NOT NULL,
  is_notified boolean DEFAULT false NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  
  CONSTRAINT events_pkey PRIMARY KEY (id)
);

-- Ativando Realtime para a tabela events
-- Necessário para que o supabase.channel escute as alterações nela
ALTER PUBLICATION supabase_realtime ADD TABLE public.events;
