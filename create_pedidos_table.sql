-- ==============================================================================
-- 🗃️ TABLA PARA HISTORIAL DE PEDIDOS
-- ==============================================================================
-- Copia todo este código y pégalo en el "SQL Editor" de Supabase y dale a "Run".

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

-- Activar RLS (Row Level Security)
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;

-- 1. Los clientes solo pueden insertar pedidos si están logueados
CREATE POLICY "Users can insert their own pedidos"
  ON pedidos FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

-- 2. Los clientes solo pueden ver sus propios pedidos
CREATE POLICY "Users can view their own pedidos"
  ON pedidos FOR SELECT
  USING ( auth.uid() = user_id );

-- 3. Los administradores pueden ver todos los pedidos
CREATE POLICY "Admins can view all pedidos"
  ON pedidos FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );

-- 4. Los administradores pueden actualizar el estado de cualquier pedido
CREATE POLICY "Admins can update all pedidos"
  ON pedidos FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
