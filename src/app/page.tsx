"use client"

import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { ArrowRight, Zap, Shield, ShoppingBag, BrainCircuit, ShieldCheck, ChevronRight } from "lucide-react";
import { PWAHandler } from "@/components/pwa/PWAHandler";
import { useUser } from "@/firebase";
import { AppLoader } from "@/components/ui/app-loader";

export default function LandingPage() {
  const { isUserLoading } = useUser();

  if (isUserLoading) {
    return <AppLoader message="Initializing CafePay Engine..." />;
  }

  return (
    <div className="min-h-screen nebula-bg">
      {/* Creative Floating Pill Navbar */}
      <div className="fixed top-0 w-full z-50 px-4 md:px-8 pt-4 md:pt-6 pointer-events-none">
        <nav className="max-w-7xl mx-auto h-16 md:h-20 glass-morphism rounded-[2rem] md:rounded-full flex items-center justify-between px-4 md:px-8 border-white/10 bg-background/40 backdrop-blur-2xl pointer-events-auto shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 opacity-50 group-hover:opacity-100 transition-opacity duration-1000"></div>
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 flex items-center justify-center shadow-inner relative overflow-hidden border border-white/10 p-0.5">
              <Image src="/logo.png" alt="Logo" width={48} height={48} className="object-contain scale-125" />
            </div>
            <span className="font-headline font-bold text-lg md:text-2xl tracking-tighter hidden xs:block">CafePay</span>
          </div>

          <div className="hidden lg:flex items-center gap-8 relative z-10">
            <Link href="#features" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">Features</Link>
            <Link href="/dashboard" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">Launch</Link>
          </div>

          <div className="flex items-center gap-2 md:gap-4 relative z-10">
            <PWAHandler />
            <Link href="/register">
              <Button className="glow-button rounded-full px-4 md:px-8 bg-primary hover:bg-primary/90 font-bold uppercase tracking-widest text-[9px] md:text-xs h-10 md:h-12 border-none">
                <span className="hidden sm:inline">Get Started</span>
                <span className="sm:hidden">Join</span>
              </Button>
            </Link>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="pt-40 md:pt-56 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10 animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold tracking-widest uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Intelligent Campus Finance
            </div>
            <h1 className="text-5xl md:text-8xl font-headline font-bold leading-[0.9] tracking-tighter">
              Smart Student <span className="text-primary neon-text-glow">Spending.</span><br />
              <span className="text-secondary">Simplified.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed font-medium">
              Automated expense tracking and Decision Tree-powered financial wisdom designed specifically for the modern academic lifestyle.
            </p>
            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/dashboard">
                <Button size="lg" className="rounded-2xl px-10 h-16 bg-primary hover:bg-primary/90 shadow-[0_0_30px_rgba(239,26,184,0.4)] text-lg font-bold">
                  Launch Wallet <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative animate-in fade-in zoom-in duration-1000 delay-300">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 blur-[100px] opacity-40 animate-pulse"></div>
            <GlassCard className="relative z-10 p-3 overflow-hidden bg-white/5 border-white/10 rounded-[2.5rem]">
              <div className="relative aspect-[12/8] rounded-[2rem] overflow-hidden">
                <Image 
                  src="https://picsum.photos/seed/cafepay-dash/1200/800" 
                  alt="CafePay Dashboard" 
                  fill
                  className="object-cover"
                  priority
                  data-ai-hint="dashboard futuristic"
                />
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-6">
            <h2 className="text-4xl md:text-6xl font-headline font-bold tracking-tight">The CafePay <span className="text-primary">AI Engine</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg font-medium leading-relaxed">Our proprietary decision tree analysis converts every purchase log into actionable financial growth strategy.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { 
                icon: ShoppingBag, 
                title: 'Purchase Logging', 
                desc: 'Real-time transaction capture from campus vendors. Every kobo is accounted for automatically.' 
              },
              { 
                icon: BrainCircuit, 
                title: 'Decision Tree Analysis', 
                desc: 'Intelligent spending classification that identifies financial leakage and suggests tactical corrections.' 
              },
              { 
                icon: Shield, 
                title: 'Secure Wallet', 
                desc: 'Your funds are protected with bank-grade Firebase infrastructure and role-based authorization.' 
              }
            ].map((feature, i) => (
              <GlassCard key={i} className="group p-10 border-white/5 hover:border-primary/20 transition-all duration-700">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                  <feature.icon className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-headline font-bold mb-4 tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed font-medium">{feature.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-card/20 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-24">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center p-1 border border-white/10">
                 <Image src="/logo.png" alt="Logo" width={48} height={48} className="object-contain scale-125" />
              </div>
              <span className="font-headline font-bold text-2xl tracking-tighter">CafePay Wallet</span>
           </div>
           <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.3em]">
             © 2024 CafePay Wallet. Engineered for Academic Excellence.
           </p>
        </div>
      </footer>
    </div>
  );
}
