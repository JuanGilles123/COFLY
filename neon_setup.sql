-- Script de configuración de base de datos para la landing page de COFLY en Neon
-- Ejecuta este script en el SQL Editor de tu consola de Neon (https://console.neon.tech).

-- 1. Crear la tabla de pre-registros
CREATE TABLE IF NOT EXISTS pre_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,                         -- Nombre completo
    phone TEXT NOT NULL,                        -- Teléfono
    email TEXT UNIQUE NOT NULL,                 -- Correo electrónico (único)
    ip TEXT,                                    -- Dirección IP
    city TEXT,                                  -- Ciudad
    region TEXT,                                -- Región/Estado
    country TEXT,                               -- País
    user_agent TEXT,                            -- Dispositivo/Navegador
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 2. Crear índices para optimizar búsquedas comunes si es necesario
CREATE INDEX IF NOT EXISTS idx_pre_registrations_email ON pre_registrations(email);
