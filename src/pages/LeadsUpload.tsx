import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '@/lib/storage';
import { Lead, Phase } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Upload, FileSpreadsheet, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ParsedLead {
  company: string;
  contactName: string;
  email: string;
  sector: string;
  painQuestion?: string;
  contextHook?: string;
}

export const LeadsUpload = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploadMode, setUploadMode] = useState<'csv' | 'manual'>('csv');
  const [csvContent, setCsvContent] = useState('');
  const [parsedLeads, setParsedLeads] = useState<ParsedLead[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Manual form state
  const [manualLead, setManualLead] = useState<Partial<Lead>>({
    phase: 'Initial',
  });

  const parseCSV = useCallback((content: string): ParsedLead[] => {
    const lines = content.trim().split('\n');
    if (lines.length < 2) return [];

    const headers = lines[0].toLowerCase().split(',').map((h) => h.trim());
    const leads: ParsedLead[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim().replace(/^"|"$/g, ''));
      const lead: Partial<ParsedLead> = {};

      headers.forEach((header, index) => {
        const value = values[index] || '';
        if (header.includes('company')) lead.company = value;
        else if (header.includes('contact') || header.includes('name')) lead.contactName = value;
        else if (header.includes('email')) lead.email = value;
        else if (header.includes('sector') || header.includes('industry')) lead.sector = value;
        else if (header.includes('pain')) lead.painQuestion = value;
        else if (header.includes('context') || header.includes('hook')) lead.contextHook = value;
      });

      if (lead.company && lead.email) {
        leads.push({
          company: lead.company,
          contactName: lead.contactName || '',
          email: lead.email,
          sector: lead.sector || '',
          painQuestion: lead.painQuestion,
          contextHook: lead.contextHook,
        });
      }
    }

    return leads;
  }, []);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvContent(content);
      const parsed = parseCSV(content);
      setParsedLeads(parsed);
      
      if (parsed.length > 0) {
        toast({
          title: 'CSV Parsed',
          description: `Found ${parsed.length} valid leads`,
        });
      } else {
        toast({
          title: 'No leads found',
          description: 'Please check your CSV format',
          variant: 'destructive',
        });
      }
    };
    reader.readAsText(file);
  };

  const handleImportLeads = async () => {
    setIsProcessing(true);

    const newLeads: Lead[] = parsedLeads.map((parsed) => ({
      id: crypto.randomUUID(),
      company: parsed.company,
      contactName: parsed.contactName,
      email: parsed.email,
      sector: parsed.sector,
      painQuestion: parsed.painQuestion || '',
      contextHook: parsed.contextHook || '',
      phase: 'Initial' as Phase,
      aiScore: 0,
      lastUpdated: new Date().toISOString(),
      notes: '',
      generatedDraft: '',
    }));

    const existingLeads = storage.getLeads();
    storage.saveLeads([...existingLeads, ...newLeads]);

    toast({
      title: 'Leads imported!',
      description: `${newLeads.length} leads have been added.`,
    });

    setIsProcessing(false);
    navigate('/leads');
  };

  const handleManualAdd = () => {
    if (!manualLead.company || !manualLead.email || !manualLead.contactName) {
      toast({
        title: 'Required fields missing',
        description: 'Please fill in company, contact name, and email.',
        variant: 'destructive',
      });
      return;
    }

    const newLead: Lead = {
      id: crypto.randomUUID(),
      company: manualLead.company,
      contactName: manualLead.contactName,
      email: manualLead.email,
      sector: manualLead.sector || '',
      painQuestion: manualLead.painQuestion || '',
      contextHook: manualLead.contextHook || '',
      phase: manualLead.phase as Phase || 'Initial',
      aiScore: 0,
      lastUpdated: new Date().toISOString(),
      notes: manualLead.notes || '',
      generatedDraft: '',
    };

    storage.addLead(newLead);
    toast({
      title: 'Lead added!',
      description: `${newLead.contactName} has been added to your leads.`,
    });
    navigate('/leads');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upload Leads</h1>
        <p className="text-muted-foreground">
          Import leads from CSV or add them manually.
        </p>
      </div>

      {/* Mode Toggle */}
      <div className="flex gap-4">
        <Button
          variant={uploadMode === 'csv' ? 'default' : 'outline'}
          onClick={() => setUploadMode('csv')}
          className={uploadMode === 'csv' ? 'gradient-primary' : ''}
        >
          <FileSpreadsheet className="mr-2 h-4 w-4" />
          CSV Upload
        </Button>
        <Button
          variant={uploadMode === 'manual' ? 'default' : 'outline'}
          onClick={() => setUploadMode('manual')}
          className={uploadMode === 'manual' ? 'gradient-primary' : ''}
        >
          <Plus className="mr-2 h-4 w-4" />
          Manual Entry
        </Button>
      </div>

      {uploadMode === 'csv' ? (
        <div className="space-y-6">
          {/* File Upload */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Upload CSV File</CardTitle>
              <CardDescription>
                CSV should include columns: company, contact_name, email, sector, pain_question (optional), context_hook (optional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-upload"
                />
                <label htmlFor="csv-upload" className="cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">Click to upload CSV</p>
                  <p className="text-sm text-muted-foreground">or drag and drop</p>
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          {parsedLeads.length > 0 && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  {parsedLeads.length} Leads Ready to Import
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-64 overflow-auto rounded-lg border">
                  <table className="w-full text-sm">
                    <thead className="bg-muted sticky top-0">
                      <tr>
                        <th className="p-2 text-left">Company</th>
                        <th className="p-2 text-left">Contact</th>
                        <th className="p-2 text-left">Email</th>
                        <th className="p-2 text-left">Sector</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsedLeads.slice(0, 10).map((lead, i) => (
                        <tr key={i} className="border-t">
                          <td className="p-2">{lead.company}</td>
                          <td className="p-2">{lead.contactName}</td>
                          <td className="p-2">{lead.email}</td>
                          <td className="p-2">{lead.sector}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {parsedLeads.length > 10 && (
                    <p className="p-2 text-center text-muted-foreground">
                      ...and {parsedLeads.length - 10} more
                    </p>
                  )}
                </div>
                <Button
                  onClick={handleImportLeads}
                  className="mt-4 w-full gradient-primary"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Importing...' : `Import ${parsedLeads.length} Leads`}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Sample Format */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-muted-foreground" />
                Sample CSV Format
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`company,contact_name,email,sector,pain_question,context_hook
Acme Corp,John Smith,john@acme.com,Technology,How are you handling customer support?,I saw your recent product launch
Qatar Airways,Sarah Jones,sarah@qa.com,Aviation,What challenges do you face with booking?,Your expansion to new routes is impressive`}
              </pre>
            </CardContent>
          </Card>
        </div>
      ) : (
        /* Manual Entry Form */
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Add Lead Manually</CardTitle>
            <CardDescription>Enter lead details one at a time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Company *</Label>
                <Input
                  placeholder="Acme Corp"
                  value={manualLead.company || ''}
                  onChange={(e) => setManualLead({ ...manualLead, company: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Contact Name *</Label>
                <Input
                  placeholder="John Smith"
                  value={manualLead.contactName || ''}
                  onChange={(e) => setManualLead({ ...manualLead, contactName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  placeholder="john@acme.com"
                  value={manualLead.email || ''}
                  onChange={(e) => setManualLead({ ...manualLead, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Sector</Label>
                <Input
                  placeholder="Technology"
                  value={manualLead.sector || ''}
                  onChange={(e) => setManualLead({ ...manualLead, sector: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Phase</Label>
                <Select
                  value={manualLead.phase || 'Initial'}
                  onValueChange={(value) => setManualLead({ ...manualLead, phase: value as Phase })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Initial">Initial</SelectItem>
                    <SelectItem value="Reminder">Reminder</SelectItem>
                    <SelectItem value="Escalation">Escalation</SelectItem>
                    <SelectItem value="Pitch">Pitch</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Pain Question</Label>
              <Textarea
                placeholder="What challenge are they facing?"
                value={manualLead.painQuestion || ''}
                onChange={(e) => setManualLead({ ...manualLead, painQuestion: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Context Hook</Label>
              <Textarea
                placeholder="Recent news, achievement, or connection point"
                value={manualLead.contextHook || ''}
                onChange={(e) => setManualLead({ ...manualLead, contextHook: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Additional notes about this lead"
                value={manualLead.notes || ''}
                onChange={(e) => setManualLead({ ...manualLead, notes: e.target.value })}
              />
            </div>
            <Button onClick={handleManualAdd} className="w-full gradient-primary">
              <Plus className="mr-2 h-4 w-4" />
              Add Lead
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeadsUpload;
