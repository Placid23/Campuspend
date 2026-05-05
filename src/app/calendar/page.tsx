"use client"

import * as React from "react"
import { DashboardShell } from "@/components/layout/Shell"
import { GlassCard } from "@/components/ui/glass-card"
import { 
  Zap, 
  ChevronDown, 
  BarChart3, 
  Lightbulb,
  Clock,
  ChevronRight,
  TrendingUp,
  PieChart,
  ShoppingBag,
  ChefHat,
  Pizza,
  BookOpen,
  PenTool,
  Store,
  Loader2,
  CalendarIcon,
  AlertCircle,
  Calendar as LucideCalendar
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart as RePieChart,
  Pie,
  Cell as PieCell
} from 'recharts'
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { collection, query, orderBy, where, doc } from 'firebase/firestore'
import { useFirestore, useUser, useCollection, useDoc, useMemoFirebase } from '@/firebase'
import { format, startOfMonth, endOfMonth, isSameDay, startOfDay } from 'date-fns'
import { Calendar } from "@/components/ui/calendar"

const COLORS = ['#ef1ab8', '#bc66eb', '#f59e0b', '#10b981', '#3b82f6', '#ec4899'];

export default function SpendingSummaryPage() {
  const { user, profile } = useUser()
  const db = useFirestore()

  // 1. Fetch Global System Thresholds
  const thresholdRef = useMemoFirebase(() => doc(db, "system_config", "thresholds"), [db])
  const { data: thresholds } = useDoc(thresholdRef)
  const dailyLimit = thresholds?.dailySpendingLimit || 2500

  // 2. Fetch real expenses
  const expensesQuery = useMemoFirebase(() => {
    if (!user) return null
    return query(
      collection(db, "users", user.uid, "expenses"),
      orderBy("expenseDate", "desc")
    )
  }, [db, user])

  const { data: expenses, isLoading } = useCollection(expensesQuery)

  // 3. Derived Data
  const totalSpent = React.useMemo(() => {
    return expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0
  }, [expenses])

  const dailyTotals = React.useMemo(() => {
    if (!expenses) return {}
    const map: Record<string, number> = {}
    expenses.forEach(exp => {
      const d = format(new Date(exp.expenseDate), 'yyyy-MM-dd')
      map[d] = (map[d] || 0) + exp.amount
    })
    return map
  }, [expenses])

  const budgetProgress = React.useMemo(() => {
    if (!profile?.monthlyBudget) return 0
    return Math.min((totalSpent / profile.monthlyBudget) * 100, 100)
  }, [totalSpent, profile])

  const categoryBreakdown = React.useMemo(() => {
    if (!expenses) return []
    const counts: Record<string, number> = {}
    expenses.forEach(exp => {
      const cat = exp.categoryId || 'Other'
      counts[cat] = (counts[cat] || 0) + exp.amount
    })
    return Object.entries(counts).map(([name, value], i) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: parseFloat(((value / (totalSpent || 1)) * 100).toFixed(1)),
      amount: value,
      color: COLORS[i % COLORS.length]
    }))
  }, [expenses, totalSpent])

  if (isLoading) {
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
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-4xl font-headline font-bold">Expenditure <span className="text-primary neon-text-glow">Map</span></h1>
          <p className="text-muted-foreground text-sm max-w-2xl">Interactive heatmap mapping your real-time behavioral spending nodes.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content: Heatmap Calendar (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <GlassCard className="p-8 border-white/10 space-y-8 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1">
                   <h3 className="text-xl font-headline font-bold text-white flex items-center gap-2">
                     <LucideCalendar className="w-5 h-5 text-primary" /> Behavioral Calendar
                   </h3>
                   <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Threshold: ₦{dailyLimit.toLocaleString()} / Day</p>
                </div>
                <div className="flex gap-4">
                   <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-emerald-400">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Efficient
                   </div>
                   <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-amber-400">
                      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Warning
                   </div>
                   <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-rose-500">
                      <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" /> Leakage
                   </div>
                </div>
              </div>

              <div className="flex justify-center py-4 bg-white/5 rounded-[2rem] border border-white/5 shadow-inner">
                <Calendar
                  mode="single"
                  className="rounded-none border-none p-4"
                  modifiers={{
                    overLimit: (date) => dailyTotals[format(date, 'yyyy-MM-dd')] > dailyLimit,
                    nearLimit: (date) => {
                      const total = dailyTotals[format(date, 'yyyy-MM-dd')]
                      return total > dailyLimit * 0.8 && total <= dailyLimit
                    },
                    underLimit: (date) => {
                      const total = dailyTotals[format(date, 'yyyy-MM-dd')]
                      return total > 0 && total <= dailyLimit * 0.8
                    }
                  }}
                  modifiersClassNames={{
                    overLimit: "bg-rose-500/20 text-rose-500 border border-rose-500/50 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse",
                    nearLimit: "bg-amber-500/20 text-amber-500 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)] animate-pulse",
                    underLimit: "bg-emerald-500/20 text-emerald-500 border border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse"
                  }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                <div className="space-y-6">
                  <h3 className="text-lg font-headline font-bold uppercase tracking-widest text-muted-foreground/80">Audit Summary</h3>
                  <div className="space-y-4">
                    {expenses?.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex items-center gap-4 group cursor-pointer">
                        <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10 group-hover:border-primary/30 transition-all">
                           <ShoppingBag className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-sm font-bold truncate">{item.description}</p>
                           <p className="text-[10px] text-muted-foreground uppercase font-medium">
                             {format(new Date(item.expenseDate), 'MMM d, h:mm a')}
                           </p>
                        </div>
                        <div className="text-sm font-bold text-primary">₦{item.amount.toLocaleString()}</div>
                      </div>
                    ))}
                    {(!expenses || expenses.length === 0) && (
                      <div className="py-4 text-center">
                        <p className="text-xs text-muted-foreground italic">No recent transactions recorded.</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-headline font-bold uppercase tracking-widest text-muted-foreground/80">AI Insights</h3>
                  <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                       <Lightbulb className="w-5 h-5 text-primary" />
                    </div>
                    <div className="space-y-2">
                       <p className="text-sm text-white/80 leading-relaxed font-medium">
                          {totalSpent > ((profile?.monthlyBudget || 8000) * 0.8) 
                            ? "Dynamic Threshold Alert: You have utilized over 80% of your monthly allocation."
                            : "Healthy Trajectory: Your daily nodes are currently within the efficient emerald zone."}
                       </p>
                       <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Tactical Status: {budgetProgress > 80 ? 'Critical' : 'Balanced'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Sidebar Metrics (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <GlassCard className="p-8 border-white/10 space-y-8 bg-black/20">
              <h3 className="text-xl font-headline font-bold">Category Variance</h3>
              
              <div className="relative flex flex-col items-center justify-center">
                  <div className="w-full h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={categoryBreakdown.length > 0 ? categoryBreakdown : [{ name: 'Empty', value: 100, color: 'rgba(255,255,255,0.05)' }]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {categoryBreakdown.map((entry, index) => (
                            <PieCell key={`cell-${index}`} fill={entry.color} stroke="none" />
                          ))}
                          {categoryBreakdown.length === 0 && <PieCell fill="rgba(255,255,255,0.05)" stroke="none" />}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(239,26,184,0.3)', borderRadius: '12px' }}
                        />
                      </RePieChart>
                    </ResponsiveContainer>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total</p>
                       <p className="text-lg font-bold">₦{totalSpent.toLocaleString()}</p>
                    </div>
                  </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground/80">Budget Utilization</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                       <div className="h-10 px-4 rounded-xl bg-primary/20 border border-primary/30 flex items-center gap-2">
                         <Zap className="w-4 h-4 text-primary" />
                         <span className="text-sm font-bold text-white">₦{totalSpent.toLocaleString()}</span>
                       </div>
                       <div className="h-10 px-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-400">
                         {budgetProgress.toFixed(0)}% Used
                       </div>
                    </div>
                    <Progress value={budgetProgress} className="h-2 bg-white/5 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-secondary" />
                  </div>
                </div>
                
                <Link href="/orders" className="block w-full pt-4">
                  <Button className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-secondary text-base font-bold shadow-[0_0_30px_rgba(239,26,184,0.3)] hover:opacity-90 active:scale-[0.98] transition-all">
                    Sync Order Logs
                  </Button>
                </Link>
                <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                   <TrendingUp className="w-3 h-3 text-emerald-400" /> PBL Engine Verified
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Footer Text */}
        <div className="text-center py-12 border-t border-white/5">
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">© 2024 CafePay Wallet. Academic Prototype v4.1</p>
        </div>

      </div>
    </DashboardShell>
  )
}
