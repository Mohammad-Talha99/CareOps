import Navbar from "@/components/navbar";
import { ArrowUpRight, CheckCircle2, Activity, Shield, Zap } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { GlobeBackground } from "@/components/ui/globe-background";

export default function Home() {
  return (
    <main className="min-h-screen text-foreground overflow-hidden">
      <GlobeBackground />
      <Navbar />

      {/* Hero Section */}
      <section className="relative container mx-auto px-6 pt-32 pb-24 md:pt-48 md:pb-32">
        <div className="absolute top-0 right-0 -z-10 opacity-20 dark:opacity-10 translate-x-1/3 -translate-y-1/4">
          {/* Abstract decorative shape */}
          <div className="w-[800px] h-[800px] rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl"></div>
        </div>

        <ScrollAnimation className="max-w-4xl">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium uppercase tracking-wider mb-8 border border-primary/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Next Gen Operations
          </span>
          <h1 className="font-sans text-5xl md:text-7xl font-bold leading-[1.1] mb-8 text-foreground tracking-tight">
            Streamline your care operations with <span className="text-primary">intelligence.</span>
          </h1>

          <p className="max-w-2xl text-lg md:text-xl text-muted-foreground font-light leading-relaxed mb-10">
            CareOps connects the dots between your workflows, teams, and data.
            Designed for modern healthcare and service ventures to scale with confidence.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/dashboard">
              <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow">
                Get Started Now
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base border-primary/20 hover:bg-primary/5">
                Request Demo
              </Button>
            </Link>
          </div>
        </ScrollAnimation>
      </section>

      {/* Trust/Stats Section */}
      <section className="border-y border-border bg-muted/30">
        <div className="container mx-auto px-6 py-16">
          <ScrollAnimation delay={0.2} className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatItem value="99.9%" label="Uptime Reliability" />
            <StatItem value="10k+" label="Active Users" />
            <StatItem value="50+" label="Enterprise Partners" />
            <StatItem value="24/7" label="Support Coverage" />
          </ScrollAnimation>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center mb-32">
          <ScrollAnimation>
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ventures across <br /> <span className="text-primary">critical industries</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              We empower visionary founders building transformative companies across healthcare, fintech, and more.
            </p>
            <ul className="space-y-4 mb-8">
              <FeatureList text="HIPAA-Compliant Infrastructure" />
              <FeatureList text="Automated Workflow Engines" />
              <FeatureList text="Real-time Analytics Dashboard" />
            </ul>
            <Link href="/features" className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors group">
              Explore capabilities <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </ScrollAnimation>

          <ScrollAnimation delay={0.2} className="relative">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/5 to-secondary/10 border border-primary/10 p-8 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-black/10"></div>
              <div className="grid grid-cols-2 gap-4 relative z-10 w-full">
                <FeatureCard icon={<Activity className="w-6 h-6 text-primary" />} title="Health Monitoring" />
                <FeatureCard icon={<Shield className="w-6 h-6 text-secondary-foreground" />} title="Security First" />
                <FeatureCard icon={<Zap className="w-6 h-6 text-amber-500" />} title="Instant Actions" />
                <FeatureCard icon={<CheckCircle2 className="w-6 h-6 text-green-500" />} title="Compliance Ready" />
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-24">
        <ScrollAnimation className="rounded-3xl bg-primary text-primary-foreground p-12 md:p-24 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]"></div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to scale?</h2>
            <p className="text-primary-foreground/80 text-xl mb-10">
              Join the platform designed for the future of operations.
            </p>
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="rounded-full px-10 py-6 text-lg font-semibold shadow-xl">
                Start for free
              </Button>
            </Link>
          </div>
        </ScrollAnimation>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/20 pt-20 pb-10">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-16">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary border border-primary/30">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold">CareOps</span>
              </div>
              <p className="text-muted-foreground max-w-xs">
                Unified Operations Platform for modern service businesses.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-20">
              <FooterColumn title="Platform" links={["Features", "Integrations", "Pricing", "API"]} />
              <FooterColumn title="Company" links={["About", "Careers", "Blog", "Contact"]} />
              <FooterColumn title="Legal" links={["Privacy", "Terms", "Security"]} />
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground border-t border-border pt-8">
            © {new Date().getFullYear()} CareOps. All rights reserved.
          </div>
        </div>
      </footer>
    </main>
  );
}

function StatItem({ value, label }: { value: string, label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">{value}</div>
      <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{label}</div>
    </div>
  )
}

function FeatureList({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3 text-foreground/80">
      <CheckCircle2 className="w-5 h-5 text-primary" />
      {text}
    </li>
  )
}

function FeatureCard({ icon, title }: { icon: React.ReactNode, title: string }) {
  return (
    <div className="bg-background border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="font-semibold text-sm">{title}</h3>
    </div>
  )
}

function FooterColumn({ title, links }: { title: string, links: string[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="font-semibold mb-1">{title}</h4>
      {links.map(link => (
        <a key={link} href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm">
          {link}
        </a>
      ))}
    </div>
  )
}
