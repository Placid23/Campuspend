
"use client"

import * as React from "react"
import { useState, useRef } from "react"
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
  Info,
  ImageIcon,
  Zap,
  Upload
} from "lucide-react"
import Image from "next/image"
import { collection, serverTimestamp, doc, setDoc } from 'firebase/firestore'
import { useFirestore, useUser, errorEmitter, FirestorePermissionError } from '@/firebase'

export default function AddProductPage() {
  const [loading, setLoading] = useState(false)
  const { user } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: "",
    category: "fast-food",
    description: "",
    price: "0",
    stock: "0",
    lowStockThreshold: "5",
    isActive: true,
    imageUrl: ""
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 800000) { // ~800KB limit for prototype stability
      toast({ variant: "destructive", title: "File Too Large", description: "Please select an image under 800KB for the prototype." })
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setFormData({ ...formData, imageUrl: reader.result as string })
      toast({ title: "Visual Node Captured", description: "Local asset mapped to product buffer." })
    }
    reader.readAsDataURL(file)
  }

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
      imageUrl: formData.imageUrl || `https://picsum.photos/seed/${productRef.id}/600/600`,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    setDoc(productRef, productData)
      .then(() => {
        toast({
          title: "Product Added",
          description: `${formData.name} is now live in your shop.`,
        })
        router.push("/vendor/manage")
      })
      .catch(async (error) => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: productRef.path,
          operation: 'create',
          requestResourceData: productData,
        }))
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
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-3xl border-2 border-dashed border-white/10 bg-black/20 flex flex-col items-center justify-center gap-4 relative overflow-hidden group shadow-inner cursor-pointer hover:border-primary/40 transition-all"
                    >
                       {formData.imageUrl ? (
                         <Image src={formData.imageUrl} alt="Preview" fill className="object-cover transition-transform group-hover:scale-110" />
                       ) : (
                         <div className="flex flex-col items-center gap-2">
                           <Upload className="w-10 h-10 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                           <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Select Image</p>
                         </div>
                       )}
                       <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-[8px] font-bold text-white uppercase tracking-[0.2em]">Change Local Asset</p>
                       </div>
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleFileChange} 
                    />
                  </div>

                  <div className="md:col-span-8 space-y-6">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Product Name</Label>
                       <Input 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          placeholder="e.g. Premium Beef Burger" 
                          className="h-12 bg-white/5 border-white/10 rounded-xl px-6 focus:border-primary/50 transition-all font-bold"
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Category</Label>
                       <Select value={formData.category} onValueChange={(val) => setFormData({...formData, category: val})}>
                          <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl px-6">
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
                       <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Visual Asset Protocol (Local or URL)</Label>
                       <Input 
                          value={formData.imageUrl.startsWith('data:') ? 'Local Image Captured' : formData.imageUrl}
                          onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                          placeholder="Or paste an image URL here..." 
                          className="h-12 bg-white/5 border-white/10 rounded-xl px-6 text-xs"
                       />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                   <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Description</Label>
                   <Textarea 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Describe your product to students..." 
                      className="min-h-[100px] bg-white/5 border-white/10 rounded-xl p-6 focus:border-primary/50"
                   />
                </div>
              </div>

              <div className="h-px bg-white/5 w-full"></div>

              <div className="space-y-6">
                 <h3 className="text-lg font-headline font-bold text-white/80 tracking-wide">Economics</h3>
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
                       <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Initial Stock</Label>
                       <Input 
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                        className="h-12 bg-white/5 border-white/10 rounded-xl px-6 text-sm" 
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Low Stock Alert</Label>
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
              <h3 className="text-lg font-headline font-bold text-white">System Visibility</h3>
              <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Active Node</span>
                    <Switch 
                      checked={formData.isActive} 
                      onCheckedChange={(val) => setFormData({...formData, isActive: val})}
                      className="data-[state=checked]:bg-emerald-500" 
                    />
                 </div>
                 <Button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-secondary text-base font-bold shadow-[0_0_30px_rgba(239,26,184,0.4)]"
                 >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Publish Listing"}
                 </Button>
                 <div className="text-center">
                    <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-[0.2em]">
                       <Zap className="inline w-2 h-2 text-primary mr-1" /> Atomic Cloud Sync Active
                    </p>
                 </div>
              </div>
            </GlassCard>
          </div>
        </form>
      </div>
    </VendorShell>
  )
}
