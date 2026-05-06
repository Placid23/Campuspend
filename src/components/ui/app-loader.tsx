"use client"

import * as React from "react"
import Image from "next/image"

interface AppLoaderProps {
  message?: string;
}

export function AppLoader({ message = "Initializing CafePay Engine..." }: AppLoaderProps) {
  const [subtext, setSubtext] = React.useState(message)
  
  React.useEffect(() => {
    const messages = [
      "Calibrating Decision Trees...",
      "Mapping Purchase Logs...",
      "Connecting Gateway...",
      "Scanning Behavioral Nodes...",
      "Authenticating Protocol...",
    ]
    let i = 0
    const interval = setInterval(() => {
      setSubtext(messages[i % messages.length])
      i++
    }, 1500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background nebula-bg">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-primary/5 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/5 blur-[150px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="relative flex flex-col items-center gap-12">
        <div className="relative group">
          <div className="absolute -inset-12 border-2 border-white/5 border-dashed rounded-full animate-[spin_20s_linear_infinite]" />
          
          <div className="relative w-56 h-56 md:w-72 md:h-72 flex items-center justify-center bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[4rem] shadow-[0_0_100px_rgba(255,255,255,0.05)] overflow-hidden animate-float">
            <div className="relative w-full h-full p-8 transition-transform duration-1000">
              <Image 
                src="/logo.png" 
                alt="CafePay Logo" 
                fill
                className="object-contain drop-shadow-2xl scale-125"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-full w-full animate-energy-beam pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-6 text-center">
          <div className="space-y-3">
            <h2 className="text-3xl md:text-5xl font-headline font-bold tracking-tighter">
              CafePay <span className="text-primary neon-text-glow">Wallet</span>
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.6em] text-primary/60 animate-pulse h-4 min-w-[280px]">
              {subtext}
            </p>
          </div>

          <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary w-full animate-energy-beam" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/20">
        SECURE ACADEMIC INFRASTRUCTURE V4.1
      </div>
    </div>
  )
}
