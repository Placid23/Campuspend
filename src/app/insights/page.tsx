
"use client"

import * as React from 'react'
import { useState } from 'react'
import { DashboardShell } from "@/components/layout/Shell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { 
  BrainCircuit, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Target,
  Lightbulb,
  GitBranch,
  SearchCode,
  ShieldCheck
} from "lucide-react"
import { spendingInsightFeedback, type SpendingInsightFeedbackOutput } from "@/ai/flows/spending-insight-feedback"
import { Progress } from "@/components/ui/progress"
import { cn } from '@/lib/utils'
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase'
import { collection, query, orderBy, where } from 'firebase/firestore'
import { subDays } from 'date-fns'

export default function InsightsPage() {
  const { user, profile } = useUser()
  const db = useFirestore()
  const [loading, setLoading] = useState(false)
  const [insight, setInsight] = useState<SpendingInsightFeedbackOutput | null>(null)

  const thirtyDaysAgo = subDays(new Date(), 30).toISOString()
  const expensesQuery = useMemoFirebase(() => {
    if (!user) return null
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
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest mb-4">
            <ShieldCheck className="w-3 h-3" /> CafePay AI Engine Active
          </div>
          <h1 className="text-4xl font-headline font-bold text-white">Decision Tree <span className="text-primary neon-text-glow">Analysis</span></h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
            Academically aligned intelligent classification using purchase-based logging (PBL) and logical decision paths to determine spending efficiency.
          </p>
          {!insight && (
            <Button 
              onClick={generateInsight} 
              disabled={loading || expensesLoading || !expenses || expenses.length === 0}
              className="glow-button mt-6 rounded-2xl h-16 px-10 bg-primary hover:bg-primary/90 text-lg group font-bold"
            >
              {loading ? (
                <>Traversing Logical Tree...</>
              ) : (
                <>
                  {expenses && expenses.length > 0 ? "Execute AI Analysis" : "No Transaction Logs Found"} 
                  <Sparkles className="ml-2 w-5 h-5 group-hover:animate-pulse" />
                </>
              )}
            </Button>
          )}
        </div>

        {insight && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom duration-1000">
            <GlassCard className="md:col-span-8 space-y-8 border-white/10 bg-black/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-headline font-bold flex items-center gap-3">
                  <GitBranch className="text-primary w-6 h-6" />
                  Classification Path
                </h2>
                <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-primary uppercase tracking-tighter">
                  {insight.decisionTreePath}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Essentiality Ratio</p>
                    <div className="flex items-center gap-3">
                       <span className="text-3xl font-bold text-white">{insight.classification.essentialRatio}%</span>
                       <Progress value={insight.classification.essentialRatio} className="h-1.5 flex-1 [&>div]:bg-primary" />
                    </div>
                 </div>
                 <div className="p-6 rounded-3xl bg-white/5 border border-white/5 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tactical Status</p>
                    <div className={cn(
                      "text-xl font-bold uppercase tracking-widest",
                      insight.overallFeedback === 'Excellent Control' ? "text-emerald-400" :
                      insight.overallFeedback === 'Warning' ? "text-amber-400" : "text-rose-500"
                    )}>
                      {insight.overallFeedback}
                    </div>
                 </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-headline font-bold flex items-center gap-2">
                  <SearchCode className="w-5 h-5 text-primary" />
                  Engine Findings
                </h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  {insight.explanation}
                </p>
              </div>

              <div className="space-y-4">
                 <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Financial Leakage Identification</h3>
                 <div className="flex flex-wrap gap-2">
                    {insight.classification.leakagePoints.map((point, i) => (
                      <div key={i} className="px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
                        {point}
                      </div>
                    ))}
                    {insight.classification.leakagePoints.length === 0 && <p className="text-xs text-muted-foreground italic">No irrational leakage detected in this traversal.</p>}
                 </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
                {insight.suggestions.map((suggestion, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all">
                    <div className="p-2 h-fit rounded-lg bg-primary/10 text-primary">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-medium">{suggestion}</p>
                  </div>
                ))}
              </div>
            </GlassCard>

            <div className="md:col-span-4 space-y-6">
              <GlassCard className="bg-primary/5 border-primary/10">
                <h3 className="text-lg font-headline font-bold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Variance Audit
                </h3>
                <div className="space-y-6">
                  {insight.categoryInsights.map((cat, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-bold">{cat.category}</span>
                        <span className="text-muted-foreground text-xs">₦{cat.spent} / ₦{cat.budget || '∞'}</span>
                      </div>
                      <Progress 
                        value={cat.budget ? (cat.spent / cat.budget) * 100 : 100} 
                        className={cn(
                          "h-1.5 bg-white/5",
                          cat.status.includes('Over') ? "[&>div]:bg-rose-500" : "[&>div]:bg-emerald-500"
                        )}
                      />
                      <p className="text-[10px] text-muted-foreground italic leading-relaxed">{cat.comment}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
              
              <Button 
                variant="outline" 
                className="w-full rounded-2xl h-12 border-white/10 hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest"
                onClick={() => setInsight(null)}
              >
                Reset Engine Traversal
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
