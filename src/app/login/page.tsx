
"use client"

import Link from 'next/link'
import { useState, useEffect } from 'react'
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
  ShieldCheck,
  Loader2,
  AlertCircle
} from "lucide-react"
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { useAuth, useUser } from '@/firebase'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  const router = useRouter()
  const { toast } = useToast()
  const auth = useAuth()
  const { user, profile, isProfileLoading, profileError } = useUser()

  // Redirection Logic
  useEffect(() => {
    if (user && profile && !isProfileLoading) {
      const role = profile.role
      
      if (role === 'student') {
        router.push("/dashboard")
      } else if (role === 'vendor') {
        router.push("/vendor/dashboard")
      } else if (role === 'admin') {
        router.push("/admin/dashboard")
      } else {
        signOut(auth)
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "Unauthorized role detected.",
        })
        setLoading(false)
        return
      }

      toast({
        title: "Welcome back!",
        description: `Successfully logged in as ${role}.`,
      })
    }
  }, [user, profile, isProfileLoading, router, auth, toast])

  // Handle errors (Missing profile or Firestore errors)
  useEffect(() => {
    if (user && profileError) {
      console.error("Profile sync error:", profileError)
      setLoading(false)
      
      // If profile is missing, it's often because the user was created in Auth but not Firestore
      if (profileError.message === "Profile not found") {
        signOut(auth)
        toast({
          variant: "destructive",
          title: "Profile Missing",
          description: "Your account exists but your profile data was not found. Please re-register.",
        })
      } else {
        toast({
          variant: "destructive",
          title: "Sync Error",
          description: "Unable to sync your account details. Please check your internet connection.",
        })
      }
    }
  }, [user, profileError, auth, toast])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      // Redirection is handled by the useEffect above once profile is synced
    } catch (error: any) {
      console.error("Login error:", error)
      setLoading(false)
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message || "Invalid email or password.",
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
                Log in to continue managing your campus presence, tracking your spending, or overseeing the ecosystem.
              </p>
              <div className="bg-primary/10 border border-primary/20 p-4 rounded-2xl max-w-sm">
                <p className="text-xs font-bold text-primary uppercase tracking-widest mb-2">System Status</p>
                <div className="space-y-3">
                  <p className="text-[10px] text-muted-foreground leading-relaxed flex items-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> Secure Firebase Connection Active
                  </p>
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

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-secondary text-lg font-bold shadow-[0_0_25px_rgba(239,26,184,0.3)] hover:opacity-90 active:scale-[0.98] transition-all text-white"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {isProfileLoading ? "Syncing Profile..." : "Authenticating..."}
                    </span>
                  ) : "Login"}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account? <Link href="/register" className="text-primary font-bold hover:underline transition-colors">Sign up</Link>
                  </p>
                </div>
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
