"use client"

import React, { createContext, useContext, useEffect, useState } from "react"

export type Theme =
    | "shadow-army"
    | "architect"
    | "red-gate"
    | "monarch-frost"
    | "national-hunter"
    | "glitch"
    | "void"

interface ThemeContextType {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setThemeState] = useState<Theme>("shadow-army")
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") as Theme || "shadow-army"
        setThemeState(savedTheme)
        if (typeof document !== 'undefined') {
            document.documentElement.setAttribute("data-theme", savedTheme)
        }
        setMounted(true)
    }, [])

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme)
        localStorage.setItem("theme", newTheme)
        if (typeof document !== 'undefined') {
            document.documentElement.setAttribute("data-theme", newTheme)
            document.body.setAttribute("data-theme", newTheme)
        }
    }

    if (!mounted) {
        return <>{children}</>
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            <div data-theme={theme} className="contents transition-colors duration-700">
                {children}
            </div>
        </ThemeContext.Provider>
    )
}

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider")
    }
    return context
}
