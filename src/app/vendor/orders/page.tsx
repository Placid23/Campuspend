
"use client"

import * as React from "react"
import { VendorShell } from "@/components/layout/VendorShell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Search,
  FileUp,
  ChevronRight,
  ChevronLeft,
  ChefHat,
  Pizza,
  BookOpen,
  PenTool,
  TrendingUp,
  Zap,
  MoreVertical
} from "lucide-react"
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Tooltip as ReTooltip
} from 'recharts'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const orders = [
  { id: "#01041", date: "Apr 24, 2024", customer: "Alex Carter", sub: "In spods", status: "Delivered", amount: "₦600", statusColor: "emerald" },
  { id: "#01042", date: "Apr 24, 2024", customer: "Priya Joshi", sub: "In spods", status: "Pending", amount: "₦180", statusColor: "amber" },
  { id: "#01043", date: "Apr 24, 2024", customer: "Ananya Mehta", sub: "In spods", status: "Pending", amount: "₦325", statusColor: "amber" },
  { id: "#01043", date: "Apr 24, 2024", customer: "Aurit Sharma", sub: "In bpods", status: "Delivered", amount: "₦600", statusColor: "emerald" },
  { id: "#01044", date: "Apr 24, 2024", customer: "Aditi Verma", sub: "In spods", status: "Delivered", amount: "₦130", statusColor: "emerald" },
  { id: "#01045", date: "Apr 24, 2024", customer: "Nikhil Singh", sub: "In spods", status: "Pending", amount: "₦160", statusColor: "amber" },
  { id: "#01046", date: "Apr 24, 2024", customer: "Tanvi Patel", sub: "In ppods", status: "Cancelled", amount: "₦325", statusColor: "rose" },
  { id: "#01047", date: "Apr 24, 2024", customer: "Apr 24, 2024", sub: "---", status: "Delivered", amount: "₦210", statusColor: "emerald" },
]

const summaryData = [
  { name: 'Delivered', value: 432, color: '#bc66eb', percentage: '94%' },
  { name: 'Pending', value: 15, color: '#f59e0b', percentage: '3%' },
  { name: 'Cancelled', value: 11, color: '#ef1ab8', percentage: '3%' },
]

const recentCustomers = [
  { name: "Alex Carter", amount: "₦600", avatar: "https://picsum.photos/seed/alex/100/100" },
  { name: "Priya Joshi", amount: "₦180", avatar: "https://picsum.photos/seed/priya/100/100" },
  { name: "Ananya Mehta", amount: "₦325", avatar: "https://picsum.photos/seed/ananya/100/100" },
]

export default function VendorOrdersPage() {
  return (
    <VendorShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-headline font-bold text-white tracking-tight">View Orders</h1>
          <Button className="h-12 px-8 rounded-2xl bg-gradient-to-r from-primary to-secondary font-bold shadow-[0_0_20px_rgba(239,26,184,0.3)] hover:opacity-90 transition-all flex gap-2">
            <FileUp className="w-5 h-5" /> Export
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Orders List (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Search orders..." 
                  className="h-14 bg-white/5 border-white/10 rounded-2xl pl-14 pr-6 text-sm focus:border-primary/50 transition-all"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="h-14 w-full md:w-48 bg-white/5 border-white/10 rounded-2xl px-6 focus:ring-primary/30">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10">
                  <SelectItem value="all">Filter by Status</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="range">
                <SelectTrigger className="h-14 w-full md:w-48 bg-white/5 border-white/10 rounded-2xl px-6 focus:ring-primary/30">
                  <SelectValue placeholder="Date Range" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10">
                  <SelectItem value="range">Date Range</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="yesterday">Yesterday</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <GlassCard className="p-0 border-white/10 bg-white/5 backdrop-blur-3xl overflow-hidden">
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground pl-8">Order ID</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground">Date</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground">Customer</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground text-center">Status</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground text-right pr-8">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order, i) => (
                    <TableRow key={i} className="border-white/5 hover:bg-white/5 transition-colors group cursor-pointer">
                      <TableCell className="pl-8 py-6 font-bold text-sm text-white/80">{order.id}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{order.date}</TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{order.customer}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">{order.sub}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <div className={cn(
                            "px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest",
                            order.statusColor === 'emerald' && "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
                            order.statusColor === 'amber' && "bg-amber-500/10 border-amber-500/20 text-amber-400",
                            order.statusColor === 'rose' && "bg-rose-500/10 border-rose-500/20 text-rose-400"
                          )}>
                            {order.status}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex items-center justify-end gap-3">
                           <span className="text-sm font-bold text-white">{order.amount}</span>
                           <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* Pagination */}
              <div className="p-6 flex items-center justify-center gap-2 border-t border-white/5">
                <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-white/5"><ChevronLeft className="w-4 h-4" /></Button>
                <Button variant="outline" size="sm" className="h-8 w-8 rounded-lg bg-primary text-white border-primary text-[10px] font-bold">1</Button>
                {[2, 3, 4].map(page => (
                  <Button key={page} variant="ghost" size="sm" className="h-8 w-8 rounded-lg text-[10px] font-bold text-muted-foreground hover:bg-white/5">{page}</Button>
                ))}
                <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-white/5 mx-2"><ChevronRight className="w-4 h-4" /></Button>
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Next</span>
              </div>
            </GlassCard>
          </div>

          {/* Sidebar Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <GlassCard className="p-8 border-white/10 space-y-8 bg-white/5 backdrop-blur-3xl">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-headline font-bold text-white">Orders Summary</h3>
                <MoreVertical className="w-4 h-4 text-muted-foreground cursor-pointer" />
              </div>

              <div className="space-y-6">
                {[
                  { label: "Total Orders", value: "458", color: "white" },
                  { label: "Delivered Orders", value: "432", color: "white" },
                  { label: "Pending Orders", value: "15", color: "amber-500" },
                  { label: "Cancelled Orders", value: "11", color: "rose-500" },
                ].map((stat, i) => (
                  <div key={i} className="flex justify-between items-center group">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-1.5 h-1.5 rounded-full", i === 0 || i === 1 ? "bg-primary" : i === 2 ? "bg-amber-500" : "bg-rose-500")}></div>
                      <span className="text-sm font-bold text-muted-foreground group-hover:text-white transition-colors">{stat.label}</span>
                    </div>
                    <span className={cn("text-lg font-bold", stat.color === 'white' ? "text-white" : `text-${stat.color}`)}>{stat.value}</span>
                  </div>
                ))}
              </div>

              {/* Donut Chart */}
              <div className="relative h-[220px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={summaryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {summaryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <ReTooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-xl font-bold text-white">432</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase">(2AR)</p>
                </div>
              </div>

              {/* Chart Legend */}
              <div className="space-y-4">
                {summaryData.map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                    <div className="flex items-center gap-3">
                       <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                       <span className="text-muted-foreground">{item.name}</span>
                    </div>
                    <div className="flex gap-4">
                       <span className="text-white">{item.value}</span>
                       <span className="text-muted-foreground/60">({item.percentage})</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Customers */}
              <div className="pt-8 border-t border-white/5 space-y-6">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-white">Recent Customers</h4>
                <div className="space-y-4">
                  {recentCustomers.map((customer, i) => (
                    <div key={i} className="flex items-center gap-4 group cursor-pointer">
                      <Avatar className="w-10 h-10 border-2 border-primary/20 group-hover:border-primary transition-colors">
                        <AvatarImage src={customer.avatar} />
                        <AvatarFallback>C</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-white truncate">{customer.name}</p>
                      </div>
                      <div className="text-xs font-bold text-white/60">{customer.amount}</div>
                    </div>
                  ))}
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Bottom Category Selector */}
        <div className="flex justify-center pt-8 pb-12">
           <GlassCard className="inline-flex gap-8 px-10 py-4 rounded-full border-white/5 bg-white/5 backdrop-blur-3xl">
              {[
                { label: "Biange", id: "biange", icon: Zap },
                { label: "Place", id: "place", icon: TrendingUp },
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

        {/* Footer */}
        <div className="text-center py-4 border-t border-white/5">
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">© 2024 CampusSpend: All rights reserved.</p>
        </div>

      </div>
    </VendorShell>
  )
}
