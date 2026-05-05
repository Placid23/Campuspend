
"use client"

import * as React from "react"
import { DashboardShell } from "@/components/layout/Shell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Camera,
  ShieldCheck,
  Zap,
  Loader2,
  Save
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser, useFirestore } from "@/firebase"
import { doc, updateDoc } from 'firebase/firestore'
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const { profile, user, isProfileLoading } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  
  const [isSaving, setIsSaving] = React.useState(false)
  const [name, setName] = React.useState("")

  React.useEffect(() => {
    if (profile) setName(profile.name || "")
  }, [profile])

  const handleSave = async () => {
    if (!user) return
    setIsSaving(true)
    try {
      await updateDoc(doc(db, "userProfiles", user.uid), {
        name: name,
        updatedAt: new Date().toISOString()
      })
      toast({ title: "Profile Updated", description: "Your changes have been saved." })
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update profile." })
    } finally {
      setIsSaving(false)
    }
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
      <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
        
        <div className="space-y-2">
          <h1 className="text-4xl font-headline font-bold text-white neon-text-glow">Profile <span className="text-primary">Settings</span></h1>
        </div>

        <div className="space-y-6">
          <GlassCard className="p-10 border-white/10 space-y-8">
            <h3 className="text-lg font-headline font-bold text-muted-foreground/80 tracking-wide">Account Information</h3>
            
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="flex flex-col items-center gap-6 shrink-0">
                <Avatar className="w-32 h-32 border-2 border-primary/20">
                  <AvatarImage src={`https://picsum.photos/seed/${user?.uid}/200/200`} />
                  <AvatarFallback>{profile?.name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <Button variant="outline" className="h-10 rounded-xl border-white/10 bg-white/5 text-xs font-bold uppercase tracking-widest">
                  Change Photo
                </Button>
              </div>

              <div className="flex-1 w-full space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Full Name</Label>
                  <Input 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-primary/50 transition-all text-sm px-6"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Email Address (Read Only)</Label>
                  <Input 
                    value={user?.email || ''}
                    disabled
                    className="h-12 bg-white/10 border-white/10 rounded-xl text-sm px-6 opacity-60 cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Role</Label>
                    <div className="h-12 bg-white/5 border border-white/10 rounded-xl flex items-center px-6 text-sm font-bold uppercase tracking-widest text-primary/80">
                      {profile?.role}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Wallet Balance</Label>
                    <div className="h-12 bg-white/5 border border-white/10 rounded-xl flex items-center px-6 text-sm font-bold">
                      ₦{profile?.walletBalance?.toLocaleString() || '0'}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-6">
                  <Button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="h-14 px-12 rounded-2xl bg-gradient-to-r from-primary to-secondary text-base font-bold shadow-[0_0_30px_rgba(239,26,184,0.4)]"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        <div className="text-center py-8 border-t border-white/5">
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">© 2024 CampusSpend. Secure Profile Suite.</p>
        </div>

      </div>
    </DashboardShell>
  )
}
