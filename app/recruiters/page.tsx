"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, MapPin, Building2, Linkedin, Mail, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BackButton } from "@/components/ui/back-button"

// Mock Data (will be replaced by Supabase data later)
const RECRUITERS = [
    {
        id: 1,
        name: "Sarah Jenkins",
        role: "Senior Tech Recruiter",
        company: "Google",
        specialization: ["Software Engineering", "AI/ML"],
        location: "Bangalore, India",
        linkedin: "#",
        email: "sarah.j@google.com",
        tags: ["FAANG", "Senior Roles"]
    },
    {
        id: 2,
        name: "Amit Patel",
        role: "Talent Acquisition Lead",
        company: "Microsoft",
        specialization: ["Cloud", "DevOps"],
        location: "Hyderabad, India",
        linkedin: "#",
        email: "amit.p@microsoft.com",
        tags: ["Azure", "Cloud"]
    },
    {
        id: 3,
        name: "Priya Sharma",
        role: "HR Manager",
        company: "Zoho",
        specialization: ["Frontend", "Full Stack"],
        location: "Chennai, India",
        linkedin: "#",
        email: "priya.s@zoho.com",
        tags: ["Product", "Startups"]
    },
    {
        id: 4,
        name: "David Chen",
        role: "Technical Recruiter",
        company: "Amazon",
        specialization: ["Backend", "Systems"],
        location: "Remote",
        linkedin: "#",
        email: "david.chen@amazon.com",
        tags: ["Scale", "Distributed Systems"]
    },
    {
        id: 5,
        name: "Neha Gupta",
        role: "Recruitment Consultant",
        company: "Michael Page",
        specialization: ["Data Science", "Analytics"],
        location: "Mumbai, India",
        linkedin: "#",
        email: "neha.g@michaelpage.com",
        tags: ["Consulting", "Leadership"]
    }
]

export default function RecruitersPage() {
    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState("All")

    const filteredRecruiters = RECRUITERS.filter(recruiter => {
        const matchesSearch = recruiter.name.toLowerCase().includes(search.toLowerCase()) ||
            recruiter.company.toLowerCase().includes(search.toLowerCase()) ||
            recruiter.specialization.some(s => s.toLowerCase().includes(search.toLowerCase()))

        if (filter === "All") return matchesSearch
        return matchesSearch && recruiter.tags.includes(filter)
    })

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-12 font-sans relative overflow-hidden transition-colors duration-500">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b-2 border-border pb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Building2 className="w-5 h-5 text-primary fill-primary" />
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">HR Network</span>
                        </div>
                        <h1 className="text-5xl font-black uppercase italic tracking-tighter text-foreground font-[family-name:var(--font-orbitron)] leading-none">Recruiter Base</h1>
                        <p className="text-muted-foreground font-bold mt-2 uppercase text-xs tracking-widest leading-relaxed">Direct links to tactical acquisition leads</p>
                    </div>
                    <div className="flex gap-4">
                        <BackButton href="/dashboard" />
                    </div>
                </div>

                {/* Search & Filters */}
                <Card className="bg-card border-border border-b-8 rounded-[40px] p-8 shadow-2xl backdrop-blur-xl">
                    <div className="flex flex-col md:flex-row gap-6">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                placeholder="Scan by name, company, or tech stack..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="h-16 pl-14 bg-background border-2 border-border rounded-2xl text-foreground font-bold focus-visible:ring-0 focus-visible:border-primary/50"
                            />
                        </div>
                        <div className="flex gap-2 p-1 bg-background border-2 border-border rounded-2xl overflow-x-auto">
                            {["All", "FAANG", "Startups", "Cloud", "Leadership"].map((t) => (
                                <Button
                                    key={t}
                                    variant={filter === t ? "default" : "ghost"}
                                    onClick={() => setFilter(t)}
                                    className={`h-12 px-6 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all ${filter === t ? 'bg-primary text-primary-foreground shadow-lg' : 'text-muted-foreground hover:bg-accent'}`}
                                >
                                    {t}
                                </Button>
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredRecruiters.map((recruiter, idx) => (
                        <motion.div
                            key={recruiter.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <Card className="bg-card border-border border-b-[10px] border-black/40 rounded-[35px] hover:translate-y-[-4px] transition-all duration-300 group overflow-hidden h-full">
                                <CardContent className="p-8 space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div className="w-16 h-16 bg-primary/10 border-2 border-primary/20 rounded-2xl flex items-center justify-center text-primary font-black text-2xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            {recruiter.name.charAt(0)}
                                        </div>
                                        <div className="flex gap-2">
                                            {recruiter.tags.map(tag => (
                                                <Badge key={tag} className="bg-secondary text-secondary-foreground border-none font-black text-[9px] uppercase px-2">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-2xl font-black uppercase italic tracking-tighter text-foreground group-hover:text-primary transition-colors">{recruiter.name}</h3>
                                        <p className="text-xs font-bold text-muted-foreground flex items-center gap-2 mt-1 uppercase tracking-wider">
                                            <Building2 className="w-3 h-3 text-primary" /> {recruiter.role} @ <span className="text-foreground">{recruiter.company}</span>
                                        </p>
                                    </div>

                                    <div className="space-y-3 pt-4 border-t-2 border-border/50">
                                        <div className="flex items-center gap-3 text-xs font-bold text-muted-foreground">
                                            <MapPin className="w-4 h-4 text-primary shrink-0" /> {recruiter.location}
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {recruiter.specialization.map(s => (
                                                <span key={s} className="text-[10px] font-black uppercase tracking-tight bg-background border border-border px-3 py-1 rounded-full text-foreground/70">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <Button
                                            variant="outline"
                                            className="flex-1 rounded-xl border-2 border-border font-black uppercase text-[10px] tracking-widest gap-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all active:translate-y-1 h-12"
                                            onClick={() => window.open(recruiter.linkedin, '_blank')}
                                        >
                                            <Linkedin className="w-4 h-4" /> Link
                                        </Button>
                                        <Button
                                            className="flex-1 rounded-xl bg-background border-2 border-border text-foreground font-black uppercase text-[10px] tracking-widest gap-2 hover:bg-accent transition-all active:translate-y-1 h-12"
                                            onClick={() => window.location.href = `mailto:${recruiter.email}`}
                                        >
                                            <Mail className="w-4 h-4" /> Mail
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
