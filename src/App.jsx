import React, { useState } from 'react';
import { 
  AlertCircle, 
  ArrowRight, 
  MapPin,
  Handshake,
  Target,
  Truck,
  KeyRound,
  Coins,
  ShieldCheck
} from 'lucide-react';
import { registerEmail } from './lib/database';

function App() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setStatus('error');
      setMessage('Por favor, ingresa tu nombre completo.');
      return;
    }
    
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
      const response = await registerEmail(email, name);
      
      if (response.success) {
        setStatus('success');
        setMessage('¡Te has registrado con éxito! Te mantendremos informado.');
        setEmail('');
        setName('');
      } else {
        setStatus('error');
        setMessage(response.error || 'Ocurrió un error inesperado.');
      }
    } catch {
      setStatus('error');
      setMessage('Error de red. Inténtalo de nuevo más tarde.');
    }
  };

  return (
    <div className="app-container">
      <div className="content-wrapper">
        {/* Encabezado */}
        <header className="header">
          <div className="logo-container">
            <img src="/Logo Cofly.png" alt="COFLY Logo" className="logo-img" />
          </div>
          <span className="badge-beta">Beta Cerrada</span>
        </header>

        {/* Sección Héroe */}
        <section className="hero">
          <div className="hero-tag">
            <MapPin size={16} className="hero-tag-accent" />
            <span>Únete al delivery local de comida y visibilidad comercial</span>
          </div>
          
          <h1 className="hero-title">
            La plataforma que conecta tu <span>negocio local</span> con clientes
          </h1>
          
          <p className="hero-subtitle">
            Encuentra y contacta directamente con los comercios y servicios de tu barrio. Si tienes un negocio, patrocínate para aparecer de primero y atraer a más clientes, gestionando tus propios envíos sin intermediarios.
          </p>

          <div className="form-container">
            <form onSubmit={handleSubmit} className="register-form">
              <div className="input-group">
                <label htmlFor="name-input" className="input-label">Nombre Completo</label>
                <input
                  id="name-input"
                  type="text"
                  placeholder="Tu nombre completo..."
                  className="input-field"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  disabled={status === 'loading'}
                />
              </div>
              <div className="input-group">
                <label htmlFor="email-input" className="input-label">Correo Electrónico</label>
                <input
                  id="email-input"
                  type="email"
                  placeholder="Ingresa tu correo electrónico..."
                  className="input-field"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  disabled={status === 'loading'}
                />
              </div>
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
                <ShieldCheck size={16} />
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
                <Handshake size={24} />
              </div>
              <h3>Conexión Local Directa</h3>
              <p>
                Encuentra comercios y servicios cercanos y contacta con ellos directamente. Sin comisiones abusivas por pedido ni intermediación en tu compra; tú decides cómo comprar.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Target size={24} />
              </div>
              <h3>Publicidad & Posicionamiento</h3>
              <p>
                ¿Quieres destacar? Publicita tu negocio dentro de COFLY para aparecer de primero en las búsquedas y categorías locales. Atrae miradas y consigue contactos de inmediato.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon-wrapper">
                <Truck size={24} />
              </div>
              <h3>Logística a tu Manera</h3>
              <p>
                El trato es directo. Cada restaurante, tienda o prestador de servicio gestiona sus propios repartidores y entregas, eliminando los costos de envío inflados de las grandes apps.
              </p>
            </div>
          </div>
        </section>

        {/* Sección de Beneficios de la Beta */}
        <section className="benefits-section">
          <div className="benefits-content">
            <div className="benefits-text">
              <h2>Únete hoy como Socio o Usuario Fundador</h2>
              <p>
                Estamos construyendo COFLY junto a nuestra comunidad y negocios locales. Regístrate en la lista de espera para asegurar beneficios únicos durante el lanzamiento.
              </p>
              
              <div className="benefits-list">
                <div className="benefit-item">
                  <KeyRound size={20} className="benefit-item-icon" />
                  <div>
                    <h4>Acceso Prioritario y Exclusivo</h4>
                    <p>Conecta de forma prioritaria con los clientes y comercios de tu zona antes del lanzamiento general.</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <Coins size={20} className="benefit-item-icon" />
                  <div>
                    <h4>Bono de Publicidad de Regalo</h4>
                    <p>Registra tu negocio en la lista de espera hoy y recibe un saldo de publicidad gratuito para aparecer de primero en tu zona.</p>
                  </div>
                </div>

                <div className="benefit-item">
                  <ShieldCheck size={20} className="benefit-item-icon" />
                  <div>
                    <h4>Soporte y Trato Directo 100%</h4>
                    <p>Asegura el uso de la plataforma sin tarifas de intermediación. Lo que vendes es completamente tuyo.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="benefits-visual">
              <div className="visual-mockup">
                <div className="visual-pattern"></div>
                <h3 className="visual-text-1">COFLY LOCAL</h3>
                <p className="visual-text-2">Tus negocios y servicios locales en 2026</p>
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
    </div>
  );
}

export default App;
