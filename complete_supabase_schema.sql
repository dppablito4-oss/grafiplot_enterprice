-- ==============================================================================
-- 🗃️ ESQUEMA COMPLETO Y MIGRACIÓN LIMPIA DE BASE DE DATOS
-- ==============================================================================
-- ⚠️ INSTRUCCIONES:
-- 1. Ve al panel de tu proyecto en Supabase -> "SQL Editor".
-- 2. Abre una pestaña limpia de consulta (Untitled query).
-- 3. Pega todo este código y dale a "Run" (Ejecutar).
-- 4. Esto REINICIARÁ todas las tablas de pedidos y perfiles para resolver cualquier
--    inconsistencia y aplicar las mejores políticas de Row Level Security (RLS).
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. LIMPIEZA DE ESTRUCTURAS ANTERIORES (DROP CASCADE)
-- ------------------------------------------------------------------------------
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP TABLE IF EXISTS public.pedidos CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.system_settings CASCADE;

-- ------------------------------------------------------------------------------
-- 2. CREACIÓN DE LA TABLA DE PERFILES (PROFILES)
-- ------------------------------------------------------------------------------
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone_number TEXT,  -- Opcional (permite NULL para compatibilidad con correo)
  email TEXT,         -- Opcional (permite NULL)
  is_verified BOOLEAN DEFAULT FALSE,
  storage_used BIGINT DEFAULT 0,
  role TEXT DEFAULT 'cliente'
);

-- Habilitar Seguridad a Nivel de Fila (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de Seguridad para Perfiles
CREATE POLICY "Perfiles públicos son visibles por todos"
  ON public.profiles FOR SELECT
  USING ( true );

CREATE POLICY "Usuarios pueden registrar su propio perfil"
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Usuarios pueden actualizar su propio perfil"
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- ------------------------------------------------------------------------------
-- 3. TRIGGER AUTOMÁTICO PARA REGISTRO DE NUEVOS USUARIOS
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  assigned_role TEXT;
  assigned_phone TEXT;
BEGIN
  -- Por defecto todos son clientes. El admin debe asignarse manualmente en la tabla profiles
  assigned_role := COALESCE(new.raw_user_meta_data->>'role', 'cliente');
  assigned_phone := new.raw_user_meta_data->>'phone_number';

  INSERT INTO public.profiles (id, full_name, phone_number, role, email)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    assigned_phone,
    assigned_role,
    new.email
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 4. CREACIÓN DE LA TABLA DE PEDIDOS (PEDIDOS)
-- ------------------------------------------------------------------------------
CREATE TABLE public.pedidos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  pages INTEGER NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'Pendiente',
  details JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Habilitar Seguridad a Nivel de Fila (RLS)
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;

-- Políticas de Seguridad para Pedidos
CREATE POLICY "Clientes pueden ingresar sus propios pedidos"
  ON public.pedidos FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Clientes pueden ver únicamente sus propios pedidos"
  ON public.pedidos FOR SELECT
  USING ( auth.uid() = user_id );

CREATE POLICY "Administradores pueden ver todos los pedidos del negocio"
  ON public.pedidos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Administradores pueden actualizar el estado de los pedidos"
  ON public.pedidos FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Administradores pueden eliminar pedidos antiguos"
  ON public.pedidos FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ------------------------------------------------------------------------------
-- 5. CREACIÓN DE LA TABLA DE AJUSTES DEL SISTEMA (SYSTEM_SETTINGS)
-- ------------------------------------------------------------------------------
CREATE TABLE public.system_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Habilitar Seguridad a Nivel de Fila (RLS)
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

-- Políticas de Seguridad para Ajustes (Exclusivas para Administradores)
CREATE POLICY "Solo administradores pueden leer la configuración"
  ON public.system_settings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Solo administradores pueden insertar configuración"
  ON public.system_settings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Solo administradores pueden actualizar la configuración"
  ON public.system_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ------------------------------------------------------------------------------
-- 6. FUNCIÓN DE LIMPIEZA AUTOMÁTICA DE ARCHIVOS (OPCIONAL - REQUIERE PG_CRON)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION delete_old_pedidos()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Borra los registros de los archivos subidos al storage que tengan más de 48 horas
  DELETE FROM storage.objects 
  WHERE bucket_id = 'pedidos' 
  AND created_at < NOW() - INTERVAL '48 hours';
END;
$$;
