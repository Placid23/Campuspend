"use client"

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { 
  Zap, 
  Eye, 
  EyeOff, 
  Loader2,
  ShieldCheck,
  BrainCircuit,
  Lock
} from "lucide-react"
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { useAuth, useUser } from '@/firebase'
import { AppLoader } from "@/components/ui/app-loader"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  const router = useRouter()
  const { toast } = useToast()
  const auth = useAuth()
  const { user, profile, isProfileLoading, isUserLoading } = useUser()

  useEffect(() => {
    if (user && profile && !isProfileLoading) {
      const role = profile.role
      if (role === 'student') router.push("/dashboard")
      else if (role === 'vendor') router.push("/vendor/dashboard")
      else if (role === 'admin') router.push("/admin/dashboard")
      else {
        signOut(auth)
        toast({ variant: "destructive", title: "Access Denied" })
        setLoading(false)
      }
    }
  }, [user, profile, isProfileLoading, router, auth, toast])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      setLoading(false)
      toast({ variant: "destructive", title: "Login Failed", description: error.message })
    }
  }

  if (isUserLoading || (user && isProfileLoading)) {
    return <AppLoader message="Authenticating Credentials..." />;
  }

  return (
    <div className="min-h-screen nebula-bg flex flex-col overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary/10 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

      <nav className="w-full z-50 py-8 px-8 md:px-16 flex justify-between items-center relative">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_25px_rgba(239,26,184,0.4)] group-hover:scale-110 transition-transform">
            <Zap className="text-white w-6 h-6" />
          </div>
          <span className="font-headline font-bold text-2xl tracking-tighter text-white">CafePay <span className="text-primary">Wallet</span></span>
        </Link>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
        <div className="max-w-7xl w-full grid lg:grid-cols-2 gap-20 items-center">
          
          {/* Brand/Marketing Side */}
          <div className="space-y-12 hidden lg:block animate-in fade-in slide-in-from-left duration-1000">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-primary">
                <ShieldCheck className="w-3 h-3" /> Secure Academic Gateway
              </div>
              <h1 className="text-7xl font-headline font-bold leading-[1.1] tracking-tighter text-white">
                The Future of <br />
                <span className="text-primary neon-text-glow font-extrabold italic">Student Finance.</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed font-medium opacity-80">
                Log in to the **CafePay Intelligent Suite**. Experience automated expense tracking powered by the proprietary **Decision Tree Analysis Engine**.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-white font-bold uppercase text-xs tracking-widest">
                   <BrainCircuit className="w-4 h-4 text-primary" /> AI Insights
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">Real-time expenditure mapping and financial leakage detection nodes.</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-white font-bold uppercase text-xs tracking-widest">
                   <Lock className="w-4 h-4 text-secondary" /> Bank-Grade
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">Secure digital wallet infrastructure with encrypted purchase-based logging.</p>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="relative animate-in fade-in slide-in-from-right duration-1000">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl opacity-30 animate-pulse"></div>
            <GlassCard className="relative z-10 p-10 md:p-14 border-white/10 backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.4)] rounded-[3rem]">
              <div className="space-y-2 mb-10">
                <h2 className="text-3xl font-headline font-bold text-white tracking-tight">System Authorization</h2>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-widest">Establish your digital session</p>
              </div>

              <form className="space-y-8" onSubmit={handleLogin}>
                <div className="space-y-3">
                  <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Academic Email</Label>
                  <Input 
                    id="email" type="email" placeholder="name@university.edu" value={email}
                    onChange={(e) => setEmail(e.target.value)} className="h-16 rounded-2xl bg-white/5 border-white/10 px-6 text-lg focus:border-primary/50 transition-all" required
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="password" title="Enter your secure password" className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground ml-1">Access Protocol</Label>
                  <div className="relative">
                    <Input 
                      id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password}
                      onChange={(e) => setPassword(e.target.value)} className="h-16 rounded-2xl pr-16 bg-white/5 border-white/10 px-6 text-lg focus:border-primary/50 transition-all" required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button type="submit" disabled={loading} className="w-full h-16 rounded-[1.5rem] bg-gradient-to-r from-primary to-secondary text-lg font-bold shadow-[0_0_40px_rgba(239,26,184,0.3)] hover:scale-[1.02] active:scale-95 transition-all">
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Authorize Identity"}
                  </Button>
                </div>
                
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground font-medium">
                    New to the ecosystem? <Link href="/register" className="text-primary font-bold hover:underline">Create Identity</Link>
                  </p>
                </div>
              </form>
            </GlassCard>
          </div>
        </div>
      </main>

      <footer className="py-12 px-8 border-t border-white/5 mt-auto text-center relative z-10">
        <p className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-[0.5em]">© 2024 CafePay Wallet • Academic Identity Protocol v4.2</p>
      </footer>
    </div>
  )
}
