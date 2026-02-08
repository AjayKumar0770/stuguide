"use client"

import { useState, useCallback, useEffect } from 'react';
import { ReactFlow, Background, Controls, Node, Edge, useNodesState, useEdgesState } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useParams } from 'next/navigation';
import {
    Loader2, BookOpen, Brain, Trophy, XCircle,
    Share2, Download, Zap, Map as MapIcon,
    CheckCircle
} from 'lucide-react';
import Script from 'next/script';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from '@/lib/supabase/client';
import { BackButton } from '@/components/ui/back-button';

const initialNodes: Node[] = [
    { id: '1', position: { x: 250, y: 0 }, data: { label: 'SYNCHRONIZING...' }, type: 'input' },
];
const initialEdges: Edge[] = [];

export default function InteractiveRoadmapPage() {
    const params = useParams()
    const domain = typeof params?.domain === 'string' ? decodeURIComponent(params.domain) : ''

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [loading, setLoading] = useState(true)
    const [puterLoaded, setPuterLoaded] = useState(false)

    // Interaction State
    const [selectedNode, setSelectedNode] = useState<Node | null>(null)
    const [lessonContent, setLessonContent] = useState<any>(null)
    const [lessonLoading, setLessonLoading] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // Quiz State
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [quizScore, setQuizScore] = useState(0)
    const [showQuizResults, setShowQuizResults] = useState(false)

    useEffect(() => {
        if ((window as any).puter) {
            setPuterLoaded(true)
        }
    }, [])

    useEffect(() => {
        if (!domain || !puterLoaded) return

        const generateTree = async () => {
            try {
                // 1. Fetch existing progress
                const { data: { user } } = await supabase.auth.getUser()
                let completedNodes: string[] = []

                if (user) {
                    const { data: progressData } = await supabase
                        .from('skill_progress')
                        .select('node_id')
                        .eq('user_id', user.id)
                        .eq('domain', domain)
                        .eq('is_completed', true)

                    if (progressData) {
                        completedNodes = progressData.map((p: any) => p.node_id)
                    }
                }

                // 2. AI Generation
                const prompt = `Create a strategic learning tree for "${domain}".
                Output strictly valid JSON (no markdown):
                {
                    "nodes": [
                        { "id": "1", "label": "Foundations", "level": 0, "type": "input" },
                        { "id": "2", "label": "Core Protocol", "level": 1, "type": "default" }
                    ],
                    "edges": [
                        { "source": "1", "target": "2" }
                    ]
                }
                Limit to 12 mission nodes. Use levels for vertical positioning.`

                const response = await (window as any).puter.ai.chat(prompt, { model: 'gemini-3-pro-preview' })
                const text = response?.message?.content || response?.text || ""

                // Robust JSON extraction
                const startIdx = text.indexOf('{')
                const endIdx = text.lastIndexOf('}')
                if (startIdx === -1 || endIdx === -1) {
                    throw new Error("Invalid strategic data format")
                }
                const cleanJson = text.substring(startIdx, endIdx + 1)
                const data = JSON.parse(cleanJson)

                const layoutNodes = data.nodes.map((node: any) => {
                    const level = node.level || 0
                    return {
                        ...node,
                        position: { x: (level * 250) + 100, y: (Math.random() * 400) },
                        data: {
                            ...node,
                            label: node.label,
                            completed: completedNodes.includes(node.id)
                        }
                    }
                })

                setNodes(layoutNodes)
                setEdges(data.edges)
                setLoading(false)
            } catch (err) {
                console.error("Neural Sync Error:", err)
                setLoading(false)
            }
        }

        generateTree()
    }, [domain, puterLoaded, setNodes, setEdges])

    const onNodeClick = useCallback(async (_: any, node: Node) => {
        setSelectedNode(node)
        setIsDialogOpen(true)
        setLessonLoading(true)
        setShowQuizResults(false)
        setCurrentQuestionIndex(0)
        setQuizScore(0)

        try {
            const prompt = `Generate a high-fidelity tactical briefing for the mission: "${node.data.label}" within the domain "${domain}".
            Output strictly valid JSON:
            {
                "definition": "...",
                "bullets": ["...", "...", "..."],
                "quiz": [
                    { "question": "...", "options": ["...", "...", "..."], "correct": 0 }
                ]
            }
            Ensure content is advanced and technical.`

            const response = await (window as any).puter.ai.chat(prompt)
            const text = response?.message?.content || response?.text || ""
            const startIdx = text.indexOf('{')
            const endIdx = text.lastIndexOf('}')
            setLessonContent(JSON.parse(text.substring(startIdx, endIdx + 1)))
        } catch (err) {
            console.error("Briefing Extraction Error:", err)
        } finally {
            setLessonLoading(false)
        }
    }, [domain])

    const handleAnswer = async (optionIndex: number) => {
        if (!lessonContent) return

        const isCorrect = optionIndex === lessonContent.quiz[currentQuestionIndex].correct
        if (isCorrect) setQuizScore(prev => prev + 1)

        if (currentQuestionIndex < lessonContent.quiz.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1)
        } else {
            // Quiz complete
            const finalScore = isCorrect ? quizScore + 1 : quizScore
            setShowQuizResults(true)

            if (finalScore === lessonContent.quiz.length && selectedNode) {
                // Mark as completed in UI
                setNodes(nds => nds.map(n =>
                    n.id === selectedNode.id ? { ...n, data: { ...n.data, completed: true } } : n
                ))

                // Save to Database
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    await supabase.from('skill_progress').insert([
                        {
                            user_id: user.id,
                            node_id: selectedNode.id,
                            domain: domain,
                            is_completed: true,
                            xp_awarded: 500
                        }
                    ])
                }
            }
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
                <Loader2 className="w-16 h-16 animate-spin text-primary mb-6" />
                <h2 className="text-2xl font-black uppercase italic tracking-tighter text-foreground font-[family-name:var(--font-orbitron)] animate-pulse">Synchronizing Neural Path...</h2>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-[0.4em] mt-4">Calibrating Strategy Tree for {domain}</p>
            </div>
        )
    }

    return (
        <div className="h-screen bg-background relative selection:bg-primary/30 font-sans transition-colors duration-500 overflow-hidden">
            <Script src="https://js.puter.com/v2/" strategy="lazyOnload" />

            <div className="absolute top-8 left-8 z-20">
                <BackButton href="/roadmap" />
            </div>

            {/* 1. INTERFACE HEADER */}
            <div className="absolute top-8 right-8 z-20 flex items-center gap-4">
                <div className="hidden md:flex flex-col items-end">
                    <div className="flex items-center gap-2 mb-1">
                        <MapIcon className="w-4 h-4 text-primary fill-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Strategic Map</span>
                    </div>
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter text-foreground font-[family-name:var(--font-orbitron)] leading-none">{domain}</h2>
                </div>
                <div className="h-12 w-[2px] bg-border mx-2 hidden md:block" />
                <Button className="w-12 h-12 rounded-2xl bg-card border-2 border-border p-0 flex items-center justify-center hover:bg-accent hover:border-primary/50 transition-all active:translate-y-1">
                    <Share2 className="w-5 h-5 text-foreground" />
                </Button>
                <Button className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground p-0 flex items-center justify-center hover:bg-primary/90 transition-all border-b-4 border-primary/70 active:translate-y-1 active:border-b-0">
                    <Download className="w-5 h-5" />
                </Button>
            </div>

            {/* 2. MAIN CANVAS */}
            <main className="flex-1 h-full relative bg-background overflow-hidden cursor-crosshair">
                <div className="absolute inset-0 pointer-events-none -z-0">
                    <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px]" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[100px]" />
                </div>

                <div style={{ width: '100%', height: '100%' }}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onNodeClick={onNodeClick}
                        fitView
                        nodeTypes={{
                            input: (props: any) => (
                                <div className="px-10 py-6 rounded-[32px] bg-primary text-primary-foreground border-b-8 border-primary/60 font-black uppercase tracking-[0.3em] text-[10px] italic shadow-2xl font-[family-name:var(--font-orbitron)]">
                                    {props.data.label}
                                </div>
                            ),
                            default: (props: any) => (
                                <div className={`px-10 py-6 rounded-[32px] border-2 font-black uppercase tracking-[0.3em] text-[10px] italic transition-all group cursor-pointer border-b-6 font-[family-name:var(--font-orbitron)] ${props.data.completed ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.1)] border-b-emerald-500/60' : 'bg-card/80 border-border text-foreground hover:border-primary/50 border-b-black/20 hover:border-b-primary/30 backdrop-blur-md'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className={`w-3 h-3 rounded-full ${props.data.completed ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_var(--emerald-500)]' : 'bg-primary shadow-[0_0_10px_var(--primary-color)]'}`} />
                                        {props.data.label}
                                    </div>
                                </div>
                            )
                        }}
                    >
                        <Background color="var(--border)" gap={30} size={2} />
                        <Controls className="!bg-card/80 !border-2 !border-border !rounded-2xl !backdrop-blur-xl [&_button]:!bg-transparent [&_button]:!border-none [&_button]:!text-foreground [&_button:hover]:!bg-primary/10 [&_svg]:!fill-foreground shadow-2xl" />
                    </ReactFlow>
                </div>

                {/* Legend / Status HUD */}
                <div className="absolute bottom-10 left-10 z-20">
                    <div className="bg-card/80 backdrop-blur-xl border-2 border-border rounded-[40px] p-8 shadow-2xl flex items-center gap-10 border-b-[10px] border-black/30">
                        <div className="flex flex-col gap-2">
                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-50 block">Neural Phase</span>
                            <div className="flex items-center gap-4">
                                <Zap className="w-6 h-6 text-primary" />
                                <span className="text-2xl font-black uppercase italic tracking-tighter text-foreground font-[family-name:var(--font-orbitron)] leading-none">Map Active</span>
                            </div>
                        </div>
                        <div className="w-[2px] h-12 bg-border/50" />
                        <div className="flex items-center gap-6">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-50 mb-2">Efficiency</span>
                                <div className="w-28 h-2 bg-background border-2 border-border rounded-full overflow-hidden shadow-inner">
                                    <div className="h-full bg-primary" style={{ width: '85%' }} />
                                </div>
                                <div className="mt-1 flex justify-between items-center text-[11px] font-black text-primary italic font-[family-name:var(--font-orbitron)]">
                                    <span>98%</span>
                                </div>
                            </div>
                            <div className="px-6 py-3 bg-emerald-500/10 border-2 border-emerald-500/20 rounded-2xl shadow-inner">
                                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 italic font-[family-name:var(--font-orbitron)] flex items-center gap-2">
                                    <CheckCircle className="w-3.5 h-3.5" /> Sync complete
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* 3. LESSON MODAL */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-card/95 border-none text-foreground sm:max-w-2xl rounded-[60px] border-b-[16px] border-black/40 p-0 overflow-hidden shadow-[0_0_150px_rgba(0,0,0,0.6)] outline-none backdrop-blur-2xl">
                    <div className="p-12 md:p-16 max-h-[85vh] overflow-y-auto custom-scrollbar">
                        <DialogHeader className="mb-12">
                            <DialogTitle className="flex items-center gap-6 text-5xl font-black uppercase italic tracking-tighter font-[family-name:var(--font-orbitron)] leading-none">
                                <div className="w-20 h-20 bg-primary/10 border-2 border-primary/20 rounded-[32px] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                    <Brain className="text-primary w-10 h-10" />
                                </div>
                                {selectedNode?.data?.label as string}
                            </DialogTitle>
                            <DialogDescription className="text-muted-foreground font-black uppercase text-[11px] tracking-[0.5em] pl-1 opacity-50 mt-4 italic font-[family-name:var(--font-orbitron)]">
                                Neural Alignment Sequence_001
                            </DialogDescription>
                        </DialogHeader>

                        {lessonLoading ? (
                            <div className="flex flex-col items-center justify-center py-24">
                                <Loader2 className="w-16 h-16 text-primary animate-spin mb-8" />
                                <p className="text-[12px] font-black uppercase text-muted-foreground tracking-[0.5em] animate-pulse">Extracting Core Data...</p>
                            </div>
                        ) : lessonContent ? (
                            <div className="space-y-16">
                                {!showQuizResults ? (
                                    <>
                                        <div className="bg-background/40 border-2 border-border p-10 rounded-[48px] border-b-8 border-black/10 shadow-inner relative overflow-hidden group">
                                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                                            <h4 className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] text-primary mb-10 italic font-[family-name:var(--font-orbitron)]">
                                                <BookOpen className="w-5 h-5" /> Strategic Intel
                                            </h4>
                                            <p className="text-lg text-foreground leading-relaxed font-bold italic opacity-90 mb-10">
                                                {lessonContent?.definition}
                                            </p>
                                            <div className="space-y-4">
                                                {lessonContent.bullets.map((b: string, i: number) => (
                                                    <div key={i} className="flex gap-6 items-center bg-card/60 p-6 rounded-[24px] border-2 border-border group hover:border-primary/40 transition-all shadow-md active:scale-98">
                                                        <div className="w-3 h-3 rounded-full bg-primary group-hover:scale-150 transition-transform shadow-[0_0_10px_var(--primary-color)]" />
                                                        <p className="text-[11px] text-muted-foreground font-black uppercase tracking-[0.3em] font-sans leading-relaxed group-hover:text-foreground transition-colors">{b}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-10">
                                            <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 mb-4">
                                                <h3 className="font-black text-foreground uppercase italic text-3xl tracking-tighter font-[family-name:var(--font-orbitron)]">Validation Phase</h3>
                                                <div className="bg-background/60 px-8 py-4 rounded-[28px] border-2 border-border flex items-baseline gap-4 shadow-inner">
                                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.5em] opacity-50 italic">SYNC</span>
                                                    <span className="text-3xl font-black text-primary italic leading-none font-[family-name:var(--font-orbitron)]">{quizScore} / {lessonContent.quiz.length}</span>
                                                </div>
                                            </div>

                                            <div className="p-10 bg-primary/5 border-l-10 border-primary rounded-r-[32px] shadow-sm">
                                                <p className="text-2xl font-black text-foreground leading-relaxed italic tracking-tight">{lessonContent.quiz[currentQuestionIndex].question}</p>
                                            </div>

                                            <div className="grid gap-4 pt-4">
                                                {lessonContent.quiz[currentQuestionIndex].options.map((opt: string, i: number) => (
                                                    <Button
                                                        key={i}
                                                        onClick={() => handleAnswer(i)}
                                                        className="h-24 justify-start border-2 border-border bg-background/40 text-muted-foreground hover:bg-primary/10 hover:border-primary hover:text-foreground font-black text-xs uppercase tracking-[0.2em] rounded-[32px] transition-all relative overflow-hidden group shadow-lg border-b-8 border-black/10 active:translate-y-1 active:border-b-0 px-12"
                                                    >
                                                        <span className="mr-10 text-primary/20 group-hover:text-primary transition-colors italic font-black text-4xl font-[family-name:var(--font-orbitron)] leading-none">0{i + 1}</span>
                                                        <span className="truncate text-base font-sans tracking-widest">{opt}</span>
                                                    </Button>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-16 text-center animate-in zoom-in-95 duration-500">
                                        {quizScore === lessonContent.quiz.length ? (
                                            <>
                                                <div className="w-36 h-36 bg-emerald-500/10 rounded-[50px] flex items-center justify-center mb-12 border-2 border-emerald-500/20 shadow-[0_0_80px_rgba(16,185,129,0.2)] scale-110">
                                                    <Trophy className="w-20 h-20 text-emerald-500" />
                                                </div>
                                                <h3 className="text-7xl font-black text-foreground mb-6 uppercase italic tracking-tighter font-[family-name:var(--font-orbitron)] leading-none">Sync Perfect</h3>
                                                <p className="text-muted-foreground mb-16 font-black uppercase tracking-[0.5em] text-[11px] opacity-60">Neural link synchronized at 100.0%. Node verification successful.</p>
                                                <Button onClick={() => setIsDialogOpen(false)} className="h-28 px-20 rounded-[40px] bg-emerald-500 text-slate-950 font-black uppercase tracking-[0.4em] text-xl hover:bg-emerald-400 border-b-12 border-emerald-700 active:translate-y-1 active:border-b-0 transition-all w-full italic shadow-2xl font-[family-name:var(--font-orbitron)]">
                                                    Continue Mission
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <div className="w-36 h-36 bg-primary/10 rounded-[50px] flex items-center justify-center mb-12 border-2 border-primary/20 shadow-[0_0_80px_rgba(244,63,94,0.2)] scale-110">
                                                    <XCircle className="w-20 h-20 text-primary" />
                                                </div>
                                                <h3 className="text-7xl font-black text-foreground mb-6 uppercase italic tracking-tighter font-[family-name:var(--font-orbitron)] leading-none">Sync Failure</h3>
                                                <p className="text-muted-foreground mb-16 font-black uppercase tracking-[0.5em] text-[11px] opacity-60">Logical patterns mismatched. Interference detected in {lessonContent.quiz.length - quizScore} sector(s).</p>
                                                <Button onClick={() => {
                                                    setCurrentQuestionIndex(0)
                                                    setQuizScore(0)
                                                    setShowQuizResults(false)
                                                }} className="h-28 border-2 border-border bg-background/50 text-foreground w-full hover:bg-primary/10 hover:border-primary/50 font-black uppercase tracking-[0.4em] text-xl rounded-[40px] border-b-12 border-black/20 active:translate-y-1 active:border-b-0 transition-all italic shadow-2xl font-[family-name:var(--font-orbitron)]">
                                                    Restart Sequence
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-center py-28 group">
                                <div className="w-28 h-28 bg-destructive/10 rounded-[40px] flex items-center justify-center mx-auto mb-10 border-2 border-destructive/20 group-hover:scale-110 transition-transform">
                                    <XCircle className="text-destructive w-14 h-14" />
                                </div>
                                <p className="text-destructive font-black uppercase tracking-[0.5em] text-[12px] italic mb-4">Critical Error: Neural link severed</p>
                                <p className="text-muted-foreground font-black uppercase tracking-[0.3em] text-[10px] opacity-50">Failed to retrieve mission data from core registry.</p>
                                <Button onClick={() => setIsDialogOpen(false)} variant="outline" className="mt-12 h-16 rounded-[24px] px-12 font-black uppercase tracking-widest text-[10px] border-2 border-border hover:border-primary/40">Abort Protocol</Button>
                            </div>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
