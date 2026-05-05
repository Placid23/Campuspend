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
  CalendarIcon
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
import { collection, query, orderBy, where } from 'firebase/firestore'
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase'
import { format, startOfMonth, endOfMonth, isSameDay } from 'date-fns'

const COLORS = ['#ef1ab8', '#bc66eb', '#f59e0b', '#10b981', '#3b82f6', '#ec4899'];

export default function SpendingSummaryPage() {
  const { user, profile } = useUser()
  const db = useFirestore()

  // Fetch real expenses
  const expensesQuery = useMemoFirebase(() => {
    if (!user) return null
    return query(
      collection(db, "users", user.uid, "expenses"),
      orderBy("expenseDate", "desc")
    )
  }, [db, user])

  const { data: expenses, isLoading } = useCollection(expensesQuery)

  // Derived Data
  const totalSpent = React.useMemo(() => {
    return expenses?.reduce((sum, exp) => sum + exp.amount, 0) || 0
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
      value: parseFloat(((value / totalSpent) * 100).toFixed(1)),
      amount: value,
      color: COLORS[i % COLORS.length]
    }))
  }, [expenses, totalSpent])

  const weeklyData = React.useMemo(() => {
    if (!expenses) return []
    // Simplified: group by week offset from today
    const weeks: Record<string, number> = { 'Week 1': 0, 'Week 2': 0, 'Week 3': 0, 'Week 4': 0 }
    // Just mock structure for now using real totals
    return Object.entries(weeks).map(([name, val], i) => ({
      name,
      total: i === 3 ? totalSpent * 0.4 : totalSpent * 0.2 // Mocking distribution for chart
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
          <h1 className="text-4xl font-headline font-bold">Spending <span className="text-primary neon-text-glow">Summary</span></h1>
          <p className="text-muted-foreground text-sm max-w-2xl">Review your current spending trends and budget progress based on real transactions.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <GlassCard className="p-8 border-white/10 space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Budget Progress & Stats */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-headline font-bold uppercase tracking-widest text-muted-foreground/80">Your Budget Progress</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                         <div className="h-10 px-4 rounded-xl bg-primary/20 border border-primary/30 flex items-center gap-2">
                           <Zap className="w-4 h-4 text-primary" />
                           <span className="text-sm font-bold text-white">₦{totalSpent.toLocaleString()} Spent</span>
                         </div>
                         <div className="h-10 px-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-400">
                           ₦{( (profile?.monthlyBudget || 8000) - totalSpent).toLocaleString()} Left
                         </div>
                      </div>
                      <Progress value={budgetProgress} className="h-2 bg-white/5 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-secondary" />
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                        {budgetProgress >= 100 ? "You have exceeded your monthly budget!" : `Using ${budgetProgress.toFixed(1)}% of your ₦${profile?.monthlyBudget?.toLocaleString() || '8,000'} limit`}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-headline font-bold uppercase tracking-widest text-muted-foreground/80">Expense Breakdown</h3>
                    <div className="space-y-4 text-sm">
                      {categoryBreakdown.slice(0, 4).map((item, i) => (
                        <div key={i} className="flex justify-between items-center group cursor-pointer hover:text-primary transition-colors">
                          <span className="text-muted-foreground group-hover:text-white flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                            {item.name}
                          </span>
                          <span className="font-bold">₦{item.amount.toLocaleString()}</span>
                        </div>
                      ))}
                      {categoryBreakdown.length === 0 && <p className="text-xs text-muted-foreground italic">No expense data available yet.</p>}
                    </div>
                  </div>
                </div>

                {/* Donut Chart */}
                <div className="relative flex flex-col items-center justify-center pt-8">
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

                  {/* Donut Legend */}
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4">
                    {categoryBreakdown.map((entry, i) => (
                      <div key={i} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span className="truncate max-w-[60px]">{entry.name}</span>
                        <span className="ml-auto text-white">{entry.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Row: Recent Purchases */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                <div className="space-y-6">
                  <h3 className="text-lg font-headline font-bold uppercase tracking-widest text-muted-foreground/80">Recent Activity</h3>
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
                  <h3 className="text-lg font-headline font-bold uppercase tracking-widest text-muted-foreground/80">Insights</h3>
                  <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                       <Lightbulb className="w-5 h-5 text-primary" />
                    </div>
                    <div className="space-y-2">
                       <p className="text-sm text-white/80 leading-relaxed font-medium">
                          {totalSpent > ((profile?.monthlyBudget || 8000) * 0.8) 
                            ? "You are nearing your budget limit. Consider pausing non-essential purchases."
                            : "Your spending is currently within healthy limits. Keep it up!"}
                       </p>
                       <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Status: {budgetProgress > 80 ? 'Critical' : 'Healthy'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <GlassCard className="p-8 border-white/10 space-y-8">
              <h3 className="text-xl font-headline font-bold">Spending Trend</h3>
              
              <div className="h-[180px] w-full mt-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} 
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(239,26,184,0.3)', borderRadius: '12px' }}
                      itemStyle={{ color: '#ef1ab8' }}
                    />
                    <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                      {weeklyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 3 ? '#ef1ab8' : 'rgba(239,26,184,0.3)'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
                  Historical data analysis helps you predict future spending needs.
                </p>
                <Link href="/orders" className="block w-full">
                  <Button className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-secondary text-base font-bold shadow-[0_0_30px_rgba(239,26,184,0.3)] hover:opacity-90 active:scale-[0.98] transition-all">
                    View Order History
                  </Button>
                </Link>
                <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                   <TrendingUp className="w-3 h-3 text-emerald-400" /> Transactions Tracked
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Footer Text */}
        <div className="text-center py-12 border-t border-white/5">
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">© 2024 CampusSpend. All rights reserved.</p>
        </div>

      </div>
    </DashboardShell>
  )
}
