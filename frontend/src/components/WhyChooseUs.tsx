import { motion } from 'framer-motion';
import { useNavigation } from '../context/NavigationContext';
import { IconArrowRight } from '@tabler/icons-react';
import {
  StackedFeatureCards,
  defaultWhyChooseUsCards,
} from '@/components/unlumen-ui/stacked-feature-cards';

export const WhyChooseUs = () => {
  const { navigateTo } = useNavigation();

  return (
    <section id="why-choose-us" className="relative w-full bg-white text-neutral-900 pt-6 pb-12 sm:pt-8 sm:pb-16 overflow-x-clip">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Header: Magnifying Glass Graphic + Eyebrow, Heading, and Supporting Copy */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-5 sm:space-y-0 sm:space-x-6 lg:space-x-8 max-w-5xl mb-12 sm:mb-14">
          
          {/* Magnifying Glass Brand Graphic (preserved icon placement) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex-shrink-0 relative group cursor-pointer sm:pl-4 md:pl-6"
          >
            {/* Ground shadow */}
            <div
              className="absolute -bottom-1 left-7 right-4 h-5 rounded-full opacity-25 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, transparent 72%)',
                filter: 'blur(5px)',
              }}
            />

            {/* High-fidelity SVG Magnifying Glass */}
            <svg
              width="110"
              height="110"
              viewBox="0 0 130 130"
              className="w-[96px] h-[96px] sm:w-[104px] sm:h-[104px] filter drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
            >
              <defs>
                <linearGradient id="chromeRimWhy" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="20%" stopColor="#cbd5e1" />
                  <stop offset="45%" stopColor="#94a3b8" />
                  <stop offset="70%" stopColor="#e2e8f0" />
                  <stop offset="90%" stopColor="#64748b" />
                  <stop offset="100%" stopColor="#f1f5f9" />
                </linearGradient>
                <radialGradient id="innerLensBevelWhy" cx="45%" cy="45%" r="50%">
                  <stop offset="75%" stopColor="#ffffff" stopOpacity="0" />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#475569" stopOpacity="0.75" />
                </radialGradient>
                <linearGradient id="lensGlareWhy" x1="0%" y1="0%" x2="70%" y2="70%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
                  <stop offset="35%" stopColor="#ffffff" stopOpacity="0.15" />
                  <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="dkpOrangeWhy" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff7e1e" />
                  <stop offset="60%" stopColor="#f05400" />
                  <stop offset="100%" stopColor="#c73800" />
                </linearGradient>
                <linearGradient id="handleFerruleWhy" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e2e8f0" />
                  <stop offset="50%" stopColor="#64748b" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>
                <linearGradient id="handleGradientWhy" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#252932" />
                  <stop offset="35%" stopColor="#12141a" />
                  <stop offset="75%" stopColor="#0a0c10" />
                  <stop offset="100%" stopColor="#1e222a" />
                </linearGradient>
              </defs>

              {/* Handle */}
              <g id="handleWhy">
                <rect
                  x="78"
                  y="78"
                  width="10"
                  height="9"
                  rx="1.5"
                  transform="rotate(45 78 78)"
                  fill="url(#handleFerruleWhy)"
                  stroke="#475569"
                  strokeWidth="0.6"
                />
                <rect
                  x="85"
                  y="83"
                  width="9"
                  height="34"
                  rx="4.5"
                  transform="rotate(45 85 83)"
                  fill="url(#handleGradientWhy)"
                  stroke="#0f172a"
                  strokeWidth="0.8"
                />
                <line
                  x1="88"
                  y1="86"
                  x2="110"
                  y2="108"
                  stroke="#64748b"
                  strokeWidth="1"
                  strokeLinecap="round"
                  opacity="0.6"
                />
              </g>

              {/* Lens Outer Rim */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="url(#chromeRimWhy)"
                strokeWidth="6.5"
                strokeLinecap="round"
                filter="drop-shadow(0 3px 5px rgba(0,0,0,0.15))"
              />
              <circle
                cx="50"
                cy="50"
                r="34.5"
                fill="none"
                stroke="#ffffff"
                strokeWidth="0.8"
                opacity="0.85"
              />
              <circle cx="50" cy="50" r="34" fill="#ffffff" />

              {/* Monogram inside lens */}
              <g transform="translate(50 50) scale(0.82)">
                <path
                  d="M -16 -20 C -16 -20, 10 -22, 17 -11 C 24 1, 23 15, 12 21 C 2 26, -16 22, -16 22 C -16 22, -8 15, -4 14 C 7 12, 12 2, 8 -6 C 4 -14, -8 -13, -16 -20 Z"
                  fill="url(#dkpOrangeWhy)"
                  filter="drop-shadow(0 1.5px 2.5px rgba(234, 79, 0, 0.35))"
                />
                <path
                  d="M -20 -4 C -12 -5, 4 -2, 14 7 C 8 7, -4 2, -12 4 C -18 6, -20 -4, -20 -4 Z"
                  fill="#ff9944"
                  opacity="0.95"
                />
              </g>

              <circle cx="50" cy="50" r="34" fill="url(#innerLensBevelWhy)" pointerEvents="none" />
              <path
                d="M 24 35 C 29 22, 42 19, 56 20 C 44 22, 32 28, 24 35 Z"
                fill="url(#lensGlareWhy)"
                pointerEvents="none"
              />
              <ellipse
                cx="35"
                cy="30"
                rx="11"
                ry="5"
                transform="rotate(-35 35 30)"
                fill="#ffffff"
                opacity="0.45"
                pointerEvents="none"
              />
            </svg>
          </motion.div>

          {/* Eyebrow, Heading, and Supporting Copy */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 text-center sm:text-left pt-1"
          >
            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2 block">
              WHY CHOOSE US
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#1a1e26] tracking-tight leading-snug mb-3">
              Your Growth Deserves{' '}
              <span className="text-orange-600">More Than Ordinary</span> Marketing.
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 font-normal leading-relaxed max-w-2xl">
              We combine tailored strategy, creative expertise and practical execution to help your business build a stronger brand presence and pursue meaningful growth.
            </p>
          </motion.div>

        </div>

        {/* Stacked Feature Cards Component replacing the five-card grid */}
        <StackedFeatureCards cards={defaultWhyChooseUsCards} className="max-w-4xl mx-auto" />

        {/* Dedicated Discuss Your Project Action Card (Preserved static outside stacking animation) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.45 }}
          className="mt-8 sm:mt-12 bg-gradient-to-br from-[#0c0e14] to-[#181d28] text-white rounded-2xl p-6 sm:p-8 border border-neutral-800 shadow-xl max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="flex-1 text-center sm:text-left">
            <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider mb-2 block">
              Start Your Partnership
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-snug">
              Ready to Build Your Brand?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl">
              Connect with our team to discuss customized strategies tailored to your timeline and objectives.
            </p>
          </div>
          <div className="flex-shrink-0 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => navigateTo('contact', 'enquiry-form')}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 py-3 px-6 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer group/cta"
            >
              <span>Discuss Your Project</span>
              <IconArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </motion.div>

        {/* Subtle bottom divider */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-neutral-200/80 to-transparent" />

      </div>
    </section>
  );
};
