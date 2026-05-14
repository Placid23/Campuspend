"use client"

import * as React from "react"
import { useState, useEffect, use } from "react"
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
  Save, 
  ChevronLeft, 
  Loader2,
  Package,
  Info,
  Zap,
  ArrowLeft
} from "lucide-react"
import { updateDoc, serverTimestamp, doc } from 'firebase/firestore'
import { useFirestore, useUser, useDoc, useMemoFirebase } from '@/firebase'
import Image from "next/image"
import Link from "next/link"

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: productId } = use(params)
  const router = useRouter()
  const db = useFirestore()
  const { toast } = useToast()
  const { user } = useUser()

  const productRef = useMemoFirebase(() => doc(db, "products", productId), [db, productId])
  const { data: product, isLoading: productLoading } = useDoc(productRef)

  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "0",
    stock: "0",
    lowStockThreshold: "5",
    isActive: true
  })

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        category: product.category || "fast-food",
        description: product.description || "",
        price: String(product.price || 0),
        stock: String(product.stock || 0),
        lowStockThreshold: String(product.lowStockThreshold || 5),
        isActive: product.isActive ?? true
      })
    }
  }, [product])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !product) return

    setLoading(true)
    const updateData = {
      name: formData.name,
      category: formData.category,
      description: formData.description,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      lowStockThreshold: parseInt(formData.lowStockThreshold),
      isActive: formData.isActive,
      updatedAt: serverTimestamp()
    }

    try {
      await updateDoc(productRef, updateData)
      toast({
        title: "Update Successful",
        description: "Listing details synced across the platform.",
      })
      router.push("/vendor/manage")
    } catch (err) {
      toast({ variant: "destructive", title: "Update Failed" })
    } finally {
      setLoading(false)
    }
  }

  if (productLoading) {
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
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        <div className="space-y-4">
           <Link href="/vendor/manage" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-3 h-3" /> Back to Inventory
           </Link>
           <h1 className="text-3xl font-headline font-bold text-white tracking-tight">Edit Product</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8">
            <GlassCard className="p-10 border-white/10 space-y-10 bg-white/5 backdrop-blur-3xl">
              <div className="space-y-6">
                <h3 className="text-lg font-headline font-bold text-white/80 tracking-wide">Listing Detail</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  <div className="md:col-span-4 space-y-4">
                    <div className="aspect-square rounded-3xl border border-white/10 bg-black/20 relative overflow-hidden group shadow-inner">
                       <Image 
                        src={product?.imageUrl || `https://picsum.photos/seed/${productId}/600/600`} 
                        alt="Product" 
                        fill 
                        className="object-cover group-hover:scale-110 transition-transform duration-700" 
                       />
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-[8px] font-bold text-white uppercase tracking-[0.2em]">PBL Image Node</p>
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
                          className="h-12 bg-white/5 border-white/10 rounded-xl px-6 focus:border-primary/50 transition-all font-bold"
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Taxonomy Category</Label>
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
                       <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Description Buffer</Label>
                       <Textarea 
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          className="min-h-[120px] bg-white/5 border-white/10 rounded-xl p-6 focus:border-primary/50 transition-all text-sm"
                       />
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/5 w-full"></div>

              <div className="space-y-6">
                 <h3 className="text-lg font-headline font-bold text-white/80 tracking-wide">Economics & Volume</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Price (₦)</Label>
                       <Input 
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="h-12 bg-white/5 border-white/10 rounded-xl px-6 text-sm font-bold" 
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Available Stock</Label>
                       <Input 
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                        className="h-12 bg-white/5 border-white/10 rounded-xl px-6 text-sm font-bold" 
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Low Stock Trigger</Label>
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
              <h3 className="text-lg font-headline font-bold text-white">System Status</h3>
              <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-white/80 uppercase">Visibility Node</span>
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
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Commit Changes"}
                 </Button>
                 <div className="flex items-center justify-center gap-2 text-[8px] text-muted-foreground uppercase font-bold tracking-[0.2em]">
                    <Zap className="w-3 h-3 text-primary" /> Atomic Sync Active
                 </div>
              </div>
            </GlassCard>
          </div>
        </form>
      </div>
    </VendorShell>
  )
}