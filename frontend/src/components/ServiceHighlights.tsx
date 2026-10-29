import { ArrowRight } from 'lucide-react';
import { useNavigation } from '../context/NavigationContext';
import { TeamStack, type TeamCardItem } from './unlumen-ui/team-stack';

export const ServiceHighlights = () => {
  const { navigateTo } = useNavigation();

  const handleCardClick = (card: TeamCardItem) => {
    if (card.slug) {
      navigateTo('services', card.slug);
    } else {
      navigateTo('services');
    }
  };

  return (
    <section
      id="services"
      aria-label="Creativity Meets Strategy - DKP Innovation Services"
      className="relative w-full bg-white pt-12 pb-16 sm:pt-16 sm:pb-20 overflow-hidden border-t border-neutral-100 scroll-mt-24"
    >
      <div className="max-w-[1240px] mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Header: Creativity Meets Strategy */}
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <span className="text-xs font-bold text-[#854D0E] uppercase tracking-wider mb-2.5 block">
            Integrated Digital Solutions
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight mb-4">
            Creativity Meets Strategy
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
            At DKP Innovation, we unite scalable engineering, cinematic creative production, high-intent digital marketing, and prestige brand stature to build industry-defining market leaders.
          </p>
        </div>

        {/* Interactive TeamStack Deck */}
        <TeamStack onCardClick={handleCardClick} />

        {/* Global CTA to View All Detailed Services */}
        <div className="mt-6 sm:mt-8 flex justify-center">
          <button
            onClick={() => navigateTo('services')}
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-neutral-900 bg-neutral-100 hover:bg-[#FFD60A] hover:text-[#002244] border border-neutral-200/80 hover:border-[#FFD60A] transition-all duration-300 shadow-sm cursor-pointer group"
          >
            <span>Explore All 19 Specialized Services</span>
            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </section>
  );
};

export const CreativityMeetsStrategy = ServiceHighlights;
export default ServiceHighlights;
