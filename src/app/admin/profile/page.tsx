"use client"

import * as React from "react"
import { AdminShell } from "@/components/layout/AdminShell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { 
  ShieldCheck, 
  User, 
  Mail, 
  Bell, 
  Save, 
  Loader2, 
  LogOut,
  Zap,
  Lock,
  Smartphone,
  Store
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser, useFirestore, useAuth } from "@/firebase"
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { useToast } from "@/hooks/use-toast"
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'

export default function AdminProfilePage() {
  const { profile, user, isProfileLoading } = useUser()
  const db = useFirestore()
  const auth = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  
  const [isSaving, setIsSaving] = React.useState(false)
  const [name, setName] = React.useState("")
  const [notifications, setNotifications] = React.useState({
    systemAlerts: true,
    newVendors: true,
    userReports: true
  })

  React.useEffect(() => {
    if (profile) {
      setName(profile.name || "")
      if (profile.settings?.notifications) {
        setNotifications(profile.settings.notifications)
      }
    }
  }, [profile])

  const handleSave = async () => {
    if (!user) return
    setIsSaving(true)
    try {
      await updateDoc(doc(db, "userProfiles", user.uid), {
        name: name,
        settings: { notifications },
        updatedAt: serverTimestamp()
      })
      toast({ title: "Admin Credentials Updated", description: "Security profile synchronized successfully." })
    } catch (err) {
      toast({ variant: "destructive", title: "Update Failed", description: "Could not save admin preferences." })
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
      <AdminShell>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell>
      <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom duration-700">
        
        <div className="space-y-4">
          <h1 className="text-5xl font-headline font-bold text-white tracking-tight">System <span className="text-primary neon-text-glow">Security</span></h1>
          <p className="text-muted-foreground max-w-xl font-medium">Platform oversight, administrative identity, and system-wide alert controls.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Admin Identity */}
          <div className="lg:col-span-4 space-y-8">
            <GlassCard className="p-10 border-white/10 flex flex-col items-center text-center space-y-8 bg-black/20 backdrop-blur-3xl">
              <div className="relative group">
                <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-50 animate-pulse"></div>
                <Avatar className="w-44 h-44 border-4 border-primary/30 shadow-2xl relative z-10">
                  <AvatarImage src={`https://picsum.photos/seed/${user?.uid}/200/200`} />
                  <AvatarFallback className="text-4xl">A</AvatarFallback>
                </Avatar>
                <div className="absolute bottom-2 right-2 p-3 rounded-2xl bg-primary text-white shadow-xl z-20 border border-white/20">
                  <Lock className="w-6 h-6" />
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl font-headline font-bold text-white">{profile?.name || 'Administrator'}</h2>
                <div className="px-5 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-[0.3em] inline-block">
                   Platform Architect
                </div>
                <p className="text-[10px] text-muted-foreground font-mono opacity-50 pt-2">{user?.email}</p>
              </div>

              <div className="w-full pt-8 border-t border-white/5 space-y-4">
                 <Button 
                   variant="destructive" 
                   onClick={handleLogout}
                   className="w-full h-14 rounded-2xl font-bold uppercase tracking-widest text-xs bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 text-rose-500 hover:text-white transition-all shadow-lg"
                 >
                   <LogOut className="w-5 h-5 mr-3" /> Terminate Session
                 </Button>
              </div>
            </GlassCard>
          </div>

          {/* Admin Settings */}
          <div className="lg:col-span-8 space-y-10">
            
            <GlassCard className="p-10 border-white/10 space-y-10 bg-black/20">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner border border-primary/20">
                   <ShieldCheck className="w-7 h-7" />
                </div>
                <div>
                   <h3 className="text-2xl font-headline font-bold">Admin Credentials</h3>
                   <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Update your platform-facing identity</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Admin Alias</Label>
                  <Input 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-14 bg-white/5 border-white/10 rounded-xl px-6 focus:border-primary/50 transition-all font-bold text-lg"
                  />
                </div>
                <div className="space-y-3">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Email Access (Root)</Label>
                  <Input 
                    value={user?.email || ""}
                    disabled
                    className="h-14 bg-white/10 border-white/10 rounded-xl px-6 opacity-60 cursor-not-allowed font-medium"
                  />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-10 border-white/10 space-y-10 bg-black/20">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400 shadow-inner border border-blue-500/20">
                   <Bell className="w-7 h-7" />
                </div>
                <div>
                   <h3 className="text-2xl font-headline font-bold">System Overrides</h3>
                   <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Global platform alert monitoring</p>
                </div>
              </div>

              <div className="space-y-6">
                 {[
                   { key: 'systemAlerts', icon: Zap, label: 'Core Integrity Alerts', desc: 'Critical system failures or performance drops.' },
                   { key: 'newVendors', icon: Store, label: 'Merchant Requests', desc: 'Notify when new vendors apply for campus verification.' },
                   { key: 'userReports', icon: User, label: 'Governance Logs', desc: 'High-volume account reports or security flags.' },
                 ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/5 group hover:border-primary/20 transition-all">
                       <div className="flex items-center gap-5">
                          <div className="p-3 rounded-xl bg-muted text-muted-foreground group-hover:text-primary transition-colors border border-white/5">
                             <item.icon className="w-6 h-6" />
                          </div>
                          <div>
                             <p className="text-base font-bold text-white/90">{item.label}</p>
                             <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em]">{item.desc}</p>
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

            <div className="flex justify-end pt-4">
              <Button 
                onClick={handleSave}
                disabled={isSaving}
                className="h-16 px-20 rounded-2xl bg-gradient-to-r from-primary to-secondary text-lg font-bold shadow-[0_0_50px_rgba(239,26,184,0.4)] hover:scale-[1.02] active:scale-95 transition-all"
              >
                {isSaving ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : <Save className="w-6 h-6 mr-3" />}
                Sync Security Protocol
              </Button>
            </div>

          </div>
        </div>

        <div className="text-center py-12 border-t border-white/5">
           <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.6em]">© 2024 CafePay Wallet • Platform Root Infrastructure v4.1</p>
        </div>

      </div>
    </AdminShell>
  )
}
