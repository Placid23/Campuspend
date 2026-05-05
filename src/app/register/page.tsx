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
import { useAuth, useFirestore } from '@/firebase'

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
      toast({ title: "Account Created!" })
      if (formData.role === 'student') router.push("/dashboard")
      else if (formData.role === 'vendor') router.push("/vendor/dashboard")
      else router.push("/admin/dashboard")
    } catch (error: any) {
      setLoading(false)
      toast({ variant: "destructive", title: "Registration Failed", description: error.message })
    }
  }

  return (
    <div className="min-h-screen nebula-bg flex flex-col pt-[env(safe-area-inset-top,0px)]">
      <nav className="w-full z-50 py-6 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(239,26,184,0.5)]">
            <Zap className="text-white w-5 h-5" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tighter text-white">CampusSpend</span>
        </div>
      </nav>

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl font-headline font-bold leading-tight text-white">
              Join <span className="text-primary neon-text-glow">CampusSpend</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Experience the luxury of automated expense tracking and smart campus spending.
            </p>
          </div>

          <div className="relative">
            <GlassCard className="p-10 md:p-12 border-primary/20 backdrop-blur-3xl shadow-[0_0_80px_rgba(239,26,184,0.15)] rounded-[2rem]">
              <form className="space-y-5" onSubmit={handleRegister}>
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" value={formData.fullName} onChange={handleInputChange} className="h-12 rounded-xl" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={handleInputChange} className="h-12 rounded-xl" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={formData.password} onChange={handleInputChange} className="h-12 rounded-xl" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirmPassword">Confirm</Label>
                    <Input id="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleInputChange} className="h-12 rounded-xl" required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Register As</Label>
                  <Select value={formData.role} onValueChange={(val) => setFormData(prev => ({ ...prev, role: val as any }))}>
                    <SelectTrigger className="h-12 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">I'm a Student</SelectItem>
                      <SelectItem value="vendor">I'm a Vendor</SelectItem>
                      <SelectItem value="admin">I'm an Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {formData.role === 'admin' && (
                  <div className="space-y-1.5 animate-in slide-in-from-top-2">
                    <Label className="text-primary">Admin Code</Label>
                    <Input id="adminCode" type="password" value={formData.adminCode} onChange={handleInputChange} className="h-12 border-primary/20 rounded-xl" required />
                  </div>
                )}
                <div className="space-y-4 pt-2">
                  <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl bg-primary font-bold">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Sign in</Link>
                  </p>
                </div>
              </form>
            </GlassCard>
          </div>
        </div>
      </main>

      <footer className="py-12 px-6 mt-auto text-center border-t border-white/5 pb-[calc(3rem+env(safe-area-inset-bottom,0px))]">
        <p className="text-xs text-muted-foreground/40">© 2024 CampusSpend. All rights reserved.</p>
      </footer>
    </div>
  )
}
