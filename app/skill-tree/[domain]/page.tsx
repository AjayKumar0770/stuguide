"use client"

import { useEffect } from "react"
import { useRouter, useParams } from "next/navigation"

export default function SkillTreeDomainRedirect() {
    const router = useRouter()
    const params = useParams()
    const domain = params?.domain

    useEffect(() => {
        if (domain) {
            router.push(`/roadmap/${domain}`)
        } else {
            router.push("/roadmap")
        }
    }, [router, domain])

    return null
}
