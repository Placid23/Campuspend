"use client"

import { useState } from 'react'
import { DashboardShell } from "@/components/layout/Shell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  MapPin, 
  Clock, 
  ChevronDown, 
  Star, 
  Heart,
  Zap,
  Navigation,
  Loader2,
  Store,
  ArrowRight
} from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import { cn } from "@/lib/utils"
import { collection, query, orderBy } from 'firebase/firestore'
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase'

export default function VendorListPage() {
  const [activeCategory, setActiveCategory] = useState("All")
  const db = useFirestore()

  // Fetch real vendors from Firestore
  const vendorsQuery = useMemoFirebase(() => {
    return query(collection(db, "vendors"), orderBy("name", "asc"))
  }, [db])

  const { data: vendors, isLoading, error } = useCollection(vendorsQuery)

  return (
    <DashboardShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
        <div className="space-y-4">
          <h1 className="text-4xl font-headline font-bold text-white">Campus <span className="text-primary neon-text-glow">Vendors</span></h1>
          <p className="text-muted-foreground text-sm">Discover and order from verified merchants across campus.</p>
        </div>

        {/* Search Bar */}
        <div className="relative group max-w-4xl">
          <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
          <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl h-14 px-6 gap-4">
            <Search className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/50 text-white" 
              placeholder="Search for vendors or products..." 
            />
            <div className="flex items-center gap-4 pl-4 border-l border-white/10">
               <Button size="icon" className="h-10 w-10 rounded-xl bg-primary shadow-[0_0_15px_rgba(239,26,184,0.4)]">
                 <Search className="w-4 h-4 text-white" />
               </Button>
            </div>
          </div>
        </div>

        {/* Vendor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            <div className="col-span-full py-20 flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Discovering Campus Vendors...</p>
            </div>
          ) : vendors && vendors.length > 0 ? (
            vendors.map((vendor) => (
              <GlassCard key={vendor.id} className="p-0 border-white/10 group overflow-hidden flex flex-col hover:border-primary/40 transition-all">
                <div className="relative aspect-[16/9] overflow-hidden bg-white/5">
                  <Image 
                    src={vendor.imageUrl || `https://picsum.photos/seed/${vendor.id}/600/400`}
                    alt={vendor.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-4 left-6">
                    <h3 className="text-2xl font-headline font-bold text-white truncate">{vendor.name}</h3>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                      {vendor.description || "Official campus merchant providing quality products and services to students."}
                    </p>
                    <div className="flex items-center gap-4 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                       <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-primary" /> Open Now</span>
                       <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-primary" /> Main Campus</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Link href={`/vendors/${vendor.id}`} className="flex-1">
                      <Button className="w-full h-12 rounded-2xl bg-primary/20 hover:bg-primary/30 border border-primary/40 text-xs font-bold text-white transition-all shadow-[0_0_20px_rgba(239,26,184,0.2)] group/btn">
                        Browse Items <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </GlassCard>
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-6">
              <div className="w-20 h-20 rounded-full bg-white/5 border border-dashed border-white/10 flex items-center justify-center mx-auto">
                <Store className="w-10 h-10 text-muted-foreground/20" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-headline font-bold text-white">No Vendors Found</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">It looks like there aren't any active vendors on campus yet.</p>
              </div>
              {/* Optional: Add a button for vendors to register if they see this */}
            </div>
          )}
        </div>

        {/* Stats Footer */}
        {!isLoading && vendors && (
          <div className="flex justify-center pt-8 pb-12 border-t border-white/5">
             <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
               Currently tracking {vendors.length} verified campus merchants
             </p>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
