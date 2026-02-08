"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
    Trophy, Medal, Star, TrendingUp,
    ChevronRight, ArrowUp, ArrowDown,
    Flame, Loader2, Sparkles, User, Sword
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase/client"
import Link from "next/link"
import { BackButton } from "@/components/ui/back-button"

export const dynamic = 'force-dynamic'

export default function LeaderboardPage() {
    const [players, setPlayers] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState<any>(null)

    useEffect(() => {
        const fetchLeaderboard = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            const { data: ranks } = await supabase
                .from("profiles")
                .select("*")
                .order("xp", { ascending: false })
                .limit(20)

            if (ranks) {
                setPlayers(ranks)
                if (user) {
                    const current = ranks.find((p: any) => p.id === user.id)
                    setCurrentUser(current)
                }
            }
            setLoading(false)
        }

        fetchLeaderboard()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans p-6 md:p-12 relative overflow-hidden transition-colors duration-500">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]" />
                <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5" />
            </div>

            <div className="max-w-4xl mx-auto space-y-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b-2 border-border pb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Trophy className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-yellow-400">Eternal Rankings</span>
                        </div>
                        <h1 className="text-5xl font-black uppercase italic tracking-tighter text-foreground font-[family-name:var(--font-orbitron)] leading-none">World Leaderboard</h1>
                        <p className="text-muted-foreground font-bold mt-2 uppercase text-xs tracking-widest leading-relaxed">Only the strongest survive the climb</p>
                    </div>
                    <div className="flex gap-4">
                        <BackButton href="/dashboard" />
                    </div>
                </div>

                {/* Podium Top 3 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end pt-10 px-4">
                    {/* 2nd Place */}
                    <PodiumCard rank={2} player={players[1]} color="slate-400" />
                    {/* 1st Place */}
                    <PodiumCard rank={1} player={players[0]} color="yellow-400" featured />
                    {/* 3rd Place */}
                    <PodiumCard rank={3} player={players[2]} color="orange-600" />
                </div>

                {/* List View */}
                <div className="space-y-4">
                    <div className="flex px-8 text-[10px] font-black uppercase text-muted-foreground tracking-widest">
                        <span className="w-12">Rank</span>
                        <span className="flex-1">Player</span>
                        <span className="w-24 text-center">Level</span>
                        <span className="w-32 text-right">Total XP</span>
                    </div>

                    <div className="space-y-2">
                        {players.slice(3).map((player, i) => (
                            <motion.div
                                key={player.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className={`flex items-center gap-4 p-4 px-8 rounded-2xl border-2 border-transparent transition-all hover:bg-accent cursor-pointer ${player.id === currentUser?.id ? 'bg-primary/20 border-primary/30' : 'bg-card/50 border-border/50'}`}
                            >
                                <span className="w-8 font-black text-slate-500 italic text-lg">{i + 4}</span>
                                <div className="flex-1 flex items-center gap-4">
                                    <Avatar className="w-10 h-10 border-2 border-border">
                                        <AvatarImage src={player.avatar_url} />
                                        <AvatarFallback className="bg-accent text-xs font-black">{player.full_name?.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-black text-foreground text-sm uppercase italic tracking-tight">{player.full_name}</p>
                                        <div className="flex items-center gap-2">
                                            <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                                            <span className="text-[10px] font-bold text-slate-400">{player.streak || 0} DAY STREAK</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-24 text-center">
                                    <Badge variant="outline" className="border-border text-foreground font-black">Lvl {player.level || 1}</Badge>
                                </div>
                                <div className="w-32 text-right">
                                    <span className="font-black text-primary italic">{(player.xp || 0).toLocaleString()} <span className="text-[10px] uppercase ml-1">XP</span></span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Personal Rank Sticky */}
                {currentUser && (
                    <div className="sticky bottom-6 p-6 bg-primary rounded-[30px] border-b-8 border-black/20 shadow-2xl flex items-center justify-between translate-y-2">
                        <div className="flex items-center gap-6">
                            <div className="w-14 h-14 rounded-full bg-background flex items-center justify-center font-black text-primary text-xl italic shadow-inner">
                                #{players.findIndex(p => p.id === currentUser.id) + 1}
                            </div>
                            <div>
                                <h4 className="text-primary-foreground font-black uppercase text-xl italic leading-none">Your Standing</h4>
                                <p className="text-primary-foreground/70 text-xs font-bold uppercase tracking-widest mt-1">Keep training to breach the top 10</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-2xl font-black text-primary-foreground italic">{(currentUser.xp || 0).toLocaleString()} XP</div>
                            <Link href="/dashboard">
                                <span className="text-[10px] font-black uppercase text-primary-foreground/80 tracking-[0.2em] flex items-center justify-end gap-1 hover:text-primary-foreground cursor-pointer transition-colors">Go to Dashboard <ChevronRight className="w-3 h-3" /></span>
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function PodiumCard({ rank, player, color, featured = false }: { rank: number, player: any, color: string, featured?: boolean }) {
    if (!player) return <div className="h-40" />

    const icon = rank === 1 ? <Medal className="w-8 h-8 text-yellow-400" /> : rank === 2 ? <Star className="w-6 h-6 text-slate-400" /> : <Sword className="w-6 h-6 text-orange-600" />

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: rank * 0.1 }}
            className={`flex flex-col items-center group ${featured ? 'mb-10' : ''}`}
        >
            <div className={`relative ${featured ? 'w-32 h-32' : 'w-24 h-24'} mb-4`}>
                <Avatar className={`w-full h-full border-4 border-${color} shadow-[0_0_20px_rgba(var(--${color}),0.3)] group-hover:scale-105 transition-transform`}>
                    <AvatarImage src={player.avatar_url} />
                    <AvatarFallback className="bg-slate-900 text-2xl font-black uppercase">{player.full_name?.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-slate-900 border-2 border-slate-800 flex items-center justify-center shadow-lg`}>
                    {icon}
                </div>
            </div>
            <div className="text-center">
                <p className={`font-black uppercase italic ${featured ? 'text-xl' : 'text-sm'} text-foreground font-[family-name:var(--font-orbitron)]`}>{player.full_name}</p>
                <p className="font-black text-primary italic text-xs leading-none">{(player.xp || 0).toLocaleString()} XP</p>
            </div>
            <div className={`mt-4 w-full h-2 rounded-full bg-slate-800 overflow-hidden`}>
                <div className={`h-full bg-${color === 'yellow-400' ? 'yellow-500' : color === 'slate-400' ? 'slate-500' : 'orange-500'}`} style={{ width: '100%' }} />
            </div>
        </motion.div>
    )
}
