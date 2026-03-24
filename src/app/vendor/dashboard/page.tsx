
"use client"

import * as React from "react"
import { VendorShell } from "@/components/layout/VendorShell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  ShoppingBag, 
  Box, 
  Plus, 
  ChevronRight, 
  MoreVertical,
  Users,
  CreditCard,
  Zap,
  ArrowUpRight,
  Package,
  Star,
  Heart,
  AlertTriangle
} from "lucide-react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell 
} from 'recharts'
import Image from "next/image"
import { cn } from "@/lib/utils"

const salesData = [
  { name: 'Mon', amount: 2000 },
  { name: 'Tue', amount: 3500 },
  { name: 'Wed', amount: 4800 },
  { name: 'Thu', amount: 5200 },
  { name: 'Fri', amount: 7500 },
  { name: 'Sat', amount: 8200 },
  { name: 'Sun', amount: 6800 },
]

const recentOrders = [
  { id: "#1015", date: "Apr 24", customer: "Alex Carter", amount: "Rs. 600", status: "New" },
  { id: "#1012", date: "Apr 24", customer: "Priya Joshi", amount: "Rs. 180", status: "Delivered" },
  { id: "#1016", date: "Apr 24", customer: "Ananya Mehta", amount: "Rs. 325", status: "Processing" },
  { id: "#1017", date: "Apr 24", customer: "Rohit Sharma", amount: "Rs. 250", status: "New" },
]

const recentCustomers = [
  { name: "Alex Carter", purchase: "Pizza & Shawarma", amount: "Rs. 600", avatar: "https://picsum.photos/seed/alex/100/100" },
  { name: "Priya Joshi", purchase: "Notebook & Pen", amount: "Rs. 180", avatar: "https://picsum.photos/seed/priya/100/100" },
  { name: "Ananya Mehta", purchase: "Burger Combo", amount: "Rs. 225", avatar: "https://picsum.photos/seed/ananya/100/100" },
]

const topProducts = [
  { name: "Pepperoni Pizza", price: "Rs. 325", stock: 180, image: "https://picsum.photos/seed/pizza-vendor/200/200", rating: 4.8 },
  { name: "Classic Burger", price: "Rs. 250", stock: 140, image: "https://picsum.photos/seed/burger-vendor/200/200", rating: 4.5 },
  { name: "Chicken Shawarma", price: "Rs. 350", stock: 120, image: "https://picsum.photos/seed/shawarma-vendor/200/200", rating: 4.2 },
]

export default function VendorDashboardPage() {
  return (
    <VendorShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-headline font-bold text-white">Welcome back, <span className="text-primary neon-text-glow">Vendor Name!</span></h1>
            <p className="text-muted-foreground text-sm">Here's your sales overview and recent activity.</p>
          </div>
          <Button className="glow-button rounded-2xl h-12 bg-primary px-8 group">
            <Plus className="mr-2 w-4 h-4" /> Add New Product
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: "Total Sales", value: "Rs. 51,200", sub: "+ 8.4% This Week", icon: TrendingUp, color: "text-primary" },
                { title: "Total Orders", value: "458", sub: "+ 32 Orders This Week", icon: ShoppingBag, color: "text-secondary" },
                { title: "Active Products", value: "32", sub: "Inventory Stable", icon: Box, color: "text-blue-400" },
              ].map((stat, i) => (
                <GlassCard key={i} className="p-6 border-white/5 hover:border-primary/20 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{stat.title}</p>
                    <div className={cn("p-2 rounded-lg bg-white/5", stat.color)}>
                      <stat.icon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
                    <p className="text-[10px] text-emerald-400 font-bold">{stat.sub}</p>
                  </div>
                </GlassCard>
              ))}
            </div>

            {/* Sales Chart & Today's Orders */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <GlassCard className="md:col-span-7 p-8 border-white/10 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-headline font-bold text-white">Sales Overview</h3>
                  <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    This Week <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex justify-between items-end">
                    <div className="space-y-1">
                       <p className="text-sm font-bold text-white">Rs. 12,550</p>
                       <p className="text-[10px] text-muted-foreground uppercase">Target</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-bold">Rs. 15,000</p>
                  </div>
                  <Progress value={84} className="h-2 bg-white/5 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-secondary" />
                </div>
                <div className="h-[200px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                      <YAxis hide />
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(239,26,184,0.3)', borderRadius: '12px' }} />
                      <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                        {salesData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 4 ? '#ef1ab8' : 'rgba(239,26,184,0.3)'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-between pt-4 border-t border-white/5">
                   <div className="text-center">
                     <p className="text-[10px] text-muted-foreground uppercase font-bold">Rs. 3,200</p>
                     <p className="text-[8px] text-muted-foreground uppercase">Today</p>
                   </div>
                   <div className="text-center">
                     <p className="text-[10px] text-white font-bold">Rs. 51,200</p>
                     <p className="text-[8px] text-muted-foreground uppercase">This Month</p>
                   </div>
                </div>
              </GlassCard>

              <GlassCard className="md:col-span-5 p-8 border-white/10 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-headline font-bold text-white">Today's Orders</h3>
                  <Button variant="link" className="text-primary text-[10px] font-bold p-0 h-auto">View All</Button>
                </div>
                <div className="space-y-6">
                  {recentCustomers.map((customer, i) => (
                    <div key={i} className="flex items-center gap-4 group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-all">
                      <Avatar className="w-10 h-10 border border-white/10">
                        <AvatarImage src={customer.avatar} />
                        <AvatarFallback>C</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{customer.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{customer.purchase}</p>
                      </div>
                      <div className="text-xs font-bold text-white">{customer.amount}</div>
                    </div>
                  ))}
                  <div className="flex items-center gap-4 group cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-all opacity-80">
                      <Avatar className="w-10 h-10 border border-white/10">
                        <AvatarImage src="https://picsum.photos/seed/rohit/100/100" />
                        <AvatarFallback>R</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">Rohit Sharma</p>
                        <p className="text-[10px] text-muted-foreground truncate">E.how Shawarma</p>
                      </div>
                      <div className="text-xs font-bold text-white">Rs. 250</div>
                    </div>
                </div>
              </GlassCard>
            </div>

            {/* Top Products & Recent Orders */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              <div className="md:col-span-7 space-y-6">
                <h3 className="text-lg font-headline font-bold text-white">Top Products</h3>
                <div className="grid grid-cols-3 gap-4">
                  {topProducts.map((product, i) => (
                    <div key={i} className="space-y-3 group cursor-pointer">
                      <div className="relative aspect-square rounded-2xl overflow-hidden border border-white/10">
                        <Image src={product.image} alt={product.name} fill className="object-cover transition-transform group-hover:scale-110" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-bold text-white truncate">{product.name}</p>
                        <p className="text-[8px] text-muted-foreground">Stu lo {460}</p>
                        <div className="flex justify-between items-center text-[10px] font-bold">
                           <span className="text-white">{product.price}</span>
                           <span className="text-amber-400 flex items-center gap-1"><Star className="w-2.5 h-2.5 fill-amber-400" /> {product.stock}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="md:col-span-5 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-headline font-bold text-white">Recent Orders</h3>
                  <MoreVertical className="w-4 h-4 text-muted-foreground cursor-pointer" />
                </div>
                <div className="space-y-4">
                   <div className="grid grid-cols-4 text-[8px] font-bold uppercase tracking-widest text-muted-foreground border-b border-white/5 pb-2">
                     <span>#ID</span>
                     <span>Date:</span>
                     <span>Customer</span>
                     <span className="text-right">Amount</span>
                   </div>
                   {recentOrders.map((order, i) => (
                     <div key={i} className="grid grid-cols-4 items-center py-2 text-[10px] text-muted-foreground hover:bg-white/5 rounded-lg px-1 transition-all">
                       <span className="font-bold text-white">{order.id}</span>
                       <span>{order.date}</span>
                       <span className="truncate">{order.customer}</span>
                       <span className="text-right font-bold text-white">{order.amount}</span>
                     </div>
                   ))}
                   <div className="flex justify-center gap-2 pt-2">
                      <div className="w-4 h-4 rounded bg-primary text-[8px] flex items-center justify-center text-white">1</div>
                      <div className="w-4 h-4 rounded bg-white/5 text-[8px] flex items-center justify-center text-muted-foreground">2</div>
                      <div className="w-4 h-4 rounded bg-white/5 text-[8px] flex items-center justify-center text-muted-foreground">3</div>
                      <div className="w-4 h-4 rounded bg-white/5 text-[8px] flex items-center justify-center text-muted-foreground text-center flex items-center justify-center">&gt;</div>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            <GlassCard className="p-8 border-white/10 space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-headline font-bold text-white">Recent Customers</h3>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="space-y-6">
                {recentCustomers.map((cust, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <Avatar className="w-10 h-10 border-2 border-primary/20">
                      <AvatarImage src={cust.avatar} />
                      <AvatarFallback>C</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-white truncate">{cust.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{cust.purchase}</p>
                    </div>
                    <div className="text-xs font-bold text-white">{cust.amount}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-8 border-t border-white/5">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="h-16 rounded-2xl bg-primary/10 border-primary/20 flex flex-col items-center justify-center gap-1 hover:bg-primary/20">
                     <Package className="w-5 h-5 text-primary" />
                     <span className="text-[8px] font-bold uppercase">Manage Products</span>
                  </Button>
                  <Button variant="outline" className="h-16 rounded-2xl bg-white/5 border-white/10 flex flex-col items-center justify-center gap-1 hover:bg-white/10">
                     <History className="w-5 h-5 text-muted-foreground" />
                     <span className="text-[8px] font-bold uppercase">View Orders</span>
                  </Button>
                </div>
              </div>

              <div className="space-y-6 pt-8 border-t border-white/5">
                <div className="flex justify-between items-center">
                   <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">This Month's Target</h4>
                   <div className="flex gap-1">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <Heart className="w-3 h-3 text-primary fill-primary" />
                   </div>
                </div>
                <div className="space-y-4">
                   <Progress value={45} className="h-2 bg-white/5 [&>div]:bg-primary shadow-[0_0_10px_rgba(239,26,184,0.3)]" />
                   <div className="flex justify-between items-center">
                      <div className="text-[10px] font-bold text-white">Rs. 51,200 / Rs. 5,000</div>
                      <div className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[8px] font-bold border border-emerald-500/20">45%</div>
                   </div>
                   <p className="text-[8px] text-muted-foreground">R110/5 This Week</p>
                </div>
              </div>

              <div className="space-y-6 pt-8 border-t border-white/5">
                <div className="flex items-center gap-2 text-rose-500">
                  <AlertTriangle className="w-4 h-4" />
                  <h4 className="text-[10px] font-bold uppercase tracking-widest">Low Stock Alert</h4>
                </div>
                <div className="space-y-4">
                  {[
                    { name: "Pen", left: "5 left", icon: Zap },
                    { name: "Spical Notebook", left: "3 left", icon: Package },
                    { name: "Cheese Burger", left: "10 left", icon: ShoppingBag },
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-[10px]">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <item.icon className="w-3 h-3" />
                        <span>{item.name}</span>
                      </div>
                      <span className="text-rose-400 font-bold">{item.left}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full h-12 rounded-2xl bg-gradient-to-r from-primary to-secondary text-xs font-bold text-white shadow-[0_0_20px_rgba(239,26,184,0.3)]">
                  Manage Stock
                </Button>
              </div>
            </GlassCard>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-white/5">
           <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em] mb-4">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Secure Payments • Student Verified • Campus Exclusive
           </div>
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">© 2024 CampusSpend. All rights reserved.</p>
        </div>

      </div>
    </VendorShell>
  )
}
