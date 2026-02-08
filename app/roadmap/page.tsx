"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Map, ArrowRight, Search, Sparkles, Target, Zap, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { GenerateButton } from "@/components/GenerateButton"
import { BackButton } from "@/components/ui/back-button"

export default function RoadmapLandingPage() {
    const [domain, setDomain] = useState("")
    const router = useRouter()

    const handleGenerate = (e: React.FormEvent) => {
        e.preventDefault()
        if (domain.trim()) {
            router.push(`/roadmap/${encodeURIComponent(domain.trim())}`)
        }
    }

    const suggestedDomains = [
        "Full Stack Mage",
        "Data Alchemist",
        "Cyber Guardian",
        "UI Architect",
        "System Paladin"
    ]

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-primary/30 font-sans transition-colors duration-700">
            <div className="absolute top-8 left-8 z-20">
                <BackButton href="/dashboard" />
            </div>
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-accent/10 rounded-full blur-[150px]" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl text-center z-10"
            >
                <div className="mb-12">
                    <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 border-2 border-primary/20 mb-8 group cursor-default">
                        <Target className="w-4 h-4 text-primary group-hover:rotate-45 transition-transform" />
                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Mission Planning Interface</span>
                    </div>
                    <h1 className="text-7xl font-black uppercase italic tracking-tighter text-foreground font-[family-name:var(--font-orbitron)] leading-none mb-6">Select Target</h1>
                    <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-[0.5em] max-w-lg mx-auto leading-relaxed">Designate your professional domain to generate a tactical strategy tree.</p>
                </div>

                <div className="relative group mb-16">
                    <form onSubmit={handleGenerate} className="relative">
                        <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                            value={domain}
                            onChange={(e) => setDomain(e.target.value)}
                            placeholder="DESIGNATE DOMAIN (E.G. AI ENGINEER, WEB3...)"
                            className="w-full bg-card/50 border-2 border-border rounded-[40px] pl-20 pr-36 h-24 text-sm font-black uppercase tracking-widest text-foreground placeholder:text-muted-foreground/30 focus-visible:ring-0 focus-visible:border-primary transition-all backdrop-blur-xl border-b-[10px] border-black/40 shadow-2xl"
                        />
                        <div className="absolute right-6 top-[40%] -translate-y-1/2 flex gap-2">
                            <GenerateButton
                                onClick={() => {
                                    if (domain.trim()) {
                                        router.push(`/roadmap/${encodeURIComponent(domain.trim())}`)
                                    }
                                }}
                                disabled={!domain.trim()}
                                label="DEPLOY"
                                loadingLabel="DEPLOYING"
                            />
                        </div>
                    </form>
                </div>

                <div className="space-y-8">
                    <span className="text-[10px] font-black uppercase tracking-[0.6em] text-muted-foreground opacity-50">Recommended Protocols</span>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        {suggestedDomains.map((d) => (
                            <button
                                key={d}
                                onClick={() => router.push(`/roadmap/${encodeURIComponent(d)}`)}
                                className="bg-card hover:bg-primary/10 border-2 border-border hover:border-primary/40 rounded-2xl px-6 py-4 transition-all group scale-100 hover:scale-105 active:scale-95 border-b-[6px] border-black/40 shadow-lg"
                            >
                                <span className="text-[12px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary italic font-[family-name:var(--font-orbitron)]">[{d}]</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mt-24">
                    <p className="text-[9px] font-black uppercase tracking-[1em] text-muted-foreground/20 animate-pulse">Connection Established // Ready for Deployment</p>
                </div>
            </motion.div>
        </div>
    )
}
