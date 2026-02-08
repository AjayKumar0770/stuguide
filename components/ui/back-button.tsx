'use client'

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "./button"
import { cn } from "@/lib/utils"

interface BackButtonProps {
    className?: string
    variant?: "default" | "outline" | "ghost" | "secondary" | "destructive" | "link"
    href?: string
}

export function BackButton({ className, variant = "ghost", href }: BackButtonProps) {
    const router = useRouter()

    const handleBack = () => {
        if (href) {
            router.push(href)
        } else {
            router.back()
        }
    }

    return (
        <Button
            onClick={handleBack}
            variant={variant}
            className={cn(
                "group flex items-center gap-3 font-black uppercase tracking-widest text-[10px] text-slate-500 hover:text-white transition-all bg-transparent border-none p-0 h-auto",
                className
            )}
        >
            <div className="w-10 h-10 rounded-xl bg-slate-900 border-2 border-slate-800 flex items-center justify-center group-hover:border-violet-500/50 group-hover:bg-violet-500/10 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all">
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            </div>
            <span className="italic group-hover:translate-x-1 transition-transform tracking-[0.2em]">Go Back</span>
        </Button>
    )
}
