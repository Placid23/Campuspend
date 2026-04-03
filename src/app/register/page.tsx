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
  ShieldAlert
} from "lucide-react"
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useAuth, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase'

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
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

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({ ...prev, role: value as any }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match",
        description: "Please ensure both password fields are identical."
      })
      return
    }

    if (formData.role === 'admin' && formData.adminCode !== "377899") {
      toast({
        variant: "destructive",
        title: "Invalid Admin Code",
        description: "You are not authorized to create an Administrator account."
      })
      return
    }

    setLoading(true)

    try {
      // 1. Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      )
      const user = userCredential.user

      // 2. Prepare profile data
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

      // 3. Create the profile document
      const profileRef = doc(db, "userProfiles", user.uid)
      
      await setDoc(profileRef, profileData)
      
      toast({
        title: "Account Created!",
        description: `Welcome to CampusSpend, ${formData.fullName}.`
      })

      if (formData.role === 'student') {
        router.push("/dashboard")
      } else if (formData.role === 'vendor') {
        router.push("/vendor/dashboard")
      } else {
        router.push("/admin/dashboard")
      }

    } catch (error: any) {
      console.error("Auth error:", error)
      setLoading(false)
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "An unexpected error occurred during registration."
      })
    }
  }

  return (
    <div className="min-h-screen nebula-bg flex flex-col font-body">
      <nav className="w-full z-50 py-6 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(239,26,184,0.5)]">
            <Zap className="text-white w-5 h-5" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tighter text-white">CampusSpend</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-sm font-medium px-6 border border-white/10 rounded-full hover:bg-white/5 text-white">Log in</Button>
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6 animate-in fade-in slide-in-from-left duration-700">
            <h1 className="text-5xl font-headline font-bold leading-tight text-white">
              Join <span className="text-primary neon-text-glow">CampusSpend</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Experience the luxury of automated expense tracking and smart campus spending in Naira (₦).
            </p>
          </div>

          <div className="relative animate-in fade-in slide-in-from-right duration-700">
            <div className="absolute -inset-2 bg-primary/30 blur-3xl opacity-20 rounded-[2rem]"></div>
            
            <GlassCard className="relative z-10 p-10 md:p-12 border-primary/20 backdrop-blur-3xl shadow-[0_0_80px_rgba(239,26,184,0.15)] rounded-[2rem]">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-xl bg-background border border-primary/50 flex items-center justify-center shadow-[0_0_20px_rgba(239,26,184,0.3)]">
                <UserPlus className="w-6 h-6 text-primary" />
              </div>

              <div className="flex flex-col items-center text-center space-y-3 mb-10 pt-2">
                <h2 className="text-3xl font-headline font-bold tracking-tight text-white">Sign Up</h2>
                <p className="text-sm text-muted-foreground">
                  Create your account to start ordering.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleRegister}>
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-xs font-bold text-muted-foreground/80 uppercase tracking-widest">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                    <Input 
                      id="fullName"
                      placeholder="Full Name" 
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="h-12 bg-white/5 border-white/10 rounded-xl pl-12 pr-4 focus:border-primary/50 transition-all text-sm text-white"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs font-bold text-muted-foreground/80 uppercase tracking-widest">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                    <Input 
                      id="email"
                      type="email"
                      placeholder="Email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      className="h-12 bg-white/5 border-white/10 rounded-xl pl-12 pr-4 focus:border-primary/50 transition-all text-sm text-white"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-xs font-bold text-muted-foreground/80 uppercase tracking-widest">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                      <Input 
                        id="password"
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        value={formData.password}
                        onChange={handleInputChange}
                        className="h-12 bg-white/5 border-white/10 rounded-xl pl-12 pr-12 focus:border-primary/50 transition-all text-sm text-white"
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

                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword" className="text-xs font-bold text-muted-foreground/80 uppercase tracking-widest">Confirm</Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/50" />
                      <Input 
                        id="confirmPassword"
                        type="password" 
                        placeholder="••••••••" 
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className="h-12 bg-white/5 border-white/10 rounded-xl pl-12 pr-4 focus:border-primary/50 transition-all text-sm text-white"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="role" className="text-xs font-bold text-muted-foreground/80 uppercase tracking-widest">Register As</Label>
                  <Select value={formData.role} onValueChange={handleRoleChange}>
                    <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl px-6 focus:ring-primary/30 text-white">
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
                  <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-300">
                    <Label htmlFor="adminCode" className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                      <ShieldAlert className="w-3 h-3" /> Admin Verification Code
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
                      <Input 
                        id="adminCode"
                        type="password"
                        placeholder="Enter 6-digit code" 
                        value={formData.adminCode}
                        onChange={handleInputChange}
                        className="h-12 bg-primary/5 border-primary/20 rounded-xl pl-12 pr-4 focus:border-primary/50 transition-all text-sm text-white"
                        required
                      />
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-secondary text-base font-bold shadow-[0_0_25px_rgba(239,26,184,0.3)] hover:opacity-90 active:scale-[0.98] transition-all text-white"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account? <Link href="/login" className="text-white font-bold hover:text-primary transition-colors">Log in</Link>
                  </p>
                </div>
              </form>
            </GlassCard>
          </div>
        </div>
      </main>

      <footer className="py-12 px-6 mt-auto text-center border-t border-white/5">
        <p className="text-xs text-muted-foreground/40">© 2024 CampusSpend. All rights reserved.</p>
      </footer>
    </div>
  )
}