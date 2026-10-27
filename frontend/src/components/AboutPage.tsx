import { motion } from 'framer-motion';
import { useNavigation } from '../context/NavigationContext';
import { Navbar } from './Navbar';
import { Footer } from './layout/Footer';
import { IconArrowRight } from '@tabler/icons-react';
import { TeamStack, defaultDkpServices } from '@/components/unlumen-ui/team-stack';

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

      {/* Main Content Area: Light & Warm Sections */}
      <main className="relative w-full bg-neutral-50 flex-1">
        {/* SECTION B: Integrated Digital Solutions — Creativity Meets Strategy (TeamStack) */}
        <section className="w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-12 bg-white border-b border-neutral-200/80 overflow-x-clip">
          <div className="max-w-[1240px] mx-auto">
            <TeamStack
              eyebrow="Integrated Digital Solutions"
              title="Creativity Meets Strategy"
              description="At DKP Innovation, we believe lasting market impact requires both analytical rigor and distinctive creative execution. By uniting five foundational capabilities under one roof, we eliminate fragmented communication and ensure cohesive brand growth."
              items={defaultDkpServices}
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

        {/* SECTION C: Founder Profile — Puttaraju KV */}
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

                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight mb-5 sm:mb-6">
                    Puttaraju KV
                  </h2>

                  <p className="text-base sm:text-lg text-neutral-200 leading-relaxed font-normal">
                    Founder & CEO of DKP Innovations, is an experience in Google Services and Digital Solutions and Business Coach.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* SECTION D: Our Growth Partnership */}
        <section className="w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-12 bg-white">
          <div className="max-w-[1240px] mx-auto">
            <div className="bg-gradient-to-br from-[#090b10] via-[#0d1017] to-[#161a24] rounded-3xl p-8 sm:p-12 lg:p-16 text-white border border-neutral-800 shadow-2xl relative overflow-hidden">
              {/* Subtle Ambient Glow */}
              <div
                className="absolute right-0 top-0 w-[400px] h-[300px] pointer-events-none rounded-full"
                style={{
                  background:
                    'radial-gradient(circle, rgba(234, 88, 12, 0.15) 0%, transparent 70%)',
                  filter: 'blur(45px)',
                }}
              />

              <div className="relative z-10 max-w-3xl">
                <span className="text-xs font-bold text-orange-400 uppercase tracking-wider mb-3 block">
                  Collaborative Engagement
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-5 leading-tight">
                  Your Vision. Our Strategy. <br className="hidden sm:inline" />
                  <span className="text-orange-500">Shared Growth.</span>
                </h2>
                <p className="text-base sm:text-lg text-neutral-300 leading-relaxed mb-6 font-normal">
                  DKP Innovation acts as your dedicated growth partner. We support brands at every stage of their journey—strengthening your digital presence, refining creative communication, and deploying multi-channel marketing campaigns that generate tangible business value.
                </p>
                <p className="text-sm sm:text-base text-neutral-400 leading-relaxed mb-8">
                  Whether establishing a new venture or scaling an established market presence, our teams in Bengaluru provide the strategic foundation and creative horsepower needed to achieve your vision.
                </p>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <button
                    onClick={() => navigateTo('contact', 'enquiry-form')}
                    className="inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-full bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm shadow-[0_4px_20px_rgba(234,88,12,0.4)] transition-all cursor-pointer"
                  >
                    <span>Discuss Your Project</span>
                    <IconArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => navigateTo('contact', 'branch-map')}
                    className="inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-semibold text-sm border border-white/10 transition-colors cursor-pointer"
                  >
                    <span>Visit Our Bengaluru Branches</span>
                  </button>
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
