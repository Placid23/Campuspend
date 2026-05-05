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
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="relative flex flex-col items-center gap-12">
        <div className="relative group">
          {/* Rotating Rings */}
          <div className="absolute -inset-10 border border-primary/20 rounded-full animate-[spin_10s_linear_infinite]" />
          <div className="absolute -inset-14 border border-secondary/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
          
          {/* Logo Container - Enhanced visibility */}
          <div className="relative w-36 h-36 md:w-48 md:h-48 flex items-center justify-center bg-card/80 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-2xl overflow-hidden animate-float">
            <div className="relative w-full h-full scale-125 transition-transform duration-1000 p-6">
              <Image 
                src="/logo.png" 
                alt="CafePay Logo" 
                fill
                className="object-contain drop-shadow-[0_0_20px_rgba(239,26,184,0.5)]"
                priority
              />
            </div>
            {/* Holographic Scan Line */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/10 to-transparent h-1/2 w-full animate-energy-beam pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 text-center">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-headline font-bold tracking-tight">
              CafePay <span className="text-primary neon-text-glow">Wallet</span>
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-muted-foreground/60 animate-pulse">
              {subtext}
            </p>
          </div>

          <div className="w-56 h-1 bg-muted rounded-full overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary w-full animate-energy-beam" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 text-[9px] font-bold uppercase tracking-widest text-muted-foreground/40">
        AI DECISION TREE PROTOCOL V3.0
      </div>
    </div>
  )
}