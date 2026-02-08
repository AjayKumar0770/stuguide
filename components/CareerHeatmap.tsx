"use client"

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"

interface CareerMatch {
    domain: string
    match_percentage: number
    reasoning: string
    key_skills: string[]
}

interface CareerHeatmapProps {
    data: CareerMatch[]
}

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-card border-2 border-primary/30 p-4 rounded-2xl shadow-2xl backdrop-blur-xl">
                <p className="font-black text-primary mb-1 uppercase text-[10px] tracking-widest">{label}</p>
                <p className="text-foreground font-bold">Match: <span className="text-emerald-500">{payload[0].value}%</span></p>
            </div>
        );
    }
    return null;
};

export default function CareerHeatmap({ data }: CareerHeatmapProps) {
    // Safeguard: Ensure data is an array
    const safeData = Array.isArray(data) ? data : [];

    // Transform data for Radar Chart
    const chartData = safeData.map(item => ({
        subject: item.domain,
        A: item.match_percentage,
        fullMark: 100
    }))

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
            {/* Radar Chart Visualization */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card className="bg-background/40 border-2 border-border border-b-8 border-black/20 backdrop-blur-md h-full items-center justify-center flex flex-col rounded-[40px] shadow-xl overflow-hidden">
                    <CardHeader className="pb-0">
                        <CardTitle className="text-foreground text-center font-black uppercase italic tracking-tighter text-xl font-[family-name:var(--font-orbitron)]">Career Fit Analysis</CardTitle>
                        <CardDescription className="text-center text-muted-foreground uppercase text-[10px] font-bold tracking-[0.2em] mt-2">Visualizing alignment with tech domains</CardDescription>
                    </CardHeader>
                    <CardContent className="h-[350px] w-full p-6">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                <PolarGrid stroke="var(--border)" strokeWidth={2} />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 900 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Match %"
                                    dataKey="A"
                                    stroke="var(--primary-color)"
                                    strokeWidth={4}
                                    fill="var(--primary-color)"
                                    fillOpacity={0.2}
                                />
                                <Tooltip content={<CustomTooltip />} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Detailed Match Cards */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-6 max-h-[500px] overflow-y-auto pr-4 custom-scrollbar"
            >
                {[...safeData].sort((a, b) => b.match_percentage - a.match_percentage).map((match, index) => (
                    <motion.div
                        key={match.domain}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index }}
                    >
                        <Card className="bg-card/50 border-2 border-border border-b-6 border-black/20 backdrop-blur-md hover:border-primary/50 transition-all rounded-[32px] shadow-lg group overflow-hidden">
                            <CardContent className="p-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-black text-foreground text-xl uppercase italic tracking-tighter font-[family-name:var(--font-orbitron)]">{match.domain}</h3>
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${match.match_percentage >= 80 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                                        match.match_percentage >= 60 ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                                            'bg-muted/10 text-muted-foreground border-border'
                                        }`}>
                                        {match.match_percentage}% Match
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground mb-6 leading-relaxed font-bold italic">"{match.reasoning}"</p>
                                <div className="flex flex-wrap gap-2 mb-8">
                                    {match.key_skills.map(skill => (
                                        <span key={skill} className="text-[9px] bg-primary/10 text-primary px-3 py-1.5 rounded-xl border-2 border-primary/20 font-black uppercase tracking-widest">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                                <Link href={`/roadmap/${encodeURIComponent(match.domain)}`}>
                                    <Button size="sm" className="w-full bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-[10px] h-12 rounded-2xl border-b-4 border-primary/70 active:translate-y-1 active:border-b-0 transition-all shadow-md font-[family-name:var(--font-orbitron)]">
                                        Initialize Roadmap 🚀
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    )
}
