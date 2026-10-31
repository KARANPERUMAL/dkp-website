import { motion } from 'framer-motion';
import { useNavigation } from '../hooks/useNavigation';
import { Navbar } from './Navbar';
import { Footer } from './layout/Footer';
import { ArrowLeft, Compass, PhoneCall } from 'lucide-react';

export const NotFoundPage = () => {
  const { navigateTo } = useNavigation();

  return (
    <div className="min-h-screen bg-[#004D86] text-white flex flex-col justify-between selection:bg-[#FFD60A] selection:text-[#002244]">
      {/* Top Navigation */}
      <Navbar />

      {/* Main 404 Hero Section */}
      <main
        id="main-content"
        className="relative flex-grow flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-32 pb-24 overflow-hidden"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% 35%, #005E9E 0%, #004D86 60%, #003E6D 100%)',
        }}
      >
        {/* Subtle Ambient Glows */}
        <div
          className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[360px] rounded-full pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse at center, rgba(255, 214, 10, 0.12) 0%, rgba(255, 214, 10, 0.03) 50%, transparent 75%)',
            filter: 'blur(50px)',
          }}
        />

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[#FFD60A] font-semibold text-sm mb-6"
          >
            <span>Error 404</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD60A]" />
            <span className="text-white/80">Page Not Found</span>
          </motion.div>

          {/* Large Numerical Indicator */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-7xl sm:text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white/90 to-white/40 tracking-tight leading-none mb-4"
          >
            404
          </motion.h1>

          {/* Subheading & Explanation */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-2xl sm:text-3xl font-bold text-white mb-4"
          >
            Looking for something in the digital space?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-base sm:text-lg text-slate-200 max-w-xl mx-auto mb-10 leading-relaxed"
          >
            The link you followed may be broken or the page may have been moved. Let's get you back to our core digital services, brand architecture, and creative studio portfolios.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <button
              type="button"
              onClick={() => navigateTo('home')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FFD60A] text-[#002244] font-bold text-base shadow-lg shadow-[#FFD60A]/20 hover:bg-[#ffe14d] active:scale-95 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Return to Home</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('services')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 border border-white/20 text-white font-semibold text-base transition-all cursor-pointer"
            >
              <Compass className="w-5 h-5 text-[#FFD60A]" />
              <span>Explore Services</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('contact')}
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 border border-white/20 text-white font-semibold text-base transition-all cursor-pointer"
            >
              <PhoneCall className="w-5 h-5 text-[#FFD60A]" />
              <span>Contact Us</span>
            </button>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
