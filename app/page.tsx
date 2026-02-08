"use client"

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Award, Brain, FileText, Map, TrendingUp, Users, Zap, Globe, Shield, Sparkles } from "lucide-react";

import { Waves } from "@/components/Waves";

const MARKET_TRENDS = [
  { skill: "Prompt Engineering", growth: "+420%", salary: "$140k+" },
  { skill: "Full-Stack Dev", growth: "+125%", salary: "$110k+" },
  { skill: "Cybersecurity", growth: "+310%", salary: "$130k+" },
  { skill: "Cloud Arch", growth: "+180%", salary: "$150k+" },
  { skill: "Data Science", growth: "+95%", salary: "$120k+" },
  { skill: "UI/UX Design", growth: "+75%", salary: "$95k+" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      {/* 1. LIVE MARKET PULSE TICKER */}
      <div className="relative z-50 bg-primary/10 border-b border-primary/20 backdrop-blur-md overflow-hidden py-1.5 h-10 flex items-center">
        <div className="flex animate-[scroll_40s_linear_infinite] whitespace-nowrap gap-12 items-center">
          {[...MARKET_TRENDS, ...MARKET_TRENDS].map((trend, i) => (
            <div key={i} className="flex items-center gap-4 text-[10px] font-black tracking-[0.2em] uppercase">
              <span className="text-primary opacity-50">•</span>
              <span className="text-foreground/80">{trend.skill}</span>
              <span className="text-emerald-400">{trend.growth}</span>
              <span className="text-foreground/60">{trend.salary}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none -z-0">
        <Waves
          backgroundColor="transparent"
          strokeColor="var(--primary-color)"
          pointerSize={0.4}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background pointer-events-none" />
      </div>

      {/* 2. NAVIGATION */}
      <nav className="relative z-40 border-b border-white/5 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_4px_0_var(--primary-color)] group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-black tracking-tighter italic font-[family-name:var(--font-orbitron)] bg-gradient-to-r from-foreground to-foreground/60 bg-clip-text text-transparent">
              SOLOLEVELING
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            <DuoNavLink href="/discovery" label="Discovery" />
            <DuoNavLink href="/audit" label="Audit" />
            <DuoNavLink href="/roadmap/Software-Engineering" label="Strategy" />
            <DuoNavLink href="/mock-interview" label="Interview" />
            <DuoNavLink href="/leaderboard" label="Ranks" />
          </div>

          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-black uppercase text-xs tracking-widest px-8 rounded-xl h-11 border-b-4 border-primary/70 active:translate-y-1 active:border-b-0 transition-all">
                Launch Platform
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* 3. HERO SECTION */}
      <section className="relative z-30 container mx-auto px-6 pt-32 pb-40">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Badge className="mb-8 bg-primary/10 text-primary border-primary/20 px-4 py-1.5 uppercase tracking-[0.2em] font-black text-[10px] rounded-full">
              <Sparkles className="w-3 h-3 mr-2" /> The Gamer's Guide to Enterprise Mastery
            </Badge>

            <h1 className="text-7xl md:text-8xl font-black mb-8 italic tracking-tighter leading-[0.9] uppercase font-[family-name:var(--font-orbitron)]">
              <span className="bg-gradient-to-b from-foreground to-foreground/50 bg-clip-text text-transparent">Stop Applying.</span>
              <br />
              <span className="text-primary drop-shadow-[0_0_15px_rgba(var(--primary-color),0.3)]">Start Leveling.</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
              The world's first <span className="text-foreground font-black">Hierarchical Hub</span> for AI-driven professional growth. Precision roadmaps, deep resume audits, and real-time market intel.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/discovery">
                <Button size="lg" className="h-16 px-12 rounded-2xl bg-foreground text-background font-black uppercase tracking-widest text-sm hover:bg-foreground/90 border-b-8 border-foreground/70 active:translate-y-1 active:border-b-0 transition-all">
                  Assess My Class <ArrowRight className="ml-3 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/audit">
                <Button size="lg" variant="outline" className="h-16 px-12 rounded-2xl border-2 border-border bg-background/50 text-foreground font-black uppercase tracking-widest text-sm hover:bg-card transition-all shadow-[0_8px_0_var(--secondary-color)] active:translate-y-1 active:shadow-none">
                  Resume Protocol
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. HUB GRID (The Trial Blocks) */}
      <section className="relative z-30 container mx-auto px-6 pb-40">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <HubCard
            icon={<Brain className="w-8 h-8" />}
            title="Discovery"
            desc="The sorting hat for your technical destiny."
            href="/discovery"
            color="violet"
          />
          <HubCard
            icon={<FileText className="w-8 h-8" />}
            title="Audit Lab"
            desc="Split-screen resume gap analysis vs. AI benchmarks."
            href="/audit"
            color="cyan"
          />
          <HubCard
            icon={<Map className="w-8 h-8" />}
            title="Strategy"
            desc="JSON-driven roadmap trees with locked mission nodes."
            href="/roadmap/Software-Engineering"
            color="fuchsia"
          />
          <HubCard
            icon={<Award className="w-8 h-8" />}
            title="The Trial"
            desc="Radar-chart readiness quizzes for final verification."
            href="/quiz"
            color="emerald"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-30 border-t border-white/5 py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-violet-500" />
            <span className="font-black italic uppercase text-sm tracking-widest text-slate-400">© 2026 SoloLeveling Protocol</span>
          </div>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
            <Link href="/leaderboard" className="hover:text-white transition-colors">Global Ranks</Link>
            <Link href="/market-alerts" className="hover:text-white transition-colors">Market Pulse</Link>
            <Link href="/mock-interview" className="hover:text-white transition-colors">Mock Interview</Link>
            <Link href="/recruiters" className="hover:text-white transition-colors">Recruiter Directory</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function DuoNavLink({ href, label }: { href: string, label: string }) {
  return (
    <Link href={href} className="text-[11px] font-black uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors relative group">
      {label}
      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
    </Link>
  )
}

function HubCard({ icon, title, desc, href, color }: { icon: any, title: string, desc: string, href: string, color: string }) {
  return (
    <Link href={href} className="group">
      <Card className="h-full bg-card border-border backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 cursor-pointer hover:border-primary/50 group-hover:text-primary">
        <CardHeader className="p-8">
          <div className="w-14 h-14 rounded-2xl bg-background border-2 border-border flex items-center justify-center mb-6 transition-colors group-hover:border-primary/50 group-hover:text-primary">
            {icon}
          </div>
          <CardTitle className="text-2xl font-black uppercase italic tracking-tight text-foreground mb-2 font-[family-name:var(--font-orbitron)]">
            {title}
          </CardTitle>
          <CardDescription className="text-muted-foreground font-medium leading-relaxed">
            {desc}
          </CardDescription>
        </CardHeader>
      </Card>
    </Link>
  )
}
