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
  Plus,
  Activity
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
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts'
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useUser, useFirestore, useCollection, useDoc, useMemoFirebase, errorEmitter, FirestorePermissionError } from "@/firebase"
import { collection, query, limit, orderBy, doc, updateDoc } from 'firebase/firestore'
import { isToday, format, subDays } from 'date-fns'
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const { user, profile, isProfileLoading } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  
  const [isTopUpOpen, setIsTopUpOpen] = React.useState(false)
  const [topUpAmount, setTopUpAmount] = React.useState("1000")
  const [isProcessing, setIsProcessing] = React.useState(false)

  const thresholdRef = useMemoFirebase(() => doc(db, "system_config", "thresholds"), [db])
  const { data: thresholds } = useDoc(thresholdRef)
  const dailyLimit = thresholds?.dailySpendingLimit || 2500

  const ordersQuery = useMemoFirebase(() => {
    if (!user) return null
    return query(collection(db, "users", user.uid, "orders"), orderBy("orderDate", "desc"), limit(5))
  }, [db, user?.uid])

  const expensesQuery = useMemoFirebase(() => {
    if (!user) return null
    return query(collection(db, "users", user.uid, "expenses"), orderBy("expenseDate", "desc"), limit(100))
  }, [db, user?.uid])

  const { data: orders } = useCollection(ordersQuery)
  const { data: expenses } = useCollection(expensesQuery)

  const todaySpending = React.useMemo(() => {
    return expenses?.filter(e => isToday(new Date(e.expenseDate)))
      .reduce((sum, e) => sum + e.amount, 0) || 0
  }, [expenses])

  const spendTrendData = React.useMemo(() => {
    if (!expenses) return []
    const map: Record<string, number> = {}
    for (let i = 13; i >= 0; i--) {
      const d = format(subDays(new Date(), i), 'MMM dd')
      map[d] = 0
    }
    expenses.forEach(e => {
      const d = format(new Date(e.expenseDate), 'MMM dd')
      if (map[d] !== undefined) map[d] += e.amount
    })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [expenses])

  const handleTopUp = async () => {
    if (!user || !profile) return
    const amount = parseFloat(topUpAmount)
    if (isNaN(amount) || amount <= 0) return
    setIsProcessing(true)
    
    const profileRef = doc(db, "userProfiles", user.uid)
    const data = {
      walletBalance: (profile.walletBalance || 0) + amount,
      updatedAt: new Date().toISOString()
    }
    
    // Non-blocking write
    updateDoc(profileRef, data)
      .then(() => {
        toast({ title: "Funds Added!", description: `₦${amount.toLocaleString()} added to wallet.` })
        setIsTopUpOpen(false)
      })
      .catch(async (error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: profileRef.path,
          operation: 'update',
          requestResourceData: data
        }))
      })
      .finally(() => setIsProcessing(false))
  }

  if (isProfileLoading || !user) {
    return <DashboardShell><div className="flex items-center justify-center h-[60vh]"><Loader2 className="w-12 h-12 text-primary animate-spin" /></div></DashboardShell>
  }

  return (
    <DashboardShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-headline font-bold">Welcome, <span className="text-primary neon-text-glow">{profile?.name || 'Student'}!</span></h1>
                <p className="text-muted-foreground text-sm">Automated tracking for your academic lifestyle.</p>
              </div>
              <Link href="/vendors"><Button className="glow-button rounded-2xl h-12 bg-primary px-8">Browse Vendors <ChevronRight className="ml-2 w-4 h-4" /></Button></Link>
            </div>

            <GlassCard className="bg-gradient-to-r from-card/80 to-primary/5 border-primary/20 p-8">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
                <div className="space-y-1">
                  <h3 className="text-xl font-headline font-bold">Wallet Balance</h3>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Available Funds</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground mr-2">₦</span>
                    <span className="text-3xl font-bold">{profile?.walletBalance?.toLocaleString() || '0.00'}</span>
                  </div>
                  <Dialog open={isTopUpOpen} onOpenChange={setIsTopUpOpen}>
                    <DialogTrigger asChild><Button variant="outline" className="rounded-xl border-primary/30 text-primary h-10"><Plus className="w-4 h-4 mr-2" /> Top Up</Button></DialogTrigger>
                    <DialogContent className="bg-card border-white/10">
                      <DialogHeader><DialogTitle className="text-white">Add Funds</DialogTitle></DialogHeader>
                      <div className="space-y-4 py-4">
                        <Label className="text-[10px] font-bold uppercase text-muted-foreground">Amount (₦)</Label>
                        <Input type="number" value={topUpAmount} onChange={(e) => setTopUpAmount(e.target.value)} className="h-12 bg-white/5 border-white/10 text-lg font-bold" />
                      </div>
                      <DialogFooter><Button onClick={handleTopUp} disabled={isProcessing} className="w-full bg-primary">{isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm"}</Button></DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <Progress value={Math.min(((profile?.walletBalance || 0) / (profile?.monthlyBudget || 8000)) * 100, 100)} className="h-2 bg-white/5 [&>div]:bg-primary" />
            </GlassCard>

            <GlassCard className="p-8 border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-headline font-bold flex items-center gap-2"><Activity className="w-5 h-5 text-primary" /> Spend Trajectory</h3>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">14-Day Velocity Mapping</p>
                </div>
              </div>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={spendTrendData}>
                    <defs>
                      <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef1ab8" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ef1ab8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(239,26,184,0.3)', borderRadius: '12px' }} />
                    <Area type="monotone" dataKey="value" stroke="#ef1ab8" fillOpacity={1} fill="url(#colorSpend)" strokeWidth={3} dot={{ r: 4, fill: '#ef1ab8' }} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <GlassCard className="p-6 border-white/5 relative overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-sm uppercase tracking-tight">Today's Nodes</h3>
                <div className="text-right"><span className="font-bold">₦{todaySpending.toLocaleString()}</span></div>
              </div>
              <Progress value={Math.min((todaySpending / dailyLimit) * 100, 100)} className="h-2 bg-white/5 [&>div]:bg-primary" />
              <p className="text-[8px] text-muted-foreground uppercase pt-3">Limit: ₦{dailyLimit.toLocaleString()} (Admin Set)</p>
            </GlassCard>

            <GlassCard className="p-6 border-white/5 space-y-6">
              <h3 className="text-lg font-headline font-bold">Recent History</h3>
              <div className="space-y-4">
                {expenses?.slice(0, 4).map((exp, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary"><CreditCard className="w-3.5 h-3.5" /></div>
                      <div><p className="text-xs font-bold truncate max-w-[100px]">{exp.description}</p></div>
                    </div>
                    <p className="text-xs font-bold">₦{exp.amount.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
