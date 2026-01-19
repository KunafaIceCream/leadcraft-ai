import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Mail,
  Sparkles,
  Users,
  Zap,
  Shield,
  BarChart3,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

const features = [
  {
    icon: Sparkles,
    title: 'AI-Powered Personalization',
    description: 'Generate hyper-personalized emails using advanced AI that understands context, tone, and cultural nuances for Qatar/GCC markets.',
  },
  {
    icon: Users,
    title: 'Batch Processing',
    description: 'Upload hundreds of leads via CSV and generate personalized drafts in minutes, not hours.',
  },
  {
    icon: Zap,
    title: 'Multi-Phase Campaigns',
    description: 'Create sequences from initial outreach to follow-ups, escalations, and final pitches—all AI-optimized.',
  },
  {
    icon: Shield,
    title: 'GDPR Compliant',
    description: 'Enterprise-grade security with full data protection compliance for peace of mind.',
  },
  {
    icon: BarChart3,
    title: 'Predictive Scoring',
    description: 'AI scores each draft for predicted engagement, helping you prioritize high-value leads.',
  },
  {
    icon: Mail,
    title: 'Easy Export',
    description: 'Export drafts to CSV, Excel, or JSON for seamless integration with your existing email tools.',
  },
];

const benefits = [
  'Generate 100+ personalized drafts daily',
  'Tailored for Qatar/GCC business culture',
  'Adjustable tone: subtle, professional, or assertive',
  'Context-aware hooks and pain point targeting',
  'Template management and versioning',
  'Real-time analytics and insights',
];

export const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-lg">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-primary">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">Tahqeeq</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button className="gradient-primary shadow-glow">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 text-center">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
              <Sparkles className="h-4 w-4" />
              AI-Powered Email Automation for Qatar/GCC
            </div>
            <h1 className="mb-6 text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
              Generate Personalized
              <br />
              <span className="text-gradient">Email Drafts at Scale</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Transform your outreach with AI that understands your leads. Upload, generate, and export 
              hundreds of tailored emails—perfectly tuned for GCC business culture.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/signup">
                <Button size="lg" className="gradient-primary shadow-glow h-12 px-8 text-lg">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="h-12 px-8 text-lg">
                  View Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Everything You Need</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              A complete solution for generating, managing, and exporting personalized email campaigns.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="border-border/50 bg-card/50 backdrop-blur shadow-card hover:shadow-glow transition-all duration-300">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold md:text-4xl">
                Built for <span className="text-gradient">High-Volume Outreach</span>
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Whether you're reaching out to 10 or 1,000 leads, Tahqeeq scales with your needs 
                while maintaining the personal touch that gets responses.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-card">
                <div className="mb-4 flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-destructive" />
                  <div className="h-3 w-3 rounded-full bg-warning" />
                  <div className="h-3 w-3 rounded-full bg-success" />
                </div>
                <div className="space-y-3">
                  <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                  <div className="h-4 w-full rounded bg-muted animate-pulse" />
                  <div className="h-4 w-5/6 rounded bg-muted animate-pulse" />
                  <div className="h-4 w-2/3 rounded bg-primary/20 animate-pulse" />
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 rounded-xl border border-primary/30 bg-primary/10 p-4 backdrop-blur">
                <div className="flex items-center gap-2 text-primary">
                  <Sparkles className="h-5 w-5" />
                  <span className="font-semibold">AI Score: 9.2</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Ready to Transform Your Outreach?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            Join businesses across Qatar and the GCC who are scaling their email outreach with AI.
          </p>
          <Link to="/signup">
            <Button size="lg" className="gradient-primary shadow-glow h-12 px-8 text-lg">
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                <Mail className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold">Tahqeeq Email Automator</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 Tahqeeq. Built for Qatar/GCC businesses.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
