"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Timer, Trophy, ArrowRight, CheckCircle, Brain, Zap, Shield, Sparkles, Target, Activity } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { BackButton } from "@/components/ui/back-button"

const QUESTIONS = [
    {
        id: 1,
        question: "Which architectural pattern is best suited for horizontally scalable applications?",
        options: ["Monolithic", "Microservices", "Mainframe", "Client-Server"],
        correct: 1,
        category: "Architecture"
    },
    {
        id: 2,
        question: "What is the primary benefit of using a Vector Database in AI applications?",
        options: ["Relational Mapping", "Similarity Search", "CSV Storage", "Transaction Logging"],
        correct: 1,
        category: "AI/ML Mastery"
    },
    {
        id: 3,
        question: "In the context of the GATTACA principle, what does the 'A' represent in Alignment?",
        options: ["Automation", "Accuracy", "Accountability", "Analysis"],
        correct: 2,
        category: "Professionalism"
    },
    {
        id: 4,
        question: "Which HTTP method is considered idempotent by standard definition?",
        options: ["POST", "PUT", "PATCH", "CONNECT"],
        correct: 1,
        category: "Logic & API"
    },
    {
        id: 5,
        question: "A client reports a significant delay in page load. Which tool is first for diagnosing layout shifts?",
        options: ["Profiler", "Lighthouse", "Inspector", "Terminal"],
        correct: 1,
        category: "Optimization"
    }
]

export default function TrialQuizPage() {
    const [started, setStarted] = useState(false)
    const [currentQ, setCurrentQ] = useState(0)
    const [answers, setAnswers] = useState<number[]>([])
    const [score, setScore] = useState(0)
    const [finished, setFinished] = useState(false)
    const [timeLeft, setTimeLeft] = useState(600) // 10 mins

    useEffect(() => {
        let timer: NodeJS.Timeout
        if (started && !finished && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(t => t - 1), 1000)
        } else if (timeLeft === 0 && !finished) {
            finishQuiz([])
        }
        return () => clearInterval(timer)
    }, [started, finished, timeLeft])

    const handleAnswer = (optionIndex: number) => {
        const newAnswers = [...answers, optionIndex]
        setAnswers(newAnswers)

        if (currentQ < QUESTIONS.length - 1) {
            setCurrentQ(currentQ + 1)
        } else {
            finishQuiz(newAnswers)
        }
    }

    const finishQuiz = (finalAnswers = answers) => {
        let correctCount = 0
        finalAnswers.forEach((ans, idx) => {
            if (QUESTIONS[idx] && ans === QUESTIONS[idx].correct) correctCount++
        })
        setScore(correctCount)
        setFinished(true)
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`
    }

    const chartData = [
        { subject: 'Architecture', A: score > 3 ? 95 : 65, fullMark: 100 },
        { subject: 'AI/ML', A: score > 2 ? 88 : 45, fullMark: 100 },
        { subject: 'Sync', A: score > 4 ? 92 : 72, fullMark: 100 },
        { subject: 'Logic', A: score > 3 ? 82 : 38, fullMark: 100 },
        { subject: 'Optimization', A: score > 1 ? 78 : 52, fullMark: 100 },
    ]

    return (
        <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30 relative overflow-hidden flex flex-col items-center justify-center p-6 transition-colors duration-500">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[800px] h-[800px] bg-accent/10 rounded-full blur-[150px]" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
            </div>

            <AnimatePresence mode="wait">
                {!started && !finished && (
                    <motion.div
                        key="start"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="w-full max-w-xl z-20"
                    >
                        <Card className="bg-card border-border border-b-[12px] border-black/40 rounded-[50px] p-12 backdrop-blur-xl relative overflow-hidden group shadow-2xl">
                            <div className="absolute top-8 left-8">
                                <BackButton href="/dashboard" />
                            </div>
                            <div className="relative z-10 flex flex-col items-center text-center mt-6">
                                <div className="w-28 h-28 bg-primary/10 border-2 border-primary/20 rounded-[32px] flex items-center justify-center mb-10 shadow-lg group-hover:scale-110 transition-transform">
                                    <Activity className="w-14 h-14 text-primary" />
                                </div>
                                <Badge className="mb-6 bg-primary/10 text-primary border-2 border-primary/20 px-6 py-2 uppercase font-black tracking-[0.4em] text-[10px] rounded-full">Trial Initialization</Badge>
                                <h1 className="text-6xl font-black uppercase italic tracking-tighter text-foreground font-[family-name:var(--font-orbitron)] mb-8 leading-none">The Trial</h1>
                                <p className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] mb-12 max-w-sm leading-relaxed opacity-70">
                                    High-fidelity performance scan across architectural, logical, and optimization domains.
                                </p>
                                <Button
                                    onClick={() => setStarted(true)}
                                    className="h-24 w-full rounded-3xl bg-primary text-primary-foreground font-black uppercase tracking-[0.4em] text-sm hover:bg-primary/90 border-b-10 border-primary/70 active:translate-y-1 active:border-b-0 transition-all italic font-[family-name:var(--font-orbitron)] shadow-xl"
                                >
                                    Sync Neural Link
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}

                {started && !finished && (
                    <motion.div
                        key="quiz"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="w-full max-w-4xl z-10"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 gap-6 px-6">
                            <div className="flex-1 w-full">
                                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-muted-foreground block mb-4 italic">Neural Node {currentQ + 1} of {QUESTIONS.length}</span>
                                <div className="flex gap-3">
                                    {QUESTIONS.map((_, i) => (
                                        <div key={i} className={`h-2 flex-1 rounded-full transition-all duration-700 ${currentQ >= i ? 'bg-primary shadow-[0_0_15px_var(--primary-color)]' : 'bg-border/50'}`} />
                                    ))}
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="font-black text-primary italic bg-primary/10 border-2 border-primary/20 px-8 py-4 rounded-[24px] block text-4xl leading-none tabular-nums shadow-lg">
                                    {formatTime(timeLeft)}
                                </span>
                            </div>
                        </div>

                        <Card className="bg-card border-border border-b-[12px] border-black/40 rounded-[50px] p-12 md:p-16 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16" />
                            <Badge className="mb-8 bg-primary/10 text-primary border-2 border-primary/20 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] font-[family-name:var(--font-orbitron)] italic">{QUESTIONS[currentQ].category}</Badge>
                            <h2 className="text-4xl md:text-5xl font-black text-foreground leading-tight mb-16 italic tracking-tighter uppercase font-[family-name:var(--font-orbitron)]">{QUESTIONS[currentQ].question}</h2>

                            <div className="grid grid-cols-1 gap-6">
                                {QUESTIONS[currentQ].options.map((option, idx) => (
                                    <Button
                                        key={idx}
                                        className="w-full justify-start h-24 text-lg font-black border-2 border-border bg-background/40 text-muted-foreground hover:bg-primary/10 hover:border-primary hover:text-foreground transition-all group px-10 rounded-[32px] relative overflow-hidden shadow-lg hover:shadow-primary/10 border-b-8 border-black/10 active:translate-y-1 active:border-b-0"
                                        onClick={() => handleAnswer(idx)}
                                    >
                                        <span className="w-12 h-12 rounded-2xl bg-muted border-2 border-border flex items-center justify-center text-sm mr-8 text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary font-black transition-all italic font-[family-name:var(--font-orbitron)] leading-none">
                                            0{idx + 1}
                                        </span>
                                        <span className="uppercase tracking-[0.2em] font-sans text-base">{option}</span>
                                    </Button>
                                ))}
                            </div>
                        </Card>
                    </motion.div>
                )}

                {finished && (
                    <motion.div
                        key="finished"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full max-w-6xl z-10"
                    >
                        <Card className="bg-card border-border border-b-[16px] border-black/40 rounded-[60px] p-12 md:p-20 backdrop-blur-xl shadow-2xl">
                            <div className="flex flex-col lg:flex-row gap-16 items-center">
                                <div className="w-full lg:w-5/12 flex flex-col items-center lg:items-start text-center lg:text-left">
                                    <Badge className="mb-6 bg-emerald-500/10 text-emerald-500 border-2 border-emerald-500/20 px-6 py-2 uppercase font-black tracking-[0.4em] text-[10px] rounded-full">Trial Completed</Badge>
                                    <h2 className="text-7xl font-black uppercase italic tracking-tighter text-foreground font-[family-name:var(--font-orbitron)] leading-none mb-6">Neural Result</h2>
                                    <p className="text-muted-foreground font-black uppercase tracking-[0.3em] text-[10px] mb-12 opacity-60">Performance sync successful. Readiness visualized in the neural map.</p>

                                    <div className="grid grid-cols-2 gap-6 w-full mb-12">
                                        <div className="bg-background/40 p-10 rounded-[32px] border-2 border-border shadow-inner">
                                            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest opacity-50 block mb-2">Sync Accuracy</span>
                                            <div className="text-6xl font-black text-emerald-500 italic font-[family-name:var(--font-orbitron)]">{(score / QUESTIONS.length * 100).toFixed(0)}%</div>
                                        </div>
                                        <div className="bg-background/40 p-10 rounded-[32px] border-2 border-border shadow-inner">
                                            <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest opacity-50 block mb-2">XP Protocol</span>
                                            <div className="text-6xl font-black text-primary italic font-[family-name:var(--font-orbitron)]">+{score * 200}</div>
                                        </div>
                                    </div>

                                    <Link href="/dashboard" className="w-full">
                                        <Button size="lg" className="h-24 w-full bg-foreground text-background font-black uppercase tracking-[0.4em] text-sm rounded-3xl border-b-10 border-foreground/70 hover:bg-foreground/90 active:translate-y-1 active:border-b-0 transition-all font-[family-name:var(--font-orbitron)] italic shadow-2xl">
                                            Command Center
                                        </Button>
                                    </Link>
                                </div>

                                <div className="w-full lg:w-7/12 h-[550px] bg-background/50 rounded-[60px] border-2 border-border p-12 flex items-center justify-center relative shadow-inner overflow-hidden">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--primary-color)_0%,transparent_70%)] opacity-5" />
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                                            <PolarGrid stroke="var(--border)" strokeWidth={2} />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--muted-foreground)', fontSize: 10, fontWeight: 900 }} />
                                            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                            <Radar name="Candidate" dataKey="A" stroke="var(--primary-color)" strokeWidth={5} fill="var(--primary-color)" fillOpacity={0.3} />
                                            <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '2px solid var(--border)', borderRadius: '24px', fontWeight: 900, color: 'var(--foreground)' }} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
