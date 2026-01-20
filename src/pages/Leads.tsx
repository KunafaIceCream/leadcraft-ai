import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { storage } from '@/lib/storage';
import { Lead, Phase } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Search,
  Upload,
  Trash2,
  Eye,
  Edit,
  Users,
  FileText,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const phaseColors: Record<Phase, string> = {
  Initial: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  Reminder: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  Escalation: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  Pitch: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  'Trigger Follow-Up': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
};

export const Leads = () => {
  const { toast } = useToast();
  const [leads, setLeads] = useState<Lead[]>(storage.getLeads());
  const [search, setSearch] = useState('');
  const [phaseFilter, setPhaseFilter] = useState<string>('all');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.company.toLowerCase().includes(search.toLowerCase()) ||
        lead.contactName.toLowerCase().includes(search.toLowerCase()) ||
        lead.email.toLowerCase().includes(search.toLowerCase()) ||
        lead.sector.toLowerCase().includes(search.toLowerCase());
      
      const matchesPhase = phaseFilter === 'all' || lead.phase === phaseFilter;
      
      return matchesSearch && matchesPhase;
    });
  }, [leads, search, phaseFilter]);

  const handleDelete = (id: string) => {
    storage.deleteLead(id);
    setLeads(storage.getLeads());
    toast({ title: 'Lead deleted', description: 'The lead has been removed.' });
  };

  const handleView = (lead: Lead) => {
    setSelectedLead(lead);
    setIsViewOpen(true);
  };

  const handleEdit = (lead: Lead) => {
    setSelectedLead(lead);
    setIsEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (selectedLead) {
      storage.updateLead(selectedLead.id, selectedLead);
      setLeads(storage.getLeads());
      setIsEditOpen(false);
      toast({ title: 'Lead updated', description: 'Changes have been saved.' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Leads</h1>
          <p className="text-muted-foreground">
            Manage your leads and view generated drafts.
          </p>
        </div>
        <Link to="/leads/upload">
          <Button className="gradient-primary">
            <Upload className="mr-2 h-4 w-4" />
            Upload Leads
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search leads..."
                className="pl-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={phaseFilter} onValueChange={setPhaseFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by phase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Phases</SelectItem>
                <SelectItem value="Initial">Initial</SelectItem>
                <SelectItem value="Reminder">Reminder</SelectItem>
                <SelectItem value="Escalation">Escalation</SelectItem>
                <SelectItem value="Pitch">Pitch</SelectItem>
                <SelectItem value="Trigger Follow-Up">Trigger Follow-Up</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {filteredLeads.length} Lead{filteredLeads.length !== 1 && 's'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredLeads.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No leads found</p>
              <Link to="/leads/upload">
                <Button>Upload Leads</Button>
              </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Phase</TableHead>
                  <TableHead>AI Score</TableHead>
                  <TableHead>Draft</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{lead.contactName}</p>
                        <p className="text-sm text-muted-foreground">{lead.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{lead.company}</TableCell>
                    <TableCell>{lead.sector}</TableCell>
                    <TableCell>
                      <Badge className={phaseColors[lead.phase]} variant="secondary">
                        {lead.phase}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {lead.aiScore > 0 ? (
                        <span className={`font-medium ${
                          lead.aiScore >= 7 ? 'text-green-600 dark:text-green-400' :
                          lead.aiScore >= 4 ? 'text-yellow-600 dark:text-yellow-400' :
                          'text-red-600 dark:text-red-400'
                        }`}>
                          {lead.aiScore}/10
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {lead.generatedDraft ? (
                        <Badge variant="secondary" className="bg-primary/10 text-primary">
                          <FileText className="mr-1 h-3 w-3" />
                          Ready
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleView(lead)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(lead)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(lead.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* View Dialog */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedLead?.contactName}</DialogTitle>
            <DialogDescription>{selectedLead?.company}</DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Email</Label>
                  <p>{selectedLead.email}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Sector</Label>
                  <p>{selectedLead.sector}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Phase</Label>
                  <Badge className={phaseColors[selectedLead.phase]}>
                    {selectedLead.phase}
                  </Badge>
                </div>
                <div>
                  <Label className="text-muted-foreground">AI Score</Label>
                  <p>{selectedLead.aiScore}/10</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Pain Question</Label>
                <p>{selectedLead.painQuestion || '—'}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Context Hook</Label>
                <p>{selectedLead.contextHook || '—'}</p>
              </div>
              {selectedLead.generatedDraft && (
                <div>
                  <Label className="text-muted-foreground">Generated Draft</Label>
                  <div className="mt-2 rounded-lg bg-muted p-4 whitespace-pre-wrap">
                    {selectedLead.generatedDraft}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
            <DialogDescription>Update lead information</DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Contact Name</Label>
                  <Input
                    value={selectedLead.contactName}
                    onChange={(e) =>
                      setSelectedLead({ ...selectedLead, contactName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Company</Label>
                  <Input
                    value={selectedLead.company}
                    onChange={(e) =>
                      setSelectedLead({ ...selectedLead, company: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    value={selectedLead.email}
                    onChange={(e) =>
                      setSelectedLead({ ...selectedLead, email: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sector</Label>
                  <Input
                    value={selectedLead.sector}
                    onChange={(e) =>
                      setSelectedLead({ ...selectedLead, sector: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Pain Question</Label>
                <Textarea
                  value={selectedLead.painQuestion}
                  onChange={(e) =>
                    setSelectedLead({ ...selectedLead, painQuestion: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Context Hook</Label>
                <Textarea
                  value={selectedLead.contextHook}
                  onChange={(e) =>
                    setSelectedLead({ ...selectedLead, contextHook: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  value={selectedLead.notes}
                  onChange={(e) =>
                    setSelectedLead({ ...selectedLead, notes: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEdit}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Leads;
