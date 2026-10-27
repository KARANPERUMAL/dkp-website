import type { MouseEvent } from 'react';
import { motion } from 'framer-motion';
import { BackgroundRippleEffect } from './ui/background-ripple-effect';

interface HeroSectionProps {
  onCtaClick?: () => void;
}

export const HeroSection = ({ onCtaClick }: HeroSectionProps) => {
  const handleScrollToServices = (e: MouseEvent) => {
    e.preventDefault();
    if (onCtaClick) {
      onCtaClick();
    } else {
      const el = document.getElementById('services');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section
      id="home"
      className="relative w-full h-screen bg-[#050608] text-white pt-14 sm:pt-16 pb-0 overflow-hidden select-none flex flex-col justify-center"
    >
      {/* Background Ripple Effect: Interactive subtle ripple layer behind hero content */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-auto">
        <BackgroundRippleEffect rows={14} cols={32} cellSize={54} />
      </div>

      {/* Atmospheric Background Lighting */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
        {/* Warm amber / orange atmospheric glow behind right headline & CTA */}
        <div
          className="absolute right-[10%] top-[18%] w-[480px] h-[380px] sm:w-[600px] sm:h-[460px] rounded-full"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(235, 95, 15, 0.28) 0%, rgba(180, 60, 10, 0.12) 42%, rgba(140, 40, 5, 0.03) 68%, transparent 75%)',
            filter: 'blur(40px)',
          }}
        />

        {/* Charcoal & dark navy atmospheric fill on left */}
        <div
          className="absolute left-[6%] top-[22%] w-[460px] h-[360px] sm:w-[560px] sm:h-[420px] rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(32, 45, 68, 0.26) 0%, rgba(18, 24, 36, 0.10) 50%, transparent 70%)',
            filter: 'blur(50px)',
          }}
        />

        {/* Ambient warm bronze glow behind center-lower text */}
        <div
          className="absolute left-[36%] top-[40%] w-[360px] h-[260px] rounded-full"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(210, 90, 20, 0.14) 0%, transparent 68%)',
            filter: 'blur(40px)',
          }}
        />
      </div>

      {/* Main Content Container with Centered Composition */}
      <div className="relative z-10 w-full max-w-[1340px] mx-auto px-4 sm:px-8 lg:px-12 pt-0 pb-16 sm:pb-20">
        
        {/* Centered Hero Headline in a Ladder-Style Layout with Increased Vertical Spacing */}
        <div className="relative pt-1 pb-4 sm:pb-6 md:pb-8 w-full max-w-[1180px] mx-auto">
          
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center font-black tracking-[-0.04em] select-none w-full gap-4 sm:gap-6 md:gap-8 lg:gap-9"
          >
            {/* Line 1: We Don't Just (slightly narrower, centered at top of ladder) */}
            <motion.div
              initial={{ opacity: 0, filter: 'blur(10px)', y: 8 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(2.3rem,5.4vw,5.6rem)] leading-[0.90] transition-colors"
              style={{
                backgroundImage: 'linear-gradient(180deg, #384255 0%, #252b36 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              We Don't Just
            </motion.div>

            {/* Line 2: Market Your Brand — (wider middle tier of ladder with increased vertical gap) */}
            <motion.div
              initial={{ opacity: 0, filter: 'blur(10px)', y: 8 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(3.1rem,7.8vw,8.2rem)] leading-[0.88] tracking-[-0.045em] transition-colors"
              style={{
                backgroundImage:
                  'linear-gradient(92deg, #28303e 0%, #353f50 40%, #463730 70%, #56372b 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Market Your Brand —
            </motion.div>

            {/* Line 3: We Build It. (balanced base beneath them, sitting naturally lower) */}
            <motion.div
              initial={{ opacity: 0, filter: 'blur(10px)', y: 8 }}
              animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
              transition={{ duration: 0.6, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(3.8rem,9.6vw,10.2rem)] leading-[0.86] tracking-[-0.05em] transition-colors"
              style={{
                backgroundImage:
                  'linear-gradient(92deg, #242a36 0%, #333235 35%, #4c372f 65%, #3c2c2c 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              We Build It.
            </motion.div>
          </motion.div>

          {/* Position the orange circular CTA between lines 2 and 3 on the center-right (z-30 ensures visibility) */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 280,
              damping: 22,
              delay: 0.32,
            }}
            className="absolute z-30 top-[43%] sm:top-[44%] md:top-[45%] lg:top-[46%] right-[6%] sm:right-[10%] md:right-[14%] lg:right-[16%]"
          >
            <a
              href="#services"
              onClick={handleScrollToServices}
              aria-label="View Our Services"
              className="group relative flex flex-col items-center justify-center w-[96px] h-[96px] sm:w-[108px] sm:h-[108px] md:w-[116px] md:h-[116px] lg:w-[120px] lg:h-[120px] rounded-full text-white cursor-pointer select-none transition-transform duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-orange-400/50"
              style={{
                background:
                  'radial-gradient(circle at 35% 30%, #ff8326 0%, #fa5a00 50%, #d83d00 95%)',
                boxShadow:
                  '0 14px 34px rgba(234, 79, 0, 0.48), 0 4px 10px rgba(0, 0, 0, 0.4), inset 0 2px 3px rgba(255, 255, 255, 0.5)',
              }}
            >
              {/* Subtle top specular sheen */}
              <div
                className="absolute top-1 left-2.5 right-2.5 h-[45%] rounded-t-full pointer-events-none opacity-30"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 100%)',
                }}
              />

              {/* Button text */}
              <div className="relative z-10 flex flex-col items-center text-center px-1">
                <span className="text-[18px] sm:text-[20px] md:text-[22px] font-black lowercase tracking-tight leading-none group-hover:scale-105 transition-transform duration-200">
                  view
                </span>
                <span className="text-[9px] sm:text-[10px] md:text-[10.5px] font-extrabold uppercase tracking-wider mt-0.5 sm:mt-1 text-white/95 leading-tight">
                  OUR SERVICES
                </span>
              </div>
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
