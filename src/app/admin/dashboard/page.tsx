
"use client"

import * as React from "react"
import { AdminShell } from "@/components/layout/AdminShell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  AlertCircle,
  History,
  GraduationCap,
  Store,
  DollarSign,
  ClipboardList
} from "lucide-react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  ComposedChart,
  PieChart as RePieChart,
  Pie
} from 'recharts'
import Image from "next/image"
import { cn } from "@/lib/utils"

const salesData = [
  { name: 'Jan', revenue: 200000, orders: 1200 },
  { name: 'Feb', revenue: 280000, orders: 1980 },
  { name: 'Mar', revenue: 250000, orders: 1500 },
  { name: 'Apr', revenue: 320000, orders: 2400 },
]

const userDistribution = [
  { name: 'Students', value: 32850, color: '#ef1ab8' },
  { name: 'Vendors', value: 128, color: '#bc66eb' },
  { name: 'Admins', value: 22, color: '#f59e0b' },
]

const recentOrders = [
  { id: "#00140", student: "Priya Lashi", vendor: "QfoodHub Café", amount: "Rs. 600" },
  { id: "#00139", student: "Ishaan Kapoor", vendor: "CALCULOS", amount: "Rs. 660" },
  { id: "#00138", student: "Tanvi Patel", vendor: "Print & Spital", amount: "Rs. 480" },
  { id: "#00137", student: "Alex Carter", vendor: "QfoodHub Café", amount: "Rs. 250" },
]

const recentReports = [
  { id: "IR0035", type: "Vendor Issue", from: "Tanvi Patel", date: "Apr 24, 2024" },
  { id: "IR0034", type: "Inappropriate Content", from: "Ananya Mehta", date: "Apr 22, 2024" },
  { id: "IR0033", type: "Order Dispute", from: "Rohit Sharma", date: "Apr 21, 2024" },
  { id: "IR0032", type: "Payment Issue", from: "Ishaan Kapoor", date: "Apr 20, 2024" },
]

export default function AdminDashboardPage() {
  return (
    <AdminShell>
      <div className="space-y-8 animate-in fade-in duration-1000">
        
        {/* Page Title */}
        <h1 className="text-3xl font-headline font-bold text-white tracking-tight">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard className="p-6 border-white/5 bg-white/5 hover:border-primary/20 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Students</p>
                <h3 className="text-2xl font-bold text-white">32,850</h3>
              </div>
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> 120 (this month)
            </p>
          </GlassCard>

          <GlassCard className="p-6 border-white/5 bg-white/5 hover:border-primary/20 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Vendors</p>
                <h3 className="text-2xl font-bold text-white">128</h3>
              </div>
              <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
                <Store className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> 12 (this month)
            </p>
          </GlassCard>

          <GlassCard className="p-6 border-white/5 bg-white/5 hover:border-primary/20 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Orders</p>
                <h3 className="text-2xl font-bold text-white">8.5K</h3>
              </div>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3 rotate-90" /> -3.5% (this month)
            </p>
          </GlassCard>

          <GlassCard className="p-6 border-white/5 bg-white/5 hover:border-primary/20 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Revenue</p>
                <h3 className="text-2xl font-bold text-white">Rs. 980,000</h3>
              </div>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> + 2.8%
            </p>
          </GlassCard>
        </div>

        {/* Secondary Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-6 border-white/5 flex items-center justify-between group cursor-pointer hover:border-primary/20 transition-all">
             <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-white/5 text-muted-foreground group-hover:text-primary transition-colors">
                   <ShoppingBag className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Orders</p>
                   <h3 className="text-xl font-bold">8.5K</h3>
                </div>
             </div>
             <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
                -3.5% <ChevronRight className="w-4 h-4" />
             </div>
          </GlassCard>

          <GlassCard className="p-6 border-white/5 flex items-center gap-4 group cursor-pointer hover:border-primary/20 transition-all">
             <div className="p-3 rounded-2xl bg-white/5 text-muted-foreground group-hover:text-primary transition-colors">
                <Package className="w-6 h-6" />
             </div>
             <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Products Listed</p>
                <h3 className="text-xl font-bold">742</h3>
             </div>
          </GlassCard>

          <GlassCard className="p-6 border-white/5 flex items-center justify-between group cursor-pointer hover:border-primary/20 transition-all">
             <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-white/5 text-muted-foreground group-hover:text-primary transition-colors">
                   <ClipboardList className="w-6 h-6" />
                </div>
                <div>
                   <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Reports</p>
                   <h3 className="text-xl font-bold">24</h3>
                </div>
             </div>
             <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">+ 2.9% (this month)</p>
          </GlassCard>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <GlassCard className="lg:col-span-7 p-8 border-white/10 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-headline font-bold text-white">Sales Overview</h3>
              <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/5">
                 <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] font-bold uppercase bg-white/5">Monthly</Button>
                 <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] font-bold uppercase text-muted-foreground">Weekly</Button>
                 <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] font-bold uppercase text-muted-foreground">Daily</Button>
              </div>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={salesData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef1ab8" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#ef1ab8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(239,26,184,0.3)', borderRadius: '16px' }}
                    itemStyle={{ fontSize: '12px' }}
                  />
                  <Bar dataKey="orders" barSize={20} fill="#bc66eb" radius={[4, 4, 0, 0]} opacity={0.6} />
                  <Line type="monotone" dataKey="revenue" stroke="#ef1ab8" strokeWidth={3} dot={{ fill: '#ef1ab8', r: 4 }} activeDot={{ r: 6 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center gap-6 justify-center pt-4">
               <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white">
                  <div className="w-2 h-2 rounded-full bg-primary" /> Revenue
               </div>
               <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-secondary" /> Orders
               </div>
            </div>
          </GlassCard>

          <GlassCard className="lg:col-span-5 p-8 border-white/10 space-y-8">
            <h3 className="text-lg font-headline font-bold text-white">Users Overview</h3>
            <div className="relative h-[220px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie
                    data={userDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {userDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                </RePieChart>
              </ResponsiveContainer>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <p className="text-2xl font-bold text-white">3286</p>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">Total Members</p>
              </div>
            </div>
            <div className="space-y-4">
              {userDistribution.map((item, i) => (
                <div key={i} className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-white">{item.value.toLocaleString()}</span>
                    <span className="text-muted-foreground/40">({i === 0 ? "99.3%" : i === 1 ? "0.3%" : "0.1%"})</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Data Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-headline font-bold text-white">Recent Orders</h3>
              <Button variant="link" className="text-primary text-xs font-bold uppercase tracking-widest p-0 h-auto">View All</Button>
            </div>
            <GlassCard className="p-0 border-white/5 bg-white/5 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5">
                  <tr className="text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Student</th>
                    <th className="px-6 py-4">Vendor</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentOrders.map((order, i) => (
                    <tr key={i} className="group hover:bg-white/5 transition-colors cursor-pointer">
                      <td className="px-6 py-4 text-xs font-bold text-white/80">{order.id}</td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">{order.student}</td>
                      <td className="px-6 py-4 text-xs font-bold text-primary/80 uppercase tracking-widest">{order.vendor}</td>
                      <td className="px-6 py-4 text-xs font-bold text-white text-right flex items-center justify-end gap-2">
                        {order.amount} <ChevronRight className="w-3 h-3 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </GlassCard>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-headline font-bold text-white">Recent Reports</h3>
              <Button variant="link" className="text-primary text-xs font-bold uppercase tracking-widest p-0 h-auto">View All</Button>
            </div>
            <GlassCard className="p-0 border-white/5 bg-white/5 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-white/5">
                  <tr className="text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    <th className="px-6 py-4">Report ID</th>
                    <th className="px-6 py-4">Report Type</th>
                    <th className="px-6 py-4">From</th>
                    <th className="px-6 py-4">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {recentReports.map((report, i) => (
                    <tr key={i} className="group hover:bg-white/5 transition-colors cursor-pointer">
                      <td className="px-6 py-4 text-xs font-bold text-white/80">{report.id}</td>
                      <td className="px-6 py-4 text-xs text-rose-400 font-medium">{report.type}</td>
                      <td className="px-6 py-4 text-xs text-muted-foreground">{report.from}</td>
                      <td className="px-6 py-4 text-xs text-muted-foreground/60">{report.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </GlassCard>
          </div>
        </div>

        {/* Floating Bottom Nav */}
        <div className="flex justify-center pt-8 pb-12">
           <GlassCard className="inline-flex gap-10 px-12 py-4 rounded-full border-white/10 bg-black/20 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              {[
                { label: "Budget", id: "budget", icon: DollarSign },
                { label: "Plans", id: "plans", icon: Zap },
                { label: "Books", id: "books", icon: Box },
                { label: "Stats", id: "stats", icon: TrendingUp }
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
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">© 2024 CampusSpend: All rights reserved.</p>
        </div>

      </div>
    </AdminShell>
  )
}
