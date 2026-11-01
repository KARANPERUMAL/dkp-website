import { useState, useMemo } from 'react';
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

export const AcademyPage = () => {
  const { navigateTo, setSelectedPositionForApplication } = useNavigation();

  // Domain filtering state
  const [selectedCategory, setSelectedCategory] = useState<
    'All' | 'Technology' | 'Design & Creative' | 'Digital Marketing'
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

  const categories: Array<'All' | 'Technology' | 'Design & Creative' | 'Digital Marketing'> = [
    'All',
    'Technology',
    'Design & Creative',
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
          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#FFFFFF] tracking-tight leading-[1.08] mb-4 sm:mb-6 max-w-4xl mx-auto">
            DKP Academy
          </h1>

          {/* Main Headline */}
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-[#FFD60A] tracking-tight max-w-3xl mx-auto mb-4 sm:mb-6 leading-snug">
            Learn Skills. Build Real Projects. Shape Your Future.
          </p>

          {/* Supporting Copy */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-200 leading-relaxed font-normal mb-8 sm:mb-10">
            Explore internship opportunities at DKP Innovations and gain practical exposure across
            technology, design, digital marketing and creative disciplines.
          </p>

          {/* Primary & Secondary CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
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
          </div>
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
              <span className="text-xs font-bold text-[#004D86] uppercase tracking-widest mb-3 block">
                About The Initiative
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral-900 tracking-tight mb-4 sm:mb-6">
                Practical Skill Development for Tomorrow’s Creators
              </h2>
              <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
                DKP Academy is a dedicated learning and internship initiative by{' '}
                <strong className="text-neutral-900 font-bold">DKP Innovations</strong>. Designed
                specifically for college students and recent graduates, our mission is to bridge the
                gap between academic coursework and real-world commercial delivery through guided,
                project-oriented engagement.
              </p>
            </div>

            {/* 5 Pillars of Learning Approach + Philosophy Note */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* Pillar 1 */}
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200/90 hover:border-[#004D86]/40 transition-all duration-300 flex flex-col shadow-sm hover:shadow-md">
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

              {/* Pillar 2 */}
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200/90 hover:border-[#004D86]/40 transition-all duration-300 flex flex-col shadow-sm hover:shadow-md">
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

              {/* Pillar 3 */}
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200/90 hover:border-[#004D86]/40 transition-all duration-300 flex flex-col shadow-sm hover:shadow-md">
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

              {/* Pillar 4 */}
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200/90 hover:border-[#004D86]/40 transition-all duration-300 flex flex-col shadow-sm hover:shadow-md">
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

              {/* Pillar 5 */}
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200/90 hover:border-[#004D86]/40 transition-all duration-300 flex flex-col shadow-sm hover:shadow-md">
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

              {/* Program Philosophy Card on White */}
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-neutral-200/90 hover:border-[#004D86]/40 transition-all duration-300 flex flex-col justify-center shadow-sm hover:shadow-md">
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
              <span className="text-xs font-bold text-[#004D86] uppercase tracking-widest mb-3 block">
                Available Opportunities
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral-900 tracking-tight mb-4">
                Explore Internship Domains
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-3xl mx-auto">
                Every internship track reflects active commercial services delivered by DKP Innovations.
                Choose the domain that matches your career passion.
              </p>

              {/* Category Filter Pills on White */}
              <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mt-8">
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
              </div>
            </div>

            {/* Domain Cards Grid on White */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
              {filteredDomains.map((domain: InternshipDomain) => (
                <div
                  key={domain.id}
                  className="group rounded-2xl bg-white border border-neutral-200 hover:border-[#004D86]/40 transition-all duration-300 flex flex-col overflow-hidden shadow-sm hover:shadow-xl"
                >
                  {/* Thumbnail Image */}
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-neutral-100">
                    <img
                      src={domain.image}
                      alt={domain.alt}
                      width={600}
                      height={375}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/40 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute top-3 left-3">
                      <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#004D86] text-[#FFD60A] border border-white/20 backdrop-blur-sm shadow-sm">
                        {domain.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-neutral-900 mb-2.5 group-hover:text-[#004D86] transition-colors">
                        {domain.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed mb-5">
                        {domain.shortDescription}
                      </p>

                      {/* Skills Covered Chips */}
                      <div className="mb-6">
                        <span className="block text-[11px] font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                          Skills You'll Explore:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {domain.skills.map((skill) => (
                            <span
                              key={skill}
                              className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-neutral-100 text-neutral-700 border border-neutral-200"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Apply Action Button with Integration */}
                    <button
                      type="button"
                      onClick={() => handleApplyForDomain(domain.id, domain.careerPositionTitle)}
                      className="w-full inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-[#FFD60A] hover:bg-[#FFE047] text-[#002244] font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer shadow-sm hover:shadow-[0_2px_14px_rgba(255,214,10,0.3)]"
                    >
                      <span>Apply for this Domain</span>
                      <IconArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
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
              <span className="text-xs font-bold text-[#004D86] uppercase tracking-widest mb-3 block">
                Eligibility & Profiles
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral-900 tracking-tight mb-4">
                Who Can Apply?
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed max-w-3xl mx-auto">
                DKP Academy is open to motivated students seeking practical industry exposure to
                complement their academic foundation.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {targetAudienceList.map((aud) => {
                const IconComponent =
                  aud.iconName === 'GraduationCap'
                    ? GraduationCap
                    : aud.iconName === 'Code2'
                    ? Code2
                    : aud.iconName === 'Palette'
                    ? Palette
                    : TrendingUp;

                return (
                  <div
                    key={aud.id}
                    className="p-6 rounded-2xl bg-white border border-neutral-200/90 hover:border-[#004D86]/40 hover:shadow-md transition-all duration-300 flex flex-col"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#004D86] text-[#FFD60A] flex items-center justify-center mb-5 shadow-sm">
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-neutral-900 mb-2">{aud.title}</h3>
                    <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                      {aud.description}
                    </p>
                  </div>
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
