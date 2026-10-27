import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { HeroCurveBoundary, computeCurveState } from './HeroCurveBoundary';
import { TeamStack, defaultDkpServices } from './unlumen-ui/team-stack';
import { WhyChooseUs } from './WhyChooseUs';
import { Footer } from './layout/Footer';
import { useHeroCurveReveal } from '../hooks/useHeroCurveReveal';
import { useNavigation } from '../context/NavigationContext';
import { IconArrowRight } from '@tabler/icons-react';

export const HomePage = () => {
  const { progress, isComplete } = useHeroCurveReveal();
  const { navigateTo } = useNavigation();

  // Compute curve state from synchronized scroll reveal progress
  const curveState = computeCurveState(progress);
  const headXPercent = (curveState.headX / 1440) * 100;

  return (
    <div className="relative min-h-screen bg-[#050608] text-neutral-900 flex flex-col w-full selection:bg-orange-500 selection:text-white">
      {/* Floating Centered Navbar & Header Logo (fixed z-50 at top) */}
      <Navbar />

      {/* PINNED DARK HERO VIEWPORT: Remains fixed at top while white section scrolls up over it */}
      <div className="sticky top-0 h-screen w-full z-0 overflow-hidden bg-[#050608] pointer-events-auto">
        <HeroSection onCtaClick={() => navigateTo('services')} />
      </div>

      {/* SCROLLING WHITE SECTION: Starts across bottom of viewport and moves upward over the dark hero */}
      <div className="relative z-20 w-full -mt-[25vh] sm:-mt-[27vh] md:-mt-[29vh]">
        {/* Top Boundary: Single continuous smooth curve with cinematic light reveal (bottom-right to top-left) */}
        <HeroCurveBoundary
          revealProgress={progress}
          isComplete={isComplete}
        />

        {/* White Content Section: Revealed from bottom-right toward top-left, flush under curve SVG (-mt-[1px]) */}
        <main
          id="main-content"
          style={{
            clipPath: isComplete
              ? undefined
              : `polygon(${headXPercent.toFixed(2)}% 0, 100% 0, 100% 100%, ${headXPercent.toFixed(2)}% 100%)`,
          }}
          className="relative w-full bg-white transition-none -mt-[1px]"
        >
          {/* Integrated Digital Solutions — Creativity Meets Strategy (TeamStack) */}
          <section className="w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-12 bg-white border-b border-neutral-200/80 overflow-x-clip">
            <div className="max-w-[1240px] mx-auto">
              <TeamStack
                eyebrow="Integrated Digital Solutions"
                title="Creativity Meets Strategy"
                description="At DKP Innovation, we believe lasting market impact requires both analytical rigor and distinctive creative execution. By uniting five foundational capabilities under one roof, we eliminate fragmented communication and ensure cohesive brand growth."
                items={defaultDkpServices}
                defaultActiveIndex={0}
                onCardClick={(card) => {
                  if (card.slug) {
                    navigateTo('services', card.slug);
                  } else {
                    navigateTo('services');
                  }
                }}
              />

              {/* Global CTA linking to all specialized services */}
              <div className="mt-8 sm:mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => navigateTo('services')}
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-full text-xs sm:text-sm font-semibold text-neutral-900 bg-neutral-100 hover:bg-orange-500 hover:text-white border border-neutral-200/80 transition-all duration-300 shadow-sm cursor-pointer group"
                >
                  <span>Explore All 19 Specialized Services</span>
                  <IconArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </section>

          {/* New Why Choose Us Section with 5 Key Reasons */}
          <WhyChooseUs />
        </main>

        {/* Global Shared Footer */}
        <Footer />
      </div>
    </div>
  );
};
