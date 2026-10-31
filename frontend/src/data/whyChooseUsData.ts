import {
  Target,
  ChartNoAxesColumnIncreasing,
  Paintbrush,
  Clock,
  PiggyBank,
} from 'lucide-react';
import type { FeatureCardItem } from '@/components/ui-animation/stacked-feature-cards';

export const defaultWhyChooseUsCards: FeatureCardItem[] = [
  {
    value: '01',
    title: 'Customized Strategies',
    description:
      'Every business has different goals and audiences. We tailor our digital, creative and marketing strategies to your specific needs rather than relying on a one-size-fits-all approach.',
    icon: Target,
    cardClassName: 'bg-white border border-neutral-200/90 text-neutral-900 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:border-[#FFD60A]',
    iconClassName: 'bg-[#FFD60A] text-[#002244] border border-[#FFD60A] shadow-[0_2px_10px_rgba(255,214,10,0.35)]',
    rotateClassName: 'rotate-[-0.6deg] sm:rotate-[-1.2deg]',
  },
  {
    value: '02',
    title: 'Result-Driven Approach',
    description:
      'We align our work with clear business objectives and use relevant performance indicators to evaluate progress and guide improvements.',
    icon: ChartNoAxesColumnIncreasing,
    cardClassName: 'bg-[#fafafb] border border-neutral-200/90 text-neutral-900 shadow-[0_12px_32px_rgba(0,0,0,0.07)] hover:border-[#FFD60A]',
    iconClassName: 'bg-[#FFD60A] text-[#002244] border border-[#FFD60A] shadow-[0_2px_10px_rgba(255,214,10,0.35)]',
    rotateClassName: 'rotate-[0.8deg] sm:rotate-[1.4deg]',
  },
  {
    value: '03',
    title: 'Creative Excellence',
    description:
      'Our team crafts high-quality visuals, videos and digital experiences that strengthen brand identity, engage viewers, and leave a positive lasting impression.',
    icon: Paintbrush,
    cardClassName: 'bg-white border border-neutral-200/90 text-neutral-900 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:border-[#FFD60A]',
    iconClassName: 'bg-[#FFD60A] text-[#002244] border border-[#FFD60A] shadow-[0_2px_10px_rgba(255,214,10,0.35)]',
    rotateClassName: 'rotate-[-1deg] sm:rotate-[-1.6deg]',
  },
  {
    value: '04',
    title: 'On-Time Delivery',
    description:
      'We respect project timelines and maintain structured communication so our clients can plan and launch their initiatives with confidence.',
    icon: Clock,
    cardClassName: 'bg-[#fafafb] border border-neutral-200/90 text-neutral-900 shadow-[0_12px_32px_rgba(0,0,0,0.07)] hover:border-[#FFD60A]',
    iconClassName: 'bg-[#FFD60A] text-[#002244] border border-[#FFD60A] shadow-[0_2px_10px_rgba(255,214,10,0.35)]',
    rotateClassName: 'rotate-[0.6deg] sm:rotate-[1.2deg]',
  },
  {
    value: '05',
    title: 'Transparent Pricing',
    description:
      'We offer competitive, clear pricing with well-defined deliverables and no unexpected costs, ensuring fair value for your investment.',
    icon: PiggyBank,
    cardClassName: 'bg-white border border-neutral-200/90 text-neutral-900 shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:border-[#FFD60A]',
    iconClassName: 'bg-[#FFD60A] text-[#002244] border border-[#FFD60A] shadow-[0_2px_10px_rgba(255,214,10,0.35)]',
    rotateClassName: 'rotate-[-0.5deg] sm:rotate-[-0.8deg]',
  },
];
