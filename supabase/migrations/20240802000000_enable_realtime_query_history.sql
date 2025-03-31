
-- Habilita a replicação completa para a tabela query_history
ALTER TABLE public.query_history REPLICA IDENTITY FULL;

-- Adiciona a tabela query_history à publicação supabase_realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.query_history;
