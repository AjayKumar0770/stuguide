'use client'

import { SplineScene } from "@/components/ui/splite";
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
import { motion, AnimatePresence } from "framer-motion"

interface RobotInterfaceProps {
    message?: string;
    loading?: boolean;
}

export function RobotInterface({ message, loading }: RobotInterfaceProps) {
    return (
        <Card className="w-full h-[750px] bg-black/[0.96] relative overflow-hidden border-violet-500/20 shadow-2xl shadow-violet-500/10 group">
            <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="white"
            />

            {/* Background 3D Robot - Full width/height */}
            <div className="absolute inset-0 z-0">
                <SplineScene
                    scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                    className="w-full h-full"
                />
            </div>

            {/* Overlay content - Speech Bubble Area */}
            <div className="absolute inset-0 z-10 p-6 flex flex-col justify-end items-start bg-gradient-to-t from-black/80 via-transparent to-transparent">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <motion.div
                            key="loading"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="bg-violet-600/20 border-2 border-violet-500/50 backdrop-blur-md p-4 rounded-2xl shadow-[0_0_30px_rgba(139,92,246,0.2)] mb-4"
                        >
                            <div className="flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce" />
                                <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce [animation-delay:0.2s]" />
                                <div className="w-2 h-2 rounded-full bg-violet-400 animate-bounce [animation-delay:0.4s]" />
                            </div>
                            <p className="mt-2 text-violet-300 font-black uppercase tracking-widest text-[8px]">Analyzing neural patterns...</p>
                        </motion.div>
                    ) : message ? (
                        <motion.div
                            key="message"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -20 }}
                            className="bg-slate-900/60 border-2 border-violet-500/30 backdrop-blur-2xl p-8 rounded-[40px] w-full max-w-[550px] shadow-[0_0_50px_rgba(139,92,246,0.15)] group mb-4"
                        >
                            <div className="space-y-4 overflow-y-auto custom-scrollbar max-h-[300px] pr-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-violet-500 animate-pulse shadow-[0_0_10px_rgba(139,92,246,1)]" />
                                    <span className="text-[11px] font-black uppercase tracking-[0.4em] text-violet-400">Tactical Transmission</span>
                                </div>
                                <p className="text-xl md:text-2xl font-black italic leading-tight text-white font-[family-name:var(--font-orbitron)] tracking-tight">
                                    {message}
                                </p>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="default"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-2 mb-4"
                        >
                            <h3 className="text-2xl font-black italic tracking-tighter uppercase font-[family-name:var(--font-orbitron)] bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400">
                                Neuro-Link
                            </h3>
                            <p className="text-neutral-300 max-w-[200px] font-bold uppercase tracking-widest text-[8px] leading-relaxed opacity-60">
                                AI Scanning Active. Precision required.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </Card>
    )
}
