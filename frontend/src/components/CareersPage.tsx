import { useState, useRef, type FormEvent, type ChangeEvent } from 'react';
import { Navbar } from './Navbar';
import { Footer } from './layout/Footer';
import { useNavigation } from '../context/NavigationContext';
import {
  openPositions,
  departmentOptions,
  experienceLevelOptions,
  workArrangementOptions,
  type JobPosition,
} from '../data/careersData';
import { submitCareerApplication } from '../services/careersService';
import {
  TextAnimationBlurFadeIn,
  BlurFadeIn,
} from '@/components/ui/text-animation-blur-fade-in';
import { CustomSelect } from './ui/custom-select';
import {
  Briefcase,
  CheckCircle2,
  AlertCircle,
  FileText,
  UploadCloud,
  X,
  MapPin,
  Clock,
  Building2,
  ArrowRight,
} from 'lucide-react';
import { IconArrowRight } from '@tabler/icons-react';

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  experienceLevel: string;
  workArrangement: string;
  keySkills: string;
  coverLetter: string;
  linkedInUrl: string;
  portfolioUrl: string;
  privacyConsent: boolean;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  phone?: string;
  position?: string;
  department?: string;
  experienceLevel?: string;
  workArrangement?: string;
  keySkills?: string;
  coverLetter?: string;
  resumeFile?: string;
  linkedInUrl?: string;
  portfolioUrl?: string;
  privacyConsent?: string;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];

export const CareersPage = () => {
  const { selectedPositionForApplication, setSelectedPositionForApplication } =
    useNavigation();

  // Form State
  const [formData, setFormData] = useState<FormState>({
    fullName: '',
    email: '',
    phone: '',
    position: selectedPositionForApplication || 'General Application',
    department: 'IT & Digital Solutions',
    experienceLevel: 'Entry Level',
    workArrangement: 'Hybrid',
    keySkills: '',
    coverLetter: '',
    linkedInUrl: '',
    portfolioUrl: '',
    privacyConsent: false,
  });

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<{
    referenceId: string;
    message: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Smooth scroll helper
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Select a role from Open Positions and scroll to form
  const handleSelectRole = (roleTitle: string) => {
    setFormData((prev) => ({ ...prev, position: roleTitle }));
    if (setSelectedPositionForApplication) {
      setSelectedPositionForApplication(roleTitle);
    }
    scrollTo('application-form');
  };

  // Resume File Handler
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(fileExt)) {
      setErrors((prev) => ({
        ...prev,
        resumeFile: 'Please upload a PDF, DOC, or DOCX document.',
      }));
      setResumeFile(null);
      return;
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrors((prev) => ({
        ...prev,
        resumeFile: 'File size exceeds the 5 MB limit. Please upload a smaller file.',
      }));
      setResumeFile(null);
      return;
    }

    setResumeFile(file);
    setErrors((prev) => ({ ...prev, resumeFile: undefined }));
  };

  const handleRemoveFile = () => {
    setResumeFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Validation
  const validateForm = (): boolean => {
    const errs: FormErrors = {};

    // 1. Full Name
    if (!formData.fullName.trim()) {
      errs.fullName = 'Full Name is required.';
    } else if (formData.fullName.trim().length < 2) {
      errs.fullName = 'Full Name must be at least 2 characters.';
    }

    // 2. Email
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please provide a valid email address (e.g. name@example.com).';
    }

    // 3. Phone
    if (!formData.phone.trim()) {
      errs.phone = 'Phone number is required.';
    } else if (!/^[0-9+()\-\s]{7,20}$/.test(formData.phone.trim())) {
      errs.phone = 'Please provide a valid telephone number with country code.';
    }

    // 4. Position
    if (!formData.position.trim()) {
      errs.position = 'Please select the position you are applying for.';
    }

    // 5. Department
    if (!formData.department.trim()) {
      errs.department = 'Please select a department of interest.';
    }

    // 6. Experience Level
    if (!formData.experienceLevel.trim()) {
      errs.experienceLevel = 'Please select your experience level.';
    }

    // 7. Preferred Work Arrangement
    if (!formData.workArrangement.trim()) {
      errs.workArrangement = 'Please select your preferred work arrangement.';
    }

    // 8. Key Skills
    if (!formData.keySkills.trim()) {
      errs.keySkills = 'Please list your key skills or areas of expertise.';
    } else if (formData.keySkills.trim().length < 2) {
      errs.keySkills = 'Key skills must be at least 2 characters.';
    }

    // 9. Resume File
    if (!resumeFile) {
      errs.resumeFile = 'Please upload your Resume or CV (PDF, DOC, or DOCX, max 5 MB).';
    }

    // 10. Cover Letter
    if (!formData.coverLetter.trim()) {
      errs.coverLetter = 'Please provide a brief cover letter or introduction.';
    } else if (formData.coverLetter.trim().length < 20) {
      errs.coverLetter = 'Cover letter / introduction must be at least 20 characters.';
    }

    // 11. LinkedIn URL (optional)
    if (
      formData.linkedInUrl.trim() &&
      !/^https?:\/\/(www\.)?linkedin\.com\/.+/i.test(formData.linkedInUrl.trim()) &&
      !/^https?:\/\/.+/i.test(formData.linkedInUrl.trim())
    ) {
      errs.linkedInUrl = 'Please provide a valid URL starting with http:// or https://';
    }

    // 12. Portfolio / GitHub URL (optional)
    if (
      formData.portfolioUrl.trim() &&
      !/^https?:\/\/.+/i.test(formData.portfolioUrl.trim())
    ) {
      errs.portfolioUrl = 'Please provide a valid URL starting with http:// or https://';
    }

    // 13. Privacy Consent
    if (!formData.privacyConsent) {
      errs.privacyConsent = 'You must consent to recruitment processing to submit your application.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);

    if (!validateForm()) {
      // Scroll to top of form to show validation message
      scrollTo('application-form');
      return;
    }

    if (!resumeFile) return;

    setIsSubmitting(true);

    try {
      const result = await submitCareerApplication({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        department: formData.department,
        experienceLevel: formData.experienceLevel,
        workArrangement: formData.workArrangement,
        keySkills: formData.keySkills,
        coverLetter: formData.coverLetter,
        linkedInUrl: formData.linkedInUrl,
        portfolioUrl: formData.portfolioUrl,
        privacyConsent: formData.privacyConsent,
        resumeFile,
      });

      setIsSubmitting(false);

      if (result.success) {
        setSubmissionSuccess({
          referenceId: result.applicationId || `DKP-${Date.now()}`,
          message:
            result.message ||
            'Your application has been received. Our talent acquisition team will review your qualifications against relevant openings.',
        });
      } else {
        // Display useful, transparent server or network error without faking success
        setSubmissionError(
          result.error ||
            'An error occurred while submitting your application. Your input has been saved. Please try submitting again.'
        );
      }
    } catch (err: unknown) {
      setIsSubmitting(false);
      const msg = err instanceof Error ? err.message : 'Unknown submission error';
      setSubmissionError(`Submission failed: ${msg}. Your application inputs have been preserved.`);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      position: 'General Application',
      department: 'IT & Digital Solutions',
      experienceLevel: 'Entry Level',
      workArrangement: 'Hybrid',
      keySkills: '',
      coverLetter: '',
      linkedInUrl: '',
      portfolioUrl: '',
      privacyConsent: false,
    });
    setResumeFile(null);
    setErrors({});
    setSubmissionError(null);
    setSubmissionSuccess(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-[#004D86] text-neutral-900 flex flex-col w-full selection:bg-[#FFD60A] selection:text-[#002244]">
      {/* Floating Centered Navbar */}
      <Navbar />

      {/* SECTION 1: CAREERS HERO SECTION */}
      <section className="relative w-full bg-[#004D86] pt-28 pb-16 sm:pt-36 sm:pb-24 px-4 sm:px-8 lg:px-12 overflow-hidden select-none border-b border-white/20">
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

        <div className="relative z-10 max-w-[1240px] mx-auto text-center">
          {/* Main Heading */}
          <TextAnimationBlurFadeIn
            as="h1"
            delay={0.15}
            staggerDuration={0.03}
            duration={0.6}
            className="text-4xl sm:text-6xl md:text-7xl font-black text-[#FFFFFF] tracking-tight mb-6 max-w-4xl mx-auto leading-[1.05]"
          >
            Build Your Career. Create Meaningful Impact.
          </TextAnimationBlurFadeIn>

          {/* Supporting Text */}
          <TextAnimationBlurFadeIn
            as="p"
            delay={0.28}
            duration={0.5}
            className="max-w-3xl mx-auto text-base sm:text-lg text-neutral-100 leading-relaxed font-normal mb-10"
          >
            Join a team that brings together technology, creativity, and digital strategy to help businesses grow. Explore opportunities to develop your skills, work on meaningful projects, and build your future with DKP Innovation.
          </TextAnimationBlurFadeIn>

          {/* Action CTAs */}
          <BlurFadeIn delay={0.4} duration={0.5} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => scrollTo('open-positions')}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-3.5 rounded-full bg-[#FFD60A] hover:bg-[#FFE047] text-[#002244] font-bold text-sm shadow-[0_4px_20px_rgba(255,214,10,0.35)] hover:shadow-[0_6px_25px_rgba(255,214,10,0.5)] transition-all duration-200 cursor-pointer"
            >
              <span>Explore Open Positions</span>
              <IconArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => scrollTo('application-form')}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-8 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white font-semibold text-sm border border-white/10 transition-colors cursor-pointer"
            >
              <span>Apply Now</span>
            </button>
          </BlurFadeIn>
        </div>
      </section>

      {/* MAIN CONTENT AREA: Open Positions & Job Application Form */}
      <main className="relative w-full bg-neutral-50 flex-1">
        {/* SECTION 2: OPEN POSITIONS */}
        <section id="open-positions" className="w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-12 border-b border-neutral-200/80">
          <div className="max-w-[1240px] mx-auto">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <TextAnimationBlurFadeIn
                as="span"
                delay={0.05}
                duration={0.4}
                className="text-xs font-bold text-[#854D0E] uppercase tracking-widest mb-2.5 block"
              >
                Current Opportunities
              </TextAnimationBlurFadeIn>
              <TextAnimationBlurFadeIn
                as="h2"
                delay={0.15}
                duration={0.5}
                className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral-900 tracking-tight mb-4"
              >
                Open Positions
              </TextAnimationBlurFadeIn>
              <TextAnimationBlurFadeIn
                as="p"
                delay={0.25}
                duration={0.5}
                className="text-base sm:text-lg text-neutral-600 leading-relaxed font-normal"
              >
                Explore our active vacancies across digital solutions, creative execution, and strategy.
              </TextAnimationBlurFadeIn>
            </div>

            {/* Dynamic Positions Rendering */}
            {openPositions.length === 0 ? (
              /* Clean Initial State when no vacancies are configured */
              <BlurFadeIn delay={0.2} duration={0.5} className="bg-white border border-neutral-200/90 rounded-3xl p-8 sm:p-14 text-center max-w-2xl mx-auto shadow-sm">
                <div className="w-14 h-14 rounded-2xl bg-[#FFD60A]/15 border border-[#FFD60A]/30 text-[#854D0E] flex items-center justify-center mx-auto mb-5">
                  <Briefcase className="w-7 h-7" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight mb-3">
                  No open positions at the moment.
                </h3>
                <p className="text-base text-neutral-600 leading-relaxed mb-8 max-w-lg mx-auto">
                  We're always interested in connecting with talented people. Submit your application below, and we'll consider your profile for suitable future opportunities.
                </p>
                <button
                  type="button"
                  onClick={() => scrollTo('application-form')}
                  className="inline-flex items-center space-x-2 px-7 py-3.5 rounded-full bg-[#FFD60A] hover:bg-[#FFE047] text-[#002244] font-bold text-sm shadow-md transition-all cursor-pointer"
                >
                  <span>Submit General Application</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </BlurFadeIn>
            ) : (
              /* Positions Grid when vacancies are configured */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
                {openPositions.map((pos: JobPosition, idx) => (
                  <BlurFadeIn
                    key={pos.id}
                    delay={0.1 + idx * 0.08}
                    duration={0.5}
                    className="bg-white border border-neutral-200/90 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-[#FFD60A]/50 transition-all duration-300"
                  >
                    <div>
                      {/* Department Badge */}
                      <span className="inline-block text-[11px] font-bold text-[#854D0E] uppercase tracking-wider bg-[#FFD60A]/15 border border-[#FFD60A]/30 rounded-full px-3 py-1 mb-4">
                        {pos.department}
                      </span>

                      {/* Title */}
                      <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 tracking-tight mb-3">
                        {pos.title}
                      </h3>

                      {/* Meta Pills */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 mb-4">
                        <span className="inline-flex items-center space-x-1">
                          <Building2 className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{pos.employmentType}</span>
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{pos.workArrangement}</span>
                        </span>
                        <span>•</span>
                        <span className="inline-flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                          <span>{pos.location}</span>
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-neutral-600 leading-relaxed mb-6 font-normal">
                        {pos.description}
                      </p>

                      {/* Required Skills */}
                      <div className="mb-6">
                        <span className="text-xs font-semibold text-neutral-700 block mb-2">
                          Key Skills:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {pos.requiredSkills.map((skill) => (
                            <span
                              key={skill}
                              className="text-xs px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-700 font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Apply Button */}
                    <button
                      type="button"
                      onClick={() => handleSelectRole(pos.title)}
                      className="w-full inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-[#FFD60A] hover:bg-[#FFE047] text-[#002244] font-bold text-sm transition-all shadow-sm cursor-pointer mt-4"
                    >
                      <span>Apply for this Role</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </BlurFadeIn>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SECTION 4: DEDICATED JOB APPLICATION FORM */}
        <section id="application-form" className="w-full py-16 sm:py-24 px-4 sm:px-8 lg:px-12 bg-white">
          <div className="max-w-[840px] mx-auto">
            {/* Header */}
            <div className="text-center mb-10 sm:mb-14">
              <TextAnimationBlurFadeIn
                as="span"
                delay={0.05}
                duration={0.4}
                className="text-xs font-bold text-[#854D0E] uppercase tracking-widest mb-2.5 block"
              >
                Join Our Team
              </TextAnimationBlurFadeIn>
              <TextAnimationBlurFadeIn
                as="h2"
                delay={0.15}
                duration={0.5}
                className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral-900 tracking-tight mb-4"
              >
                Take the Next Step in Your Career
              </TextAnimationBlurFadeIn>
              <TextAnimationBlurFadeIn
                as="p"
                delay={0.25}
                duration={0.5}
                className="text-base sm:text-lg text-neutral-600 leading-relaxed font-normal max-w-xl mx-auto"
              >
                Tell us about yourself, your skills, and the opportunities you're interested in. Our team can review your application for relevant openings.
              </TextAnimationBlurFadeIn>
            </div>

            {/* Submission Success Screen */}
            {submissionSuccess ? (
              <BlurFadeIn delay={0.1} duration={0.5} className="bg-neutral-50 border border-neutral-200/90 rounded-3xl p-8 sm:p-12 text-center shadow-sm">
                <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider block mb-2">
                  Application Submitted
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mb-3 tracking-tight">
                  Thank You for Applying!
                </h3>
                <p className="text-base text-neutral-600 leading-relaxed mb-6 max-w-lg mx-auto">
                  {submissionSuccess.message}
                </p>
                <div className="inline-block bg-white border border-neutral-200 rounded-xl px-4 py-2.5 mb-8 text-xs text-neutral-500 font-mono">
                  Application Reference ID:{' '}
                  <span className="font-bold text-neutral-900">
                    {submissionSuccess.referenceId}
                  </span>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-[#004D86] hover:bg-[#003E6D] text-white font-bold text-sm transition-all cursor-pointer"
                  >
                    <span>Submit Another Application</span>
                  </button>
                </div>
              </BlurFadeIn>
            ) : (
              /* The Application Form Card */
              <BlurFadeIn delay={0.2} duration={0.5} className="bg-neutral-50 border border-neutral-200/90 rounded-3xl p-6 sm:p-10 lg:p-12 shadow-sm">
                {/* Submission Error Banner */}
                {submissionError && (
                  <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start space-x-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="flex-1 text-sm leading-relaxed">
                      <strong className="font-semibold block mb-1">
                        Application Submission Status
                      </strong>
                      <p>{submissionError}</p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-6 sm:space-y-7">
                  {/* Row 1: Full Name & Email Address */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    {/* Full Name */}
                    <div>
                      <label
                        htmlFor="fullName"
                        className="block text-xs sm:text-sm font-bold text-neutral-800 mb-2"
                      >
                        Full Name <span className="text-[#854D0E]">*</span>
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        placeholder="e.g. John Doe"
                        className={`w-full px-4 py-3 rounded-xl border bg-white text-neutral-900 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD60A] focus:border-[#FFD60A] transition-all ${
                          errors.fullName
                            ? 'border-red-400 ring-1 ring-red-400'
                            : 'border-neutral-300'
                        }`}
                      />
                      {errors.fullName && (
                        <p className="text-xs text-red-600 mt-1.5 font-medium">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Email Address */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-xs sm:text-sm font-bold text-neutral-800 mb-2"
                      >
                        Email Address <span className="text-[#854D0E]">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="e.g. john@example.com"
                        className={`w-full px-4 py-3 rounded-xl border bg-white text-neutral-900 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD60A] focus:border-[#FFD60A] transition-all ${
                          errors.email
                            ? 'border-red-400 ring-1 ring-red-400'
                            : 'border-neutral-300'
                        }`}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-600 mt-1.5 font-medium">
                          {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 2: Phone Number & Position Applying For */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    {/* Phone Number */}
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-xs sm:text-sm font-bold text-neutral-800 mb-2"
                      >
                        Phone Number (with Country Code){' '}
                        <span className="text-[#854D0E]">*</span>
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="e.g. +91 98765 43210"
                        className={`w-full px-4 py-3 rounded-xl border bg-white text-neutral-900 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD60A] focus:border-[#FFD60A] transition-all ${
                          errors.phone
                            ? 'border-red-400 ring-1 ring-red-400'
                            : 'border-neutral-300'
                        }`}
                      />
                      {errors.phone && (
                        <p className="text-xs text-red-600 mt-1.5 font-medium">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Position Applying For */}
                    <div>
                      <label
                        htmlFor="position"
                        className="block text-xs sm:text-sm font-bold text-neutral-800 mb-2"
                      >
                        Position Applying For <span className="text-[#854D0E]">*</span>
                      </label>
                      <CustomSelect
                        id="position"
                        name="position"
                        value={formData.position}
                        onChange={(e) => {
                          setFormData({ ...formData, position: e.target.value });
                          if (errors.position) setErrors((prev) => ({ ...prev, position: undefined }));
                        }}
                        options={[
                          { value: 'General Application', label: 'General Application (All Disciplines)' },
                          ...openPositions.map((pos) => ({
                            value: pos.title,
                            label: `${pos.title} (${pos.department})`,
                            category: pos.department,
                          })),
                        ]}
                        error={Boolean(errors.position)}
                        placeholder="Select a position..."
                      />
                      {errors.position && (
                        <p className="text-xs text-red-600 mt-1.5 font-medium">
                          {errors.position}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 3: Department & Experience Level */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    {/* Department of Interest */}
                    <div>
                      <label
                        htmlFor="department"
                        className="block text-xs sm:text-sm font-bold text-neutral-800 mb-2"
                      >
                        Department of Interest <span className="text-[#854D0E]">*</span>
                      </label>
                      <CustomSelect
                        id="department"
                        name="department"
                        value={formData.department}
                        onChange={(e) => {
                          setFormData({ ...formData, department: e.target.value });
                          if (errors.department) setErrors((prev) => ({ ...prev, department: undefined }));
                        }}
                        options={departmentOptions}
                        error={Boolean(errors.department)}
                        placeholder="Select a department..."
                      />
                      {errors.department && (
                        <p className="text-xs text-red-600 mt-1.5 font-medium">
                          {errors.department}
                        </p>
                      )}
                    </div>

                    {/* Experience Level */}
                    <div>
                      <label
                        htmlFor="experienceLevel"
                        className="block text-xs sm:text-sm font-bold text-neutral-800 mb-2"
                      >
                        Experience Level <span className="text-[#854D0E]">*</span>
                      </label>
                      <CustomSelect
                        id="experienceLevel"
                        name="experienceLevel"
                        value={formData.experienceLevel}
                        onChange={(e) => {
                          setFormData({ ...formData, experienceLevel: e.target.value });
                          if (errors.experienceLevel) setErrors((prev) => ({ ...prev, experienceLevel: undefined }));
                        }}
                        options={experienceLevelOptions}
                        error={Boolean(errors.experienceLevel)}
                        placeholder="Select experience level..."
                      />
                      {errors.experienceLevel && (
                        <p className="text-xs text-red-600 mt-1.5 font-medium">
                          {errors.experienceLevel}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 4: Preferred Work Arrangement & Key Skills */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    {/* Preferred Work Arrangement */}
                    <div>
                      <label
                        htmlFor="workArrangement"
                        className="block text-xs sm:text-sm font-bold text-neutral-800 mb-2"
                      >
                        Preferred Work Arrangement <span className="text-[#854D0E]">*</span>
                      </label>
                      <CustomSelect
                        id="workArrangement"
                        name="workArrangement"
                        value={formData.workArrangement}
                        onChange={(e) => {
                          setFormData({ ...formData, workArrangement: e.target.value });
                          if (errors.workArrangement) setErrors((prev) => ({ ...prev, workArrangement: undefined }));
                        }}
                        options={workArrangementOptions}
                        error={Boolean(errors.workArrangement)}
                        placeholder="Select work arrangement..."
                      />
                      {errors.workArrangement && (
                        <p className="text-xs text-red-600 mt-1.5 font-medium">
                          {errors.workArrangement}
                        </p>
                      )}
                    </div>

                    {/* Key Skills */}
                    <div>
                      <label
                        htmlFor="keySkills"
                        className="block text-xs sm:text-sm font-bold text-neutral-800 mb-2"
                      >
                        Key Skills & Competencies <span className="text-[#854D0E]">*</span>
                      </label>
                      <input
                        id="keySkills"
                        type="text"
                        value={formData.keySkills}
                        onChange={(e) =>
                          setFormData({ ...formData, keySkills: e.target.value })
                        }
                        placeholder="e.g. React, Node.js, SEO, Creative Direction"
                        className={`w-full px-4 py-3 rounded-xl border bg-white text-neutral-900 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD60A] focus:border-[#FFD60A] transition-all ${
                          errors.keySkills
                            ? 'border-red-400 ring-1 ring-red-400'
                            : 'border-neutral-300'
                        }`}
                      />
                      {errors.keySkills && (
                        <p className="text-xs text-red-600 mt-1.5 font-medium">
                          {errors.keySkills}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 5: Resume / CV Upload */}
                  <div>
                    <label
                      htmlFor="resumeUpload"
                      className="block text-xs sm:text-sm font-bold text-neutral-800 mb-2"
                    >
                      Resume / CV Upload (PDF, DOC, DOCX up to 5 MB){' '}
                      <span className="text-[#854D0E]">*</span>
                    </label>

                    {resumeFile ? (
                      /* Display Selected File Preview */
                      <div className="flex items-center justify-between p-4 rounded-xl border border-[#FFD60A]/40 bg-[#FFD60A]/10">
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="w-10 h-10 rounded-lg bg-[#FFD60A]/20 text-[#854D0E] flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-neutral-900 truncate">
                              {resumeFile.name}
                            </p>
                            <p className="text-xs text-neutral-500">
                              {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={handleRemoveFile}
                          className="p-1.5 rounded-lg text-neutral-400 hover:text-red-600 hover:bg-white transition-colors cursor-pointer"
                          aria-label="Remove selected resume"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      /* Upload Drag & Click Trigger */
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-colors bg-white hover:bg-[#FFD60A]/10 ${
                          errors.resumeFile
                            ? 'border-red-400 bg-red-50/20'
                            : 'border-neutral-300 hover:border-[#FFD60A]'
                        }`}
                      >
                        <UploadCloud className="w-8 h-8 text-neutral-400 mx-auto mb-2.5" />
                        <p className="text-sm font-bold text-neutral-800 mb-1">
                          Click to browse or drag and drop your resume
                        </p>
                        <p className="text-xs text-neutral-500">
                          Accepted formats: PDF, DOC, DOCX (Max size: 5 MB)
                        </p>
                      </div>
                    )}

                    <input
                      ref={fileInputRef}
                      id="resumeUpload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {errors.resumeFile && (
                      <p className="text-xs text-red-600 mt-1.5 font-medium">
                        {errors.resumeFile}
                      </p>
                    )}
                  </div>

                  {/* Row 6: Cover Letter or Introduction */}
                  <div>
                    <label
                      htmlFor="coverLetter"
                      className="block text-xs sm:text-sm font-bold text-neutral-800 mb-2"
                    >
                      Cover Letter or Introduction <span className="text-[#854D0E]">*</span>
                    </label>
                    <textarea
                      id="coverLetter"
                      rows={4}
                      value={formData.coverLetter}
                      onChange={(e) =>
                        setFormData({ ...formData, coverLetter: e.target.value })
                      }
                      placeholder="Share a brief overview of your background, career aspirations, and how you can contribute to DKP Innovation..."
                      className={`w-full px-4 py-3 rounded-xl border bg-white text-neutral-900 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD60A] focus:border-[#FFD60A] transition-all ${
                        errors.coverLetter
                          ? 'border-red-400 ring-1 ring-red-400'
                          : 'border-neutral-300'
                      }`}
                    />
                    {errors.coverLetter && (
                      <p className="text-xs text-red-600 mt-1.5 font-medium">
                        {errors.coverLetter}
                      </p>
                    )}
                  </div>

                  {/* Row 7: LinkedIn URL & Portfolio / GitHub URL (Optional) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    {/* LinkedIn URL */}
                    <div>
                      <label
                        htmlFor="linkedInUrl"
                        className="block text-xs sm:text-sm font-bold text-neutral-800 mb-2"
                      >
                        LinkedIn Profile URL <span className="text-xs font-normal text-neutral-500">(Optional)</span>
                      </label>
                      <input
                        id="linkedInUrl"
                        type="url"
                        value={formData.linkedInUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, linkedInUrl: e.target.value })
                        }
                        placeholder="https://linkedin.com/in/yourprofile"
                        className={`w-full px-4 py-3 rounded-xl border bg-white text-neutral-900 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD60A] focus:border-[#FFD60A] transition-all ${
                          errors.linkedInUrl
                            ? 'border-red-400 ring-1 ring-red-400'
                            : 'border-neutral-300'
                        }`}
                      />
                      {errors.linkedInUrl && (
                        <p className="text-xs text-red-600 mt-1.5 font-medium">
                          {errors.linkedInUrl}
                        </p>
                      )}
                    </div>

                    {/* Portfolio / GitHub URL */}
                    <div>
                      <label
                        htmlFor="portfolioUrl"
                        className="block text-xs sm:text-sm font-bold text-neutral-800 mb-2"
                      >
                        Portfolio / GitHub URL <span className="text-xs font-normal text-neutral-500">(Optional)</span>
                      </label>
                      <input
                        id="portfolioUrl"
                        type="url"
                        value={formData.portfolioUrl}
                        onChange={(e) =>
                          setFormData({ ...formData, portfolioUrl: e.target.value })
                        }
                        placeholder="https://github.com/yourusername"
                        className={`w-full px-4 py-3 rounded-xl border bg-white text-neutral-900 placeholder-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#FFD60A] focus:border-[#FFD60A] transition-all ${
                          errors.portfolioUrl
                            ? 'border-red-400 ring-1 ring-red-400'
                            : 'border-neutral-300'
                        }`}
                      />
                      {errors.portfolioUrl && (
                        <p className="text-xs text-red-600 mt-1.5 font-medium">
                          {errors.portfolioUrl}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Row 8: Privacy Consent Checkbox */}
                  <div className="pt-2">
                    <label className="flex items-start space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.privacyConsent}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            privacyConsent: e.target.checked,
                          })
                        }
                        className="mt-1 h-4 w-4 rounded text-[#FFD60A] accent-[#FFD60A] focus:ring-[#FFD60A] focus:border-[#FFD60A] border-neutral-300"
                      />
                      <span className="text-xs sm:text-sm text-neutral-600 leading-relaxed select-none">
                        I consent to DKP Innovation processing the information I provide for recruitment purposes, in accordance with its Privacy Policy.
                      </span>
                    </label>
                    {errors.privacyConsent && (
                      <p className="text-xs text-red-600 mt-1.5 font-medium pl-7">
                        {errors.privacyConsent}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full inline-flex items-center justify-center space-x-2 py-4 px-8 rounded-xl bg-[#FFD60A] hover:bg-[#FFE047] disabled:bg-[#FFD60A]/50 text-[#002244] font-bold text-sm sm:text-base shadow-lg shadow-[0_4px_20px_rgba(255,214,10,0.35)] transition-all cursor-pointer disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-[#002244] border-t-transparent rounded-full animate-spin" />
                          <span>Submitting Application...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Job Application</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                    <p className="text-center text-xs text-neutral-500 mt-3">
                      Your resume and candidate information are processed confidentially.
                    </p>
                  </div>
                </form>
              </BlurFadeIn>
            )}
          </div>
        </section>
      </main>

      {/* Global Shared Footer */}
      <Footer />
    </div>
  );
};
export default CareersPage;
