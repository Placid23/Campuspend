
"use client"

import * as React from "react"
import { AdminShell } from "@/components/layout/AdminShell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from "recharts"
import { 
  ClipboardList, 
  ChevronRight, 
  ChevronLeft,
  Calendar,
  Banknote,
  ShoppingBag,
  Users,
  ChefHat,
  Pizza,
  BookOpen,
  Box,
  Monitor,
  Smartphone,
  Laptop,
  Leaf,
  MoreVertical
} from "lucide-react"
import { cn } from "@/lib/utils"

const revenueData = [
  { name: 'Apr 1', value: 35000 },
  { name: 'Apr 2', value: 38000 },
  { name: 'Apr 9', value: 42000 },
  { name: 'Apr 15', value: 40000 },
  { name: 'Apr 13', value: 48000 },
  { name: 'Apr 17', value: 55000 },
  { name: 'Apr 21', value: 62000 },
  { name: 'Apr 21', value: 78000 },
  { name: 'Apr 24', value: 95000 },
]

const topProducts = [
  { name: "Wireless Bluetooth Headphones", sales: "85 sales", icon: Smartphone },
  { name: "Gaming Laptop", sales: "76 sales", icon: Monitor },
  { name: "Stainless Steel Water Bottle", sales: "62 sales", icon: Box },
  { name: "Organic Green Tea", sales: "58 sales", icon: Leaf },
]

const topVendors = [
  { name: "Fresh Foods Catering", revenue: "₦98,000", status: "Completed", icon: ChefHat },
  { name: "EduSupplies Co.", revenue: "₦82,000", status: "Pending", icon: BookOpen },
  { name: "CleanSweep Janitorial", revenue: "₦88,500", status: "Completed", icon: Box },
  { name: "Tech Solutions Ltd.", revenue: "₦62,000", status: "Cancelled", icon: Monitor },
]

export default function AdminReportsPage() {
  return (
    <AdminShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
          <ClipboardList className="w-3 h-3" /> Reports / <span className="text-white/80">Reports</span>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl font-headline font-bold text-white tracking-tight">Reports</h1>

        {/* Top Metric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-0 border-white/5 bg-black/20 overflow-hidden">
            <div className="p-4 border-b border-white/5">
              <Select defaultValue="revenue">
                <SelectTrigger className="h-8 border-none bg-transparent hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest p-0 flex gap-2">
                  <div className="p-1 rounded-md bg-amber-500/20 text-amber-500">
                    <Banknote className="w-3 h-3" />
                  </div>
                  <SelectValue placeholder="Metric" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10">
                  <SelectItem value="revenue">Total Revenue</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-8 space-y-1">
              <div className="flex items-center gap-3">
                <Banknote className="w-5 h-5 text-amber-500" />
                <h3 className="text-2xl font-bold text-white">₦530,000</h3>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-0 border-white/5 bg-black/20 overflow-hidden">
            <div className="p-4 border-b border-white/5">
              <Select defaultValue="students">
                <SelectTrigger className="h-8 border-none bg-transparent hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest p-0 flex gap-2">
                  <div className="p-1 rounded-md bg-primary/20 text-primary">
                    <Users className="w-3 h-3" />
                  </div>
                  <SelectValue placeholder="Metric" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10">
                  <SelectItem value="students">Total Students</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-8 space-y-1">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-5 h-5 text-primary" />
                <h3 className="text-2xl font-bold text-white">1,150</h3>
                <span className="text-[10px] font-bold text-muted-foreground/60 uppercase ml-auto">Gross Orders</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-0 border-white/5 bg-black/20 overflow-hidden">
            <div className="p-4 border-b border-white/5">
              <Select defaultValue="custom">
                <SelectTrigger className="h-8 border-none bg-transparent hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest p-0 flex gap-2">
                  <div className="p-1 rounded-md bg-secondary/20 text-secondary">
                    <Calendar className="w-3 h-3" />
                  </div>
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10">
                  <SelectItem value="custom">Custom: Apr 1, 2024 - Apr 24, 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="p-8 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Banknote className="w-5 h-5 text-amber-500" />
                  <h3 className="text-2xl font-bold text-white">₦120,000</h3>
                </div>
                <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                  <Monitor className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Main Analytics Card */}
        <GlassCard className="p-8 border-white/10 bg-black/20 backdrop-blur-3xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-headline font-bold text-white">Revenue</h2>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total <span className="text-white">₦120,000</span></p>
              </div>
              <MoreVertical className="w-4 h-4 text-muted-foreground cursor-pointer" />
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef1ab8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ef1ab8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10 }}
                  ticks={[30000, 60000, 90000, 120000]}
                  tickFormatter={(val) => `₦${val/1000}K`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(239,26,184,0.3)', borderRadius: '16px' }}
                  itemStyle={{ color: '#ef1ab8', fontSize: '12px' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#ef1ab8" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                  dot={{ fill: '#ef1ab8', stroke: '#000', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#ef1ab8', stroke: '#fff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-muted-foreground/60 italic">Here is a summary of your revenue trends for the selected time period.</p>

          <Tabs defaultValue="sales" className="w-full">
            <TabsList className="bg-white/5 border border-white/10 h-12 p-1 rounded-2xl">
              <TabsTrigger value="sales" className="rounded-xl px-8 data-[state=active]:bg-primary/20 data-[state=active]:text-primary font-bold">Sales Report</TabsTrigger>
              <TabsTrigger value="students" className="rounded-xl px-8 font-bold">Students Report</TabsTrigger>
              <TabsTrigger value="orders" className="rounded-xl px-8 font-bold">Orders Report</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-4">
            {/* Top-Selling Products */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80">Top-Selling Products</h3>
              <div className="space-y-4">
                {topProducts.map((product, i) => (
                  <div key={i} className="flex items-center gap-4 group cursor-pointer hover:translate-x-1 transition-transform">
                    <span className="text-xs font-bold text-muted-foreground/40 w-4">{i + 1}</span>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-muted-foreground group-hover:text-primary transition-colors">
                      <product.icon className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">{product.name}</p>
                    <span className="ml-auto text-xs font-bold text-white">{product.sales}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Vendors by Revenue */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80">Top Vendors by Revenue</h3>
              <div className="space-y-4">
                {topVendors.map((vendor, i) => (
                  <div key={i} className="flex items-center gap-4 group cursor-pointer hover:translate-x-1 transition-transform">
                    <span className="text-xs font-bold text-muted-foreground/40 w-4">{i + 1}</span>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-muted-foreground group-hover:text-secondary transition-colors">
                      <vendor.icon className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-bold text-white/80 group-hover:text-white transition-colors">{vendor.name}</p>
                    <div className="ml-auto flex items-center gap-4">
                      <span className="text-xs font-bold text-white">{vendor.revenue}</span>
                      <div className={cn(
                        "px-3 py-1 rounded-full border text-[8px] font-bold uppercase tracking-widest",
                        vendor.status === 'Completed' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                        vendor.status === 'Pending' ? "bg-amber-500/10 border-amber-500/20 text-amber-400" :
                        "bg-rose-500/10 border-rose-500/20 text-rose-400"
                      )}>
                        {vendor.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-end pt-8">
            <div className="flex items-center gap-2 bg-white/5 border border-white/5 rounded-xl p-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-white/5">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-1 px-2">
                <Button size="sm" className="h-8 w-8 rounded-lg bg-primary/20 text-primary font-bold border border-primary/20">1</Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg text-muted-foreground">2</Button>
                <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg text-muted-foreground">3</Button>
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-white/5">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* Floating Bottom Nav */}
        <div className="flex justify-center pt-8 pb-12">
           <GlassCard className="inline-flex gap-10 px-12 py-4 rounded-full border-white/10 bg-black/20 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              {[
                { label: "Burger", id: "burger", icon: ChefHat },
                { label: "Pizza", id: "pizza", icon: Pizza },
                { label: "Books", id: "books1", icon: BookOpen },
                { label: "Books", id: "books2", icon: Box }
              ].map((nav, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer opacity-60 hover:opacity-100 transition-all hover:scale-110">
                   <div className="w-10 h-10 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
                      <nav.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                   </div>
                   <span className="text-[8px] font-bold uppercase tracking-[0.2em]">{nav.label}</span>
                </div>
              ))}
           </GlassCard>
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-white/5">
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">© 2024 CampusSpend. All rights reserved.</p>
        </div>

      </div>
    </AdminShell>
  )
}
