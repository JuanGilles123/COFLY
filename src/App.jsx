import React, { useState, useRef, useEffect } from 'react';
import { 
  AlertCircle, 
  ArrowRight, 
  MapPoint,
  Target,
  Truck,
  Key,
  Coins,
  ShieldCheck,
  Store,
  ShoppingBag,
  Compass,
  Bicycle,
  ChatSquare,
  CheckCircle,
  Clock,
  Sparkles,
  User
} from 'reicon-react';
import { registerEmail } from './lib/database';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { Marquee } from './components/magicui/Marquee';


// Importaciones de Magic UI
import { Ripple } from './components/magicui/Ripple';
import { BorderBeam } from './components/magicui/BorderBeam';
import { DotPattern } from './components/magicui/DotPattern';
import { ShimmerButton } from './components/magicui/ShimmerButton';
import { ScrollProgress } from './components/magicui/ScrollProgress';
import { AnimatedThemeToggler } from './components/magicui/AnimatedThemeToggler';
import { MorphingText } from './components/magicui/MorphingText';
import { LightRays } from './components/magicui/LightRays';

// Componente de Contador Animado
function AnimatedCounter({ value, suffix = "", duration = 2 }) {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    const currentElement = elementRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasRun) {
          setHasRun(true);
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

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) observer.unobserve(currentElement);
    };
  }, [value, duration, hasRun]);

  return <span ref={elementRef}>{count}{suffix}</span>;
}

// Componente para la pantalla de Error (Página no encontrada o Caída del sistema)
function NotFoundPage({ 
  title = "Página no encontrada", 
  description = "Lo sentimos, el enlace al que intentas acceder no está disponible o no existe en nuestra plataforma.", 
  buttonText = "Volver al Inicio", 
  onNavigateHome 
}) {
  return (
    <div className="not-found-container">
      {/* Fondos dinámicos en capas */}
      <div className="grid-bg"></div>
      <div className="glow-bg"></div>
      
      <div className="not-found-content">
        <div className="not-found-image-wrapper">
          <img 
            src="/animations/Error%20404.svg" 
            alt="Error" 
            className="not-found-image"
          />
        </div>
        <h1 className="not-found-title">{title}</h1>
        <p className="not-found-description">{description}</p>
        <button className="not-found-btn" onClick={onNavigateHome}>
          {buttonText} <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

// Error Boundary para capturar caídas del sistema
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <NotFoundPage 
          title="Algo salió mal"
          description="Lo sentimos, ocurrió un error inesperado al cargar la aplicación. Por favor, intenta recargar la página."
          buttonText="Recargar Página"
          onNavigateHome={() => window.location.reload()} 
        />
      );
    }

    return this.props.children;
  }
}

// Componente de Animación de Texto por Carácter (tipo Svelte Magic UI TextAnimate blurInUp)
function TextAnimate({ content, className = "", delay = 0 }) {
  const characters = Array.from(content);
  
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.02,
        delayChildren: delay
      }
    }
  };
  
  const charVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(4px)"
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };
  
  const words = content.split(' ');

  return (
    <motion.span 
      className={`inline ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
    >
      {words.map((word, wIdx) => (
        <React.Fragment key={wIdx}>
          <span className="inline-block whitespace-nowrap">
            {Array.from(word).map((char, cIdx) => (
              <motion.span 
                key={cIdx} 
                variants={charVariants} 
                className="inline-block"
              >
                {char}
              </motion.span>
            ))}
          </span>
          {wIdx < words.length - 1 && ' '}
        </React.Fragment>
      ))}
    </motion.span>
  );

}

function App() {
  // Estado para manejar la ruta actual (Error 404)
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Estado para manejar el tema (Modo Claro / Oscuro)
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('theme', nextTheme);
    setTheme(nextTheme);
  };

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    
    // Interceptar pushState/replaceState
    const originalPushState = window.history.pushState;
    window.history.pushState = function(...args) {
      originalPushState.apply(this, args);
      handleLocationChange();
    };
    const originalReplaceState = window.history.replaceState;
    window.history.replaceState = function(...args) {
      originalReplaceState.apply(this, args);
      handleLocationChange();
    };
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };


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



  // Scroll animations targetting the Hero section
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Svelte-style mouse spring tracking for floating elements
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Configure springs with elastic stiffness and damping
  const springConfig = { stiffness: 60, damping: 20 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const handleHeroMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleHeroMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const particle1X = useTransform(springX, (val) => val * 0.08);
  const particle1Y = useTransform(springY, (val) => val * 0.08);
  const particle2X = useTransform(springX, (val) => val * -0.05);
  const particle2Y = useTransform(springY, (val) => val * -0.05);
  const particle3X = useTransform(springX, (val) => val * 0.12);
  const particle3Y = useTransform(springY, (val) => val * 0.12);
  const particle4X = useTransform(springX, (val) => val * -0.08);
  const particle4Y = useTransform(springY, (val) => val * -0.08);

  // Bento grid scroll animations variants (Svelte staggered fly style)
  const bentoContainerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05
      }
    }
  };

  const bentoItemVariants = {
    hidden: { y: 40, scale: 0.96, opacity: 0, filter: "blur(8px)" },
    show: { 
      y: 0, 
      scale: 1, 
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 18
      }
    }
  };

  // Animación blurInUp estilo Svelte para secciones al hacer scroll
  const blurInUpVariants = {
    hidden: { opacity: 0, y: 50, filter: "blur(12px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 15,
        duration: 0.8
      }
    }
  };

  // Animaciones 3D e inclinaciones suaves para el celular en scroll
  // Combinar rotación por Scroll y rotación interactiva por Mouse (tilting 3D real)
  const rotateX = useTransform(
    [scrollYProgress, springY],
    ([scrollVal, mouseVal]) => {
      const scrollRotation = (1 - scrollVal) * 24; // 24deg a 0deg en scroll
      const mouseRotation = (mouseVal / 350) * -12; // Inclinación max 12deg por mouse Y
      return scrollRotation + mouseRotation;
    }
  );

  const rotateY = useTransform(
    [scrollYProgress, springX],
    ([scrollVal, mouseVal]) => {
      const scrollRotation = (1 - scrollVal) * -28; // -28deg a 0deg en scroll
      const mouseRotation = (mouseVal / 600) * 15;  // Inclinación max 15deg por mouse X
      return scrollRotation + mouseRotation;
    }
  );

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

  // Cambios de categoría de mapa interactivo

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



  if (currentPath !== '/' && currentPath !== '/index.html') {
    return (
      <NotFoundPage 
        title="Página no encontrada"
        description="Lo sentimos, el enlace al que intentas acceder no está disponible o no existe en nuestra plataforma."
        buttonText="Volver al Inicio"
        onNavigateHome={() => window.history.pushState({}, '', '/')} 
      />
    );
  }

  return (
    <ErrorBoundary>
      <div className="app-container relative">
      <ScrollProgress />
      {/* Fondos dinámicos en capas */}
      <div className="grid-bg"></div>
      <div className="glow-bg"></div>
      <DotPattern className="opacity-15 dark:opacity-25" />
      <LightRays 
        color={theme === 'dark' ? 'rgba(239, 95, 24, 0.18)' : 'rgba(37, 26, 101, 0.18)'} 
        count={8}
        className="opacity-100" 
      />

      <div className="content-wrapper">
        {/* Encabezado */}
        <header className="header">
          <div className="logo-container">
            <img src="/Logo Cofly.png" alt="COFLY Logo" className="logo-img" />
          </div>
          <div className="header-actions">
            <AnimatedThemeToggler theme={theme} toggleTheme={toggleTheme} />
            <span className="badge-beta">Beta Cerrada</span>
          </div>
        </header>

        {/* Sección Héroe con estructura de Doble Columna */}
        <section 
          className="hero relative overflow-visible" 
          ref={containerRef}
          onMouseMove={handleHeroMouseMove}
          onMouseLeave={handleHeroMouseLeave}
        >
          {/* Partículas elásticas estilo Svelte (Framer Motion springs) */}
          <div className="hero-particles-overlay pointer-events-none absolute inset-0 z-0">
            <motion.div 
              className="hero-particle particle-bike absolute" 
              style={{ x: particle1X, y: particle1Y }}
            >
              <div className="particle-wrapper">
                <Bicycle size={15} className="text-[#EF5F18]" />
                <span>Domicilio</span>
              </div>
            </motion.div>
            <motion.div 
              className="hero-particle particle-map absolute" 
              style={{ x: particle2X, y: particle2Y }}
            >
              <div className="particle-wrapper">
                <MapPoint size={15} className="text-[#EF5F18]" />
                <span>Barrio</span>
              </div>
            </motion.div>
            <motion.div 
              className="hero-particle particle-store absolute" 
              style={{ x: particle3X, y: particle3Y }}
            >
              <div className="particle-wrapper">
                <Store size={15} className="text-[#EF5F18]" />
                <span>Comercio</span>
              </div>
            </motion.div>
            <motion.div 
              className="hero-particle particle-bag absolute" 
              style={{ x: particle4X, y: particle4Y }}
            >
              <div className="particle-wrapper">
                <ShoppingBag size={15} className="text-[#EF5F18]" />
                <span>Pedido</span>
              </div>
            </motion.div>
          </div>

          <div className="hero-grid relative z-10">
            <div className="hero-text-content">
              <MorphingText 
                texts={["CONEXIÓN LOCAL", "DOMICILIOS RÁPIDOS", "SOCIOS DE CONFIANZA", "RED COMUNITARIA"]} 
                className="text-primary text-[10pt] md:text-[11pt] lg:text-[12pt] font-extrabold tracking-widest uppercase h-6 text-center mx-auto md:text-left md:mx-0 mb-2.5"
              />

              <h1 className="hero-title">
                <TextAnimate content="La plataforma que conecta tu " />
                <span>
                  <TextAnimate content="negocio local" delay={0.6} />
                </span>
                <TextAnimate content=" con clientes" delay={0.9} />
              </h1>

              
              <p className="hero-subtitle">
                Encuentra y contacta directamente con los comercios y servicios de tu barrio. Si tienes un negocio, patrocínate para aparecer de primero y atraer a más clientes, contando con la red de domiciliarios que COFLY provee para ti.
              </p>

              <div className="form-container">
                <form onSubmit={handleSubmit} className="register-form">
                  <div className="input-group">
                    <label htmlFor="name-input" className="input-label">Nombre Completo</label>
                    <BorderBeam 
                      duration={6} 
                      borderWidth={1.5} 
                      className="group w-full"
                      beamClassName="opacity-0 group-focus-within:opacity-100 group-hover:opacity-60 transition-opacity duration-300"
                    >
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
                    </BorderBeam>
                  </div>
                  <div className="input-group">
                    <label htmlFor="phone-input" className="input-label">Número de Teléfono</label>
                    <BorderBeam 
                      duration={6} 
                      borderWidth={1.5} 
                      className="group w-full"
                      beamClassName="opacity-0 group-focus-within:opacity-100 group-hover:opacity-60 transition-opacity duration-300"
                    >
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
                    </BorderBeam>
                  </div>
                  <div className="input-group">
                    <label htmlFor="email-input" className="input-label">Correo Electrónico</label>
                    <BorderBeam 
                      duration={6} 
                      borderWidth={1.5} 
                      className="group w-full"
                      beamClassName="opacity-0 group-focus-within:opacity-100 group-hover:opacity-60 transition-opacity duration-300"
                    >
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
                    </BorderBeam>
                  </div>
                  <ShimmerButton 
                    type="submit" 
                    disabled={status === 'loading'}
                    className="w-full mt-4"
                    shimmerColor="#ffffff"
                    background="#EF5F18"
                  >
                    <span className="font-semibold text-white">
                      {status === 'loading' ? 'Cargando...' : 'Pre-registrarse'}
                    </span>
                  </ShimmerButton>
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
                  {/* Elementos flotantes 3D en Parallax (ahora internos para moverse en sincronicidad con el chasis) */}
                  <motion.div 
                    className="floating-element pin-float"
                    style={{ y: floatY1, rotate: -12, z: 65 }}
                  >
                    <MapPoint size={18} className="float-icon" />
                    <span>Cerca de ti</span>
                  </motion.div>
                  
                  <motion.div 
                    className="floating-element truck-float"
                    style={{ y: floatY2, rotate: 14, z: 65 }}
                  >
                    <Truck size={18} className="float-icon" />
                    <span>Envíos rápidos</span>
                  </motion.div>
                  
                  <motion.div 
                    className="floating-element store-float"
                    style={{ y: floatY3, rotate: -6, z: 65 }}
                  >
                    <Store size={18} className="float-icon" />
                    <span>Socio COFLY</span>
                  </motion.div>

                  <div className="phone-chassis-3d">
                    {/* Parte trasera (Backplate) */}
                    <div className="phone-face phone-face-back">
                      {/* Logo COFLY en la parte trasera estilo Apple logo */}
                      <img src="/Logo Cofly.png" alt="COFLY Back Logo" className="phone-back-logo-img" />
                    </div>

                    {/* Frente (Pantalla) */}
                    <div className="phone-face phone-face-front">
                      <div className="phone-screen-container">
                        <div className="phone-dynamic-island"></div>
                        
                        <div className="phone-screen-content">
                          {/* Simulación de Mapa Local con Calles y Ruta */}
                          <div className="phone-mock-map relative overflow-hidden flex items-center justify-center">
                            <svg className="absolute inset-0 w-full h-full opacity-25" xmlns="http://www.w3.org/2000/svg">
                              {/* Líneas de Calles */}
                              <path d="M 0 100 L 300 100 M 0 250 L 300 250 M 0 400 L 300 400" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" />
                              <path d="M 60 0 L 60 520 M 180 0 L 180 520" stroke="rgba(255,255,255,0.15)" strokeWidth="2.5" />
                              
                              {/* Ruta de Entrega (Naranja Resplandeciente) */}
                              <path 
                                d="M 60 400 L 60 250 L 180 250 M 180 250 L 180 140" 
                                stroke="#EF5F18" 
                                strokeWidth="4" 
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="none"
                                className="animate-route-flow"
                              />
                            </svg>
                            
                            <Ripple mainCircleSize={50} mainCircleOpacity={0.2} numCircles={3} className="opacity-60" />
                            
                            {/* Indicadores de Pines en el mapa */}
                            <div className="map-pin-indicator index-1 z-10">
                              <Store size={12} />
                            </div>
                            <div className="map-pin-indicator index-2 z-10">
                              <ShoppingBag size={12} />
                            </div>
                            <div className="map-pin-indicator index-3 z-10">
                              <MapPoint size={12} />
                            </div>
                          </div>
                          
                          <div className="phone-screen-overlay"></div>

                          {/* Barra de estado del móvil */}
                          <div className="phone-status-bar">
                            <span>9:41</span>
                            <div className="phone-status-bar-icons">
                              {/* Señal de cobertura iOS (4 barras curvas/rectangulares) */}
                              <svg className="phone-signal-svg" viewBox="0 0 18 12" fill="currentColor">
                                <rect x="0" y="8" width="2" height="3" rx="0.5" />
                                <rect x="3.5" y="6" width="2" height="5" rx="0.5" />
                                <rect x="7" y="4" width="2" height="7" rx="0.5" />
                                <rect x="10.5" y="1.5" width="2" height="9.5" rx="0.5" />
                              </svg>
                              
                              {/* Icono de Wi-Fi iOS */}
                              <svg className="phone-wifi-svg" viewBox="0 0 16 12" fill="currentColor">
                                <path d="M8 10a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-3.5-3.5a5 5 0 0 1 7 0 .5.5 0 0 0 .7-.7 6 6 0 0 0-8.4 0 .5.5 0 0 0 .7.7zm-2.1-2.1a8 8 0 0 1 11.2 0 .5.5 0 0 0 .7-.7 9 9 0 0 0-12.6 0 .5.5 0 0 0 .7.7z" />
                              </svg>

                              {/* Batería iOS con contorno y pin cap lateral */}
                              <svg className="phone-battery-svg" viewBox="0 0 24 12" fill="currentColor">
                                <rect x="1" y="1" width="18" height="10" rx="3" fill="none" stroke="currentColor" strokeWidth="1.2" />
                                <rect x="3.5" y="3.5" width="11" height="5" rx="1" />
                                <path d="M20 4.5v3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                              </svg>
                            </div>
                          </div>

                          {/* Notificación iOS Push / Live Activity en el Tope */}
                          <div className="phone-notification">
                            <div className="phone-notification-header">
                              <div className="phone-notification-app-info">
                                <div className="phone-notification-app-icon">C</div>
                                <span>COFLY • AHORA</span>
                              </div>
                              <span className="phone-notification-status">Pedido en Curso</span>
                            </div>
                            
                            <div className="phone-notification-body">
                              <div className="phone-notification-content-wrapper">
                                <div className="phone-notification-icon-box">
                                  <Bicycle size={12} />
                                </div>
                                <div className="phone-notification-text">
                                  <span className="phone-notification-title">Dulcinoa Delivery</span>
                                  <span className="phone-notification-desc">Repartidor cerca de tu casa</span>
                                </div>
                              </div>
                              <span className="phone-notification-time">12 min</span>
                            </div>

                            {/* Barra de progreso de entrega realista con punto de ciclista */}
                            <div className="phone-notification-progress-bar">
                              <div className="phone-notification-progress-fill"></div>
                              {/* Ciclista flotante en el progreso */}
                              <div className="phone-notification-progress-rider"></div>
                            </div>
                          </div>

                          <div className="phone-ui-footer">
                            <div className="phone-ui-bar"></div>
                          </div>
                        </div>
                        
                        <div className="phone-screen-glare"></div>
                      </div>
                    </div>
                    
                    {/* Laterales 3D */}
                    <div className="phone-face phone-face-left">
                      <div className="phone-button-volume-up"></div>
                      <div className="phone-button-volume-down"></div>
                    </div>
                    <div className="phone-face phone-face-right">
                      <div className="phone-button-power"></div>
                    </div>
                    <div className="phone-face phone-face-top"></div>
                    <div className="phone-face phone-face-bottom"></div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Comercios Aliados (Carrusel) */}
        <section className="partners-section">
          <div className="partners-container">
            <p className="partners-title">Comercios que ya confían en COFLY</p>
            <Marquee className="partners-marquee" pauseOnHover={true} repeat={4}>
              {/* Tarjeta de Luna Lunera (Socio Fundador) */}
              <a 
                href="https://www.instagram.com/luna_lunera_store/"
                target="_blank"
                rel="noopener noreferrer"
                className="partner-card active-partner mx-4 block"
              >
                <div className="partner-card-glow"></div>
                <div className="partner-logo-wrapper">
                  <img 
                    src="/Logolunalunera.svg" 
                    alt="Luna Lunera" 
                    className="partner-logo-img"
                  />
                </div>
                <div className="partner-badge">Socio Fundador</div>
              </a>

              {/* Tarjeta de Dulcinoa (Socio Fundador) */}
              <a 
                href="https://www.instagram.com/dulcinoa.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="partner-card active-partner mx-4 block"
              >
                <div className="partner-card-glow"></div>
                <div className="partner-logo-wrapper">
                  <img 
                    src={theme === 'dark' ? '/dulcinoawrithe.svg' : '/dulcinoablack.svg'} 
                    alt="Dulcinoa" 
                    className="partner-logo-img-custom"
                  />
                </div>
                <div className="partner-badge">Socio Fundador</div>
              </a>

            </Marquee>
          </div>
        </section>





        {/* Sección de Características Bento Grid */}
        <section className="features-section">
          <h2 className="section-title">¿Qué hace a COFLY único?</h2>
          <motion.div 
            className="bento-grid"
            variants={bentoContainerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, margin: "-100px" }}
          >
            
            {/* Tarjeta 1: Conexión Directa (8/12) con Chat Simulado */}
            <motion.div 
              variants={bentoItemVariants}
              className="bento-card col-span-8 interactive-card-3d group" 
              onMouseMove={handleMouseMove} 
              onMouseLeave={handleMouseLeave}
            >
              <div className="bento-text-side">
                <div className="bento-icon-wrapper">
                  <ChatSquare size={22} />
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
                      <span className="msg-check"><CheckCircle size={12} /></span>
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
              <BorderBeam size={250} duration={8} delay={2} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>

            {/* Tarjeta 2: Publicidad y Posicionamiento (4/12) con Ranking */}
            <motion.div 
              variants={bentoItemVariants}
              className="bento-card col-span-4 interactive-card-3d group" 
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
              <BorderBeam size={200} duration={8} delay={1} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>

            {/* Tarjeta 3: Logística Sencilla (4/12) con Delivery Tracker */}
            <motion.div 
              variants={bentoItemVariants}
              className="bento-card col-span-4 interactive-card-3d group" 
              onMouseMove={handleMouseMove} 
              onMouseLeave={handleMouseLeave}
            >
              <div className="bento-text-side">
                <div className="bento-icon-wrapper">
                  <Bicycle size={22} />
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
                    <div className="step-check"><CheckCircle size={12} /></div>
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
              <BorderBeam size={200} duration={8} delay={3} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>

            {/* Tarjeta 4: Contadores Estadísticos Animados (8/12) */}
            <motion.div 
              variants={bentoItemVariants}
              className="bento-card col-span-8 interactive-card-3d group" 
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
              <BorderBeam size={250} duration={8} delay={0} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>

          </motion.div>
        </section>



        {/* Sección de Cómo Funciona */}
        <motion.section 
          className="how-it-works-section"
          variants={blurInUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
        >
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
        </motion.section>


        {/* Sección de Logística y Entrega Local Rápida */}
        <motion.section 
          className="interactive-map-section"
          variants={blurInUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
        >
          <div className="map-intro-text">
            <h2 className="section-title">Logística y Entrega Local Directa</h2>
            <p>
              COFLY conecta a los comercios con una red de domiciliarios ágil y directa para garantizar que tus pedidos del barrio lleguen rápidos, eficientes y sin intermediarios.
            </p>
          </div>

          <div className="map-interactive-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '32px', minHeight: '380px' }}>
            <img 
              src="/animations/Animation%20Delivery%20on%20a%20Bike.svg" 
              alt="COFLY Delivery Animación" 
              style={{ width: '100%', maxWidth: '580px', height: 'auto', display: 'block', margin: '0 auto' }}
            />
          </div>
        </motion.section>


        {/* Sección de Beneficios de la Beta */}
        <motion.section 
          className="benefits-section"
          variants={blurInUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
        >
          <div className="benefits-content">
            <div className="benefits-text">
              <h2>Únete hoy como Socio o Usuario Fundador</h2>
              <p>
                Estamos construyendo COFLY junto a nuestra comunidad y negocios locales. Regístrate en la lista de espera para asegurar beneficios únicos durante el lanzamiento.
              </p>
              
              <div className="benefits-list">
                <div className="benefit-item">
                  <Key size={20} className="benefit-item-icon" />
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
                  <Bicycle size={32} />
                </div>
              </div>
            </div>
          </div>
        </motion.section>


        {/* Sección de Preguntas Frecuentes (FAQ) */}
        <motion.section 
          className="faq-section"
          variants={blurInUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
        >
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
        </motion.section>


        {/* Sección CTA Final de Registro */}
        <motion.section 
          className="cta-bottom-section"
          variants={blurInUpVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-100px" }}
        >
          <div className="cta-bottom-card">
            <h2>Sé el primero en usar COFLY en tu zona</h2>
            <p>Registra tu correo electrónico en nuestra lista de espera exclusiva y asegura tu acceso prioritario a la beta cerrada hoy mismo.</p>
            
            <form onSubmit={handleSubmit2} className="cta-bottom-form">
              <div className="cta-bottom-inputs">
                <BorderBeam 
                  duration={6} 
                  borderWidth={1.5} 
                  className="group w-full"
                  beamClassName="opacity-0 group-focus-within:opacity-100 group-hover:opacity-60 transition-opacity duration-300"
                >
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
                </BorderBeam>
                <BorderBeam 
                  duration={6} 
                  borderWidth={1.5} 
                  className="group w-full"
                  beamClassName="opacity-0 group-focus-within:opacity-100 group-hover:opacity-60 transition-opacity duration-300"
                >
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
                </BorderBeam>
                <BorderBeam 
                  duration={6} 
                  borderWidth={1.5} 
                  className="group w-full"
                  beamClassName="opacity-0 group-focus-within:opacity-100 group-hover:opacity-60 transition-opacity duration-300"
                >
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
                </BorderBeam>
              </div>
              <ShimmerButton 
                type="submit" 
                disabled={status2 === 'loading'}
                className="secondary-cta-btn w-full mt-4"
                shimmerColor="#ffffff"
                background="#EF5F18"
              >
                <span className="font-semibold text-white">
                  {status2 === 'loading' ? 'Cargando...' : 'Pre-registrarse gratis'}
                </span>
              </ShimmerButton>
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
        </motion.section>


        {/* Footer */}
        <footer className="footer">
          <div>&copy; 2026 COFLY. Todos los derechos reservados.</div>
          <div className="footer-links">
            <a href="#terminos">Términos de Servicio</a>
            <a href="#privacidad">Privacidad</a>
          </div>
        </footer>
        {/* Botón flotante para volver arriba */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              onClick={scrollToTop}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              className="scroll-to-top-btn"
              aria-label="Volver arriba"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="m18 15-6-6-6 6"/>
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
    </ErrorBoundary>
  );
}

export default App;
