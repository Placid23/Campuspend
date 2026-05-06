"use client"

import { useState, use } from 'react'
import { DashboardShell } from "@/components/layout/Shell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  MapPin, 
  Clock, 
  ChevronDown, 
  Heart,
  Zap,
  Loader2,
  Package,
  ArrowLeft,
  ShieldCheck
} from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import { cn } from "@/lib/utils"
import { collection, query, where, doc } from 'firebase/firestore'
import { useFirestore, useCollection, useDoc, useMemoFirebase } from '@/firebase'

export default function VendorProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: vendorId } = use(params)
  const [activeCategory, setActiveCategory] = useState("All")
  const db = useFirestore()

  const vendorRef = useMemoFirebase(() => doc(db, "vendors", vendorId), [db, vendorId])
  const { data: vendor, isLoading: vendorLoading } = useDoc(vendorRef)

  const productsQuery = useMemoFirebase(() => {
    return query(collection(db, "products"), where("vendorOwnerId", "==", vendor?.userId || vendorId))
  }, [db, vendor?.userId, vendorId])

  const { data: products, isLoading: productsLoading } = useCollection(productsQuery)

  const categories = ["All", "Fast Food", "Drinks", "Books", "Stationery"]

  if (vendorLoading) {
    return (
      <DashboardShell>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <Link href="/vendors" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-3 h-3" /> Back to Vendors
            </Link>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-headline font-bold">{vendor?.name || "Vendor Store"}</h1>
                {vendor?.isVerified && (
                  <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest animate-in zoom-in duration-500">
                    <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Verified Store
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-primary" /> {vendor?.pickupLocation || 'Main Campus'}</span>
                <span className="text-primary hidden sm:inline">+</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-primary" /> Open Until 10:30 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div className="relative h-48 md:h-64 w-full rounded-[2.5rem] overflow-hidden border border-white/10">
          <Image 
            src={vendor?.bannerUrl || `https://picsum.photos/seed/${vendorId}-banner/1200/400`} 
            alt="Store Banner" 
            fill 
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-8">
             <p className="text-sm text-white/80 font-medium max-w-lg line-clamp-2">{vendor?.description || "Welcome to our official campus store."}</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-2xl h-12 pl-14 pr-6 text-sm focus:outline-none focus:border-primary/50 transition-all" 
              placeholder="Search for items..." 
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide w-full md:w-auto">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "rounded-xl px-6 py-2 text-xs font-bold transition-all border shrink-0",
                  activeCategory === cat 
                    ? "bg-primary/20 border-primary text-white shadow-[0_0_15px_rgba(239,26,184,0.3)]" 
                    : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {productsLoading ? (
            <div className="col-span-full py-20 flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Fetching Fresh Menu...</p>
            </div>
          ) : products && products.length > 0 ? (
            products.map((product) => (
              <GlassCard key={product.id} className="p-0 border-white/10 group overflow-hidden flex flex-col md:flex-row hover:border-primary/40 transition-all">
                <div className="flex-1 p-8 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-headline font-bold truncate pr-4">{product.name}</h3>
                      <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">{product.category}</p>
                    </div>
                    <button className="text-muted-foreground hover:text-rose-500 transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-primary/10 text-primary border-none px-3 py-0.5 text-[8px] font-bold flex gap-1 items-center rounded-lg uppercase">
                      <Zap className="w-2 h-2" /> In Stock: {product.stock}
                    </Badge>
                  </div>

                  <div className="text-2xl font-headline font-bold text-primary neon-text-glow">₦{product.price.toLocaleString()}</div>

                  <div className="flex gap-4 items-center">
                    <Link href={`/products/${product.id}`} className="flex-1">
                      <Button className="w-full h-11 rounded-2xl bg-primary/20 hover:bg-primary/30 border border-primary/40 text-xs font-bold text-white transition-all shadow-[0_0_15px_rgba(239,26,184,0.2)]">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
                
                <div className="relative w-full md:w-[45%] aspect-square md:aspect-auto bg-white/5">
                  <Image 
                    src={product.imageUrl || `https://picsum.photos/seed/${product.id}/400/400`} 
                    alt={product.name} 
                    fill 
                    className="object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent hidden md:block" />
                </div>
              </GlassCard>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <Package className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-muted-foreground">This vendor hasn't listed any products yet.</p>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}
