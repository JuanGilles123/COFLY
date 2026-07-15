// Servicio de base de datos para la Landing Page de COFLY
import { createClient } from '@supabase/supabase-js';

// Intentar leer las variables de entorno de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Comprobar si las credenciales son válidas y no son los placeholders de .env.example
const isSupabaseConfigured = 
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'tu_supabase_project_url' && 
  supabaseAnonKey !== 'tu_supabase_anon_key';

let supabase = null;

if (isSupabaseConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('🔌 Conectado a Supabase correctamente.');
  } catch (error) {
    console.error('❌ Error al inicializar el cliente de Supabase:', error);
  }
} else {
  console.log('💾 Supabase no configurado o usando valores de ejemplo. Usando LocalStorage para guardar pre-registros.');
}

/**
 * Registra un correo en la base de datos (Supabase o LocalStorage)
 * @param {string} email 
 * @returns {Promise<{success: boolean, error?: string, local?: boolean}>}
 */
export async function registerEmail(email) {
  // Limpieza básica del email
  const cleanEmail = email.trim().toLowerCase();
  
  if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    return { success: false, error: 'Por favor, ingresa un correo electrónico válido.' };
  }

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('pre_registrations')
        .insert([{ email: cleanEmail }]);

      if (error) {
        // Manejar el caso de correo duplicado
        if (error.code === '23505') {
          return { success: false, error: 'Este correo electrónico ya está registrado.' };
        }
        return { success: false, error: error.message || 'Ocurrió un error al registrar el correo.' };
      }
      
      return { success: true, local: false };
    } catch (err) {
      console.error('Error en Supabase insert:', err);
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

      // Agregar nuevo pre-registro
      list.push({
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9),
        email: cleanEmail,
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
 * Verifica si Supabase está configurado actualmente
 * @returns {boolean}
 */
export function isUsingSupabase() {
  return isSupabaseConfigured;
}
