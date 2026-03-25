
"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { VendorShell } from "@/components/layout/VendorShell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { 
  Plus, 
  ChevronRight, 
  Loader2,
  Package,
  Info
} from "lucide-react"
import { collection, serverTimestamp, doc, setDoc } from 'firebase/firestore'
import { useFirestore, useUser, errorEmitter, FirestorePermissionError } from '@/firebase'

export default function AddProductPage() {
  const [loading, setLoading] = useState(false)
  const { user } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  const router = useRouter()

  const [formData, setFormData] = useState({
    name: "",
    category: "fast-food",
    description: "",
    price: "0",
    stock: "0",
    lowStockThreshold: "5",
    isActive: true
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    const productRef = doc(collection(db, "products"))
    
    const productData = {
      id: productRef.id,
      name: formData.name,
      category: formData.category,
      description: formData.description,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      lowStockThreshold: parseInt(formData.lowStockThreshold),
      isActive: formData.isActive,
      vendorOwnerId: user.uid,
      imageUrl: `https://picsum.photos/seed/${productRef.id}/600/600`,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    // Non-blocking write
    setDoc(productRef, productData)
      .then(() => {
        toast({
          title: "Product Added",
          description: `${formData.name} is now live in your shop.`,
        })
        router.push("/vendor/manage")
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: productRef.path,
          operation: 'create',
          requestResourceData: productData,
        })
        errorEmitter.emit('permission-error', permissionError)
      })
      .finally(() => setLoading(false))
  }

  return (
    <VendorShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        <h1 className="text-3xl font-headline font-bold text-white tracking-tight">Add New Product</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8">
            <GlassCard className="p-10 border-white/10 space-y-10 bg-white/5 backdrop-blur-3xl">
              <div className="space-y-6">
                <h3 className="text-lg font-headline font-bold text-white/80 tracking-wide">Product Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  <div className="md:col-span-4 space-y-4">
                    <div className="aspect-square rounded-2xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center gap-4 group transition-all relative overflow-hidden">
                       <div className="p-4 rounded-full bg-primary/10 text-primary">
                          <Package className="w-8 h-8" />
                       </div>
                       <div className="text-center space-y-1">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Image Auto-Generated</p>
                       </div>
                    </div>
                  </div>

                  <div className="md:col-span-8 space-y-6">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Product Name</Label>
                       <Input 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="e.g. Classic Beef Burger" 
                          className="h-12 bg-white/5 border-white/10 rounded-xl px-6 focus:border-primary/50 transition-all text-sm"
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Category</Label>
                       <Select value={formData.category} onValueChange={(val) => setFormData({...formData, category: val})}>
                          <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl px-6 focus:ring-primary/30">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-white/10">
                            <SelectItem value="fast-food">Fast Food</SelectItem>
                            <SelectItem value="drinks">Drinks</SelectItem>
                            <SelectItem value="books">Books</SelectItem>
                            <SelectItem value="stationery">Stationery</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Description</Label>
                       <Textarea 
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          placeholder="Tell students about your product..." 
                          className="min-h-[120px] bg-white/5 border-white/10 rounded-xl p-6 focus:border-primary/50 transition-all text-sm"
                       />
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/5 w-full"></div>

              <div className="space-y-6">
                 <h3 className="text-lg font-headline font-bold text-white/80 tracking-wide">Pricing & Stock</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Price (₦)</Label>
                       <Input 
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="h-12 bg-white/5 border-white/10 rounded-xl px-6 text-sm" 
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Stock Quantity</Label>
                       <Input 
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                        className="h-12 bg-white/5 border-white/10 rounded-xl px-6 text-sm" 
                       />
                    </div>
                    <div className="space-y-2">
                       <div className="flex items-center gap-2 mb-2">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Low Stock Alert</Label>
                          <Info className="w-3 h-3 text-muted-foreground/40" />
                       </div>
                       <Input 
                        type="number"
                        value={formData.lowStockThreshold}
                        onChange={(e) => setFormData({...formData, lowStockThreshold: e.target.value})}
                        className="h-12 bg-white/5 border-white/10 rounded-xl px-6 text-sm" 
                       />
                    </div>
                 </div>
              </div>
            </GlassCard>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <GlassCard className="p-8 border-primary/20 bg-primary/5 space-y-8">
              <h3 className="text-lg font-headline font-bold text-white">Status & Visibility</h3>
              <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white/80">Active Listing</span>
                    <Switch 
                      checked={formData.isActive} 
                      onCheckedChange={(val) => setFormData({...formData, isActive: val})}
                      className="data-[state=checked]:bg-emerald-500" 
                    />
                 </div>
                 <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-secondary text-base font-bold shadow-[0_0_30px_rgba(239,26,184,0.4)] hover:opacity-90 active:scale-[0.98] transition-all"
                 >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publish Product"}
                 </Button>
              </div>
            </GlassCard>
          </div>
        </form>
      </div>
    </VendorShell>
  )
}
