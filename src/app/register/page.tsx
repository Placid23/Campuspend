
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
  Loader2
} from "lucide-react"
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { useAuth, useFirestore, errorEmitter, FirestorePermissionError } from '@/firebase'

// Social Icons
const GoogleIcon = () => (
  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
)

const FacebookIcon = () => (
  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student" as "student" | "vendor"
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
    setFormData(prev => ({ ...prev, role: value as "student" | "vendor" }))
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

    setLoading(true)

    try {
      // 1. Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      )
      const user = userCredential.user

      // 2. Prepare profile data for Firestore
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

      // 3. Write to Firestore userProfiles collection (Non-blocking pattern)
      const profileRef = doc(db, "userProfiles", user.uid)
      setDoc(profileRef, profileData)
        .catch(async (error) => {
          const permissionError = new FirestorePermissionError({
            path: profileRef.path,
            operation: 'create',
            requestResourceData: profileData,
          })
          errorEmitter.emit('permission-error', permissionError)
        })

      toast({
        title: "Account Created!",
        description: `Welcome to CampusSpend, ${formData.fullName}.`
      })

      // 4. Redirect based on role
      if (formData.role === 'student') {
        router.push("/dashboard")
      } else {
        router.push("/vendor/dashboard")
      }

    } catch (error: any) {
      console.error("Registration error:", error)
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message || "An unexpected error occurred during registration."
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen nebula-bg flex flex-col font-body">
      {/* Header Navigation */}
      <nav className="w-full z-50 py-6 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(239,26,184,0.5)]">
            <Zap className="text-white w-5 h-5" />
          </div>
          <span className="font-headline font-bold text-xl tracking-tighter text-white">CampusSpend</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors text-white">Home</Link>
          <Link href="#" className="text-sm font-medium hover:text-primary transition-colors text-white">How It Works</Link>
          <Link href="/vendors" className="text-sm font-medium hover:text-primary transition-colors text-white">Vendors</Link>
          <Link href="#" className="text-sm font-medium hover:text-primary transition-colors text-white">Features</Link>
          <Link href="#" className="text-sm font-medium hover:text-primary transition-colors text-white">About</Link>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="text-sm font-medium px-6 border border-white/10 rounded-full hover:bg-white/5 text-white">Log in</Button>
          </Link>
          <Button className="glow-button rounded-full px-8 bg-gradient-to-r from-primary to-secondary hover:opacity-90">Get Started</Button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Side: Join Text */}
          <div className="space-y-6 animate-in fade-in slide-in-from-left duration-700">
            <h1 className="text-5xl font-headline font-bold leading-tight text-white">
              Join <span className="text-primary neon-text-glow">CampusSpend</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-md leading-relaxed">
              Create your account to start ordering from campus vendors and track your expenses automatically.
            </p>
          </div>

          {/* Right Side: Sign-Up Form Card */}
          <div className="relative animate-in fade-in slide-in-from-right duration-700">
            {/* Intensive Card Glow */}
            <div className="absolute -inset-2 bg-primary/30 blur-3xl opacity-20 rounded-[2rem]"></div>
            
            <GlassCard className="relative z-10 p-10 md:p-12 border-primary/20 backdrop-blur-3xl shadow-[0_0_80px_rgba(239,26,184,0.15)] ring-1 ring-primary/30 rounded-[2rem]">
              {/* Floating Top Icon */}
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-xl bg-background border border-primary/50 flex items-center justify-center shadow-[0_0_20px_rgba(239,26,184,0.3)]">
                <UserPlus className="w-6 h-6 text-primary" />
              </div>

              <div className="flex flex-col items-center text-center space-y-3 mb-10 pt-2">
                <h2 className="text-3xl font-headline font-bold tracking-tight text-white">Join <span className="text-primary">CampusSpend</span></h2>
                <p className="text-sm text-muted-foreground max-w-[280px]">
                  Create your account to start ordering from campus vendors and track your expenses.
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
                    </SelectContent>
                  </Select>
                </div>

                <p className="text-[10px] text-center text-muted-foreground/60 py-2">
                  By signing up, you agree to the <Link href="#" className="underline hover:text-primary">Terms of Service</Link> and <Link href="#" className="underline hover:text-primary">Privacy Policy</Link>
                </p>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-secondary text-base font-bold shadow-[0_0_25px_rgba(239,26,184,0.3)] hover:opacity-90 active:scale-[0.98] transition-all text-white"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign Up"}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account? <Link href="/login" className="text-foreground font-bold hover:text-primary transition-colors text-white">Log in</Link>
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <Button type="button" variant="outline" className="flex-1 h-10 rounded-lg border-white/10 bg-white/5 hover:bg-white/10 text-xs font-medium text-white">
                    <GoogleIcon /> Google
                  </Button>
                  <Button type="button" variant="outline" className="flex-1 h-10 rounded-lg border-white/10 bg-white/5 hover:bg-white/10 text-xs font-medium text-white">
                    <FacebookIcon /> Facebook
                  </Button>
                </div>
              </form>
            </GlassCard>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-12 px-6 mt-auto text-center border-t border-white/5">
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground/60 font-medium mb-4">
          <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
          <div className="w-1 h-1 rounded-full bg-muted-foreground/30"></div>
          <Link href="#" className="hover:text-primary transition-colors">Help Center</Link>
        </div>
        <p className="text-xs text-muted-foreground/40">© 2024 CampusSpend. All rights reserved.</p>
      </footer>
    </div>
  )
}
