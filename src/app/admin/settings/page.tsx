"use client"

import * as React from "react"
import { AdminShell } from "@/components/layout/AdminShell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  AlertCircle, 
  Search,
  Zap,
  Loader2,
  CheckCircle2
} from "lucide-react"
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { useFirestore } from "@/firebase"
import { useToast } from "@/hooks/use-toast"

export default function AdminThresholdSettingsPage() {
  const db = useFirestore()
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)
  const [settings, setSettings] = React.useState({
    lowStockThreshold: 20,
    dailySpendingLimit: 2500
  })

  // Load settings on mount
  React.useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, "system_config", "thresholds")
        const snap = await getDoc(docRef)
        if (snap.exists()) {
          setSettings(snap.data() as any)
        }
      } catch (e) {
        console.error("Failed to load settings", e)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [db])

  const handleSave = async (key: string, value: number) => {
    setIsSaving(true)
    try {
      const docRef = doc(db, "system_config", "thresholds")
      await setDoc(docRef, { ...settings, [key]: value }, { merge: true })
      setSettings(prev => ({ ...prev, [key]: value }))
      toast({
        title: "Settings Saved",
        description: "Global system thresholds have been updated."
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update system settings."
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
          <Search className="w-3 h-3" /> System / <span className="text-white/80">Threshold Settings</span>
        </div>

        <h1 className="text-3xl font-headline font-bold text-white tracking-tight">Threshold Settings</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Low Stock Threshold Card */}
          <GlassCard className="p-10 border-white/10 bg-black/20 backdrop-blur-3xl space-y-8 group hover:border-primary/40 transition-all">
            <div className="space-y-2">
              <h3 className="text-xl font-headline font-bold text-white">Low Stock Threshold</h3>
              <div className="space-y-1">
                <p className="text-sm font-bold text-primary/80">Current Setting: <span className="text-white">{settings.lowStockThreshold} units</span></p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest leading-relaxed">
                  Set alert when product stock falls below this level.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Low Stock Threshold Units</Label>
                <Input 
                  type="number"
                  value={settings.lowStockThreshold}
                  onChange={(e) => setSettings({ ...settings, lowStockThreshold: parseInt(e.target.value) })}
                  className="h-14 bg-white/5 border-white/10 rounded-2xl px-6 text-lg font-bold focus:border-primary/50 transition-all"
                />
              </div>
              <Button 
                disabled={isSaving}
                onClick={() => handleSave('lowStockThreshold', settings.lowStockThreshold)}
                className="w-full max-w-[200px] h-12 rounded-xl bg-primary/20 hover:bg-primary/30 border border-primary/40 text-xs font-bold uppercase tracking-widest text-primary transition-all"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Threshold"}
              </Button>
            </div>
          </GlassCard>

          {/* Spending Limit Threshold Card */}
          <GlassCard className="p-10 border-white/10 bg-black/20 backdrop-blur-3xl space-y-8 group hover:border-secondary/40 transition-all">
            <div className="space-y-2">
              <h3 className="text-xl font-headline font-bold text-white">Spending Limit Threshold</h3>
              <div className="space-y-1">
                <p className="text-sm font-bold text-secondary/80">Current Setting: <span className="text-white">₦{settings.dailySpendingLimit.toLocaleString()}</span></p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest leading-relaxed">
                  Set daily individual spending limit for students.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Daily Spending Limit (₦)</Label>
                <div className="relative">
                  <Input 
                    type="number"
                    value={settings.dailySpendingLimit}
                    onChange={(e) => setSettings({ ...settings, dailySpendingLimit: parseInt(e.target.value) })}
                    className="h-14 bg-white/5 border-white/10 rounded-2xl px-6 text-lg font-bold focus:border-secondary/50 transition-all"
                  />
                </div>
              </div>
              <Button 
                disabled={isSaving}
                onClick={() => handleSave('dailySpendingLimit', settings.dailySpendingLimit)}
                className="w-full max-w-[200px] h-12 rounded-xl bg-secondary/20 hover:bg-secondary/30 border border-secondary/40 text-xs font-bold uppercase tracking-widest text-secondary transition-all"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Limit"}
              </Button>
            </div>
          </GlassCard>

        </div>

        <div className="text-center py-8 border-t border-white/5">
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">© 2024 CampusSpend. System Integrity Engine.</p>
        </div>

      </div>
    </AdminShell>
  )
}
