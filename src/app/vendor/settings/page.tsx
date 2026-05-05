
"use client"

import * as React from "react"
import { VendorShell } from "@/components/layout/VendorShell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { 
  Mail, 
  Phone, 
  MapPin, 
  Zap, 
  CreditCard,
  Settings,
  Loader2,
  Save,
  LogOut,
  Bell,
  Volume2,
  Store
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useFirestore, useUser, useDoc, useMemoFirebase, useAuth } from "@/firebase"
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { useToast } from "@/hooks/use-toast"
import { signOut } from 'firebase/auth'
import { useRouter } from 'next/navigation'

export default function VendorProfilePage() {
  const { user, profile } = useUser()
  const db = useFirestore()
  const auth = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  
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
  
  const [notifications, setNotifications] = React.useState({
    newOrders: true,
    soundAlerts: true,
    inventoryLow: true
  })

  React.useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name || "",
        contactEmail: vendor.contactEmail || "",
        description: vendor.description || "",
        contactPhone: vendor.contactPhone || ""
      })
      if (vendor.settings?.notifications) {
        setNotifications(vendor.settings.notifications)
      }
    }
  }, [vendor])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setIsSaving(true)
    try {
      await updateDoc(doc(db, "vendors", user.uid), {
        ...formData,
        settings: { notifications },
        updatedAt: serverTimestamp()
      })
      await updateDoc(doc(db, "userProfiles", user.uid), {
        name: formData.name,
        updatedAt: serverTimestamp()
      })
      toast({ title: "Merchant Profile Updated", description: "Changes synced across the marketplace." })
    } catch (err) {
      toast({ variant: "destructive", title: "Update Failed", description: "Could not save merchant settings." })
    } finally {
      setIsSaving(false)
    }
  }

  const handleLogout = async () => {
    await signOut(auth)
    router.push("/login")
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
      <div className="space-y-12 animate-in fade-in slide-in-from-bottom duration-700">
        
        <div className="space-y-2">
          <h1 className="text-5xl font-headline font-bold text-white tracking-tight">Store <span className="text-primary neon-text-glow">HQ</span></h1>
          <p className="text-muted-foreground font-medium">Configure your shop identity, alert triggers, and business status.</p>
        </div>

        <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          <div className="lg:col-span-4 space-y-8">
            <GlassCard className="p-10 border-white/10 flex flex-col items-center text-center space-y-8 bg-white/5 backdrop-blur-3xl">
              <div className="relative w-48 h-48 group">
                <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-50 animate-pulse group-hover:opacity-100 transition-opacity"></div>
                <div className="relative z-10 w-full h-full rounded-[2.5rem] overflow-hidden border-2 border-primary/30 p-1">
                  <Image 
                    src={vendor?.imageUrl || `https://picsum.photos/seed/${user?.uid}/400/400`} 
                    alt="Vendor Avatar" 
                    fill 
                    className="object-cover rounded-[2.2rem]"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <h2 className="text-3xl font-headline font-bold text-white leading-tight">{vendor?.name || 'My Shop'}</h2>
                <div className="px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                  Verified Merchant
                </div>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest pt-2">Merchant ID: {user?.uid.substring(0, 10)}</p>
              </div>

              <div className="w-full pt-8 border-t border-white/5 space-y-4 text-left">
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:text-primary transition-colors">
                     <Mail className="w-4 h-4" />
                  </div>
                  <span className="truncate">{vendor?.contactEmail}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium group">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 group-hover:text-primary transition-colors">
                     <Zap className="w-4 h-4" />
                  </div>
                  <span>Naira (₦) Ready</span>
                </div>
              </div>

              <Button 
                variant="destructive" 
                onClick={handleLogout}
                className="w-full h-12 rounded-xl font-bold uppercase tracking-widest text-[10px] bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 text-rose-500 hover:text-white transition-all"
              >
                <LogOut className="w-4 h-4 mr-2" /> Deactivate Session
              </Button>
            </GlassCard>
          </div>

          <div className="lg:col-span-8 space-y-10">
            {/* General Identity */}
            <GlassCard className="p-10 border-white/10 space-y-8 bg-white/5 backdrop-blur-3xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                   <Store className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-headline font-bold text-white">Merchant Identity</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Public Store Name</Label>
                  <Input 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="h-14 bg-white/5 border-white/10 rounded-xl px-6 focus:border-primary/50 transition-all font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Official Support Email</Label>
                  <Input 
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                    className="h-14 bg-white/5 border-white/10 rounded-xl px-6 focus:border-primary/50 transition-all"
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Store Narrative</Label>
                  <textarea 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full min-h-[140px] bg-white/5 border border-white/10 rounded-xl p-6 focus:border-primary/50 transition-all outline-none resize-none text-white/90 font-medium leading-relaxed"
                    placeholder="Tell students about your shop offerings..."
                  />
                </div>
              </div>
            </GlassCard>

            {/* Merchant Alert Center */}
            <GlassCard className="p-10 border-white/10 space-y-8 bg-white/5 backdrop-blur-3xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-inner">
                   <Bell className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-headline font-bold text-white">Alert Configurations</h3>
              </div>

              <div className="space-y-6">
                 {[
                   { key: 'newOrders', icon: Zap, label: 'Real-time Orders', desc: 'Notify me instantly when a student places an order.' },
                   { key: 'soundAlerts', icon: Volume2, label: 'Kitchen Sounders', desc: 'Play audible chimes when an order enters preparation.' },
                   { key: 'inventoryLow', icon: Settings, label: 'Inventory Triggers', desc: 'Alert me when stock falls below global thresholds.' },
                 ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 group hover:border-amber-500/20 transition-all">
                       <div className="flex items-center gap-5">
                          <div className="p-2.5 rounded-xl bg-muted text-muted-foreground group-hover:text-amber-500 transition-colors">
                             <item.icon className="w-5 h-5" />
                          </div>
                          <div>
                             <p className="text-sm font-bold text-white/90">{item.label}</p>
                             <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{item.desc}</p>
                          </div>
                       </div>
                       <Switch 
                        checked={(notifications as any)[item.key]} 
                        onCheckedChange={(val) => setNotifications({...notifications, [item.key]: val})}
                        className="data-[state=checked]:bg-amber-500"
                       />
                    </div>
                 ))}
              </div>
            </GlassCard>

            <div className="flex justify-end pt-4">
              <Button 
                disabled={isSaving}
                className="h-16 px-20 rounded-2xl bg-gradient-to-r from-primary to-secondary text-lg font-bold shadow-[0_0_40px_rgba(239,26,184,0.4)] hover:scale-[1.02] active:scale-95 transition-all"
              >
                {isSaving ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : <Save className="w-6 h-6 mr-3" />}
                Synchronize Merchant Profile
              </Button>
            </div>
          </div>
        </form>

        <div className="text-center py-12 border-t border-white/5">
           <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.5em]">© 2024 CafePay Wallet • Merchant Operations Suite</p>
        </div>
      </div>
    </VendorShell>
  )
}
