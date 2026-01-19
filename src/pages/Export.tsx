import { useState, useMemo } from 'react';
import { storage } from '@/lib/storage';
import { Lead } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, FileSpreadsheet, FileJson, FileText, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type ExportFormat = 'csv' | 'json' | 'txt';

export const Export = () => {
  const { toast } = useToast();
  const leads = storage.getLeads();
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);

  const leadsWithDrafts = useMemo(() => {
    return leads.filter((l) => l.generatedDraft);
  }, [leads]);

  const handleSelectAll = () => {
    if (selectedLeadIds.length === leadsWithDrafts.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(leadsWithDrafts.map((l) => l.id));
    }
  };

  const handleSelectLead = (id: string) => {
    setSelectedLeadIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const exportData = (format: ExportFormat) => {
    const selectedLeads = leads.filter((l) => selectedLeadIds.includes(l.id));
    
    if (selectedLeads.length === 0) {
      toast({
        title: 'No leads selected',
        description: 'Please select at least one lead to export.',
        variant: 'destructive',
      });
      return;
    }

    let content: string;
    let filename: string;
    let mimeType: string;

    switch (format) {
      case 'csv':
        const headers = ['Company', 'Contact Name', 'Email', 'Sector', 'Phase', 'AI Score', 'Generated Draft'];
        const rows = selectedLeads.map((l) => [
          l.company,
          l.contactName,
          l.email,
          l.sector,
          l.phase,
          l.aiScore.toString(),
          `"${l.generatedDraft.replace(/"/g, '""')}"`,
        ]);
        content = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        filename = `tahqeeq-export-${Date.now()}.csv`;
        mimeType = 'text/csv';
        break;

      case 'json':
        content = JSON.stringify(
          selectedLeads.map((l) => ({
            company: l.company,
            contactName: l.contactName,
            email: l.email,
            sector: l.sector,
            phase: l.phase,
            aiScore: l.aiScore,
            generatedDraft: l.generatedDraft,
          })),
          null,
          2
        );
        filename = `tahqeeq-export-${Date.now()}.json`;
        mimeType = 'application/json';
        break;

      case 'txt':
        content = selectedLeads
          .map(
            (l) =>
              `=== ${l.company} - ${l.contactName} ===\nEmail: ${l.email}\nPhase: ${l.phase}\nAI Score: ${l.aiScore}/10\n\n${l.generatedDraft}\n\n${'='.repeat(50)}\n`
          )
          .join('\n');
        filename = `tahqeeq-export-${Date.now()}.txt`;
        mimeType = 'text/plain';
        break;
    }

    // Create and download file
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: 'Export complete!',
      description: `${selectedLeads.length} drafts exported as ${format.toUpperCase()}.`,
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Export Drafts</h1>
        <p className="text-muted-foreground">
          Download your generated email drafts in various formats.
        </p>
      </div>

      {/* Export Options */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card
          className="cursor-pointer hover:border-primary/50 hover:shadow-glow transition-all"
          onClick={() => exportData('csv')}
        >
          <CardContent className="flex flex-col items-center py-8">
            <FileSpreadsheet className="h-12 w-12 text-primary mb-4" />
            <h3 className="font-semibold">Export as CSV</h3>
            <p className="text-sm text-muted-foreground text-center mt-1">
              Compatible with Excel, Google Sheets
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:border-primary/50 hover:shadow-glow transition-all"
          onClick={() => exportData('json')}
        >
          <CardContent className="flex flex-col items-center py-8">
            <FileJson className="h-12 w-12 text-primary mb-4" />
            <h3 className="font-semibold">Export as JSON</h3>
            <p className="text-sm text-muted-foreground text-center mt-1">
              For API integrations
            </p>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer hover:border-primary/50 hover:shadow-glow transition-all"
          onClick={() => exportData('txt')}
        >
          <CardContent className="flex flex-col items-center py-8">
            <FileText className="h-12 w-12 text-primary mb-4" />
            <h3 className="font-semibold">Export as TXT</h3>
            <p className="text-sm text-muted-foreground text-center mt-1">
              Plain text format
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Lead Selection */}
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Select Drafts to Export</CardTitle>
            <CardDescription>
              {leadsWithDrafts.length} drafts available for export
            </CardDescription>
          </div>
          <span className="text-sm text-muted-foreground">
            {selectedLeadIds.length} selected
          </span>
        </CardHeader>
        <CardContent>
          {leadsWithDrafts.length === 0 ? (
            <div className="text-center py-12">
              <Download className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No drafts available to export</p>
              <p className="text-sm text-muted-foreground mt-2">
                Generate drafts first to export them.
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedLeadIds.length === leadsWithDrafts.length}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Phase</TableHead>
                  <TableHead>AI Score</TableHead>
                  <TableHead>Preview</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leadsWithDrafts.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedLeadIds.includes(lead.id)}
                        onCheckedChange={() => handleSelectLead(lead.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{lead.contactName}</p>
                        <p className="text-sm text-muted-foreground">{lead.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{lead.company}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{lead.phase}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${
                        lead.aiScore >= 7 ? 'text-green-600 dark:text-green-400' :
                        lead.aiScore >= 4 ? 'text-yellow-600 dark:text-yellow-400' :
                        'text-red-600 dark:text-red-400'
                      }`}>
                        {lead.aiScore}/10
                      </span>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="truncate text-sm text-muted-foreground">
                        {lead.generatedDraft.slice(0, 50)}...
                      </p>
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

export default Export;
