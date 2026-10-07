import React, { useState, useEffect, Suspense } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const Butterfly3D = React.lazy(() => import('./components/Butterfly3D'));

const IMAGES = [
  { 
    src: '/bouquet_2.png?v=2', 
    bg: '#C99E5C', 
    panel: '#D9AE6C',
    title: 'Nắng Mùa Thu',
    desc: 'Cảm hứng từ tia nắng ban mai rực rỡ và ấm áp. Biểu tượng của nguồn năng lượng tích cực, hoàn hảo để bắt đầu một ngày mới đầy niềm vui.'
  },
  { 
    src: '/bouquet_3.png?v=2', 
    bg: '#8B7D9E', 
    panel: '#9B8DAE',
    title: 'Tím Thủy Chung',
    desc: 'Sự pha trộn tinh tế giữa sắc tím lavender mộng mơ và tông màu pastel thanh lịch. Tượng trưng cho sự lãng mạn, sâu sắc và tình yêu vĩnh cửu.'
  },
  { 
    src: '/bouquet_4.png?v=2', 
    bg: '#6A89A6', 
    panel: '#7A99B6',
    title: 'Bình Yên Xanh',
    desc: 'Mang vẻ đẹp êm dịu tựa như bầu trời thoáng đãng. Gửi gắm cảm giác an yên, nhẹ nhàng và xua tan đi mọi muộn phiền trong cuộc sống.'
  },
];

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    IMAGES.forEach((img) => {
      const image = new Image();
      image.src = img.src;
    });
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navigate = (dir: 'next' | 'prev') => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (dir === 'next' ? (prev + 1) % IMAGES.length : (prev + IMAGES.length - 1) % IMAGES.length));
    setTimeout(() => setIsAnimating(false), 650);
  };

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        backgroundColor: '#fffdfa',
        transition: 'background-color 650ms cubic-bezier(0.4,0,0.2,1)',
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      <div className="relative w-full" style={{ height: '100vh', overflow: 'hidden' }}>
        
        {/* Dappled light effect from sunlit */}
        <div id="dappled-light" style={{ zIndex: 1 }}>
          <div id="glow"></div>
          <div id="glow-bounce"></div>
          <div className="perspective">
            <div id="leaves">
              <svg style={{ width: 0, height: 0, position: 'absolute' }}>
                <defs>
                  <filter id="wind" x="-20%" y="-20%" width="140%" height="140%">
                    <feTurbulence type="fractalNoise" numOctaves="2" seed="1">
                      <animate attributeName="baseFrequency" dur="16s" keyTimes="0;0.33;0.66;1" values="0.005 0.003;0.01 0.009;0.008 0.004;0.005 0.003" repeatCount="indefinite" />
                    </feTurbulence>
                    <feDisplacementMap in="SourceGraphic">
                      <animate attributeName="scale" dur="20s" keyTimes="0;0.25;0.5;0.75;1" values="45;55;75;55;45" repeatCount="indefinite" />
                    </feDisplacementMap>
                  </filter>
                </defs>
              </svg>
            </div>
            <div id="blinds">
              <div className="shutters">
                {Array.from({ length: 23 }).map((_, i) => <div key={i} className="shutter"></div>)}
              </div>
              <div className="vertical">
                <div className="bar"></div>
                <div className="bar"></div>
              </div>
            </div>
          </div>
          <div id="progressive-blur">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>

        {/* Giant ghost text */}
        <div
          className="absolute inset-x-0 flex items-center justify-center pointer-events-none select-none z-[2]"
          style={{ top: '5%' }}
        >
          <h1
            className="text-[#2a3b2c]"
            style={{
              fontFamily: "'Pattaya', cursive",
              fontSize: 'clamp(70px, 24vw, 280px)',
              fontWeight: 400,
              opacity: 0.03,
              lineHeight: 1,
              letterSpacing: '0.04em',
              whiteSpace: 'nowrap',
            }}
          >
            BLOME
          </h1>
        </div>

        {/* Top-left brand label */}
        <div className="absolute top-6 left-4 sm:top-10 sm:left-12 lg:top-12 lg:left-20 z-[60]">
          <a href="#" className="flex flex-col items-start text-[#2a3b2c] no-underline group hover:scale-105 transition-transform duration-300">
            <span className="text-[9px] sm:text-[11px] font-bold uppercase tracking-[0.35em] opacity-70 mb-[-2px] ml-1">
              Tiệm Hoa
            </span>
            <span 
              className="text-3xl sm:text-4xl lg:text-[42px] tracking-wide" 
              style={{ fontFamily: "'Pattaya', cursive", lineHeight: 1 }}
            >
              Bloom
            </span>
          </a>
        </div>

        {/* Transparent Navbar with Droplet Hover Links */}
        <nav className="absolute top-5 right-4 sm:top-9 sm:right-12 lg:top-11 lg:right-20 z-[60] hidden md:flex items-center gap-2">
          <a href="#" className="hover-droplet text-[#2a3b2c] text-sm font-bold tracking-wide no-underline uppercase opacity-85 hover:opacity-100">Trang Chủ</a>
          <a href="#" className="hover-droplet text-[#2a3b2c] text-sm font-bold tracking-wide no-underline uppercase opacity-85 hover:opacity-100">Sản Phẩm</a>
          <a href="#" className="hover-droplet text-[#2a3b2c] text-sm font-bold tracking-wide no-underline uppercase opacity-85 hover:opacity-100">Dịch Vụ</a>
          <a href="#" className="hover-droplet text-[#2a3b2c] text-sm font-bold tracking-wide no-underline uppercase opacity-85 hover:opacity-100">Liên Hệ</a>
        </nav>

        {/* Mobile Menu Icon (Liquid Glass Droplet) */}
        <button 
          className="absolute top-5 right-4 z-[60] md:hidden flex items-center justify-center w-12 h-12 text-[#2a3b2c] transition-all duration-300"
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.1) 100%)',
            backdropFilter: 'blur(28px) saturate(200%)',
            WebkitBackdropFilter: 'blur(28px) saturate(200%)',
            boxShadow: 'inset 2px 2px 5px rgba(255,255,255,0.7), inset -2px -2px 8px rgba(0,0,0,0.03), 0 5px 20px rgba(0,0,0,0.08)',
            border: '1px solid rgba(255, 255, 255, 0.6)',
            animation: 'morphDrop 6s ease-in-out infinite alternate',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M4 7h16M4 12h16M4 17h16"/>
          </svg>
        </button>

        {/* Carousel */}
        <div className="absolute inset-0 z-[3]">

          {IMAGES.map((img, i) => {
            const L = IMAGES.length;
            let role = '';
            if (i === activeIndex) role = 'center';
            else if (i === (activeIndex + L - 1) % L) role = 'left';
            else if (i === (activeIndex + 1) % L) role = 'right';
            else role = 'back'; // Fallback if L > 3

            let transform = '',
              filter = '',
              opacity = 1,
              zIndex = 0,
              left = '',
              height = '',
              bottom = '';

            if (role === 'center') {
              transform = `translateX(-50%) scale(${isMobile ? 1.4 : 2.0})`;
              filter = 'blur(0px)';
              opacity = 1;
              zIndex = 20;
              left = '50%';
              height = isMobile ? '60%' : '92%';
              bottom = isMobile ? '30%' : '15%';
            } else if (role === 'left') {
              transform = `translateX(-50%) scale(1.1)`;
              filter = 'blur(2px)';
              opacity = 0.85;
              zIndex = 10;
              left = isMobile ? '20%' : '28%';
              height = isMobile ? '16%' : '28%';
              bottom = isMobile ? '40%' : '25%';
            } else if (role === 'right') {
              transform = `translateX(-50%) scale(1.1)`;
              filter = 'blur(2px)';
              opacity = 0.85;
              zIndex = 10;
              left = isMobile ? '80%' : '72%';
              height = isMobile ? '16%' : '28%';
              bottom = isMobile ? '40%' : '25%';
            } else if (role === 'back') {
              transform = `translateX(-50%) scale(1.1)`;
              filter = 'blur(4px)';
              opacity = 1;
              zIndex = 5;
              left = '50%';
              height = isMobile ? '13%' : '22%';
              bottom = isMobile ? '44%' : '29%';
            }

            return (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  aspectRatio: '0.6 / 1',
                  transform,
                  filter,
                  opacity,
                  zIndex,
                  left,
                  height,
                  bottom,
                  transition:
                    'transform 650ms cubic-bezier(0.4,0,0.2,1), filter 650ms cubic-bezier(0.4,0,0.2,1), opacity 650ms cubic-bezier(0.4,0,0.2,1), left 650ms cubic-bezier(0.4,0,0.2,1), height 650ms cubic-bezier(0.4,0,0.2,1), bottom 650ms cubic-bezier(0.4,0,0.2,1)',
                  willChange: 'transform, filter, opacity',
                }}
              >
                <img
                  src={img.src}
                  alt={`Bouquet ${i + 1}`}
                  draggable={false}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    objectPosition: 'bottom center',
                  }}
                />
              </div>
            );
          })}
        </div>

        {/* Bottom-left text + nav buttons */}
        <div className="absolute bottom-6 left-4 sm:bottom-10 sm:left-12 lg:bottom-16 lg:left-20 z-[60] w-full max-w-[85%] sm:max-w-[450px] lg:max-w-[550px]">
          <div className="relative h-[160px] sm:h-[220px] mb-4 sm:mb-5">
            {IMAGES.map((img, i) => (
              <div 
                key={i}
                className="absolute inset-x-0 bottom-0 flex flex-col justify-end"
                style={{
                  opacity: i === activeIndex ? 1 : 0,
                  transform: i === activeIndex ? 'translateY(0)' : 'translateY(10px)',
                  transition: 'opacity 600ms ease, transform 600ms ease',
                  pointerEvents: i === activeIndex ? 'auto' : 'none'
                }}
              >
                <p 
                  className="text-[#2a3b2c] mb-2 sm:mb-4 opacity-95"
                  style={{
                    fontFamily: "'Pattaya', cursive",
                    fontSize: 'clamp(32px, 4vw, 48px)',
                    lineHeight: 1.2,
                  }}
                >
                  {img.title}
                </p>
                <p className="hidden sm:block text-[#2a3b2c] text-xs sm:text-sm opacity-85 leading-[1.6] max-w-[340px]">
                  {img.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('prev')}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-transparent border-2 border-[#2a3b2c] flex items-center justify-center text-[#2a3b2c] hover:scale-[1.08] hover:bg-[#2a3b2c]/10 transition-all duration-150"
            >
              <ArrowLeft size={26} strokeWidth={2.25} />
            </button>
            <button
              onClick={() => navigate('next')}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-transparent border-2 border-[#2a3b2c] flex items-center justify-center text-[#2a3b2c] hover:scale-[1.08] hover:bg-[#2a3b2c]/10 transition-all duration-150"
            >
              <ArrowRight size={26} strokeWidth={2.25} />
            </button>
          </div>
        </div>

        {/* Bottom-right link */}
        <div className="absolute bottom-6 right-4 sm:bottom-10 sm:right-12 lg:bottom-16 lg:right-20 z-[60]">
          <a
            href="#"
            className="group flex items-center text-[#2a3b2c] no-underline opacity-95 hover:opacity-100 transition-opacity duration-200"
            style={{
              fontFamily: "'Pattaya', cursive",
              fontSize: 'clamp(20px, 3vw, 36px)',
              fontWeight: 400,
              letterSpacing: '0.02em',
              lineHeight: 1,
            }}
          >
            Khám Phá Ngay
            <ArrowRight className="ml-2 w-5 h-5 sm:w-7 sm:h-7 group-hover:translate-x-2 transition-transform duration-300" strokeWidth={2.25} />
          </a>
        </div>
        
        {/* 3D Butterfly */}
        <Suspense fallback={null}>
          <Butterfly3D />
        </Suspense>
      </div>
    </div>
  );
}
