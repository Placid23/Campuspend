"use client"

import { DashboardShell } from "@/components/layout/Shell"
import { GlassCard } from "@/components/ui/glass-card"
import { 
  ArrowRight, 
  ShoppingBag, 
  Zap, 
  Search,
  ChevronRight,
  ChevronLeft,
  Star,
  Heart,
  TrendingUp,
  CreditCard,
  Users,
  BrainCircuit,
  LayoutDashboard,
  Store,
  ClipboardList
} from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { cn } from "@/lib/utils"

export default function DashboardPage() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);
  const categories = ["All", "Food", "Books", "Stationery"];

  return (
    <DashboardShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left/Center Content (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Header / Welcome */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-headline font-bold">Welcome, <span className="text-primary neon-text-glow">Gentuu!</span></h1>
                <p className="text-muted-foreground text-sm">Here's your spending overview for April. Keep tracking and stay within your budget!</p>
              </div>
              <Button className="glow-button rounded-2xl h-12 bg-primary px-8 group">
                Browse Vendors <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            {/* Spending Cards */}
            <div className="space-y-6">
              <GlassCard className="bg-gradient-to-r from-card/80 to-primary/5 border-primary/20 p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-headline font-bold">This Month's Spending</h3>
                  <div className="text-right">
                    <span className="text-sm text-muted-foreground mr-2">Rs.</span>
                    <span className="text-2xl font-bold">8,800.00</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden relative">
                    <div className="h-full w-[70%] bg-gradient-to-r from-primary to-secondary absolute left-0 top-0 shadow-[0_0_20px_rgba(239,26,184,0.5)]"></div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-muted-foreground">Rs. <span className="text-foreground font-bold">5,680.00</span> of Rs. 8,000 Limit</p>
                    <Badge className="bg-rose-500/20 text-rose-500 border-none px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Over Limit!</Badge>
                  </div>
                </div>
              </GlassCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="p-6 border-white/5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold">Today's Spending</h3>
                    <div className="text-right">
                       <span className="text-xs text-muted-foreground mr-1">Rs.</span>
                       <span className="font-bold">1,250.00</span>
                       <span className="text-muted-foreground text-[10px]"> / 500</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Progress value={85} className="h-2 bg-white/5 [&>div]:bg-primary" />
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] text-muted-foreground">Rs. <span className="text-foreground font-bold">1,250.0</span> of Rs. 500 Limit</p>
                      <Badge className="bg-rose-500/10 text-rose-500 border-none text-[8px] font-bold uppercase tracking-widest px-2 py-0.5">Over Limit!</Badge>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-6 border-white/5 flex flex-col justify-center items-center text-center space-y-2">
                  <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Number of Orders</p>
                  <h3 className="text-4xl font-headline font-bold text-primary">21</h3>
                </GlassCard>
              </div>
            </div>

            {/* Spending Tracker (Calendar) */}
            <GlassCard className="p-8 border-white/5">
               <div className="flex items-center justify-between mb-8">
                 <h3 className="text-xl font-headline font-bold">Spending Tracker</h3>
                 <div className="flex items-center gap-4">
                   <div className="flex items-center gap-2">
                     <span className="text-xs font-medium">April 2024</span>
                     <div className="flex gap-1">
                        <Button size="icon" variant="ghost" className="h-6 w-6 rounded-lg bg-white/5"><ChevronLeft className="w-3 h-3"/></Button>
                        <Button size="icon" variant="ghost" className="h-6 w-6 rounded-lg bg-white/5"><ChevronRight className="w-3 h-3"/></Button>
                     </div>
                   </div>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                 <div className="md:col-span-8">
                   <div className="grid grid-cols-7 gap-2 mb-4">
                     {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                       <div key={`header-${day}`} className="text-center text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{day}</div>
                     ))}
                   </div>
                   <div className="grid grid-cols-7 gap-2">
                     {days.map(day => (
                       <div 
                         key={day} 
                         className={cn(
                           "aspect-square rounded-xl flex items-center justify-center text-xs font-bold border border-white/5 transition-all cursor-pointer hover:bg-white/10 relative",
                           day === 6 ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : 
                           day === 16 ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : 
                           day === 17 ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                           day === 20 ? "bg-rose-500/20 text-rose-400 border-rose-500/30" :
                           day === 27 ? "ring-2 ring-primary bg-primary/10" : ""
                         )}
                       >
                         {day}
                         {day === 16 && <span className="absolute mt-8 text-[8px] bg-amber-500/80 text-black px-1 rounded-sm">Rs. 350</span>}
                         {day === 17 && <span className="absolute mt-8 text-[8px] bg-emerald-500/80 text-black px-1 rounded-sm">Rs. 1,600</span>}
                       </div>
                     ))}
                   </div>
                   <div className="flex flex-wrap gap-4 mt-8">
                     <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-emerald-400">
                       <div className="w-2 h-2 rounded-full bg-emerald-400"></div> Spending Record
                     </div>
                     <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-amber-400">
                       <div className="w-2 h-2 rounded-full bg-amber-400"></div> Medium Spending
                     </div>
                     <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-rose-400">
                       <div className="w-2 h-2 rounded-full bg-rose-400"></div> High Spending
                     </div>
                   </div>
                 </div>

                 {/* Calendar Side Breakdown */}
                 <div className="md:col-span-4 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                         <p className="text-xs text-muted-foreground">Recent Expenses</p>
                      </div>
                      {[
                        { name: "Fast Food", shop: "FoodHub Cafe", price: 1000.00, time: "2:00 PM", color: "text-amber-500" },
                        { name: "Drinks", shop: "FoodHub Cafe", price: 250.00, time: "2:15 PM", color: "text-rose-500" }
                      ].map((exp, i) => (
                        <div key={i} className="flex justify-between items-center group cursor-pointer">
                          <div className="space-y-1">
                            <p className="text-sm font-bold group-hover:text-primary transition-colors">{exp.name}</p>
                            <p className="text-[10px] text-muted-foreground">{exp.shop} • {exp.time}</p>
                          </div>
                          <div className={cn("text-sm font-bold", exp.color)}>Rs. {exp.price.toFixed(2)}</div>
                        </div>
                      ))}
                    </div>

                    <div className="pt-6 border-t border-white/5 space-y-4">
                       <h4 className="text-xs font-bold uppercase tracking-widest">Expense Breakdown</h4>
                       <div className="space-y-4">
                         <div className="flex justify-between text-xs">
                           <span className="text-muted-foreground">Fast Food</span>
                           <span className="font-bold">Rs. 1000.00</span>
                         </div>
                         <div className="flex justify-between text-xs">
                           <span className="text-muted-foreground">Drinks</span>
                           <span className="font-bold">Rs. 250.00</span>
                         </div>
                       </div>
                    </div>
                 </div>
               </div>
            </GlassCard>

          </div>

          {/* Right Sidebar Marketplace (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            <GlassCard className="p-6 border-white/5 space-y-8">
              
              {/* Order Box */}
              <div className="space-y-4">
                <h3 className="text-lg font-headline font-bold">Order from Vendors</h3>
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary" />
                  <input className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary/50" placeholder="Search pizza, drinks..." />
                </div>
                <div className="relative aspect-video rounded-2xl overflow-hidden group cursor-pointer">
                  <Image src="https://picsum.photos/seed/pizzashop/400/225" alt="Vendor" fill className="object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-xs font-bold">Pizza & More</p>
                        <p className="text-[8px] text-white/60">Nearest Vendor</p>
                      </div>
                      <Badge className="bg-primary text-[8px] h-4">OPEN</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map(cat => (
                  <Badge key={cat} className={cn("rounded-full px-4 py-1.5 text-[10px] font-bold border-none cursor-pointer", cat === "All" ? "bg-primary text-white" : "bg-white/5 text-muted-foreground hover:bg-white/10")}>
                    {cat}
                  </Badge>
                ))}
              </div>

              {/* Popular Items Grid */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold uppercase tracking-widest">Popular Items</h4>
                  <Button variant="link" className="text-[10px] text-primary h-auto p-0">See All</Button>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { name: "Pepperoni Pizza", img: "https://picsum.photos/seed/pizz1/100/100", price: 250, rating: 4.8 },
                    { name: "Calculus", img: "https://picsum.photos/seed/book1/100/100", price: 1800, rating: 4.5 },
                    { name: "Stationery", img: "https://picsum.photos/seed/stat1/100/100", price: 350, rating: 4.2 },
                  ].map((item, i) => (
                    <div key={i} className="space-y-2 group cursor-pointer">
                       <div className="relative aspect-square rounded-xl overflow-hidden">
                         <Image src={item.img} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform" />
                         <button className="absolute top-1 right-1 p-1 bg-black/40 rounded-full text-white hover:text-rose-500"><Heart className="w-3 h-3" /></button>
                       </div>
                       <p className="text-[8px] font-bold truncate">{item.name}</p>
                       <div className="flex justify-between items-center">
                         <p className="text-[8px] text-primary font-bold">Rs. {item.price}</p>
                         <div className="flex items-center gap-0.5 text-[6px] text-amber-500">
                           <Star className="w-2 h-2 fill-amber-500" /> {item.rating}
                         </div>
                       </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested For You */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-widest">Suggested for You</h4>
                <div className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all cursor-pointer">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0">
                    <Image src="https://picsum.photos/seed/burger1/100/100" alt="Hamburger" fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">Hamburger</p>
                    <p className="text-[10px] text-primary font-bold">Rs. 250.00</p>
                  </div>
                  <Button size="sm" className="h-7 rounded-lg text-[10px] px-3 bg-primary">Order Now</Button>
                </div>
              </div>

              {/* Bottom Quick Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-primary">
                    <Store className="w-4 h-4" /> <span className="text-lg font-headline font-bold">50+</span>
                  </div>
                  <p className="text-[8px] text-muted-foreground uppercase font-bold">Active Vendors</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-primary">
                    <ShoppingBag className="w-4 h-4" /> <span className="text-lg font-headline font-bold">250+</span>
                  </div>
                  <p className="text-[8px] text-muted-foreground uppercase font-bold">Orders Delivered</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-primary">
                    <Zap className="w-4 h-4" /> <span className="text-lg font-headline font-bold">100%</span>
                  </div>
                  <p className="text-[8px] text-muted-foreground uppercase font-bold">Auto Tracking</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-primary">
                    <BrainCircuit className="w-4 h-4" /> <span className="text-lg font-headline font-bold">AI</span>
                  </div>
                  <p className="text-[8px] text-muted-foreground uppercase font-bold">Insights</p>
                </div>
              </div>

            </GlassCard>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-12 pb-8 text-center border-t border-white/5">
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">© 2024 CampusSpend. All rights reserved.</p>
        </div>

      </div>
    </DashboardShell>
  )
}
