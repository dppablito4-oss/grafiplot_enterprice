-- ==============================================================================
-- 🧹 SCRIPT PARA LIMPIEZA AUTOMÁTICA DE BUCKET "pedidos" CADA 48 HORAS
-- Puedes ejecutar esto en tu Supabase SQL Editor.
-- Nota: Requiere la extensión pg_cron habilitada en tu proyecto de Supabase.
-- ==============================================================================

-- 1. Asegúrate de tener habilitada la extensión pg_cron
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 2. Función para eliminar los archivos que tengan más de 48 horas en el bucket 'pedidos'
CREATE OR REPLACE FUNCTION delete_old_pedidos()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Borra los registros de storage.objects (lo que también borra físicamente el archivo en S3/Supabase)
  DELETE FROM storage.objects 
  WHERE bucket_id = 'pedidos' 
  AND created_at < NOW() - INTERVAL '48 hours';
END;
$$;

-- 3. Programar el CRON Job para que se ejecute una vez al día a las 2 AM
SELECT cron.schedule(
  'limpieza-diaria-pedidos', -- Nombre del job
  '0 2 * * *',               -- Cron schedule: Todos los días a las 02:00 AM
  'SELECT delete_old_pedidos();'
);

-- ==============================================================================
-- 🚨 IMPORTANTE ANTES DE PROBAR LA APP:
-- Ve a Storage en tu panel de Supabase y crea un nuevo Bucket llamado "pedidos"
-- y asegúrate de marcarlo como PÚBLICO.
-- ==============================================================================
