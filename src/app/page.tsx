
import Link from 'next/link';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { ArrowRight, Zap, Shield, ShoppingBag, BrainCircuit, CreditCard } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen nebula-bg">
      {/* Navbar with Safe Area Support */}
      <nav className="fixed top-0 w-full z-50 glass-morphism border-b-0 pt-[calc(1rem+env(safe-area-inset-top,0px))] pb-4 px-6 md:px-12 flex justify-between items-center bg-background/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(239,26,184,0.5)]">
            <CreditCard className="text-white w-5 h-5" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tighter">CafePay Wallet</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">Features</Link>
          <Link href="/dashboard" className="text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="hidden sm:inline-flex">Sign In</Button>
          </Link>
          <Link href="/register">
            <Button className="glow-button rounded-full px-6 bg-primary hover:bg-primary/90">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Intelligent Campus Finance
            </div>
            <h1 className="text-5xl md:text-7xl font-headline font-bold leading-tight">
              Smart Student <span className="text-primary neon-text-glow">Spending.</span><br />
              Simplified <span className="text-secondary">Living.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed">
              Experience the luxury of automated expense tracking and Decision Tree-powered financial wisdom designed specifically for the modern student.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/dashboard">
                <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(239,26,184,0.3)]">
                  Launch Wallet <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative animate-in fade-in zoom-in duration-1000 delay-300">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl opacity-30 animate-pulse"></div>
            <GlassCard className="relative z-10 p-2 overflow-hidden bg-white/5 border-white/5">
              <Image 
                src="https://picsum.photos/seed/cafepay-dash/1200/800" 
                alt="CafePay Dashboard" 
                width={1200} 
                height={800} 
                className="rounded-2xl"
                priority
                data-ai-hint="dashboard mobile"
              />
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-5xl font-headline font-bold">The CafePay AI Engine</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Our proprietary decision tree analysis converts every purchase log into actionable financial growth.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
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
              <GlassCard key={i} className="group">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-headline font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-white/5 bg-card/20 pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-20">
        <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-xs text-muted-foreground">
          © 2024 CafePay Wallet. Designed for the futuristic campus.
        </div>
      </footer>
    </div>
  );
}
