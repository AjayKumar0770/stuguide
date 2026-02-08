"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function SkillTreeRedirect() {
    const router = useRouter()

    useEffect(() => {
        // Since skill tree requires a domain, redirecting to the roadmap selection page
        // is the best UX if someone lands here directly.
        router.push("/roadmap")
    }, [router])

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )
}
