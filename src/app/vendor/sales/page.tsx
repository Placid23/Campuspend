
"use client"

import * as React from "react"
import { VendorShell } from "@/components/layout/VendorShell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { 
  TrendingUp, 
  Calendar as CalendarIcon, 
  FileUp, 
  ChevronRight, 
  Zap,
  MoreVertical,
  ArrowUpRight,
  Package,
  Clock,
  ChefHat,
  Pizza,
  BookOpen,
  PenTool
} from "lucide-react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart,
  Cell
} from 'recharts'
import Image from "next/image"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const chartData = [
  { name: 'Apr 1', sales: 3000, orders: 35 },
  { name: '3', sales: 2500, orders: 28 },
  { name: '4', sales: 3200, orders: 42 },
  { name: '5', sales: 3800, orders: 45 },
  { name: '7', sales: 3100, orders: 32 },
  { name: '8', sales: 3400, orders: 38 },
  { name: '9', sales: 4200, orders: 48 },
  { name: '10', sales: 3900, orders: 44 },
  { name: '11', sales: 3500, orders: 40 },
  { name: '12', sales: 4800, orders: 55 },
  { name: '13', sales: 5200, orders: 60 },
  { name: '14', sales: 4500, orders: 50 },
  { name: '15', sales: 4300, orders: 48 },
  { name: '16', sales: 4900, orders: 52 },
  { name: '17', sales: 5100, orders: 58 },
  { name: '18', sales: 4400, orders: 46 },
  { name: '19', sales: 4200, orders: 45 },
  { name: '20', sales: 4700, orders: 53 },
  { name: '21', sales: 4900, orders: 55 },
  { name: '22', sales: 4100, orders: 45 },
  { name: '23', sales: 5400, orders: 62 },
  { name: '24', sales: 5900, orders: 68 },
  { name: '25', sales: 5500, orders: 60 },
  { name: '26', sales: 6200, orders: 70 },
  { name: '27', sales: 6800, orders: 75 },
  { name: '28', sales: 7200, orders: 80 },
  { name: '29', sales: 6500, orders: 72 },
  { name: '30', sales: 6100, orders: 68 },
]

const topSellingProducts = [
  { name: "Pepperoni Pizza", percentage: "35.8%", image: "https://picsum.photos/seed/piz-sale/100/100" },
  { name: "Classic Burger", percentage: "21.4%", image: "https://picsum.photos/seed/burg-sale/100/100" },
  { name: "Chicken Shawarma", percentage: "18.6%", image: "https://picsum.photos/seed/shaw-sale/100/100" },
  { name: "Veg Club Sandwich", percentage: "12.1%", image: "https://picsum.photos/seed/sand-sale/100/100" },
  { name: "Cheese Burger", percentage: "12.1%", image: "https://picsum.photos/seed/cheese-sale/100/100" },
]

const recentActivity = [
  { id: 1, name: "QDBurger Bundle", desc: "₦300 • 2ipie Corps", time: "15 mins ago", price: "₦4,950", image: "https://picsum.photos/seed/act1/100/100" },
  { id: 2, name: "Pepperoni Pizza", desc: "₦4428 • Prape sten", time: "40 mins ago", price: "₦325", image: "https://picsum.photos/seed/act2/100/100" },
  { id: 3, name: "Classic Burger", desc: "₦300 - 9 uinnay Mertia", time: "1 hour ago", price: "₦500", image: "https://picsum.photos/seed/act3/100/100", isUser: true, userAvatar: "https://picsum.photos/seed/user-act/100/100" },
]

export default function SalesSummaryPage() {
  return (
    <VendorShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Sales Summary</h1>
          <div className="flex items-center gap-4">
            <div className="h-12 px-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 shadow-inner group cursor-pointer hover:border-primary/50 transition-all">
              <CalendarIcon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-sm font-bold text-white/80">Apr 1, 2024 - Apr 24, 2024</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground rotate-90" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Stats Overview Row */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <GlassCard className="p-6 border-white/10 bg-gradient-to-br from-primary/20 to-secondary/10 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/40 transition-all"></div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-4 flex items-center gap-2">
                   <TrendingUp className="w-3 h-3" /> Total Sales
                </p>
                <div className="space-y-1">
                   <h3 className="text-2xl font-bold text-white">₦78,950</h3>
                   <div className="flex items-center gap-2 text-emerald-400 text-[10px] font-bold">
                      <ArrowUpRight className="w-3 h-3" /> + 8.2%
                   </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6 border-white/10 hover:border-primary/20 transition-all">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">#58 Orders</p>
                <div className="flex items-center justify-between">
                   <h3 className="text-2xl font-bold text-white">#58</h3>
                   <span className="text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3" /> + 7.6%
                   </span>
                </div>
                <p className="text-[8px] text-muted-foreground uppercase mt-1 font-bold">Orders</p>
              </GlassCard>

              <GlassCard className="p-6 border-white/10 hover:border-primary/20 transition-all">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">+172 Avg. Order</p>
                <div className="flex items-center justify-between">
                   <h3 className="text-2xl font-bold text-white">+172</h3>
                   <span className="text-rose-400 text-[10px] font-bold flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3 rotate-90" /> - 0.3%
                   </span>
                </div>
                <p className="text-[8px] text-muted-foreground uppercase mt-1 font-bold">Avg. Order</p>
              </GlassCard>

              <div className="space-y-4">
                <GlassCard className="p-6 border-white/10 hover:border-primary/20 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">820 Sold</p>
                      <h3 className="text-2xl font-bold text-white">820</h3>
                    </div>
                    <div className="text-emerald-400 text-[10px] font-bold">+ 3.0%</div>
                  </div>
                </GlassCard>
                <Button className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-[10px] font-bold uppercase tracking-widest flex gap-2">
                   <FileUp className="w-4 h-4" /> Export Report
                </Button>
              </div>
            </div>

            {/* Sales Analytics Chart Card */}
            <GlassCard className="p-8 border-white/10 space-y-8 bg-white/5 backdrop-blur-3xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-headline font-bold text-white">Sales Analytics</h3>
                <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/5">
                   <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] font-bold uppercase bg-white/5">By Day</Button>
                   <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] font-bold uppercase text-muted-foreground hover:bg-white/5">By Week</Button>
                   <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] font-bold uppercase text-muted-foreground hover:bg-white/5">By Month</Button>
                </div>
              </div>

              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef1ab8" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#ef1ab8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }}
                      interval={2}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }}
                      domain={[0, 6000]}
                      ticks={[0, 3000, 4000, 5000, 6000]}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(239,26,184,0.3)', borderRadius: '16px' }}
                      itemStyle={{ color: '#ef1ab8', fontSize: '12px' }}
                      labelStyle={{ color: '#fff', marginBottom: '8px', fontWeight: 'bold' }}
                      cursor={{ stroke: 'rgba(239,26,184,0.2)', strokeWidth: 2 }}
                    />
                    <Bar dataKey="sales" barSize={12} radius={[4, 4, 0, 0]}>
                       {chartData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "rgba(188, 102, 235, 0.4)" : "rgba(239, 26, 184, 0.4)"} />
                       ))}
                    </Bar>
                    <Line 
                      type="monotone" 
                      dataKey="sales" 
                      stroke="#ef1ab8" 
                      strokeWidth={3} 
                      dot={{ fill: '#ef1ab8', stroke: '#000', strokeWidth: 2, r: 4 }} 
                      activeDot={{ r: 6, fill: '#ef1ab8', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="flex items-center gap-8 justify-center pt-4">
                 <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white">
                    <div className="w-2 h-2 rounded-full bg-primary" /> Total Sales
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-secondary/50" /> Orders
                 </div>
              </div>
            </GlassCard>

            {/* Main Recent Activity List */}
            <div className="space-y-6">
               <h3 className="text-xl font-headline font-bold text-white">Recent Activity</h3>
               <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <GlassCard key={activity.id} className="p-4 border-white/5 hover:border-primary/20 transition-all flex items-center gap-6 group">
                       <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                          {activity.isUser ? (
                            <Image src={activity.userAvatar!} alt="User" fill className="object-cover" />
                          ) : (
                            <Image src={activity.image} alt={activity.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                          )}
                       </div>
                       <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3">
                             <h4 className="text-base font-bold text-white">{activity.name}</h4>
                             <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{activity.time}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{activity.desc}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-lg font-bold text-primary neon-text-glow">{activity.price}</p>
                       </div>
                    </GlassCard>
                  ))}
               </div>
            </div>

          </div>

          {/* Right Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            <GlassCard className="p-8 border-white/10 space-y-8 bg-white/5 backdrop-blur-3xl">
              <h3 className="text-xl font-headline font-bold text-white">Sales Analytics</h3>
              
              <div className="space-y-6">
                {[
                  { label: "Total Sales", value: "458", color: "text-white" },
                  { label: "Delivered Orders", value: "432", color: "text-white" },
                  { label: "Products Sold", value: "820", color: "text-amber-500" },
                  { label: "Total, lost soon ₦", value: "-6,300", color: "text-muted-foreground" },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center group">
                    <div className="flex items-center gap-3">
                       <div className={cn("w-1.5 h-1.5 rounded-full", i === 2 ? "bg-amber-500" : "bg-primary")}></div>
                       <span className="text-sm font-bold text-muted-foreground group-hover:text-white transition-colors">{item.label}</span>
                    </div>
                    <span className={cn("text-lg font-bold", item.color)}>{item.value}</span>
                  </div>
                ))}
              </div>

              <div className="h-px bg-white/5 w-full"></div>

              {/* Top Selling Products List */}
              <div className="space-y-6">
                <h3 className="text-lg font-headline font-bold text-white">Top Selling Products</h3>
                <div className="space-y-6">
                  {topSellingProducts.map((product, i) => (
                    <div key={i} className="flex items-center gap-4 group cursor-pointer">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10">
                         <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform" />
                      </div>
                      <div className="flex-1 min-w-0">
                         <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{product.name}</p>
                      </div>
                      <div className="text-sm font-bold text-white">{product.percentage}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-white/5 w-full"></div>

              {/* Sidebar Recent Activity */}
              <div className="space-y-6">
                <h3 className="text-lg font-headline font-bold text-white">Recent Activity</h3>
                <div className="space-y-6">
                  {[
                    { name: "QDBurger Bundle", time: "15 mins ago", price: "₦770", image: "https://picsum.photos/seed/sact1/100/100" },
                    { name: "Pepperoni Pizza", time: "40 mins ago", price: "₦428", image: "https://picsum.photos/seed/sact2/100/100" },
                    { name: "Classic Burger", time: "1 hour ago", price: "₦300", image: "https://picsum.photos/seed/sact3/100/100", isUser: true, userAvatar: "https://picsum.photos/seed/uact1/100/100" },
                  ].map((act, i) => (
                    <div key={i} className="flex items-center gap-4 group cursor-pointer">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-white/10">
                        {act.isUser ? (
                           <Image src={act.userAvatar!} alt="User" fill className="object-cover" />
                        ) : (
                           <Image src={act.image} alt={act.name} fill className="object-cover group-hover:scale-110 transition-transform" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-bold text-white truncate group-hover:text-primary transition-colors">{act.name}</p>
                        <p className="text-[10px] text-muted-foreground">{act.time}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-bold text-white/60">{act.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>

        </div>

        {/* Bottom Navigation Categories */}
        <div className="flex justify-center pt-8 pb-12">
           <GlassCard className="inline-flex gap-8 px-10 py-4 rounded-full border-white/5 bg-white/5 backdrop-blur-3xl">
              {[
                { label: "Biunge", id: "biunge", icon: Zap },
                { label: "Phace", id: "phace", icon: TrendingUp },
                { label: "Books", id: "books1", icon: BookOpen },
                { label: "Books", id: "books2", icon: BookOpen },
                { label: "Stationary", id: "stationary", icon: PenTool }
              ].map((nav, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
                   <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
                      <nav.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                   </div>
                   <span className="text-[8px] font-bold uppercase tracking-widest">{nav.label}</span>
                </div>
              ))}
           </GlassCard>
        </div>

        {/* Footer Text */}
        <div className="text-center py-4 border-t border-white/5">
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">© 2024 CampusSpend: All rights reserved.</p>
        </div>

      </div>
    </VendorShell>
  )
}
