
"use client"

import * as React from "react"
import { useState } from 'react'
import { DashboardShell } from "@/components/layout/Shell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ChevronRight, 
  Star, 
  Clock, 
  MapPin, 
  Heart, 
  Plus, 
  Minus, 
  MoreVertical,
  Zap,
  BrainCircuit,
  MessageSquare,
  ShoppingBag,
  CreditCard,
  ChefHat
} from "lucide-react"
import Image from 'next/image'
import Link from 'next/link'
import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const popularItems = [
  { name: "Pepperoni Pizza", price: 250.00, rating: 5.4, image: "https://picsum.photos/seed/pizza-side/100/100" },
  { name: "Shawarma", price: 250.00, rating: 5.1, image: "https://picsum.photos/seed/shawarma-side/100/100" },
  { name: "Coke & Fries", price: 100.00, rating: 5.1, image: "https://picsum.photos/seed/coke-side/100/100" },
  { name: "Veggie Burger", price: 250.00, rating: 5.4, image: "https://picsum.photos/seed/veggie-side/100/100" },
]

const categories = [
  { id: 'burger', name: 'Burger', icon: ChefHat },
  { id: 'pizza', name: 'Pizza', icon: Zap },
  { id: 'books', name: 'Books', icon: BrainCircuit },
  { id: 'stationery', name: 'Stationery', icon: ShoppingBag },
]

export default function ProductDetailPage() {
  const [quantity, setQuantity] = useState(1)
  const basePrice = 250.00
  const discount = 25.00
  const totalPrice = (basePrice - discount) * quantity

  return (
    <DashboardShell>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom duration-700">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          <Link href="/dashboard" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/vendors" className="hover:text-primary transition-colors">Vendors</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/vendors/foodhub-cafe" className="text-primary/70 hover:text-primary transition-colors">FoodHub Café</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-primary neon-text-glow">Cheesy Burger</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            <GlassCard className="p-10 border-white/10 relative overflow-hidden">
              <div className="absolute top-8 right-8">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/5">
                  <MoreVertical className="w-5 h-5 text-muted-foreground" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h1 className="text-4xl font-headline font-bold tracking-tight">Cheesy Burger</h1>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm font-medium">
                      FoodHub Café <Plus className="w-3 h-3 text-primary" />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-primary/20 text-primary border-none px-4 py-1 rounded-xl text-[10px] font-bold flex gap-2 items-center">
                      <Zap className="w-3 h-3" /> Fast Food
                    </Badge>
                    <Badge className="bg-white/5 text-muted-foreground border-none px-4 py-1 rounded-xl text-[10px] font-bold">
                      + 300m
                    </Badge>
                    <Badge className="bg-white/5 text-muted-foreground border-none px-4 py-1 rounded-xl text-[10px] font-bold flex gap-2 items-center">
                      <Clock className="w-3 h-3" /> 15-20 mins
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="text-3xl font-headline font-bold text-primary neon-text-glow">
                      ₦{basePrice.toFixed(2)}
                    </div>
                    <Badge className="bg-primary/10 text-primary border-primary/30 px-6 py-2 rounded-2xl text-xs font-bold border-dashed">
                      - ₦{discount.toFixed(2)} off today only!
                    </Badge>
                  </div>

                  <div className="pt-4">
                    <Tabs defaultValue="details" className="w-full">
                      <TabsList className="bg-white/5 border border-white/10 h-12 p-1 rounded-2xl">
                        <TabsTrigger value="details" className="rounded-xl px-8 data-[state=active]:bg-primary data-[state=active]:text-white">Details</TabsTrigger>
                        <TabsTrigger value="reviews" className="rounded-xl px-8">Reviews</TabsTrigger>
                      </TabsList>
                    </Tabs>
                    <div className="mt-8 space-y-4">
                      <h3 className="text-lg font-headline font-bold">Details</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        A cheesy burger is a juicy sandwich featuring a seasoned beef patty, melted cheese, fresh lettuce, tomato, and a tangy sauce, all served on a soft, toasted bun.
                      </p>
                      <p className="text-sm font-bold text-foreground/80 leading-relaxed">
                        Today Only! Enjoy a ₦25.00 off discount as part of our daily special. It's a popular fast food choice among students!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative aspect-square md:mt-10">
                  <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-30 animate-pulse"></div>
                  <Image 
                    src="https://picsum.photos/seed/burger-big/600/600" 
                    alt="Cheesy Burger" 
                    width={600} 
                    height={600} 
                    className="relative z-10 drop-shadow-[0_20px_50px_rgba(239,26,184,0.4)] transition-transform duration-700 hover:scale-105"
                    data-ai-hint="cheese burger"
                  />
                </div>
              </div>

              {/* Interaction Row */}
              <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                   <div className="flex items-center gap-3 text-sm font-bold">
                      <CreditCard className="w-5 h-5 text-primary" /> Raintings:
                   </div>
                   <div className="space-y-1">
                      <div className="text-lg font-headline font-bold">₦{discount} off today</div>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Expense will be auto-logged</p>
                      <p className="text-xs text-muted-foreground pt-2">Wallet: ₦500.50</p>
                   </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between h-14 bg-white/5 rounded-2xl border border-white/10 p-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10 rounded-xl"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="text-xl font-bold">{quantity}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10 rounded-xl"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <Button className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-secondary text-base font-bold shadow-[0_0_30px_rgba(239,26,184,0.3)] hover:opacity-90">
                      Add to Cart - ₦{totalPrice.toFixed(2)}
                    </Button>
                    <div className="flex flex-col gap-1 items-center">
                       <div className="flex items-center gap-2 text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
                         <Star className="w-3 h-3 fill-emerald-400" /> ₦25 off today
                       </div>
                       <div className="flex items-center gap-2 text-[10px] text-primary font-bold uppercase tracking-widest">
                         <Zap className="w-3 h-3" /> Expense will be auto-logged
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Bottom Category Selector Component */}
            <div className="flex justify-center pt-8 pb-12">
               <GlassCard className="inline-flex gap-8 px-10 py-4 rounded-full border-white/5 bg-white/5 backdrop-blur-3xl">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex flex-col items-center gap-2 group cursor-pointer">
                       <div className={cn(
                         "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300",
                         cat.id === 'burger' 
                          ? "bg-primary text-white border-primary shadow-[0_0_15px_rgba(239,26,184,0.4)]" 
                          : "bg-white/5 border-white/10 text-muted-foreground group-hover:border-primary/50 group-hover:text-primary"
                       )}>
                         <cat.icon className="w-6 h-6" />
                       </div>
                       <span className={cn(
                         "text-[10px] font-bold uppercase tracking-widest",
                         cat.id === 'burger' ? "text-primary" : "text-muted-foreground"
                       )}>{cat.name}</span>
                    </div>
                  ))}
               </GlassCard>
            </div>
          </div>

          {/* Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            <GlassCard className="p-8 border-white/10">
              <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                   <h3 className="text-lg font-headline font-bold">Other Items Popular at</h3>
                   <p className="text-sm text-muted-foreground">FoodHub Café</p>
                </div>
                <MoreVertical className="w-5 h-5 text-muted-foreground cursor-pointer" />
              </div>

              <div className="space-y-6">
                {popularItems.map((item, i) => (
                  <div key={i} className="flex gap-4 group cursor-pointer">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover transition-transform group-hover:scale-110" />
                    </div>
                    <div className="flex-1 space-y-1">
                       <div className="flex justify-between items-center">
                          <p className="text-sm font-bold group-hover:text-primary transition-colors">{item.name}</p>
                          <Heart className="w-3 h-3 text-muted-foreground hover:text-rose-500 transition-colors" />
                       </div>
                       <div className="flex items-center justify-between">
                          <p className="text-xs font-bold text-primary">₦{item.price.toFixed(2)}</p>
                          <div className="flex items-center gap-1 text-[10px] text-primary/60 font-bold">
                            <Star className="w-2.5 h-2.5 fill-primary/60" /> {item.rating} <MoreVertical className="w-2.5 h-2.5" />
                          </div>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-8 border-primary/20 bg-primary/5 relative">
              <div className="absolute top-4 right-4 flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 border border-primary/40 animate-pulse-glow">
                 <Zap className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-headline font-bold mb-4">Got Feedback?</h3>
              <div className="space-y-4">
                 <p className="text-sm text-muted-foreground leading-relaxed">
                   Today's spending exceeded your daily limit. Avoid overspending by placing smaller, more budget-friendly orders tomorrow.
                 </p>
                 <div className="flex flex-col gap-3">
                   <Button className="w-full rounded-2xl h-12 bg-primary/20 hover:bg-primary/30 border border-primary/40 text-primary font-bold">
                      Thanks, got it!
                   </Button>
                   <Button variant="ghost" className="w-full rounded-2xl h-12 text-muted-foreground font-bold hover:bg-white/5">
                      Remind me later
                   </Button>
                 </div>
              </div>
            </GlassCard>
          </div>

        </div>

        {/* Footer Text */}
        <div className="text-center py-12 border-t border-white/5">
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">© 2024 CampusSpend. All rights reserved.</p>
        </div>
      </div>
    </DashboardShell>
  )
}
