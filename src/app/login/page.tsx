
"use client"

import Link from 'next/link'
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { 
  Zap, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ShieldCheck
} from "lucide-react"

// Social Icons as SVGs for high fidelity
const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
)

const FacebookIcon = () => (
  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

const AppleIcon = () => (
  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
  </svg>
)

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen nebula-bg flex flex-col">
      {/* Header Navigation */}
      <nav className="w-full z-50 py-6 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(239,26,184,0.5)]">
            <Zap className="text-white w-5 h-5" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tighter">CampusSpend</span>
        </div>
        <div className="hidden md:flex items-center gap-10">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>
          <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">How it Works</Link>
          <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">Vendors</Link>
          <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">Features</Link>
          <Link href="#" className="text-sm font-medium hover:text-primary transition-colors">About</Link>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="text-sm font-medium px-6 border border-white/10 rounded-full hover:bg-white/5">Log in</Button>
          <Button className="glow-button rounded-full px-8 bg-gradient-to-r from-primary to-secondary hover:opacity-90">Get Started</Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Side: Welcome Text & Social Login */}
          <div className="space-y-10 animate-in fade-in slide-in-from-left duration-700">
            <div className="space-y-6">
              <h1 className="text-5xl font-headline font-bold leading-tight">
                Welcome <span className="text-primary neon-text-glow">Back!</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                Log in to continue ordering and tracking your campus spending.
              </p>
              <p className="text-sm text-muted-foreground/80 max-w-md leading-relaxed border-l-2 border-primary/30 pl-4 py-1">
                The all-in-one campus marketplace where you can buy from trusted vendors and automatically track your expenses. Every order is logged; analyzed.
              </p>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <div className="h-[1px] flex-1 bg-white/10"></div>
                <span>Don't have an account?</span>
                <div className="h-[1px] flex-1 bg-white/10"></div>
              </div>
              
              <Button variant="outline" className="w-full h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all justify-start px-8">
                <GoogleIcon />
                <span className="text-base font-medium">Continue with Google</span>
              </Button>
              <Button variant="outline" className="w-full h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all justify-start px-8">
                <FacebookIcon />
                <span className="text-base font-medium">Continue with Facebook</span>
              </Button>
              <Button variant="outline" className="w-full h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all justify-start px-8">
                <AppleIcon />
                <span className="text-base font-medium">Continue with Apple</span>
              </Button>
            </div>
          </div>

          {/* Right Side: Login Form Card */}
          <div className="relative animate-in fade-in slide-in-from-right duration-700">
            {/* Outer Glow Effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 to-secondary/40 blur-2xl opacity-20 animate-pulse"></div>
            
            <GlassCard className="relative z-10 p-10 md:p-12 border-white/10 backdrop-blur-3xl shadow-[0_0_50px_rgba(239,26,184,0.1)]">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_20px_rgba(239,26,184,0.2)]">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-headline font-bold tracking-tight">Login Page</h2>
                  <p className="text-sm text-muted-foreground">Log in to continue ordering and tracking your campus</p>
                </div>
              </div>

              <form className="mt-10 space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="email"
                      type="email" 
                      placeholder="Email" 
                      className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 pr-12 focus:border-primary/50 transition-all"
                    />
                    <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/30" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="password"
                      type={showPassword ? "text" : "password"} 
                      placeholder="Password" 
                      className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 pr-12 focus:border-primary/50 transition-all"
                    />
                    <button 
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" className="rounded-md border-white/20 data-[state=checked]:bg-primary" />
                    <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer select-none">Remember me</label>
                  </div>
                  <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Forgot password?</Link>
                </div>

                <Button className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-secondary text-lg font-bold shadow-[0_0_25px_rgba(239,26,184,0.3)] hover:opacity-90 active:scale-[0.98] transition-all">
                  Login
                </Button>

                <div className="text-center pt-2">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account? <Link href="/register" className="text-primary font-bold hover:underline">Sign Up</Link>
                  </p>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground/30 pt-4">
                  <div className="h-[1px] flex-1 bg-white/5"></div>
                  <div className="flex gap-4">
                     <button className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary/50 transition-all">
                       <GoogleIcon />
                     </button>
                     <button className="p-3 rounded-xl bg-white/5 border border-white/5 hover:border-primary/50 transition-all">
                       <FacebookIcon />
                     </button>
                  </div>
                  <div className="h-[1px] flex-1 bg-white/5"></div>
                </div>
              </form>
            </GlassCard>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-white/5 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground/60 font-medium">
          <div className="flex gap-10">
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors flex items-center gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
               Help Center
            </Link>
          </div>
          <p>© 2024 CampusSpend. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
