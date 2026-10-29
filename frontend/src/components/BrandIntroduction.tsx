import { motion } from 'framer-motion';

export const BrandIntroduction = () => {
  return (
    <section id="about" className="relative w-full bg-white text-neutral-900 pt-3 pb-1 sm:pt-4 sm:pb-2 overflow-hidden">
      {/* Widened container matching reference proportions (content aligned closer to left) */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Main Introduction Row: Magnifying Glass Graphic + Introduction Typography */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6 lg:space-x-8 max-w-4xl">
          
          {/* Magnifying Glass Brand Graphic (aligned toward the left edge of container) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex-shrink-0 relative group cursor-pointer sm:pl-16 md:pl-[104px]"
          >
            {/* Soft ground drop shadow matching reference */}
            <div
              className="absolute -bottom-1 left-7 right-4 h-5 rounded-full opacity-25 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, rgba(0,0,0,0.4) 0%, transparent 72%)',
                filter: 'blur(5px)',
              }}
            />

            {/* High-fidelity SVG Magnifying Glass (110x110px canvas) */}
            <svg
              width="120"
              height="120"
              viewBox="0 0 130 130"
              className="w-[102px] h-[102px] sm:w-[110px] sm:h-[110px] filter drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
            >
              <defs>
                {/* Metallic Chrome Rim Gradient */}
                <linearGradient id="chromeRim" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f8fafc" />
                  <stop offset="20%" stopColor="#cbd5e1" />
                  <stop offset="45%" stopColor="#94a3b8" />
                  <stop offset="70%" stopColor="#e2e8f0" />
                  <stop offset="90%" stopColor="#64748b" />
                  <stop offset="100%" stopColor="#f1f5f9" />
                </linearGradient>

                {/* Inner Bevel Shadow Gradient */}
                <radialGradient id="innerLensBevel" cx="45%" cy="45%" r="50%">
                  <stop offset="75%" stopColor="#ffffff" stopOpacity="0" />
                  <stop offset="95%" stopColor="#94a3b8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#475569" stopOpacity="0.75" />
                </radialGradient>

                {/* Lens Glass Glare */}
                <linearGradient id="lensGlare" x1="0%" y1="0%" x2="70%" y2="70%">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
                  <stop offset="35%" stopColor="#ffffff" stopOpacity="0.15" />
                  <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>

                {/* Orange DKP Monogram Gradient */}
                <linearGradient id="dkpOrange" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ff7e1e" />
                  <stop offset="60%" stopColor="#f05400" />
                  <stop offset="100%" stopColor="#c73800" />
                </linearGradient>

                {/* Handle Metallic Ferrule */}
                <linearGradient id="handleFerrule" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e2e8f0" />
                  <stop offset="50%" stopColor="#64748b" />
                  <stop offset="100%" stopColor="#cbd5e1" />
                </linearGradient>

                {/* Handle Texture */}
                <linearGradient id="handleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#252932" />
                  <stop offset="35%" stopColor="#12141a" />
                  <stop offset="75%" stopColor="#0a0c10" />
                  <stop offset="100%" stopColor="#1e222a" />
                </linearGradient>
              </defs>

              {/* Handle (Angled down-right at ~45 degrees) */}
              <g id="handle">
                {/* Ferrule / metal joint */}
                <rect
                  x="78"
                  y="78"
                  width="10"
                  height="9"
                  rx="1.5"
                  transform="rotate(45 78 78)"
                  fill="url(#handleFerrule)"
                  stroke="#475569"
                  strokeWidth="0.6"
                />

                {/* Main grip handle */}
                <rect
                  x="85"
                  y="83"
                  width="9"
                  height="34"
                  rx="4.5"
                  transform="rotate(45 85 83)"
                  fill="url(#handleGradient)"
                  stroke="#0f172a"
                  strokeWidth="0.8"
                />

                {/* Subtle handle specular highlight reflection */}
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

              {/* Lens Outer Metallic Rim */}
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="url(#chromeRim)"
                strokeWidth="6.5"
                strokeLinecap="round"
                filter="drop-shadow(0 3px 5px rgba(0,0,0,0.15))"
              />

              {/* Inner Rim Highlight Ring */}
              <circle
                cx="50"
                cy="50"
                r="34.5"
                fill="none"
                stroke="#ffffff"
                strokeWidth="0.8"
                opacity="0.85"
              />

              {/* Lens Glass Base */}
              <circle
                cx="50"
                cy="50"
                r="34"
                fill="#ffffff"
              />

              {/* Original DKP Stylized Dynamic Monogram inside Lens */}
              <g id="dkpMark" transform="translate(50 50) scale(0.82)">
                <path
                  d="M -16 -20 C -16 -20, 10 -22, 17 -11 C 24 1, 23 15, 12 21 C 2 26, -16 22, -16 22 C -16 22, -8 15, -4 14 C 7 12, 12 2, 8 -6 C 4 -14, -8 -13, -16 -20 Z"
                  fill="url(#dkpOrange)"
                  filter="drop-shadow(0 1.5px 2.5px rgba(234, 79, 0, 0.35))"
                />
                <path
                  d="M -20 -4 C -12 -5, 4 -2, 14 7 C 8 7, -4 2, -12 4 C -18 6, -20 -4, -20 -4 Z"
                  fill="#ff9944"
                  opacity="0.95"
                />
              </g>

              {/* Inner Rim Bevel Shadow */}
              <circle
                cx="50"
                cy="50"
                r="34"
                fill="url(#innerLensBevel)"
                pointerEvents="none"
              />

              {/* Lens Glare Reflection (diagonal crescent shine across upper-left) */}
              <path
                d="M 24 35 C 29 22, 42 19, 56 20 C 44 22, 32 28, 24 35 Z"
                fill="url(#lensGlare)"
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

          {/* Introduction Headline & Supporting Copy */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex-1 text-center sm:text-left pt-1.5 sm:pt-2"
          >
            {/* Primary Headline matching reference typography */}
            <h2 className="text-[21px] sm:text-[23px] md:text-[25px] font-normal tracking-tight text-[#22262e] leading-snug">
              <span className="text-[#854D0E] font-bold">We</span>{' '}
              <span className="font-normal text-[#272b34]">
                build brands that stand out.
              </span>
            </h2>

            {/* Supporting Copy */}
            <p className="mt-1.5 sm:mt-2 text-[13px] sm:text-[14px] text-[#717784] font-normal leading-relaxed max-w-2xl">
              From digital strategy and website development to creative production and
              brand growth, we help businesses create a stronger presence.
            </p>
          </motion.div>

        </div>

        {/* Soft horizontal divider/shadow below introduction */}
        <div className="mt-5 sm:mt-6 mb-3 sm:mb-4 w-full h-[1px] bg-gradient-to-r from-transparent via-neutral-200/80 to-transparent shadow-[0_1px_2px_rgba(0,0,0,0.03)]" />

      </div>
    </section>
  );
};
