export type Phase = 'Initial' | 'Reminder' | 'Escalation' | 'Pitch' | 'Trigger Follow-Up';

export type ToneStyle = 'Professional' | 'Friendly' | 'Assertive' | 'Subtle';

export interface SignalTrigger {
  id: string;
  platform: 'X' | 'LinkedIn';
  source: 'X' | 'LinkedIn';
  authorName: string;
  authorCompany: string;
  authorEmail?: string;
  content: string;
  signalType: string;
  sector: string;
  signalStrength: number;
  discoveredAt: string;
  url?: string;
}

export interface Lead {
  id: string;
  company: string;
  contactName: string;
  email: string;
  sector: string;
  painQuestion: string;
  contextHook: string;
  signalTrigger?: string;
  signalDate?: string;
  signalStrength?: number;
  phase: Phase;
  aiScore: number;
  lastUpdated: string;
  notes: string;
  generatedDraft: string;
  videoScript?: string;
}

export interface Template {
  id: string;
  name: string;
  phase: Phase;
  body: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface DashboardStats {
  totalLeads: number;
  draftsGenerated: number;
  avgAiScore: number;
  exportedToday: number;
}

export interface GenerationSettings {
  templateId: string;
  phase: Phase;
  tone: ToneStyle;
  leadIds: string[];
}
