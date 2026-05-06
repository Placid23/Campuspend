"use client"

import * as React from 'react'
import { useState } from 'react'
import { DashboardShell } from "@/components/layout/Shell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Search, 
  MapPin, 
  Clock, 
  Store, 
  ArrowRight
} from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import { collection, query, orderBy, limit } from 'firebase/firestore'
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase'

export default function VendorListPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const db = useFirestore()

  // Fetch real vendors from Firestore with optimization
  const vendorsQuery = useMemoFirebase(() => {
    return query(collection(db, "vendors"), orderBy("name", "asc"), limit(24))
  }, [db])

  const { data: vendors, isLoading } = useCollection(vendorsQuery)

  const filteredVendors = React.useMemo(() => {
    if (!vendors) return []
    return vendors.filter(v => 
      v.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      v.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.pickupLocation?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [vendors, searchQuery])

  return (
    <DashboardShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-500">
        <div className="space-y-4">
          <h1 className="text-4xl font-headline font-bold text-white">Campus <span className="text-primary neon-text-glow">Vendors</span></h1>
          <p className="text-muted-foreground text-sm font-medium">Discover and order from verified merchants across campus.</p>
        </div>

        {/* Optimized Search Bar */}
        <div className="relative group max-w-4xl">
          <div className="absolute inset-0 bg-primary/10 blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
          <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl h-14 px-6 gap-4">
            <Search className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/50 text-white" 
              placeholder="Search by store name, menu, or location..." 
            />
          </div>
        </div>

        {/* Optimized Content with Skeleton fallback */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-6">
                <Skeleton className="aspect-[16/9] rounded-3xl" />
                <div className="space-y-3">
                  <Skeleton className="h-6 w-2/3 rounded-xl" />
                  <Skeleton className="h-4 w-full rounded-xl" />
                  <Skeleton className="h-10 w-full rounded-2xl" />
                </div>
              </div>
            ))
          ) : filteredVendors && filteredVendors.length > 0 ? (
            filteredVendors.map((vendor) => (
              <GlassCard key={vendor.id} className="p-0 border-white/10 group overflow-hidden flex flex-col hover:border-primary/40 transition-all">
                <div className="relative aspect-[16/9] overflow-hidden bg-white/5">
                  <Image 
                    src={vendor.bannerUrl || `https://picsum.photos/seed/${vendor.id}/600/400`}
                    alt={vendor.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-4 left-6">
                    <h3 className="text-2xl font-headline font-bold text-white truncate drop-shadow-lg">{vendor.name}</h3>
                  </div>
                </div>
                <div className="p-6 space-y-6">
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed font-medium">
                      {vendor.description || "Official campus merchant providing quality products and services to students."}
                    </p>
                    <div className="flex flex-col gap-2">
                       <div className="flex items-center gap-1.5 text-[10px] text-primary font-bold uppercase tracking-widest">
                          <MapPin className="w-3.5 h-3.5" /> 
                          <span className="truncate">{vendor.pickupLocation || 'Main Campus'}</span>
                       </div>
                       <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                          <Clock className="w-3.5 h-3.5" /> 
                          <span>Open Until 10:30 PM</span>
                       </div>
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
                <p className="text-muted-foreground max-w-xs mx-auto">Try a different search or explore other campus zones.</p>
              </div>
            </div>
          )}
        </div>

        {!isLoading && filteredVendors.length > 0 && (
          <div className="flex justify-center pt-8 pb-12 border-t border-white/5">
             <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest opacity-60">
               Tracking {filteredVendors.length} Verified Merchants
             </p>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}
