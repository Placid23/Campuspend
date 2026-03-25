
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
  ChefHat, 
  Pizza, 
  BookOpen, 
  PenTool, 
  Camera,
  ShieldCheck,
  Zap,
  Loader2
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser } from "@/firebase"

export default function SettingsPage() {
  const { profile, user, isProfileLoading } = useUser()

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
        
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-4xl font-headline font-bold text-white neon-text-glow">Profile <span className="text-primary">Settings</span></h1>
        </div>

        <div className="space-y-6">
          
          {/* Profile Information Section */}
          <GlassCard className="p-10 border-white/10 space-y-8">
            <h3 className="text-lg font-headline font-bold text-muted-foreground/80 tracking-wide">Profile Information</h3>
            
            <div className="flex flex-col md:flex-row gap-12 items-start">
              {/* Avatar Column */}
              <div className="flex flex-col items-center gap-6 shrink-0">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-full blur opacity-30 group-hover:opacity-60 transition-opacity"></div>
                  <Avatar className="w-32 h-32 border-2 border-white/10 relative z-10">
                    <AvatarImage src={`https://picsum.photos/seed/${user?.uid}/200/200`} />
                    <AvatarFallback>{profile?.name?.charAt(0) || 'U'}</AvatarFallback>
                  </Avatar>
                </div>
                <Button variant="outline" className="h-10 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 px-8 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-white transition-all">
                  Change Photo
                </Button>
              </div>

              {/* Form Column */}
              <div className="flex-1 w-full space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Full Name</Label>
                  <Input 
                    defaultValue={profile?.name || ''}
                    className="h-12 bg-white/5 border-white/10 rounded-xl focus:border-primary/50 transition-all text-sm px-6"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Email Address</Label>
                  <Input 
                    defaultValue={user?.email || ''}
                    disabled
                    className="h-12 bg-white/10 border-white/10 rounded-xl text-sm px-6 opacity-60 cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Role</Label>
                    <Input 
                      defaultValue={profile?.role?.toUpperCase() || ''}
                      disabled
                      className="h-12 bg-white/10 border-white/10 rounded-xl text-sm px-6 opacity-60 cursor-not-allowed"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Wallet Balance</Label>
                    <Input 
                      defaultValue={`₦${profile?.walletBalance?.toLocaleString() || '0'}`}
                      disabled
                      className="h-12 bg-white/10 border-white/10 rounded-xl text-sm px-6 opacity-60 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Country</Label>
                  <Select defaultValue="in">
                    <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/30 px-6">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-white/10">
                      <SelectItem value="in">Nigeria</SelectItem>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Account Settings Section */}
          <GlassCard className="p-10 border-white/10 space-y-10">
            <h3 className="text-lg font-headline font-bold text-muted-foreground/80 tracking-wide">Account Settings</h3>
            
            <div className="space-y-8">
              <div className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <Checkbox id="email-notifs" defaultChecked className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary" />
                  <Label htmlFor="email-notifs" className="text-sm font-medium text-white/80 cursor-pointer">Email Notifications</Label>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">Enabled</span>
                  <Switch defaultChecked className="data-[state=checked]:bg-primary" />
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button className="h-14 px-12 rounded-2xl bg-gradient-to-r from-primary to-secondary text-base font-bold shadow-[0_0_30px_rgba(239,26,184,0.4)] hover:opacity-90 active:scale-[0.98] transition-all">
                  Save Settings
                </Button>
              </div>
            </div>
          </GlassCard>

        </div>

        {/* Footer Text */}
        <div className="text-center py-8 border-t border-white/5">
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">© 2024 CampusSpend. All rights reserved.</p>
        </div>

      </div>
    </DashboardShell>
  )
}
