-- ==============================================================================
-- 🛠️ SOLUCIÓN: POLÍTICAS DE SEGURIDAD PARA EL BUCKET "pedidos"
-- ==============================================================================
-- Copia todo este código y pégalo en el "SQL Editor" de Supabase y dale a "Run".
-- Esto le dará permiso a la web para subir archivos al bucket.

-- 1. Permitir que cualquier persona (o la web) pueda SUBIR (INSERT) archivos al bucket "pedidos"
CREATE POLICY "Permitir subidas publicas a pedidos" 
ON storage.objects FOR INSERT 
TO public
WITH CHECK ( bucket_id = 'pedidos' );

-- 2. Asegurar que cualquier persona pueda LEER (SELECT) los archivos del bucket "pedidos"
CREATE POLICY "Permitir lectura publica de pedidos" 
ON storage.objects FOR SELECT 
TO public 
USING ( bucket_id = 'pedidos' );

-- 3. (Opcional) Permitir actualizar archivos si se suben con el mismo nombre
CREATE POLICY "Permitir actualizacion publica a pedidos" 
ON storage.objects FOR UPDATE 
TO public
USING ( bucket_id = 'pedidos' );
