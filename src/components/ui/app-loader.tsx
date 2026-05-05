
"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface AppLoaderProps {
  message?: string;
}

export function AppLoader({ message = "Initializing CafePay AI Engine..." }: AppLoaderProps) {
  const [subtext, setSubtext] = React.useState(message)
  
  React.useEffect(() => {
    const messages = [
      "Calibrating Decision Trees...",
      "Mapping Purchase-Based Logs...",
      "Connecting to Financial Gateway...",
      "Scanning Behavioral Nodes...",
      "Authenticating Secure Session...",
    ]
    let i = 0
    const interval = setInterval(() => {
      setSubtext(messages[i % messages.length])
      i++
    }, 1800)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background">
      {/* Animated Aura */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/10 blur-[150px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="relative flex flex-col items-center gap-16">
        <div className="relative group">
          {/* Rotating Rings */}
          <div className="absolute -inset-16 border-2 border-primary/20 border-dashed rounded-full animate-[spin_15s_linear_infinite]" />
          <div className="absolute -inset-20 border border-secondary/10 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
          
          {/* Logo Container - Enhanced visibility */}
          <div className="relative w-48 h-48 md:w-64 md:h-56 flex items-center justify-center bg-card/80 backdrop-blur-2xl border-2 border-white/20 rounded-[3rem] shadow-[0_0_80px_rgba(239,26,184,0.2)] overflow-hidden animate-float">
            <div className="relative w-full h-full p-8 scale-150 transition-transform duration-1000">
              <Image 
                src="/logo.png" 
                alt="CafePay Logo" 
                fill
                className="object-contain drop-shadow-[0_0_30px_rgba(239,26,184,0.8)]"
                priority
              />
            </div>
            {/* Holographic Scan Line */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/20 to-transparent h-1/2 w-full animate-energy-beam pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl md:text-5xl font-headline font-bold tracking-tighter">
              CafePay <span className="text-primary neon-text-glow">Wallet</span>
            </h2>
            <p className="text-[12px] font-bold uppercase tracking-[0.6em] text-muted-foreground/60 animate-pulse h-4">
              {subtext}
            </p>
          </div>

          <div className="w-64 h-1.5 bg-muted rounded-full overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary w-full animate-energy-beam" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/30">
        AI DECISION TREE PROTOCOL V4.1 • SECURE SESSION
      </div>
    </div>
  )
}
