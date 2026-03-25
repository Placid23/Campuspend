
"use client"

import * as React from "react"
import { VendorShell } from "@/components/layout/VendorShell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Star, 
  ChevronDown, 
  Mail, 
  Phone, 
  MapPin, 
  Zap, 
  CreditCard,
  ChefHat,
  Pizza,
  BookOpen,
  PenTool,
  TrendingUp,
  MoreVertical,
  User,
  Settings
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const recentActivity = [
  { name: "QDBurger Bundle", time: "15 mins ago", price: "₦ +450", desc: "₦300 to - Abok corner", image: "https://picsum.photos/seed/burger-act/100/100" },
  { name: "Pepperoni Pizza", time: "40 mins ago", price: "₦ +925", desc: "₦230 to - Prajo nach", image: "https://picsum.photos/seed/pizza-act/100/100" },
  { name: "Classic Burger", time: "1 hour ago", price: "₦ +500", desc: "₦300 to - Analys wiente", image: "https://picsum.photos/seed/user-act/100/100", isUser: true, userAvatar: "https://picsum.photos/seed/u1/100/100" },
]

export default function VendorProfilePage() {
  return (
    <VendorShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
        
        {/* Header Title */}
        <div className="space-y-2">
          <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Vendor <span className="text-primary neon-text-glow">Profile</span></h1>
          <p className="text-muted-foreground text-sm">Manage your store identity and account preferences.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Profile Card (col-span-4) */}
          <div className="lg:col-span-4 space-y-6">
            <GlassCard className="p-8 border-white/10 flex flex-col items-center text-center space-y-6 bg-white/5 backdrop-blur-3xl">
              <div className="relative w-48 h-48">
                <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-50 animate-pulse"></div>
                <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden border-2 border-primary/30 shadow-[0_0_30px_rgba(239,26,184,0.2)]">
                  <Image 
                    src="https://picsum.photos/seed/burger-profile/400/400" 
                    alt="Vendor Avatar" 
                    fill 
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-headline font-bold text-white">QFoodHub Café</h2>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">#VT123456</p>
                <div className="flex items-center justify-center gap-1">
                  {[1, 2, 3, 4].map(i => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                  <Star className="w-4 h-4 fill-amber-400/50 text-amber-400/50" />
                  <span className="text-sm font-bold text-white ml-2">4.8</span>
                </div>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Based 3,200 Reviews</p>
              </div>

              <div className="w-full space-y-4">
                <div className="h-16 w-full rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center justify-center px-4">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Balance</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-white">₦12,950</span>
                    <div className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[8px] font-bold uppercase flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> Open
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2 text-left w-full px-2">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                    <Mail className="w-3 h-3 text-primary" />
                    <span className="truncate">qfoodhub@campusmail.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                    <Phone className="w-3 h-3 text-primary" />
                    <span>+234 800 1234567</span>
                  </div>
                </div>

                <Button className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-secondary text-base font-bold shadow-[0_0_30px_rgba(239,26,184,0.4)] hover:opacity-90 active:scale-[0.98] transition-all">
                  Update Profile
                </Button>
              </div>
            </GlassCard>
          </div>

          {/* Right Area: Form and Info (col-span-8) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Form Card */}
              <GlassCard className="p-8 border-white/10 space-y-6 bg-white/5 backdrop-blur-3xl">
                <div className="flex items-center gap-3 mb-2">
                  <Settings className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-headline font-bold text-white">General Settings</h3>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Vendor Name</Label>
                    <Input 
                      defaultValue="QFoodHub Café"
                      className="h-12 bg-white/5 border-white/10 rounded-xl px-6 focus:border-primary/50 transition-all text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Contact Email</Label>
                    <Input 
                      defaultValue="qfoodhub@campusmail.com"
                      className="h-12 bg-white/5 border-white/10 rounded-xl px-6 focus:border-primary/50 transition-all text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Contact Number</Label>
                    <Input 
                      defaultValue="+234 800 1234567"
                      className="h-12 bg-white/5 border-white/10 rounded-xl px-6 focus:border-primary/50 transition-all text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Address</Label>
                    <textarea 
                      className="w-full min-h-[100px] bg-white/5 border border-white/10 rounded-xl p-6 focus:border-primary/50 transition-all text-sm outline-none resize-none text-white/80"
                      defaultValue="Lagos Campus, University Way, Nigeria"
                    />
                  </div>
                </div>
              </GlassCard>

              {/* Info & Bank Card */}
              <GlassCard className="p-8 border-white/10 space-y-8 bg-white/5 backdrop-blur-3xl">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-headline font-bold text-white">Billing Information</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Bank Account</p>
                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-white/80">Nigerian Bank</span>
                        <Badge className="bg-primary/20 text-primary border-none text-[8px] uppercase">Default</Badge>
                      </div>
                      <p className="text-base font-bold text-white/60 tracking-[0.2em]">**** **** **** 3456</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Security</p>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-widest">
                        Change Password
                      </Button>
                      <Button variant="outline" className="w-full h-12 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-xs font-bold uppercase tracking-widest text-rose-400 hover:text-rose-500">
                        Deactivate Account
                      </Button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>

            {/* Recent Activity Full Width */}
            <div className="space-y-6">
              <h3 className="text-xl font-headline font-bold text-white">Recent Activity</h3>
              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <GlassCard key={i} className="p-4 border-white/5 hover:border-primary/20 transition-all flex items-center gap-6 group">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                      {activity.isUser ? (
                        <Image src={activity.userAvatar!} alt="User" fill className="object-cover" />
                      ) : (
                        <Image src={activity.image} alt={activity.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <h4 className="text-base font-bold text-white">{activity.name}</h4>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{activity.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{activity.desc}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-primary neon-text-glow">{activity.price}</p>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Floating Bottom Nav */}
        <div className="flex justify-center pt-8 pb-12">
           <GlassCard className="inline-flex gap-8 px-10 py-4 rounded-full border-white/5 bg-white/5 backdrop-blur-3xl">
              {[
                { label: "Binger", id: "binger", icon: ChefHat },
                { label: "Place", id: "place", icon: Zap },
                { label: "Books", id: "books1", icon: BookOpen },
                { label: "Books", id: "books2", icon: BookOpen },
                { label: "Stationary", id: "stationary", icon: TrendingUp }
              ].map((nav, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
                   <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
                      <nav.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                   </div>
                   <span className="text-[8px] font-bold uppercase tracking-widest">{nav.label}</span>
                </div>
              ))}
           </GlassCard>
        </div>

        {/* Footer */}
        <div className="text-center py-4 border-t border-white/5">
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">© 2024 CampusSpend: All rights reserved.</p>
        </div>

      </div>
    </VendorShell>
  )
}
