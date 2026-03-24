
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
  MoreVertical,
  Zap,
  ShoppingBag,
  ArrowRight
} from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import { cn } from "@/lib/utils"

const categories = ["All", "Fast Food", "Drinks"]

const products = [
  {
    id: "cheesy-burger",
    name: "Cheesy Burger",
    vendor: "FoodHub Café",
    price: 250.00,
    tags: ["Fast Food", "300m"],
    image: "https://picsum.photos/seed/burger-detail/300/300",
    promo: "Today only!",
    rating: 34
  },
  {
    id: "pepperoni-pizza",
    name: "Pepperoni Pizza",
    vendor: "FoodHub Café",
    price: 250.00,
    tags: ["Fast Food", "300m"],
    image: "https://picsum.photos/seed/pizza-detail/300/300",
    promo: "Today only!",
    rating: 34
  },
  {
    id: "shawarma",
    name: "Shawarma",
    vendor: "FoodHub Café",
    price: 250.00,
    tags: ["Fast Food", "300m"],
    image: "https://picsum.photos/seed/shawarma-detail/300/300",
    promo: "",
    rating: 34
  },
  {
    id: "veggie-burger",
    name: "Veggie Burger",
    vendor: "FoodHub Café",
    price: 250.00,
    tags: ["Fast Food", "300m"],
    image: "https://picsum.photos/seed/v-burger/300/300",
    promo: "",
    rating: 34
  }
]

const drinks = [
  { name: "Coke & Fries", price: 100.00, image: "https://picsum.photos/seed/coke/100/100" },
  { name: "Mojito", price: 150.00, image: "https://picsum.photos/seed/mojito/100/100" }
]

export default function ProductListingPage() {
  const [activeCategory, setActiveCategory] = useState("All")

  return (
    <DashboardShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-headline font-bold">FoodHub Café</h1>
            <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <span className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-primary" /> 300m from Main Campus</span>
              <span className="text-primary">+</span>
              <span className="flex items-center gap-1.5"><Clock className="w-3 h-3 text-primary" /> Open Until 10:30 PM</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-2">
                <span className="text-[10px] font-bold text-muted-foreground uppercase">Sort By:</span>
                <span className="text-sm font-bold">Recommended</span>
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
             </div>
          </div>
        </div>

        {/* Search & Category Tabs */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-2xl h-12 pl-14 pr-6 text-sm focus:outline-none focus:border-primary/50 transition-all" 
              placeholder="Search for items..." 
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "rounded-xl px-6 py-2 text-xs font-bold transition-all border",
                  activeCategory === cat 
                    ? "bg-primary/20 border-primary text-white shadow-[0_0_15px_rgba(239,26,184,0.3)]" 
                    : "bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10"
                )}
              >
                {cat} {cat === "All" && <ChevronDown className="inline ml-1 w-3 h-3" />}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {products.map((product) => (
            <GlassCard key={product.id} className="p-0 border-white/10 group overflow-hidden flex flex-col md:flex-row hover:border-primary/40 transition-all">
              <div className="flex-1 p-8 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-headline font-bold">{product.name}</h3>
                    <p className="text-xs text-muted-foreground">{product.vendor}</p>
                  </div>
                  <button className="text-muted-foreground hover:text-rose-500 transition-colors">
                    <Heart className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag, i) => (
                    <Badge key={i} className="bg-primary/10 text-primary border-none px-3 py-0.5 text-[8px] font-bold flex gap-1 items-center rounded-lg">
                      {tag === "Fast Food" ? <Zap className="w-2 h-2" /> : <MapPin className="w-2 h-2" />} {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-end gap-2">
                   <div className="text-lg font-headline font-bold">Rs. {product.price.toFixed(2)}</div>
                   {product.promo && <span className="text-[10px] text-primary font-bold mb-1">{product.promo}</span>}
                </div>

                <div className="flex gap-4 items-center">
                  <Link href={`/products/${product.id}`} className="flex-1">
                    <Button className="w-full h-11 rounded-2xl bg-primary/20 hover:bg-primary/30 border border-primary/40 text-xs font-bold text-white transition-all shadow-[0_0_15px_rgba(239,26,184,0.2)]">
                      View Details
                    </Button>
                  </Link>
                  <Button variant="outline" className="h-11 rounded-2xl bg-white/5 border-white/10 text-[10px] font-bold px-4 flex gap-2">
                    Show to atis <ChevronDown className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <div className="relative w-full md:w-[45%] aspect-square md:aspect-auto">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill 
                  className="object-cover transition-transform duration-700 group-hover:scale-105" 
                  data-ai-hint="food item"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background via-transparent to-transparent hidden md:block" />
                <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-rose-400">
                   <Heart className="w-3 h-3 fill-rose-400" />
                   <span className="text-[10px] font-bold">{product.rating}</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Drinks Section */}
        <div className="space-y-6 pt-8">
          <div className="flex justify-between items-center">
             <h2 className="text-2xl font-headline font-bold">Drinks</h2>
             <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Showing 1 to 4 of 6 items <span className="text-primary">+</span></p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
             {drinks.map((drink, i) => (
               <GlassCard key={i} className="p-0 border-white/10 group overflow-hidden flex flex-col hover:border-primary/30">
                  <div className="p-6 flex items-center justify-between">
                     <div className="space-y-1">
                        <h4 className="text-sm font-bold group-hover:text-primary transition-colors">{drink.name}</h4>
                        <p className="text-xs text-primary font-bold">Rs. {drink.price.toFixed(2)}</p>
                     </div>
                     <button className="text-muted-foreground hover:text-rose-500">
                        <Heart className="w-4 h-4" />
                     </button>
                  </div>
                  <div className="relative aspect-video overflow-hidden">
                     <Image 
                      src={drink.image} 
                      alt={drink.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      data-ai-hint="drink"
                     />
                  </div>
               </GlassCard>
             ))}
          </div>
        </div>

        {/* Bottom Navigation Component Placeholder */}
        <div className="flex justify-center pt-12 pb-8">
           <GlassCard className="inline-flex gap-8 px-10 py-3 rounded-full border-white/5 bg-white/5 backdrop-blur-3xl">
              {[
                { label: "Burger", id: "burger", icon: ShoppingBag },
                { label: "Pizza", id: "praza", icon: Zap },
                { label: "Books", id: "books", icon: Clock },
                { label: "Stationery", id: "satlons", icon: MapPin },
                { label: "Stainery", id: "stainery", icon: Star }
              ].map((nav, i) => (
                <div key={i} className="flex flex-col items-center gap-1 group cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
                   <div className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10">
                      <nav.icon className="w-4 h-4" />
                   </div>
                   <span className="text-[8px] font-bold uppercase tracking-widest">{nav.label}</span>
                </div>
              ))}
           </GlassCard>
        </div>

      </div>
    </DashboardShell>
  )
}
