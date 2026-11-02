import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from './Navbar';
import { Footer } from './layout/Footer';
import { useNavigation } from '../hooks/useNavigation';
import {
  internshipDomains,
  targetAudienceList,
  type InternshipDomain,
} from '../data/academyData';
import {
  GraduationCap,
  Code2,
  Palette,
  TrendingUp,
  Compass,
  Briefcase,
  Users2,
  Layers,
  BookOpen,
} from 'lucide-react';
import { IconArrowRight } from '@tabler/icons-react';
import { TextAnimationBlurFadeIn, BlurFadeIn } from '@/components/ui/text-animation-blur-fade-in';
import { TiltCard } from '@/components/ui/tilt-card';
import { Tilt } from '@/components/ui/tilt';
import { ClippedCircle } from '@/components/ui/clipped-circle';

export const AcademyPage = () => {
  const { navigateTo, setSelectedPositionForApplication } = useNavigation();

  // Domain filtering state — exactly three options: All, Technical, Digital Marketing
  const [selectedCategory, setSelectedCategory] = useState<
    'All' | 'Technical' | 'Digital Marketing'
  >('All');

  // Filtered domain list
  const filteredDomains = useMemo(() => {
    if (selectedCategory === 'All') return internshipDomains;
    return internshipDomains.filter((d) => d.category === selectedCategory);
  }, [selectedCategory]);

  // Handler to route candidate directly to career form with pre-selected internship role
  const handleApplyForDomain = (domainId: string, positionTitle: string) => {
    setSelectedPositionForApplication(positionTitle);
    navigateTo('careers', 'application-form', { type: 'internship', domain: domainId });
  };

  const handleApplyGeneralInternship = () => {
    setSelectedPositionForApplication('Internship — General Application');
    navigateTo('careers', 'application-form', { type: 'internship', domain: 'general' });
  };

  const categories: Array<'All' | 'Technical' | 'Digital Marketing'> = [
    'All',
    'Technical',
    'Digital Marketing',
  ];

  return (
    <div className="min-h-screen bg-white text-neutral-900 flex flex-col w-full selection:bg-[#FFD60A] selection:text-[#002244]">
      {/* Floating Centered Navigation */}
      <Navbar />

      {/* =========================================================================
          SECTION A: HERO SECTION
          Preserved original dark blue header styling, atmospheric lighting & CTAs
          ========================================================================= */}
      <header
        className="relative w-full pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-8 lg:px-12 overflow-hidden select-none"
        style={{
          background:
            'radial-gradient(ellipse 90% 70% at 50% 25%, #005E9E 0%, #004D86 60%, #003E6D 100%)',
        }}
      >
        {/* Atmospheric Glow Highlights */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
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

        <div className="max-w-[1240px] mx-auto text-center relative z-10">
          {/* Heading with Blur-Fade Reveal */}
          <TextAnimationBlurFadeIn
            as="h1"
            delay={0.1}
            duration={0.6}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#FFFFFF] tracking-tight leading-[1.08] mb-4 sm:mb-6 max-w-4xl mx-auto"
          >
            DKP Academy
          </TextAnimationBlurFadeIn>

          {/* Main Headline with Blur-Fade Reveal */}
          <TextAnimationBlurFadeIn
            as="p"
            delay={0.2}
            duration={0.5}
            className="text-xl sm:text-2xl md:text-3xl font-bold text-[#FFD60A] tracking-tight max-w-3xl mx-auto mb-4 sm:mb-6 leading-snug"
          >
            Learn Skills. Build Real Projects. Shape Your Future.
          </TextAnimationBlurFadeIn>

          {/* Supporting Copy with Blur-Fade Reveal */}
          <TextAnimationBlurFadeIn
            as="p"
            delay={0.3}
            duration={0.5}
            className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-200 leading-relaxed font-normal mb-8 sm:mb-10"
          >
            Explore internship opportunities at DKP Innovations and gain practical exposure across
            technology, design, digital marketing and creative disciplines.
          </TextAnimationBlurFadeIn>

          {/* Primary & Secondary CTAs with Blur-Fade Reveal */}
          <BlurFadeIn delay={0.4} duration={0.5} className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <a
              href="#domains"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('domains');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-full bg-[#FFD60A] hover:bg-[#FFE047] text-[#002244] font-bold text-sm shadow-[0_4px_20px_rgba(255,214,10,0.35)] hover:shadow-[0_6px_25px_rgba(255,214,10,0.5)] transition-all duration-200 cursor-pointer"
            >
              <span>Explore Internship Domains</span>
              <IconArrowRight className="w-4 h-4" />
            </a>

            <button
              type="button"
              onClick={handleApplyGeneralInternship}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 hover:border-white/40 backdrop-blur-sm transition-all duration-200 cursor-pointer"
            >
              <span>Apply for Internship</span>
            </button>
          </BlurFadeIn>
        </div>
      </header>

      {/* Main Content Sections: All on Pure White (#FFFFFF) */}
      <main className="relative w-full bg-white flex-1 text-neutral-900">
        {/* =========================================================================
            SECTION B: ABOUT DKP ACADEMY
            Grounded explanation of purpose, practical learning approach & 5 pillars
            ========================================================================= */}
        <section className="w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-12 bg-white text-neutral-900 select-none border-b border-neutral-200/80">
          <div className="max-w-[1240px] mx-auto">
            <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
              <TextAnimationBlurFadeIn
                as="span"
                delay={0.08}
                duration={0.5}
                className="text-xs font-bold text-[#004D86] uppercase tracking-widest mb-3 block"
              >
                About The Initiative
              </TextAnimationBlurFadeIn>
              <TextAnimationBlurFadeIn
                as="h2"
                delay={0.15}
                duration={0.6}
                className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral-900 tracking-tight mb-4 sm:mb-6"
              >
                Practical Skill Development for Tomorrow’s Creators
              </TextAnimationBlurFadeIn>
              <TextAnimationBlurFadeIn
                as="p"
                delay={0.22}
                duration={0.5}
                className="text-base sm:text-lg text-neutral-600 leading-relaxed"
              >
                DKP Academy is a dedicated learning and internship initiative by{' '}
                <strong className="text-neutral-900 font-bold">DKP Innovations</strong>. Designed
                specifically for college students and recent graduates, our mission is to bridge the
                gap between academic coursework and real-world commercial delivery through guided,
                project-oriented engagement.
              </TextAnimationBlurFadeIn>
            </div>

            {/* 5 Pillars of Learning Approach + Philosophy Note */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Pillar 1 */}
              <motion.div
                initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
                whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.5, delay: 0, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex"
              >
                <Tilt
                  rotationFactor={11}
                  className="p-6 sm:p-8 rounded-xl bg-white border border-neutral-200/90 hover:border-[#FFD60A] transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-xl w-full select-none"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#004D86] text-[#FFD60A] flex items-center justify-center mb-5 shadow-sm">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2.5">
                      Practical Agency Exposure
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      Work alongside active engineers, designers, and digital strategists. See how real
                      client briefs, technical specifications, and commercial deadlines unfold in a live
                      agency setting.
                    </p>
                  </div>
                </Tilt>
              </motion.div>

              {/* Pillar 2 */}
              <motion.div
                initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
                whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex"
              >
                <Tilt
                  rotationFactor={11}
                  className="p-6 sm:p-8 rounded-xl bg-white border border-neutral-200/90 hover:border-[#FFD60A] transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-xl w-full select-none"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#004D86] text-[#FFD60A] flex items-center justify-center mb-5 shadow-sm">
                      <Compass className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2.5">
                      Guided Mentorship
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      Receive direct guidance and feedback from experienced practitioners. Ask questions,
                      participate in design and code critiques, and learn industry-standard best practices.
                    </p>
                  </div>
                </Tilt>
              </motion.div>

              {/* Pillar 3 */}
              <motion.div
                initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
                whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex"
              >
                <Tilt
                  rotationFactor={11}
                  className="p-6 sm:p-8 rounded-xl bg-white border border-neutral-200/90 hover:border-[#FFD60A] transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-xl w-full select-none"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#004D86] text-[#FFD60A] flex items-center justify-center mb-5 shadow-sm">
                      <Layers className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2.5">
                      Project-Oriented Experience
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      Move beyond passive lectures. Build concrete project components, contribute to
                      authentic workflows, and leave with verifiable outcomes you can showcase in your
                      portfolio.
                    </p>
                  </div>
                </Tilt>
              </motion.div>

              {/* Pillar 4 */}
              <motion.div
                initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
                whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.5, delay: 0, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex"
              >
                <Tilt
                  rotationFactor={11}
                  className="p-6 sm:p-8 rounded-xl bg-white border border-neutral-200/90 hover:border-[#FFD60A] transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-xl w-full select-none"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#004D86] text-[#FFD60A] flex items-center justify-center mb-5 shadow-sm">
                      <Code2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2.5">
                      Domain-Specific Skills
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      Develop competencies that align directly with industry expectations—from modern web
                      frameworks and Spring Boot to UI design systems and search engine optimization.
                    </p>
                  </div>
                </Tilt>
              </motion.div>

              {/* Pillar 5 */}
              <motion.div
                initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
                whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex"
              >
                <Tilt
                  rotationFactor={11}
                  className="p-6 sm:p-8 rounded-xl bg-white border border-neutral-200/90 hover:border-[#FFD60A] transition-all duration-300 flex flex-col justify-between shadow-sm hover:shadow-xl w-full select-none"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-[#004D86] text-[#FFD60A] flex items-center justify-center mb-5 shadow-sm">
                      <Users2 className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2.5">
                      Professional Collaboration
                    </h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">
                      Experience the dynamics of multidisciplinary teamwork. Learn how developers,
                      visual designers, and marketers synchronize their work to build unified brand
                      solutions.
                    </p>
                  </div>
                </Tilt>
              </motion.div>

              {/* Program Philosophy Card on White */}
              <motion.div
                initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
                whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex"
              >
                <Tilt
                  rotationFactor={11}
                  className="p-6 sm:p-8 rounded-xl bg-white border border-neutral-200/90 hover:border-[#FFD60A] transition-all duration-300 flex flex-col justify-center shadow-sm hover:shadow-xl w-full select-none"
                >
                  <div>
                    <div className="flex items-center space-x-2 text-[#004D86] mb-3">
                      <BookOpen className="w-5 h-5 text-[#004D86]" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Program Philosophy
                      </span>
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-neutral-900 mb-2">
                      Company-Led Learning
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      DKP Academy is an industry learning and internship initiative by DKP Innovations. We
                      focus purely on authentic project experience, professional skill enhancement, and
                      hands-on agency exposure.
                    </p>
                  </div>
                </Tilt>
              </motion.div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION C: INTERNSHIP DOMAINS
            Visual cards derived strictly from DKP Innovations' verified service catalogue
            (White background)
            ========================================================================= */}
        <section
          id="domains"
          className="w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-12 bg-white text-neutral-900 select-none border-b border-neutral-200/80"
        >
          <div className="max-w-[1240px] mx-auto">
            {/* Section Header */}
            <div className="max-w-3xl mx-auto text-center mb-10 sm:mb-14">
              <TextAnimationBlurFadeIn
                as="span"
                delay={0.08}
                duration={0.5}
                className="text-xs font-bold text-[#004D86] uppercase tracking-widest mb-3 block"
              >
                Available Opportunities
              </TextAnimationBlurFadeIn>
              <TextAnimationBlurFadeIn
                as="h2"
                delay={0.15}
                duration={0.6}
                className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral-900 tracking-tight mb-4"
              >
                Explore Internship Domains
              </TextAnimationBlurFadeIn>
              <TextAnimationBlurFadeIn
                as="p"
                delay={0.22}
                duration={0.5}
                className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-3xl mx-auto"
              >
                Every internship track reflects active commercial services delivered by DKP Innovations.
                Choose the domain that matches your career passion.
              </TextAnimationBlurFadeIn>

              {/* Category Filter Pills on White */}
              <BlurFadeIn delay={0.28} duration={0.5} className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8">
                {categories.map((cat) => {
                  const isActive = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                        isActive
                          ? 'bg-[#FFD60A] text-[#002244] shadow-[0_2px_12px_rgba(255,214,10,0.35)]'
                          : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </BlurFadeIn>
            </div>

            {/* Domain Cards Grid on White */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
              {filteredDomains.map((domain: InternshipDomain, index: number) => (
                <motion.div
                  key={domain.id}
                  initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
                  whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.5, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full flex"
                >
                  <TiltCard
                    title={domain.name}
                    description={domain.shortDescription}
                    circleSize={280}
                    circleClassName="bg-[#004D86]"
                    className="h-full flex flex-col justify-between select-none bg-white border border-neutral-200/90 hover:border-[#FFD60A] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                  >
                    {/* REGION 1: Isolated Domain Image Container — outside hover reveal layer, category badge removed */}
                    <div className="relative w-full aspect-[16/10] overflow-hidden bg-neutral-100 select-none">
                      <img
                        src={domain.image}
                        alt={domain.alt}
                        width={600}
                        height={375}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500 ease-out"
                      />
                    </div>

                    {/* REGION 2: Text/Content Container — isolated from image, contains the localized circular hover reveal */}
                    <div className="relative flex-1 flex flex-col justify-between overflow-hidden bg-white">
                      {/* CLIPPED OVERLAY: attached directly to text/content container so circle coordinates and clipping are strictly bounded */}
                      <ClippedCircle
                        circleSize={280}
                        circleClassName="bg-[#004D86]"
                        className="z-20"
                      >
                        {/* Synchronized duplicate containing ONLY the text/content area (marked aria-hidden to eliminate heading duplication) */}
                        <div
                          aria-hidden="true"
                          className="p-6 flex-1 flex flex-col justify-between h-full bg-[#004D86] select-none pointer-events-none"
                        >
                          <div>
                            {/* Domain Visual Heading: DKP yellow accent counterpart */}
                            <div className="text-xl font-bold text-[#FFD60A] leading-snug mb-2.5">
                              {domain.name}
                            </div>

                            {/* Description: High-contrast light gray */}
                            <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed">
                              {domain.shortDescription}
                            </p>
                          </div>

                          {/* Action Button: Dark theme visual counterpart */}
                          <div className="pt-6">
                            <div
                              tabIndex={-1}
                              aria-hidden="true"
                              className="w-full inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-white/10 text-white font-semibold text-xs sm:text-sm border border-white/20 select-none pointer-events-none"
                            >
                              <span>Apply for this Domain</span>
                              <IconArrowRight className="w-4 h-4 text-[#FFD60A]" />
                            </div>
                          </div>
                        </div>
                      </ClippedCircle>

                      {/* BASE CONTENT: original light theme with dark headings and text */}
                      <div className="p-6 flex-1 flex flex-col justify-between relative z-10 bg-white">
                        <div>
                          {/* Domain Heading: Clean dark neutral */}
                          <h3 className="text-xl font-bold text-neutral-900 group-hover:text-neutral-950 transition-colors leading-snug mb-2.5">
                            {domain.name}
                          </h3>

                          {/* Description: Readable dark-gray copy */}
                          <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                            {domain.shortDescription}
                          </p>
                        </div>

                        {/* Primary Action Button: Light theme styling, interactive & focusable */}
                        <div className="pt-6 relative z-10">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApplyForDomain(domain.id, domain.careerPositionTitle);
                            }}
                            className="w-full inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-[#FFD60A] hover:bg-[#FFE047] text-[#002244] font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_2px_14px_rgba(255,214,10,0.3)] relative z-10 pointer-events-auto"
                          >
                            <span>Apply for this Domain</span>
                            <IconArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            SECTION D: WHO CAN APPLY?
            Intended college student audience profiles (White background)
            ========================================================================= */}
        <section className="w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-12 bg-white text-neutral-900 select-none">
          <div className="max-w-[1240px] mx-auto">
            {/* Section Header */}
            <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
              <TextAnimationBlurFadeIn
                as="span"
                delay={0.08}
                duration={0.5}
                className="text-xs font-bold text-[#004D86] uppercase tracking-widest mb-3 block"
              >
                Eligibility & Profiles
              </TextAnimationBlurFadeIn>
              <TextAnimationBlurFadeIn
                as="h2"
                delay={0.15}
                duration={0.6}
                className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral-900 tracking-tight mb-4"
              >
                Who Can Apply?
              </TextAnimationBlurFadeIn>
              <TextAnimationBlurFadeIn
                as="p"
                delay={0.22}
                duration={0.5}
                className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-3xl mx-auto"
              >
                DKP Academy is open to motivated students seeking practical industry exposure to
                complement their academic foundation.
              </TextAnimationBlurFadeIn>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {targetAudienceList.map((aud, idx) => {
                const IconComponent =
                  aud.iconName === 'GraduationCap'
                    ? GraduationCap
                    : aud.iconName === 'Code2'
                    ? Code2
                    : aud.iconName === 'Palette'
                    ? Palette
                    : TrendingUp;

                return (
                  <motion.div
                    key={aud.id}
                    initial={{ opacity: 0, filter: 'blur(10px)', y: 20 }}
                    whileInView={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
                    viewport={{ once: true, margin: '-20px' }}
                    transition={{ duration: 0.5, delay: (idx % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full flex"
                  >
                    <Tilt
                      rotationFactor={11}
                      className="p-6 rounded-xl bg-white border border-neutral-200/90 hover:border-[#FFD60A] hover:shadow-xl transition-all duration-300 flex flex-col justify-between w-full shadow-sm select-none"
                    >
                      <div>
                        <div className="w-12 h-12 rounded-xl bg-[#004D86] text-[#FFD60A] flex items-center justify-center mb-5 shadow-sm">
                          <IconComponent className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-neutral-900 mb-2">{aud.title}</h3>
                        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                          {aud.description}
                        </p>
                      </div>
                    </Tilt>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* Standard Agency Footer (Shared component - Unchanged) */}
      <Footer />
    </div>
  );
};
