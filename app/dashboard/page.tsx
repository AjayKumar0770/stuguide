"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
    Zap, Brain, Map, FileText, Award, Trophy, Settings,
    LayoutDashboard, Flame, Target, Target as TargetIcon,
    History, Sparkles, LogOut, ChevronRight, Loader2,
    Activity, Shield, Zap as PulseIcon, Brain as SyncIcon, Bell,
    MessageSquare, TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabase/client"
import { Waves } from "@/components/Waves";
import { ThemeQuickSwitcher } from "@/components/ThemeQuickSwitcher";

export default function DashboardPage() {
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [skillCount, setSkillCount] = useState(0)
    const router = useRouter()

    useEffect(() => {
        const fetchUserData = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                setProfile({
                    full_name: "Guest Player",
                    level: 1,
                    xp: 0,
                    streak: 0,
                    avatar_url: ""
                })
                setLoading(false)
                return
            }

            const { data: profileData } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single()

            if (profileData) {
                setProfile(profileData)
            } else {
                const { data: newProfile } = await supabase.from("profiles").insert([
                    { id: user.id, full_name: "Player One", email: user.email }
                ]).select().single()
                setProfile(newProfile)
            }

            const { count } = await supabase
                .from("skill_progress")
                .select("*", { count: 'exact', head: true })
                .eq("user_id", user.id)
                .eq("is_completed", true)

            setSkillCount(count || 0)
            setLoading(false)
        }

        fetchUserData()
    }, [router])

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background flex font-sans text-foreground selection:bg-primary/30 relative overflow-hidden transition-colors duration-700">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none -z-0">
                <div className="absolute top-0 right-[-10%] w-[800px] h-[800px] bg-primary/5 rounded-full blur-[180px] opacity-40" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] opacity-30" />
                <Waves
                    backgroundColor="transparent"
                    strokeColor="var(--primary-color)"
                    pointerSize={0.2}
                />
            </div>

            {/* 1. SIDE NAVIGATION */}
            <aside className="w-24 lg:w-72 bg-card/40 backdrop-blur-3xl border-r border-border flex flex-col sticky top-0 h-screen hidden md:flex z-50 transition-all duration-500">
                <div className="p-10 flex justify-center lg:justify-start">
                    <Link href="/" className="flex items-center gap-4 group">
                        <div className="w-12 h-12 rounded-[18px] bg-primary flex items-center justify-center shadow-[0_8px_0_var(--primary-foreground)] group-hover:-translate-y-1 group-active:translate-y-0 transition-all">
                            <Zap className="w-6 h-6 text-primary-foreground fill-primary-foreground/20" />
                        </div>
                        <span className="font-black text-2xl tracking-tighter text-foreground hidden lg:block uppercase italic font-[family-name:var(--font-orbitron)]">STUGUIDE</span>
                    </Link>
                </div>

                <nav className="flex-1 px-6 space-y-4 mt-12">
                    <SideNavItem icon={<LayoutDashboard className="w-6 h-6" />} label="Command Center" active href="/dashboard" />
                    <SideNavItem icon={<Brain className="w-6 h-6" />} label="Discovery" href="/discovery" />
                    <SideNavItem icon={<Map className="w-6 h-6" />} label="Strategy Map" href="/roadmap" />
                    <SideNavItem icon={<FileText className="w-6 h-6" />} label="Audit Lab" href="/audit" />
                    <SideNavItem icon={<MessageSquare className="w-6 h-6" />} label="Neural Mock" href="/mock-interview" />
                    <SideNavItem icon={<Bell className="w-6 h-6" />} label="Alerts Feed" href="/market-alerts" />
                    <SideNavItem icon={<Trophy className="w-6 h-6" />} label="Rankings" href="/leaderboard" />
                </nav>

                <div className="mt-auto p-6 space-y-6">
                    <ThemeQuickSwitcher />
                    <div className="pt-6 border-t border-border/50">
                        <SideNavItem icon={<Settings className="w-6 h-6" />} label="Parameters" href="/settings" />
                        <button
                            onClick={() => supabase.auth.signOut().then(() => router.push("/"))}
                            className="flex items-center gap-4 w-full px-5 py-5 mt-4 rounded-2xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all group font-black uppercase text-[10px] tracking-widest italic"
                        >
                            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                            <span className="hidden lg:block">Terminate session</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* 2. BENTO COCKPIT */}
            <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-14 relative z-10">
                <div className="max-w-[1400px] mx-auto space-y-12">

                    {/* TOP HEADER */}
                    <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8 mb-16">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500 italic">Neural interface established</span>
                            </div>
                            <h1 className="text-6xl lg:text-7xl font-black uppercase italic tracking-tighter text-foreground font-[family-name:var(--font-orbitron)] leading-none">Command Center</h1>
                            <p className="text-muted-foreground font-bold mt-4 uppercase text-[11px] tracking-[0.4em] opacity-60">Operations Protocol: <span className="text-primary">{profile?.full_name?.split(' ')[0]} Readiness</span></p>
                        </motion.div>

                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-6 p-4 rounded-[32px] bg-card/60 border-2 border-border backdrop-blur-xl shadow-2xl relative group h-fit">
                            <div className="absolute inset-0 bg-primary/5 rounded-[30px] opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="flex flex-col items-end px-4 border-r-2 border-border/50 relative z-10">
                                <div className="flex items-center gap-2 mb-1">
                                    <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                                    <span className="font-black text-2xl italic font-[family-name:var(--font-orbitron)]">{profile?.streak || 0}</span>
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Neural streak</span>
                            </div>
                            <div className="flex items-center gap-5 relative z-10">
                                <Avatar className="w-16 h-16 border-4 border-card rounded-2xl shadow-xl hover:rotate-3 transition-transform">
                                    <AvatarImage src={profile?.avatar_url} />
                                    <AvatarFallback className="bg-primary text-primary-foreground font-black text-xl italic font-[family-name:var(--font-orbitron)]">P1</AvatarFallback>
                                </Avatar>
                                <div className="hidden lg:block">
                                    <p className="font-black text-sm uppercase italic tracking-tight font-[family-name:var(--font-orbitron)]">{profile?.full_name}</p>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-primary mt-1">Level {profile?.level || 1} Pioneer</p>
                                </div>
                            </div>
                        </motion.div>
                    </header>

                    {/* BENTO GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 auto-rows-[minmax(200px,auto)]">

                        {/* Player Summary Card - Elite Version */}
                        <Card className="md:col-span-8 bg-card/80 border-border border-b-[16px] border-black/40 rounded-[60px] overflow-hidden relative group shadow-2xl backdrop-blur-2xl">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] -mr-48 -mt-48 transition-all group-hover:bg-primary/10" />
                            <CardContent className="p-12 h-full flex flex-col justify-between relative z-10">
                                <div className="flex flex-col lg:flex-row items-start justify-between gap-10">
                                    <div className="flex items-center gap-10">
                                        <div className="w-32 h-32 rounded-[40px] bg-gradient-to-br from-primary to-accent p-1.5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-1000">
                                            <div className="w-full h-full bg-card rounded-[35px] flex items-center justify-center overflow-hidden">
                                                <Avatar className="w-full h-full rounded-none">
                                                    <AvatarImage src={profile?.avatar_url} className="object-cover" />
                                                    <AvatarFallback className="text-5xl font-black bg-card text-foreground font-[family-name:var(--font-orbitron)] italic">{profile?.full_name?.substring(0, 1)}</AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <div className="absolute -bottom-4 right-[-20%] bg-foreground text-background text-[11px] font-black px-6 py-2.5 rounded-full border-4 border-card uppercase italic shadow-2xl tracking-widest translate-x-[-10px]">Tier: Silver</div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-4 mb-4">
                                                <Badge className="bg-primary/10 text-primary border-2 border-primary/20 font-black px-6 py-2 text-[10px] uppercase tracking-[0.3em] rounded-full">Software Mage</Badge>
                                                <div className="w-2 h-2 rounded-full bg-border" />
                                                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground">Calibration Complete</span>
                                            </div>
                                            <h2 className="text-7xl font-black uppercase italic tracking-tighter text-foreground leading-[0.8] font-[family-name:var(--font-orbitron)] drop-shadow-sm">{profile?.full_name?.split(' ')[0] || "Player"}</h2>
                                            <p className="text-xl font-bold italic text-muted-foreground mt-4 opacity-70">"Mastering the digital weave, one byte at a time."</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <div className="w-24 h-24 rounded-[32px] bg-card border-2 border-border shadow-inner flex flex-col items-center justify-center mb-4">
                                            <span className="text-4xl font-black text-primary font-[family-name:var(--font-orbitron)] italic leading-none">{profile?.level || 1}</span>
                                            <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mt-1">LVL</span>
                                        </div>
                                        <p className="text-4xl font-black text-foreground italic font-[family-name:var(--font-orbitron)] tracking-tighter">{(profile?.xp || 0).toLocaleString()} <span className="text-xs font-black text-primary uppercase tracking-widest ml-1">Sync</span></p>
                                    </div>
                                </div>
                                <div className="mt-16 space-y-6">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <span className="text-[11px] font-black uppercase tracking-[0.5em] text-muted-foreground block mb-2 opacity-50">Neural Progression</span>
                                            <span className="text-lg font-black uppercase italic tracking-tighter text-foreground font-[family-name:var(--font-orbitron)]">Level {(profile?.level || 1) + 1} Threshold</span>
                                        </div>
                                        <span className="text-3xl font-black italic font-[family-name:var(--font-orbitron)] text-primary tabular-nums">{(profile?.xp || 0) % 1000}/1000 <span className="text-[10px] uppercase tracking-[0.2em] not-italic ml-2 opacity-50">XP</span></span>
                                    </div>
                                    <div className="relative h-5 w-full bg-background/50 rounded-full border-2 border-border p-1 shadow-inner overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${((profile?.xp || 0) % 1000) / 10}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="h-full bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-shimmer rounded-full shadow-[0_0_20px_var(--primary-color)] relative"
                                        >
                                            <div className="absolute inset-0 bg-white/20 animate-pulse" />
                                        </motion.div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Active Mission - High Fidelity */}
                        <div className="md:col-span-4 h-full">
                            <Link href="/roadmap" className="block h-full">
                                <Card className="bg-gradient-to-br from-primary to-accent border-none rounded-[60px] h-full transition-all group shadow-2xl shadow-primary/20 relative overflow-hidden flex flex-col">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -mr-24 -mt-24 group-hover:bg-white/20 transition-all" />
                                    <CardContent className="p-12 flex flex-col h-full justify-between items-center text-center relative z-10">
                                        <div className="w-28 h-28 rounded-[40px] bg-white/20 backdrop-blur-xl flex items-center justify-center mb-8 shadow-2xl border border-white/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                            <Target className="w-14 h-14 text-white drop-shadow-lg" />
                                        </div>
                                        <div>
                                            <Badge className="mb-6 bg-white/20 text-white border-2 border-white/30 px-6 py-2 uppercase font-black tracking-[0.4em] text-[10px] rounded-full backdrop-blur-md">Tactical Objective</Badge>
                                            <h4 className="font-black text-white uppercase italic tracking-tighter text-4xl font-[family-name:var(--font-orbitron)] leading-tight">Mastering API Systems</h4>
                                            <p className="text-[11px] font-bold text-white/70 uppercase tracking-[0.4em] mt-6 leading-loose px-4">Neural verification optimal for stage 4 deployment</p>
                                        </div>
                                        <Button className="w-full mt-10 bg-white text-primary font-black uppercase text-xs tracking-[0.4em] rounded-[30px] h-20 border-b-[12px] border-black/10 hover:translate-y-1 hover:border-b-[8px] active:translate-y-2 active:border-b-[4px] transition-all shadow-2xl italic font-[family-name:var(--font-orbitron)]">Engage Module</Button>
                                    </CardContent>
                                </Card>
                            </Link>
                        </div>

                        {/* Bento Row 2 */}
                        <div className="md:col-span-4 grid grid-cols-2 gap-10">
                            <Link href="/discovery" className="h-full">
                                <Card className="bg-card/60 backdrop-blur-xl border-border border-b-[12px] border-black/40 rounded-[50px] h-full hover:bg-primary/5 transition-all group p-10 flex flex-col items-center justify-center text-center shadow-2xl border-2">
                                    <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-8 border-2 border-primary/20 group-hover:scale-110 transition-transform shadow-lg">
                                        <Brain className="w-10 h-10 text-primary" />
                                    </div>
                                    <span className="font-black uppercase italic text-sm tracking-[0.3em] text-foreground group-hover:text-primary transition-colors font-[family-name:var(--font-orbitron)]">Origin Scan</span>
                                </Card>
                            </Link>
                            <Link href="/audit" className="h-full">
                                <Card className="bg-card/60 backdrop-blur-xl border-border border-b-[12px] border-black/40 rounded-[50px] h-full hover:bg-accent/5 transition-all group p-10 flex flex-col items-center justify-center text-center shadow-2xl border-2">
                                    <div className="w-20 h-20 rounded-3xl bg-accent/10 flex items-center justify-center mb-8 border-2 border-accent/20 group-hover:scale-110 transition-transform shadow-lg">
                                        <FileText className="w-10 h-10 text-accent-foreground" />
                                    </div>
                                    <span className="font-black uppercase italic text-sm tracking-[0.3em] text-foreground group-hover:text-accent-foreground transition-colors font-[family-name:var(--font-orbitron)]">Audit Lab</span>
                                </Card>
                            </Link>
                        </div>

                        {/* Market Intel Widget */}
                        <Card className="md:col-span-4 bg-card/60 backdrop-blur-xl border-border border-b-[12px] border-black/40 rounded-[50px] p-12 flex flex-col justify-between shadow-2xl border-2 group">
                            <div className="flex justify-between items-start mb-8">
                                <div>
                                    <h5 className="font-black uppercase text-[11px] tracking-[0.5em] text-primary mb-2 italic">Neural Pulse</h5>
                                    <p className="text-2xl font-black uppercase italic tracking-tighter text-foreground font-[family-name:var(--font-orbitron)]">Global Vectors</p>
                                </div>
                                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border-2 border-emerald-500/20 group-hover:animate-pulse">
                                    <PulseIcon className="w-6 h-6 text-emerald-500" />
                                </div>
                            </div>
                            <div className="space-y-6">
                                <MarketTrend label="AI ARCHITECT" trend="+14.2%" up />
                                <MarketTrend label="CLOUD SENTINEL" trend="-2.4%" />
                                <MarketTrend label="NEURAL ENGINEER" trend="+8.9%" up />
                            </div>
                            <Link href="/market-alerts">
                                <Button variant="ghost" className="w-full mt-10 border-2 border-border/50 rounded-2xl h-14 font-black uppercase text-[10px] tracking-widest text-muted-foreground hover:text-foreground italic">Full Analysis</Button>
                            </Link>
                        </Card>

                        {/* Neural Feed / Alerts */}
                        <Card id="alerts" className="md:col-span-4 bg-card/60 backdrop-blur-xl border-border border-b-[12px] border-black/40 rounded-[50px] p-12 shadow-2xl border-2 scroll-mt-32">
                            <div className="flex justify-between items-center mb-10">
                                <h3 className="text-2xl font-black uppercase italic tracking-tighter text-foreground font-[family-name:var(--font-orbitron)] flex items-center gap-4">
                                    <Bell className="w-7 h-7 text-orange-500" /> Alerts
                                </h3>
                                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center border-2 border-orange-500/30">
                                    <span className="text-[10px] font-black text-orange-500">3</span>
                                </div>
                            </div>
                            <div className="space-y-8">
                                <FeedItemSmall icon={<Zap className="w-4 h-4 text-primary" />} text="Daily Training Unlocked" time="2m ago" />
                                <FeedItemSmall icon={<Trophy className="w-4 h-4 text-accent-foreground" />} text="Rank Promoted: Silver II" time="1h ago" />
                                <FeedItemSmall icon={<Activity className="w-4 h-4 text-emerald-500" />} text="Strategy Calibration Stable" time="4h ago" />
                            </div>
                            <Button className="w-full mt-10 bg-foreground text-background font-black uppercase text-[10px] tracking-widest rounded-3xl h-16 border-b-6 border-foreground/40 hover:translate-y-1 active:border-b-0 transition-all font-[family-name:var(--font-orbitron)] italic">Clear Signals</Button>
                        </Card>

                        {/* Skill Network - Extra Large Visualization Placeholder */}
                        <Card className="md:col-span-12 bg-card/60 backdrop-blur-2xl border-border border-b-[20px] border-black/40 rounded-[70px] overflow-hidden min-h-[500px] shadow-2xl border-2 group relative">
                            <div className="absolute inset-0 bg-primary/5 opacity-40 group-hover:opacity-60 transition-opacity" />
                            <CardHeader className="p-14 pb-0 relative z-10">
                                <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                                    <div>
                                        <Badge className="bg-primary/10 text-primary border-2 border-primary/20 font-black px-6 py-2 text-[10px] uppercase tracking-[0.5em] rounded-full mb-6 italic">Neural Visualization</Badge>
                                        <CardTitle className="text-5xl lg:text-7xl font-black uppercase italic tracking-tighter text-foreground font-[family-name:var(--font-orbitron)] leading-none">Skill Mastery Network</CardTitle>
                                        <p className="text-lg font-bold uppercase tracking-[0.4em] text-muted-foreground mt-6 opacity-60">Architectural growth patterns across technological sectors</p>
                                    </div>
                                    <div className="flex gap-6">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-24 h-24 rounded-[32px] bg-primary/10 border-2 border-primary/20 flex flex-col items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                <span className="text-3xl font-black text-primary font-[family-name:var(--font-orbitron)] italic">8</span>
                                                <span className="text-[8px] font-black uppercase text-primary tracking-widest">Active</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-24 h-24 rounded-[32px] bg-accent/10 border-2 border-accent/20 flex flex-col items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                <span className="text-3xl font-black text-accent-foreground font-[family-name:var(--font-orbitron)] italic">14</span>
                                                <span className="text-[8px] font-black uppercase text-accent-foreground tracking-widest">Latent</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="h-full flex flex-col items-center justify-center p-20 relative z-10">
                                <div className="relative w-80 h-80 flex items-center justify-center">
                                    <div className="absolute inset-0 border-[10px] border-dashed border-primary/20 rounded-full animate-spin-slow" />
                                    <div className="absolute inset-8 border-[6px] border-dashed border-accent/30 rounded-full animate-reverse-spin-slow" />
                                    <div className="w-40 h-40 rounded-[50px] border-4 border-border bg-card/60 backdrop-blur-2xl flex flex-col items-center justify-center shadow-2xl">
                                        <SyncIcon className="w-16 h-16 text-primary animate-pulse" />
                                    </div>
                                </div>
                                <p className="font-black uppercase tracking-[0.6em] text-xs text-muted-foreground mt-12 animate-pulse text-center leading-loose">Synchronizing neural network nodes...<br />Deep scan in progress</p>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </main>
        </div>
    );
}

function SideNavItem({ icon, label, active = false, href = "#" }: { icon: any, label: string, active?: boolean, href?: string }) {
    return (
        <Link
            href={href}
            className={`flex items-center gap-6 px-7 py-5 rounded-[22px] transition-all relative group ${active ? 'bg-primary text-primary-foreground shadow-2xl shadow-primary/30' : 'text-muted-foreground hover:bg-card hover:text-foreground border border-transparent hover:border-border/50'}`}
        >
            <div className={`transition-transform duration-500 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
                {icon}
            </div>
            <span className={`text-[11px] font-black uppercase tracking-[0.3em] hidden lg:block transition-all duration-300 font-[family-name:var(--font-orbitron)] italic ${active ? 'translate-x-1' : 'group-hover:translate-x-1'}`}>{label}</span>
            {active && (
                <motion.div
                    layoutId="active-indicator"
                    className="absolute -left-2 w-1.5 h-10 bg-white rounded-r-full shadow-[0_0_15px_white]"
                />
            )}
        </Link>
    )
}

function MarketTrend({ label, trend, up = false }: { label: string, trend: string, up?: boolean }) {
    return (
        <div className="flex items-center justify-between p-5 rounded-2xl bg-background/50 border border-border/50 hover:bg-background transition-colors cursor-default">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground italic">{label}</span>
            <span className={`text-xs font-black italic font-[family-name:var(--font-orbitron)] ${up ? 'text-emerald-500' : 'text-destructive'}`}>
                {up ? '▲' : '▼'} {trend}
            </span>
        </div>
    )
}

function FeedItemSmall({ icon, text, time }: { icon: any, text: string, time: string }) {
    return (
        <div className="flex items-center gap-5 group py-2">
            <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center flex-shrink-0 group-hover:border-primary/50 transition-colors shadow-inner">
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-[11px] font-black uppercase italic tracking-tight text-foreground truncate group-hover:text-primary transition-colors">{text}</p>
                <p className="text-[8px] font-black uppercase text-muted-foreground opacity-40 mt-1">{time}</p>
            </div>
        </div>
    )
}
