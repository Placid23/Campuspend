"use client"

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { 
  Zap, 
  Mail, 
  Lock, 
  User,
  Eye, 
  EyeOff, 
  UserPlus,
  Loader2,
  ShieldCheck,
  BrainCircuit,
  Sparkles
} from "lucide-react"
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useAuth, useFirestore } from '@/firebase'
import { AppLoader } from "@/components/ui/app-loader"

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student" as "student" | "vendor" | "admin",
    adminCode: ""
  })

  const { toast } = useToast()
  const router = useRouter()
  const auth = useAuth()
  const db = useFirestore()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      toast({ variant: "destructive", title: "Passwords do not match" })
      return
    }
    if (formData.role === 'admin' && formData.adminCode !== "377899") {
      toast({ variant: "destructive", title: "Invalid Admin Code" })
      return
    }

    setLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password)
      const user = userCredential.user
      const profileData = {
        id: user.uid,
        firebaseUid: user.uid,
        email: user.email,
        name: formData.fullName,
        role: formData.role,
        walletBalance: formData.role === 'student' ? 5000 : 0,
        monthlyBudget: formData.role === 'student' ? 8000 : 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      await setDoc(doc(db, "userProfiles", user.uid), profileData)
      
      setIsTransitioning(true)
      toast({ title: "Account Created!" })
      
      if (formData.role === 'student') router.push("/dashboard")
      else if (formData.role === 'vendor') router.push("/vendor/dashboard")
      else router.push("/admin/dashboard")
    } catch (error: any) {
      setLoading(false)
      toast({ variant: "destructive", title: "Registration Failed", description: error.message })
    }
  }

  if (isTransitioning) {
    return <AppLoader message="Establishing Digital Identity..." />;
  }

  return (
    <div className="min-h-screen nebula-bg flex flex-col overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 blur-[140px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary/10 blur-[140px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

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
                <Sparkles className="w-3 h-3" /> Join the Intelligence Network
              </div>
              <h1 className="text-7xl font-headline font-bold leading-[1.1] tracking-tighter text-white">
                Start Your <br />
                <span className="text-primary neon-text-glow font-extrabold italic">Smart Journey.</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-lg leading-relaxed font-medium opacity-80">
                Establish your identity within the **CafePay Ecosystem**. Experience the luxury of automated expense tracking and intelligent behavioral analysis.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-8">
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-white font-bold uppercase text-xs tracking-widest">
                   <BrainCircuit className="w-4 h-4 text-primary" /> Automated PBL
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">Instant purchase-based logging across all verified university vendors.</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-white font-bold uppercase text-xs tracking-widest">
                   <ShieldCheck className="w-4 h-4 text-secondary" /> Data Fidelity
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">Secure academic identity verification and encrypted transaction nodes.</p>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <div className="relative animate-in fade-in slide-in-from-right duration-1000">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-secondary/20 blur-3xl opacity-30 animate-pulse"></div>
            <GlassCard className="relative z-10 p-10 md:p-12 border-white/10 backdrop-blur-3xl shadow-[0_30px_100px_rgba(0,0,0,0.4)] rounded-[3rem]">
              <div className="space-y-2 mb-8">
                <h2 className="text-3xl font-headline font-bold text-white tracking-tight">Identity Creation</h2>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Enroll in the digital infrastructure</p>
              </div>

              <form className="space-y-6" onSubmit={handleRegister}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                    <Input id="fullName" value={formData.fullName} onChange={handleInputChange} className="h-14 rounded-2xl bg-white/5 border-white/10 px-6 focus:border-primary/50" placeholder="John Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">University Email</Label>
                    <Input id="email" type="email" value={formData.email} onChange={handleInputChange} className="h-14 rounded-2xl bg-white/5 border-white/10 px-6 focus:border-primary/50" placeholder="student@university.edu" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Secure Protocol</Label>
                    <div className="relative">
                      <Input id="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} className="h-14 rounded-2xl bg-white/5 border-white/10 px-6 pr-12 focus:border-primary/50" placeholder="••••••••" required />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Verify Protocol</Label>
                    <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} className="h-14 rounded-2xl bg-white/5 border-white/10 px-6 focus:border-primary/50" placeholder="••••••••" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground ml-1">Operational Role</Label>
                  <Select value={formData.role} onValueChange={(val) => setFormData(prev => ({ ...prev, role: val as any }))}>
                    <SelectTrigger className="h-14 rounded-2xl bg-white/5 border-white/10 px-6">
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10">
                      <SelectItem value="student">I'm a Student</SelectItem>
                      <SelectItem value="vendor">I'm a Vendor</SelectItem>
                      <SelectItem value="admin">I'm an Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.role === 'admin' && (
                  <div className="space-y-2 animate-in slide-in-from-top-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-primary ml-1">System Override Code</Label>
                    <Input id="adminCode" type="password" value={formData.adminCode} onChange={handleInputChange} className="h-14 border-primary/20 rounded-2xl bg-primary/5 px-6" required />
                  </div>
                )}

                <div className="pt-4">
                  <Button type="submit" disabled={loading} className="w-full h-16 rounded-[1.5rem] bg-gradient-to-r from-primary to-secondary text-lg font-bold shadow-[0_0_40px_rgba(239,26,184,0.3)] hover:scale-[1.02] active:scale-95 transition-all">
                    {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : "Initialize Identity"}
                  </Button>
                </div>
                
                <div className="text-center">
                  <p className="text-sm text-muted-foreground font-medium">
                    Already recognized by system? <Link href="/login" className="text-primary font-bold hover:underline">Authorize here</Link>
                  </p>
                </div>
              </form>
            </GlassCard>
          </div>
        </div>
      </main>

      <footer className="py-12 px-8 border-t border-white/5 mt-auto text-center relative z-10">
        <p className="text-[10px] text-muted-foreground/40 font-bold uppercase tracking-[0.5em]">© 2024 CafePay Wallet • Academic Enrollment Protocol v4.2</p>
      </footer>
    </div>
  )
}
