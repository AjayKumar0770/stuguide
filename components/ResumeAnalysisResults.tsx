"use client"

import { ResponsiveContainer, RadialBarChart, RadialBar } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, XCircle, AlertCircle, Target, Zap, ShieldCheck } from "lucide-react"

interface ResumeAnalysisProps {
    data: {
        ats_score: number
        keyword_gaps: string[]
        missing_hard_skills: string[]
        missing_soft_skills: string[]
        formatting_issues: string[]
        section_feedback: { section: string, status: 'good' | 'improve', feedback: string }[]
        summary: string
    }
}

export default function ResumeAnalysisResults({ data }: ResumeAnalysisProps) {
    const chartData = [
        {
            name: 'ATS Score',
            uv: data.ats_score,
            fill: data.ats_score > 70 ? 'var(--primary)' : data.ats_score > 40 ? 'var(--primary)' : 'var(--destructive)'
        }
    ]

    const getScoreColor = (score: number) => {
        if (score >= 80) return "text-emerald-400"
        if (score >= 60) return "text-primary"
        return "text-destructive"
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">

            {/* Top Section: Score & Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="bg-card/50 border-border border-b-8 rounded-[40px] p-10 flex flex-col items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CardHeader className="p-0 mb-8 w-full text-center relative z-10">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <ShieldCheck className="w-4 h-4 text-primary" />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Neural Match</span>
                        </div>
                        <CardTitle className="text-foreground text-2xl font-black uppercase italic tracking-tighter font-[family-name:var(--font-orbitron)]">ATS Compatibility</CardTitle>
                    </CardHeader>
                    <div className="relative w-48 h-48 flex items-center justify-center scale-110">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadialBarChart
                                innerRadius="85%"
                                outerRadius="110%"
                                data={chartData}
                                startAngle={90}
                                endAngle={-270}
                            >
                                <RadialBar background dataKey="uv" cornerRadius={20} />
                            </RadialBarChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={`text-6xl font-black italic tabular-nums leading-none ${getScoreColor(data.ats_score)}`}>{data.ats_score}</span>
                            <span className="text-muted-foreground font-bold uppercase text-[9px] tracking-[0.4em] mt-1">Synchronized</span>
                        </div>
                    </div>
                </Card>

                <Card className="lg:col-span-2 bg-card/50 border-border border-b-8 rounded-[40px] overflow-hidden flex flex-col p-1">
                    <CardHeader className="p-8 pb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 border-2 border-primary/20 rounded-xl flex items-center justify-center">
                                <Zap className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-foreground font-black uppercase italic tracking-tight">Executive Neural Summary</CardTitle>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Automated Intelligence Assessment</p>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-0 flex-1">
                        <div className="bg-background/50 border-2 border-border/50 rounded-[30px] p-8 h-full relative group">
                            <div className="absolute top-4 right-6 text-[8px] font-black text-muted-foreground/30 select-none tracking-[0.5em]">SYSTEM_OUTPUT</div>
                            <p className="text-foreground font-bold leading-relaxed italic text-lg opacity-90">
                                "{data.summary}"
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Keywords Gap Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="bg-card/50 border-border border-b-8 rounded-[40px] p-2">
                    <CardHeader className="p-8 pb-4">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-destructive/10 border-2 border-destructive/20 rounded-xl flex items-center justify-center">
                                    <AlertCircle className="w-5 h-5 text-destructive" />
                                </div>
                                <CardTitle className="text-foreground font-black uppercase italic tracking-tight">Keyword Gaps</CardTitle>
                            </div>
                            <Badge className="bg-destructive/10 text-destructive border-none font-black text-[9px] uppercase">Delta Mismatch</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                        <div className="flex flex-wrap gap-2">
                            {data.keyword_gaps?.map((keyword, i) => (
                                <Badge key={i} className="bg-background border-2 border-border text-foreground font-black uppercase text-[10px] tracking-widest px-4 py-2 rounded-xl hover:border-destructive/50 transition-all">
                                    {keyword}
                                </Badge>
                            ))}
                            {(!data.keyword_gaps || data.keyword_gaps.length === 0) && (
                                <div className="flex items-center gap-3 p-6 bg-emerald-500/5 border-2 border-emerald-500/10 rounded-2xl w-full">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    <p className="text-emerald-500 font-bold uppercase text-xs tracking-widest">No critical keyword deficiencies detected</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-card/50 border-border border-b-8 rounded-[40px] p-2">
                    <CardHeader className="p-8 pb-4">
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary/10 border-2 border-primary/20 rounded-xl flex items-center justify-center">
                                    <Target className="w-5 h-5 text-primary" />
                                </div>
                                <CardTitle className="text-foreground font-black uppercase italic tracking-tight">Format Integrity</CardTitle>
                            </div>
                            <Badge className="bg-primary/10 text-primary border-none font-black text-[9px] uppercase">Structure Audit</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 pt-0">
                        <ul className="space-y-4">
                            {data.formatting_issues?.length > 0 ? (
                                data.formatting_issues.map((issue, i) => (
                                    <li key={i} className="flex items-start gap-3 p-4 bg-background border-2 border-border rounded-2xl">
                                        <XCircle className="w-5 h-5 text-destructive mt-0.5 shrink-0" />
                                        <span className="text-sm font-bold text-foreground/80 leading-relaxed capitalize">{issue}</span>
                                    </li>
                                ))
                            ) : (
                                <li className="flex items-center gap-4 p-6 bg-emerald-500/5 border-2 border-emerald-500/10 rounded-3xl">
                                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                                    <span className="text-sm font-black uppercase tracking-widest text-emerald-500">Semantic structure verified as optimal</span>
                                </li>
                            )}
                        </ul>
                    </CardContent>
                </Card>
            </div>

            {/* Section by Section Breakdown */}
            <Card className="bg-card/50 border-border border-b-8 rounded-[40px] overflow-hidden">
                <CardHeader className="p-10 pb-6 border-b-2 border-border/50 bg-background/30">
                    <CardTitle className="text-foreground font-black uppercase italic tracking-tighter text-3xl font-[family-name:var(--font-orbitron)]">Neural Section Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {data.section_feedback?.map((section, idx) => (
                            <div key={idx} className="p-6 rounded-[30px] bg-background border-2 border-border hover:border-primary/30 transition-all group overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                                <div className="flex items-center justify-between mb-4 relative z-10">
                                    <h4 className="font-black text-foreground text-lg uppercase italic tracking-tight">{section.section}</h4>
                                    <Badge className={`border-none font-black text-[9px] uppercase tracking-widest px-3 py-1 rounded-full ${section.status === 'good' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary'}`}>
                                        {section.status === 'good' ? 'Verified' : 'Optimize'}
                                    </Badge>
                                </div>
                                <p className="text-sm font-bold text-muted-foreground leading-relaxed relative z-10">{section.feedback}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

        </div>
    )
}
