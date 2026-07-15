-- Script de configuración de base de datos para la landing page de COFLY
-- Ejecuta este script en el editor SQL de tu panel de Supabase.

-- 1. Crear la tabla de pre-registros
CREATE TABLE IF NOT EXISTS public.pre_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar la seguridad a nivel de fila (Row Level Security - RLS)
ALTER TABLE public.pre_registrations ENABLE ROW LEVEL SECURITY;

-- 3. Crear política para permitir que CUALQUIER usuario (anónimo/público) inserte su correo
CREATE POLICY "Permitir inserciones públicas de pre-registro" 
ON public.pre_registrations 
FOR INSERT 
TO public 
WITH CHECK (true);

-- 4. Crear política para asegurar que NADIE pueda ver la lista de correos desde la web
-- (Por defecto, al activar RLS y no definir políticas SELECT para "public", nadie excepto los administradores
-- o el "service_role" podrá leer los correos. Esta política explícita deniega las lecturas públicas).
CREATE POLICY "Restringir lecturas públicas" 
ON public.pre_registrations 
FOR SELECT 
TO public 
USING (false);

-- Comentarios explicativos:
-- - La tabla almacenará el identificador único (UUID), el correo registrado (único para evitar duplicados) y la fecha de creación.
-- - Las políticas garantizan que un atacante no pueda descargar la lista de correos de la base de datos a través de la API pública/cliente de Supabase.
