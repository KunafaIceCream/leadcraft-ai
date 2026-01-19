import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { storage } from '@/lib/storage';
import {
  Users,
  FileText,
  Sparkles,
  Download,
  ArrowRight,
  TrendingUp,
  Upload,
} from 'lucide-react';

export const Dashboard = () => {
  const leads = storage.getLeads();
  const templates = storage.getTemplates();

  const stats = useMemo(() => {
    const draftsGenerated = leads.filter((l) => l.generatedDraft).length;
    const avgScore = leads.length
      ? leads.reduce((sum, l) => sum + (l.aiScore || 0), 0) / leads.length
      : 0;

    return {
      totalLeads: leads.length,
      draftsGenerated,
      avgAiScore: avgScore.toFixed(1),
      templates: templates.length,
    };
  }, [leads, templates]);

  const recentLeads = leads.slice(-5).reverse();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your email automation.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-card hover:shadow-glow transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Leads
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
            <p className="text-xs text-muted-foreground">
              Across all campaigns
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Drafts Generated
            </CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draftsGenerated}</div>
            <p className="text-xs text-muted-foreground">
              Ready for export
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. AI Score
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgAiScore}</div>
            <p className="text-xs text-muted-foreground">
              Predicted engagement
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Templates
            </CardTitle>
            <Sparkles className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.templates}</div>
            <p className="text-xs text-muted-foreground">
              Active templates
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link to="/leads/upload" className="block">
          <Card className="h-full cursor-pointer border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 transition-all">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Upload className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold">Upload Leads</h3>
              <p className="text-sm text-muted-foreground text-center mt-1">
                Import leads from CSV
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/generate" className="block">
          <Card className="h-full cursor-pointer border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 transition-all">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Sparkles className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold">Generate Drafts</h3>
              <p className="text-sm text-muted-foreground text-center mt-1">
                Create AI-powered emails
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/export" className="block">
          <Card className="h-full cursor-pointer border-dashed border-2 hover:border-primary/50 hover:bg-primary/5 transition-all">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Download className="h-10 w-10 text-primary mb-4" />
              <h3 className="font-semibold">Export Drafts</h3>
              <p className="text-sm text-muted-foreground text-center mt-1">
                Download CSV or Excel
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Leads */}
      <Card className="shadow-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Leads</CardTitle>
          <Link to="/leads">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentLeads.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No leads yet</p>
              <Link to="/leads/upload">
                <Button variant="outline" className="mt-4">
                  Upload Your First Leads
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div>
                    <p className="font-medium">{lead.contactName}</p>
                    <p className="text-sm text-muted-foreground">
                      {lead.company} • {lead.sector}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      lead.phase === 'Initial' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' :
                      lead.phase === 'Reminder' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' :
                      lead.phase === 'Escalation' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400' :
                      'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                    }`}>
                      {lead.phase}
                    </span>
                    {lead.generatedDraft && (
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        Draft Ready
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
