import { ExpandableItem, ChecklistItem } from '../types';

export const EXPANDABLE_SECTIONS: ExpandableItem[] = [
  {
    id: 'ask-about',
    title: 'What I Ask About',
    subtitle: 'Strategic priorities & equipment requirements',
    content: 'Columbus inquires about operational throughput goals, roll forming profile specs, raw material gauges, line footprint constraints, automated stacking requirements, and executive capital expenditure timelines to curate precise engineering recommendations.',
    iconName: 'HelpCircle'
  },
  {
    id: 'happens-answers',
    title: 'What Happens With Your Answers',
    subtitle: 'Executive synthesis & C-suite alignment',
    content: 'Your answers are synthesized in real-time into an executive briefing document with custom ROI projections, throughput estimations, and technical machinery line specifications tailored specifically for The Bradbury Group engineering team.',
    iconName: 'Cpu'
  },
  {
    id: 'where-goes',
    title: 'Where This Goes',
    subtitle: 'Private enterprise cloud storage',
    content: 'All session insights and transcripts are stored inside The Bradbury Group’s encrypted private cloud partition. Data is protected with end-to-end AES-256 encryption and accessible exclusively by designated Bradbury account managers and senior leadership.',
    iconName: 'ShieldCheck'
  },
  {
    id: 'your-control',
    title: 'Your Control',
    subtitle: 'Full data ownership & sovereignty',
    content: 'You maintain absolute control over your session. At any point during or after our conversation, you can pause recording, review transcript logs, download executive summary reports, or permanently purge your session records.',
    iconName: 'Sliders'
  }
];

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'check-audio',
    title: 'Microphone & High-Fidelity Audio',
    description: 'Calibrated for crystal-clear two-way voice interaction and real-time speech synthesis.',
    badge: 'Audio Ready'
  },
  {
    id: 'check-duration',
    title: 'Estimated Duration: 3–5 Minutes',
    description: 'Designed specifically for rapid C-Suite executive alignment and quick engineering briefs.',
    badge: '3-5 Mins'
  },
  {
    id: 'check-transcript',
    title: 'Real-Time Transcription & Synthesis',
    description: 'Automatic text generation and key takeaway extraction during the active session.',
    badge: 'Auto-Notes'
  },
  {
    id: 'check-confidential',
    title: 'Confidential & Private Session',
    description: 'Governed by Bradbury Enterprise Security Standards and strict non-disclosure safeguards.',
    badge: 'Secured'
  }
];

export const QUICK_PROMPTS = [
  "Calculate ROI for high-speed roll forming machinery",
  "Overview of Bradbury Group operating companies",
  "Automated coil processing line specifications",
  "Schedule an executive consultation with engineering"
];

export const BRADBURY_GROUP_COMPANIES = [
  { name: 'Bradbury Roll Forming', location: 'Moundridge, KS', detail: 'Custom roll forming lines, coil processing, & leveling' },
  { name: 'Hayes International', location: 'Rotorua, New Zealand', detail: 'Light gauge steel framing & roofing machinery' },
  { name: 'Beck Automation', location: 'St. Louis, MO', detail: 'Control systems & manufacturing execution software' },
  { name: 'Marion Manufacturing', location: 'Marion, KS', detail: 'Precision punching, shearing & custom tooling' },
  { name: 'Strilich Technologies', location: 'Hammond, IN', detail: 'Heavy duty coil handling & entry equipment' },
  { name: 'Metform International', location: 'Mississauga, Canada', detail: 'Automated automotive & heavy structural equipment' }
];
