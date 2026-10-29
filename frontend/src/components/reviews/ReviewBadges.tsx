import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { IconArrowUpRight } from '@tabler/icons-react';
import { reviewsData, type ReviewPlatformData } from '../../data/reviewsData';

const GoogleLogo = () => (
  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
    />
  </svg>
);

const JustdialLogo = () => (
  <div
    className="w-4 h-4 rounded-md bg-[#FF5A00] flex items-center justify-center font-black text-white text-[9px] leading-none tracking-tight select-none shadow-sm shrink-0"
    aria-hidden="true"
  >
    Jd
  </div>
);

const FiveYellowStars = () => (
  <div className="flex items-center space-x-0.5 shrink-0" aria-hidden="true">
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-[#FFD60A] text-[#FFD60A]"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))}
  </div>
);

export interface ReviewBadgeCardProps {
  data: ReviewPlatformData;
  logo: React.ReactNode;
  className?: string;
}

export const ReviewBadgeCard = ({ data, logo, className }: ReviewBadgeCardProps) => {
  return (
    <a
      href={data.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={data.ariaLabel}
      className={`group relative flex items-center justify-between gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-[#003E6D] hover:bg-[#00345C] border border-white/20 hover:border-[#FFD60A]/70 transition-all duration-300 shadow-sm hover:shadow-[0_4px_16px_rgba(255,214,10,0.2)] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD60A] cursor-pointer min-w-0 w-full ${className || ''}`}
    >
      {/* Platform Logo */}
      <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-white/[0.1] border border-white/20 flex items-center justify-center shrink-0 group-hover:bg-white/[0.18] transition-colors">
        {logo}
      </div>

      {/* Platform Info & Star Rating */}
      <div className="flex flex-col text-left min-w-0 flex-1 overflow-hidden">
        <div className="flex items-center gap-1 min-w-0">
          <span className="text-[11px] sm:text-xs font-bold text-white tracking-tight leading-tight truncate group-hover:text-[#FFD60A] transition-colors">
            {data.platformName}
          </span>
          {data.rating && (
            <span className="text-[9px] font-black text-[#FFD60A] bg-[#FFD60A]/10 px-1 py-0.5 rounded border border-[#FFD60A]/20 leading-none shrink-0">
              {data.rating}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 mt-0.5 min-w-0">
          <FiveYellowStars />
          <span className="text-[10px] text-blue-100 font-medium truncate leading-none">
            {data.reviewCount ? data.reviewCount : data.actionText}
          </span>
        </div>
      </div>

      {/* External Link Indicator */}
      <div className="shrink-0 text-white/70 group-hover:text-[#FFD60A] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200">
        <IconArrowUpRight className="w-3 h-3" />
      </div>
    </a>
  );
};

export interface ReviewBadgesProps {
  className?: string;
}

export const ReviewBadges = ({ className }: ReviewBadgesProps = {}) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{
        duration: prefersReducedMotion ? 0.05 : 0.35,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`grid grid-cols-1 min-[340px]:grid-cols-2 gap-2 sm:gap-2.5 w-full max-w-[360px] min-w-0 ${className || ''}`}
    >
      <ReviewBadgeCard data={reviewsData.google} logo={<GoogleLogo />} />
      <ReviewBadgeCard data={reviewsData.justdial} logo={<JustdialLogo />} />
    </motion.div>
  );
};
