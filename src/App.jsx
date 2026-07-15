import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Settings, 
  Download, 
  Trash2, 
  Compass, 
  Sparkles, 
  Clock, 
  Smartphone, 
  ShieldCheck,
  ChevronRight,
  Send
} from 'lucide-react';
import { 
  registerEmail, 
  getLocalRegistrations, 
  clearLocalRegistrations, 
  exportLocalRegistrationsAsCSV, 
  isUsingSupabase 
} from './lib/database';

function App() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');
  const [devTrayOpen, setDevTrayOpen] = useState(false);
  const [localRegistrations, setLocalRegistrations] = useState([]);
  
  const supabaseActive = isUsingSupabase();

  // Actualizar la lista de pre-registros locales
  const refreshRegistrations = () => {
    setLocalRegistrations(getLocalRegistrations());
  };

  useEffect(() => {
    refreshRegistrations();
    
    // Escuchar el evento de actualización de registros locales
    window.addEventListener('local_registrations_updated', refreshRegistrations);
    return () => {
      window.removeEventListener('local_registrations_updated', refreshRegistrations);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setStatus('error');
      setMessage('Por favor, ingresa tu correo electrónico.');
      return;
    }

    // Validación básica de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage('El formato del correo no es válido.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await registerEmail(email);
      
      if (response.success) {
        setStatus('success');
        setMessage(
          response.local 
            ? '¡Pre-registro guardado localmente con éxito! Estás en la lista.'
            : '¡Te has registrado con éxito! Te mantendremos informado.'
        );
        setEmail('');
      } else {
        setStatus('error');
        setMessage(response.error || 'Ocurrió un error inesperado.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Error de red. Inténtalo de nuevo más tarde.');
    }
  };

  const handleClearLocal = () => {
    if (window.confirm('¿Estás seguro de que quieres borrar todos los correos registrados localmente?')) {
      clearLocalRegistrations();
    }
  };

  return (
    <div className="app-container">
      {/* Luces y difuminados de fondo */}
      <div className="glow-blur-1"></div>
      <div className="glow-blur-2"></div>

      <div className="content-wrapper">
        {/* Encabezado */}
        <header className="header">
          <div className="logo">
            <Compass className="logo-icon" />
            COFLY
          </div>
          <span className="badge-beta">Beta Cerrada</span>
        </header>

        {/* Sección Héroe */}
        <section className="hero">
          <div className="hero-tag">
            <Sparkles size={16} className="hero-tag-accent" />
            <span>Únete al futuro del viaje colaborativo</span>
          </div>
          
          <h1 className="hero-title">
            La forma más inteligente de organizar tus <span>viajes compartidos</span>
          </h1>
          
          <p className="hero-subtitle">
            Conéctate con otros aventureros, optimiza tus rutas aéreas y terrestres, comparte costos y haz que viajar sea más fácil, accesible y sostenible.
          </p>

          <div className="form-container">
            <form onSubmit={handleSubmit} className="register-form">
              <input
                type="email"
                placeholder="Ingresa tu correo electrónico..."
                className="input-email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === 'error') setStatus('idle');
                }}
                disabled={status === 'loading'}
              />
              <button 
                type="submit" 
                className="btn-submit"
                disabled={status === 'loading'}
              >
                {status === 'loading' ? (
                  <span className="spinner"></span>
                ) : (
                  <>
                    <span>Pre-registrarse</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Mensajes de Estado */}
            {status === 'success' && (
              <div className="form-message success">
                <CheckCircle2 size={16} />
                <span>{message}</span>
              </div>
            )}
            {status === 'error' && (
              <div className="form-message error">
                <AlertCircle size={16} />
                <span>{message}</span>
              </div>
            )}
          </div>
        </section>

        {/* Sección de Características (Pilares de la App) */}
        <section className="features-section">
          <h2 className="section-title">¿Qué hace a COFLY único?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Compass size={24} />
              </div>
              <h3>Compartir Rutas & Vuelos</h3>
              <p>
                Publica tus planes de viaje o busca grupos que tengan tu mismo destino. Dividan costos y compartan vuelos chárter, autos o traslados locales sin fricciones.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <ShieldCheck size={24} />
              </div>
              <h3>Comunidad Verificada</h3>
              <p>
                Viaja seguro. COFLY cuenta con un sistema de verificación de identidad robusto y un sistema de calificaciones cruzadas para garantizar la tranquilidad de todos los miembros.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Clock size={24} />
              </div>
              <h3>División Inteligente de Gastos</h3>
              <p>
                Olvídate de las matemáticas complejas. Nuestra billetera integrada calcula automáticamente los porcentajes, divide las tarifas en tiempo real y gestiona cobros instantáneos.
              </p>
            </div>
          </div>
        </section>

        {/* Sección de Beneficios de la Beta */}
        <section className="benefits-section">
          <div className="benefits-content">
            <div className="benefits-text">
              <h2>Únete hoy como Miembro Fundador</h2>
              <p>
                Estamos construyendo COFLY junto a nuestra comunidad inicial. Al pre-registrarte hoy, accedes a beneficios que no estarán disponibles tras el lanzamiento oficial.
              </p>
              
              <div className="benefits-list">
                <div className="benefit-item">
                  <CheckCircle2 size={20} className="benefit-item-icon" />
                  <div>
                    <h4>Acceso Prioritario a la Beta</h4>
                    <p>Serás el primero en descargar la versión de pruebas en tu iPhone en cuanto esté lista en TestFlight.</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <CheckCircle2 size={20} className="benefit-item-icon" />
                  <div>
                    <h4>Sello de Fundador</h4>
                    <p>Una insignia única en tu perfil público de COFLY visible para siempre para la comunidad.</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <CheckCircle2 size={20} className="benefit-item-icon" />
                  <div>
                    <h4>6 Meses de Premium Gratis</h4>
                    <p>Disfruta de la versión sin comisiones por transferencias y soporte prioritario desde el día uno.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="benefits-visual">
              <div className="visual-mockup">
                <div className="visual-pattern"></div>
                <h3 className="visual-text-1">iOS App coming soon</h3>
                <p className="visual-text-2">Prepárate para volar alto en el 2026</p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div>&copy; 2026 COFLY. Todos los derechos reservados.</div>
          <div className="footer-links">
            <a href="#terminos">Términos de Servicio</a>
            <a href="#privacidad">Privacidad</a>
          </div>
        </footer>
      </div>

      {/* Consola del Desarrollador (Solo para desarrollo) */}
      <div className="dev-tray-container">
        <button 
          onClick={() => setDevTrayOpen(!devTrayOpen)} 
          className="dev-tray-trigger"
        >
          <Settings size={14} />
          <span>Panel de Desarrollo</span>
          <span className="dev-tray-badge">{localRegistrations.length}</span>
        </button>

        {devTrayOpen && (
          <div className="dev-tray-panel">
            <div className="dev-tray-header">
              <h4>Consola de Pre-registros</h4>
              <button 
                onClick={() => setDevTrayOpen(false)}
                className="dev-tray-close"
              >
                &times;
              </button>
            </div>
            
            <p style={{ fontSize: '0.75rem', color: supabaseActive ? 'var(--success)' : '#f59e0b' }}>
              {supabaseActive 
                ? '🔌 Base de datos activa: Supabase Cloud' 
                : '💾 Base de datos activa: LocalStorage (Simulador)'}
            </p>

            <div className="dev-tray-content">
              {localRegistrations.length === 0 ? (
                <p className="dev-tray-list-empty">
                  No hay correos guardados localmente aún. ¡Regístrate arriba para probar!
                </p>
              ) : (
                localRegistrations.map((item) => (
                  <div key={item.id} className="dev-tray-email-item">
                    <span className="dev-tray-email" title={item.email}>
                      {item.email}
                    </span>
                    <span className="dev-tray-date">
                      {new Date(item.created_at).toLocaleTimeString()}
                    </span>
                  </div>
                ))
              )}
            </div>

            <div className="dev-tray-actions">
              <button 
                onClick={exportLocalRegistrationsAsCSV}
                className="dev-tray-btn primary"
                disabled={localRegistrations.length === 0}
              >
                <Download size={12} style={{ marginRight: 4 }} />
                Exportar CSV
              </button>
              <button 
                onClick={handleClearLocal}
                className="dev-tray-btn secondary"
                disabled={localRegistrations.length === 0}
              >
                <Trash2 size={12} style={{ marginRight: 4 }} />
                Limpiar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
