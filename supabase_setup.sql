-- Script de configuración de base de datos para la landing page de COFLY
-- Ejecuta este script en el editor SQL de tu panel de Supabase.

-- Eliminar disparadores y funciones anteriores para evitar conflictos al re-ejecutar
DROP TRIGGER IF EXISTS trigger_set_pre_registration_defaults ON public.pre_registrations;
DROP FUNCTION IF EXISTS public.set_pre_registration_defaults();
DROP TABLE IF EXISTS public.pre_registrations;

-- 1. Crear la tabla de pre-registros con soporte para nombre, teléfono y dispositivo (user_agent)
CREATE TABLE public.pre_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL, -- Nombre obligatorio
    phone TEXT, -- Teléfono
    email TEXT UNIQUE NOT NULL,
    ip TEXT,
    city TEXT,
    region TEXT,
    country TEXT,
    user_agent TEXT, -- Información del dispositivo
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Función trigger para autocompletar IP, País y User-Agent si vienen nulos
CREATE OR REPLACE FUNCTION public.set_pre_registration_defaults()
RETURNS TRIGGER AS $$
DECLARE
    headers json;
BEGIN
    -- Intentar obtener las cabeceras de la petición HTTP desde la sesión de PostgREST
    BEGIN
        headers := current_setting('request.headers', true)::json;
    EXCEPTION WHEN OTHERS THEN
        headers := NULL;
    END;

    IF headers IS NOT NULL THEN
        -- Si la IP no fue enviada, extraerla de cf-connecting-ip o x-forwarded-for
        IF NEW.ip IS NULL THEN
            NEW.ip := coalesce(
                headers->>'cf-connecting-ip',
                split_part(headers->>'x-forwarded-for', ',', 1)
            );
        END IF;

        -- Si el país no fue enviado, extraerlo de cf-ipcountry (Cloudflare GeoIP)
        IF NEW.country IS NULL THEN
            NEW.country := headers->>'cf-ipcountry';
        END IF;

        -- Si el user_agent no fue enviado, extraerlo de user-agent (Dispositivo/Navegador)
        IF NEW.user_agent IS NULL THEN
            NEW.user_agent := headers->>'user-agent';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Crear el Trigger BEFORE INSERT
CREATE TRIGGER trigger_set_pre_registration_defaults
BEFORE INSERT ON public.pre_registrations
FOR EACH ROW
EXECUTE FUNCTION public.set_pre_registration_defaults();

-- 4. Habilitar la seguridad a nivel de fila (Row Level Security - RLS)
ALTER TABLE public.pre_registrations ENABLE ROW LEVEL SECURITY;

-- 5. Crear política para permitir que CUALQUIER usuario (anónimo/público) inserte su registro
CREATE POLICY "Permitir inserciones públicas de pre-registro" 
ON public.pre_registrations 
FOR INSERT 
TO public 
WITH CHECK (true);

-- 6. Crear política para asegurar que NADIE pueda ver la lista de registros desde la web
CREATE POLICY "Restringir lecturas públicas" 
ON public.pre_registrations 
FOR SELECT 
TO public 
USING (false);

-- Comentarios explicativos:
-- - La columna name almacena el nombre ingresado por el usuario.
-- - La columna user_agent contiene la información detallada del dispositivo/sistema operativo.
-- - Las políticas de seguridad bloquean la lectura de correos a usuarios no autenticados en el frontend.
