
"use client"

import * as React from "react"
import { AdminShell } from "@/components/layout/AdminShell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  AlertCircle, 
  ChevronRight, 
  ChefHat, 
  Pizza, 
  BookOpen, 
  Box,
  Search,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function AdminThresholdSettingsPage() {
  return (
    <AdminShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        
        {/* Breadcrumb / Context Label */}
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
          <Search className="w-3 h-3" /> Spending Student... / <span className="text-white/80">Threshold Settings</span>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl font-headline font-bold text-white tracking-tight">Threshold Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Low Stock Threshold Card */}
          <GlassCard className="p-10 border-white/10 bg-black/20 backdrop-blur-3xl space-y-8 group hover:border-primary/40 transition-all">
            <div className="space-y-2">
              <h3 className="text-xl font-headline font-bold text-white">Low Stock Threshold</h3>
              <div className="space-y-1">
                <p className="text-sm font-bold text-primary/80">Current Setting: <span className="text-white">20 units</span></p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest leading-relaxed">
                  Set alert when product stock falls below this level.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Low Stock Threshold Units</Label>
                <Input 
                  defaultValue="20"
                  className="h-14 bg-white/5 border-white/10 rounded-2xl px-6 text-lg font-bold focus:border-primary/50 transition-all"
                />
              </div>
              <Button className="w-full max-w-[200px] h-12 rounded-xl bg-primary/20 hover:bg-primary/30 border border-primary/40 text-xs font-bold uppercase tracking-widest text-primary transition-all">
                Update Threshold
              </Button>
            </div>
          </GlassCard>

          {/* Spending Limit Threshold Card */}
          <GlassCard className="p-10 border-white/10 bg-black/20 backdrop-blur-3xl space-y-8 group hover:border-secondary/40 transition-all">
            <div className="space-y-2">
              <h3 className="text-xl font-headline font-bold text-white">Spending Limit Threshold</h3>
              <div className="space-y-1">
                <p className="text-sm font-bold text-secondary/80">Current Setting: <span className="text-white">₦2,500</span></p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest leading-relaxed">
                  Set daily individual spending limit for students.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Daily Spending Limit</Label>
                <div className="relative">
                  <Input 
                    defaultValue="₦2,500"
                    className="h-14 bg-white/5 border-white/10 rounded-2xl px-6 text-lg font-bold focus:border-secondary/50 transition-all"
                  />
                </div>
              </div>
              <Button className="w-full max-w-[200px] h-12 rounded-xl bg-secondary/20 hover:bg-secondary/30 border border-secondary/40 text-xs font-bold uppercase tracking-widest text-secondary transition-all">
                Update Threshold
              </Button>
            </div>
          </GlassCard>

        </div>

        {/* Floating Bottom Nav */}
        <div className="flex justify-center pt-8 pb-12">
           <GlassCard className="inline-flex gap-10 px-12 py-4 rounded-full border-white/10 bg-black/20 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              {[
                { label: "Burger", id: "burger", icon: ChefHat },
                { label: "Pizza", id: "pizza", icon: Pizza },
                { label: "Books", id: "books1", icon: BookOpen },
                { label: "Books", id: "books2", icon: Box }
              ].map((nav, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer opacity-60 hover:opacity-100 transition-all hover:scale-110">
                   <div className="w-10 h-10 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
                      <nav.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                   </div>
                   <span className="text-[8px] font-bold uppercase tracking-[0.2em]">{nav.label}</span>
                </div>
              ))}
           </GlassCard>
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-white/5">
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">© 2024 CampusSpend. All rights reserved.</p>
        </div>

      </div>
    </AdminShell>
  )
}
