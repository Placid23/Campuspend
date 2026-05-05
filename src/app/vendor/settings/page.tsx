
"use client"

import * as React from "react"
import { VendorShell } from "@/components/layout/VendorShell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Zap, 
  CreditCard,
  Settings,
  Loader2,
  Save
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useFirestore, useUser, useDoc, useMemoFirebase } from "@/firebase"
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { useToast } from "@/hooks/use-toast"

export default function VendorProfilePage() {
  const { user, profile } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  
  // Fetch real vendor document
  const vendorRef = useMemoFirebase(() => {
    if (!user) return null
    return doc(db, "vendors", user.uid)
  }, [db, user])

  const { data: vendor, isLoading } = useDoc(vendorRef)
  const [isSaving, setIsSaving] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: "",
    contactEmail: "",
    description: "",
    contactPhone: ""
  })

  React.useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name || "",
        contactEmail: vendor.contactEmail || "",
        description: vendor.description || "",
        contactPhone: vendor.contactPhone || ""
      })
    }
  }, [vendor])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setIsSaving(true)
    try {
      await updateDoc(doc(db, "vendors", user.uid), {
        ...formData,
        updatedAt: serverTimestamp()
      })
      // Also update user profile name for consistency
      await updateDoc(doc(db, "userProfiles", user.uid), {
        name: formData.name,
        updatedAt: new Date().toISOString()
      })
      toast({ title: "Profile Updated", description: "Your vendor store details have been saved." })
    } catch (err) {
      toast({ variant: "destructive", title: "Update Failed", description: "Could not save changes." })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <VendorShell>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </VendorShell>
    )
  }

  return (
    <VendorShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
        
        <div className="space-y-2">
          <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Vendor <span className="text-primary neon-text-glow">Profile</span></h1>
          <p className="text-muted-foreground text-sm">Manage your store identity and account preferences.</p>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-4 space-y-6">
            <GlassCard className="p-8 border-white/10 flex flex-col items-center text-center space-y-6 bg-white/5 backdrop-blur-3xl">
              <div className="relative w-48 h-48">
                <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-50 animate-pulse"></div>
                <div className="relative z-10 w-full h-full rounded-3xl overflow-hidden border-2 border-primary/30">
                  <Image 
                    src={vendor?.imageUrl || `https://picsum.photos/seed/${user?.uid}/400/400`} 
                    alt="Vendor Avatar" 
                    fill 
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-headline font-bold text-white">{vendor?.name || 'My Shop'}</h2>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">#{user?.uid.substring(0, 8)}</p>
                <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase">
                  Verified Merchant
                </div>
              </div>

              <div className="w-full space-y-3 text-left px-2">
                <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                  <Mail className="w-3 h-3 text-primary" />
                  <span className="truncate">{vendor?.contactEmail}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                  <Zap className="w-3 h-3 text-primary" />
                  <span>Naira (₦) Enabled</span>
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="lg:col-span-8 space-y-8">
            <GlassCard className="p-8 border-white/10 space-y-6 bg-white/5 backdrop-blur-3xl">
              <div className="flex items-center gap-3 mb-2">
                <Settings className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-headline font-bold text-white">General Settings</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Store Name</Label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="h-12 bg-white/5 border-white/10 rounded-xl px-6 focus:border-primary/50 transition-all text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Contact Email</Label>
                  <Input 
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                    className="h-12 bg-white/5 border-white/10 rounded-xl px-6 focus:border-primary/50 transition-all text-sm"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Store Description</Label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full min-h-[100px] bg-white/5 border border-white/10 rounded-xl p-6 focus:border-primary/50 transition-all text-sm outline-none resize-none text-white/80"
                    placeholder="Tell students about your shop..."
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  disabled={isSaving}
                  className="h-14 px-12 rounded-2xl bg-gradient-to-r from-primary to-secondary text-base font-bold shadow-[0_0_30px_rgba(239,26,184,0.4)]"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Save className="w-5 h-5 mr-2" />}
                  Save Store Profile
                </Button>
              </div>
            </GlassCard>

            <GlassCard className="p-8 border-white/10 space-y-8 bg-white/5">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-headline font-bold text-white">Security & Access</h3>
              </div>
              <p className="text-sm text-muted-foreground">Store access is restricted to verified campus account holders. Your digital identity is protected by the CampusSpend infrastructure.</p>
            </GlassCard>
          </div>
        </form>
      </div>
    </VendorShell>
  )
}
