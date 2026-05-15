
"use client"

import * as React from "react"
import { useMemo } from "react"
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
  Activity,
  ShieldCheck,
  Smartphone,
  Lock,
  Wallet
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
import { collection, query, limit, orderBy, doc, updateDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { isToday, format, subDays } from 'date-fns'
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

export default function DashboardPage() {
  const { user, profile, isProfileLoading } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  
  const [isTopUpOpen, setIsTopUpOpen] = React.useState(false)
  const [topUpAmount, setTopUpAmount] = React.useState("1000")
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [paymentStep, setPaymentStep] = React.useState<'input' | 'processing' | 'success'>('input')

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

  const todaySpending = useMemo(() => {
    return expenses?.filter(e => isToday(new Date(e.expenseDate)))
      .reduce((sum, e) => sum + e.amount, 0) || 0
  }, [expenses])

  const spendTrendData = useMemo(() => {
    if (!expenses) return []
    const map: Record<string, number> = {}
    const now = new Date()
    for (let i = 13; i >= 0; i--) {
      const d = format(subDays(now, i), 'MMM dd')
      map[d] = 0
    }
    expenses.forEach(e => {
      const d = format(new Date(e.expenseDate), 'MMM dd')
      if (map[d] !== undefined) map[d] += e.amount
    })
    return Object.entries(map).map(([name, value]) => ({ name, value }))
  }, [expenses])

  const handlePaystackCheckout = () => {
    if (!user || !profile) return
    const amountInNaira = parseFloat(topUpAmount)
    if (isNaN(amountInNaira) || amountInNaira < 100) {
      toast({ variant: "destructive", title: "Invalid Amount", description: "Minimum top-up is ₦100" })
      return
    }

    setPaymentStep('processing')
    
    const paystack = (window as any).PaystackPop.setup({
      key: 'pk_test_37103899889b7cd46aea9603cebc51d0ac7eb860',
      email: profile.email || user.email,
      amount: amountInNaira * 100, 
      currency: 'NGN',
      metadata: {
        custom_fields: [
          { display_name: "Student Name", variable_name: "student_name", value: profile.name }
        ]
      },
      callback: function(response: any) {
        const profileRef = doc(db, "userProfiles", user.uid)
        const txRef = doc(collection(db, "users", user.uid, "walletTransactions"))
        
        const updateData = {
          walletBalance: (profile.walletBalance || 0) + amountInNaira,
          updatedAt: serverTimestamp()
        }

        const txData = {
          id: txRef.id,
          studentId: user.uid,
          amount: amountInNaira,
          type: 'funding',
          description: `Wallet Top-up via Paystack`,
          reference: response.reference,
          timestamp: new Date().toISOString()
        }
        
        // Log transaction and update balance
        setDoc(txRef, txData)
          .then(() => updateDoc(profileRef, updateData))
          .then(() => {
            setPaymentStep('success')
            toast({ title: "Funds Secured", description: `₦${amountInNaira.toLocaleString()} added to your CafePay Wallet.` })
            setTimeout(() => {
              setIsTopUpOpen(false)
              setPaymentStep('input')
              setTopUpAmount("1000")
            }, 2000)
          })
          .catch(async (error) => {
            setPaymentStep('input')
            errorEmitter.emit('permission-error', new FirestorePermissionError({
              path: profileRef.path,
              operation: 'update',
              requestResourceData: updateData
            }))
          })
      },
      onClose: function() {
        setPaymentStep('input')
        toast({ title: "Payment Cancelled", description: "You closed the payment gateway." })
      }
    })
    
    paystack.openIframe()
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
                <h1 className="text-3xl md:text-4xl font-headline font-bold">Welcome, <span className="text-primary neon-text-glow">{profile?.name?.split(' ')[0] || 'Student'}!</span></h1>
                <p className="text-muted-foreground text-sm">Automated tracking for your academic lifestyle.</p>
              </div>
              <Link href="/vendors"><Button className="glow-button rounded-2xl h-12 bg-primary px-8 font-bold">Browse Vendors <ChevronRight className="ml-2 w-4 h-4" /></Button></Link>
            </div>

            <GlassCard className="bg-gradient-to-r from-card/80 to-primary/5 border-primary/20 p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <ShieldCheck className="w-32 h-32 text-primary" />
              </div>
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6 relative z-10">
                <div className="space-y-1">
                  <h3 className="text-xl font-headline font-bold text-white">Wallet Balance</h3>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Functional Digital Credit</p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-xs text-muted-foreground mr-2 font-bold">₦</span>
                    <span className="text-4xl font-headline font-bold text-white tracking-tight">
                      {(profile?.walletBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <Dialog open={isTopUpOpen} onOpenChange={(val) => { if(!isProcessing) setIsTopUpOpen(val); if(!val) setPaymentStep('input'); }}>
                    <DialogTrigger asChild><Button variant="outline" className="rounded-xl border-primary/30 text-primary h-12 px-6 font-bold hover:bg-primary/10 transition-all"><Plus className="w-4 h-4 mr-2" /> Top Up</Button></DialogTrigger>
                    <DialogContent className="bg-card border-white/10 max-w-md p-0 overflow-hidden rounded-[2.5rem]">
                      {paymentStep === 'input' && (
                        <div className="p-8 space-y-8 animate-in fade-in zoom-in duration-300">
                          <DialogHeader>
                            <div className="flex items-center gap-3 mb-2">
                               <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary"><CreditCard className="w-5 h-5" /></div>
                               <DialogTitle className="text-2xl font-headline font-bold text-white">Fund Wallet</DialogTitle>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">Secure academic funding via <span className="text-emerald-400 font-bold">Paystack Live Gateway</span>.</p>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Label className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.2em]">Amount to Fund (₦)</Label>
                            <div className="relative">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-primary">₦</span>
                              <Input 
                                type="number" 
                                value={topUpAmount} 
                                onChange={(e) => setTopUpAmount(e.target.value)} 
                                className="h-16 pl-10 bg-white/5 border-white/10 text-2xl font-headline font-bold rounded-2xl focus:border-primary/50 text-white" 
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                               {["1000", "2500", "5000"].map(amt => (
                                 <Button key={amt} variant="ghost" onClick={() => setTopUpAmount(amt)} className="h-10 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold">₦{parseInt(amt).toLocaleString()}</Button>
                               ))}
                            </div>
                          </div>
                          <DialogFooter>
                            <Button onClick={handlePaystackCheckout} className="w-full h-16 rounded-2xl bg-gradient-to-r from-primary to-secondary text-base font-bold shadow-[0_0_30px_rgba(239,26,184,0.3)]">
                               Initiate Secure Payment
                            </Button>
                          </DialogFooter>
                        </div>
                      )}

                      {paymentStep === 'processing' && (
                        <div className="p-12 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in duration-500 min-h-[400px]">
                           <div className="relative">
                              <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full animate-pulse"></div>
                              <Loader2 className="w-20 h-20 text-primary animate-spin relative z-10" />
                           </div>
                           <div className="space-y-3">
                              <h3 className="text-2xl font-headline font-bold text-white">Opening Gateway...</h3>
                              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-emerald-400">Paystack Live Handshake</p>
                              <p className="text-xs text-muted-foreground max-w-[200px] mx-auto pt-4">Processing via secure encrypted protocol.</p>
                           </div>
                        </div>
                      )}

                      {paymentStep === 'success' && (
                        <div className="p-12 flex flex-col items-center justify-center text-center space-y-8 animate-in zoom-in duration-500 min-h-[400px]">
                           <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.3)]">
                              <ShieldCheck className="w-12 h-12 text-emerald-500" />
                           </div>
                           <div className="space-y-2">
                              <h3 className="text-3xl font-headline font-bold text-white">Transaction Verified</h3>
                              <p className="text-sm text-muted-foreground">Digital wallet balance updated successfully.</p>
                           </div>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                   <span>Budget Utilization</span>
                   <span>{Math.min(((profile?.walletBalance || 0) / (profile?.monthlyBudget || 8000)) * 100, 100).toFixed(0)}%</span>
                </div>
                <Progress value={Math.min(((profile?.walletBalance || 0) / (profile?.monthlyBudget || 8000)) * 100, 100)} className="h-2 bg-white/5 [&>div]:bg-primary" />
              </div>
            </GlassCard>

            <GlassCard className="p-8 border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-headline font-bold flex items-center gap-2 text-white"><Activity className="w-5 h-5 text-primary" /> Spend Trajectory</h3>
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
            <GlassCard className="p-6 border-white/5 relative overflow-hidden bg-black/20">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[10px] uppercase tracking-widest text-muted-foreground">Daily Threshold</h3>
                <div className="text-right"><span className="text-sm font-bold text-white">₦{todaySpending.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span></div>
              </div>
              <Progress value={Math.min((todaySpending / dailyLimit) * 100, 100)} className={cn("h-2 bg-white/5", todaySpending > dailyLimit ? "[&>div]:bg-rose-500" : "[&>div]:bg-emerald-500")} />
              <div className="flex justify-between items-center pt-3">
                 <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-tighter">Admin Limit: ₦{dailyLimit.toLocaleString()}</p>
                 <Badge variant="outline" className="text-[8px] border-white/10 uppercase tracking-tighter h-5">{todaySpending > dailyLimit ? 'Limit Exceeded' : 'Under Limit'}</Badge>
              </div>
            </GlassCard>

            <GlassCard className="p-6 border-white/5 space-y-6 bg-black/20">
              <h3 className="text-lg font-headline font-bold border-b border-white/5 pb-4 text-white">Recent Nodes</h3>
              <div className="space-y-4">
                {expenses?.slice(0, 4).map((exp, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors"><CreditCard className="w-3.5 h-3.5" /></div>
                      <div>
                        <p className="text-xs font-bold truncate max-w-[100px] text-white/90">{exp.description}</p>
                        <p className="text-[8px] text-muted-foreground uppercase tracking-widest">{format(new Date(exp.expenseDate), 'MMM d, p')}</p>
                      </div>
                    </div>
                    <p className="text-xs font-bold text-primary">₦{exp.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                  </div>
                ))}
                {(!expenses || expenses.length === 0) && (
                   <div className="py-8 text-center">
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">No Transaction Logs</p>
                   </div>
                )}
              </div>
              <Link href="/wallet" className="block pt-2">
                 <Button variant="ghost" className="w-full text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary">View Full Ledger <Wallet className="ml-2 w-3 h-3" /></Button>
              </Link>
            </GlassCard>
          </div>
        </div>
      </div>
    </DashboardShell>
  )
}
