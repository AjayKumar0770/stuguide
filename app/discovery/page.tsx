"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import {
    Loader2, Sparkles, X, ChevronRight, Brain,
    Code, Palette, Terminal, Wand2, Sword,
    Shield, Zap, Layout, ArrowLeft, Target, CheckCircle
} from "lucide-react"
import CareerHeatmap from "@/components/CareerHeatmap"
import Link from "next/link"
import Script from 'next/script'
import { supabase } from "@/lib/supabase/client"

import { Waves } from "@/components/Waves";

import { GenerateButton } from "@/components/GenerateButton";
import { BackButton } from "@/components/ui/back-button"

export const dynamic = 'force-dynamic'

export default function DiscoveryPage() {
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)

    // Form State
    const [hobbies, setHobbies] = useState<string[]>([])
    const [hobbyInput, setHobbyInput] = useState("")

    const [skills, setSkills] = useState<string[]>([])
    const [skillInput, setSkillInput] = useState("")

    const [interests, setInterests] = useState({
        "System Architecture": 5,
        "Aesthetic Design": 5,
        "Logic & Algorithms": 5,
        "Human Psychology": 5
    })

    // Results State
    const [results, setResults] = useState<any>(null)

    const handleAddHobby = () => {
        if (hobbyInput.trim() && !hobbies.includes(hobbyInput.trim())) {
            setHobbies([...hobbies, hobbyInput.trim()])
            setHobbyInput("")
        }
    }

    const handleAddSkill = () => {
        if (skillInput.trim() && !skills.includes(skillInput.trim())) {
            setSkills([...skills, skillInput.trim()])
            setSkillInput("")
        }
    }

    const removeHobby = (hobby: string) => setHobbies(hobbies.filter(h => h !== hobby))
    const removeSkill = (skill: string) => setSkills(skills.filter(s => s !== skill))

    const handleDiscovery = async () => {
        setLoading(true)
        try {
            if (!(window as any).puter) {
                throw new Error("Puter.js not loaded yet. Please wait a moment.")
            }

            const messages = [
                {
                    role: "system",
                    content: `You are the "SoloLeveling Sorting Hat", a high-level career AI.
                    Analyze the user's hobbies, skills, and interests to assign them a professional "Starting Class" and 5 suitable tech career paths.
                    
                    Classes include: "Full-Stack Mage", "Data Alchemist", "Cyber Guardian", "UI Architect", "System Paladin".
                    
                    Output strictly a JSON object with these keys:
                    "starting_class": "The Class Name",
                    "class_description": "2-sentence professional summary of why they fit this class.",
                    "matches": array of objects:
                    - "domain": string (e.g., "AI Engineer")
                    - "match_percentage": number (0-100)
                    - "reasoning": string
                    - "key_skills": string[]`
                },
                {
                    role: "user",
                    content: `Profile Analysis Request:
                    Hobbies: ${hobbies.join(', ')}
                    Skills: ${skills.join(', ')}
                    Interests: ${JSON.stringify(interests)}`
                }
            ]

            const aiResponse = await (window as any).puter.ai.chat(messages, { model: 'gemini-3-pro-preview' })
            const content = aiResponse?.message?.content || ""

            // Robust JSON extraction: Find the first '{' and last '}'
            const startIdx = content.indexOf('{')
            const endIdx = content.lastIndexOf('}')

            if (startIdx === -1 || endIdx === -1) {
                throw new Error("The AI provided an invalid response format. Please try again.")
            }

            const cleanJson = content.substring(startIdx, endIdx + 1)
            const data = JSON.parse(cleanJson)

            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                await supabase.from("assessments").insert([
                    {
                        user_id: user.id,
                        responses: { hobbies, skills, interests },
                        result_data: data
                    }
                ])
                // Update profile with class if possible
                await supabase.from("profiles").update({
                    // metadata or bio could store it
                }).eq("id", user.id)
            }

            setResults(data)
            setStep(4)
        } catch (error: any) {
            console.error("Discovery failed", error)
            alert(`Neural link failed: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden flex flex-col items-center justify-center p-6 transition-colors duration-700">
            <Script src="https://js.puter.com/v2/" strategy="lazyOnload" />

            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none -z-0">
                <Waves
                    backgroundColor="transparent"
                    strokeColor="var(--primary-color)"
                    pointerSize={0.4}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/50 via-transparent to-[#020617] pointer-events-none" />
            </div>

            <div className={`w-full max-w-6xl mx-auto px-6 py-12 md:py-20 flex flex-col items-center relative z-10 ${loading ? 'cursor-wait' : ''}`}>
                <div className="absolute top-8 left-8">
                    <BackButton />
                </div>

                {/* Header Section */}
                <div className="mb-16 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/10 border-2 border-primary/20 mb-10 group cursor-default shadow-lg transition-all hover:bg-primary/20"
                    >
                        <Wand2 className="w-4 h-4 text-primary group-hover:rotate-45 transition-transform" />
                        <span className="text-[11px] font-black uppercase tracking-[0.4em] text-primary">Class Initialization Protocol</span>
                    </motion.div>
                    <h1 className="text-7xl md:text-8xl font-black uppercase italic tracking-tighter font-[family-name:var(--font-orbitron)] leading-tight text-foreground drop-shadow-sm">Discovery</h1>
                    <p className="text-muted-foreground font-bold mt-6 uppercase text-[11px] tracking-[0.5em] max-w-lg mx-auto leading-relaxed opacity-60">Neural pattern recognition initialized. Calibrating starting point.</p>
                </div>

                {/* STEP INDICATOR - Enhanced */}
                <div className="flex gap-6 justify-center mb-16 px-4 w-full max-w-md">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex-1">
                            <div className={`h-2 rounded-full transition-all duration-700 relative overflow-hidden ${step >= s ? 'bg-primary shadow-[0_0_20px_var(--primary-color)]' : 'bg-muted'}`}>
                                {step === s && (
                                    <motion.div
                                        layoutId="progress-bar"
                                        className="absolute inset-0 bg-white/20 animate-pulse"
                                    />
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div key="step1" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full">
                            <Card className="bg-card/80 border-border border-b-[12px] border-black/40 rounded-[50px] shadow-2xl backdrop-blur-2xl transition-all">
                                <CardContent className="p-10 md:p-16">
                                    <div className="flex items-center gap-6 mb-12">
                                        <div className="w-20 h-20 rounded-[30px] bg-primary/10 flex items-center justify-center border-2 border-primary/20 shadow-inner">
                                            <Palette className="w-10 h-10 text-primary" />
                                        </div>
                                        <div>
                                            <h2 className="text-4xl font-black uppercase italic text-foreground tracking-tighter font-[family-name:var(--font-orbitron)] leading-none">Origin Scan</h2>
                                            <p className="text-[11px] text-muted-foreground font-black uppercase tracking-[0.3em] mt-3 opacity-50">Capture environmental cognitive inputs</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-5 mb-10">
                                        <Input
                                            placeholder="GAMING, TRADING, READING, PAINTING..."
                                            value={hobbyInput}
                                            onChange={(e) => setHobbyInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddHobby()}
                                            className="h-20 bg-background/50 border-2 border-border border-b-6 border-black/10 rounded-3xl px-10 text-base font-black text-foreground uppercase tracking-widest focus-visible:ring-0 focus-visible:border-primary transition-all flex-1"
                                        />
                                        <Button onClick={handleAddHobby} className="h-20 px-16 rounded-3xl bg-foreground text-background font-black uppercase tracking-widest text-xs hover:scale-105 border-b-8 border-foreground/30 active:translate-y-1 active:shadow-none transition-all font-[family-name:var(--font-orbitron)] italic">Process</Button>
                                    </div>

                                    <div className="flex flex-wrap gap-4 min-h-[220px] content-start bg-background/30 p-10 rounded-[40px] border-2 border-border/50 border-dashed transition-all relative">
                                        {hobbies.map(hobby => (
                                            <Badge key={hobby} className="bg-primary/10 text-primary border-2 border-primary/20 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-5 group animate-in zoom-in-95 duration-200 shadow-md hover:bg-primary/20 transition-colors">
                                                {hobby}
                                                <X className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-foreground transition-colors" onClick={() => removeHobby(hobby)} />
                                            </Badge>
                                        ))}
                                        {hobbies.length === 0 && <span className="text-muted-foreground text-[11px] font-black uppercase tracking-[0.4em] self-center mx-auto opacity-30 text-center leading-loose">Initialize cognitive dataset by adding hobbies...<br />Press enter to deploy entry</span>}
                                    </div>

                                    <div className="flex justify-end mt-16">
                                        <Button onClick={() => setStep(2)} disabled={hobbies.length < 1} className="h-24 px-20 rounded-[32px] bg-primary text-primary-foreground font-black uppercase tracking-[0.4em] text-sm hover:bg-primary/90 border-b-12 border-primary/70 active:translate-y-1 active:border-b-0 transition-all font-[family-name:var(--font-orbitron)] italic flex items-center gap-5 shadow-2xl">
                                            Continue sequence <ChevronRight className="w-6 h-6" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div key="step2" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} className="w-full">
                            <Card className="bg-card/80 border-border border-b-[12px] border-black/40 rounded-[50px] shadow-2xl backdrop-blur-2xl transition-all">
                                <CardContent className="p-10 md:p-16">
                                    <div className="flex items-center gap-6 mb-12">
                                        <div className="w-20 h-20 rounded-[30px] bg-accent/10 flex items-center justify-center border-2 border-accent/20 shadow-inner">
                                            <Sword className="w-10 h-10 text-accent-foreground" />
                                        </div>
                                        <div>
                                            <h2 className="text-4xl font-black uppercase italic text-foreground tracking-tighter font-[family-name:var(--font-orbitron)] leading-none">Artifact Intel</h2>
                                            <p className="text-[11px] text-muted-foreground font-black uppercase tracking-[0.3em] mt-3 opacity-50">Equipt physical and mental artifacts</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row gap-5 mb-10">
                                        <Input
                                            placeholder="PYTHON, FIGMA, TRADING, SQL..."
                                            value={skillInput}
                                            onChange={(e) => setSkillInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                                            className="h-20 bg-background/50 border-2 border-border border-b-6 border-black/10 rounded-3xl px-10 text-base font-black text-foreground uppercase tracking-widest focus-visible:ring-0 focus-visible:border-accent transition-all flex-1"
                                        />
                                        <Button onClick={handleAddSkill} className="h-20 px-16 rounded-3xl bg-foreground text-background font-black uppercase tracking-widest text-xs hover:scale-105 border-b-8 border-foreground/30 active:translate-y-1 active:shadow-none transition-all font-[family-name:var(--font-orbitron)] italic">Equip</Button>
                                    </div>

                                    <div className="flex flex-wrap gap-4 min-h-[220px] content-start bg-background/30 p-10 rounded-[40px] border-2 border-border/50 border-dashed transition-all relative">
                                        {skills.map(skill => (
                                            <Badge key={skill} className="bg-accent/10 text-accent-foreground border-2 border-accent/20 px-6 py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-5 group animate-in zoom-in-95 duration-200 shadow-md hover:bg-accent/20 transition-colors">
                                                {skill}
                                                <X className="w-4 h-4 cursor-pointer text-muted-foreground hover:text-foreground transition-colors" onClick={() => removeSkill(skill)} />
                                            </Badge>
                                        ))}
                                        {skills.length === 0 && <span className="text-muted-foreground text-[11px] font-black uppercase tracking-[0.4em] self-center mx-auto opacity-30 text-center leading-loose">Equip tools to enhance alignment accuracy...<br />Neural feedback optimized for technical artifacts</span>}
                                    </div>

                                    <div className="flex justify-between mt-16 items-center">
                                        <Button onClick={() => setStep(1)} variant="ghost" className="h-16 px-8 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-muted font-black uppercase text-[11px] tracking-widest flex items-center gap-3 italic transition-all">
                                            <ArrowLeft className="w-5 h-5" /> Go Back
                                        </Button>
                                        <Button onClick={() => setStep(3)} className="h-24 px-20 rounded-[32px] bg-primary text-primary-foreground font-black uppercase tracking-[0.3em] text-sm hover:bg-primary/90 border-b-12 border-primary/70 active:translate-y-1 active:border-b-0 transition-all font-[family-name:var(--font-orbitron)] italic flex items-center gap-5 shadow-2xl">
                                            Neural verification <ChevronRight className="w-6 h-6" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div key="step3" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="w-full">
                            <Card className="bg-card/80 border-border border-b-[12px] border-black/40 rounded-[50px] shadow-2xl backdrop-blur-2xl transition-all">
                                <CardContent className="p-10 md:p-16">
                                    <div className="flex items-center gap-6 mb-12">
                                        <div className="w-20 h-20 rounded-[30px] bg-primary/10 flex items-center justify-center border-2 border-primary/20 shadow-inner">
                                            <Brain className="w-10 h-10 text-primary" />
                                        </div>
                                        <div>
                                            <h2 className="text-4xl font-black uppercase italic text-foreground tracking-tighter font-[family-name:var(--font-orbitron)] leading-none">Neural Sync</h2>
                                            <p className="text-[11px] text-muted-foreground font-black uppercase tracking-[0.3em] mt-3 opacity-50">Calibrating your cognitive preferences</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-16">
                                        {Object.entries(interests).map(([key, value]) => (
                                            <div key={key} className="space-y-6">
                                                <div className="flex justify-between mb-2 items-end px-3">
                                                    <span className="text-foreground font-black uppercase text-xs tracking-[0.3em] italic font-[family-name:var(--font-orbitron)] opacity-80">{key}</span>
                                                    <span className="text-primary font-black text-4xl italic leading-none font-[family-name:var(--font-orbitron)] tabular-nums">{value}</span>
                                                </div>
                                                <Slider
                                                    value={[value]}
                                                    max={10}
                                                    step={1}
                                                    onValueChange={(val) => setInterests({ ...interests, [key]: val[0] })}
                                                    className="py-4 cursor-pointer scale-105"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-between mt-24 pt-12 border-t-2 border-border/50 items-center">
                                        <Button onClick={() => setStep(2)} variant="ghost" className="h-16 px-8 rounded-2xl text-muted-foreground hover:text-foreground hover:bg-muted font-black uppercase text-[11px] tracking-widest flex items-center gap-3 italic transition-all">
                                            <ArrowLeft className="w-5 h-5" /> Go Back
                                        </Button>

                                        <GenerateButton
                                            onClick={handleDiscovery}
                                            loading={loading}
                                            label="DEPLOY SYNC"
                                            loadingLabel="SYNCING..."
                                            disabled={loading}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}

                    {step === 4 && results && (
                        <motion.div key="step4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="w-full space-y-12">
                            {/* CLASS ASSIGNMENT BANNER - ELITE REDESIGN */}
                            <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-[70px] shadow-[0_0_100px_rgba(var(--primary-color),0.3)] relative overflow-hidden group">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                                <Card className="bg-transparent border-none p-16 flex flex-col items-center text-center relative z-10 overflow-hidden">
                                    <motion.div
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                    >
                                        <Badge className="mb-10 bg-white/20 text-white border-2 border-white/40 px-10 py-3 uppercase font-black tracking-[0.5em] text-[11px] rounded-full backdrop-blur-xl shadow-xl">Initial Class Assigned</Badge>
                                    </motion.div>
                                    <motion.h2
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                                        className="text-9xl font-black uppercase italic tracking-tighter text-white font-[family-name:var(--font-orbitron)] leading-none mb-10 drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)]"
                                    >
                                        {results.starting_class}
                                    </motion.h2>
                                    <motion.p
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 0.6 }}
                                        className="text-2xl font-bold text-white/95 max-w-3xl mx-auto leading-relaxed italic drop-shadow-md"
                                    >
                                        "{results.class_description}"
                                    </motion.p>
                                </Card>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                <motion.div
                                    initial={{ opacity: 0, x: -30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="lg:col-span-2 bg-card/60 p-12 rounded-[60px] border-2 border-border overflow-hidden backdrop-blur-xl min-h-[600px] flex flex-col shadow-2xl border-b-[16px] border-black/40 group relative"
                                >
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px] -mr-32 -mt-32" />
                                    <div className="flex items-center justify-between mb-12 relative z-10">
                                        <div>
                                            <h3 className="text-4xl font-black uppercase italic tracking-tighter text-foreground font-[family-name:var(--font-orbitron)]">Career Heatmap</h3>
                                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.4em] mt-3">Neural Alignment Data Visualization</p>
                                        </div>
                                        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                                            <Target className="w-8 h-8 text-primary shadow-[0_0_15px_var(--primary-color)]" />
                                        </div>
                                    </div>
                                    <div className="flex-1 flex items-center justify-center relative z-10 w-full">
                                        <CareerHeatmap data={results.matches} />
                                    </div>
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, x: 30 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 1 }}
                                    className="space-y-10"
                                >
                                    <Card className="bg-card/60 border-2 border-border border-b-[16px] border-black/40 rounded-[60px] p-12 h-full backdrop-blur-xl shadow-2xl flex flex-col justify-between group overflow-hidden relative">
                                        <div className="absolute bottom-0 right-0 w-48 h-48 bg-accent/5 rounded-full blur-[80px] -mr-24 -mb-24" />
                                        <div className="relative z-10">
                                            <h4 className="text-2xl font-black uppercase italic text-foreground mb-12 flex items-center gap-5 font-[family-name:var(--font-orbitron)]">
                                                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center border-2 border-primary/20">
                                                    <Zap className="w-7 h-7 text-primary fill-primary/20 animate-pulse" />
                                                </div>
                                                Deployment
                                            </h4>
                                            <div className="space-y-8">
                                                <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-[0.4em] leading-loose opacity-70">Strategic vectors calculated. Ready for immediate battlefield integration.</p>
                                                <Link href="/dashboard" className="block">
                                                    <Button className="w-full h-28 rounded-[40px] bg-primary text-primary-foreground font-black uppercase tracking-[0.4em] italic text-base border-b-12 border-primary/70 hover:translate-y-1 hover:border-b-8 active:translate-y-2 active:border-b-4 transition-all shadow-xl font-[family-name:var(--font-orbitron)] hover:shadow-primary/20">Launch Dashboard</Button>
                                                </Link>
                                                <div className="relative">
                                                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                                                    <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-muted-foreground bg-transparent"><span className="px-4 bg-card/60 backdrop-blur-xl rounded-full">Alternative Path</span></div>
                                                </div>
                                                <Button onClick={() => { setStep(1); setResults(null) }} variant="outline" className="w-full h-20 rounded-[32px] border-2 border-border bg-background/50 text-muted-foreground font-black uppercase tracking-widest text-[11px] hover:text-foreground hover:border-primary/50 transition-all font-[family-name:var(--font-orbitron)] shadow-lg hover:scale-102">Re-evaluate Link</Button>
                                            </div>
                                        </div>
                                        <div className="relative z-10 mt-12 bg-emerald-500/5 border-2 border-emerald-500/20 p-6 rounded-[30px] flex items-center gap-5 group-hover:bg-emerald-500/10 transition-colors">
                                            <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center border-2 border-emerald-500/30">
                                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                                            </div>
                                            <p className="text-[10px] font-black tracking-widest text-emerald-500 uppercase italic">Link synchronized: stable</p>
                                        </div>
                                    </Card>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
