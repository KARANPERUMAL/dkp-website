import { Navbar } from './Navbar';
import { HeroSection } from './HeroSection';
import { HeroCurveBoundary, computeCurveState } from './HeroCurveBoundary';
import { WhyChooseUs } from './WhyChooseUs';
import { Footer } from './layout/Footer';
import { useHeroCurveReveal } from '../hooks/useHeroCurveReveal';
import { useNavigation } from '../context/NavigationContext';

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
          {/* New Why Choose Us Section with 5 Key Reasons */}
          <WhyChooseUs />
        </main>

        {/* Global Shared Footer */}
        <Footer />
      </div>
    </div>
  );
};
