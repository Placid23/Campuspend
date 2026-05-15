"use client"

import * as React from "react"
import { DashboardShell } from "@/components/layout/Shell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  History, 
  Loader2, 
  CreditCard,
  Plus,
  Filter,
  Download,
  ShieldCheck,
  TrendingUp,
  GitBranch,
  Info,
  ChevronRight,
  SearchCode
} from "lucide-react"
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy, limit, where } from 'firebase/firestore'
import { format } from 'date-fns'
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function WalletLedgerPage() {
  const { user, profile } = useUser()
  const db = useFirestore()

  const transactionsQuery = useMemoFirebase(() => {
    if (!user) return null
    return query(collection(db, "users", user.uid, "walletTransactions"), orderBy("timestamp", "desc"))
  }, [db, user])

  const { data: transactions, isLoading } = useCollection(transactionsQuery)

  // Logic to determine Decision Tree outcome
  const getDecisionPath = (tx: any) => {
    if (tx.type === 'funding') return null;
    
    // Simulated pathing based on real PBL categories
    const isEssential = ['food', 'drinks', 'books', 'stationery', 'fast-food'].includes(tx.category?.toLowerCase());
    return {
      status: isEssential ? 'Survival Node' : 'Lifestyle Node',
      path: isEssential ? 'Academic Necessity &rarr; Survival Branch' : 'Discretionary spend &rarr; Lifestyle Branch',
      explanation: isEssential 
        ? "Classified as survival based on PBL academic category mapping." 
        : "Node identified as non-essential discretionary leakage."
    };
  }

  return (
    <DashboardShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Wallet <span className="text-primary neon-text-glow">Ledger</span></h1>
            <p className="text-muted-foreground text-sm max-w-xl">Unified financial node tracking all Naira (₦) inflows and outflows with Decision Tree tracing.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" /> Secure Audit Trail
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <GlassCard className="lg:col-span-1 p-8 border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 space-y-8 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <Wallet className="w-6 h-6" />
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Available Credit</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-muted-foreground">₦</span>
                <h3 className="text-5xl font-headline font-bold text-white tracking-tighter">
                  {(profile?.walletBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </h3>
              </div>
            </div>
            <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[8px] font-bold uppercase text-muted-foreground tracking-widest">Inflow (Total)</p>
                <p className="text-sm font-bold text-emerald-400">
                  ₦{transactions?.filter(t => t.type === 'funding').reduce((sum, t) => sum + t.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-[8px] font-bold uppercase text-muted-foreground tracking-widest">Outflow (Total)</p>
                <p className="text-sm font-bold text-rose-400">
                  ₦{transactions?.filter(t => t.type === 'spending').reduce((sum, t) => sum + t.amount, 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="lg:col-span-2 p-0 border-white/10 bg-black/20 overflow-hidden flex flex-col min-h-[500px]">
            <div className="p-6 border-b border-white/5 bg-white/5 flex items-center justify-between">
               <div className="flex items-center gap-3">
                  <History className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-headline font-bold text-white">Tree-Analyzed History</h3>
               </div>
               <div className="flex gap-2">
                 <div className="px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[8px] font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                   <GitBranch className="w-3 h-3" /> Node Tracking Active
                 </div>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 py-20">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Syncing Ledger Node...</p>
                </div>
              ) : transactions && transactions.length > 0 ? (
                <div className="divide-y divide-white/5">
                  {transactions.map((tx) => {
                    const decision = getDecisionPath(tx);
                    return (
                      <div key={tx.id} className="p-6 flex flex-col gap-4 hover:bg-white/5 transition-colors group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-500",
                              tx.type === 'funding' 
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                                : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                            )}>
                              {tx.type === 'funding' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-sm font-bold text-white/90">{tx.description}</p>
                              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                                {format(new Date(tx.timestamp), 'MMM dd, yyyy • h:mm a')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right space-y-1">
                            <p className={cn(
                              "text-lg font-headline font-bold",
                              tx.type === 'funding' ? "text-emerald-400" : "text-white"
                            )}>
                              {tx.type === 'funding' ? '+' : '-'}₦{tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                            <p className="text-[8px] font-mono text-muted-foreground uppercase opacity-40">REF: {tx.id.substring(0, 12)}</p>
                          </div>
                        </div>

                        {decision && (
                          <div className="ml-16 p-4 rounded-2xl bg-white/5 border border-white/5 space-y-3 group-hover:border-primary/20 transition-all">
                             <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <SearchCode className="w-3.5 h-3.5 text-primary" />
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Decision Trace</span>
                                </div>
                                <span className={cn(
                                  "text-[8px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-tighter",
                                  decision.status.includes('Survival') ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                )}>
                                  {decision.status}
                                </span>
                             </div>
                             <div className="space-y-1">
                                <p className="text-[9px] font-mono text-white/60" dangerouslySetInnerHTML={{ __html: decision.path }} />
                                <p className="text-[10px] text-muted-foreground italic">&ldquo;{decision.explanation}&rdquo;</p>
                             </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full py-20 gap-4 opacity-40">
                  <Wallet className="w-12 h-12 text-muted-foreground" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.4em]">No financial logs recorded</p>
                </div>
              )}
            </div>
          </GlassCard>
        </div>

        <div className="text-center py-12 border-t border-white/5">
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">© 2024 CafePay Wallet. Academic Prototype v4.5</p>
        </div>
      </div>
    </DashboardShell>
  )
}
