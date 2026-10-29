import { useState, useRef, useEffect } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './layout/Footer';
import { useNavigation } from '../context/NavigationContext';
import { OFFICIAL_PHONE, OFFICIAL_PHONE_TEL, OFFICIAL_EMAIL, OFFICIAL_EMAIL_MAILTO, branchLocations } from '../data/branchesData';
import { TextAnimationBlurFadeIn, BlurFadeIn } from '@/components/ui/text-animation-blur-fade-in';
import {
  HeartHandshake,
  BookOpen,
  ShieldCheck,
  Users,
  Building2,
  Gift,
  ArrowDown,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
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
            <h4 className="text-base font-bold text-[#000122] mb-1">Video Unavailable</h4>
            <p className="text-xs text-neutral-600 max-w-sm mb-4 leading-relaxed">
              We couldn&apos;t load this video preview in your browser. Please check your connection or contact our team.
            </p>
            <button
              onClick={handleRetry}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#000122] hover:bg-[#000122]/90 text-xs font-semibold text-white transition-colors cursor-pointer"
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
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#000122]/90 border border-white/20 text-[11px] font-semibold text-[#FFD60A] backdrop-blur-md shadow-sm">
            <VideoIcon className="w-3 h-3 text-[#FFD60A]" />
            {badge}
          </span>
        </div>
      </div>

      {/* Details Box */}
      <div className="p-5 sm:p-6 flex flex-col flex-grow justify-between bg-white">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#000122] mb-2 group-hover:text-amber-600 transition-colors">
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

  useEffect(() => {
    document.title = 'DKP Foundation | DKP Innovation';
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const corporateHq = branchLocations[0];

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col w-full selection:bg-[#FFD60A] selection:text-[#000122]">
      {/* Floating Centered Navigation */}
      <Navbar />

      <main className="flex-grow w-full bg-white">
        {/* =========================================================================
            SECTION A — FOUNDATION HERO
            ========================================================================= */}
        <section
          id="hero"
          className="relative w-full bg-[#000122] text-white pt-28 sm:pt-32 md:pt-36 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-8 lg:px-12 overflow-hidden select-none border-b border-white/10"
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
            {/* Main Page Title / Visible Heading */}
            <TextAnimationBlurFadeIn
              as="h1"
              delay={0.1}
              staggerDuration={0.03}
              duration={0.6}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[#FFD60A] leading-[1.1] mb-4 sm:mb-6 max-w-4xl mx-auto"
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
              At DKP Innovations, technological advancement is deeply intertwined with social responsibility. The DKP Foundation is our dedicated philanthropic wing, bringing direct aid, community relief, educational enablement, and social empowerment to underserved individuals and families.
            </TextAnimationBlurFadeIn>

            {/* Dual CTAs with Blur-and-Fade Reveal */}
            <BlurFadeIn
              delay={0.46}
              duration={0.5}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
            >
              <button
                onClick={() => scrollTo('initiatives')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#FFD60A] hover:bg-[#FFE043] text-[#000122] font-bold text-sm tracking-wide shadow-[0_4px_24px_rgba(255,214,10,0.35)] hover:shadow-[0_6px_28px_rgba(255,214,10,0.5)] transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Explore Our Initiatives</span>
                <ArrowDown className="w-4 h-4 text-[#000122]" />
              </button>

              <button
                onClick={() => scrollTo('foundation-videos')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-white border border-white/15 font-semibold text-sm tracking-wide transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer backdrop-blur-sm shadow-xs"
              >
                <span>Watch Our Activities</span>
                <VideoIcon className="w-4 h-4 text-[#FFD60A]" />
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
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-2">
                WHAT WE CHAMPION
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#000122] tracking-tight mb-4">
                Core Social Initiatives
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                We design and execute focused programs to support underprivileged families, provide critical relief, and empower the next generation through education and well-being.
              </p>
            </div>

            {/* 4 Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {/* Initiative 1 */}
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200 hover:border-amber-400 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#000122] mb-5">
                    <HeartHandshake className="w-6 h-6 text-[#000122]" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#000122] mb-3">
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

              {/* Initiative 2 */}
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200 hover:border-amber-400 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#000122] mb-5">
                    <BookOpen className="w-6 h-6 text-[#000122]" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#000122] mb-3">
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

              {/* Initiative 3 */}
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200 hover:border-amber-400 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#000122] mb-5">
                    <ShieldCheck className="w-6 h-6 text-[#000122]" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#000122] mb-3">
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

              {/* Initiative 4 */}
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200 hover:border-amber-400 transition-all duration-300 shadow-sm hover:shadow-xl flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#000122] mb-5">
                    <Users className="w-6 h-6 text-[#000122]" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-[#000122] mb-3">
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
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-2">
                FIELD ACTIVITIES & DOCUMENTATION
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#000122] tracking-tight mb-4">
                Moments of Impact — Foundation in Action
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                Transparent glimpses into our on-ground community outreach, essential welfare distributions, and social engagement programs.
              </p>
            </div>

            {/* Video Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
              <FoundationVideoCard
                id="video-relief-drive"
                src="/videos/video11.mp4"
                badge="Community Welfare Drive"
                title="On-Ground Essential Support & Relief"
                description="Footage from our grassroots distribution effort, delivering direct provisions and critical everyday supplies to families facing economic vulnerability."
                tags={['Grassroots Outreach', 'Essential Relief', 'Direct Support']}
              />

              <FoundationVideoCard
                id="video-social-engagement"
                src="/videos/video22.mp4"
                badge="Community Engagement"
                title="Social Empowerment & Youth Interaction"
                description="Moments reflecting community togetherness, engaging local families and young participants in supportive welfare and encouragement initiatives."
                tags={['Social Welfare', 'Youth Empowerment', 'Community Action']}
              />
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION D — DONATION, SUPPORT & PARTICIPATION
            ========================================================================= */}
        <section
          id="support"
          className="relative w-full py-16 sm:py-20 md:py-24 px-4 sm:px-8 lg:px-12 bg-white border-b border-neutral-200/80"
        >
          <div className="max-w-[1240px] mx-auto">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-2">
                COLLABORATION & SUPPORT
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#000122] tracking-tight mb-4">
                Partner With Us to Expand Our Reach
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                Social transformation is a shared responsibility. We warmly welcome corporate allies, volunteer leaders, and concerned citizens to join hands with us.
              </p>
            </div>

            {/* 3 Participation Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
              <div className="p-6 sm:p-7 rounded-2xl bg-white border border-neutral-200 hover:border-amber-400 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#000122] mb-4">
                    <Building2 className="w-5 h-5 text-[#000122]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#000122] mb-2">
                    Institutional & CSR Partnerships
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-4">
                    Align your corporate social responsibility mandates with verified, accountable on-ground initiatives executed with complete transparency and compliance.
                  </p>
                </div>
                <div className="text-xs font-bold text-amber-600 flex items-center gap-1.5">
                  <span>Structured CSR Alignment</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="p-6 sm:p-7 rounded-2xl bg-white border border-neutral-200 hover:border-amber-400 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#000122] mb-4">
                    <HeartHandshake className="w-5 h-5 text-[#000122]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#000122] mb-2">
                    Volunteer & Ground Mobilization
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-4">
                    Lend your time, professional mentorship, or on-field energy to our community drives, learning workshops, and distribution campaigns.
                  </p>
                </div>
                <div className="text-xs font-bold text-amber-600 flex items-center gap-1.5">
                  <span>Active Community Participation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>

              <div className="p-6 sm:p-7 rounded-2xl bg-white border border-neutral-200 hover:border-amber-400 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#000122] mb-4">
                    <Gift className="w-5 h-5 text-[#000122]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#000122] mb-2">
                    Material & Relief Sponsorship
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-4">
                    Directly sponsor verified drive requirements such as dry grain rations, student learning kits, stationery supplies, or seasonal winter gear.
                  </p>
                </div>
                <div className="text-xs font-bold text-amber-600 flex items-center gap-1.5">
                  <span>Direct In-Kind Sponsorship</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>

            {/* Official Compliance & Direct Coordination Notice */}
            <div className="rounded-2xl bg-amber-50/70 border border-amber-200/90 p-6 sm:p-8 mb-12 shadow-xs">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
                <div className="p-3.5 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 shrink-0">
                  <ShieldCheck className="w-7 h-7 text-amber-800" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-base sm:text-lg font-bold text-[#000122] mb-1.5">
                    Notice on Verified Coordination & Transparency
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-700 leading-relaxed">
                    To maintain strict governance, donor protection, and regulatory compliance, DKP Foundation <strong className="text-[#000122]">does not collect anonymous funds via automated third-party gateways or UPI QR codes online</strong>. Every formal partnership, institutional contribution, or volunteer coordination is verified directly through official Foundation leadership.
                  </p>
                </div>
              </div>
            </div>

            {/* Direct Foundation Communication Desk */}
            <div className="rounded-2xl bg-neutral-50 border border-neutral-200 p-6 sm:p-8 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-xs">
              <div>
                <h3 className="text-xl font-bold text-[#000122] mb-2">
                  Official Foundation Desk
                </h3>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed max-w-xl">
                  Connect with our team directly for partnership inquiries, relief drive details, or volunteer opportunities.
                </p>
                <div className="flex flex-wrap items-center gap-4 mt-4 text-xs sm:text-sm text-neutral-700">
                  <a
                    href={OFFICIAL_PHONE_TEL}
                    className="inline-flex items-center gap-2 text-neutral-800 hover:text-amber-600 font-medium transition-colors"
                  >
                    <Phone className="w-4 h-4 text-amber-600" />
                    <span>{OFFICIAL_PHONE}</span>
                  </a>
                  <span className="text-neutral-300 hidden sm:inline">•</span>
                  <a
                    href={OFFICIAL_EMAIL_MAILTO}
                    className="inline-flex items-center gap-2 text-neutral-800 hover:text-amber-600 font-medium transition-colors"
                  >
                    <Mail className="w-4 h-4 text-amber-600" />
                    <span>{OFFICIAL_EMAIL}</span>
                  </a>
                  <span className="text-neutral-300 hidden sm:inline">•</span>
                  <span
                    title={corporateHq.address}
                    className="inline-flex items-center gap-2 text-neutral-600"
                  >
                    <MapPin className="w-4 h-4 text-amber-600" />
                    <span>Bengaluru, India</span>
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigateTo('contact', 'enquiry-form')}
                className="w-full lg:w-auto shrink-0 inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-[#FFD60A] hover:bg-[#FFE043] text-[#000122] font-bold text-sm tracking-wide shadow-md shadow-amber-300/30 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Get in Touch to Support</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION E — CLOSING CALL TO ACTION
            ========================================================================= */}
        <section
          id="closing-cta"
          className="relative w-full py-16 sm:py-20 md:py-24 px-4 sm:px-8 lg:px-12 select-none bg-white"
        >
          <div className="max-w-[1240px] mx-auto">
            <div className="relative rounded-3xl p-8 sm:p-12 md:p-16 border border-neutral-200 bg-gradient-to-b from-neutral-50 via-white to-amber-50/30 overflow-hidden text-center shadow-lg text-[#000122]">
              {/* Subtle ambient light */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,214,10,0.08),transparent_70%)] pointer-events-none"
              />

              <div className="relative z-10 max-w-2xl mx-auto">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-3">
                  BE THE CATALYST
                </span>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#000122] tracking-tight leading-tight mb-4">
                  Together, We Can Shape a More Compassionate World
                </h2>

                <p className="text-sm sm:text-base text-neutral-600 leading-relaxed mb-8">
                  Whether you wish to sponsor a relief initiative, volunteer on the field, or explore an institutional partnership, your voice and actions make a tangible difference.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <button
                    onClick={() => navigateTo('contact', 'enquiry-form')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#FFD60A] hover:bg-[#FFE043] text-[#000122] font-bold text-sm tracking-wide shadow-md shadow-amber-300/30 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span>Connect With DKP Foundation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => navigateTo('services')}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-white hover:bg-neutral-100 text-[#000122] border border-neutral-300 font-semibold text-sm tracking-wide transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer shadow-xs"
                  >
                    <span>Explore Our Services</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
};
