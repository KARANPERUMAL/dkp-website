import { useState, type FormEvent } from 'react';
import { useNavigation } from '../hooks/useNavigation';
import { Navbar } from './Navbar';
import { Footer } from './layout/Footer';
import { BranchMap } from './BranchMap';
import { CustomSelect } from './ui/custom-select';
import { TextAnimationBlurFadeIn } from '@/components/ui/text-animation-blur-fade-in';
import { submitContactMessage } from '../services/contactService';
import {
  OFFICIAL_PHONE,
  OFFICIAL_PHONE_TEL,
  OFFICIAL_EMAIL,
  OFFICIAL_EMAIL_MAILTO,
  branchLocations,
} from '../data/branchesData';
import { OFFICIAL_SOCIAL_LINKS } from '../data/socialLinks';
import { getAllServices } from '../data/servicesData';
import {
  IconPhone,
  IconMail,
  IconCopy,
  IconCheck,
  IconSend,
  IconClock,
  IconAlertCircle,
  IconDirections,
} from '@tabler/icons-react';

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  service: string;
  message: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export const ContactPage = () => {
  const { selectedServiceForInquiry } = useNavigation();
  const allServices = getAllServices();

  const [formData, setFormData] = useState<FormState>({
    fullName: '',
    email: '',
    phone: '',
    service: selectedServiceForInquiry || 'Website Design & Development',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{ referenceId: string; message: string } | null>(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(OFFICIAL_EMAIL);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(OFFICIAL_PHONE);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!formData.fullName.trim()) {
      errs.fullName = 'Please enter your full name.';
    } else if (formData.fullName.trim().length < 2) {
      errs.fullName = 'Full name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    if (formData.phone.trim() && !/^[0-9+()\- ]{7,20}$/.test(formData.phone.trim())) {
      errs.phone = 'Please enter a valid telephone number.';
    }

    if (!formData.message.trim()) {
      errs.message = 'Please share a brief description of your project requirements.';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters long.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const res = await submitContactMessage({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        message: formData.message,
      });

      setIsSubmitting(false);

      if (res.success && res.referenceId) {
        setSubmissionResult({
          referenceId: res.referenceId,
          message: res.message || 'Your inquiry has been received successfully.',
        });
        setIsSubmitted(true);
      } else {
        setSubmissionError(res.error || 'Failed to submit inquiry. Your entered data has been preserved.');
      }
    } catch (err: unknown) {
      setIsSubmitting(false);
      const msg = err instanceof Error ? err.message : 'Unknown network failure';
      setSubmissionError(`Submission failed: ${msg}. Your entered information has been preserved.`);
    }
  };

  const handleResetForm = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      service: 'Website Design & Development',
      message: '',
    });
    setErrors({});
    setIsSubmitted(false);
    setSubmissionResult(null);
    setSubmissionError(null);
  };

  return (
    <div className="min-h-screen bg-[#004D86] text-neutral-900 flex flex-col w-full selection:bg-[#FFD60A] selection:text-[#002244]">
      {/* Floating Navbar & Header */}
      <div className="relative w-full bg-[#004D86]">
        <Navbar />

        {/* Contact Hero Section */}
        <section className="relative w-full pt-28 pb-16 sm:pt-36 sm:pb-20 px-4 sm:px-8 lg:px-12 overflow-hidden select-none">
          {/* Atmospheric Lighting */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div
              className="absolute left-1/2 -top-[15%] -translate-x-1/2 w-[650px] h-[360px] rounded-full"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(255, 214, 10, 0.16) 0%, rgba(255, 214, 10, 0.05) 45%, transparent 70%)',
                filter: 'blur(50px)',
              }}
            />
          </div>

          <div className="relative z-10 max-w-[1100px] mx-auto text-center">
            {/* Main Heading with Blur-Fade Reveal */}
            <TextAnimationBlurFadeIn
              as="h1"
              delay={0.15}
              duration={0.5}
              className="text-3xl sm:text-5xl md:text-6xl font-black text-[#FFFFFF] tracking-tight mb-6"
            >
              Let's Build Something Great Together
            </TextAnimationBlurFadeIn>

            {/* Supporting Copy with Blur-Fade Reveal */}
            <TextAnimationBlurFadeIn
              as="p"
              delay={0.25}
              duration={0.5}
              className="max-w-2xl mx-auto text-base sm:text-lg text-neutral-300 leading-relaxed font-normal"
            >
              Tell us about your business goals and our team will help you explore the right digital, creative and marketing solutions.
            </TextAnimationBlurFadeIn>
          </div>
        </section>
      </div>

      {/* Main Content Sections: Contact Cards + Form + Interactive 3-Branch Map */}
      <main className="relative w-full bg-white flex-1">
        
        {/* Section 1: Official Contact Cards */}
        <section className="w-full pt-12 pb-10 px-4 sm:px-8 lg:px-12 border-b border-neutral-100">
          <div className="max-w-[1240px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Phone Card */}
              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/90 hover:border-[#FFD60A]/50 transition-all flex flex-col justify-between shadow-sm">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-[#FFD60A]/20 text-[#854D0E] flex items-center justify-center mb-4">
                    <IconPhone className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    Direct Phone Line
                  </span>
                  <a
                    href={OFFICIAL_PHONE_TEL}
                    className="text-lg sm:text-xl font-bold text-neutral-900 hover:text-[#854D0E] transition-colors block mb-2"
                  >
                    {OFFICIAL_PHONE}
                  </a>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Available for consultations, production planning, and strategic project inquiries.
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-200/60 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <a
                      href={OFFICIAL_PHONE_TEL}
                      className="text-xs font-semibold text-[#854D0E] hover:text-[#713f12] inline-flex items-center space-x-1"
                    >
                      <span>Call Now</span>
                      <span>&rarr;</span>
                    </a>
                    <span className="text-neutral-300">•</span>
                    <a
                      href={OFFICIAL_SOCIAL_LINKS.whatsapp.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Chat with DKP Innovations on WhatsApp"
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center space-x-1"
                    >
                      <span>WhatsApp</span>
                      <span>&rarr;</span>
                    </a>
                  </div>
                  <button
                    onClick={handleCopyPhone}
                    className="text-xs text-neutral-500 hover:text-neutral-800 inline-flex items-center space-x-1 cursor-pointer font-medium"
                    aria-label="Copy phone number"
                  >
                    {copiedPhone ? (
                      <>
                        <IconCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <IconCopy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Email Card */}
              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/90 hover:border-[#FFD60A]/50 transition-all flex flex-col justify-between shadow-sm">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-[#FFD60A]/20 text-[#854D0E] flex items-center justify-center mb-4">
                    <IconMail className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    Official Email
                  </span>
                  <a
                    href={OFFICIAL_EMAIL_MAILTO}
                    className="text-sm sm:text-base font-bold text-neutral-900 hover:text-[#854D0E] transition-colors block mb-2 break-all"
                  >
                    {OFFICIAL_EMAIL}
                  </a>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Send detailed briefs, RFPs, and agency collaboration proposals directly to our inbox.
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-200/60 flex items-center justify-between">
                  <a
                    href={OFFICIAL_EMAIL_MAILTO}
                    className="text-xs font-semibold text-[#854D0E] hover:text-[#713f12] inline-flex items-center space-x-1"
                  >
                    <span>Write Email</span>
                    <span>&rarr;</span>
                  </a>
                  <button
                    onClick={handleCopyEmail}
                    className="text-xs text-neutral-500 hover:text-neutral-800 inline-flex items-center space-x-1 cursor-pointer font-medium"
                    aria-label="Copy email address"
                  >
                    {copiedEmail ? (
                      <>
                        <IconCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600 font-semibold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <IconCopy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Working Hours & Response Card */}
              <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-200/90 hover:border-[#FFD60A]/50 transition-all flex flex-col justify-between shadow-sm">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-[#FFD60A]/20 text-[#854D0E] flex items-center justify-center mb-4">
                    <IconClock className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                    Operating Hours
                  </span>
                  <div className="text-base sm:text-lg font-bold text-neutral-900 mb-1">
                    Mon – Sat: 9:30 AM – 6:30 PM
                  </div>
                  <div className="text-xs font-semibold text-[#854D0E] mb-2">
                    India Standard Time (IST)
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Inquiries received outside business hours are answered on the following business morning.
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-neutral-200/60 flex items-center justify-between text-xs text-neutral-500">
                  <span className="flex items-center space-x-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Team Available</span>
                  </span>
                  <span>Average Response: &lt; 2 hrs</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Section 2: Project Enquiry Form */}
        <section id="enquiry-form" className="w-full py-16 sm:py-20 px-4 sm:px-8 lg:px-12 bg-neutral-50/50 border-b border-neutral-200/80">
          <div className="max-w-[860px] mx-auto bg-white rounded-2xl border border-neutral-200/90 shadow-xl p-6 sm:p-10 lg:p-12">
            
            <div className="text-center max-w-xl mx-auto mb-8">
              <span className="text-xs font-bold uppercase tracking-wider text-[#854D0E] mb-1.5 block">
                Project Inquiry
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mb-2">
                Tell Us About Your Project
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                Complete the form below and an account director will review your goals and schedule a strategic discovery session.
              </p>
            </div>

            {isSubmitted ? (
              <div className="p-8 sm:p-10 rounded-xl bg-[#FFD60A]/10 border border-[#FFD60A]/30 text-center animate-fadeIn">
                <div className="w-14 h-14 rounded-full bg-[#FFD60A] text-[#002244] flex items-center justify-center mx-auto mb-4 shadow-md">
                  <IconCheck className="w-7 h-7 stroke-[2.5]" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2">
                  Inquiry Received Successfully!
                </h3>
                <p className="text-sm text-neutral-600 max-w-md mx-auto mb-4 leading-relaxed">
                  Thank you, <strong className="text-neutral-900">{formData.fullName}</strong>. Our team has received your project details for <strong className="text-neutral-900">{formData.service}</strong> and will connect at <strong className="text-neutral-900">{formData.email}</strong> shortly.
                </p>
                <div className="inline-block p-3 rounded-lg bg-white border border-[#FFD60A]/30 text-xs text-neutral-600 mb-6">
                  <span className="font-semibold text-neutral-500">Inquiry Reference ID:</span>{' '}
                  <span className="font-mono font-bold text-[#854D0E]">{submissionResult?.referenceId}</span>
                </div>
                <div>
                  <button
                    onClick={handleResetForm}
                    className="px-6 py-2.5 rounded-lg bg-[#004D86] hover:bg-[#003E6D] text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                
                {/* Error Banner */}
                {submissionError && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start space-x-2.5">
                    <IconAlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="flex-1 leading-relaxed">
                      <strong className="font-semibold block mb-0.5">Submission Notice</strong>
                      <span>{submissionError}</span>
                    </div>
                  </div>
                )}

                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="fullName" className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Full Name <span className="text-[#854D0E]">*</span>
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={formData.fullName}
                      onChange={(e) => {
                        setFormData({ ...formData, fullName: e.target.value });
                        if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                      }}
                      className={`w-full px-4 py-3 rounded-lg border text-sm text-neutral-900 bg-white placeholder-neutral-400 focus:outline-none focus:ring-2 transition-all ${
                        errors.fullName
                          ? 'border-rose-400 focus:ring-rose-200'
                          : 'border-neutral-200 focus:border-[#FFD60A] focus:ring-[#FFD60A]/30'
                      }`}
                      aria-invalid={Boolean(errors.fullName)}
                      aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                    />
                    {errors.fullName && (
                      <span id="fullName-error" className="block text-xs text-rose-600 font-medium mt-1">
                        {errors.fullName}
                      </span>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Work Email <span className="text-[#854D0E]">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="e.g. rahul@company.com"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: undefined });
                      }}
                      className={`w-full px-4 py-3 rounded-lg border text-sm text-neutral-900 bg-white placeholder-neutral-400 focus:outline-none focus:ring-2 transition-all ${
                        errors.email
                          ? 'border-rose-400 focus:ring-rose-200'
                          : 'border-neutral-200 focus:border-[#FFD60A] focus:ring-[#FFD60A]/30'
                      }`}
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'email-error' : undefined}
                    />
                    {errors.email && (
                      <span id="email-error" className="block text-xs text-rose-600 font-medium mt-1">
                        {errors.email}
                      </span>
                    )}
                  </div>
                </div>

                {/* Phone & Service Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="phone" className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Phone Number <span className="text-neutral-400 font-normal">(Optional)</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (errors.phone) setErrors({ ...errors, phone: undefined });
                      }}
                      className={`w-full px-4 py-3 rounded-lg border text-sm text-neutral-900 bg-white placeholder-neutral-400 focus:outline-none focus:ring-2 transition-all ${
                        errors.phone
                          ? 'border-rose-400 focus:ring-rose-200'
                          : 'border-neutral-200 focus:border-[#FFD60A] focus:ring-[#FFD60A]/30'
                      }`}
                      aria-invalid={Boolean(errors.phone)}
                      aria-describedby={errors.phone ? 'phone-error' : undefined}
                    />
                    {errors.phone && (
                      <span id="phone-error" className="block text-xs text-rose-600 font-medium mt-1">
                        {errors.phone}
                      </span>
                    )}
                  </div>

                  <div>
                    <label htmlFor="service" className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                      Service of Interest
                    </label>
                    <CustomSelect
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                      options={allServices.map((srv) => ({
                        value: srv.name,
                        label: `${srv.category}: ${srv.name}`,
                        category: srv.category,
                      }))}
                      buttonClassName="rounded-lg border-neutral-200"
                      placeholder="Select a service..."
                    />
                  </div>
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Project Requirements / Scope <span className="text-[#854D0E]">*</span>
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Briefly describe your objectives, timeline, current challenges or desired outcomes..."
                    value={formData.message}
                    onChange={(e) => {
                      setFormData({ ...formData, message: e.target.value });
                      if (errors.message) setErrors({ ...errors, message: undefined });
                    }}
                    className={`w-full px-4 py-3 rounded-lg border text-sm text-neutral-900 bg-white placeholder-neutral-400 focus:outline-none focus:ring-2 transition-all resize-y ${
                      errors.message
                        ? 'border-rose-400 focus:ring-rose-200'
                        : 'border-neutral-200 focus:border-[#FFD60A] focus:ring-[#FFD60A]/30'
                    }`}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'message-error' : undefined}
                  />
                  {errors.message && (
                    <span id="message-error" className="block text-xs text-rose-600 font-medium mt-1">
                      {errors.message}
                    </span>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full inline-flex items-center justify-center space-x-2 py-3.5 px-6 rounded-lg bg-[#FFD60A] hover:bg-[#FFE047] text-[#002244] font-bold text-sm shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span>Validating & Dispatching...</span>
                    ) : (
                      <>
                        <IconSend className="w-4 h-4" />
                        <span>Send Project Inquiry</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}

          </div>
        </section>

        {/* Section 3: Interactive Map with All 3 Bengaluru Branches */}
        <section id="branch-map" className="w-full py-16 sm:py-20 px-4 sm:px-8 lg:px-12 bg-white">
          <div className="max-w-[1240px] mx-auto">
            
            {/* Section Header */}
            <div className="max-w-2xl mb-10">
              <span className="text-xs font-bold uppercase tracking-wider text-[#854D0E] mb-2 block">
                Physical Presence
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 mb-3 tracking-tight">
                Our Bengaluru Branch Locations
              </h2>
              <p className="text-sm sm:text-base text-neutral-600 leading-relaxed">
                DKP Innovation operates three strategically positioned branches across Bengaluru to coordinate client consulting, creative production, and engineering operations. Select a branch below or explore the interactive map.
              </p>
            </div>

            {/* Interactive Leaflet Map with Synchronized Branch Selector */}
            <BranchMap />

            {/* Static Address Verification Cards for Print & Accessibility */}
            <div className="mt-12 pt-10 border-t border-neutral-200 grid grid-cols-1 md:grid-cols-3 gap-6">
              {branchLocations.map((b, i) => (
                <div key={b.id} className="p-5 rounded-xl bg-neutral-50/70 border border-neutral-200/80">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="w-5 h-5 rounded-full bg-[#FFD60A] text-[#002244] text-[10px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <span className="text-xs font-bold text-neutral-900">{b.name}</span>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed mb-3">
                    {b.address}
                  </p>
                  <div className="text-[11px] text-neutral-500 mb-3">
                    <strong className="text-neutral-700">Landmark:</strong> {b.landmark}
                  </div>
                  <div className="flex items-center space-x-3 text-xs">
                    <a
                      href={b.directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#854D0E] hover:text-[#713f12] font-semibold inline-flex items-center space-x-1"
                    >
                      <IconDirections className="w-3.5 h-3.5" />
                      <span>Directions</span>
                    </a>
                    <span className="text-neutral-300">•</span>
                    <a
                      href={`tel:${b.phone.replace(/[^0-9+]/g, '')}`}
                      className="text-neutral-600 hover:text-neutral-900 font-medium"
                    >
                      {b.phone}
                    </a>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

      </main>

      {/* Global Shared Footer */}
      <Footer />
    </div>
  );
};
