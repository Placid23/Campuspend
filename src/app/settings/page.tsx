
"use client"

import * as React from "react"
import { DashboardShell } from "@/components/layout/Shell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  Camera,
  ShieldCheck,
  Zap,
  Loader2,
  Save,
  Bell,
  Moon,
  Sun,
  LogOut,
  CreditCard,
  User,
  Smartphone
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser, useFirestore, useAuth } from "@/firebase"
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { useToast } from "@/hooks/use-toast"
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const { profile, user, isProfileLoading } = useUser()
  const db = useFirestore()
  const auth = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  
  const [isSaving, setIsSaving] = React.useState(false)
  const [name, setName] = React.useState("")
  const [theme, setTheme] = React.useState<'dark' | 'light'>('dark')
  
  // Notification States (Functional)
  const [notifications, setNotifications] = React.useState({
    transactions: true,
    aiAdvice: true,
    emailReports: false
  })

  React.useEffect(() => {
    if (profile) {
      setName(profile.name || "")
      if (profile.settings?.notifications) {
        setNotifications(profile.settings.notifications)
      }
    }
    const savedTheme = localStorage.getItem('theme') || 'dark'
    setTheme(savedTheme as any)
  }, [profile])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('theme', next)
    document.documentElement.classList.toggle('dark', next === 'dark')
  }

  const handleSave = async () => {
    if (!user) return
    setIsSaving(true)
    try {
      await updateDoc(doc(db, "userProfiles", user.uid), {
        name: name,
        settings: {
          notifications: notifications,
          updatedAt: new Date().toISOString()
        },
        updatedAt: serverTimestamp()
      })
      toast({ title: "Profile Updated", description: "Your preferences have been saved to the secure cloud." })
    } catch (err) {
      toast({ variant: "destructive", title: "Update Failed", description: "Could not sync settings." })
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    await signOut(auth)
    router.push("/login")
  }

  if (isProfileLoading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom duration-700">
        
        <div className="space-y-4">
          <h1 className="text-5xl font-headline font-bold text-white tracking-tight">Account <span className="text-primary neon-text-glow">Center</span></h1>
          <p className="text-muted-foreground max-w-xl font-medium">Manage your digital identity, notification triggers, and platform preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Profile Card */}
          <div className="lg:col-span-4 space-y-8">
            <GlassCard className="p-8 border-white/10 flex flex-col items-center text-center space-y-8 bg-white/5 backdrop-blur-3xl">
              <div className="relative group cursor-pointer">
                <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-50 animate-pulse group-hover:opacity-100 transition-opacity"></div>
                <Avatar className="w-40 h-40 border-4 border-primary/20 transition-transform duration-500 group-hover:scale-105">
                  <AvatarImage src={`https://picsum.photos/seed/${user?.uid}/200/200`} />
                  <AvatarFallback className="text-4xl">{profile?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 p-3 rounded-2xl bg-primary text-white shadow-xl">
                  <Camera className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl font-headline font-bold text-white">{profile?.name || 'Student'}</h2>
                <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest inline-block">
                   Verified Student
                </div>
                <p className="text-xs text-muted-foreground font-mono">UID: {user?.uid.substring(0, 12)}...</p>
              </div>

              <div className="w-full pt-6 border-t border-white/5 space-y-4">
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Digital Wallet</span>
                    <span className="text-white font-bold">₦{profile?.walletBalance?.toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground font-bold uppercase text-[10px] tracking-widest">Status</span>
                    <span className="text-emerald-400 font-bold uppercase text-[10px] tracking-widest">Active</span>
                 </div>
              </div>

              <Button 
                variant="destructive" 
                onClick={handleLogout}
                className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-[10px] bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 text-rose-500 hover:text-white transition-all"
              >
                <LogOut className="w-4 h-4 mr-2" /> Logout Account
              </Button>
            </GlassCard>
          </div>

          {/* Right Column: Multi-Settings */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Identity Settings */}
            <GlassCard className="p-10 border-white/10 space-y-8 bg-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                   <User className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="text-xl font-headline font-bold">Identity & Verification</h3>
                   <p className="text-xs text-muted-foreground">Manage your core account details.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Display Name</Label>
                  <Input 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-14 bg-white/5 border-white/10 rounded-xl px-6 focus:border-primary/50 transition-all font-bold"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Registered Email</Label>
                  <Input 
                    value={user?.email || ""}
                    disabled
                    className="h-14 bg-white/10 border-white/10 rounded-xl px-6 opacity-60 cursor-not-allowed font-medium"
                  />
                </div>
              </div>
            </GlassCard>

            {/* Notification Center */}
            <GlassCard className="p-10 border-white/10 space-y-8 bg-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 shadow-inner">
                   <Bell className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="text-xl font-headline font-bold">Notification Center</h3>
                   <p className="text-xs text-muted-foreground">Configure your real-time spend triggers.</p>
                </div>
              </div>

              <div className="space-y-6">
                 {[
                   { key: 'transactions', icon: CreditCard, label: 'Transaction Alerts', desc: 'Notify me of every ₦ deduction.' },
                   { key: 'aiAdvice', icon: Zap, label: 'AI Engine Insights', desc: 'Critical alerts when Decision Tree detects leakage.' },
                   { key: 'emailReports', icon: ShieldCheck, label: 'Weekly Summary', desc: 'Send expenditure breakdown to my email.' },
                 ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-primary/20 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-muted text-muted-foreground group-hover:text-primary transition-colors">
                             <item.icon className="w-5 h-5" />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-white/90">{item.label}</p>
                             <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{item.desc}</p>
                          </div>
                       </div>
                       <Switch 
                        checked={(notifications as any)[item.key]} 
                        onCheckedChange={(val) => setNotifications({...notifications, [item.key]: val})}
                        className="data-[state=checked]:bg-primary"
                       />
                    </div>
                 ))}
              </div>
            </GlassCard>

            {/* Display & Platform */}
            <GlassCard className="p-10 border-white/10 space-y-8 bg-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-400 shadow-inner">
                   <Smartphone className="w-6 h-6" />
                </div>
                <div>
                   <h3 className="text-xl font-headline font-bold">Platform Interface</h3>
                   <p className="text-xs text-muted-foreground">Customize your visual ecosystem.</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5">
                 <div className="space-y-1">
                    <p className="text-sm font-bold">System Appearance</p>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Current: {theme === 'dark' ? 'Nebula Dark' : 'Frost Light'}</p>
                 </div>
                 <Button 
                  variant="outline" 
                  onClick={toggleTheme}
                  className="rounded-xl h-12 px-6 border-white/10 hover:bg-white/5"
                 >
                    {theme === 'dark' ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
                    Switch to {theme === 'dark' ? 'Light' : 'Dark'}
                 </Button>
              </div>
            </GlassCard>

            {/* Final Actions */}
            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleSave}
                disabled={isSaving}
                className="h-16 px-16 rounded-2xl bg-gradient-to-r from-primary to-secondary text-lg font-bold shadow-[0_0_40px_rgba(239,26,184,0.4)] hover:scale-[1.02] active:scale-95 transition-all"
              >
                {isSaving ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : <Save className="w-6 h-6 mr-3" />}
                Save My Preferences
              </Button>
            </div>

          </div>
        </div>

        <div className="text-center py-12 border-t border-white/5">
           <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.5em]">© 2024 CafePay Wallet • Infrastructure Identity Protocol</p>
        </div>

      </div>
    </DashboardShell>
  )
}
