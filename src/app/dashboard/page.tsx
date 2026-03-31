"use client"

import * as React from "react"
import { DashboardShell } from "@/components/layout/Shell"
import { GlassCard } from "@/components/ui/glass-card"
import { 
  ArrowRight, 
  ShoppingBag, 
  Zap, 
  Search,
  ChevronRight,
  ChevronLeft,
  Star,
  Heart,
  TrendingUp,
  CreditCard,
  Users,
  BrainCircuit,
  LayoutDashboard,
  Store,
  ClipboardList,
  Loader2,
  ShoppingCart
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, where, orderBy } from 'firebase/firestore'
import { isToday } from 'date-fns'

export default function DashboardPage() {
  const { user, profile, isProfileLoading } = useUser()
  const db = useFirestore()

  // Fetch real orders count
  const ordersQuery = useMemoFirebase(() => {
    if (!user) return null
    return query(collection(db, "users", user.uid, "orders"))
  }, [db, user])
  const { data: orders } = useCollection(ordersQuery)

  // Fetch today's spending
  const expensesQuery = useMemoFirebase(() => {
    if (!user) return null
    return query(collection(db, "users", user.uid, "expenses"))
  }, [db, user])
  const { data: expenses } = useCollection(expensesQuery)

  const todaySpending = React.useMemo(() => {
    return expenses?.filter(e => {
      try {
        return isToday(new Date(e.expenseDate))
      } catch {
        return false
      }
    }).reduce((sum, e) => sum + e.amount, 0) || 0
  }, [expenses])

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
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left/Center Content (8 cols) */}
          <div className="lg:col-span-8 space-y-8 order-2 lg:order-1">
            
            {/* Header / Welcome */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-headline font-bold text-center md:text-left">
                  Welcome, <span className="text-primary neon-text-glow">{profile?.name || 'Student'}!</span>
                </h1>
                <p className="text-muted-foreground text-sm text-center md:text-left max-w-lg mx-auto md:mx-0">
                  Manage your tray, track your Naira (₦) expenses, and stay within your budget.
                </p>
              </div>
              <Link href="/vendors" className="w-full md:w-auto">
                <Button className="glow-button rounded-2xl h-12 bg-primary px-8 group w-full">
                  Browse Vendors <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Spending Cards */}
            <div className="space-y-6">
              <GlassCard className="bg-gradient-to-r from-card/80 to-primary/5 border-primary/20 p-6 md:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4 mb-6 text-center sm:text-left">
                  <div className="space-y-1">
                    <h3 className="text-lg md:text-xl font-headline font-bold">Wallet Balance</h3>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Available Funds</p>
                  </div>
                  <div className="text-center sm:text-right">
                    <span className="text-xs text-muted-foreground mr-2">₦</span>
                    <span className="text-3xl font-bold">{profile?.walletBalance?.toLocaleString() || '0.00'}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden relative">
                    <div className="h-full w-[100%] bg-gradient-to-r from-primary to-secondary absolute left-0 top-0 shadow-[0_0_20px_rgba(239,26,184,0.5)]"></div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                    <p className="text-xs text-muted-foreground">Budget Limit: ₦<span className="text-foreground font-bold">{profile?.monthlyBudget?.toLocaleString() || '0'}</span></p>
                    <Badge className="bg-emerald-500/20 text-emerald-500 border-none px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Active Wallet</Badge>
                  </div>
                </div>
              </GlassCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="p-6 border-white/5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-sm uppercase tracking-tight">Today's Spending</h3>
                    <div className="text-right">
                       <span className="text-xs text-muted-foreground mr-1">₦</span>
                       <span className="font-bold">{todaySpending.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Progress value={Math.min((todaySpending / 500) * 100, 100)} className="h-2 bg-white/5 [&>div]:bg-primary" />
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] text-muted-foreground">Daily Limit Estimate: ₦500</p>
                      <Badge className={cn("border-none text-[8px] font-bold uppercase tracking-widest px-2 py-0.5", todaySpending > 500 ? "bg-rose-500/10 text-rose-400" : "bg-emerald-500/10 text-emerald-400")}>
                        {todaySpending > 500 ? "Over Limit" : "Healthy"}
                      </Badge>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-6 border-white/5 flex flex-col justify-center items-center text-center space-y-2 group hover:border-primary/30 transition-all">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Total Orders</p>
                  <h3 className="text-5xl font-headline font-bold text-primary group-hover:scale-110 transition-transform">
                    {orders?.length || 0}
                  </h3>
                  <div className="flex items-center gap-1 text-[8px] text-muted-foreground font-bold uppercase">
                    <TrendingUp className="w-3 h-3 text-muted-foreground" /> Orders recorded in database
                  </div>
                </GlassCard>
              </div>
            </div>

            {/* Recent History */}
            <GlassCard className="p-6 md:p-8 border-white/5">
               <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                 <h3 className="text-xl font-headline font-bold">Recent History</h3>
                 <Link href="/calendar">
                   <Button variant="ghost" size="sm" className="text-primary text-[10px] font-bold uppercase tracking-widest hover:bg-primary/10">View Detailed Report</Button>
                 </Link>
               </div>

               <div className="space-y-4">
                  {expenses?.slice(0, 5).map((exp, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/20 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary">
                             <CreditCard className="w-4 h-4" />
                          </div>
                          <div>
                             <p className="text-sm font-bold">{exp.description}</p>
                             <p className="text-[10px] text-muted-foreground uppercase font-medium">{new Date(exp.expenseDate).toLocaleDateString()}</p>
                          </div>
                       </div>
                       <p className="text-sm font-bold text-white">₦{exp.amount.toLocaleString()}</p>
                    </div>
                  ))}
                  {(!expenses || expenses.length === 0) && (
                    <div className="py-12 text-center space-y-2">
                       <ClipboardList className="w-10 h-10 text-muted-foreground/20 mx-auto" />
                       <p className="text-[10px] text-muted-foreground uppercase font-bold">No transactions found</p>
                    </div>
                  )}
               </div>
            </GlassCard>

          </div>

          {/* Right Sidebar Marketplace (4 cols) */}
          <div className="lg:col-span-4 space-y-8 order-1 lg:order-2">
            <GlassCard className="p-6 border-white/5 space-y-8">
              
              {/* Order Box */}
              <div className="space-y-4">
                <h3 className="text-lg font-headline font-bold">Order from Vendors</h3>
                <div className="bg-primary/5 border border-dashed border-primary/20 rounded-2xl p-8 text-center space-y-4">
                  <Store className="w-8 h-8 text-primary mx-auto" />
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Discover verified campus merchants</p>
                  <Link href="/vendors" className="block">
                    <Button size="sm" className="w-full bg-primary/20 text-primary hover:bg-primary/30 border border-primary/40 text-[10px] font-bold uppercase">Explore Marketplace</Button>
                  </Link>
                </div>
              </div>

              {/* Quick Tray Access */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Quick Tray Access</h4>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Digital Wallet Ready</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">Your wallet is synced. Items added to your tray will be calculated using your Naira balance.</p>
                  <Link href="/cart" className="block pt-2">
                    <Button variant="outline" size="sm" className="w-full h-8 text-[8px] font-bold uppercase tracking-widest border-white/10">View My Tray <ShoppingCart className="ml-2 w-3 h-3" /></Button>
                  </Link>
                </div>
              </div>

              {/* Bottom Quick Stats */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                <div className="space-y-1 group cursor-default">
                  <div className="flex items-center gap-2 text-primary group-hover:neon-text-glow transition-all">
                    <Store className="w-4 h-4" /> <span className="text-xl font-headline font-bold">Live</span>
                  </div>
                  <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest">Ecosystem</p>
                </div>
                <div className="space-y-1 group cursor-default">
                  <div className="flex items-center gap-2 text-primary group-hover:neon-text-glow transition-all">
                    <Zap className="w-4 h-4" /> <span className="text-xl font-headline font-bold">100%</span>
                  </div>
                  <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest">Verified</p>
                </div>
              </div>

            </GlassCard>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-12 pb-24 md:pb-8 text-center border-t border-white/5">
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.3em]">© 2024 CampusSpend • Future of Student Finance</p>
        </div>

      </div>
    </DashboardShell>
  )
}
