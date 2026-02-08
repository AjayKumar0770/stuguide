"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, ExternalLink, Clock, BookOpen, Wrench, Rocket } from "lucide-react"
import { motion } from "framer-motion"

interface RoadmapStep {
    title?: string
    tool?: string
    project_name?: string
    url?: string
    duration?: string
    purpose?: string
    install_guide?: string
    description?: string
    steps?: string[]
    deliverables?: string[]
}

interface RoadmapSectionProps {
    type: 'learn' | 'setup' | 'do'
    data: RoadmapStep[] | RoadmapStep
}

export default function RoadmapCard({ type, data }: RoadmapSectionProps) {
    const getIcon = () => {
        switch (type) {
            case 'learn': return <BookOpen className="w-6 h-6 text-blue-400" />
            case 'setup': return <Wrench className="w-6 h-6 text-amber-400" />
            case 'do': return <Rocket className="w-6 h-6 text-emerald-400" />
        }
    }

    const getTitle = () => {
        switch (type) {
            case 'learn': return "Phase 1: Knowledge Download"
            case 'setup': return "Phase 2: Environment Setup"
            case 'do': return "Phase 3: First Mission"
        }
    }

    const getGradient = () => {
        switch (type) {
            case 'learn': return "from-blue-500/20 to-cyan-500/20 border-blue-500/30"
            case 'setup': return "from-amber-500/20 to-orange-500/20 border-amber-500/30"
            case 'do': return "from-emerald-500/20 to-green-500/20 border-emerald-500/30"
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className={`bg-slate-900/50 backdrop-blur-md border ${getGradient()} h-full`}>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-slate-800`}>
                            {getIcon()}
                        </div>
                        <div>
                            <CardTitle className="text-white">{getTitle()}</CardTitle>
                            <CardDescription className="text-slate-400">
                                {type === 'learn' && "Foundational resources to start"}
                                {type === 'setup' && "Prepare your battlestation"}
                                {type === 'do' && "Apply knowledge immediately"}
                            </CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {/* LEARN SECTION */}
                        {type === 'learn' && Array.isArray(data) && data.map((item, idx) => (
                            <div key={idx} className="flex gap-3 items-start p-3 rounded-md hover:bg-white/5 transition-colors">
                                <CheckCircle2 className="w-5 h-5 text-slate-600 mt-1 shrink-0" />
                                <div>
                                    <h4 className="font-semibold text-blue-200 flex items-center gap-2">
                                        {item.title}
                                        {item.url && (
                                            <a href={item.url} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="w-3 h-3 text-slate-500 hover:text-white" />
                                            </a>
                                        )}
                                    </h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="outline" className="text-xs text-slate-400 border-slate-700">
                                            <Clock className="w-3 h-3 mr-1" /> {item.duration}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* SETUP SECTION */}
                        {type === 'setup' && Array.isArray(data) && data.map((item, idx) => (
                            <div key={idx} className="bg-slate-950/50 p-4 rounded-lg border border-slate-800">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-mono text-amber-300 font-bold">{item.tool}</span>
                                    <Badge variant="secondary" className="text-xs bg-slate-800">Required</Badge>
                                </div>
                                <p className="text-sm text-slate-400 mb-2">{item.purpose}</p>
                                <div className="bg-black/40 p-2 rounded text-xs font-mono text-slate-300">
                                    {`> ${item.install_guide}`}
                                </div>
                            </div>
                        ))}

                        {/* DO SECTION */}
                        {type === 'do' && !Array.isArray(data) && (
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xl font-bold text-emerald-300 mb-2">{data.project_name}</h3>
                                    <p className="text-slate-300 text-sm leading-relaxed">{data.description}</p>
                                </div>

                                <div className="space-y-2">
                                    <h4 className="text-sm font-semibold text-white uppercase tracking-wider">Mission Steps:</h4>
                                    {data.steps?.map((step, i) => (
                                        <div key={i} className="flex gap-2 items-start">
                                            <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded mt-0.5">{i + 1}</span>
                                            <span className="text-slate-300 text-sm">{step}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="pt-4 border-t border-slate-800">
                                    <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">Deliverables:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {data.deliverables?.map((del, i) => (
                                            <Badge key={i} className="bg-emerald-900/30 text-emerald-200 border-emerald-500/30">
                                                {del}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}
