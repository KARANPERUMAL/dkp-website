import React from 'react';
import { motion } from 'framer-motion';
import { TiltCard } from '@/components/ui/tilt-card';
import { ClippedCircle } from '@/components/ui/clipped-circle';
import type { ServiceItem } from '../data/servicesData';
import { IconMessageDots, IconChevronRight } from '@tabler/icons-react';

interface ServiceCardProps {
  service: ServiceItem;
  categoryIndex: number;
  serviceIndex: number;
  onEnquire: (serviceName: string) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  serviceIndex,
  onEnquire,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
      whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.5, delay: serviceIndex * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="w-full flex"
    >
      <TiltCard
        title={service.name}
        description={service.description}
        circleSize={280}
        circleClassName="bg-[#000122]"
        className="h-full flex flex-col justify-between select-none bg-white border border-neutral-200/90 hover:border-[#FFD60A] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
      >
        {/* REGION 1: Isolated Service Image Container — outside the hover effect layer, completely untouched */}
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-neutral-100 select-none">
          <img
            src={service.image}
            alt={service.alt}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* REGION 2: Text/Content Container — isolated from image, contains the localized circular hover reveal */}
        <div className="relative flex-1 flex flex-col justify-between overflow-hidden bg-white">
          {/* CLIPPED OVERLAY: attached directly to text/content container so circle coordinates and clipping are strictly bounded */}
          <ClippedCircle
            circleSize={280}
            circleClassName="bg-[#000122]"
            className="z-20"
          >
            {/* Synchronized duplicate containing ONLY the text/content area */}
            <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between h-full bg-[#000122] select-none pointer-events-none">
              <div>
                {/* Category Label: DKP yellow accent */}
                <div className="text-[11px] font-bold text-[#FFD60A] uppercase tracking-wider mb-1.5">
                  {service.category}
                </div>

                {/* Service Heading: DKP yellow brand color */}
                <h3 className="text-base sm:text-lg font-bold text-[#FFD60A] leading-snug mb-2">
                  {service.name}
                </h3>

                {/* Description: High-contrast white/light-gray */}
                <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Action Button: Dark theme visual counterpart */}
              <div className="pt-3">
                <div
                  tabIndex={-1}
                  aria-hidden="true"
                  className="w-full inline-flex items-center justify-center space-x-1.5 py-2.5 px-4 rounded-lg bg-white/10 text-white font-semibold text-xs border border-white/20 select-none pointer-events-none"
                >
                  <IconMessageDots className="w-3.5 h-3.5 text-[#FFD60A]" />
                  <span>Enquire About Service</span>
                  <IconChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                </div>
              </div>
            </div>
          </ClippedCircle>

          {/* BASE CONTENT: original light theme with dark headings and text */}
          <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between relative z-10 bg-white">
            <div>
              {/* Category Label: DKP brand color */}
              <div className="text-[11px] font-bold text-[#854D0E] uppercase tracking-wider mb-1.5">
                {service.category}
              </div>

              {/* Service Heading: Clean dark neutral */}
              <h3 className="text-base sm:text-lg font-bold text-neutral-900 group-hover:text-neutral-950 transition-colors leading-snug mb-2">
                {service.name}
              </h3>

              {/* Description: Readable dark-gray copy */}
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                {service.description}
              </p>
            </div>

            {/* Primary Action Button: Light theme styling, interactive & focusable */}
            <div className="pt-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEnquire(service.name);
                }}
                className="w-full relative z-10 inline-flex items-center justify-center space-x-1.5 py-2.5 px-4 rounded-lg bg-neutral-50 hover:bg-[#FFD60A] text-neutral-800 hover:text-[#000122] font-semibold text-xs border border-neutral-200/90 hover:border-[#FFD60A] focus:outline-none focus:ring-2 focus:ring-[#FFD60A]/50 transition-all cursor-pointer group/btn pointer-events-auto"
              >
                <IconMessageDots className="w-3.5 h-3.5 text-[#854D0E] group-hover/btn:text-[#000122]" />
                <span>Enquire About Service</span>
                <IconChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover/btn:text-[#000122] group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </TiltCard>
    </motion.div>
  );
};