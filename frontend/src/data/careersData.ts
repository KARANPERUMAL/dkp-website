export interface JobPosition {
  id: string;
  title: string;
  department: string;
  employmentType: 'Full-time' | 'Part-time' | 'Contract' | 'Internship';
  workArrangement: 'On-site' | 'Hybrid' | 'Remote' | 'Flexible';
  location: string;
  description: string;
  requiredSkills: string[];
  isActive?: boolean;
}

export const departmentOptions = [
  'IT & Digital Solutions',
  'Digital Marketing & Lead Generation',
  'Branding, PR & Influencer Marketing',
  'Creative Production & Advertising',
  'Business Registration & Corporate Compliance',
  'Other',
] as const;

export type DepartmentOption = (typeof departmentOptions)[number];

export const experienceLevelOptions = [
  'Internship',
  'Fresher',
  'Entry Level',
  '1–3 Years',
  '3–5 Years',
  '5+ Years',
] as const;

export type ExperienceLevelOption = (typeof experienceLevelOptions)[number];

export const workArrangementOptions = [
  'On-site',
  'Hybrid',
  'Remote',
  'Flexible',
] as const;

export type WorkArrangementOption = (typeof workArrangementOptions)[number];

/**
 * Open positions data store.
 * Initialized to an empty array so the page renders the authoritative initial state:
 * "No open positions at the moment. We're always interested in connecting with talented people..."
 *
 * To add real company openings in the future, simply append JobPosition objects to this array.
 */
export const openPositions: JobPosition[] = [];
