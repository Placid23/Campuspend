
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
  Store,
  ArrowRight,
  Filter,
  Navigation,
  Zap
} from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import { cn } from "@/lib/utils"

const vendorCategories = ["All", "Fast Food", "Drinks", "Bookstore", "Stationery"]

const vendors = [
  {
    id: "pizza-more",
    name: "Pizza & More",
    categories: ["Fast Food", "Pizza"],
    distance: "300m from Main Campus",
    timing: "Until 10:30 PM",
    rating: 120,
    priceRange: "₦120 Starting",
    image: "https://picsum.photos/seed/pizza-shop/400/225"
  },
  {
    id: "books-corner",
    name: "Books Corner",
    categories: ["Bookstore", "Stationery"],
    distance: "300m from Main Campus",
    timing: "Until 8:30 PM",
    rating: 80,
    priceRange: "₦100 Starting",
    image: "https://picsum.photos/seed/bookstore/400/225"
  },
  {
    id: "foodhub-cafe",
    name: "FoodHub Cafe",
    categories: ["Fast Food", "Drinks"],
    distance: "350m from Main Campus",
    timing: "Until 10:00 PM",
    rating: 21,
    priceRange: "₦100 Starting",
    image: "https://picsum.photos/seed/cafe/400/225"
  },
  {
    id: "print-spiral",
    name: "Print & Spiral",
    categories: ["Stationery", "Supplies"],
    distance: "400m from Main Campus",
    timing: "Until 10:00 PM",
    rating: 40,
    priceRange: "₦150 Starting",
    image: "https://picsum.photos/seed/printshop/400/225"
  }
]

export default function VendorListPage() {
  const [activeCategory, setActiveCategory] = useState("All")

  return (
    <DashboardShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
        <div className="space-y-4">
          <h1 className="text-4xl font-headline font-bold">Vendors</h1>
          <p className="text-muted-foreground text-sm">Browse campus vendors and find the best deals.</p>
        </div>

        {/* High-Fidelity Search Bar */}
        <div className="relative group max-w-4xl">
          <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
          <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl h-14 px-6 gap-4">
            <Search className="w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-muted-foreground/50" 
              placeholder="Search for vendors or products..." 
            />
            <div className="flex items-center gap-4 pl-4 border-l border-white/10">
               <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Filter Vendors</span>
               <Button variant="ghost" size="sm" className="h-8 rounded-xl bg-white/5 text-[10px] font-bold flex gap-2">
                 <Navigation className="w-3 h-3 text-primary" /> Nearest <ChevronDown className="w-3 h-3" />
               </Button>
               <Button size="icon" className="h-10 w-10 rounded-xl bg-primary shadow-[0_0_15px_rgba(239,26,184,0.4)]">
                 <Search className="w-4 h-4" />
               </Button>
               <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-white/10 hover:bg-white/5">
                 <Heart className="w-4 h-4" />
               </Button>
            </div>
          </div>
        </div>

        {/* Filter Row */}
        <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/5">
           <div className="flex items-center gap-4">
             <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Filter Vendors</span>
             <div className="flex gap-2">
               {["All", "Fast Food", "Stationery"].map(cat => (
                 <Badge key={cat} className={cn(
                   "rounded-xl px-4 py-1.5 text-[10px] font-bold cursor-pointer transition-all border",
                   cat === "All" ? "bg-primary/20 border-primary text-white" : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                 )}>{cat}</Badge>
               ))}
             </div>
           </div>

           <div className="flex items-center gap-4 ml-auto">
              <div className="flex items-center gap-2">
                 <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Campus:</span>
                 <div className="h-8 w-12 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-xs font-bold">Main</div>
              </div>
              <div className="flex items-center gap-2">
                 <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Sort By:</span>
                 <Button variant="outline" size="sm" className="h-8 rounded-lg border-white/10 bg-white/5 text-xs font-bold flex gap-2">
                   Nearest <ChevronDown className="w-3 h-3" />
                 </Button>
              </div>
              <Button variant="link" className="text-[10px] font-bold uppercase text-muted-foreground p-0 h-auto">Clear Filter: <span className="text-white">Reset</span></Button>
           </div>
        </div>

        {/* Vendor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vendors.map((vendor) => (
            <GlassCard key={vendor.id} className="p-0 border-white/10 group overflow-hidden flex flex-col hover:border-primary/40 transition-all">
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image 
                  src={vendor.image} 
                  alt={vendor.name} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-black/40 flex items-center justify-center text-white backdrop-blur-md">
                   <MoreVerticalIcon className="w-3 h-3" />
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-headline font-bold">{vendor.name}</h3>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {vendor.categories.map((cat, i) => (
                    <Badge key={i} className="bg-primary/10 text-primary border-none px-3 py-0.5 text-[8px] font-bold rounded-lg">
                      {cat}
                    </Badge>
                  ))}
                </div>

                <div className="space-y-2">
                   <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                      <Clock className="w-3 h-3 text-primary" /> {vendor.distance} • {vendor.timing}
                   </div>
                   <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-primary text-primary" />)}
                      <span className="text-[10px] font-bold text-muted-foreground ml-2">{vendor.rating}+</span>
                   </div>
                </div>

                <Link href={`/vendors/${vendor.id}`}>
                  <Button className="w-full h-11 rounded-2xl bg-gradient-to-r from-primary to-secondary text-xs font-bold text-white shadow-[0_0_20px_rgba(239,26,184,0.3)] hover:opacity-90">
                    Browse Items
                  </Button>
                </Link>

                <div className="flex justify-between items-center pt-2 border-t border-white/5">
                   <span className="text-xs font-bold text-white">{vendor.priceRange}</span>
                   <div className="flex items-center gap-1.5 text-primary text-[10px] font-bold">
                      <Zap className="w-3 h-3" /> Featured
                   </div>
                </div>
              </div>
            </GlassCard>
          ))}

          {/* Special Wide Card (Shawarma Example) */}
          <GlassCard className="lg:col-span-2 p-0 border-white/10 group overflow-hidden flex flex-col md:flex-row hover:border-primary/40 transition-all">
             <div className="flex-1 p-8 space-y-6">
                <div className="space-y-2">
                   <h3 className="text-3xl font-headline font-bold">Savory Shawarma</h3>
                   <div className="flex gap-2">
                      <Badge className="bg-primary/10 text-primary border-none px-4 py-1 text-[10px] font-bold">Fast Food</Badge>
                      <Badge className="bg-primary/10 text-primary border-none px-4 py-1 text-[10px] font-bold">Shawarma</Badge>
                   </div>
                </div>
                <div className="space-y-2">
                   <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                      <MapPin className="w-3 h-3 text-primary" /> 450 m • Open Until 1:00 PM
                   </div>
                   <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-primary text-primary" />)}
                      <span className="text-[10px] font-bold text-muted-foreground ml-2">110+</span>
                   </div>
                </div>
                <Link href="/vendors/shawarma" className="block w-full">
                  <Button className="w-full max-w-[240px] h-12 rounded-2xl bg-gradient-to-r from-primary to-secondary text-sm font-bold shadow-[0_0_25px_rgba(239,26,184,0.4)]">
                    Browse Items
                  </Button>
                </Link>
             </div>
             <div className="relative w-full md:w-1/2 aspect-video md:aspect-auto">
                <Image src="https://picsum.photos/seed/shawarma-wide/600/400" alt="Shawarma" fill className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent hidden md:block" />
             </div>
          </GlassCard>
        </div>

        {/* Pagination Footer */}
        <div className="flex justify-between items-center pt-8 pb-12">
           <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Showing 1 - 8 of 48 Vendors</p>
           <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <Button key={i} variant="outline" size="sm" className={cn(
                  "h-8 w-8 rounded-lg border-white/10 text-xs font-bold",
                  i === 1 ? "bg-primary text-white border-primary" : "bg-white/5 hover:bg-white/10"
                )}>{i}</Button>
              ))}
              <Button variant="outline" size="sm" className="h-8 w-8 rounded-lg border-white/10 bg-white/5"><ChevronDown className="w-3 h-3 -rotate-90" /></Button>
           </div>
        </div>
      </div>
    </DashboardShell>
  )
}

function MoreVerticalIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1" />
      <circle cx="12" cy="5" r="1" />
      <circle cx="12" cy="19" r="1" />
    </svg>
  )
}
