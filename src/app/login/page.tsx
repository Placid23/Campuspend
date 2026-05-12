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
  Loader2
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

  // Show AppLoader during initial auth check or when waiting for profile after login
  if (isUserLoading || (user && isProfileLoading)) {
    return <AppLoader message="Authenticating Credentials..." />;
  }

  return (
    <div className="min-h-screen nebula-bg flex flex-col pt-[env(safe-area-inset-top,0px)]">
      <nav className="w-full z-50 py-6 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(239,26,184,0.5)]">
            <Zap className="text-white w-5 h-5" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tighter text-white">CafePay Wallet</span>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-10">
            <h1 className="text-5xl font-headline font-bold leading-tight text-white">
              Welcome <span className="text-primary neon-text-glow">Back!</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Log in to continue managing your campus presence, tracking your spending, or overseeing the ecosystem.
            </p>
          </div>

          <div className="relative">
            <GlassCard className="relative z-10 p-10 md:p-12 border-white/10 backdrop-blur-3xl shadow-[0_0_50px_rgba(239,26,184,0.15)]">
              <form className="space-y-6" onSubmit={handleLogin}>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" type="email" placeholder="student@university.edu" value={email}
                    onChange={(e) => setEmail(e.target.value)} className="h-14 rounded-2xl bg-white/5" required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input 
                      id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" value={password}
                      onChange={(e) => setPassword(e.target.value)} className="h-14 rounded-2xl pr-12 bg-white/5" required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <Button type="submit" disabled={loading} className="w-full h-14 rounded-2xl bg-primary font-bold shadow-lg hover:shadow-primary/20 transition-all">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Authorize Access"}
                </Button>
                <p className="text-center text-sm text-muted-foreground">
                  Don't have an account? <Link href="/register" className="text-primary font-bold hover:underline">Register Identity</Link>
                </p>
              </form>
            </GlassCard>
          </div>
        </div>
      </main>

      <footer className="py-10 px-6 border-t border-white/5 mt-auto text-center text-muted-foreground/60 text-sm pb-[calc(2.5rem+env(safe-area-inset-bottom,0px))]">
        <p>© 2024 CafePay Wallet. Academic Integrity Engine.</p>
      </footer>
    </div>
  )
}
