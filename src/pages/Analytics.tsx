import { useMemo } from 'react';
import { storage } from '@/lib/storage';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  FileText,
  TrendingUp,
  Mail,
  BarChart3,
  PieChart,
} from 'lucide-react';

export const Analytics = () => {
  const leads = storage.getLeads();

  const stats = useMemo(() => {
    const totalLeads = leads.length;
    const withDrafts = leads.filter((l) => l.generatedDraft).length;
    const avgScore = leads.length
      ? leads.reduce((sum, l) => sum + (l.aiScore || 0), 0) / leads.length
      : 0;

    const byPhase = {
      Initial: leads.filter((l) => l.phase === 'Initial').length,
      Reminder: leads.filter((l) => l.phase === 'Reminder').length,
      Escalation: leads.filter((l) => l.phase === 'Escalation').length,
      Pitch: leads.filter((l) => l.phase === 'Pitch').length,
    };

    const bySector = leads.reduce((acc, lead) => {
      const sector = lead.sector || 'Unknown';
      acc[sector] = (acc[sector] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const scoreDistribution = {
      high: leads.filter((l) => l.aiScore >= 7).length,
      medium: leads.filter((l) => l.aiScore >= 4 && l.aiScore < 7).length,
      low: leads.filter((l) => l.aiScore > 0 && l.aiScore < 4).length,
      unscored: leads.filter((l) => !l.aiScore).length,
    };

    return {
      totalLeads,
      withDrafts,
      avgScore,
      byPhase,
      bySector,
      scoreDistribution,
      draftRate: totalLeads > 0 ? (withDrafts / totalLeads) * 100 : 0,
    };
  }, [leads]);

  const topSectors = Object.entries(stats.bySector)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">
          Insights into your email automation performance.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Leads
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLeads}</div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Drafts Generated
            </CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.withDrafts}</div>
            <Progress value={stats.draftRate} className="mt-2 h-1.5" />
            <p className="text-xs text-muted-foreground mt-1">
              {stats.draftRate.toFixed(0)}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average AI Score
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgScore.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">Out of 10</p>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Templates
            </CardTitle>
            <Mail className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storage.getTemplates().length}</div>
            <p className="text-xs text-muted-foreground">Active templates</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Phase Distribution */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              Campaign Phase Distribution
            </CardTitle>
            <CardDescription>Leads by outreach phase</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(stats.byPhase).map(([phase, count]) => {
              const percentage = stats.totalLeads > 0 ? (count / stats.totalLeads) * 100 : 0;
              const colors: Record<string, string> = {
                Initial: 'bg-blue-500',
                Reminder: 'bg-yellow-500',
                Escalation: 'bg-orange-500',
                Pitch: 'bg-purple-500',
              };
              return (
                <div key={phase} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{phase}</span>
                    <span className="text-muted-foreground">{count} ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full ${colors[phase]}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* AI Score Distribution */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              AI Score Distribution
            </CardTitle>
            <CardDescription>Quality of generated drafts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: 'High (7-10)', value: stats.scoreDistribution.high, color: 'bg-green-500' },
              { label: 'Medium (4-6)', value: stats.scoreDistribution.medium, color: 'bg-yellow-500' },
              { label: 'Low (1-3)', value: stats.scoreDistribution.low, color: 'bg-red-500' },
              { label: 'Unscored', value: stats.scoreDistribution.unscored, color: 'bg-gray-500' },
            ].map((item) => {
              const percentage = stats.totalLeads > 0 ? (item.value / stats.totalLeads) * 100 : 0;
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{item.label}</span>
                    <span className="text-muted-foreground">{item.value} ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full ${item.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Top Sectors */}
        <Card className="shadow-card md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Top Sectors
            </CardTitle>
            <CardDescription>Most targeted industries</CardDescription>
          </CardHeader>
          <CardContent>
            {topSectors.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No sector data available
              </p>
            ) : (
              <div className="space-y-4">
                {topSectors.map(([sector, count], index) => {
                  const percentage = stats.totalLeads > 0 ? (count / stats.totalLeads) * 100 : 0;
                  return (
                    <div key={sector} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <span className="text-muted-foreground">#{index + 1}</span>
                          {sector}
                        </span>
                        <span className="text-muted-foreground">{count} leads ({percentage.toFixed(0)}%)</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
