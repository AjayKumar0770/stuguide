"use client"

import { motion } from "framer-motion"
import { ArrowDown } from "lucide-react"
import { Card } from "@/components/ui/card"

interface RoadmapItem {
    name: string
    color: string
    items: string[]
}

interface FlowchartProps {
    data: {
        pillars: RoadmapItem[]
    }
}

export default function FlowchartRoadmap({ data }: FlowchartProps) {
    const getColorClasses = (color: string) => {
        switch (color) {
            case 'yellow': return "bg-yellow-500 text-yellow-950 border-yellow-400"
            case 'blue': return "bg-blue-500 text-blue-50 border-blue-400"
            case 'green': return "bg-green-500 text-green-50 border-green-400"
            case 'red': return "bg-rose-500 text-rose-50 border-rose-400"
            default: return "bg-slate-700 text-slate-100 border-slate-600"
        }
    }

    const getItemColor = (color: string) => {
        switch (color) {
            case 'yellow': return "bg-yellow-400/10 text-yellow-200 border-yellow-500/50 hover:bg-yellow-400/20"
            case 'blue': return "bg-blue-400/10 text-blue-200 border-blue-500/50 hover:bg-blue-400/20"
            case 'green': return "bg-green-400/10 text-green-200 border-green-500/50 hover:bg-green-400/20"
            case 'red': return "bg-rose-400/10 text-rose-200 border-rose-500/50 hover:bg-rose-400/20"
            default: return "bg-slate-800 text-slate-300 border-slate-700"
        }
    }

    return (
        <div className="w-full overflow-x-auto pb-8">
            <div className="min-w-[800px] flex justify-center gap-8 md:gap-12 px-4">
                {data.pillars.map((pillar, colIndex) => (
                    <div key={colIndex} className="flex flex-col items-center gap-4 w-64">
                        {/* Column Header */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: colIndex * 0.1 }}
                            className={`w-full py-3 px-4 rounded-lg font-bold text-center border-b-4 shadow-lg ${getColorClasses(pillar.color)}`}
                        >
                            {pillar.name.toUpperCase()}
                        </motion.div>

                        {/* Items */}
                        <div className="relative flex flex-col items-center gap-6 w-full pt-4">
                            {/* Vertical Line */}
                            <div className={`absolute top-0 bottom-0 w-1 ${pillar.color === 'yellow' ? 'bg-yellow-500/20' : pillar.color === 'blue' ? 'bg-blue-500/20' : pillar.color === 'green' ? 'bg-green-500/20' : 'bg-slate-700'} -z-10`} />

                            {pillar.items.map((item, itemIndex) => (
                                <motion.div
                                    key={itemIndex}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: (colIndex * 0.1) + (itemIndex * 0.1) + 0.3 }}
                                    className="w-full flex flex-col items-center gap-2"
                                >
                                    {/* Arrow */}
                                    {itemIndex > 0 && (
                                        <ArrowDown className={`w-5 h-5 ${pillar.color === 'yellow' ? 'text-yellow-500' : pillar.color === 'blue' ? 'text-blue-500' : 'text-slate-500'}`} />
                                    )}

                                    {/* Node Box */}
                                    <div className={`w-full py-3 px-4 rounded-md border text-center font-semibold shadow-md backdrop-blur-sm transition-all duration-300 ${getItemColor(pillar.color)}`}>
                                        {item}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
