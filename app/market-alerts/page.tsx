"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
    TrendingUp, Zap, Target, Search,
    ArrowUpRight, ArrowDownRight, Briefcase,
    ChevronRight, Loader2, Sparkles, LayoutGrid
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Script from "next/script"
import { BackButton } from "@/components/ui/back-button"

const FAKE_TRENDS = [
    { skill: "Large Language Models", growth: "+142%", status: "explosive", roles: 4500 },
    { skill: "Next.js 15", growth: "+89%", status: "rising", roles: 1200 },
    { skill: "Prompt Engineering", growth: "+210%", status: "explosive", roles: 3100 },
    { skill: "Vector Databases", growth: "+65%", status: "rising", roles: 800 },
    { skill: "Tailwind CSS", growth: "-12%", status: "stable", roles: 8000 },
]

export default function MarketAlertsPage() {
    const [query, setQuery] = useState("")
    const [loading, setLoading] = useState(false)
    const [analysis, setAnalysis] = useState<any>(null)

    const handleSearch = async () => {
        if (!query.trim()) return
        setLoading(true)
        try {
            const prompt = `Analyze the current job market trends for the role: "${query}".
            Provide:
            1. 5 Top trending skills.
            2. Estimated salary range (entry, mid, senior) in USD.
            3. "Market Temperature" (Cold, Warm, Hot, Overheated).
            4. One "Pro Tip" for 2026.
            
            Return strictly JSON:
            {
              "skills": ["...", "..."],
              "salaries": {"entry": "...", "mid": "...", "senior": "..."},
              "temp": "...",
              "pro_tip": "..."
            }`

            const response = await (window as any).puter.ai.chat(prompt, { model: 'gemini-3-pro-preview' })
            const content = response?.message?.content || response?.text || ""
            const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim()
            setAnalysis(JSON.parse(cleanJson))
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-12 font-sans relative overflow-hidden transition-colors duration-500">
            <Script src="https://js.puter.com/v2/" strategy="lazyOnload" />

            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[150px]" />
            </div>

            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b-2 border-border pb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-5 h-5 text-primary fill-primary" />
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">Live Pulse</span>
                        </div>
                        <h1 className="text-5xl font-black uppercase italic tracking-tighter text-foreground font-[family-name:var(--font-orbitron)] leading-none">Market Pivot Alerts</h1>
                        <p className="text-muted-foreground font-bold mt-2 uppercase text-xs tracking-widest leading-relaxed">Predicting the future of tech demand</p>
                    </div>
                    <div className="flex gap-4">
                        <BackButton href="/dashboard" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Search & Analysis */}
                    <div className="lg:col-span-2 space-y-8">
                        <Card className="bg-card border-border border-b-8 rounded-[40px] p-8 shadow-2xl">
                            <CardContent className="p-0 space-y-6">
                                <div className="space-y-4">
                                    <h2 className="text-2xl font-black uppercase italic text-foreground flex items-center gap-3">
                                        <Search className="w-6 h-6 text-primary" /> Deep Domain Analysis
                                    </h2>
                                    <div className="flex gap-4">
                                        <Input
                                            placeholder="Enter target role (e.g. Cloud Architect)..."
                                            value={query}
                                            onChange={(e) => setQuery(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                            className="h-16 bg-background border-2 border-border rounded-2xl px-6 text-foreground font-bold focus-visible:ring-0 focus-visible:border-primary/50"
                                        />
                                        <Button
                                            onClick={handleSearch}
                                            disabled={loading}
                                            className="h-16 px-10 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest hover:bg-primary/90 transition-all border-b-4 border-primary/70 active:translate-y-1 active:border-b-0"
                                        >
                                            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "SCAN"}
                                        </Button>
                                    </div>
                                </div>

                                {analysis && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="pt-8 border-t border-border grid grid-cols-1 md:grid-cols-2 gap-8"
                                    >
                                        <div className="space-y-6">
                                            <div>
                                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2">Market Temperature</p>
                                                <div className="flex items-center gap-3">
                                                    <span className={`text-2xl font-black uppercase italic ${analysis.temp.includes('Hot') || analysis.temp.includes('Overheated') ? 'text-destructive' : 'text-emerald-500'
                                                        }`}>
                                                        {analysis.temp}
                                                    </span>
                                                    <div className="flex gap-1">
                                                        {[1, 2, 3, 4, 5].map(i => (
                                                            <div key={i} className={`w-3 h-6 rounded-sm ${i <= 4 ? 'bg-primary' : 'bg-secondary'}`} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-2">Top Trending Skills</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {analysis.skills.map((s: string, i: number) => (
                                                        <Badge key={i} className="bg-primary/10 text-primary border-2 border-primary/30 px-3 py-1.5 rounded-lg font-black uppercase text-[10px]">
                                                            {s}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6 bg-background/50 p-6 rounded-3xl border-2 border-border shadow-inner">
                                            <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest mb-4">Salary Insights (Annual)</p>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-bold uppercase text-muted-foreground">Entry</span>
                                                    <span className="text-lg font-black italic text-foreground">{analysis.salaries.entry}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-bold uppercase text-muted-foreground">Mid-Level</span>
                                                    <span className="text-xl font-black italic text-primary">{analysis.salaries.mid}</span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs font-bold uppercase text-muted-foreground">Senior</span>
                                                    <span className="text-2xl font-black italic text-foreground">{analysis.salaries.senior}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="md:col-span-2 bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-3xl border-2 border-primary/20 backdrop-blur">
                                            <div className="flex gap-4 items-start">
                                                <Sparkles className="w-8 h-8 text-primary shrink-0" />
                                                <div>
                                                    <p className="text-[10px] font-black uppercase text-primary tracking-widest mb-1">Strategist Pro-Tip</p>
                                                    <p className="text-sm font-bold text-foreground italic leading-relaxed">{analysis.pro_tip}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right: Global Trends */}
                    <div className="space-y-8">
                        <h3 className="text-xl font-black uppercase italic text-foreground flex items-center gap-3 ml-2">
                            <TrendingUp className="w-6 h-6 text-primary" /> Global Hotlist
                        </h3>
                        <div className="space-y-4">
                            {FAKE_TRENDS.map((t, i) => (
                                <Card key={i} className="bg-card border-border border-b-4 rounded-3xl p-5 hover:bg-accent transition-colors cursor-pointer group">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="font-black text-foreground text-sm uppercase tracking-tight group-hover:text-primary transition-colors">{t.skill}</p>
                                            <p className="text-[10px] font-bold text-muted-foreground uppercase">{t.roles} Openings</p>
                                        </div>
                                        <div className={`flex items-center gap-1 text-[11px] font-black ${t.growth.startsWith('+') ? 'text-primary' : 'text-muted-foreground'}`}>
                                            {t.growth.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                            {t.growth}
                                        </div>
                                    </div>
                                    <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
                                        <div className={`h-full ${t.status === 'explosive' ? 'bg-primary shadow-[0_0_10px_rgba(var(--primary-color),0.5)]' : 'bg-primary/50'}`} style={{ width: t.growth.replace('+', '').replace('%', '') + '%' }} />
                                    </div>
                                </Card>
                            ))}
                        </div>

                        <div className="bg-card border-border border-b-8 rounded-[40px] p-8 text-center space-y-4">
                            <LayoutGrid className="w-12 h-12 text-muted-foreground mx-auto opacity-20" />
                            <h4 className="font-black uppercase italic text-muted-foreground">More Insights soon</h4>
                            <p className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest">Connect your LinkedIn for Neural Analysis</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
