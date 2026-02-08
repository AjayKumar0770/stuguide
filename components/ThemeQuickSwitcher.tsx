"use client"

import React from "react"
import { motion } from "framer-motion"
import { useTheme, Theme } from "@/context/ThemeContext"
import {
    Sparkles, Shield, Zap,
    Code, Palette, Terminal,
    Wand2, Sword, Target, Eye
} from "lucide-react"

const THEMES: { id: Theme; name: string; color: string; icon: any }[] = [
    { id: "shadow-army", name: "Shadow Army", color: "#663399", icon: Sword },
    { id: "architect", name: "Architect", color: "#7197A8", icon: Palette },
    { id: "red-gate", name: "Red Gate", color: "#991B1B", icon: Shield },
    { id: "monarch-frost", name: "Monarch of Frost", color: "#7DD3FC", icon: Zap },
    { id: "national-hunter", name: "National Hunter", color: "#D4AF37", icon: Target },
    { id: "glitch", name: "The Glitch", color: "#0077FF", icon: Code },
    { id: "void", name: "The Void", color: "#FFFFFF", icon: Eye },
]

export function ThemeQuickSwitcher() {
    const { theme: currentTheme, setTheme } = useTheme()
    const [hovered, setHovered] = React.useState<string | null>(null)

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
                <span className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground italic">Neural Interface</span>
                {hovered && (
                    <motion.span
                        initial={{ opacity: 0, x: 5 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-[9px] font-black uppercase tracking-widest text-primary italic"
                    >
                        {THEMES.find(t => t.id === hovered)?.name}
                    </motion.span>
                )}
            </div>
            <div className="flex flex-wrap items-center gap-2.5 p-3 bg-background/40 backdrop-blur-xl border border-border/50 rounded-2xl shadow-inner">
                {THEMES.map((t) => (
                    <motion.button
                        key={t.id}
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onMouseEnter={() => setHovered(t.id)}
                        onMouseLeave={() => setHovered(null)}
                        onClick={() => setTheme(t.id)}
                        className={`w-9 h-9 rounded-[10px] flex items-center justify-center transition-all relative group overflow-hidden ${currentTheme === t.id
                                ? 'shadow-lg shadow-primary/20'
                                : 'opacity-40 hover:opacity-100'
                            }`}
                        style={{
                            backgroundColor: t.id === 'glitch' ? '#F3F4F6' : t.color + '20',
                            border: currentTheme === t.id ? `2px solid ${t.color}` : '1px solid transparent'
                        }}
                    >
                        <t.icon
                            className={`w-4 h-4 transition-colors ${currentTheme === t.id ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'
                                }`}
                            style={currentTheme === t.id ? { color: t.color } : {}}
                        />
                        {currentTheme === t.id && (
                            <motion.div
                                layoutId="theme-active-dot"
                                className="absolute top-0.5 right-0.5 w-1.5 h-10 bg-white rounded-full"
                                style={{ backgroundColor: t.color, boxShadow: `0 0 10px ${t.color}`, width: '2px', height: '6px' }}
                            />
                        )}
                    </motion.button>
                ))}
            </div>
        </div>
    )
}
