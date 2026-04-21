
"use client"

import * as React from "react"
import { DashboardShell } from "@/components/layout/Shell"
import { GlassCard } from "@/components/ui/glass-card"
import { 
  ArrowRight, 
  ShoppingBag, 
  Zap, 
  ChevronRight,
  TrendingUp,
  CreditCard,
  ClipboardList,
  Loader2,
  ShoppingCart,
  Plus
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, limit, orderBy, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { isToday } from 'date-fns'
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const { user, profile, isProfileLoading } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  
  const [isTopUpOpen, setIsTopUpOpen] = React.useState(false)
  const [topUpAmount, setTopUpAmount] = React.useState("1000")
  const [isProcessing, setIsProcessing] = React.useState(false)

  const ordersQuery = useMemoFirebase(() => {
    if (!user) return null
    return query(
      collection(db, "users", user.uid, "orders"), 
      orderBy("orderDate", "desc"),
      limit(5)
    )
  }, [db, user?.uid])

  const expensesQuery = useMemoFirebase(() => {
    if (!user) return null
    return query(
      collection(db, "users", user.uid, "expenses"), 
      orderBy("expenseDate", "desc"),
      limit(5)
    )
  }, [db, user?.uid])

  const { data: orders } = useCollection(ordersQuery)
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

  const handleTopUp = async () => {
    if (!user || !profile) return
    const amount = parseFloat(topUpAmount)
    if (isNaN(amount) || amount <= 0) return

    setIsProcessing(true)
    try {
      const userRef = doc(db, "userProfiles", user.uid)
      await updateDoc(userRef, {
        walletBalance: (profile.walletBalance || 0) + amount,
        updatedAt: new Date().toISOString()
      })
      toast({
        title: "Funds Added!",
        description: `₦${amount.toLocaleString()} has been added to your wallet.`
      })
      setIsTopUpOpen(false)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Top-up Failed",
        description: "Could not update wallet balance."
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (isProfileLoading || !user) {
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8 order-2 lg:order-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-headline font-bold text-center md:text-left">
                  Welcome, <span className="text-primary neon-text-glow">{profile?.name || 'Student'}!</span>
                </h1>
                <p className="text-muted-foreground text-sm text-center md:text-left max-w-lg mx-auto md:mx-0">
                  Track your Naira (₦) expenses and stay within your budget.
                </p>
              </div>
              <Link href="/vendors" className="w-full md:w-auto">
                <Button className="glow-button rounded-2xl h-12 bg-primary px-8 group w-full">
                  Browse Vendors <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            <div className="space-y-6">
              <GlassCard className="bg-gradient-to-r from-card/80 to-primary/5 border-primary/20 p-6 md:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4 mb-6 text-center sm:text-left">
                  <div className="space-y-1">
                    <h3 className="text-lg md:text-xl font-headline font-bold">Wallet Balance</h3>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Available Funds</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center sm:text-right">
                      <span className="text-xs text-muted-foreground mr-2">₦</span>
                      <span className="text-3xl font-bold">{profile?.walletBalance?.toLocaleString() || '0.00'}</span>
                    </div>
                    
                    <Dialog open={isTopUpOpen} onOpenChange={setIsTopUpOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="rounded-xl border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-bold h-10 px-4">
                          <Plus className="w-4 h-4 mr-2" /> Top Up
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-card border-white/10">
                        <DialogHeader>
                          <DialogTitle className="text-white font-headline">Add Funds to Wallet</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Amount (₦)</Label>
                            <Input 
                              type="number" 
                              value={topUpAmount}
                              onChange={(e) => setTopUpAmount(e.target.value)}
                              className="h-12 bg-white/5 border-white/10 text-lg font-bold"
                            />
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                            {["500", "1000", "5000"].map(val => (
                              <Button key={val} variant="ghost" className="bg-white/5 border border-white/5 text-xs h-10" onClick={() => setTopUpAmount(val)}>₦{val}</Button>
                            ))}
                          </div>
                        </div>
                        <DialogFooter>
                          <Button onClick={handleTopUp} disabled={isProcessing} className="w-full bg-primary font-bold h-12 rounded-xl">
                            {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm Top Up"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden relative">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-secondary absolute left-0 top-0 shadow-[0_0_20px_rgba(239,26,184,0.5)] transition-all duration-1000"
                      style={{ width: `${Math.min((profile?.walletBalance / (profile?.monthlyBudget || 1)) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                    <p className="text-xs text-muted-foreground">Monthly Budget: ₦<span className="text-foreground font-bold">{profile?.monthlyBudget?.toLocaleString() || '0'}</span></p>
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
                    <Progress value={Math.min((todaySpending / 1000) * 100, 100)} className="h-2 bg-white/5 [&>div]:bg-primary" />
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] text-muted-foreground">Daily Limit (Est): ₦1,000</p>
                      <Badge className={cn("border-none text-[8px] font-bold uppercase tracking-widest px-2 py-0.5", todaySpending > 1000 ? "bg-rose-500/10 text-rose-400" : "bg-emerald-500/10 text-emerald-400")}>
                        {todaySpending > 1000 ? "Limit Exceeded" : "Healthy"}
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
                    <TrendingUp className="w-3 h-3 text-muted-foreground" /> Recent Recorded
                  </div>
                </GlassCard>
              </div>
            </div>

            <GlassCard className="p-6 md:p-8 border-white/5">
               <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                 <h3 className="text-xl font-headline font-bold">Recent History</h3>
                 <Link href="/calendar">
                   <Button variant="ghost" size="sm" className="text-primary text-[10px] font-bold uppercase hover:bg-primary/10">Full Report</Button>
                 </Link>
               </div>
               <div className="space-y-4">
                  {expenses?.map((exp, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/20 transition-all">
                       <div className="flex items-center gap-4">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary"><CreditCard className="w-4 h-4" /></div>
                          <div>
                             <p className="text-sm font-bold">{exp.description}</p>
                             <p className="text-[10px] text-muted-foreground uppercase">{new Date(exp.expenseDate).toLocaleDateString()}</p>
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

          <div className="lg:col-span-4 space-y-8 order-1 lg:order-2">
            <GlassCard className="p-6 border-white/5 space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-headline font-bold">Marketplace</h3>
                <div className="bg-primary/5 border border-dashed border-primary/20 rounded-2xl p-8 text-center space-y-4">
                  <ShoppingBag className="w-8 h-8 text-primary mx-auto" />
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">Discover campus merchants</p>
                  <Link href="/vendors" className="block">
                    <Button size="sm" className="w-full bg-primary/20 text-primary border border-primary/40 text-[10px] font-bold uppercase">Explore Vendors</Button>
                  </Link>
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Quick Tray</h4>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <p className="text-[10px] text-primary font-bold uppercase tracking-widest">Digital Wallet Ready</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">Naira balance automatically calculated.</p>
                  <Link href="/cart" className="block pt-2">
                    <Button variant="outline" size="sm" className="w-full h-8 text-[8px] font-bold uppercase border-white/10">View My Tray <ShoppingCart className="ml-2 w-3 h-3" /></Button>
                  </Link>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
