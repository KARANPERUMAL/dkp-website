import { useNavigation } from '../context/NavigationContext';
import { Navbar } from './Navbar';
import { Footer } from './layout/Footer';
import { IconArrowRight } from '@tabler/icons-react';
import { Award, Users, Rocket, ShieldCheck, Globe, Eye, Target } from 'lucide-react';
import { EncryptedText } from '@/components/ui/encrypted-text';
import { TextAnimationBlurFadeIn, BlurFadeIn } from '@/components/ui/text-animation-blur-fade-in';

const companyStats = [
  {
    icon: Award,
    value: '6+',
    label: 'Years of Experience',
    metric: 'Years of Experience',
    isNumeric: true,
  },
  {
    icon: Users,
    value: '25+',
    label: 'Team Members',
    metric: 'Team Members',
    isNumeric: true,
  },
  {
    icon: Rocket,
    value: '30+',
    label: 'Expert Services',
    metric: 'Expert Services',
    isNumeric: true,
  },
  {
    icon: ShieldCheck,
    value: '800+',
    label: 'Clients',
    metric: 'Clients',
    isNumeric: true,
  },
  {
    icon: Globe,
    value: 'Serving Globally',
    label: 'Global Reach',
    metric: 'Global Reach',
    isNumeric: false,
  },
];

export const AboutPage = () => {
  const { navigateTo } = useNavigation();

  return (
    <div className="min-h-screen bg-[#000122] text-neutral-900 flex flex-col w-full selection:bg-[#FFD60A] selection:text-[#000122]">
      {/* Floating Header & Navbar */}
      <Navbar />

      {/* COMBINED HERO & COMPANY STATISTICS SECTION: One cohesive section with unified background and minimal gap */}
      <section className="relative w-full bg-[#000122] pt-28 pb-14 sm:pt-36 sm:pb-20 px-4 sm:px-8 lg:px-12 overflow-hidden select-none border-b border-white/10">
        {/* Ambient Lighting Gradients */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute left-1/2 -top-[10%] -translate-x-1/2 w-[700px] h-[400px] rounded-full"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(255, 214, 10, 0.16) 0%, rgba(255, 214, 10, 0.05) 45%, transparent 70%)',
              filter: 'blur(50px)',
            }}
          />
          <div
            className="absolute right-[8%] top-[25%] w-[420px] h-[320px] rounded-full"
            style={{
              background:
                'radial-gradient(circle, rgba(30, 41, 59, 0.28) 0%, transparent 70%)',
              filter: 'blur(45px)',
            }}
          />
          <div
            className="absolute left-1/2 bottom-[8%] -translate-x-1/2 w-[600px] h-[220px] rounded-full"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(255, 214, 10, 0.05) 0%, transparent 70%)',
              filter: 'blur(55px)',
            }}
          />
        </div>

        <div className="relative z-10 max-w-[1240px] mx-auto text-center">
          {/* Main Heading with Blur-and-Fade Reveal */}
          <TextAnimationBlurFadeIn
            as="h1"
            delay={0.1}
            staggerDuration={0.03}
            duration={0.6}
            className="text-4xl sm:text-6xl md:text-7xl font-black text-[#FFD60A] tracking-tight uppercase mb-6 max-w-4xl mx-auto leading-[1.05]"
          >
            We Turn Ideas Into Powerful Brands.
          </TextAnimationBlurFadeIn>

          {/* Supporting Copy based on authoritative company description with Blur-and-Fade */}
          <TextAnimationBlurFadeIn
            as="p"
            delay={0.25}
            duration={0.5}
            className="max-w-3xl mx-auto text-base sm:text-lg text-neutral-300 leading-relaxed font-normal mb-6"
          >
            DKP Innovation is a full-service digital and creative innovations company dedicated to building powerful brands across every platform. From digital marketing and web development to ad production, events, and talent management, we bring your vision to life.
          </TextAnimationBlurFadeIn>

          <TextAnimationBlurFadeIn
            as="p"
            delay={0.35}
            duration={0.5}
            className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-400 leading-relaxed font-normal mb-8"
          >
            With a team of passionate strategists, designers, and creators, we deliver results that go beyond expectations. Whatever your goal, DKP Innovation is your one-stop growth partner.
          </TextAnimationBlurFadeIn>

          {/* Primary & Secondary CTAs with Blur-and-Fade Reveal */}
          <BlurFadeIn delay={0.42} duration={0.5} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 sm:mb-16">
            <button
              onClick={() => navigateTo('services')}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-full bg-[#FFD60A] hover:bg-[#FFE047] text-[#000122] font-bold text-sm shadow-[0_4px_20px_rgba(255,214,10,0.35)] hover:shadow-[0_6px_25px_rgba(255,214,10,0.5)] transition-all duration-200 cursor-pointer"
            >
              <span>Explore Our Services</span>
              <IconArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => navigateTo('contact', 'enquiry-form')}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-7 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-semibold text-sm border border-white/10 transition-colors cursor-pointer"
            >
              <span>Let's Talk</span>
            </button>
          </BlurFadeIn>

          {/* Combined Statistics Row: Directly beneath CTAs with clean spacing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-4 xl:gap-5">
            {companyStats.map((stat, idx) => (
              <BlurFadeIn
                key={stat.metric}
                delay={0.5 + idx * 0.08}
                duration={0.5}
                className={`relative group bg-[#000122] hover:bg-[#000235] border border-white/10 hover:border-[#FFD60A]/50 rounded-2xl p-4 sm:p-5 lg:p-4.5 xl:p-5 transition-all duration-300 flex items-center justify-between gap-3 sm:gap-4 ${
                  idx === 4 ? 'sm:col-span-2 md:col-span-1 lg:col-span-1' : ''
                }`}
              >
                {/* Left: Metric value & descriptive label */}
                <div className="flex flex-col text-left min-w-0 flex-1">
                  <div className="mb-1 leading-tight">
                    {stat.isNumeric ? (
                      <span className="text-2xl sm:text-3xl lg:text-2xl xl:text-3xl font-black text-white tracking-tight tabular-nums">
                        <EncryptedText
                          text={stat.value}
                          revealDelayMs={280}
                          flipDelayMs={60}
                          className="font-black text-white tracking-tight tabular-nums inline-block"
                          encryptedClassName="text-[#FFD60A]"
                          revealedClassName="text-white"
                        />
                      </span>
                    ) : (
                      <span className="text-base sm:text-lg lg:text-base xl:text-lg font-black text-white tracking-tight leading-snug">
                        {stat.value}
                      </span>
                    )}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-neutral-400 group-hover:text-neutral-300 transition-colors leading-snug">
                    {stat.label}
                  </div>
                </div>

                {/* Right: Lucide Icon in yellow-accented container */}
                <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#FFD60A]/10 border border-[#FFD60A]/25 flex items-center justify-center text-[#FFD60A] group-hover:scale-105 group-hover:bg-[#FFD60A]/20 transition-all duration-300">
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </BlurFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="relative w-full bg-neutral-50 flex-1">
        {/* SECTION B: Founder Profile — Puttaraju KV */}
        <section className="w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-12 bg-[#000122] border-b border-white/10 relative overflow-hidden select-none">
          {/* Subtle Ambient Glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[500px] h-[350px] rounded-full"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(255, 214, 10, 0.08) 0%, transparent 70%)',
                filter: 'blur(55px)',
              }}
            />
          </div>

          <div className="max-w-[1100px] mx-auto relative z-10">
            <BlurFadeIn
              delay={0.1}
              duration={0.6}
              className="bg-gradient-to-br from-[#000122] via-[#000235] to-[#000122] border border-white/10 rounded-3xl p-6 sm:p-10 lg:p-14 shadow-2xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* Founder Photograph */}
                <div className="md:col-span-5 flex justify-center">
                  <div className="relative group w-full max-w-[320px] sm:max-w-[360px] aspect-square rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.7)] bg-[#000122]">
                    <img
                      src="/images/founder-img/founder.png"
                      alt="Puttaraju KV - Founder & CEO @ DKP Innovations"
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#000122]/60 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* Profile Information & Credentials */}
                <div className="md:col-span-7 flex flex-col justify-center text-left">
                  <span className="text-xs font-bold text-[#FFD60A] uppercase tracking-widest mb-3 block">
                    Leadership
                  </span>

                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-2 sm:mb-2.5">
                    Puttaraju KV
                  </h2>

                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-[#FFD60A] tracking-normal mb-4 sm:mb-5">
                    Founder & CEO of DKP Innovations
                  </h3>

                  <p className="text-base sm:text-lg text-neutral-300 leading-relaxed font-normal">
                    Puttaraju KV is the Founder & CEO of DKP Innovations, a business coach, and a digital solutions expert passionate about empowering businesses through Google Services, innovative technology, and strategic digital solutions that strengthen the online presence and support sustainable business growth.
                  </p>
                </div>

              </div>
            </BlurFadeIn>
          </div>
        </section>

        {/* SECTION C: Purpose & Direction — Vision & Mission */}
        <section className="w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-12 bg-neutral-50 select-none">
          <div className="max-w-[1240px] mx-auto">
            {/* Section Header with Blur-and-Fade Reveal */}
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <TextAnimationBlurFadeIn
                as="span"
                delay={0.05}
                duration={0.4}
                className="text-xs font-bold text-[#854D0E] uppercase tracking-widest mb-2.5 block"
              >
                Purpose & Direction
              </TextAnimationBlurFadeIn>
              <TextAnimationBlurFadeIn
                as="h2"
                delay={0.15}
                duration={0.5}
                className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral-900 tracking-tight mb-4"
              >
                Our Vision & Mission
              </TextAnimationBlurFadeIn>
              <TextAnimationBlurFadeIn
                as="p"
                delay={0.25}
                duration={0.5}
                className="text-base sm:text-lg text-neutral-600 leading-relaxed font-normal"
              >
                Guided by strategic clarity and creative ambition, we empower organisations to thrive in an evolving digital landscape.
              </TextAnimationBlurFadeIn>
            </div>

            {/* Vision & Mission Cards with Staggered Blur-Fade Reveal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-stretch">
              {/* Vision Card */}
              <BlurFadeIn
                delay={0.3}
                duration={0.5}
                className="group relative bg-white border border-neutral-200/90 rounded-3xl p-8 sm:p-10 lg:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(255,214,10,0.15)] hover:border-[#FFD60A]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#FFD60A]/15 border border-[#FFD60A]/30 flex items-center justify-center text-[#854D0E] mb-6 group-hover:scale-105 group-hover:bg-[#FFD60A] group-hover:text-[#000122] transition-all duration-300">
                    <Eye className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-bold text-[#854D0E] uppercase tracking-wider mb-2 block">
                    Strategic Focus
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mb-4">
                    Our Vision
                  </h3>
                  <p className="text-base sm:text-lg text-neutral-700 leading-relaxed font-normal">
                    To empower every organisation with effective digital solutions that help them establish a strong online presence, build a trusted brand reputation, and unlock sustainable growth opportunities in the digital era.
                  </p>
                </div>
              </BlurFadeIn>

              {/* Mission Card */}
              <BlurFadeIn
                delay={0.4}
                duration={0.5}
                className="group relative bg-white border border-neutral-200/90 rounded-3xl p-8 sm:p-10 lg:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(255,214,10,0.15)] hover:border-[#FFD60A]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-[#FFD60A]/15 border border-[#FFD60A]/30 flex items-center justify-center text-[#854D0E] mb-6 group-hover:scale-105 group-hover:bg-[#FFD60A] group-hover:text-[#000122] transition-all duration-300">
                    <Target className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-bold text-[#854D0E] uppercase tracking-wider mb-2 block">
                    Core Commitment
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mb-4">
                    Our Mission
                  </h3>
                  <p className="text-base sm:text-lg text-neutral-700 leading-relaxed font-normal">
                    To help businesses of all sizes grow through practical, innovative, and result-oriented digital strategies that improve visibility, strengthen customer connections, and create long-term business value.
                  </p>
                </div>
              </BlurFadeIn>
            </div>
          </div>
        </section>
      </main>

      {/* Global Shared Footer */}
      <Footer />
    </div>
  );
};
