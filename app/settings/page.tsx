"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import {
    User, Bell, Shield,
    ChevronRight, Save, Loader2, Sparkles, Check
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BackButton } from "@/components/ui/back-button"
import { useTheme, Theme } from "@/context/ThemeContext"

const THEMES: { id: Theme; name: string; bg: string; primary: string }[] = [
    { id: "shadow-army", name: "Shadow Army", bg: "#0D0D0D", primary: "#663399" },
    { id: "architect", name: "Architect", bg: "#1A1B26", primary: "#7197A8" },
    { id: "red-gate", name: "Red Gate", bg: "#120A0A", primary: "#991B1B" },
    { id: "monarch-frost", name: "Monarch of Frost", bg: "#0B1215", primary: "#7DD3FC" },
    { id: "national-hunter", name: "National Hunter", bg: "#0F1115", primary: "#D4AF37" },
    { id: "glitch", name: "The Glitch", bg: "#FFFFFF", primary: "#0077FF" },
    { id: "void", name: "The Void", bg: "#000000", primary: "#FFFFFF" },
]

export default function SettingsPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const router = useRouter()
    const { theme: currentTheme, setTheme } = useTheme()

    useEffect(() => {
        const fetchProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                setName("Guest Player")
                setEmail("guest@sololeveling.io")
                setLoading(false)
                return
            }

            const { data, error } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", user.id)
                .single()

            if (data) {
                setName(data.full_name || "")
                setEmail(data.email || user.email || "")
            } else if (error && error.code === "PGRST116") {
                await supabase.from("profiles").insert([
                    { id: user.id, full_name: "Player One", email: user.email }
                ])
                setName("Player One")
                setEmail(user.email || "")
            }
            setLoading(false)
        }

        fetchProfile()
    }, [])

    const handleSave = async () => {
        setSaving(true)
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            const { error } = await supabase
                .from("profiles")
                .update({
                    full_name: name,
                    email: email,
                    updated_at: new Date().toISOString()
                })
                .eq("id", user.id)

            if (error) {
                alert("Failed to save changes: " + error.message)
            } else {
                alert("Settings Synchronized! 🚀")
            }
        }
        setSaving(false)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background text-foreground font-sans relative overflow-hidden transition-colors duration-700 p-6 md:p-12">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none -z-10">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent/10 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-4xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b-2 border-border pb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-5 h-5 text-primary fill-primary" />
                            <span className="text-xs font-black uppercase tracking-[0.3em] text-primary">Neural Config</span>
                        </div>
                        <h1 className="text-5xl font-black uppercase italic tracking-tighter text-foreground font-[family-name:var(--font-orbitron)] leading-none">System Settings</h1>
                        <p className="text-muted-foreground font-bold mt-2 uppercase text-xs tracking-widest leading-relaxed">Optimization of the player interface</p>
                    </div>
                    <div className="flex gap-4">
                        <BackButton href="/dashboard" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar Nav */}
                    <div className="space-y-4">
                        <Card className="bg-card border-border border-b-4 rounded-[30px] p-2 overflow-hidden shadow-xl">
                            <div className="flex flex-col">
                                {[
                                    { id: 'profile', name: 'Profile Protocol', icon: User },
                                    { id: 'theme', name: 'Neural Interface', icon: Sparkles },
                                    { id: 'notifications', name: 'Signal Alerts', icon: Bell },
                                    { id: 'security', name: 'Encryption Key', icon: Shield },
                                ].map((item) => (
                                    <button
                                        key={item.id}
                                        className="flex items-center gap-4 px-6 py-5 hover:bg-accent/50 transition-all font-black uppercase text-[10px] tracking-widest border-b-2 border-border/50 last:border-b-0 group"
                                    >
                                        <item.icon className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
                                        {item.name}
                                        <ChevronRight className="w-4 h-4 ml-auto text-muted-foreground opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Main Settings Area */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Profile Section */}
                        <Card className="bg-card border-border border-b-[10px] border-black/40 rounded-[40px] p-10 shadow-2xl backdrop-blur-xl">
                            <CardHeader className="p-0 mb-10">
                                <CardTitle className="text-2xl font-black uppercase italic italic tracking-tighter font-[family-name:var(--font-orbitron)] text-foreground flex items-center gap-4">
                                    <User className="w-7 h-7 text-primary" /> Profile Parameters
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 space-y-8">
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Display Designation</label>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="h-16 bg-background border-2 border-border rounded-2xl px-6 text-foreground font-bold focus-visible:ring-0 focus-visible:border-primary/50"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-2">Neural Email</label>
                                    <Input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="h-16 bg-background border-2 border-border rounded-2xl px-6 text-foreground font-bold focus-visible:ring-0 focus-visible:border-primary/50"
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Theme Section */}
                        <Card className="bg-card border-border border-b-[10px] border-black/40 rounded-[40px] p-10 shadow-2xl backdrop-blur-xl">
                            <CardHeader className="p-0 mb-10">
                                <CardTitle className="text-2xl font-black uppercase italic italic tracking-tighter font-[family-name:var(--font-orbitron)] text-foreground flex items-center gap-4">
                                    <Sparkles className="w-7 h-7 text-primary" /> Neural Interface Skin
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                                    {THEMES.map((t) => (
                                        <button
                                            key={t.id}
                                            onClick={() => setTheme(t.id)}
                                            className={`relative aspect-[4/3] rounded-3xl overflow-hidden border-4 transition-all group scale-100 active:scale-95 ${currentTheme === t.id ? 'border-primary ring-4 ring-primary/20' : 'border-border/50 hover:border-primary/30'}`}
                                            style={{ backgroundColor: t.bg }}
                                        >
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center">
                                                    <Check className="w-5 h-5 text-primary" />
                                                </div>
                                            </div>
                                            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-white">{t.name}</p>
                                            </div>
                                            <div
                                                className="absolute top-4 right-4 w-6 h-6 rounded-full border-2 border-white/20"
                                                style={{ backgroundColor: t.primary }}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Mission Controls */}
                        <Card className="bg-card border-border border-b-[10px] border-black/40 rounded-[40px] p-10 shadow-2xl backdrop-blur-xl">
                            <CardHeader className="p-0 mb-10">
                                <CardTitle className="text-2xl font-black uppercase italic italic tracking-tighter font-[family-name:var(--font-orbitron)] text-foreground flex items-center gap-4">
                                    <Shield className="w-7 h-7 text-primary" /> Mission Controls
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 space-y-8">
                                <div className="flex items-center justify-between p-5 bg-background rounded-2xl border border-border transition-colors hover:border-primary/50">
                                    <div className="space-y-1">
                                        <h4 className="font-black text-sm uppercase tracking-tight text-foreground">Email Briefings</h4>
                                        <p className="text-xs text-muted-foreground font-medium">Receive weekly progress reports via encrypted mail.</p>
                                    </div>
                                    <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                                </div>
                                <div className="flex items-center justify-between p-5 bg-background rounded-2xl border border-border transition-colors hover:border-primary/50">
                                    <div className="space-y-1">
                                        <h4 className="font-black text-sm uppercase tracking-tight text-foreground">Sound Effects</h4>
                                        <p className="text-xs text-muted-foreground font-medium">Enable tactile feedback during lessons.</p>
                                    </div>
                                    <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Actions */}
                        <div className="flex justify-end gap-6 pt-6">
                            <Button
                                variant="ghost"
                                onClick={() => router.back()}
                                className="h-16 px-10 rounded-2xl font-black uppercase tracking-widest text-xs text-muted-foreground hover:bg-accent"
                            >
                                Revert Changes
                            </Button>
                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="h-16 px-12 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-[0.2em] text-sm hover:bg-primary/90 border-b-8 border-primary/70 active:translate-y-1 active:border-b-0 transition-all italic flex items-center gap-3 shadow-lg"
                            >
                                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                Synchronize Data
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
