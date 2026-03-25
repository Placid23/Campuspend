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
import Link from "next/link"
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
          <div className="lg:col-span-8 space-y-8 order-2 lg:order-1">
            
            {/* Header / Welcome */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-headline font-bold text-center md:text-left">
                  Welcome, <span className="text-primary neon-text-glow">Gentuu!</span>
                </h1>
                <p className="text-muted-foreground text-sm text-center md:text-left max-w-lg mx-auto md:mx-0">
                  Here's your spending overview for April. Keep tracking and stay within your budget!
                </p>
              </div>
              <Link href="/vendors" className="w-full md:w-auto">
                <Button className="glow-button rounded-2xl h-12 bg-primary px-8 group w-full">
                  Browse Vendors <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Spending Cards */}
            <div className="space-y-6">
              <GlassCard className="bg-gradient-to-r from-card/80 to-primary/5 border-primary/20 p-6 md:p-8">
                <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4 mb-6 text-center sm:text-left">
                  <div className="space-y-1">
                    <h3 className="text-lg md:text-xl font-headline font-bold">This Month's Spending</h3>
                    <p className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Budget Utilization</p>
                  </div>
                  <div className="text-center sm:text-right">
                    <span className="text-xs text-muted-foreground mr-2">Rs.</span>
                    <span className="text-3xl font-bold">8,800.00</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 w-full bg-white/5 rounded-full overflow-hidden relative">
                    <div className="h-full w-[70%] bg-gradient-to-r from-primary to-secondary absolute left-0 top-0 shadow-[0_0_20px_rgba(239,26,184,0.5)]"></div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                    <p className="text-xs text-muted-foreground">Rs. <span className="text-foreground font-bold">5,680.00</span> of Rs. 8,000 Limit</p>
                    <Badge className="bg-rose-500/20 text-rose-500 border-none px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider animate-pulse">Over Limit!</Badge>
                  </div>
                </div>
              </GlassCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="p-6 border-white/5">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-sm uppercase tracking-tight">Today's Spending</h3>
                    <div className="text-right">
                       <span className="text-xs text-muted-foreground mr-1">Rs.</span>
                       <span className="font-bold">1,250.00</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Progress value={85} className="h-2 bg-white/5 [&>div]:bg-primary" />
                    <div className="flex justify-between items-center">
                      <p className="text-[10px] text-muted-foreground">Daily Limit: Rs. 500</p>
                      <Badge className="bg-rose-500/10 text-rose-500 border-none text-[8px] font-bold uppercase tracking-widest px-2 py-0.5">Critical</Badge>
                    </div>
                  </div>
                </GlassCard>

                <GlassCard className="p-6 border-white/5 flex flex-col justify-center items-center text-center space-y-2 group hover:border-primary/30 transition-all">
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">Total Orders</p>
                  <h3 className="text-5xl font-headline font-bold text-primary group-hover:scale-110 transition-transform">21</h3>
                  <div className="flex items-center gap-1 text-[8px] text-emerald-400 font-bold uppercase">
                    <TrendingUp className="w-3 h-3" /> +12% from last week
                  </div>
                </GlassCard>
              </div>
            </div>

            {/* Spending Tracker (Calendar) */}
            <GlassCard className="p-6 md:p-8 border-white/5">
               <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                 <h3 className="text-xl font-headline font-bold">Spending Tracker</h3>
                 <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
                   <span className="text-xs font-bold uppercase tracking-widest">April 2024</span>
                   <div className="flex gap-1 border-l border-white/10 pl-4">
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-xl hover:bg-white/10 text-muted-foreground"><ChevronLeft className="w-4 h-4"/></Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-xl hover:bg-white/10 text-muted-foreground"><ChevronRight className="w-4 h-4"/></Button>
                   </div>
                 </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                 <div className="md:col-span-8">
                   <div className="grid grid-cols-7 gap-1 md:gap-2 mb-4">
                     {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                       <div key={`header-${day}`} className="text-center text-[8px] md:text-[10px] font-bold uppercase text-muted-foreground tracking-widest">{day}</div>
                     ))}
                   </div>
                   <div className="grid grid-cols-7 gap-1 md:gap-2">
                     {days.map(day => (
                       <div 
                         key={day} 
                         className={cn(
                           "aspect-square rounded-lg md:rounded-xl flex items-center justify-center text-[10px] md:text-xs font-bold border border-white/5 transition-all cursor-pointer hover:bg-white/10 relative",
                           day === 6 ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" : 
                           day === 16 ? "bg-amber-500/20 text-amber-400 border-amber-500/30" : 
                           day === 17 ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/30" :
                           day === 20 ? "bg-rose-500/20 text-rose-400 border-rose-500/30" :
                           day === 27 ? "ring-2 ring-primary bg-primary/10 shadow-[0_0_10px_rgba(239,26,184,0.3)]" : ""
                         )}
                       >
                         {day}
                         {(day === 16 || day === 17) && (
                           <div className="absolute bottom-1 w-1 h-1 rounded-full bg-current opacity-60" />
                         )}
                       </div>
                     ))}
                   </div>
                   <div className="flex flex-wrap gap-4 mt-8 justify-center md:justify-start">
                     <div className="flex items-center gap-2 text-[8px] uppercase font-bold tracking-widest text-emerald-400">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> Low
                     </div>
                     <div className="flex items-center gap-2 text-[8px] uppercase font-bold tracking-widest text-amber-400">
                       <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div> Med
                     </div>
                     <div className="flex items-center gap-2 text-[8px] uppercase font-bold tracking-widest text-rose-400">
                       <div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div> High
                     </div>
                   </div>
                 </div>

                 {/* Calendar Side Breakdown */}
                 <div className="md:col-span-4 space-y-6 bg-white/5 p-6 rounded-3xl border border-white/5">
                    <div className="space-y-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Recent Expenses</p>
                      <div className="space-y-4">
                        {[
                          { name: "Fast Food", shop: "FoodHub Cafe", price: 1000.00, time: "2:00 PM", color: "text-amber-500" },
                          { name: "Drinks", shop: "FoodHub Cafe", price: 250.00, time: "2:15 PM", color: "text-rose-500" }
                        ].map((exp, i) => (
                          <div key={i} className="flex justify-between items-center group cursor-pointer">
                            <div className="space-y-0.5">
                              <p className="text-xs font-bold group-hover:text-primary transition-colors">{exp.name}</p>
                              <p className="text-[8px] text-muted-foreground uppercase">{exp.shop}</p>
                            </div>
                            <div className={cn("text-xs font-bold", exp.color)}>Rs. {exp.price.toFixed(0)}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-6 border-t border-white/10 space-y-4">
                       <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/60">Category Split</h4>
                       <div className="space-y-3">
                         <div className="flex justify-between text-[10px]">
                           <span className="text-muted-foreground">Fast Food</span>
                           <span className="font-bold">Rs. 1000.0</span>
                         </div>
                         <div className="flex justify-between text-[10px]">
                           <span className="text-muted-foreground">Stationery</span>
                           <span className="font-bold">Rs. 250.0</span>
                         </div>
                       </div>
                    </div>
                 </div>
               </div>
            </GlassCard>

          </div>

          {/* Right Sidebar Marketplace (4 cols) */}
          <div className="lg:col-span-4 space-y-8 order-1 lg:order-2">
            <GlassCard className="p-6 border-white/5 space-y-8">
              
              {/* Order Box */}
              <div className="space-y-4">
                <h3 className="text-lg font-headline font-bold">Order from Vendors</h3>
                <div className="relative group">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary" />
                  <input className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:border-primary/50 transition-all" placeholder="Search pizza, drinks..." />
                </div>
                <Link href="/vendors/foodhub-cafe" className="block relative aspect-[16/10] rounded-2xl overflow-hidden group cursor-pointer shadow-lg border border-white/5">
                  <Image src="https://picsum.photos/seed/pizzashop/400/225" alt="Vendor" fill className="object-cover transition-transform group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-4">
                    <div className="flex justify-between items-center">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-white">FoodHub Cafe</p>
                        <p className="text-[8px] text-white/60 uppercase tracking-widest">350m • Open</p>
                      </div>
                      <Badge className="bg-primary text-[8px] h-5 font-bold">FAVORITE</Badge>
                    </div>
                  </div>
                </Link>
              </div>

              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map(cat => (
                  <Badge key={cat} className={cn("rounded-full px-4 py-1.5 text-[10px] font-bold border-none cursor-pointer shrink-0 transition-all", cat === "All" ? "bg-primary text-white" : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white")}>
                    {cat}
                  </Badge>
                ))}
              </div>

              {/* Popular Items Grid */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Popular Items</h4>
                  <Link href="/vendors">
                    <Button variant="link" className="text-[10px] text-primary h-auto p-0 font-bold uppercase tracking-widest">See All</Button>
                  </Link>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: "Pizza", img: "https://picsum.photos/seed/pizz1/100/100", price: 250 },
                    { name: "Books", img: "https://picsum.photos/seed/book1/100/100", price: 1800 },
                    { name: "Pens", img: "https://picsum.photos/seed/stat1/100/100", price: 350 },
                  ].map((item, i) => (
                    <Link key={i} href="/products/cheesy-burger" className="space-y-2 group cursor-pointer">
                       <div className="relative aspect-square rounded-xl overflow-hidden border border-white/5">
                         <Image src={item.img} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform" />
                         <button className="absolute top-1 right-1 p-1 bg-black/40 rounded-full text-white hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><Heart className="w-2.5 h-2.5" /></button>
                       </div>
                       <div className="px-1">
                         <p className="text-[8px] font-bold truncate text-white/80">{item.name}</p>
                         <p className="text-[8px] text-primary font-bold">Rs. {item.price}</p>
                       </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Suggested For You */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Smart Suggestion</h4>
                <Link href="/products/cheesy-burger" className="flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all cursor-pointer group">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10">
                    <Image src="https://picsum.photos/seed/burger1/100/100" alt="Hamburger" fill className="object-cover group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold truncate text-white">Cheesy Burger</p>
                    <p className="text-[8px] text-primary font-bold uppercase">Rs. 250.00 • 15% OFF</p>
                  </div>
                  <Button size="sm" className="h-8 rounded-xl text-[8px] px-3 bg-primary/20 text-primary border border-primary/20 hover:bg-primary hover:text-white font-bold uppercase">Add</Button>
                </Link>
              </div>

              {/* Bottom Quick Stats */}
              <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                <div className="space-y-1 group cursor-default">
                  <div className="flex items-center gap-2 text-primary group-hover:neon-text-glow transition-all">
                    <Store className="w-4 h-4" /> <span className="text-xl font-headline font-bold">50+</span>
                  </div>
                  <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest">Active Shops</p>
                </div>
                <div className="space-y-1 group cursor-default">
                  <div className="flex items-center gap-2 text-primary group-hover:neon-text-glow transition-all">
                    <Zap className="w-4 h-4" /> <span className="text-xl font-headline font-bold">100%</span>
                  </div>
                  <p className="text-[8px] text-muted-foreground uppercase font-bold tracking-widest">Auto Log</p>
                </div>
              </div>

            </GlassCard>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-12 pb-24 md:pb-8 text-center border-t border-white/5">
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.3em]">© 2024 CampusSpend • Future of Student Finance</p>
        </div>

      </div>
    </DashboardShell>
  )
}
