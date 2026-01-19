import { Lead, Template, User } from './types';

const STORAGE_KEYS = {
  leads: 'tahqeeq_leads',
  templates: 'tahqeeq_templates',
  user: 'tahqeeq_user',
  isAuthenticated: 'tahqeeq_auth',
};

// Default templates
const defaultTemplates: Template[] = [
  {
    id: '1',
    name: 'Initial Outreach - Professional',
    phase: 'Initial',
    body: `Dear {{contactName}},

I hope this message finds you well. I came across {{company}} and was impressed by your work in the {{sector}} sector.

{{contextHook}}

{{painQuestion}}

I would love to explore how we might be able to support your goals.

Best regards`,
  },
  {
    id: '2',
    name: 'Follow-up Reminder',
    phase: 'Reminder',
    body: `Hi {{contactName}},

I wanted to follow up on my previous message regarding {{company}}.

{{painQuestion}}

Would you have 15 minutes this week for a brief call?

Best`,
  },
  {
    id: '3',
    name: 'Escalation - Direct',
    phase: 'Escalation',
    body: `{{contactName}},

I understand you're busy, but I believe there's genuine value we can provide to {{company}}.

{{contextHook}}

Can we schedule a quick conversation?

Regards`,
  },
  {
    id: '4',
    name: 'Final Pitch',
    phase: 'Pitch',
    body: `Dear {{contactName}},

This is my final outreach regarding a partnership opportunity with {{company}}.

{{painQuestion}}

I'm confident we can help address this challenge. Let's connect before the quarter ends.

Best regards`,
  },
];

export const storage = {
  // Leads
  getLeads: (): Lead[] => {
    const data = localStorage.getItem(STORAGE_KEYS.leads);
    return data ? JSON.parse(data) : [];
  },

  saveLeads: (leads: Lead[]): void => {
    localStorage.setItem(STORAGE_KEYS.leads, JSON.stringify(leads));
  },

  addLead: (lead: Lead): void => {
    const leads = storage.getLeads();
    leads.push(lead);
    storage.saveLeads(leads);
  },

  updateLead: (id: string, updates: Partial<Lead>): void => {
    const leads = storage.getLeads();
    const index = leads.findIndex((l) => l.id === id);
    if (index !== -1) {
      leads[index] = { ...leads[index], ...updates, lastUpdated: new Date().toISOString() };
      storage.saveLeads(leads);
    }
  },

  deleteLead: (id: string): void => {
    const leads = storage.getLeads().filter((l) => l.id !== id);
    storage.saveLeads(leads);
  },

  // Templates
  getTemplates: (): Template[] => {
    const data = localStorage.getItem(STORAGE_KEYS.templates);
    if (!data) {
      storage.saveTemplates(defaultTemplates);
      return defaultTemplates;
    }
    return JSON.parse(data);
  },

  saveTemplates: (templates: Template[]): void => {
    localStorage.setItem(STORAGE_KEYS.templates, JSON.stringify(templates));
  },

  addTemplate: (template: Template): void => {
    const templates = storage.getTemplates();
    templates.push(template);
    storage.saveTemplates(templates);
  },

  updateTemplate: (id: string, updates: Partial<Template>): void => {
    const templates = storage.getTemplates();
    const index = templates.findIndex((t) => t.id === id);
    if (index !== -1) {
      templates[index] = { ...templates[index], ...updates };
      storage.saveTemplates(templates);
    }
  },

  deleteTemplate: (id: string): void => {
    const templates = storage.getTemplates().filter((t) => t.id !== id);
    storage.saveTemplates(templates);
  },

  // Auth (simulated)
  getUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEYS.user);
    return data ? JSON.parse(data) : null;
  },

  setUser: (user: User): void => {
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user));
    localStorage.setItem(STORAGE_KEYS.isAuthenticated, 'true');
  },

  isAuthenticated: (): boolean => {
    return localStorage.getItem(STORAGE_KEYS.isAuthenticated) === 'true';
  },

  logout: (): void => {
    localStorage.removeItem(STORAGE_KEYS.user);
    localStorage.removeItem(STORAGE_KEYS.isAuthenticated);
  },
};
