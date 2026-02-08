"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { motion, AnimatePresence } from "framer-motion"
import {
    UploadCloud, FileText, Loader2, CheckCircle,
    Briefcase, Sparkles, AlertCircle, ShieldCheck,
    Target, Zap, Layout
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import ResumeAnalysisResults from "@/components/ResumeAnalysisResults"
import Script from 'next/script'
import Link from "next/link"
import { Waves } from "@/components/Waves";
import { GenerateButton } from "@/components/GenerateButton";
import { BackButton } from "@/components/ui/back-button"

export default function ResumeAuditPage() {
    const [file, setFile] = useState<File | null>(null)
    const [jd, setJd] = useState("")
    const [loading, setLoading] = useState(false)
    const [results, setResults] = useState<any>(null)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles?.length > 0) {
            setFile(acceptedFiles[0])
            setResults(null)
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1,
        multiple: false
    })

    const handleAnalyze = async () => {
        if (!file) return

        setLoading(true)
        const formData = new FormData()
        formData.append('resume', file)
        formData.append('jd', jd)

        try {
            const response = await fetch('/api/resume/analyze', {
                method: 'POST',
                body: formData,
            })

            const data = await response.json()
            if (data.error) throw new Error(data.error)

            const resumeText = data.text
            if (!resumeText) throw new Error("Failed to extract text from resume")

            if (!(window as any).puter) {
                throw new Error("Puter.js not loaded yet. Please wait a moment.")
            }

            const messages = [
                {
                    role: "system",
                    content: `You are an expert Technical Recruiter and ATS Audit specialist.
                    Analyze the resume provided by the user against the job description.
                    
                    Output strictly a valid JSON object (no markdown, no backticks, no code blocks) with this specific structure:
                    {
                      "ats_score": number (0-100),
                      "summary": "Brief 2-sentence executive summary.",
                      "keyword_gaps": ["missing_keyword1", "missing_keyword2"],
                      "missing_hard_skills": ["skill1", "skill2"],
                      "missing_soft_skills": ["skill1", "skill2"],
                      "formatting_issues": ["issue1", "issue2"],
                      "section_feedback": [
                        { "section": "Experience", "status": "improve", "feedback": "Detailed feedback..." },
                        { "section": "Skills", "status": "good", "feedback": "Feedback..." }
                      ]
                    }`
                },
                {
                    role: "user",
                    content: `Resume Text:
                    "${resumeText.slice(0, 20000)}"
                    
                    Job Description:
                    "${jd ? jd.slice(0, 5000) : 'General Tech Role'}"`
                }
            ]

            const aiResponse = await (window as any).puter.ai.chat(messages, { model: 'gemini-3-pro-preview' })
            const content = aiResponse?.message?.content || ""

            // Robust JSON extraction
            const startIdx = content.indexOf('{')
            const endIdx = content.lastIndexOf('}')
            if (startIdx === -1 || endIdx === -1) {
                throw new Error("Invalid AI response format")
            }
            const cleanJson = content.substring(startIdx, endIdx + 1)
            const jsonResult = JSON.parse(cleanJson)

            setResults(jsonResult)
        } catch (error: any) {
            console.error("Analysis failed", error)
            alert(`Analysis failed: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 relative overflow-hidden flex flex-col items-center py-12 px-6 transition-colors duration-700">
            <Script src="https://js.puter.com/v2/" strategy="lazyOnload" />

            <div className="fixed inset-0 pointer-events-none -z-0">
                <Waves
                    backgroundColor="transparent"
                    strokeColor="var(--primary-color)"
                    pointerSize={0.4}
                />
            </div>

            <main className="relative z-10 max-w-5xl mx-auto px-6 py-12 md:py-20 lg:py-24 space-y-16">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b-2 border-border pb-8">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <ShieldCheck className="w-5 h-5 text-primary fill-primary" />
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">Neural Verification</span>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter text-foreground font-[family-name:var(--font-orbitron)] leading-none">CV Neural Audit</h1>
                        <p className="text-muted-foreground font-bold uppercase text-[10px] md:text-xs tracking-[0.3em]">Reverse-engineering the recruiter's mental model</p>
                    </motion.div>
                    <div className="flex gap-4">
                        <BackButton href="/dashboard" />
                    </div>
                </div>

                {!results ? (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                        {/* Upload & JD Capture */}
                        <div className="lg:col-span-3 space-y-8">
                            <Card className="bg-card border-border border-b-[12px] border-black/40 rounded-[40px] p-8 md:p-10 shadow-2xl backdrop-blur-xl">
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 ml-2">
                                            <UploadCloud className="w-5 h-5 text-primary" />
                                            <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Upload Raw Intelligence</h3>
                                        </div>
                                        <div
                                            {...getRootProps()}
                                            className={`relative group border-4 border-dashed rounded-[32px] p-12 transition-all duration-300 flex flex-col items-center justify-center gap-4 cursor-pointer ${isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-accent/5"
                                                }`}
                                        >
                                            <input {...getInputProps()} />
                                            <div className="w-20 h-20 bg-background border-2 border-border rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                                                {file ? (
                                                    <FileText className="w-10 h-10 text-primary" />
                                                ) : (
                                                    <UploadCloud className={`w-10 h-10 ${isDragActive ? 'text-primary' : 'text-muted-foreground'}`} />
                                                )}
                                            </div>
                                            <div className="text-center">
                                                <p className="font-black uppercase tracking-tight text-lg mb-1">
                                                    {file ? file.name : "Drop CV Fragment Here"}
                                                </p>
                                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-loose">
                                                    PDF Encrypted Support • Max 10MB
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 ml-2">
                                            <Target className="w-5 h-5 text-primary" />
                                            <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Target Role / JD (Optional)</h3>
                                        </div>
                                        <Textarea
                                            placeholder="Paste the target objective parameters (Job Description) to calculate delta alignment..."
                                            className="min-h-[200px] bg-background border-2 border-border rounded-[32px] p-8 text-foreground font-bold focus-visible:ring-0 focus-visible:border-primary/50 resize-none leading-relaxed transition-all"
                                            value={jd}
                                            onChange={(e) => setJd(e.target.value)}
                                        />
                                    </div>

                                    <Button
                                        onClick={handleAnalyze}
                                        disabled={!file || loading}
                                        className="w-full h-20 rounded-[28px] bg-primary text-primary-foreground font-black uppercase tracking-[0.3em] text-lg hover:bg-primary/90 border-b-8 border-primary/70 active:translate-y-1 active:border-b-0 transition-all flex items-center justify-center gap-4 italic"
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-6 h-6 animate-spin" /> Neural Mapping...
                                            </>
                                        ) : (
                                            <>
                                                Initiate Audit <Zap className="w-6 h-6 fill-primary-foreground" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Card>
                        </div>

                        {/* Side Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {[
                                { icon: Sparkles, title: "Neural Scanning", desc: "LLM-powered extraction detects hidden patterns recruiters seek." },
                                { icon: ShieldCheck, title: "ATS Optimization", desc: "Verifies parsing compatibility against 50+ ATS protocols." },
                                { icon: Layout, title: "Formatting Check", desc: "Ensures visual hierarchy and semantic structure are optimal." }
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + idx * 0.1 }}
                                >
                                    <Card className="bg-card/50 border-border border-b-4 rounded-[30px] p-6 hover:bg-accent/5 transition-colors">
                                        <div className="flex gap-5">
                                            <div className="w-12 h-12 bg-primary/10 border-2 border-primary/20 rounded-2xl flex items-center justify-center shrink-0">
                                                <item.icon className="w-6 h-6 text-primary" />
                                            </div>
                                            <div>
                                                <h4 className="font-black uppercase italic tracking-tight text-foreground">{item.title}</h4>
                                                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider leading-relaxed mt-1">{item.desc}</p>
                                            </div>
                                        </div>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8"
                    >
                        <div className="flex justify-between items-center">
                            <Badge className="h-10 px-6 rounded-full bg-primary/10 text-primary border-2 border-primary/30 font-black uppercase tracking-widest text-[10px]">
                                Analysis Complete
                            </Badge>
                            <Button
                                variant="ghost"
                                onClick={() => setResults(null)}
                                className="font-black uppercase text-[10px] tracking-widest text-muted-foreground hover:text-foreground hover:bg-accent rounded-xl px-6"
                            >
                                Start New Scan
                            </Button>
                        </div>
                        <ResumeAnalysisResults data={results} />
                    </motion.div>
                )}
            </main>
        </div>
    )
}
