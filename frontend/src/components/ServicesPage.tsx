import { useNavigation } from '../hooks/useNavigation';
import { serviceCategories } from '../data/servicesData';
import { Navbar } from './Navbar';
import { Footer } from './layout/Footer';
import { ServiceCard } from './ServiceCard';
import { TextAnimationBlurFadeIn, BlurFadeIn } from '@/components/ui/text-animation-blur-fade-in';
import {
  IconArrowRight,
  IconChevronRight,
} from '@tabler/icons-react';

export const ServicesPage = () => {
  const { navigateTo, setSelectedServiceForInquiry } = useNavigation();

  const handleEnquire = (serviceName: string) => {
    setSelectedServiceForInquiry(serviceName);
    navigateTo('contact', 'enquiry-form');
  };

  return (
    <div className="min-h-screen bg-[#004D86] text-neutral-900 flex flex-col w-full selection:bg-[#FFD60A] selection:text-[#002244]">
      {/* Integrated Floating Navbar & Header */}
      <div className="relative w-full bg-[#004D86]">
        <Navbar />

        {/* Cinematic Services Hero Section */}
        <section className="relative w-full pt-28 pb-12 sm:pt-36 sm:pb-16 px-4 sm:px-8 lg:px-12 overflow-hidden select-none">
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
              className="absolute right-[5%] top-[20%] w-[400px] h-[300px] rounded-full"
              style={{
                background:
                  'radial-gradient(circle, rgba(30, 41, 59, 0.3) 0%, transparent 70%)',
                filter: 'blur(45px)',
              }}
            />
          </div>

          <div className="relative z-10 max-w-[1240px] mx-auto text-center">
            {/* Main Heading with Blur-Fade Reveal */}
            <TextAnimationBlurFadeIn
              as="h1"
              delay={0.1}
              duration={0.6}
              className="text-4xl sm:text-6xl md:text-7xl font-black text-[#FFFFFF] tracking-tight uppercase mb-6"
            >
              What Do We Do
            </TextAnimationBlurFadeIn>

            {/* Supporting Copy with Blur-Fade Reveal */}
            <TextAnimationBlurFadeIn
              as="p"
              delay={0.25}
              duration={0.5}
              className="max-w-3xl mx-auto text-base sm:text-xl text-neutral-300 leading-relaxed font-normal mb-8"
            >
              We combine technology, creativity and strategic marketing to help businesses build their digital presence, strengthen their brand and generate measurable growth.
            </TextAnimationBlurFadeIn>

            {/* CTA Buttons with Blur-Fade Reveal */}
            <BlurFadeIn delay={0.35} duration={0.5} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigateTo('contact', 'enquiry-form')}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-full bg-[#FFD60A] hover:bg-[#FFE047] text-[#002244] font-bold text-sm shadow-[0_4px_20px_rgba(255,214,10,0.35)] hover:shadow-[0_6px_25px_rgba(255,214,10,0.5)] transition-all duration-200 cursor-pointer"
              >
                <span>Discuss Your Project</span>
                <IconArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#technology-solutions"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-semibold text-sm border border-white/10 transition-colors"
              >
                <span>Explore 5 Core Capabilities</span>
              </a>
            </BlurFadeIn>
          </div>
        </section>
      </div>

      {/* Main Content: 5 Category Sections in Strict Specified Order */}
      <main className="relative w-full bg-neutral-50 flex-1">
        {serviceCategories.map((category, catIdx) => (
          <section
            key={category.id}
            id={category.slug}
            className={`w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-12 ${
              catIdx % 2 === 0 ? 'bg-white' : 'bg-neutral-50/80'
            } border-b border-neutral-200/80`}
          >
            <div className="max-w-[1240px] mx-auto">
              
              {/* Category Introduction Banner featuring Title-Card Image with Blur-Fade Reveal */}
              <BlurFadeIn
                delay={0.1}
                duration={0.6}
                className="relative rounded-2xl overflow-hidden shadow-xl mb-12 sm:mb-16 border border-white/20 bg-[#003E6D]"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[300px]">
                  
                  {/* Banner Content (Spans 7 cols on desktop) */}
                  <div className="lg:col-span-7 p-6 sm:p-10 lg:p-12 flex flex-col justify-center relative z-10 text-white bg-gradient-to-r from-[#003E6D] via-[#00345C] to-[#003E6D]/95">
                    <div className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#FFD60A] mb-3">
                      <span>{category.services.length} Specialized Services</span>
                    </div>

                    <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3 tracking-tight">
                      {category.title}
                    </h2>

                    <p className="text-xs sm:text-sm font-semibold text-[#FFD60A] uppercase tracking-wide mb-3">
                      {category.subtitle}
                    </p>

                    <p className="text-sm sm:text-base text-neutral-100 leading-relaxed max-w-xl mb-6">
                      {category.description}
                    </p>

                    <div>
                      <button
                        onClick={() => handleEnquire(category.title)}
                        className="inline-flex items-center space-x-2 text-xs sm:text-sm font-bold text-[#002244] bg-[#FFD60A] hover:bg-[#FFE047] px-5 py-2.5 rounded-lg shadow-md transition-all cursor-pointer"
                      >
                        <span>Inquire About {category.title}</span>
                        <IconChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Banner Image Visual (Spans 5 cols on desktop) */}
                  <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full overflow-hidden bg-[#003E6D]">
                    <img
                      src={category.titleCardImage}
                      alt={category.titleCardAlt}
                      width={735}
                      height={490}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 filter brightness-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-l from-transparent via-[#003E6D]/30 to-[#003E6D] pointer-events-none" />
                  </div>

                </div>
              </BlurFadeIn>

              {/* Service Cards Grid (Using matching individual images and ClippedCircle hover effect) */}
              <div
                className={`grid grid-cols-1 ${
                  category.services.length === 3
                    ? 'sm:grid-cols-2 lg:grid-cols-3'
                    : category.services.length === 5
                    ? 'sm:grid-cols-2 lg:grid-cols-3'
                    : 'sm:grid-cols-2 lg:grid-cols-4'
                } gap-6 sm:gap-8 items-stretch`}
              >
                {category.services.map((service, sIdx) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    categoryIndex={catIdx}
                    serviceIndex={sIdx}
                    onEnquire={handleEnquire}
                  />
                ))}
              </div>

            </div>
          </section>
        ))}

        {/* Closing Contact CTA Section */}
        <section className="w-full bg-[#004D86] text-white py-16 sm:py-20 px-4 sm:px-8 lg:px-12 border-t border-white/20 select-none">
          <div className="max-w-[1000px] mx-auto text-center">
            <span className="inline-block text-xs font-bold uppercase tracking-wider text-[#FFD60A] mb-3">
              Start Your Project
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase mb-4">
              Ready to Accelerate Your Brand?
            </h2>
            <p className="text-sm sm:text-base text-neutral-100 max-w-2xl mx-auto mb-8 leading-relaxed">
              Whether you need enterprise web engineering, high-concept commercial film production, or scalable lead generation campaigns, our Bengaluru teams are ready to deliver.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={() => navigateTo('contact', 'enquiry-form')}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-full bg-[#FFD60A] hover:bg-[#FFE047] text-[#002244] font-bold text-sm shadow-[0_4px_20px_rgba(255,214,10,0.35)] transition-all cursor-pointer"
              >
                <span>Discuss Your Project</span>
                <IconArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigateTo('contact', 'branch-map')}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-semibold text-sm border border-white/10 transition-colors cursor-pointer"
              >
                <span>Locate Our 3 Branches</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Global Shared Footer */}
      <Footer />
    </div>
  );
};
