import React, { useState, useRef, useEffect } from 'react';
import { 
  AlertCircle, 
  ArrowRight, 
  MapPin,
  Handshake,
  Target,
  Truck,
  KeyRound,
  Coins,
  ShieldCheck,
  Store,
  ShoppingBag,
  Compass,
  Bike,
  MessageSquare,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  Home,
  Utensils,
  Apple,
  Pill,
  Shirt,
  User
} from 'lucide-react';
import { registerEmail } from './lib/database';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';

// Componente de Contador Animado
function AnimatedCounter({ value, suffix = "", duration = 2 }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasRun) {
          setHasRun(true);
          let start = 0;
          const end = parseInt(value, 10);
          if (isNaN(end)) {
            setCount(value);
            return;
          }
          const totalSteps = 50;
          const stepTime = (duration * 1000) / totalSteps;
          let step = 0;
          
          const timer = setInterval(() => {
            step++;
            const progress = step / totalSteps;
            // Ease out quad
            const currentVal = Math.round(end * (progress * (2 - progress)));
            setCount(currentVal);
            
            if (step >= totalSteps) {
              clearInterval(timer);
              setCount(end);
            }
          }, stepTime);
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) observer.unobserve(elementRef.current);
    };
  }, [value, duration, hasRun]);

  return <span ref={elementRef}>{count}{suffix}</span>;
}

function App() {
  // Formulario superior
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');

  // Formulario inferior
  const [email2, setEmail2] = useState('');
  const [name2, setName2] = useState('');
  const [phone2, setPhone2] = useState('');
  const [status2, setStatus2] = useState('idle'); // idle | loading | success | error
  const [message2, setMessage2] = useState('');

  // Estado para las FAQ
  const [openFaq, setOpenFaq] = useState(null);

  // Estado del Mapa Interactivo
  const [mapCategory, setMapCategory] = useState('pizza'); // pizza | groceries | pharmacy | shopping
  const [isDelivering, setIsDelivering] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const handleMapCategoryChange = (category) => {
    setMapCategory(category);
    setAnimationKey(prev => prev + 1);
  };

  // Scroll animations targetting the Hero section
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Animaciones 3D e inclinaciones suaves para el celular en scroll
  const rotateX = useTransform(scrollYProgress, [0, 0.8], [24, 0]);
  const rotateY = useTransform(scrollYProgress, [0, 0.8], [-28, 0]);
  const rotateZ = useTransform(scrollYProgress, [0, 0.8], [-5, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.8], [0.92, 1.06]);
  const phoneY = useTransform(scrollYProgress, [0, 0.8], [0, 60]);
  
  // Aparición progresiva del logo en la pantalla
  const logoScale = useTransform(scrollYProgress, [0.15, 0.6], [0.4, 1]);
  const logoOpacity = useTransform(scrollYProgress, [0.15, 0.55], [0.1, 1]);

  // Parallax para los badges flotantes a los lados del cel en el Hero
  const floatY1 = useTransform(scrollYProgress, [0, 1], [-40, 50]);
  const floatY2 = useTransform(scrollYProgress, [0, 1], [30, -70]);
  const floatY3 = useTransform(scrollYProgress, [0, 1], [-20, 90]);

  // Controladores para el efecto 3D Mouse Tilt en las tarjetas
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    card.style.setProperty('--mx', x);
    card.style.setProperty('--my', y);
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.setProperty('--mx', 0.5);
    card.style.setProperty('--my', 0.5);
  };

  // Simulación de entrega del mapa interactivo al cambiar de categoría
  useEffect(() => {
    setIsDelivering(true);
    const timer = setTimeout(() => {
      setIsDelivering(false);
    }, 2400); // Duración de la animación de reparto
    return () => clearTimeout(timer);
  }, [mapCategory, animationKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setStatus('error');
      setMessage('Por favor, ingresa tu nombre completo.');
      return;
    }

    if (!phone.trim()) {
      setStatus('error');
      setMessage('Por favor, ingresa tu número de teléfono.');
      return;
    }
    
    if (!email) {
      setStatus('error');
      setMessage('Por favor, ingresa tu correo electrónico.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setStatus('error');
      setMessage('El formato del correo no es válido.');
      return;
    }

    setStatus('loading');
    setMessage('');

    try {
      const response = await registerEmail(email, name, phone);
      
      if (response.success) {
        setStatus('success');
        setMessage('¡Te has registrado con éxito! Te mantendremos informado.');
        setEmail('');
        setName('');
        setPhone('');
      } else {
        setStatus('error');
        setMessage(response.error || 'Ocurrió un error inesperado.');
      }
    } catch {
      setStatus('error');
      setMessage('Error de red. Inténtalo de nuevo más tarde.');
    }
  };

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    
    if (!name2.trim()) {
      setStatus2('error');
      setMessage2('Por favor, ingresa tu nombre completo.');
      return;
    }

    if (!phone2.trim()) {
      setStatus2('error');
      setMessage2('Por favor, ingresa tu número de teléfono.');
      return;
    }
    
    if (!email2) {
      setStatus2('error');
      setMessage2('Por favor, ingresa tu correo electrónico.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email2)) {
      setStatus2('error');
      setMessage2('El formato del correo no es válido.');
      return;
    }

    setStatus2('loading');
    setMessage2('');

    try {
      const response = await registerEmail(email2, name2, phone2);
      
      if (response.success) {
        setStatus2('success');
        setMessage2('¡Te has registrado con éxito! Te mantendremos informado.');
        setEmail2('');
        setName2('');
        setPhone2('');
      } else {
        setStatus2('error');
        setMessage2(response.error || 'Ocurrió un error inesperado.');
      }
    } catch {
      setStatus2('error');
      setMessage2('Error de red. Inténtalo de nuevo más tarde.');
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Datos para el mapa interactivo según categoría
  const mapData = {
    pizza: {
      shopName: "Pizzería Luigi",
      productName: "Pizza Familiar",
      icon: <Utensils size={20} />,
      color: "#EF5F18",
      delay: "8-12 min"
    },
    groceries: {
      shopName: "Frutería Don Julio",
      productName: "Frutas y Verduras",
      icon: <Apple size={20} />,
      color: "#10B981",
      delay: "10-15 min"
    },
    pharmacy: {
      shopName: "Droguería El Alivio",
      productName: "Medicamentos",
      icon: <Pill size={20} />,
      color: "#3B82F6",
      delay: "5-10 min"
    },
    shopping: {
      shopName: "Boutique Aurora",
      productName: "Ropa & Moda local",
      icon: <Shirt size={20} />,
      color: "#8B5CF6",
      delay: "12-18 min"
    }
  };

  return (
    <div className="app-container">
      {/* Fondos dinámicos en capas */}
      <div className="grid-bg"></div>
      <div className="glow-bg"></div>

      <div className="content-wrapper">
        {/* Encabezado */}
        <header className="header">
          <div className="logo-container">
            <img src="/Logo Cofly.png" alt="COFLY Logo" className="logo-img" />
          </div>
          <span className="badge-beta">Beta Cerrada</span>
        </header>

        {/* Sección Héroe con estructura de Doble Columna */}
        <section className="hero" ref={containerRef}>
          <div className="hero-grid">
            <div className="hero-text-content">
              <h1 className="hero-title">
                La plataforma que conecta tu <span>negocio local</span> con clientes
              </h1>
              
              <p className="hero-subtitle">
                Encuentra y contacta directamente con los comercios y servicios de tu barrio. Si tienes un negocio, patrocínate para aparecer de primero y atraer a más clientes, contando con la red de domiciliarios que COFLY provee para ti.
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
                    <label htmlFor="phone-input" className="input-label">Número de Teléfono</label>
                    <input
                      id="phone-input"
                      type="tel"
                      placeholder="Tu número de teléfono..."
                      className="input-field"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
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
            </div>

            {/* MÓVIL 3D EN EL HERO */}
            <div className="benefits-visual">
              <div className="visual-perspective-container">
                {/* Elementos flotantes 3D en Parallax */}
                <motion.div 
                  className="floating-element pin-float"
                  style={{ y: floatY1, rotate: -12 }}
                >
                  <MapPin size={18} className="float-icon" />
                  <span>Cerca de ti</span>
                </motion.div>
                
                <motion.div 
                  className="floating-element truck-float"
                  style={{ y: floatY2, rotate: 14 }}
                >
                  <Truck size={18} className="float-icon" />
                  <span>Envíos rápidos</span>
                </motion.div>
                
                <motion.div 
                  className="floating-element store-float"
                  style={{ y: floatY3, rotate: -6 }}
                >
                  <Store size={18} className="float-icon" />
                  <span>Socio COFLY</span>
                </motion.div>

                {/* El Móvil 3D */}
                <motion.div 
                  className="phone-3d-wrapper"
                  style={{ 
                    rotateX, 
                    rotateY, 
                    rotateZ, 
                    scale,
                    y: phoneY,
                    transformStyle: "preserve-3d"
                  }}
                >
                  <div className="phone-chassis">
                    <div className="phone-screen-container">
                      <div className="phone-dynamic-island"></div>
                      
                      <div className="phone-screen-content">
                        {/* Simulación de Mapa Local */}
                        <div className="phone-mock-map">
                          <div className="map-circle ripple-1"></div>
                          <div className="map-circle ripple-2"></div>
                          <div className="map-pin-indicator index-1">
                            <MapPin size={14} />
                          </div>
                          <div className="map-pin-indicator index-2">
                            <Store size={14} />
                          </div>
                          <div className="map-pin-indicator index-3">
                            <ShoppingBag size={14} />
                          </div>
                        </div>
                        
                        <div className="phone-screen-overlay"></div>
                        
                        {/* Logo de COFLY en el Centro (animado por Scroll) */}
                        <motion.div 
                          className="phone-logo-wrapper"
                          style={{
                            scale: logoScale,
                            opacity: logoOpacity
                          }}
                        >
                          <img src="/Logo Cofly.png" alt="COFLY Logo" className="phone-logo-img" />
                        </motion.div>

                        <div className="phone-ui-footer">
                          <div className="phone-ui-bar"></div>
                        </div>
                      </div>
                      
                      <div className="phone-screen-glare"></div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Características Bento Grid */}
        <section className="features-section">
          <h2 className="section-title">¿Qué hace a COFLY único?</h2>
          <div className="bento-grid">
            
            {/* Tarjeta 1: Conexión Directa (8/12) con Chat Simulado */}
            <div 
              className="bento-card col-span-8 interactive-card-3d" 
              onMouseMove={handleMouseMove} 
              onMouseLeave={handleMouseLeave}
            >
              <div className="bento-text-side">
                <div className="bento-icon-wrapper">
                  <MessageSquare size={22} />
                </div>
                <h3>Conexión Local Directa</h3>
                <p>
                  Encuentra comercios y servicios cercanos y contacta con ellos directamente. Comunícate de forma inmediata con tus tiendas preferidas del barrio sin barreras artificiales.
                </p>
              </div>
              <div className="bento-visual-side">
                {/* Chat Simulado */}
                <div className="mock-chat-box">
                  <div className="chat-header">
                    <Store size={14} />
                    <span>Contacto Directo</span>
                    <span className="online-indicator"></span>
                  </div>
                  <div className="chat-messages">
                    <div className="msg incoming">
                      <div className="msg-avatar-icon-wrapper">
                        <User size={12} />
                      </div>
                      <p>¿Tienen disponible el almuerzo de hoy?</p>
                    </div>
                    <div className="msg outgoing">
                      <p>¡Hola! Sí, hoy tenemos cazuela de frijoles o pollo a la plancha.</p>
                      <span className="msg-check"><CheckCircle2 size={12} /></span>
                    </div>
                    <div className="msg incoming">
                      <div className="msg-avatar-icon-wrapper">
                        <User size={12} />
                      </div>
                      <p>¡Excelente! Envíenme una cazuela por favor.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjeta 2: Publicidad y Posicionamiento (4/12) con Ranking */}
            <div 
              className="bento-card col-span-4 interactive-card-3d" 
              onMouseMove={handleMouseMove} 
              onMouseLeave={handleMouseLeave}
            >
              <div className="bento-text-side">
                <div className="bento-icon-wrapper">
                  <Target size={22} />
                </div>
                <h3>Publicidad & Posicionamiento</h3>
                <p>
                  ¿Quieres destacar? Publicita tu negocio dentro de COFLY para aparecer de primero en las búsquedas y categorías locales de inmediato.
                </p>
              </div>
              <div className="bento-visual-side full-width">
                {/* Lista de Ranking Simulado */}
                <div className="mock-ranking-list">
                  <div className="ranking-item featured">
                    <div className="rank-num">#1</div>
                    <div className="rank-info">
                      <span className="rank-name">Pizzería Luigi</span>
                      <span className="rank-tag"><Sparkles size={10} /> Patrocinado</span>
                    </div>
                    <div className="rank-stars">⭐⭐⭐⭐⭐</div>
                  </div>
                  <div className="ranking-item">
                    <div className="rank-num">#2</div>
                    <div className="rank-info">
                      <span className="rank-name">Panadería El Trigo</span>
                    </div>
                  </div>
                  <div className="ranking-item">
                    <div className="rank-num">#3</div>
                    <div className="rank-info">
                      <span className="rank-name">Cafetería Sol</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjeta 3: Logística Sencilla (4/12) con Delivery Tracker */}
            <div 
              className="bento-card col-span-4 interactive-card-3d" 
              onMouseMove={handleMouseMove} 
              onMouseLeave={handleMouseLeave}
            >
              <div className="bento-text-side">
                <div className="bento-icon-wrapper">
                  <Bike size={22} />
                </div>
                <h3>Logística Confiable</h3>
                <p>
                  Olvídate de la complejidad operativa del reparto. COFLY provee y gestiona una red dedicada de domiciliarios para que tus pedidos locales lleguen rápidos y seguros.
                </p>
              </div>
              <div className="bento-visual-side full-width">
                {/* Tracker de Delivery Simulado */}
                <div className="mock-tracker">
                  <div className="tracker-step done">
                    <div className="step-check"><CheckCircle2 size={12} /></div>
                    <div className="step-info">
                      <span className="step-title">Pedido Preparado</span>
                      <span className="step-time">Hace 5 min</span>
                    </div>
                  </div>
                  <div className="tracker-step active">
                    <div className="step-dot"><span className="ping-dot"></span></div>
                    <div className="step-info">
                      <span className="step-title">Domiciliario Asignado</span>
                      <span className="step-time">En camino</span>
                    </div>
                  </div>
                  <div className="tracker-step pending">
                    <div className="step-dot"></div>
                    <div className="step-info">
                      <span className="step-title">Entregado</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tarjeta 4: Contadores Estadísticos Animados (8/12) */}
            <div 
              className="bento-card col-span-8 interactive-card-3d" 
              onMouseMove={handleMouseMove} 
              onMouseLeave={handleMouseLeave}
            >
              <div className="bento-text-side block-layout">
                <div className="bento-icon-wrapper">
                  <Clock size={22} />
                </div>
                <h3>La red que impulsa tu comunidad</h3>
                <p>
                  Estamos construyendo un ecosistema digital de alta velocidad e impacto local. La red logística de COFLY simplifica las operaciones del día a día.
                </p>
                
                {/* Contadores Animados */}
                <div className="counters-container">
                  <div className="counter-item">
                    <h4>
                      <AnimatedCounter value="120" suffix="+" />
                    </h4>
                    <span>Comercios Activos</span>
                  </div>
                  <div className="counter-item">
                    <h4>
                      <AnimatedCounter value="15" suffix="m" />
                    </h4>
                    <span>Entrega Promedio</span>
                  </div>
                  <div className="counter-item">
                    <h4>
                      <AnimatedCounter value="100" suffix="%" />
                    </h4>
                    <span>Respaldo de Red</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Sección de Cómo Funciona */}
        <section className="how-it-works-section">
          <h2 className="section-title">¿Cómo funciona COFLY?</h2>
          <div className="how-it-works-grid">
            <div className="how-card">
              <div className="how-step">1</div>
              <div className="how-icon-wrapper">
                <Compass size={28} />
              </div>
              <h3>Descubre tu Barrio</h3>
              <p>
                Los clientes navegan por la app y encuentran todos los locales, restaurantes y proveedores de servicios activos en su zona geográfica.
              </p>
            </div>

            <div className="how-card">
              <div className="how-step">2</div>
              <div className="how-icon-wrapper">
                <Store size={28} />
              </div>
              <h3>Ordena y Conecta</h3>
              <p>
                El cliente se contacta de forma directa con el negocio local preferido para coordinar los productos que desea solicitar.
              </p>
            </div>

            <div className="how-card">
              <div className="how-step">3</div>
              <div className="how-icon-wrapper">
                <Truck size={28} />
              </div>
              <h3>Reparto por COFLY</h3>
              <p>
                La red de domiciliarios que aporta la plataforma se encarga de recoger el pedido y entregarlo en la puerta del cliente con total confianza.
              </p>
            </div>
          </div>
        </section>

        {/* Sección de Mapa Interactivo Simulado de Entregas (WOW Effect) */}
        <section className="interactive-map-section">
          <div className="map-intro-text">
            <h2 className="section-title">Explora la Red Local de COFLY</h2>
            <p>
              Elige una categoría de comercio a continuación y observa cómo nuestra red de domiciliarios traza la ruta óptima para llevar los productos de forma segura a su destino.
            </p>
          </div>

          <div className="map-interactive-container">
            {/* Selector de categorías */}
            <div className="map-category-selector">
              <button 
                className={`map-cat-btn ${mapCategory === 'pizza' ? 'active' : ''}`}
                onClick={() => handleMapCategoryChange('pizza')}
              >
                <Utensils size={16} />
                <span>Restaurantes</span>
              </button>
              <button 
                className={`map-cat-btn ${mapCategory === 'groceries' ? 'active' : ''}`}
                onClick={() => handleMapCategoryChange('groceries')}
              >
                <Apple size={16} />
                <span>Fruterías</span>
              </button>
              <button 
                className={`map-cat-btn ${mapCategory === 'pharmacy' ? 'active' : ''}`}
                onClick={() => handleMapCategoryChange('pharmacy')}
              >
                <Pill size={16} />
                <span>Farmacias</span>
              </button>
              <button 
                className={`map-cat-btn ${mapCategory === 'shopping' ? 'active' : ''}`}
                onClick={() => handleMapCategoryChange('shopping')}
              >
                <Shirt size={16} />
                <span>Tiendas de Ropa</span>
              </button>
            </div>

            {/* Visualización de la animación del repartidor en moto estilo vector */}
            <div className="map-visual-box">
              <div className="delivery-animation-container">
                {/* Silueta de la ciudad en movimiento */}
                <div className="delivery-bg-scroller">
                  <div className="skyline-silhouette"></div>
                  <div className="trees-silhouette"></div>
                </div>

                {/* Líneas de viento para simular velocidad */}
                <div className="wind-lines-container">
                  <div className="wind-line wind-1"></div>
                  <div className="wind-line wind-2"></div>
                  <div className="wind-line wind-3"></div>
                </div>

                {/* Ilustración del repartidor en moto (Bote constante en vertical) */}
                <div className="rider-wrapper-container">
                  <motion.div 
                    className="rider-illustration-box"
                    animate={{
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <svg width="150" height="150" viewBox="0 0 150 150" fill="none" className="rider-svg-element">
                      {/* Rueda Trasera */}
                      <g className="wheel-back">
                        <circle cx="35" cy="115" r="16" stroke="var(--primary)" strokeWidth="3" fill="#121522" />
                        <circle cx="35" cy="115" r="8" stroke="var(--outline-variant)" strokeWidth="1.5" strokeDasharray="3 3" />
                        <line x1="35" y1="99" x2="35" y2="131" stroke="var(--outline-variant)" strokeWidth="1.5" />
                        <line x1="19" y1="115" x2="51" y2="115" stroke="var(--outline-variant)" strokeWidth="1.5" />
                      </g>
                      
                      {/* Rueda Delantera */}
                      <g className="wheel-front">
                        <circle cx="115" cy="115" r="16" stroke="var(--primary)" strokeWidth="3" fill="#121522" />
                        <circle cx="115" cy="115" r="8" stroke="var(--outline-variant)" strokeWidth="1.5" strokeDasharray="3 3" />
                        <line x1="115" y1="99" x2="115" y2="131" stroke="var(--outline-variant)" strokeWidth="1.5" />
                        <line x1="99" y1="115" x2="131" y2="115" stroke="var(--outline-variant)" strokeWidth="1.5" />
                      </g>

                      {/* Chasis de la Moto */}
                      <path d="M 35 115 L 60 115 L 75 120 L 98 120 L 108 90 L 115 115" stroke="var(--secondary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M 98 120 L 108 82 L 100 80" stroke="var(--secondary)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                      
                      {/* Motor / Batería */}
                      <rect x="42" y="98" width="18" height="15" rx="3" fill="var(--primary)" stroke="var(--secondary)" strokeWidth="1.5" />
                      
                      {/* Caja de Reparto COFLY */}
                      <rect x="18" y="62" width="30" height="32" rx="4" fill="var(--secondary)" stroke="var(--on-primary)" strokeWidth="1.5" />
                      <path d="M 18 78 L 48 78" stroke="var(--on-primary)" strokeWidth="2" />
                      <circle cx="33" cy="70" r="3" fill="var(--on-primary)" />

                      {/* Repartidor (Esqueleto geométrico limpio) */}
                      <path d="M 52 86 L 76 96 L 82 118" stroke="var(--primary)" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M 52 86 L 68 62" stroke="var(--secondary)" strokeWidth="6" strokeLinecap="round" />
                      <path d="M 68 62 L 92 68 L 105 81" stroke="var(--secondary)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                      <line x1="68" y1="62" x2="72" y2="54" stroke="var(--outline-variant)" strokeWidth="2.5" />
                      <circle cx="75" cy="48" r="8.5" fill="var(--primary)" />
                      <path d="M 75 42 Q 85 45 83 52" stroke="var(--secondary)" strokeWidth="2" fill="none" strokeLinecap="round" />
                    </svg>
                    
                    {/* Burbuja flotante con el pedido */}
                    <AnimatePresence mode="wait">
                      <motion.div 
                        key={mapCategory}
                        className="rider-order-bubble"
                        style={{ border: `2px solid ${mapData[mapCategory].color}` }}
                        initial={{ scale: 0, opacity: 0, y: 15 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0, opacity: 0, y: -15 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                      >
                        <div className="rider-bubble-icon" style={{ backgroundColor: mapData[mapCategory].color }}>
                          {mapData[mapCategory].icon}
                        </div>
                        <span className="rider-bubble-text">{mapData[mapCategory].productName}</span>
                      </motion.div>
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* Carretera y líneas del asfalto en movimiento */}
                <div className="road-container">
                  <div className="road-surface"></div>
                  <div className="road-dashes-wrapper">
                    <div className="road-dash"></div>
                    <div className="road-dash"></div>
                    <div className="road-dash"></div>
                    <div className="road-dash"></div>
                    <div className="road-dash"></div>
                    <div className="road-dash"></div>
                  </div>
                </div>

                {/* Notificación flotante de entrega */}
                <div className="map-delivery-notification">
                  <div className="notif-bar" style={{ backgroundColor: mapData[mapCategory].color }}></div>
                  <div className="notif-body">
                    <span className="notif-title">Entrega COFLY en curso</span>
                    <span className="notif-desc">
                      {isDelivering ? (
                        <>Llevando <strong>{mapData[mapCategory].productName}</strong> desde <strong>{mapData[mapCategory].shopName}</strong> ({mapData[mapCategory].delay})</>
                      ) : (
                        <>¡Pedido entregado con éxito por el comercio! ✅</>
                      )}
                    </span>
                  </div>
                </div>
              </div>
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
                    <p>Conecta con tus clientes y mantén el control de tu local con el soporte logístico de COFLY para las entregas.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="benefits-visual-fallback">
              {/* Bloque estático secundario en beneficios para mantener balance */}
              <div className="static-benefit-box">
                <div className="static-glow"></div>
                <h3>COFLY BETA</h3>
                <p>Potenciando el comercio de barrio</p>
                <div className="static-icons-row">
                  <Store size={32} />
                  <ArrowRight size={20} />
                  <Bike size={32} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Preguntas Frecuentes (FAQ) */}
        <section className="faq-section">
          <h2 className="section-title">Preguntas Frecuentes</h2>
          <div className="faq-list">
            {[
              {
                q: "¿Qué es COFLY?",
                a: "COFLY es una plataforma de visibilidad comercial y delivery que conecta directamente a los negocios de barrio con sus vecinos de la zona, resolviendo además el reparto local."
              },
              {
                q: "¿Quién realiza los envíos de los pedidos?",
                a: "COFLY proporciona y coordina una red dedicada de domiciliarios para realizar las entregas. Esto garantiza que los comercios locales no tengan que contratar personal propio de reparto."
              },
              {
                q: "¿Qué beneficios obtienen los negocios al registrarse en la Beta Cerrada?",
                a: "Los comercios registrados aseguran acceso prioritario a la plataforma antes del lanzamiento general y un saldo publicitario gratuito para aparecer destacados en las búsquedas locales."
              },
              {
                q: "¿Cómo ayuda COFLY a visibilizar mi negocio local?",
                a: "Permite a los usuarios cercanos encontrarte por cercanía geográfica y categorías. Ofrecemos herramientas de patrocinio directo para aparecer en los primeros lugares de búsqueda de tu zona."
              }
            ].map((item, idx) => (
              <div 
                key={idx} 
                className={`faq-item ${openFaq === idx ? 'active' : ''}`}
                onClick={() => toggleFaq(idx)}
              >
                <div className="faq-question">
                  <span>{item.q}</span>
                  <span className="faq-toggle-icon">
                    {openFaq === idx ? '−' : '+'}
                  </span>
                </div>
                <div className="faq-answer">
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sección CTA Final de Registro */}
        <section className="cta-bottom-section">
          <div className="cta-bottom-card">
            <h2>Sé el primero en usar COFLY en tu zona</h2>
            <p>Registra tu correo electrónico en nuestra lista de espera exclusiva y asegura tu acceso prioritario a la beta cerrada hoy mismo.</p>
            
            <form onSubmit={handleSubmit2} className="cta-bottom-form">
              <div className="cta-bottom-inputs">
                <input
                  type="text"
                  placeholder="Tu nombre completo..."
                  className="input-field"
                  value={name2}
                  onChange={(e) => {
                    setName2(e.target.value);
                    if (status2 === 'error') setStatus2('idle');
                  }}
                  disabled={status2 === 'loading'}
                />
                <input
                  type="tel"
                  placeholder="Tu número de teléfono..."
                  className="input-field"
                  value={phone2}
                  onChange={(e) => {
                    setPhone2(e.target.value);
                    if (status2 === 'error') setStatus2('idle');
                  }}
                  disabled={status2 === 'loading'}
                />
                <input
                  type="email"
                  placeholder="Tu correo electrónico..."
                  className="input-field"
                  value={email2}
                  onChange={(e) => {
                    setEmail2(e.target.value);
                    if (status2 === 'error') setStatus2('idle');
                  }}
                  disabled={status2 === 'loading'}
                />
              </div>
              <button 
                type="submit" 
                className="btn-submit secondary-cta-btn"
                disabled={status2 === 'loading'}
              >
                {status2 === 'loading' ? (
                  <span className="spinner"></span>
                ) : (
                  <>
                    <span>Pre-registrarse gratis</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Mensajes de Estado Form 2 */}
            {status2 === 'success' && (
              <div className="form-message success">
                <ShieldCheck size={16} />
                <span>{message2}</span>
              </div>
            )}
            {status2 === 'error' && (
              <div className="form-message error">
                <AlertCircle size={16} />
                <span>{message2}</span>
              </div>
            )}
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
