import { useState } from 'react';
import { storage } from '@/lib/storage';
import { Template, Phase } from '@/lib/types';
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, FileText, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const phaseColors: Record<Phase, string> = {
  Initial: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  Reminder: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  Escalation: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  Pitch: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  'Trigger Follow-Up': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
};

export const Templates = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>(storage.getTemplates());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState<Partial<Template>>({
    name: '',
    phase: 'Initial',
    body: '',
  });

  const handleOpenCreate = () => {
    setEditingTemplate(null);
    setFormData({ name: '', phase: 'Initial', body: '' });
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (template: Template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      phase: template.phase,
      body: template.body,
    });
    setIsDialogOpen(true);
  };

  const handleDuplicate = (template: Template) => {
    const newTemplate: Template = {
      id: crypto.randomUUID(),
      name: `${template.name} (Copy)`,
      phase: template.phase,
      body: template.body,
    };
    storage.addTemplate(newTemplate);
    setTemplates(storage.getTemplates());
    toast({ title: 'Template duplicated' });
  };

  const handleSave = () => {
    if (!formData.name || !formData.body) {
      toast({
        title: 'Required fields missing',
        description: 'Please fill in name and body.',
        variant: 'destructive',
      });
      return;
    }

    if (editingTemplate) {
      storage.updateTemplate(editingTemplate.id, formData);
      toast({ title: 'Template updated' });
    } else {
      const newTemplate: Template = {
        id: crypto.randomUUID(),
        name: formData.name!,
        phase: formData.phase as Phase,
        body: formData.body!,
      };
      storage.addTemplate(newTemplate);
      toast({ title: 'Template created' });
    }

    setTemplates(storage.getTemplates());
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    storage.deleteTemplate(id);
    setTemplates(storage.getTemplates());
    toast({ title: 'Template deleted' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Templates</h1>
          <p className="text-muted-foreground">
            Manage your email templates for different campaign phases.
          </p>
        </div>
        <Button onClick={handleOpenCreate} className="gradient-primary">
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </div>

      {/* Template Variables Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Available Variables</CardTitle>
          <CardDescription>
            Use these placeholders in your templates. They will be replaced with lead data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {['{{contactName}}', '{{company}}', '{{sector}}', '{{painQuestion}}', '{{contextHook}}'].map(
              (variable) => (
                <code
                  key={variable}
                  className="rounded bg-muted px-2 py-1 text-sm font-mono"
                >
                  {variable}
                </code>
              )
            )}
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {templates.map((template) => (
          <Card key={template.id} className="shadow-card hover:shadow-glow transition-all">
            <CardHeader className="flex flex-row items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {template.name}
                </CardTitle>
                <Badge className={phaseColors[template.phase]} variant="secondary">
                  {template.phase}
                </Badge>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" onClick={() => handleDuplicate(template)}>
                  <Copy className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleOpenEdit(template)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(template.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="whitespace-pre-wrap text-sm text-muted-foreground bg-muted rounded-lg p-4 max-h-40 overflow-auto">
                {template.body}
              </pre>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Edit Template' : 'Create New Template'}
            </DialogTitle>
            <DialogDescription>
              {editingTemplate
                ? 'Update your email template'
                : 'Create a new email template for your campaigns'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Template Name</Label>
                <Input
                  placeholder="e.g., Initial Outreach - Professional"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Phase</Label>
                <Select
                  value={formData.phase || 'Initial'}
                  onValueChange={(v) => setFormData({ ...formData, phase: v as Phase })}
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
              <Label>Template Body</Label>
              <Textarea
                placeholder="Dear {{contactName}},

I hope this message finds you well..."
                rows={12}
                value={formData.body || ''}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="gradient-primary">
                {editingTemplate ? 'Save Changes' : 'Create Template'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Templates;
