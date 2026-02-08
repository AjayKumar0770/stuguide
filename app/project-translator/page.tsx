"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, Wand2, ArrowRight, CheckCircle2, Copy, AlertCircle } from "lucide-react"
import Script from "next/script"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { BackButton } from "@/components/ui/back-button"

export default function ProjectTranslatorPage() {
    const [projectDesc, setProjectDesc] = useState("")
    const [jobDesc, setJobDesc] = useState("")
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [puterLoaded, setPuterLoaded] = useState(false)

    // Check if Puter is already loaded
    useEffect(() => {
        if ((window as any).puter) {
            setPuterLoaded(true)
        }
    }, [])

    const handleOptimize = async () => {
        if (!projectDesc || !jobDesc) {
            alert("Please enter both your project description and the target JD.")
            return
        }

        setLoading(true)
        setResult(null)

        try {
            if (!(window as any).puter) {
                alert("Puter AI library not loaded. Please refresh.")
                setLoading(false)
                return
            }

            const prompt = [
                {
                    role: "system",
                    content: `You are an expert Technical Resume Writer and ATS Optimization Specialist.
                    Your goal is to rewrite a candidate's project description so it resonates perfectly with a specific Job Description (JD).
                    
                    Follow these rules:
                    1. Analyze the JD for high-value keywords (skills, tools, methodologies).
                    2. Rewrite the Project Description to naturally incorporate these keywords.
                    3. Use the "X-Y-Z" formula: "Accomplished [X] as measured by [Y], by doing [Z]".
                    4. Suggest specific metrics if they are vague (e.g., "Reduced latency by 40%").
                    5. Keep it concise (3-4 bullet points max) but impactful.
                    
                    Return strictly valid JSON:
                    {
                        "optimized_content": "Bullet 1\\nBullet 2\\nBullet 3",
                        "keywords_added": ["React", "AWS", "CI/CD"],
                        "missing_skills_warning": "The JD asks for 'Kubernetes' which was not found in your project."
                    }`
                },
                {
                    role: "user",
                    content: `Project Description:\n"${projectDesc}"\n\nTarget Job Description:\n"${jobDesc}"`
                }
            ]

            const response = await (window as any).puter.ai.chat(prompt, { model: 'gemini-3-pro-preview' })
            const text = response?.message?.content || response?.text || ""
            const cleanJson = text.replace(/```json/g, '').replace(/```/g, '').trim()

            try {
                const json = JSON.parse(cleanJson)
                setResult(json)
            } catch (e) {
                console.error("JSON Parse Error", e)
                // Fallback for non-JSON response
                setResult({
                    optimized_content: text,
                    keywords_added: [],
                    missing_skills_warning: "Could not parse structured data."
                })
            }

        } catch (error) {
            console.error("Optimization failed", error)
            alert("AI Optimization failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    const copyToClipboard = () => {
        if (result?.optimized_content) {
            navigator.clipboard.writeText(result.optimized_content)
            alert("Copied to clipboard!")
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white p-6 relative overflow-hidden">
            {!puterLoaded && <Script src="https://js.puter.com/v2/" onLoad={() => setPuterLoaded(true)} />}

            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-violet-600/20 rounded-full blur-3xl opacity-50" />
                <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl opacity-50" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <BackButton href="/dashboard" />
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                            Project-to-JD Translator
                        </h1>
                        <p className="text-slate-200 font-medium mt-1">
                            Tailor your experience to beat the ATS and impress recruiters.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="space-y-6">
                        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="text-white text-lg font-black uppercase tracking-tight">Your Current Project</CardTitle>
                                <CardDescription className="text-slate-300 font-medium">Paste the description from your resume or GitHub.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    className="h-48 bg-slate-950 border-slate-800 text-slate-200 focus-visible:ring-emerald-500"
                                    placeholder="e.g. Built a task management app using React and Node.js. Implemented database with MongoDB..."
                                    value={projectDesc}
                                    onChange={(e) => setProjectDesc(e.target.value)}
                                />
                            </CardContent>
                        </Card>

                        <Card className="bg-slate-900/50 border-slate-800 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="text-white text-lg font-black uppercase tracking-tight">Target Job Description</CardTitle>
                                <CardDescription className="text-slate-300 font-medium">Paste the Requirements/Responsibilities section.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Textarea
                                    className="h-48 bg-slate-950 border-slate-800 text-white font-medium focus-visible:ring-cyan-500 placeholder:text-slate-600"
                                    placeholder="e.g. Looking for a Full Stack Engineer..."
                                    value={jobDesc}
                                    onChange={(e) => setJobDesc(e.target.value)}
                                />
                            </CardContent>
                        </Card>

                        <Button
                            className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 shadow-lg shadow-emerald-500/20 transition-all"
                            onClick={handleOptimize}
                            disabled={loading || !projectDesc || !jobDesc}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                    Optimizing with Gemini 3 Pro...
                                </>
                            ) : (
                                <>
                                    <Wand2 className="w-5 h-5 mr-2" />
                                    Translate & Optimize
                                </>
                            )}
                        </Button>
                    </div>

                    {/* Output Section */}
                    <div className="relative">
                        {result ? (
                            <Card className="bg-slate-900 border-emerald-500/30 shadow-2xl shadow-emerald-500/10 h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <CardHeader className="bg-emerald-500/5 border-b border-emerald-500/10">
                                    <div className="flex justify-between items-center">
                                        <CardTitle className="text-emerald-400 flex items-center gap-2">
                                            <CheckCircle2 className="w-5 h-5" /> Optimized Description
                                        </CardTitle>
                                        <Button variant="ghost" size="sm" onClick={copyToClipboard} className="text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300">
                                            <Copy className="w-4 h-4 mr-2" /> Copy
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6 flex-1 space-y-6">
                                    <div className="prose prose-invert max-w-none">
                                        <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 text-white leading-relaxed font-bold shadow-inner whitespace-pre-wrap">
                                            {result.optimized_content}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-sm font-black text-slate-100 uppercase tracking-widest mb-3">Keywords Integrated</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {result.keywords_added?.map((kw: string, i: number) => (
                                                <span key={i} className="bg-emerald-500/20 text-emerald-200 px-3 py-1 rounded-full text-xs font-black border border-emerald-500/40">
                                                    {kw}
                                                </span>
                                            ))}
                                            {(!result.keywords_added || result.keywords_added.length === 0) && (
                                                <span className="text-slate-300 text-sm font-bold">No specific keywords detected.</span>
                                            )}
                                        </div>
                                    </div>

                                    {result.missing_skills_warning && (
                                        <Alert className="bg-amber-500/10 border-amber-500/30">
                                            <AlertCircle className="h-4 w-4 text-amber-500" />
                                            <AlertTitle className="text-amber-500 mb-1">Gap Analysis</AlertTitle>
                                            <AlertDescription className="text-amber-200/80 text-sm">
                                                {result.missing_skills_warning}
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/30 text-slate-300">
                                <ArrowRight className="w-12 h-12 mb-4 opacity-40 text-emerald-400" />
                                <h3 className="text-xl font-black uppercase italic mb-2 text-white">Ready to Translate</h3>
                                <p className="max-w-md font-medium text-slate-200">
                                    Paste your details on the left and click "Translate" to see how AI can rewrite your experience to match the job.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
