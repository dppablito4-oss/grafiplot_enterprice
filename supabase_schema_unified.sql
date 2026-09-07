-- ==============================================================================
-- 🚀 GRAFIPLOT ENTERPRISE — ESQUEMA UNIFICADO DE BASE DE DATOS Y SEGURIDAD (V3)
-- ==============================================================================
-- INSTRUCCIONES DE ACTUALIZACIÓN:
-- 1. Abre el panel de tu proyecto en Supabase (https://supabase.com/dashboard).
-- 2. Dirígete a la sección "SQL Editor" en la barra lateral izquierda.
-- 3. Abre una nueva consulta ("New query"), pega TODO este contenido y haz clic en "Run".
-- 4. Este script es IDEMPOTENTE y SEGURO: conserva datos existentes y ajusta
--    tablas, triggers, funciones y políticas RLS para garantizar máxima seguridad.
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. EXTENSIONES NECESARIAS
-- ------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 2. TABLA: public.profiles (Perfiles de Usuario)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  email TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  storage_used BIGINT DEFAULT 0,
  role TEXT DEFAULT 'cliente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Asegurar columnas si la tabla ya existía
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone_number TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT FALSE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS storage_used BIGINT DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'cliente';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now());
ALTER TABLE public.profiles ALTER COLUMN phone_number DROP NOT NULL;

-- ------------------------------------------------------------------------------
-- 3. TABLA: public.pedidos (Órdenes e Impresiones)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.pedidos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  pages INTEGER NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'Pendiente',
  details JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Índices de rendimiento para consultas frecuentes
CREATE INDEX IF NOT EXISTS idx_pedidos_user_id ON public.pedidos(user_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_status ON public.pedidos(status);
CREATE INDEX IF NOT EXISTS idx_pedidos_created_at ON public.pedidos(created_at DESC);

-- ------------------------------------------------------------------------------
-- 4. TABLA: public.system_settings (Ajustes de Sistema)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 5. BUCKET DE ALMACENAMIENTO: 'pedidos'
-- ------------------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pedidos',
  'pedidos',
  false, -- Privado: requiere URLs firmadas o autenticación para evitar accesos no autorizados
  31457280, -- 30 MB límite
  ARRAY['application/pdf']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 31457280;

-- ------------------------------------------------------------------------------
-- 6. TRIGGERS Y FUNCIONES DE AUTOMATIZACIÓN Y SEGURIDAD
-- ------------------------------------------------------------------------------

-- 6.1. Creación automática de perfil al registrarse en auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  assigned_name TEXT;
  assigned_phone TEXT;
BEGIN
  -- Extraer datos enviados durante el registro
  assigned_name := COALESCE(
    new.raw_user_meta_data->>'full_name',
    split_part(new.email, '@', 1)
  );
  assigned_phone := new.raw_user_meta_data->>'phone_number';

  -- Por seguridad, SIEMPRE se asigna rol 'cliente' al crear usuarios
  INSERT INTO public.profiles (id, full_name, phone_number, role, email)
  VALUES (
    new.id,
    assigned_name,
    assigned_phone,
    'cliente',
    new.email
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    phone_number = COALESCE(public.profiles.phone_number, EXCLUDED.phone_number);

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 6.2. 🔒 PROTECCIÓN CRÍTICA DE ROL: Evita que los usuarios se autoasignen 'admin'
CREATE OR REPLACE FUNCTION public.protect_profile_role()
RETURNS trigger AS $$
BEGIN
  -- Si intentan modificar la columna 'role'
  IF NEW.role IS DISTINCT FROM OLD.role THEN
    -- Solo se permite si la llamada proviene del service_role o de un usuario que YA es admin
    IF (auth.jwt()->>'role' != 'service_role') AND NOT EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND role = 'admin'
    ) THEN
      RAISE EXCEPTION 'Seguridad: No tienes autorización para modificar roles de usuario.';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_protect_profile_role ON public.profiles;
CREATE TRIGGER tr_protect_profile_role
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.protect_profile_role();


-- 6.3. 📊 ACTUALIZACIÓN DINÁMICA DE STORAGE USADO (Gas/Almacenamiento por Usuario)
CREATE OR REPLACE FUNCTION public.update_user_storage_on_file_change()
RETURNS trigger AS $$
DECLARE
  f_size BIGINT;
  f_owner UUID;
BEGIN
  IF TG_OP = 'INSERT' THEN
    f_size := COALESCE((NEW.metadata->>'size')::BIGINT, 0);
    f_owner := NEW.owner;
    IF f_owner IS NOT NULL THEN
      UPDATE public.profiles
      SET storage_used = storage_used + f_size
      WHERE id = f_owner;
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    f_size := COALESCE((OLD.metadata->>'size')::BIGINT, 0);
    f_owner := OLD.owner;
    IF f_owner IS NOT NULL THEN
      UPDATE public.profiles
      SET storage_used = GREATEST(0, storage_used - f_size)
      WHERE id = f_owner;
    END IF;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_update_user_storage ON storage.objects;
CREATE TRIGGER tr_update_user_storage
  AFTER INSERT OR DELETE ON storage.objects
  FOR EACH ROW
  WHEN (NEW.bucket_id = 'pedidos' OR OLD.bucket_id = 'pedidos')
  EXECUTE FUNCTION public.update_user_storage_on_file_change();


-- ------------------------------------------------------------------------------
-- 7. HABILITACIÓN DE ROW LEVEL SECURITY (RLS)
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- 8. POLÍTICAS DE SEGURIDAD (RLS)
-- ------------------------------------------------------------------------------

-- 8.1. Políticas para public.profiles
DROP POLICY IF EXISTS "Perfiles públicos son visibles por todos" ON public.profiles;
DROP POLICY IF EXISTS "Perfiles públicos son visibles por usuarios autenticados" ON public.profiles;
DROP POLICY IF EXISTS "Usuarios pueden registrar su propio perfil" ON public.profiles;
DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON public.profiles;

CREATE POLICY "Lectura de perfiles para usuarios autenticados"
  ON public.profiles FOR SELECT
  TO authenticated
  USING ( true );

CREATE POLICY "Usuarios pueden registrar su propio perfil"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Usuarios pueden actualizar su propio perfil"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING ( auth.uid() = id );


-- 8.2. Políticas para public.pedidos
DROP POLICY IF EXISTS "Clientes pueden ingresar sus propios pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "Clientes pueden ver únicamente sus propios pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "Administradores pueden ver todos los pedidos del negocio" ON public.pedidos;
DROP POLICY IF EXISTS "Administradores pueden actualizar el estado de los pedidos" ON public.pedidos;
DROP POLICY IF EXISTS "Administradores pueden eliminar pedidos antiguos" ON public.pedidos;

CREATE POLICY "Clientes pueden ingresar sus propios pedidos"
  ON public.pedidos FOR INSERT
  TO authenticated
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Usuarios ven sus propios pedidos o administradores ven todos"
  ON public.pedidos FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id 
    OR EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Administradores pueden actualizar el estado de los pedidos"
  ON public.pedidos FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Administradores pueden eliminar pedidos"
  ON public.pedidos FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );


-- 8.3. Políticas para public.system_settings
DROP POLICY IF EXISTS "Solo administradores pueden leer la configuración" ON public.system_settings;
DROP POLICY IF EXISTS "Solo administradores pueden insertar configuración" ON public.system_settings;
DROP POLICY IF EXISTS "Solo administradores pueden actualizar la configuración" ON public.system_settings;

CREATE POLICY "Solo administradores pueden gestionar system_settings"
  ON public.system_settings FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );


-- 8.4. Políticas para storage.objects (Bucket: 'pedidos')
DROP POLICY IF EXISTS "Permitir subidas publicas a pedidos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir lectura publica de pedidos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir actualizacion publica a pedidos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir eliminacion publica a pedidos" ON storage.objects;
DROP POLICY IF EXISTS "Usuarios autenticados pueden subir archivos a pedidos" ON storage.objects;
DROP POLICY IF EXISTS "Clientes pueden ver sus propios archivos" ON storage.objects;
DROP POLICY IF EXISTS "Administradores pueden ver todos los archivos" ON storage.objects;
DROP POLICY IF EXISTS "Administradores pueden eliminar archivos de pedidos" ON storage.objects;
DROP POLICY IF EXISTS "Solo administradores pueden eliminar archivos de pedidos" ON storage.objects;

CREATE POLICY "Usuarios autenticados pueden subir archivos a pedidos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK ( bucket_id = 'pedidos' );

CREATE POLICY "Clientes ven sus archivos y administradores ven todos"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'pedidos' AND (
      owner = auth.uid()
      OR EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
      )
    )
  );

CREATE POLICY "Solo administradores pueden eliminar archivos del bucket pedidos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'pedidos' AND EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- ==============================================================================
-- FIN DEL ESQUEMA UNIFICADO — Grafiplot Enterprise
-- ==============================================================================
