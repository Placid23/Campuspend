
"use client"

import * as React from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface AppLoaderProps {
  message?: string;
}

export function AppLoader({ message = "Initializing CafePay AI Engine..." }: AppLoaderProps) {
  const [subtext, setSubtext] = React.useState(message)
  
  // Rotating status messages for that "Intelligent Engine" feel
  React.useEffect(() => {
    const messages = [
      "Syncing Secure Wallet...",
      "Calibrating Decision Trees...",
      "Loading Purchase Logs...",
      "Connecting to Campus Gateway...",
      "Authenticating Biometrics...",
    ]
    let i = 0
    const interval = setInterval(() => {
      setSubtext(messages[i % messages.length])
      i++
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0D080E]">
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="relative flex flex-col items-center gap-12">
        {/* Logo Container with "Mind-Blowing" Animations */}
        <div className="relative group">
          {/* Outer Rotating Ring */}
          <div className="absolute -inset-8 border border-primary/20 rounded-full animate-[spin_10s_linear_infinite]" />
          <div className="absolute -inset-12 border border-secondary/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
          
          {/* Glowing Aura */}
          <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-1000 animate-pulse" />
          
          {/* The Logo */}
          <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-float">
            <Image 
              src="/logo.png" 
              alt="CafePay Logo" 
              width={160} 
              height={160} 
              className="p-4 object-contain drop-shadow-[0_0_15px_rgba(239,26,184,0.6)]"
              priority
            />
            {/* Holographic Scan Line */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/20 to-transparent h-1/2 w-full animate-energy-beam pointer-events-none" />
          </div>
        </div>

        {/* Text and Progress */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="space-y-1">
            <h2 className="text-xl md:text-2xl font-headline font-bold text-white tracking-tight flex items-center gap-3">
              CafePay <span className="text-primary neon-text-glow">Wallet</span>
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/60 animate-pulse">
              {subtext}
            </p>
          </div>

          {/* Sleek Progress Bar */}
          <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary w-full animate-energy-beam" />
          </div>
        </div>
      </div>

      {/* Version Tag */}
      <div className="absolute bottom-12 text-[8px] font-bold uppercase tracking-widest text-muted-foreground/20">
        v2.5.0 // Secure Academic Protocol
      </div>
    </div>
  )
}
