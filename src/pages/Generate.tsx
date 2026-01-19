import { useState, useMemo } from 'react';
import { storage } from '@/lib/storage';
import { Lead, Phase, ToneStyle, Template } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Play, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const toneDescriptions: Record<ToneStyle, string> = {
  Professional: 'Formal and business-appropriate',
  Friendly: 'Warm and approachable',
  Assertive: 'Direct and confident',
  Subtle: 'Soft-sell, relationship-focused',
};

export const Generate = () => {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>(storage.getLeads());
  const templates = storage.getTemplates();
  
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('');
  const [selectedPhase, setSelectedPhase] = useState<Phase>('Initial');
  const [selectedTone, setSelectedTone] = useState<ToneStyle>('Professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [generatedCount, setGeneratedCount] = useState(0);

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => t.phase === selectedPhase);
  }, [templates, selectedPhase]);

  const leadsWithoutDraft = useMemo(() => {
    return leads.filter((l) => !l.generatedDraft);
  }, [leads]);

  const handleSelectAll = () => {
    if (selectedLeadIds.length === leadsWithoutDraft.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(leadsWithoutDraft.map((l) => l.id));
    }
  };

  const handleSelectLead = (id: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const generateDraft = (lead: Lead, template: Template, tone: ToneStyle): string => {
    // Simulate AI-generated content by replacing placeholders and adding personalization
    let draft = template.body
      .replace(/\{\{contactName\}\}/g, lead.contactName || 'there')
      .replace(/\{\{company\}\}/g, lead.company)
      .replace(/\{\{sector\}\}/g, lead.sector)
      .replace(/\{\{painQuestion\}\}/g, lead.painQuestion || 'How can we help you overcome your current challenges?')
      .replace(/\{\{contextHook\}\}/g, lead.contextHook || 'Your company has been doing impressive work');

    // Add tone-specific modifications
    if (tone === 'Friendly') {
      draft = draft.replace(/Dear /g, 'Hi ');
      draft = draft.replace(/Best regards/g, 'Cheers');
    } else if (tone === 'Assertive') {
      draft = draft.replace(/I hope this message finds you well\./g, '');
      draft = draft.replace(/I would love to/g, 'I want to');
    } else if (tone === 'Subtle') {
      draft = draft.replace(/I want to/g, 'I thought it might be worth');
    }

    return draft.trim();
  };

  const calculateAiScore = (): number => {
    // Simulate AI scoring (in production, this would be an actual AI call)
    return Math.floor(Math.random() * 4) + 6; // Score between 6-9
  };

  const handleGenerate = async () => {
    if (selectedLeadIds.length === 0) {
      toast({
        title: 'No leads selected',
        description: 'Please select at least one lead to generate drafts.',
        variant: 'destructive',
      });
      return;
    }

    if (!selectedTemplateId) {
      toast({
        title: 'No template selected',
        description: 'Please select a template for the drafts.',
        variant: 'destructive',
      });
      return;
    }

    const template = templates.find((t) => t.id === selectedTemplateId);
    if (!template) return;

    setIsGenerating(true);
    setProgress(0);
    setGeneratedCount(0);

    const selectedLeads = leads.filter((l) => selectedLeadIds.includes(l.id));
    
    // Simulate batch processing with delays
    for (let i = 0; i < selectedLeads.length; i++) {
      const lead = selectedLeads[i];
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 500));
      
      const draft = generateDraft(lead, template, selectedTone);
      const aiScore = calculateAiScore();

      storage.updateLead(lead.id, {
        generatedDraft: draft,
        aiScore,
        phase: selectedPhase,
      });

      setProgress(((i + 1) / selectedLeads.length) * 100);
      setGeneratedCount(i + 1);
    }

    setLeads(storage.getLeads());
    setSelectedLeadIds([]);
    setIsGenerating(false);

    toast({
      title: 'Generation complete!',
      description: `${selectedLeads.length} drafts have been generated.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Generate Drafts</h1>
        <p className="text-muted-foreground">
          Create AI-personalized email drafts for your leads.
        </p>
      </div>

      {/* Settings */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Campaign Phase</CardTitle>
            <CardDescription>Select the outreach phase</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedPhase} onValueChange={(v) => {
              setSelectedPhase(v as Phase);
              setSelectedTemplateId('');
            }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Initial">Initial Outreach</SelectItem>
                <SelectItem value="Reminder">Follow-up Reminder</SelectItem>
                <SelectItem value="Escalation">Escalation</SelectItem>
                <SelectItem value="Pitch">Final Pitch</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Template</CardTitle>
            <CardDescription>Choose an email template</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
              <SelectTrigger>
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                {filteredTemplates.length === 0 ? (
                  <div className="p-2 text-sm text-muted-foreground">
                    No templates for this phase
                  </div>
                ) : (
                  filteredTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Tone</CardTitle>
            <CardDescription>Set the email tone</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedTone} onValueChange={(v) => setSelectedTone(v as ToneStyle)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(toneDescriptions).map(([tone, desc]) => (
                  <SelectItem key={tone} value={tone}>
                    <div>
                      <p className="font-medium">{tone}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>

      {/* Generation Progress */}
      {isGenerating && (
        <Card className="shadow-card border-primary/50">
          <CardContent className="py-6">
            <div className="flex items-center gap-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <div className="flex-1">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Generating drafts...</span>
                  <span className="text-muted-foreground">
                    {generatedCount} / {selectedLeadIds.length}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lead Selection */}
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Select Leads</CardTitle>
            <CardDescription>
              Choose which leads to generate drafts for
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {selectedLeadIds.length} selected
            </span>
            <Button
              onClick={handleGenerate}
              disabled={isGenerating || selectedLeadIds.length === 0 || !selectedTemplateId}
              className="gradient-primary"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Drafts
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No leads available</p>
              <p className="text-sm text-muted-foreground mt-2">
                Upload leads first to generate drafts.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedLeadIds.length === leadsWithoutDraft.length && leadsWithoutDraft.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leads.map((lead) => (
                  <TableRow key={lead.id} className={lead.generatedDraft ? 'opacity-60' : ''}>
                    <TableCell>
                      <Checkbox
                        checked={selectedLeadIds.includes(lead.id)}
                        onCheckedChange={() => handleSelectLead(lead.id)}
                        disabled={!!lead.generatedDraft}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{lead.contactName}</p>
                        <p className="text-sm text-muted-foreground">{lead.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{lead.company}</TableCell>
                    <TableCell>{lead.sector}</TableCell>
                    <TableCell>
                      {lead.generatedDraft ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Draft Ready
                        </Badge>
                      ) : (
                        <Badge variant="outline">Pending</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Generate;
