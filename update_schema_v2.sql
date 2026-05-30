-- ==============================================================================
-- 🔄 ACTUALIZACIÓN DE ESQUEMA V2: Email OTP, Seguridad y RLS
-- ==============================================================================
-- ⚠️ INSTRUCCIONES:
-- 1. Ve al panel de Supabase de tu proyecto.
-- 2. Entra a "SQL Editor".
-- 3. Crea una nueva query, pega todo este código y dale a "Run".

-- 1. Actualizar tabla profiles para que el teléfono sea opcional
ALTER TABLE public.profiles 
  ALTER COLUMN phone_number DROP NOT NULL;

-- 2. Eliminar la restricción UNIQUE del teléfono si existe (opcional pero recomendado si habrá nulos)
ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_phone_number_key;

-- 3. Actualizar la función de nuevo usuario (Trigger)
-- Ahora todo el mundo es cliente por defecto, el teléfono es opcional.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  assigned_role TEXT;
  assigned_phone TEXT;
BEGIN
  -- Por defecto todos son clientes. El admin debe asignarse manualmente en la tabla profiles
  -- o mediante otra validación de correo si se desea en el futuro.
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

-- 4. NUEVAS POLÍTICAS DE STORAGE (BUCKET "pedidos")
-- Eliminar las políticas públicas (si existen, deberás borrarlas manualmente desde la UI o con estos comandos)
DROP POLICY IF EXISTS "Permitir subidas publicas a pedidos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir lectura publica de pedidos" ON storage.objects;
DROP POLICY IF EXISTS "Permitir actualizacion publica a pedidos" ON storage.objects;

-- Asegurar RLS en storage
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 4.1. Permitir que cualquier usuario AUNTENTICADO suba archivos
CREATE POLICY "Usuarios autenticados pueden subir archivos a pedidos" 
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK ( bucket_id = 'pedidos' );

-- 4.2. Un cliente solo puede ver los archivos que él mismo subió (owner)
CREATE POLICY "Clientes pueden ver sus propios archivos"
ON storage.objects FOR SELECT
TO authenticated
USING ( bucket_id = 'pedidos' AND owner = auth.uid() );

-- 4.3. Los administradores pueden ver todos los archivos del bucket pedidos
CREATE POLICY "Administradores pueden ver todos los archivos"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'pedidos' AND 
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);
