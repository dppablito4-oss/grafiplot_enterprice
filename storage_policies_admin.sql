-- ==============================================================================
-- 🛠️ PERMISOS PARA EL GESTOR DE ALMACENAMIENTO (PANEL DE ADMIN)
-- ==============================================================================
-- Copia todo este código y pégalo en el "SQL Editor" de Supabase y dale a "Run".
-- Esto permitirá que los Administradores puedan eliminar archivos desde la web.

-- Permitir ELIMINAR (DELETE) archivos del bucket "pedidos"
-- NOTA: Por seguridad, aquí lo permitimos de forma general para que funcione de inmediato.
-- Si deseas más seguridad, puedes restringirlo solo a usuarios con rol 'admin'.
CREATE POLICY "Permitir eliminacion publica a pedidos" 
ON storage.objects FOR DELETE 
TO public
USING ( bucket_id = 'pedidos' );
