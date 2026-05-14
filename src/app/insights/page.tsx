"use client"

import * as React from 'react'
import { useState, useEffect, useMemo } from 'react'
import { DashboardShell } from "@/components/layout/Shell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { 
  BrainCircuit, 
  Sparkles, 
  AlertCircle, 
  Target,
  Lightbulb,
  GitBranch,
  SearchCode,
  ShieldCheck,
  Info,
  CircleHelp,
  BarChart3,
  Scale,
  Zap,
  ChevronDown,
  Database,
  Network
} from "lucide-react"
import { spendingInsightFeedback, type SpendingInsightFeedbackOutput } from "@/ai/flows/spending-insight-feedback"
import { Progress } from "@/components/ui/progress"
import { cn } from '@/lib/utils'
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase'
import { collection, query, orderBy, where } from 'firebase/firestore'
import { subDays } from 'date-fns'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function InsightsPage() {
  const { user, profile } = useUser()
  const db = useFirestore()
  const [loading, setLoading] = useState(false)
  const [insight, setInsight] = useState<SpendingInsightFeedbackOutput | null>(null)
  const [showLogic, setShowLogic] = useState(false)

  // Use state for the date to prevent hydration mismatch
  const [thirtyDaysAgo, setThirtyDaysAgo] = useState<string>("")

  useEffect(() => {
    // Set the date only on the client
    setThirtyDaysAgo(subDays(new Date(), 30).toISOString())
  }, [])

  const expensesQuery = useMemoFirebase(() => {
    if (!user || !thirtyDaysAgo) return null
    return query(
      collection(db, "users", user.uid, "expenses"),
      where("expenseDate", ">=", thirtyDaysAgo),
      orderBy("expenseDate", "desc")
    )
  }, [db, user, thirtyDaysAgo])

  const { data: expenses, isLoading: expensesLoading } = useCollection(expensesQuery)

  const generateInsight = async () => {
    if (!profile || !expenses) return
    setLoading(true)
    try {
      const spendingRecords = expenses.map(e => ({
        category: e.categoryId || "Other",
        amount: e.amount,
        date: e.expenseDate,
        vendor: e.description?.split(' from ')[1] || "Unknown"
      }))

      const result = await spendingInsightFeedback({
        timePeriod: "Last 30 days",
        totalBudget: profile.monthlyBudget || 8000,
        categoryBudgets: {
          "Food": (profile.monthlyBudget || 8000) * 0.4,
          "Books": (profile.monthlyBudget || 8000) * 0.2,
          "Entertainment": (profile.monthlyBudget || 8000) * 0.1,
          "Other": (profile.monthlyBudget || 8000) * 0.3
        },
        spendingRecords
      })
      setInsight(result)
    } catch (error) {
      console.error("Analysis Failed", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-12 max-w-5xl mx-auto">
        
        {/* Academic Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3" /> CafePay AI Engine Active
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-headline font-bold text-white tracking-tight">Decision Tree <span className="text-primary neon-text-glow">Analysis</span></h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              Intelligent classification using <strong>Purchase-Based Logging (PBL)</strong> to map expenditure efficiency across academic periods.
            </p>
          </div>
          {!insight && (
            <div className="pt-6">
              <Button 
                onClick={generateInsight} 
                disabled={loading || expensesLoading || !expenses || expenses.length === 0}
                className="glow-button rounded-[2rem] h-20 px-12 bg-primary hover:bg-primary/90 text-xl group font-bold shadow-[0_0_50px_rgba(239,26,184,0.3)]"
              >
                {loading ? (
                  <>Traversing Logical Tree...</>
                ) : (
                  <>
                    {expenses && expenses.length > 0 ? "Execute AI Analysis" : "No Transaction Logs Found"} 
                    <Sparkles className="ml-3 w-6 h-6 group-hover:animate-pulse" />
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Methodology Schematic */}
        {!insight && (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom duration-1000 delay-300">
              <GlassCard className="p-8 border-white/5 bg-white/5 space-y-4">
                 <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                    <Database className="w-5 h-5" />
                 </div>
                 <h3 className="font-headline font-bold text-white">1. PBL Ingestion</h3>
                 <p className="text-xs text-muted-foreground leading-relaxed">System captures raw Purchase-Based Logs from vendor transactions, ensuring 100% data fidelity for analysis.</p>
              </GlassCard>
              <GlassCard className="p-8 border-white/5 bg-white/5 space-y-4">
                 <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                    <Network className="w-5 h-5" />
                 </div>
                 <h3 className="font-headline font-bold text-white">2. Tree Traversal</h3>
                 <p className="text-xs text-muted-foreground leading-relaxed">Data flows through Budget, Variance, and Frequency nodes to identify hidden "Financial Leakage" points.</p>
              </GlassCard>
              <GlassCard className="p-8 border-white/5 bg-white/5 space-y-4">
                 <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                    <BrainCircuit className="w-5 h-5" />
                 </div>
                 <h3 className="font-headline font-bold text-white">3. Strategic Output</h3>
                 <p className="text-xs text-muted-foreground leading-relaxed">The engine calculates an Essentiality Ratio and provides tactical suggestions to prune irrational spending.</p>
              </GlassCard>
           </div>
        )}

        {insight && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-in fade-in slide-in-from-bottom duration-1000">
            <GlassCard className="md:col-span-8 space-y-10 border-white/10 bg-black/40 p-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-1">
                  <h2 className="text-2xl font-headline font-bold flex items-center gap-3">
                    <GitBranch className="text-primary w-6 h-6" />
                    Classification Path
                  </h2>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Decision Tree Traversal Trace</p>
                </div>
                <div className="px-6 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono text-primary uppercase font-bold shadow-inner">
                  {insight.decisionTreePath}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                 <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Essentiality Ratio</p>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-3.5 h-3.5 text-muted-foreground/60 cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent className="bg-card border-white/10 text-xs p-3 max-w-[200px]">
                            Ratio of survival spending (Food/Books) against lifestyle choices.
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <div className="space-y-4">
                       <span className="text-5xl font-bold text-white tracking-tighter">{insight.classification.essentialRatio}%</span>
                       <Progress value={insight.classification.essentialRatio} className="h-2 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-secondary" />
                    </div>
                 </div>
                 <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/5 space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Tactical Status</p>
                    <div className={cn(
                      "text-3xl font-bold uppercase tracking-tight",
                      insight.overallFeedback === 'Excellent Control' ? "text-emerald-400" :
                      insight.overallFeedback === 'Warning' ? "text-amber-400" : "text-rose-500"
                    )}>
                      {insight.overallFeedback}
                    </div>
                    <p className="text-[10px] text-muted-foreground font-medium italic">Behavioral Node Classification</p>
                 </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-headline font-bold flex items-center gap-3">
                  <SearchCode className="w-6 h-6 text-primary" />
                  Engine Findings
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm p-6 bg-white/5 rounded-3xl border border-white/5">
                  {insight.explanation}
                </p>
              </div>

              <div className="space-y-6">
                 <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Financial Leakage Identification</h3>
                 <div className="flex flex-wrap gap-3">
                    {insight.classification.leakagePoints.map((point, i) => (
                      <div key={i} className="px-5 py-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        <AlertCircle className="w-3.5 h-3.5" />
                        {point}
                      </div>
                    ))}
                    {insight.classification.leakagePoints.length === 0 && (
                      <div className="w-full p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 text-center">
                        <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest">No Irrational Leakage Detected</p>
                      </div>
                    )}
                 </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6 pt-6 border-t border-white/5">
                {insight.suggestions.map((suggestion, i) => (
                  <div key={i} className="flex gap-4 p-5 rounded-[2rem] bg-white/5 border border-white/5 hover:border-primary/20 transition-all group">
                    <div className="p-3 h-fit rounded-2xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <Lightbulb className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-medium text-white/80 leading-relaxed">{suggestion}</p>
                  </div>
                ))}
              </div>
            </GlassCard>

            <div className="md:col-span-4 space-y-8">
              <GlassCard className="bg-primary/5 border-primary/10 p-8 space-y-8">
                <div className="flex items-center gap-3">
                  <Target className="w-6 h-6 text-primary" />
                  <h3 className="text-lg font-headline font-bold">Variance Audit</h3>
                </div>
                <div className="space-y-8">
                  {insight.categoryInsights.map((cat, i) => (
                    <div key={i} className="space-y-3">
                      <div className="flex justify-between items-end">
                        <span className="font-bold text-sm text-white/90">{cat.category}</span>
                        <span className="text-[10px] font-bold text-muted-foreground">₦{cat.spent} / ₦{cat.budget || '∞'}</span>
                      </div>
                      <Progress 
                        value={cat.budget ? (cat.spent / cat.budget) * 100 : 100} 
                        className={cn(
                          "h-2 bg-white/5",
                          cat.status.includes('Over') ? "[&>div]:bg-rose-500" : "[&>div]:bg-emerald-500"
                        )}
                      />
                      <p className="text-[10px] text-muted-foreground font-medium italic leading-relaxed">{cat.comment}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard className="bg-white/5 border-white/10 p-8 space-y-6">
                <button 
                  onClick={() => setShowLogic(!showLogic)}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <div className="flex items-center gap-3">
                    <CircleHelp className="w-5 h-5 text-primary" />
                    <h3 className="text-sm font-bold uppercase tracking-widest">Scientific Basis</h3>
                  </div>
                  <ChevronDown className={cn("w-4 h-4 text-muted-foreground transition-transform", showLogic && "rotate-180")} />
                </button>
                
                {showLogic && (
                  <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                    <div className="space-y-4">
                       <div className="flex gap-3">
                          <BarChart3 className="w-4 h-4 text-primary shrink-0" />
                          <div className="space-y-1">
                             <p className="text-[10px] font-bold uppercase text-white">Decision Tree Protocol</p>
                             <p className="text-xs text-muted-foreground leading-relaxed">Traverses spending nodes (Budget &rarr; Variance &rarr; Frequency) to detect behavioral anomalies.</p>
                          </div>
                       </div>
                       <div className="flex gap-3">
                          <Scale className="w-4 h-4 text-primary shrink-0" />
                          <div className="space-y-1">
                             <p className="text-[10px] font-bold uppercase text-white">Essentiality Formula</p>
                             <p className="text-xs text-muted-foreground leading-relaxed">
                                <strong>(Essential_Spend / Total_Spend) * 100</strong>. Essential spending is defined by Academic and Survival categories.
                             </p>
                          </div>
                       </div>
                       <div className="flex gap-3">
                          <Zap className="w-4 h-4 text-primary shrink-0" />
                          <div className="space-y-1">
                             <p className="text-[10px] font-bold uppercase text-white">Leakage Algorithm</p>
                             <p className="text-xs text-muted-foreground leading-relaxed">Identifies &quot;micro-spending&quot; patterns that cumulatively erode the student's monthly budget.</p>
                          </div>
                       </div>
                    </div>
                  </div>
                )}
              </GlassCard>
              
              <Button 
                variant="outline" 
                className="w-full rounded-2xl h-14 border-white/10 hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest"
                onClick={() => setInsight(null)}
              >
                Reset Engine Traversal
              </Button>
            </div>
          </div>
        )}

        <div className="text-center py-12 border-t border-white/5">
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.5em]">© 2024 CafePay Wallet • AI Decision Tree Protocol v4.1</p>
        </div>
      </div>
    </DashboardShell>
  )
}
