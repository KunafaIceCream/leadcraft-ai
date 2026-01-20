import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storage } from '@/lib/storage';
import { Lead, SignalTrigger } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Radar,
  Search,
  Twitter,
  Linkedin,
  Zap,
  UserPlus,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const signalTypes = [
  { id: 'hiring', label: 'Hiring/Expansion', keywords: ['hiring', 'recruiting', 'expanding', 'new office'] },
  { id: 'pain_point', label: 'Pain Points', keywords: ['struggling', 'challenge', 'difficult', 'frustrating'] },
  { id: 'funding', label: 'Funding/Investment', keywords: ['raised', 'funding', 'investment', 'series'] },
  { id: 'leadership', label: 'Leadership Changes', keywords: ['appointed', 'new CEO', 'joined as', 'promoted'] },
  { id: 'industry_event', label: 'Industry Events', keywords: ['conference', 'summit', 'webinar', 'event'] },
];

const sectorOptions = [
  'Technology',
  'Finance',
  'Healthcare',
  'Real Estate',
  'Energy',
  'Construction',
  'Hospitality',
  'Retail',
  'Education',
  'Government',
];

// Simulated trigger discovery (would be replaced with real API calls)
const simulateDiscovery = async (settings: {
  platform: string;
  keywords: string[];
  sectors: string[];
  region: string;
}): Promise<SignalTrigger[]> => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const mockTriggers: SignalTrigger[] = [
    {
      id: crypto.randomUUID(),
      platform: 'X',
      source: 'X',
      content: 'We\'re struggling to find qualified talent in Qatar\'s competitive tech market. Any recommendations?',
      authorName: 'Ahmed Al-Thani',
      authorCompany: 'Qatar Tech Solutions',
      authorEmail: 'ahmed@qatartech.qa',
      sector: 'Technology',
      signalType: 'pain_point',
      signalStrength: 8,
      discoveredAt: new Date().toISOString(),
      url: 'https://x.com/example/status/123',
    },
    {
      id: crypto.randomUUID(),
      platform: 'LinkedIn',
      source: 'LinkedIn',
      content: 'Excited to announce our Series B funding round! Looking forward to expanding our Doha operations.',
      authorName: 'Fatima Hassan',
      authorCompany: 'GCC Fintech',
      authorEmail: 'fatima@gccfintech.com',
      sector: 'Finance',
      signalType: 'funding',
      signalStrength: 9,
      discoveredAt: new Date().toISOString(),
      url: 'https://linkedin.com/posts/example',
    },
    {
      id: crypto.randomUUID(),
      platform: 'X',
      source: 'X',
      content: 'Just appointed as the new Head of Digital Transformation at Doha Bank. Excited for the challenges ahead!',
      authorName: 'Mohammed Al-Kuwari',
      authorCompany: 'Doha Bank',
      authorEmail: '',
      sector: 'Finance',
      signalType: 'leadership',
      signalStrength: 7,
      discoveredAt: new Date().toISOString(),
      url: 'https://x.com/example/status/456',
    },
    {
      id: crypto.randomUUID(),
      platform: 'LinkedIn',
      source: 'LinkedIn',
      content: 'Our customer retention rates have been declining despite increased marketing spend. Time to rethink our approach.',
      authorName: 'Sara Al-Marri',
      authorCompany: 'Gulf Retail Group',
      authorEmail: 'sara@gulfretail.com',
      sector: 'Retail',
      signalType: 'pain_point',
      signalStrength: 9,
      discoveredAt: new Date().toISOString(),
      url: 'https://linkedin.com/posts/example2',
    },
  ];

  return mockTriggers.filter((t) => {
    if (settings.sectors.length > 0 && !settings.sectors.includes(t.sector)) return false;
    if (settings.platform !== 'Both' && t.source !== settings.platform) return false;
    return true;
  });
};

export const Discover = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSearching, setIsSearching] = useState(false);
  const [discoveries, setDiscoveries] = useState<SignalTrigger[]>([]);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([]);

  const [settings, setSettings] = useState({
    platform: 'Both',
    keywords: '',
    sectors: [] as string[],
    region: 'Qatar',
    signalTypes: ['pain_point', 'hiring'] as string[],
  });

  const handleSearch = async () => {
    setIsSearching(true);
    setDiscoveries([]);

    try {
      const triggers = await simulateDiscovery({
        platform: settings.platform,
        keywords: settings.keywords.split(',').map((k) => k.trim()),
        sectors: settings.sectors,
        region: settings.region,
      });

      setDiscoveries(triggers);
      storage.saveDiscoveredTriggers(triggers);

      toast({
        title: 'Discovery Complete',
        description: `Found ${triggers.length} potential triggers`,
      });
    } catch (error) {
      toast({
        title: 'Discovery Failed',
        description: 'Unable to search for triggers. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectTrigger = (id: string) => {
    setSelectedTriggers((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedTriggers.length === discoveries.length) {
      setSelectedTriggers([]);
    } else {
      setSelectedTriggers(discoveries.map((d) => d.id));
    }
  };

  const handleConvertToLeads = () => {
    const selected = discoveries.filter((d) => selectedTriggers.includes(d.id));

    const newLeads: Lead[] = selected.map((trigger) => ({
      id: crypto.randomUUID(),
      company: trigger.authorCompany,
      contactName: trigger.authorName,
      email: trigger.authorEmail || `contact@${trigger.authorCompany.toLowerCase().replace(/\s+/g, '')}.com`,
      sector: trigger.sector,
      painQuestion: '',
      contextHook: trigger.content,
      signalTrigger: trigger.content,
      signalDate: trigger.discoveredAt,
      signalStrength: trigger.signalStrength,
      phase: 'Trigger Follow-Up' as const,
      aiScore: 0,
      lastUpdated: new Date().toISOString(),
      notes: `Discovered via ${trigger.source}: ${trigger.url}`,
      generatedDraft: '',
      videoScript: '',
    }));

    const existingLeads = storage.getLeads();
    storage.saveLeads([...existingLeads, ...newLeads]);

    toast({
      title: 'Leads Created',
      description: `${newLeads.length} signal-enriched leads added to your pipeline.`,
    });

    navigate('/leads');
  };

  const getSignalStrengthColor = (strength: number) => {
    if (strength >= 8) return 'text-green-500';
    if (strength >= 6) return 'text-yellow-500';
    if (strength >= 4) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Discover Triggers</h1>
        <p className="text-muted-foreground">
          Find buying signals on X and LinkedIn to identify leads in active buying windows.
        </p>
      </div>

      {/* Search Configuration */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radar className="h-5 w-5 text-primary" />
            Signal Discovery Settings
          </CardTitle>
          <CardDescription>
            Configure your search parameters to find relevant buying signals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Platform</Label>
              <Select
                value={settings.platform}
                onValueChange={(v) => setSettings({ ...settings, platform: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Both">Both Platforms</SelectItem>
                  <SelectItem value="X">X (Twitter) Only</SelectItem>
                  <SelectItem value="LinkedIn">LinkedIn Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Region Focus</Label>
              <Select
                value={settings.region}
                onValueChange={(v) => setSettings({ ...settings, region: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Qatar">Qatar</SelectItem>
                  <SelectItem value="GCC">GCC Region</SelectItem>
                  <SelectItem value="MENA">MENA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Custom Keywords</Label>
              <Input
                placeholder="talent, expansion, struggling..."
                value={settings.keywords}
                onChange={(e) => setSettings({ ...settings, keywords: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Target Sectors</Label>
            <div className="flex flex-wrap gap-2">
              {sectorOptions.map((sector) => (
                <Badge
                  key={sector}
                  variant={settings.sectors.includes(sector) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => {
                    setSettings({
                      ...settings,
                      sectors: settings.sectors.includes(sector)
                        ? settings.sectors.filter((s) => s !== sector)
                        : [...settings.sectors, sector],
                    });
                  }}
                >
                  {sector}
                </Badge>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Signal Types</Label>
            <div className="flex flex-wrap gap-4">
              {signalTypes.map((type) => (
                <div key={type.id} className="flex items-center gap-2">
                  <Checkbox
                    id={type.id}
                    checked={settings.signalTypes.includes(type.id)}
                    onCheckedChange={(checked) => {
                      setSettings({
                        ...settings,
                        signalTypes: checked
                          ? [...settings.signalTypes, type.id]
                          : settings.signalTypes.filter((t) => t !== type.id),
                      });
                    }}
                  />
                  <Label htmlFor={type.id} className="cursor-pointer">
                    {type.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleSearch}
            disabled={isSearching}
            className="w-full gradient-primary"
          >
            {isSearching ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching for Triggers...
              </>
            ) : (
              <>
                <Search className="mr-2 h-4 w-4" />
                Discover Buying Signals
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* API Configuration Notice */}
      <Card className="border-yellow-500/30 bg-yellow-500/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-500">Demo Mode Active</p>
              <p className="text-sm text-muted-foreground">
                Configure your X API and LinkedIn credentials in Settings to enable real-time trigger discovery.
                Currently showing simulated results for demonstration.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Discovered Triggers */}
      {discoveries.length > 0 && (
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Discovered Triggers
              </CardTitle>
              <CardDescription>
                {discoveries.length} potential signals found • {selectedTriggers.length} selected
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleSelectAll}>
                {selectedTriggers.length === discoveries.length ? 'Deselect All' : 'Select All'}
              </Button>
              <Button
                size="sm"
                onClick={handleConvertToLeads}
                disabled={selectedTriggers.length === 0}
                className="gradient-primary"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Convert to Leads ({selectedTriggers.length})
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {discoveries.map((trigger) => (
                <div
                  key={trigger.id}
                  className={`p-4 rounded-lg border transition-all cursor-pointer ${
                    selectedTriggers.includes(trigger.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => handleSelectTrigger(trigger.id)}
                >
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={selectedTriggers.includes(trigger.id)}
                      onCheckedChange={() => handleSelectTrigger(trigger.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {trigger.source === 'X' ? (
                            <Twitter className="h-4 w-4 text-blue-400" />
                          ) : (
                            <Linkedin className="h-4 w-4 text-blue-600" />
                          )}
                          <span className="font-medium">{trigger.authorName}</span>
                          <span className="text-muted-foreground">@</span>
                          <span className="text-muted-foreground">{trigger.authorCompany}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{trigger.sector}</Badge>
                          <span className={`font-medium ${getSignalStrengthColor(trigger.signalStrength)}`}>
                            <TrendingUp className="h-4 w-4 inline mr-1" />
                            {trigger.signalStrength}/10
                          </span>
                        </div>
                      </div>
                      <p className="text-sm bg-muted/50 rounded p-3 italic">
                        "{trigger.content}"
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          {trigger.signalType.replace('_', ' ')}
                        </span>
                        <span>
                          Discovered {new Date(trigger.discoveredAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!isSearching && discoveries.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="py-12 text-center">
            <Radar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Ready to Discover</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Configure your search parameters above and click "Discover Buying Signals"
              to find leads posting about relevant challenges in Qatar/GCC.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Discover;
