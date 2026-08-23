// Servicio de base de datos para la Landing Page de COFLY utilizando Neon (vía Netlify Functions)

// Determinar si debemos conectar con la base de datos real o usar localStorage.
// En producción (Netlify) siempre usamos la base de datos.
// En desarrollo local usamos localStorage a menos que se fuerce la conexión con la DB.
const useDatabase = import.meta.env.PROD || import.meta.env.VITE_CONNECT_TO_DB === 'true';

if (useDatabase) {
  console.log('🔌 Base de datos (Neon a través de Netlify Functions) configurada para registros.');
} else {
  console.log('💾 Usando LocalStorage para guardar pre-registros (Modo de Desarrollo).');
}

/**
 * Obtiene la dirección IP y datos de ubicación geográfica del usuario de forma anónima
 * @returns {Promise<{ip: string|null, city: string|null, region: string|null, country: string|null, user_agent: string|null}>}
 */
async function getUserLocation() {
  try {
    const res = await fetch('https://freeipapi.com/api/json');
    if (!res.ok) throw new Error('Respuesta de red no válida');
    const data = await res.json();
    return {
      ip: data.ipAddress || null,
      city: data.cityName || null,
      region: data.regionName || null,
      country: data.countryName || null,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null
    };
  } catch (err) {
    console.warn('⚠️ No se pudo obtener la geolocalización del usuario:', err);
    return {
      ip: null,
      city: null,
      region: null,
      country: null,
      user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null
    };
  }
}

/**
 * Registra un correo en la base de datos (Supabase o LocalStorage)
 * @param {string} email 
 * @param {string} name
 * @param {string} phone
 * @returns {Promise<{success: boolean, error?: string, local?: boolean}>}
 */
export async function registerEmail(email, name = '', phone = '') {
  // Limpieza básica del email, nombre y teléfono
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim();
  const cleanPhone = phone.trim();
  
  if (!cleanName) {
    return { success: false, error: 'Por favor, ingresa tu nombre completo.' };
  }

  if (!cleanPhone) {
    return { success: false, error: 'Por favor, ingresa tu número de teléfono.' };
  }
  
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return { success: false, error: 'Por favor, ingresa un correo electrónico válido.' };
  }

  // Obtener geolocalización (no bloquea al usuario si hay un fallo de red o adblocker)
  const location = await getUserLocation();

  if (useDatabase) {
    try {
      const response = await fetch('/.netlify/functions/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: cleanEmail,
          name: cleanName,
          phone: cleanPhone,
          ip: location.ip,
          city: location.city,
          region: location.region,
          country: location.country,
          user_agent: location.user_agent
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { success: false, error: data.error || 'Ocurrió un error al registrar el correo.' };
      }

      return { success: true, local: false };
    } catch (err) {
      console.error('Error al conectar con la función de Netlify:', err);
      return { success: false, error: 'Error de red al conectar con el servidor.' };
    }
  } else {
    // Simular retraso de red de 600ms para que la UI se vea fluida y real
    await new Promise(resolve => setTimeout(resolve, 600));

    try {
      const storageKey = 'cofly_pre_registrations';
      const existing = localStorage.getItem(storageKey);
      const list = existing ? JSON.parse(existing) : [];

      // Verificar si ya existe
      const alreadyExists = list.some(item => item.email === cleanEmail);
      if (alreadyExists) {
        return { success: false, error: 'Este correo electrónico ya está registrado en local.' };
      }

      // Agregar nuevo pre-registro con ubicación y nombre
      list.push({
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
        name: cleanName || null,
        email: cleanEmail,
        phone: cleanPhone || null,
        ip: location.ip,
        city: location.city,
        region: location.region,
        country: location.country,
        user_agent: location.user_agent,
        created_at: new Date().toISOString()
      });

      localStorage.setItem(storageKey, JSON.stringify(list));
      
      // Lanzar un evento personalizado para actualizar los componentes locales en desarrollo
      window.dispatchEvent(new Event('local_registrations_updated'));

      return { success: true, local: true };
    } catch (err) {
      console.error('Error en LocalStorage insert:', err);
      return { success: false, error: 'No se pudo guardar el correo en el navegador.' };
    }
  }
}

/**
 * Obtiene la lista de registros locales (útil para desarrollo)
 * @returns {Array<{id: string, email: string, created_at: string}>}
 */
export function getLocalRegistrations() {
  try {
    const storageKey = 'cofly_pre_registrations';
    const existing = localStorage.getItem(storageKey);
    return existing ? JSON.parse(existing) : [];
  } catch (err) {
    console.error('Error leyendo registros locales:', err);
    return [];
  }
}

/**
 * Borra todos los registros locales
 */
export function clearLocalRegistrations() {
  localStorage.removeItem('cofly_pre_registrations');
  window.dispatchEvent(new Event('local_registrations_updated'));
}

/**
 * Exporta y descarga los correos locales en formato CSV
 */
export function exportLocalRegistrationsAsCSV() {
  const list = getLocalRegistrations();
  if (list.length === 0) {
    alert('No hay correos registrados localmente para exportar.');
    return;
  }

  let csvContent = 'data:text/csv;charset=utf-8,ID,Email,Fecha_Registro\n';
  list.forEach(item => {
    csvContent += `"${item.id}","${item.email}","${item.created_at}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `pre-registros-cofly-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Verifica si se está utilizando la base de datos activa actualmente
 * @returns {boolean}
 */
export function isUsingDatabase() {
  return useDatabase;
}
