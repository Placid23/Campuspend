
"use client"

import { useState, useEffect, React } from 'react'
import { DashboardShell } from "@/components/layout/Shell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { 
  BrainCircuit, 
  Sparkles, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  TrendingUp,
  Target,
  Lightbulb,
  Loader2
} from "lucide-react"
import { spendingInsightFeedback, type SpendingInsightFeedbackOutput } from "@/ai/flows/spending-insight-feedback"
import { Progress } from "@/components/ui/progress"
import { cn } from '@/lib/utils'
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase'
import { collection, query, orderBy, limit, where } from 'firebase/firestore'
import { subDays } from 'date-fns'

export default function InsightsPage() {
  const { user, profile } = useUser()
  const db = useFirestore()
  const [loading, setLoading] = useState(false)
  const [insight, setInsight] = useState<SpendingInsightFeedbackOutput | null>(null)

  // Fetch real data for AI
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
      // Map Firestore data to AI Input Schema
      const spendingRecords = expenses.map(e => ({
        category: e.categoryId || "Other",
        amount: e.amount,
        date: e.expenseDate,
        vendor: e.description?.split(' from ')[1] || "Unknown"
      }))

      const result = await spendingInsightFeedback({
        timePeriod: "Last 30 days",
        totalBudget: profile.monthlyBudget || 0,
        categoryBudgets: {
          "Food": (profile.monthlyBudget || 0) * 0.4,
          "Books": (profile.monthlyBudget || 0) * 0.2,
          "Entertainment": (profile.monthlyBudget || 0) * 0.1,
          "Other": (profile.monthlyBudget || 0) * 0.3
        },
        spendingRecords
      })
      setInsight(result)
    } catch (error) {
      console.error("Failed to generate AI insight", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-8 max-w-5xl mx-auto">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(239,26,184,0.2)]">
            <BrainCircuit className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl font-headline font-bold">CampusSpend AI Advisor</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Our neural-powered advisor analyzes your real transaction history to give you tactical financial advantages.
          </p>
          {!insight && (
            <Button 
              onClick={generateInsight} 
              disabled={loading || expensesLoading || !expenses || expenses.length === 0}
              className="glow-button mt-4 rounded-2xl h-14 px-8 bg-primary hover:bg-primary/90 text-lg group"
            >
              {loading ? (
                <>Analyzing Financial DNA...</>
              ) : (
                <>
                  {expenses && expenses.length > 0 ? "Generate Intelligence Report" : "No Transaction Data Found"} 
                  <Sparkles className="ml-2 w-5 h-5 group-hover:animate-pulse" />
                </>
              )}
            </Button>
          )}
        </div>

        {insight && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom duration-1000">
            {/* Overall Assessment */}
            <GlassCard className="md:col-span-8 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-headline font-bold flex items-center gap-3">
                  <TrendingUp className="text-primary w-6 h-6" />
                  Neural Analysis Report
                </h2>
                <div className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border",
                  insight.overallFeedback === 'Excellent Control' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                  insight.overallFeedback === 'Warning' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                  "bg-rose-500/10 text-rose-500 border-rose-500/20"
                )}>
                  Status: {insight.overallFeedback}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {insight.explanation}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-4">
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
                  Category Metrics
                </h3>
                <div className="space-y-6">
                  {insight.categoryInsights.map((cat, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-bold">{cat.category}</span>
                        <span className="text-muted-foreground">₦{cat.spent} / ₦{cat.budget || '∞'}</span>
                      </div>
                      <Progress 
                        value={cat.budget ? (cat.spent / cat.budget) * 100 : 100} 
                        className={cn(
                          "h-1.5 bg-white/5",
                          cat.status.includes('Over') ? "[&>div]:bg-rose-500" : "[&>div]:bg-emerald-500"
                        )}
                      />
                      <p className="text-[10px] text-muted-foreground italic">{cat.comment}</p>
                    </div>
                  ))}
                </div>
              </GlassCard>
              
              <Button 
                variant="outline" 
                className="w-full rounded-2xl h-12 border-white/10 hover:bg-white/5"
                onClick={() => setInsight(null)}
              >
                Reset Analysis
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
