import { useState, useRef } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './layout/Footer';
import { useNavigation } from '../hooks/useNavigation';
import { OFFICIAL_PHONE, OFFICIAL_PHONE_TEL } from '../data/branchesData';
import { TextAnimationBlurFadeIn, BlurFadeIn } from '@/components/ui/text-animation-blur-fade-in';
import {
  HeartHandshake,
  BookOpen,
  ShieldCheck,
  Users,
  Phone,
  AlertCircle,
  RotateCcw,
  CheckCircle2,
  Video as VideoIcon,
} from 'lucide-react';

interface FoundationVideoCardProps {
  id: string;
  src: string;
  title: string;
  badge: string;
  description: string;
  tags: string[];
}

const FoundationVideoCard = ({
  src,
  title,
  badge,
  description,
  tags,
}: FoundationVideoCardProps) => {
  const [hasError, setHasError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleRetry = () => {
    setHasError(false);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-neutral-200 hover:border-amber-400 transition-all duration-300 shadow-md hover:shadow-xl overflow-hidden">
      {/* Video Container */}
      <div className="relative w-full aspect-video bg-neutral-900 overflow-hidden border-b border-neutral-200">
        {hasError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-neutral-100 text-neutral-800">
            <AlertCircle className="w-10 h-10 text-amber-500 mb-3" />
            <h4 className="text-base font-bold text-neutral-900 mb-1">Video Unavailable</h4>
            <p className="text-xs text-neutral-600 max-w-sm mb-4 leading-relaxed">
              We couldn&apos;t load this video preview in your browser. Please check your connection or contact our team.
            </p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#004D86] hover:bg-[#003E6D] text-xs font-semibold text-white transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Video</span>
            </button>
          </div>
        ) : (
          <video
            ref={videoRef}
            src={src}
            controls
            playsInline
            preload="metadata"
            onError={() => setHasError(true)}
            aria-label={title}
            className="w-full h-full object-cover"
          >
            Your browser does not support the video tag.
          </video>
        )}

        {/* Category Pill Tag Overlay */}
        <div className="absolute top-3 left-3 pointer-events-none z-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#004D86]/90 border border-white/20 text-[11px] font-semibold text-[#FFD60A] backdrop-blur-md shadow-sm">
            <VideoIcon className="w-3 h-3 text-[#FFD60A]" />
            {badge}
          </span>
        </div>
      </div>

      {/* Details Box */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between bg-white">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2 group-hover:text-amber-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-neutral-600 leading-relaxed mb-4">
            {description}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-neutral-100">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[11px] font-medium px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export const FoundationPage = () => {
  const { navigateTo } = useNavigation();

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col w-full selection:bg-[#FFD60A] selection:text-[#002244]">
      {/* Floating Centered Navigation */}
      <Navbar />

      <main className="flex-grow w-full bg-white">
        {/* =========================================================================
            SECTION A — FOUNDATION HERO
            ========================================================================= */}
        <section
          id="hero"
          className="relative w-full bg-[#004D86] text-white pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-8 lg:px-12 overflow-hidden select-none border-b border-white/20"
        >
          {/* Ambient Lighting Gradients */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute left-1/2 -top-[12%] -translate-x-1/2 w-[720px] h-[400px] rounded-full"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(255, 214, 10, 0.16) 0%, rgba(255, 214, 10, 0.05) 45%, transparent 70%)',
                filter: 'blur(55px)',
              }}
            />
            <div
              className="absolute right-[8%] top-[25%] w-[420px] h-[320px] rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(30, 41, 59, 0.28) 0%, transparent 70%)',
                filter: 'blur(50px)',
              }}
            />
          </div>

          <div className="relative z-10 max-w-[1240px] mx-auto text-center flex flex-col items-center">
            {/* Category / Organizational Positioning Eyebrow */}
            <span className="text-xs font-bold text-[#FFD60A] uppercase tracking-widest mb-3 block">
              Community Welfare Initiative by DKP Innovations
            </span>

            {/* Main Page Title / Visible Heading */}
            <TextAnimationBlurFadeIn
              as="h1"
              delay={0.1}
              staggerDuration={0.03}
              duration={0.6}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#FFFFFF] leading-[1.1] mb-4 sm:mb-6 max-w-4xl mx-auto"
            >
              DKP Foundation
            </TextAnimationBlurFadeIn>

            {/* Tagline Subtitle */}
            <TextAnimationBlurFadeIn
              as="p"
              delay={0.22}
              duration={0.5}
              className="text-lg sm:text-xl md:text-2xl font-semibold text-white mb-6 max-w-2xl mx-auto"
            >
              Empowering Communities. Cultivating Hope.
            </TextAnimationBlurFadeIn>

            {/* Intro Copy */}
            <TextAnimationBlurFadeIn
              as="p"
              delay={0.34}
              duration={0.5}
              className="text-base sm:text-lg text-neutral-300 font-normal max-w-2xl sm:max-w-3xl mx-auto mb-10 leading-relaxed"
            >
              DKP Foundation is a community welfare initiative operated under DKP Innovations, focused on supporting people and creating meaningful social impact through grassroots assistance, community engagement, and youth empowerment.
            </TextAnimationBlurFadeIn>

            {/* Dual CTAs with Blur-and-Fade Reveal */}
            <BlurFadeIn
              delay={0.46}
              duration={0.5}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
            >
              <a
                href={OFFICIAL_PHONE_TEL}
                aria-label={`Call DKP Foundation at ${OFFICIAL_PHONE}`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#FFD60A] hover:bg-[#FFE043] text-[#002244] font-bold text-sm tracking-wide shadow-[0_4px_24px_rgba(255,214,10,0.35)] hover:shadow-[0_6px_28px_rgba(255,214,10,0.5)] transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Phone className="w-4 h-4 text-[#002244]" />
                <span>{OFFICIAL_PHONE}</span>
              </a>

              <button
                onClick={() => navigateTo('services')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/15 font-semibold text-sm tracking-wide transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer backdrop-blur-sm shadow-xs"
              >
                <span>Explore Our Services</span>
              </button>
            </BlurFadeIn>
          </div>
        </section>

        {/* =========================================================================
            SECTION B — SOCIAL INITIATIVES
            ========================================================================= */}
        <section
          id="initiatives"
          className="relative w-full py-16 sm:py-20 md:py-24 px-4 sm:px-8 lg:px-12 bg-white border-b border-neutral-200/80"
        >
          <div className="max-w-[1240px] mx-auto">
            {/* Section Header with Blur-and-Fade Reveal */}
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <TextAnimationBlurFadeIn
                as="h2"
                delay={0.15}
                duration={0.5}
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight mb-4"
              >
                Core Social Initiatives
              </TextAnimationBlurFadeIn>
              <TextAnimationBlurFadeIn
                as="p"
                delay={0.25}
                duration={0.5}
                className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal"
              >
                Through DKP Innovations' dedicated community outreach, we plan and carry out direct assistance programs to support families facing economic hardship, provide essential everyday supplies, and encourage youth through educational enablement.
              </TextAnimationBlurFadeIn>
            </div>

            {/* 4 Cards Grid with Staggered Blur-and-Fade Reveal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
              {/* Initiative 1 */}
              <BlurFadeIn delay={0.15} duration={0.5} className="h-full">
                <div className="h-full p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200 hover:border-amber-400 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#004D86] mb-5">
                      <HeartHandshake className="w-6 h-6 text-[#004D86]" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3">
                      Community Welfare & Essential Relief
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                      Delivering vital food dry rations, clothing, warm blankets, and everyday necessities directly to families and elder citizens navigating acute economic distress.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-100">
                    <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2.5">
                      Key Focus Areas
                    </h4>
                    <ul className="space-y-1.5 text-xs text-neutral-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Direct essential nutrition and dry ration packages</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Seasonal relief kits for vulnerable households</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Dignified, compassionate door-to-door distribution</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </BlurFadeIn>

              {/* Initiative 2 */}
              <BlurFadeIn delay={0.25} duration={0.5} className="h-full">
                <div className="h-full p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200 hover:border-amber-400 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#004D86] mb-5">
                      <BookOpen className="w-6 h-6 text-[#004D86]" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3">
                      Educational & Youth Enablement
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                      Equipping children and aspiring students with stationery, learning materials, backpacks, and foundational digital learning sessions to unlock academic potential.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-100">
                    <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2.5">
                      Key Focus Areas
                    </h4>
                    <ul className="space-y-1.5 text-xs text-neutral-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Notebooks, study kits, and school bag distribution</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Basic digital literacy and educational guidance</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Youth encouragement drives and study support</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </BlurFadeIn>

              {/* Initiative 3 */}
              <BlurFadeIn delay={0.35} duration={0.5} className="h-full">
                <div className="h-full p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200 hover:border-amber-400 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#004D86] mb-5">
                      <ShieldCheck className="w-6 h-6 text-[#004D86]" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3">
                      Health, Wellness & Sanitation
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                      Promoting preventive community health awareness, distributing personal care kits, and assisting families with critical medical coordination during emergencies.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-100">
                    <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2.5">
                      Key Focus Areas
                    </h4>
                    <ul className="space-y-1.5 text-xs text-neutral-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Hygiene, sanitization, and basic wellness kits</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Preventive community health & cleanliness guidance</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Emergency medical coordination for distressed families</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </BlurFadeIn>

              {/* Initiative 4 */}
              <BlurFadeIn delay={0.45} duration={0.5} className="h-full">
                <div className="h-full p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200 hover:border-amber-400 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#004D86] mb-5">
                      <Users className="w-6 h-6 text-[#004D86]" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-3">
                      Civic Action & Social Responsibility
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed mb-6">
                      Mobilizing youth volunteers and civic champions for neighborhood care, local cleanliness drives, and collaborative social welfare action.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-neutral-100">
                    <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2.5">
                      Key Focus Areas
                    </h4>
                    <ul className="space-y-1.5 text-xs text-neutral-700">
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Youth volunteer mobilization and leadership</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Civic and neighborhood environmental awareness</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>Collaborative grassroots community building</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </BlurFadeIn>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION C — VIDEO GALLERY
            ========================================================================= */}
        <section
          id="foundation-videos"
          className="relative w-full py-16 sm:py-20 md:py-24 px-4 sm:px-8 lg:px-12 bg-white border-b border-neutral-200/80"
        >
          <div className="max-w-[1240px] mx-auto">
            {/* Section Header with Blur-and-Fade Reveal */}
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <TextAnimationBlurFadeIn
                as="span"
                delay={0.05}
                duration={0.4}
                className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-2"
              >
                FIELD ACTIVITIES & DOCUMENTATION
              </TextAnimationBlurFadeIn>
              <TextAnimationBlurFadeIn
                as="h2"
                delay={0.15}
                duration={0.5}
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight mb-4"
              >
                Moments of Impact — Foundation in Action
              </TextAnimationBlurFadeIn>
              <TextAnimationBlurFadeIn
                as="p"
                delay={0.25}
                duration={0.5}
                className="text-sm sm:text-base text-neutral-600 leading-relaxed font-normal"
              >
                Documented moments from our on-ground community outreach, essential welfare distributions, and social engagement programs conducted by DKP Innovations.
              </TextAnimationBlurFadeIn>
            </div>

            {/* Video Cards Grid with Staggered Blur-and-Fade Reveal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
              <BlurFadeIn delay={0.2} duration={0.5}>
                <FoundationVideoCard
                  id="video-relief-drive"
                  src="/videos/video11.mp4"
                  badge="Community Welfare Drive"
                  title="On-Ground Essential Support & Relief"
                  description="Footage from our grassroots distribution effort, delivering direct provisions and critical everyday supplies to families facing economic vulnerability."
                  tags={['Grassroots Outreach', 'Essential Relief', 'Direct Support']}
                />
              </BlurFadeIn>

              <BlurFadeIn delay={0.32} duration={0.5}>
                <FoundationVideoCard
                  id="video-social-engagement"
                  src="/videos/video22.mp4"
                  badge="Community Engagement"
                  title="Social Empowerment & Youth Interaction"
                  description="Moments reflecting community togetherness, engaging local families and young participants in supportive welfare and encouragement initiatives."
                  tags={['Social Welfare', 'Youth Empowerment', 'Community Action']}
                />
              </BlurFadeIn>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION D — CLOSING CALL TO ACTION
            ========================================================================= */}
        <section
          id="closing-cta"
          className="relative w-full py-16 sm:py-20 md:py-24 px-4 sm:px-8 lg:px-12 select-none bg-white"
        >
          <div className="max-w-[1240px] mx-auto">
            <BlurFadeIn
              delay={0.1}
              duration={0.6}
              className="relative rounded-3xl p-8 sm:p-12 md:p-16 border border-neutral-200 bg-gradient-to-b from-neutral-50 via-white to-amber-50/30 overflow-hidden text-center shadow-lg text-neutral-900"
            >
              {/* Subtle ambient light */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,214,10,0.08),transparent_70%)] pointer-events-none"
              />

              <div className="relative z-10 max-w-2xl mx-auto">
                <TextAnimationBlurFadeIn
                  as="span"
                  delay={0.15}
                  duration={0.4}
                  className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-3"
                >
                  BE THE CATALYST
                </TextAnimationBlurFadeIn>

                <TextAnimationBlurFadeIn
                  as="h2"
                  delay={0.25}
                  duration={0.5}
                  className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight mb-4"
                >
                  Together, We Can Shape a More Compassionate World
                </TextAnimationBlurFadeIn>

                <TextAnimationBlurFadeIn
                  as="p"
                  delay={0.35}
                  duration={0.5}
                  className="text-sm sm:text-base text-neutral-600 leading-relaxed mb-8 max-w-2xl mx-auto font-normal"
                >
                  Whether you wish to connect with our outreach team, participate in field volunteer drives, or learn more about our ongoing community welfare work under DKP Innovations, we welcome constructive engagement.
                </TextAnimationBlurFadeIn>

                <BlurFadeIn
                  delay={0.45}
                  duration={0.5}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                  <a
                    href={OFFICIAL_PHONE_TEL}
                    aria-label={`Call DKP Foundation at ${OFFICIAL_PHONE}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#FFD60A] hover:bg-[#FFE043] text-[#002244] font-bold text-sm tracking-wide shadow-md shadow-amber-300/30 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <Phone className="w-4 h-4 text-[#002244]" />
                    <span>{OFFICIAL_PHONE}</span>
                  </a>

                  <button
                    onClick={() => navigateTo('services')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white hover:bg-neutral-100 text-neutral-900 border border-neutral-300 font-semibold text-sm tracking-wide transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer shadow-xs"
                  >
                    <span>Explore Our Services</span>
                  </button>
                </BlurFadeIn>
              </div>
            </BlurFadeIn>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};
