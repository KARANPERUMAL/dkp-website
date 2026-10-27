import { motion } from 'framer-motion';
import { useNavigation } from '../context/NavigationContext';
import { Navbar } from './Navbar';
import { Footer } from './layout/Footer';
import { IconArrowRight } from '@tabler/icons-react';
import { Award, Users, Rocket, ShieldCheck, Globe, Eye, Target } from 'lucide-react';
import { EncryptedText } from '@/components/ui/encrypted-text';

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
    <div className="min-h-screen bg-[#050608] text-neutral-900 flex flex-col w-full selection:bg-orange-500 selection:text-white">
      {/* Floating Header & Navbar */}
      <div className="relative w-full bg-[#050608]">
        <Navbar />

        {/* SECTION A: About Hero */}
        <section className="relative w-full pt-28 pb-16 sm:pt-36 sm:pb-24 px-4 sm:px-8 lg:px-12 overflow-hidden select-none">
          {/* Ambient Lighting Gradients */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute left-1/2 -top-[10%] -translate-x-1/2 w-[700px] h-[400px] rounded-full"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(234, 88, 12, 0.22) 0%, rgba(180, 60, 10, 0.08) 45%, transparent 70%)',
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
          </div>

          <div className="relative z-10 max-w-[1240px] mx-auto text-center">
            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl font-black text-orange-500 tracking-tight uppercase mb-6 max-w-4xl mx-auto leading-[1.05]"
            >
              We Turn Ideas Into Powerful Brands.
            </motion.h1>

            {/* Supporting Copy based on authoritative company description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-3xl mx-auto text-base sm:text-lg text-neutral-300 leading-relaxed font-normal mb-8"
            >
              <span className="text-white font-semibold">DKP Innovation</span> is a full-service digital and creative innovations company dedicated to building powerful brands across every platform. From digital marketing and web development to ad production, events, and talent management, we bring your vision to life.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="max-w-2xl mx-auto text-sm sm:text-base text-neutral-400 leading-relaxed font-normal mb-10"
            >
              With a team of passionate strategists, designers, and creators, we deliver results that go beyond expectations. Whatever your goal, DKP Innovation is your one-stop growth partner.
            </motion.p>

            {/* Primary & Secondary CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <button
                onClick={() => navigateTo('services')}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-full bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-[0_4px_20px_rgba(234,88,12,0.4)] hover:shadow-[0_6px_25px_rgba(234,88,12,0.6)] transition-all duration-200 cursor-pointer"
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
            </motion.div>
          </div>
        </section>
      </div>

      {/* SECTION: Key Company Statistics */}
      <section className="relative w-full bg-[#08090d] border-b border-white/10 py-10 sm:py-14 px-4 sm:px-8 lg:px-12 select-none overflow-hidden">
        {/* Ambient Lighting */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] rounded-full"
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(234, 88, 12, 0.08) 0%, transparent 70%)',
              filter: 'blur(50px)',
            }}
          />
        </div>

        <div className="relative z-10 max-w-[1240px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 lg:gap-4 xl:gap-5">
            {companyStats.map((stat, idx) => (
              <div
                key={stat.metric}
                className={`relative group bg-[#0d1017] hover:bg-[#121622] border border-white/10 hover:border-orange-500/40 rounded-2xl p-4 sm:p-5 lg:p-4.5 xl:p-5 transition-all duration-300 flex items-center justify-between gap-3 sm:gap-4 ${
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
                          revealDelayMs={60}
                          flipDelayMs={40}
                          className="font-black text-white tracking-tight tabular-nums inline-block"
                          encryptedClassName="text-orange-400"
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

                {/* Right: Lucide Icon in orange-accented container */}
                <div className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 group-hover:scale-105 group-hover:bg-orange-500/20 transition-all duration-300">
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="relative w-full bg-neutral-50 flex-1">
        {/* SECTION B: Founder Profile — Puttaraju KV */}
        <section className="w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-12 bg-[#090b10] border-b border-neutral-800/80 relative overflow-hidden select-none">
          {/* Subtle Ambient Glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[500px] h-[350px] rounded-full"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(234, 88, 12, 0.12) 0%, transparent 70%)',
                filter: 'blur(55px)',
              }}
            />
          </div>

          <div className="max-w-[1100px] mx-auto relative z-10">
            <div className="bg-gradient-to-br from-[#0c0f17] via-[#10141f] to-[#161a25] border border-white/10 rounded-3xl p-6 sm:p-10 lg:p-14 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-center">
                
                {/* Founder Photograph */}
                <div className="md:col-span-5 flex justify-center">
                  <div className="relative group w-full max-w-[320px] sm:max-w-[360px] aspect-square rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-[0_12px_40px_rgba(0,0,0,0.7)] bg-neutral-900">
                    <img
                      src="/images/founder-img/founder.png"
                      alt="Puttaraju KV - Founder & CEO @ DKP Innovations"
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* Profile Information & Credentials */}
                <div className="md:col-span-7 flex flex-col justify-center text-left">
                  <span className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-3 block">
                    Leadership
                  </span>

                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-2 sm:mb-2.5">
                    Puttaraju KV
                  </h2>

                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-500 tracking-normal mb-4 sm:mb-5">
                    Founder & CEO of DKP Innovations
                  </h3>

                  <p className="text-base sm:text-lg text-neutral-300 leading-relaxed font-normal">
                    Puttaraju KV is the Founder & CEO of DKP Innovations, a business coach, and a digital solutions expert passionate about empowering businesses through Google Services, innovative technology, and strategic digital solutions that strengthen the online presence and support sustainable business growth.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* SECTION C: Purpose & Direction — Vision & Mission */}
        <section className="w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-12 bg-neutral-50 select-none">
          <div className="max-w-[1240px] mx-auto">
            {/* Section Header */}
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <span className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-2.5 block">
                Purpose & Direction
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral-900 tracking-tight mb-4">
                Our Vision & Mission
              </h2>
              <p className="text-base sm:text-lg text-neutral-600 leading-relaxed font-normal">
                Guided by strategic clarity and creative ambition, we empower organisations to thrive in an evolving digital landscape.
              </p>
            </div>

            {/* Vision & Mission Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 items-stretch">
              {/* Vision Card */}
              <div className="group relative bg-white border border-neutral-200/90 rounded-3xl p-8 sm:p-10 lg:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(234,88,12,0.08)] hover:border-orange-500/30 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 mb-6 group-hover:scale-105 group-hover:bg-orange-100/80 transition-all duration-300">
                    <Eye className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2 block">
                    Strategic Focus
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mb-4">
                    Our Vision
                  </h3>
                  <p className="text-base sm:text-lg text-neutral-700 leading-relaxed font-normal">
                    To empower every organisation with effective digital solutions that help them establish a strong online presence, build a trusted brand reputation, and unlock sustainable growth opportunities in the digital era.
                  </p>
                </div>
              </div>

              {/* Mission Card */}
              <div className="group relative bg-white border border-neutral-200/90 rounded-3xl p-8 sm:p-10 lg:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(234,88,12,0.08)] hover:border-orange-500/30 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 mb-6 group-hover:scale-105 group-hover:bg-orange-100/80 transition-all duration-300">
                    <Target className="w-7 h-7" />
                  </div>
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-wider mb-2 block">
                    Core Commitment
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mb-4">
                    Our Mission
                  </h3>
                  <p className="text-base sm:text-lg text-neutral-700 leading-relaxed font-normal">
                    To help businesses of all sizes grow through practical, innovative, and result-oriented digital strategies that improve visibility, strengthen customer connections, and create long-term business value.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Global Shared Footer */}
      <Footer />
    </div>
  );
};
