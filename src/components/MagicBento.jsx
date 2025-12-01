import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import AnimatedTitle from "./AnimatedTitle";

const DEFAULT_PARTICLE_COUNT = 16;
const DEFAULT_SPOTLIGHT_RADIUS = 350;
const DEFAULT_GLOW_COLOR = '132, 0, 255';
const MOBILE_BREAKPOINT = 768;

const cardData = [
  {
    color: '#060010',
    title: 'Hosted by',
    description: 'BMSCE (Anchor) and RVCE (Co-Host), Bangalore',
    label: '20th & 21st December 2024',
    image: '/img/summit-logo.webp'
  },
  {
    color: '#060010',
    title: '180+ Attendees',
    description: '70+ ACM Chapters',
    label: 'Statistics',
    image: '/img/9.webp'
  },
  {
    color: '#060010',
    title: 'Inspiring Voices',
    description: 'Experts driving the future of technology and sustainability.',
    label: 'Speakers',
    showSlideshow: true,
    slideshowImages: [
      '/img/speaker-1.webp',
      '/img/speaker-2.webp',
      '/img/speaker-3.webp',
      '/img/speaker-4.webp',
      '/img/speaker-5.webp',
      '/img/speaker-6.webp',
      '/img/speaker-7.webp',
      '/img/speaker-8.webp',
    ]
  },
  {
    color: '#060010',
    title: 'Summit Highlights',
    description: 'Glimpses from the summit',
    label: '2024 Edition',
    showSlideshow: true,
    slideshowImages: [
      '/img/sh-1.webp',
      '/img/sh-2.webp',
      '/img/sh-3.webp',
      '/img/sh-4.webp',
      '/img/sh-5.webp',
      '/img/sh-6.webp',
      '/img/sh-7.webp',
      '/img/sh-8.webp',
      '/img/sh-9.webp',
      '/img/sh-10.webp',
      '/img/sh-11.webp',
      '/img/sh-12.webp',
      '/img/sh-13.webp',
      '/img/sh-14.webp',
    ]
  },
  {
    color: '#060010',
    title: 'Sustainable Computing',
    description: 'Technology for a greener future',
    label: 'Theme',
    image: '/img/theme.webp'
  },
  {
    color: '#060010',
    title: 'BMSCE ACM Student Chapter',
    description: 'Entrusted to manage ACM regional events across India',
    label: 'Regional Coordination',
    image: '/img/regional.webp'
  }
];

const createParticleElement = (x, y, color = DEFAULT_GLOW_COLOR) => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 6px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const calculateSpotlightValues = radius => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75
});

const updateCardGlowProperties = (card, mouseX, mouseY, glow, radius) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;
  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

const ParticleCard = ({
  children,
  className = '',
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = true,
  enableMagnetism = false
}) => {
  const cardRef = useRef(null);
  const particlesRef = useRef([]);
  const timeoutsRef = useRef([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef(null);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;
    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowColor)
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();
    particlesRef.current.forEach(particle => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'back.in(1.7)',
        onComplete: () => {
          particle.parentNode?.removeChild(particle);
        }
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;
    if (!particlesInitialized.current) {
      initializeParticles();
    }
    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;
        const clone = particle.cloneNode(true);
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);
        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'back.out(1.7)' });
        gsap.to(clone, {
          x: (Math.random() - 0.5) * 100,
          y: (Math.random() - 0.5) * 100,
          rotation: Math.random() * 360,
          duration: 2 + Math.random() * 2,
          ease: 'none',
          repeat: -1,
          yoyo: true
        });
        gsap.to(clone, {
          opacity: 0.3,
          duration: 1.5,
          ease: 'power2.inOut',
          repeat: -1,
          yoyo: true
        });
      }, index * 100);
      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;
    const element = cardRef.current;
    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();
      if (enableTilt) {
        gsap.to(element, {
          rotateX: 5,
          rotateY: 5,
          duration: 0.3,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }
    };
    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();
      if (enableTilt) {
        gsap.to(element, {
          rotateX: 0,
          rotateY: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
      if (enableMagnetism) {
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };
    const handleMouseMove = e => {
      if (!enableTilt && !enableMagnetism) return;
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        gsap.to(element, {
          rotateX,
          rotateY,
          duration: 0.1,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      }
      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.05;
        const magnetY = (y - centerY) * 0.05;
        magnetismAnimationRef.current = gsap.to(element, {
          x: magnetX,
          y: magnetY,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };
    const handleClick = e => {
      if (!clickEffect) return;
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );
      const ripple = document.createElement('div');
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
        `;
      element.appendChild(ripple);
      gsap.fromTo(
        ripple,
        {
          scale: 0,
          opacity: 1
        },
        {
          scale: 1,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => ripple.remove()
        }
      );
    };
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('click', handleClick);
    return () => {
      isHoveredRef.current = false;
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('click', handleClick);
      clearAllParticles();
    };
  }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor]);

  return (
    <div
      ref={cardRef}
      className={`${className} relative overflow-hidden`}
      style={{ ...style, position: 'relative', overflow: 'hidden' }}
    >
      {children}
    </div>
  );
};

const GlobalSpotlight = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR
}) => {
  const spotlightRef = useRef(null);
  const isInsideSection = useRef(false);
  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;
    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    spotlight.style.cssText = `
      position: fixed;
      width: 800px;
      height: 800px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.15) 0%,
        rgba(${glowColor}, 0.08) 15%,
        rgba(${glowColor}, 0.04) 25%,
        rgba(${glowColor}, 0.02) 40%,
        rgba(${glowColor}, 0.01) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;
    const handleMouseMove = e => {
      if (!spotlightRef.current || !gridRef.current) return;
      const section = gridRef.current.closest('.bento-section');
      const rect = section?.getBoundingClientRect();
      const mouseInside =
        rect && e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
      isInsideSection.current = mouseInside || false;
      const cards = gridRef.current.querySelectorAll('.card');
      if (!mouseInside) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
        cards.forEach(card => {
          card.style.setProperty('--glow-intensity', '0');
        });
        return;
      }
      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;
      cards.forEach(card => {
        const cardElement = card;
        const cardRect = cardElement.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance =
          Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);
        minDistance = Math.min(minDistance, effectiveDistance);
        let glowIntensity = 0;
        if (effectiveDistance <= proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }
        updateCardGlowProperties(cardElement, e.clientX, e.clientY, glowIntensity, spotlightRadius);
      });
      gsap.to(spotlightRef.current, {
        left: e.clientX,
        top: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      });
      const targetOpacity =
        minDistance <= proximity
          ? 0.8
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
            : 0;
      gsap.to(spotlightRef.current, {
        opacity: targetOpacity,
        duration: targetOpacity > 0 ? 0.2 : 0.5,
        ease: 'power2.out'
      });
    };
    const handleMouseLeave = () => {
      isInsideSection.current = false;
      gridRef.current?.querySelectorAll('.card').forEach(card => {
        card.style.setProperty('--glow-intensity', '0');
      });
      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);
  return null;
};

const BentoCardGrid = ({ children, gridRef }) => (
  <div
    className="bento-section grid gap-2 p-3 select-none relative"
    style={{ minWidth: 0, width: '100%' }}
    ref={gridRef}
  >
    {children}
  </div>
);

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return isMobile;
};

const CardSlideshow = ({ images = [] }) => {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!images.length) return;
    const timer = setTimeout(() => setCurrent((prev) => (prev + 1) % images.length), 3000);
    return () => clearTimeout(timer);
  }, [current, images]);
  if (!images.length) return null;
  return (
    <div className="absolute inset-0 w-full h-full z-0 rounded-[20px] overflow-hidden bg-black">
      <img
        src={images[current]}
        alt=""
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.55)'
        }}
      />
    </div>
  );
};

const MagicBento = ({
  textAutoHide = true, // Note: Will turn off clamping for all titles/descriptions below
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = true,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = false
}) => {
  const gridRef = useRef(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;

  return (
    <div style={{ backgroundColor: '#000', paddingTop: '5rem', paddingBottom: '10rem' }} className="bento-section">
      <AnimatedTitle
        title="ACM India <br />  Chapter Summit-2024"
        containerClass="mt-20 text-center !text-white"
      />
      <style>
        {`
          .bento-section {
            --glow-x: 50%;
            --glow-y: 50%;
            --glow-intensity: 0;,
            --glow-radius: 275px;
            --glow-color: ${glowColor};
            --border-color: #392e4e;
            --background-dark: #060010;
            --white: hsl(0, 0%, 100%);
            --purple-primary: rgba(132, 0, 255, 1);
            --purple-glow: rgba(132, 0, 255, 0.2);
            --purple-border: rgba(132, 0, 255, 0.8);
          }
            
          .card-responsive {
            grid-template-columns: 1fr;
            width: 95vw;           /* Changed from 95vw to 80vw */
            margin: 0 auto;
            padding: 0.7rem;
            max-width: 95vw;       /* Changed from 100vw to 80vw */
          }
          @media (min-width: 600px) {
            .card-responsive {
              grid-template-columns: repeat(2, 1fr);
              width: 80vw;         /* Changed to 80vw */
              font-size: 1.18rem;
            }
          }
          @media (min-width: 1024px) {
            .card-responsive {
              grid-template-columns: repeat(4, 1fr);
              width: 80vw;         /* Changed to 80vw */
              max-width: 1800px;
              font-size: 1.45rem;
              gap: 2.2rem;
            }
            .card-responsive .card:nth-child(3) {
              grid-column: span 2;
              grid-row: span 2;
            }
            .card-responsive .card:nth-child(4) {
              grid-column: 1 / span 2;
              grid-row: 2 / span 2;
            }
            .card-responsive .card:nth-child(6) {
              grid-column: 4;
              grid-row: 3;
            }
          }
          .card {
            min-height: 280px;
            height: 100%;
          }
          @media (min-width: 1024px) {
            .card {
              min-height: 315px;
              font-size: 1.18em;
              padding: 2.2rem;
              border-radius: 30px;
            }
            .card__title {
              font-size: 1.2rem;
              padding-bottom: 0.2rem;
              font-family: 'Circular Std', sans-serif;
            }
            .card__header {
              font-size: 1.05em;
              font-family: 'Circular Std', sans-serif;
            }
            .card__description {
              font-size: 1rem;
              padding-bottom: 0.1rem;
              opacity: 0.6;
              font-family: 'Circular Std', sans-serif;
            }
          }


@media (min-width: 600px) and (max-width: 1023px) {
  .card-responsive {
    gap: 2rem; /* Add spacing between cards */
    width: 90vw;  /* Optional: adjust width */
  }

  .card {
    padding: 1.5rem; /* Add padding inside each card */
    border-radius: 25px; /* Slightly rounded corners */
    min-height: 300px; /* Adjust height */
  }

  .card__title {
    font-size: 1.15rem;
    padding-bottom: 0.3rem; /* Space below title */
  }

  .card__description {
    font-size: 0.95rem;
    padding-bottom: 0.2rem; /* Space below description */
    opacity: 0.65;
  }

  .card__header {
    font-size: 1.05rem;
  }
}


/* Mobile screens: below 600px */
@media (max-width: 599px) {
  .card-responsive {
    grid-template-columns: 1fr; /* Single column */
    gap: 1rem;                  /* Space between cards */
    width: 95vw;                /* Slightly narrower than full width */
  }

  .card {
    padding: 1rem;             /* Padding inside each card */
    border-radius: 20px;       /* Rounded corners */
    min-height: 250px;         /* Adjust height */
  }

  .card__title {
    font-size: 1rem;
    padding-bottom: 0.2rem;
  }

  .card__description {
    font-size: 0.9rem;
    padding-bottom: 0.15rem;
    opacity: 0.6;
  }

  .card__header {
    font-size: 0.95rem;
  }
}


/* Mobile screens: below 600px */
@media (max-width: 599px) {
  .card-responsive {
    grid-template-columns: 1fr; /* Single column */
    gap: 2.5rem;                  /* Space between cards */
    width: 95vw;                /* Slightly narrower than full width */
  }

  .card {
    padding: 1rem;             /* Padding inside each card */
    border-radius: 20px;       /* Rounded corners */
    min-height: 250px;         /* Adjust height */
  }

  .card__title {
    font-size: 1rem;
    padding-bottom: 0.2rem;
  }

  .card__description {
    font-size: 0.9rem;
    padding-bottom: 0.15rem;
    opacity: 0.6;
  }

  .card__header {
    font-size: 0.95rem;
  }
}



          .card--border-glow::after {
            content: '';
            position: absolute;
            inset: 0;
            padding: 8px;
            background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
                rgba(${glowColor}, calc(var(--glow-intensity) * 0.8)) 0%,
                rgba(${glowColor}, calc(var(--glow-intensity) * 0.4)) 30%,
                transparent 60%);
            border-radius: inherit;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: subtract;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            pointer-events: none;
            transition: opacity 0.3s ease;
            z-index: 1;
          }
          .card--border-glow:hover::after {
            opacity: 1;
          }
          .card--border-glow:hover {
            box-shadow: 0 4px 30px rgba(46, 24, 78, 0.65), 0 0 60px rgba(${glowColor}, 0.3);
          }
          .particle::before {
            content: '';
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            background: rgba(${glowColor}, 0.2);
            border-radius: 50%;
            z-index: -1;
          }
          .particle-container:hover {
            box-shadow: 0 4px 20px rgba(46, 24, 78, 0.2), 0 0 30px rgba(${glowColor}, 0.2);
          }
          .text-clamp-1 {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .text-clamp-2 {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          @media (max-width: 599px) {
            .card-responsive {
              grid-template-columns: 1fr;
              width: 95vw;
              margin: 0 auto;
              padding: 0.5rem;
            }
            .card-responsive .card {
              width: 100%;
              min-height: 180px;
              padding: 1rem;
              border-radius: 15px;
            }
          }
          .card__slideshow {
            pointer-events: auto;
          }
            @media (max-width: 768px) {
          .card__title {
            font-size: 1.5rem !important;  /* bigger title font on mobile */
          }
          .card__header {
            font-size: 1.3rem !important;  /* bigger header font */
          }
          .card__description {
            font-size: 1rem !important;
            padding-top: 0.5rem;
          }
}

        `}
      </style>
      {enableSpotlight && (
        <GlobalSpotlight
          gridRef={gridRef}
          disableAnimations={shouldDisableAnimations}
          enabled={enableSpotlight}
          spotlightRadius={spotlightRadius}
          glowColor={glowColor}
        />
      )}
      <BentoCardGrid gridRef={gridRef}>
        <div className="card-responsive grid gap-2">
          {cardData.map((card, index) => {
            const baseClassName = `card flex flex-col justify-between relative aspect-[4/3] w-full max-w-full border border-solid font-light overflow-hidden transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(0,0,0,0.15)] ${enableBorderGlow ? 'card--border-glow' : ''
              }`;
            const cardStyle = {
              backgroundColor: card.color || 'var(--background-dark)',
              borderColor: 'var(--border-color)',
              color: 'var(--white)',
              '--glow-x': '50%',
              '--glow-y': '50%',
              '--glow-intensity': '0',
              '--glow-radius': '200px',
              position: 'relative',
              overflow: 'hidden'
            };
            if (card.showSlideshow && card.slideshowImages) {
              return (
                <ParticleCard
                  key={index}
                  className={baseClassName}
                  style={cardStyle}
                  disableAnimations={shouldDisableAnimations}
                  particleCount={particleCount}
                  glowColor={glowColor}
                  enableTilt={enableTilt}
                  clickEffect={clickEffect}
                  enableMagnetism={enableMagnetism}
                >
                  <div className="card__slideshow absolute inset-0 w-full h-full z-0 rounded-[20px] overflow-hidden">
                    <CardSlideshow images={card.slideshowImages} />
                  </div>
                  <div className="relative z-10 card__header flex justify-between gap-3">
                    <span className="card__label font-circular-web text-base" style={{
                      fontSize: card.showSlideshow ? '1.3rem' : '1.1rem',

                    }}>{card.label}</span>
                  </div>
                  <div className="relative z-10 card__content flex flex-col">
                    <h3 className="card__title font-circular-web text-base m-0 mb-1" style={{
                      fontSize: card.showSlideshow ? '2rem' : '1.1rem',

                    }} >
                      {card.title}
                    </h3>
                    <p className="card__description font-circular-web text-xs leading-5 opacity-90" style={{
                      fontSize: card.showSlideshow ? '1.4rem' : '1.1rem',
                      lineHeight: card.showSlideshow ? '1.2' : '1',
                      paddingTop: card.showSlideshow ? '0.5rem' : '0',

                    }}>
                      {card.description}
                    </p>
                  </div>
                </ParticleCard>
              );
            }
            if (card.image) {
              return (
                <ParticleCard
                  key={index}
                  className={baseClassName}
                  style={cardStyle}
                  disableAnimations={shouldDisableAnimations}
                  particleCount={particleCount}
                  glowColor={glowColor}
                  enableTilt={enableTilt}
                  clickEffect={clickEffect}
                  enableMagnetism={enableMagnetism}
                >
                  <div className="relative z-10 w-full h-[100px] mb-2 overflow-hidden rounded-[12px]">
                    <img
                      src={card.image}
                      alt={card.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '12px'
                      }}
                    />
                  </div>
                  <div className="card__header flex justify-between gap-3 relative z-10">
                    <span className="card__label font-circular-web text-base">{card.label}</span>
                  </div>
                  <div className="card__content flex flex-col relative z-10">
                    <h3 className="card__title font-circular-web text-base m-0 mb-1">
                      {card.title}
                    </h3>
                    <p className="card__description font-circular-web text-xs leading-5 opacity-90">
                      {card.description}
                    </p>
                  </div>
                </ParticleCard>
              );
            }
            return (
              <ParticleCard
                key={index}
                className={baseClassName}
                style={cardStyle}
                disableAnimations={shouldDisableAnimations}
                particleCount={particleCount}
                glowColor={glowColor}
                enableTilt={enableTilt}
                clickEffect={clickEffect}
                enableMagnetism={enableMagnetism}
              >
                <div className="card__header flex justify-between gap-3 relative text-white">
                  <span className="card__label font-circular-web text-base">{card.label}</span>
                </div>
                <div className="card__content flex flex-col relative text-white">
                  <h3 className="card__title font-circular-web text-base m-0 mb-1">
                    {card.title}
                  </h3>
                  <p className="card__description font-circular-web text-xs leading-5 opacity-90">
                    {card.description}
                  </p>
                </div>
              </ParticleCard>
            );
          })}
        </div>
      </BentoCardGrid>
    </div>
  );
};

export default MagicBento;