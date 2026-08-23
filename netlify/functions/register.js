import { neon } from '@neondatabase/serverless';

export default async (req, context) => {
  // Configuración de cabeceras CORS para permitir peticiones en desarrollo local
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Manejar petición preflight (CORS OPTIONS)
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  // Solo permitir peticiones POST
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Método no permitido. Utilice POST.' }),
      { status: 405, headers }
    );
  }

  // Obtener cadena de conexión a la base de datos de Neon (admite DATABASE_URL o DATABASEURL)
  const databaseUrl = process.env.DATABASE_URL || process.env.DATABASEURL;
  if (!databaseUrl) {
    console.error('❌ Error: La variable de entorno DATABASE_URL o DATABASEURL no está configurada.');
    return new Response(
      JSON.stringify({ error: 'La base de datos de Neon no está configurada en las variables de entorno.' }),
      { status: 500, headers }
    );
  }


  try {
    const body = await req.json();
    const { email, name, phone } = body;

    // Validaciones básicas de entrada
    if (!name || !name.trim()) {
      return new Response(
        JSON.stringify({ error: 'Por favor, ingresa tu nombre completo.' }),
        { status: 400, headers }
      );
    }

    if (!phone || !phone.trim()) {
      return new Response(
        JSON.stringify({ error: 'Por favor, ingresa tu número de teléfono.' }),
        { status: 400, headers }
      );
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim().toLowerCase())) {
      return new Response(
        JSON.stringify({ error: 'Por favor, ingresa un correo electrónico válido.' }),
        { status: 400, headers }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    const cleanPhone = phone.trim();

    // Obtener información de ubicación e IP (del cuerpo o de Netlify Context / Headers)
    const ip = body.ip || req.headers.get('x-nf-client-connection-ip') || req.headers.get('x-forwarded-for')?.split(',')[0].trim() || null;
    const city = body.city || context.geo?.city || null;
    const region = body.region || context.geo?.subdivision?.name || null;
    const country = body.country || context.geo?.country?.name || null;
    const userAgent = body.user_agent || req.headers.get('user-agent') || null;

    // Inicializar el cliente de Neon
    const sql = neon(databaseUrl);

    // Insertar el pre-registro en Neon
    await sql`
      INSERT INTO pre_registrations (email, name, phone, ip, city, region, country, user_agent)
      VALUES (${cleanEmail}, ${cleanName}, ${cleanPhone}, ${ip}, ${city}, ${region}, ${country}, ${userAgent})
    `;

    console.log(`🔌 Pre-registro exitoso en Neon: ${cleanEmail}`);

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers }
    );

  } catch (error) {
    console.error('❌ Error al registrar correo en Neon:', error);

    // Manejar el error de llave duplicada de Postgres (código de error 23505 para unique_violation)
    if (error.code === '23505') {
      return new Response(
        JSON.stringify({ error: 'Este correo electrónico ya está registrado.' }),
        { status: 409, headers }
      );
    }

    return new Response(
      JSON.stringify({ error: 'Ocurrió un error inesperado al procesar el pre-registro.' }),
      { status: 500, headers }
    );
  }
};
