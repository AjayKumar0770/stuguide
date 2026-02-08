"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Mic, Send, Loader2, Sparkles, User, Bot,
    Trophy, ChevronRight, Play, StopCircle,
    MessageSquare, ArrowLeft, Brain, CheckCircle2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import Script from "next/script"
import { RobotInterface } from "@/components/RobotInterface"

type Message = {
    role: "user" | "assistant"
    content: string
}

import { BackButton } from "@/components/ui/back-button"

export default function MockInterviewPage() {
    const [role, setRole] = useState("")
    const [isStarted, setIsStarted] = useState(false)
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const [completed, setCompleted] = useState(false)
    const [feedback, setFeedback] = useState<any>(null)

    const chatEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const startInterview = async () => {
        if (!role.trim()) return
        setIsStarted(true)
        setLoading(true)

        try {
            const initialPrompt = `You are an expert technical interviewer for the role of ${role}. 
            Start the interview by introducing yourself briefly and asking the first behavioral or technical question.
            Keep it professional and challenging.`

            const response = await (window as any).puter.ai.chat(initialPrompt, { model: 'gemini-3-pro-preview' })
            const content = response?.message?.content || response?.text || ""

            setMessages([{ role: "assistant", content }])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const handleSendMessage = async () => {
        if (!input.trim() || loading) return

        const userMessage = input
        setInput("")
        setMessages(prev => [...prev, { role: "user", content: userMessage }])
        setLoading(true)

        try {
            // Check if user wants to end or if we reached 5 questions
            const questionCount = messages.filter(m => m.role === "assistant").length

            if (questionCount >= 5) {
                // Generate Feedback instead of another question
                await generateFeedback([...messages, { role: "user", content: userMessage }])
                return
            }

            const prompt = `Role: ${role}. 
            User's last answer: "${userMessage}".
            Acknowledge the answer briefly and ask the next follow-up or a new interview question. 
            We are at question ${questionCount + 1}/5.`

            const response = await (window as any).puter.ai.chat(prompt, { model: 'gemini-3-pro-preview' })
            const content = response?.message?.content || response?.text || ""

            setMessages(prev => [...prev, { role: "assistant", content }])
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const generateFeedback = async (allMessages: Message[]) => {
        setLoading(true)
        try {
            const transcript = allMessages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join("\n")
            const prompt = `Analyze this mock interview transcript for the role of ${role}:\n\n${transcript}\n\n
            Provide a detailed feedback report in JSON format with:
            {
              "overall_score": number (0-100),
              "strengths": ["...", "..."],
              "areas_to_improve": ["...", "..."],
              "sample_answers": [{"question": "...", "better_way": "..."}],
              "verdict": "Hired" | "Keep Practicing"
            }`

            const response = await (window as any).puter.ai.chat(prompt, { model: 'gemini-3-pro-preview' })
            const content = response?.message?.content || response?.text || ""
            const cleanJson = content.replace(/```json/g, '').replace(/```/g, '').trim()

            setFeedback(JSON.parse(cleanJson))
            setCompleted(true)
        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-6 md:p-12 font-sans relative overflow-hidden transition-colors duration-700">
            <Script src="https://js.puter.com/v2/" strategy="lazyOnload" />

            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-4xl mx-auto">
                <AnimatePresence mode="wait">
                    {!isStarted ? (
                        <motion.div
                            key="start"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="text-center pt-20"
                        >
                            <div className="w-24 h-24 bg-primary/10 border-2 border-primary/30 rounded-3xl flex items-center justify-center mx-auto mb-10 shadow-[0_0_50px_rgba(var(--primary-color),0.2)]">
                                <Brain className="w-12 h-12 text-primary" />
                            </div>
                            <h1 className="text-6xl font-black uppercase italic tracking-tighter text-foreground font-[family-name:var(--font-orbitron)] mb-6 leading-none">Simulation Chamber</h1>
                            <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-[0.4em] mb-12">Neural link readiness check. Initialize encounter.</p>

                            <Card className="bg-card border-border border-b-[12px] border-black/40 rounded-[40px] p-12 max-w-xl mx-auto shadow-2xl backdrop-blur-xl">
                                <div className="space-y-8">
                                    <div className="text-left">
                                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Target Designation</label>
                                        <Input
                                            placeholder="E.G. SR. REACT DEVELOPER..."
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="mt-2 h-20 bg-background border-2 border-border rounded-3xl px-8 text-lg font-black uppercase tracking-widest placeholder:text-muted-foreground/30 focus-visible:ring-0 focus-visible:border-primary/50"
                                        />
                                    </div>
                                    <Button
                                        onClick={startInterview}
                                        className="h-20 w-full rounded-3xl bg-primary text-primary-foreground font-black uppercase tracking-[0.3em] text-lg hover:bg-primary/90 border-b-8 border-primary/70 active:translate-y-1 active:border-b-0 transition-all italic flex items-center justify-center gap-4"
                                    >
                                        Initialize Link <Play className="w-6 h-6 fill-primary-foreground" />
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    ) : !completed ? (
                        <motion.div
                            key="chat"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full max-w-[1400px] mx-auto"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                                {/* Left Section: AI Robot Assistant */}
                                <div className="lg:sticky lg:top-12">
                                    <RobotInterface
                                        message={messages.filter(m => m.role === 'assistant').slice(-1)[0]?.content}
                                        loading={loading}
                                    />
                                </div>

                                {/* Right Section: Communication Terminal */}
                                <div className="flex flex-col gap-6 h-[750px]">
                                    <div className="flex justify-between items-center bg-card/60 backdrop-blur-xl p-6 rounded-[35px] border-2 border-border shadow-2xl">
                                        <div className="flex items-center gap-6">
                                            <Button
                                                variant="ghost"
                                                onClick={() => setIsStarted(false)}
                                                className="rounded-2xl hover:bg-background h-14 w-14 p-0 border-2 border-border"
                                            >
                                                <ArrowLeft className="w-6 h-6" />
                                            </Button>
                                            <div>
                                                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-foreground font-[family-name:var(--font-orbitron)] leading-none">Response Terminal</h2>
                                                <p className="text-[10px] text-primary font-black uppercase tracking-widest mt-1 flex items-center gap-2">
                                                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse" /> Uplink Active
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <div key={i} className={`h-1.5 w-10 rounded-full transition-all duration-500 ${messages.filter(m => m.role === 'assistant').length > i ? 'bg-primary shadow-[0_0_10px_rgba(var(--primary-color),0.5)]' : 'bg-secondary'}`} />
                                            ))}
                                        </div>
                                    </div>

                                    <Card className="flex-1 bg-card/30 border-2 border-border rounded-[45px] overflow-hidden flex flex-col p-8 backdrop-blur-2xl relative shadow-3xl">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(var(--primary-color),0.03)_0%,transparent_70%)] pointer-events-none" />
                                        <div className="flex-1 overflow-y-auto space-y-10 pr-4 custom-scrollbar">
                                            {messages.filter(m => m.role === 'user').map((m, i) => (
                                                <div key={i} className="flex justify-end animate-in slide-in-from-bottom-4 duration-500">
                                                    <div className="max-w-[85%] flex gap-5 flex-row-reverse">
                                                        <div className="w-14 h-14 rounded-[20px] flex items-center justify-center shrink-0 border-2 shadow-lg transition-transform hover:scale-110 bg-primary border-primary/20 text-primary-foreground">
                                                            <User className="w-7 h-7" />
                                                        </div>
                                                        <div className="p-7 rounded-[35px] font-bold leading-relaxed shadow-xl text-sm md:text-base bg-primary text-primary-foreground rounded-tr-none">
                                                            {m.content}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <div ref={chatEndRef} />
                                        </div>

                                        <div className="mt-8 relative group">
                                            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-[40px] blur opacity-25 group-focus-within:opacity-100 transition duration-1000"></div>
                                            <Input
                                                placeholder="TRANSMIT YOUR RESPONSE..."
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                                className="relative h-24 bg-background/60 border-2 border-border rounded-[32px] px-12 text-lg font-bold focus-visible:ring-0 focus-visible:border-primary/50 pr-44 backdrop-blur-xl transition-all"
                                            />
                                            <div className="absolute right-5 top-1/2 -translate-y-1/2 flex gap-3">
                                                <Button
                                                    onClick={handleSendMessage}
                                                    disabled={loading}
                                                    className="h-16 px-10 rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all border-b-6 border-primary/70 active:translate-y-1 active:border-b-0 flex items-center gap-3 font-black uppercase tracking-widest text-xs italic"
                                                >
                                                    Transmit <Send className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="feedback"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-8 pt-10"
                        >
                            <div className="text-center">
                                <h2 className="text-5xl font-black uppercase italic tracking-tighter text-foreground font-[family-name:var(--font-orbitron)] mb-2 leading-none">Simulation Debrief</h2>
                                <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Neural alignment score & optimization paths</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <Card className="bg-card border-border border-b-8 rounded-[40px] p-8 flex flex-col items-center justify-center text-center shadow-xl">
                                    <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-secondary" />
                                            <circle cx="80" cy="80" r="72" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={452} strokeDashoffset={452 - (452 * (feedback?.overall_score || 0)) / 100} className="text-primary" />
                                        </svg>
                                        <span className="absolute text-5xl font-black italic tabular-nums">{feedback?.overall_score || 0}%</span>
                                    </div>
                                    <p className="font-black uppercase tracking-widest text-muted-foreground text-xs">Integration Index</p>
                                </Card>

                                <Card className="md:col-span-2 bg-card border-border border-b-8 rounded-[40px] p-10 shadow-xl">
                                    <h3 className="text-3xl font-black uppercase italic text-foreground mb-8 flex items-center gap-4">
                                        <Trophy className="text-yellow-400 w-8 h-8" /> Verdict:
                                        <span className={feedback?.verdict === "Hired" ? "text-emerald-400" : "text-amber-400"}>
                                            {feedback?.verdict || "Evaluating..."}
                                        </span>
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                                        <div className="space-y-6">
                                            <p className="text-[10px] font-black uppercase text-emerald-400 tracking-[0.3em]">Neural Strengths</p>
                                            <ul className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-4">
                                                {feedback?.strengths?.map((s: string, i: number) => (
                                                    <li key={i} className="flex gap-3 items-start text-sm font-bold text-foreground/80 leading-relaxed group/item transition-colors hover:text-emerald-400">
                                                        <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" /> {s}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div className="space-y-6">
                                            <p className="text-[10px] font-black uppercase text-primary tracking-[0.3em]">Optimization Required</p>
                                            <ul className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-4">
                                                {feedback?.areas_to_improve?.map((s: string, i: number) => (
                                                    <li key={i} className="flex gap-3 items-start text-sm font-bold text-foreground/80 leading-relaxed group/item transition-colors hover:text-primary">
                                                        <Brain className="w-5 h-5 text-primary shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" /> {s}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            <div className="flex justify-center gap-6">
                                <Link href="/dashboard" className="flex-1 max-w-[240px]">
                                    <Button className="h-16 w-full rounded-2xl bg-secondary text-secondary-foreground border-b-4 border-secondary/70 font-black uppercase tracking-widest text-xs hover:bg-secondary/90 transition-all">
                                        End Protocol
                                    </Button>
                                </Link>
                                <Button
                                    onClick={() => window.location.reload()}
                                    className="h-16 flex-1 max-w-[240px] rounded-2xl bg-primary text-primary-foreground border-b-4 border-primary/70 font-black uppercase tracking-widest text-xs hover:bg-primary/90 transition-all italic"
                                >
                                    Re-Initialize Session
                                </Button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
