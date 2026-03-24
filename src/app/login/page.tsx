
"use client"

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { 
  Zap, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ShieldCheck
} from "lucide-react"

const GoogleIcon = () => (
  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
)

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Hardcoded credentials for preview
    if (email === "gentuu@campus.edu" && password === "student123") {
      router.push("/dashboard")
    } else if (email === "vendor@qfcafe.edu" && password === "vendor123") {
      router.push("/vendor/dashboard")
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Student: gentuu@campus.edu / student123 | Vendor: vendor@qfcafe.edu / vendor123",
      })
    }
  }

  return (
    <div className="min-h-screen nebula-bg flex flex-col">
      <nav className="w-full z-50 py-6 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(239,26,184,0.5)]">
            <Zap className="text-white w-5 h-5" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tighter text-white">CampusSpend</span>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10 animate-in fade-in slide-in-from-left duration-700">
            <div className="space-y-6">
              <h1 className="text-5xl font-headline font-bold leading-tight text-white">
                Welcome <span className="text-primary neon-text-glow">Back!</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
                Log in to continue managing your campus presence or tracking your spending.
              </p>
              <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl max-w-sm">
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">Demo Credentials</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-white font-bold">Student:</p>
                    <p className="text-xs text-muted-foreground">Email: gentuu@campus.edu | Pass: student123</p>
                  </div>
                  <div>
                    <p className="text-xs text-white font-bold">Vendor (QFCafe):</p>
                    <p className="text-xs text-muted-foreground">Email: vendor@qfcafe.edu | Pass: vendor123</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative animate-in fade-in slide-in-from-right duration-700">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 to-secondary/40 blur-2xl opacity-20 animate-pulse"></div>
            <GlassCard className="relative z-10 p-10 md:p-12 border-white/10 backdrop-blur-3xl shadow-[0_0_50px_rgba(239,26,184,0.1)]">
              <div className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-[0_0_20px_rgba(239,26,184,0.2)]">
                  <ShieldCheck className="w-8 h-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-3xl font-headline font-bold tracking-tight text-white">Login</h2>
                  <p className="text-sm text-muted-foreground">Log in to your CampusSpend account</p>
                </div>
              </div>

              <form className="mt-10 space-y-6" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest text-muted-foreground/70">Email</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input 
                      id="email"
                      type="email" 
                      placeholder="Email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 pr-12 focus:border-primary/50 transition-all text-white"
                      required
                    />
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 pr-12 focus:border-primary/50 transition-all text-white"
                      required
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

                <Button type="submit" className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-secondary text-lg font-bold shadow-[0_0_25px_rgba(239,26,184,0.3)] hover:opacity-90 active:scale-[0.98] transition-all text-white">
                  Login
                </Button>
              </form>
            </GlassCard>
          </div>
        </div>
      </main>

      <footer className="py-10 px-6 border-t border-white/5 mt-auto text-center text-muted-foreground/60 text-sm">
        <p>© 2024 CampusSpend. All rights reserved.</p>
      </footer>
    </div>
  )
}
