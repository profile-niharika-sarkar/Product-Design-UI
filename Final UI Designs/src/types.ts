export type ColumbusScreen = 'screen1' | 'screen2' | 'conversation';

export interface ExpandableItem {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  iconName: 'HelpCircle' | 'Cpu' | 'ShieldCheck' | 'Sliders';
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  badge?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'columbus' | 'user';
  text: string;
  timestamp: string;
  isVoice?: boolean;
}

export interface ColumbusConfig {
  voiceEnabled: boolean;
  autoSpeak: boolean;
  speechRate: number;
}
