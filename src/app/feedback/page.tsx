
"use client"

import * as React from "react"
import { useState } from "react"
import { DashboardShell } from "@/components/layout/Shell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  PieChart as RePieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as ReTooltip 
} from "recharts"
import { 
  Frown, 
  Meh, 
  Smile, 
  Laugh, 
  Angry,
  ChevronDown,
  ChefHat,
  Pizza,
  BookOpen,
  PenTool,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"

const spendingData = [
  { name: 'Burger', value: 1900, color: '#ef1ab8' },
  { name: 'Pizza', value: 1440, color: '#bc66eb' },
  { name: 'Books', value: 1040, color: '#f59e0b' },
  { name: 'Stationery', value: 600, color: '#10b981' },
  { name: 'Shawarma', value: 375, color: '#3b82f6' },
]

const ratings = [
  { id: 'angry', icon: Angry, color: 'text-rose-500', shadow: 'shadow-[0_0_20px_rgba(244,63,94,0.4)]' },
  { id: 'sad', icon: Frown, color: 'text-orange-400', shadow: 'shadow-[0_0_20px_rgba(251,146,60,0.4)]' },
  { id: 'neutral', icon: Meh, color: 'text-amber-400', shadow: 'shadow-[0_0_20px_rgba(251,191,36,0.4)]' },
  { id: 'happy', icon: Smile, color: 'text-emerald-400', shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.4)]' },
  { id: 'ecstatic', icon: Laugh, color: 'text-lime-400', shadow: 'shadow-[0_0_20px_rgba(163,230,53,0.4)]' },
]

export default function FeedbackPage() {
  const [selectedRating, setSelectedRating] = useState<string | null>(null)

  return (
    <DashboardShell>
      <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom duration-1000">
        
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-headline font-bold text-white neon-text-glow">We Value Your <span className="text-primary">Feedback!</span></h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Help us improve your experience by sharing your thoughts about CampusSpend.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Feedback Card (8 cols) */}
          <div className="lg:col-span-8">
            <GlassCard className="p-12 border-white/10 space-y-12 bg-white/5 backdrop-blur-3xl relative overflow-hidden">
              
              {/* Emoji Rating Row */}
              <div className="flex justify-center gap-6 md:gap-12">
                {ratings.map((rate) => (
                  <button
                    key={rate.id}
                    onClick={() => setSelectedRating(rate.id)}
                    className={cn(
                      "group relative transition-all duration-300",
                      selectedRating === rate.id ? "scale-125" : "hover:scale-110 opacity-60 hover:opacity-100"
                    )}
                  >
                    <div className={cn(
                      "w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all",
                      selectedRating === rate.id && rate.shadow,
                      selectedRating === rate.id && "bg-white/10 border-white/20"
                    )}>
                      <rate.icon className={cn("w-8 h-8 md:w-10 md:h-10", rate.color)} />
                    </div>
                  </button>
                ))}
              </div>

              {/* Form Section */}
              <div className="space-y-8">
                <div className="space-y-3">
                   <h3 className="text-xl font-headline font-bold text-center text-white/90">Tell us about your experience...</h3>
                   <Textarea 
                      placeholder="Tell us about your experience..." 
                      className="min-h-[180px] bg-white/5 border-white/10 rounded-2xl p-6 focus:border-primary/50 transition-all text-lg placeholder:text-muted-foreground/30"
                   />
                </div>

                <div className="space-y-3">
                   <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">Name (Optional)</p>
                   <Select>
                      <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-2xl px-6 focus:ring-primary/30">
                        <SelectValue placeholder="- Select Feedback Category" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-white/10">
                        <SelectItem value="service">Vendor Service</SelectItem>
                        <SelectItem value="app">App Experience</SelectItem>
                        <SelectItem value="pricing">Pricing & Deals</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                   </Select>
                </div>

                <div className="flex justify-center pt-4">
                  <Button className="w-full max-w-md h-16 rounded-2xl bg-gradient-to-r from-primary to-secondary text-xl font-bold shadow-[0_0_40px_rgba(239,26,184,0.4)] hover:opacity-90 active:scale-[0.98] transition-all">
                    Submit Feedback
                  </Button>
                </div>
              </div>

              {/* Support Info Footer */}
              <div className="text-center pt-8 border-t border-white/5 space-y-6">
                <p className="text-sm text-muted-foreground font-medium">
                  We appreciate all feedback — 'your input is valuable to us!
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-white/80">Having any issues? Contact our support team.</p>
                  <p className="text-primary font-bold">support@campusspend.com</p>
                </div>
                <div className="flex justify-center gap-2">
                   <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden relative">
                     <img src="https://picsum.photos/seed/s1/100/100" alt="Support" className="object-cover" />
                   </div>
                   <div className="w-8 h-8 rounded-full border border-white/20 overflow-hidden relative">
                     <img src="https://picsum.photos/seed/s2/100/100" alt="Support" className="object-cover" />
                   </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Spending Breakdown Sidebar (4 cols) */}
          <div className="lg:col-span-4">
            <GlassCard className="p-8 border-white/10 space-y-8 bg-white/5">
              <h3 className="text-xl font-headline font-bold">Spending Breakdown</h3>
              
              <div className="space-y-2">
                 <p className="text-sm text-muted-foreground font-medium">Spent <span className="text-white font-bold ml-2 text-lg">₦5,725</span></p>
              </div>

              <div className="relative h-[240px] flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={spendingData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {spendingData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <ReTooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    />
                  </RePieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                   <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">+590</p>
                   <p className="text-sm font-bold">₦5,726</p>
                </div>
              </div>

              <div className="space-y-4">
                {spendingData.map((item, i) => (
                  <div key={i} className="flex justify-between items-center group cursor-pointer">
                    <div className="flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                       <span className="text-sm text-muted-foreground group-hover:text-white transition-colors">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold">₦{item.value}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Bottom Category Selector Component */}
        <div className="flex justify-center pt-8">
           <GlassCard className="inline-flex gap-8 px-10 py-4 rounded-full border-white/5 bg-white/5 backdrop-blur-3xl">
              {[
                { label: "Burger", id: "burger", icon: ChefHat },
                { label: "Pizza", id: "pizza", icon: Pizza },
                { label: "Books", id: "books", icon: BookOpen },
                { label: "Books", id: "books2", icon: BookOpen },
                { label: "Stationery", id: "stationery", icon: PenTool }
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

        {/* Footer Text */}
        <div className="text-center py-8 border-t border-white/5">
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">© 2024 CampusSpend. All rights reserved.</p>
        </div>

      </div>
    </DashboardShell>
  )
}
