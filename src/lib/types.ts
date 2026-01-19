export type Phase = 'Initial' | 'Reminder' | 'Escalation' | 'Pitch';

export type ToneStyle = 'Professional' | 'Friendly' | 'Assertive' | 'Subtle';

export interface Lead {
  id: string;
  company: string;
  contactName: string;
  email: string;
  sector: string;
  painQuestion: string;
  contextHook: string;
  phase: Phase;
  aiScore: number;
  lastUpdated: string;
  notes: string;
  generatedDraft: string;
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
