
"use client"

import * as React from "react"
import { DashboardShell } from "@/components/layout/Shell"
import { GlassCard } from "@/components/ui/glass-card"
import { 
  Zap, 
  ChevronDown, 
  BarChart3, 
  Lightbulb,
  Clock,
  ChevronRight,
  TrendingUp,
  PieChart,
  ShoppingBag,
  ChefHat,
  Pizza,
  BookOpen,
  PenTool,
  Store
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart as RePieChart,
  Pie,
  Cell as PieCell
} from 'recharts'
import Image from "next/image"
import { cn } from "@/lib/utils"

const donutData = [
  { name: 'Burger', value: 33.9, color: '#ef1ab8' },
  { name: 'Pizza', value: 26.1, color: '#bc66eb' },
  { name: 'Books', value: 10.4, color: '#f59e0b' },
  { name: 'Stationery', value: 13.0, color: '#10b981' },
  { name: 'Others', value: 16.6, color: '#3b82f6' },
]

const weeklyChartData = [
  { name: 'Week 1', total: 1200 },
  { name: 'Week 2', total: 1900 },
  { name: 'Week 3', total: 1500 },
  { name: 'Week 4', total: 2400 },
  { name: 'Week 5', total: 2800 },
]

const recentPurchases = [
  { name: "Cheesy Burger", time: "3 days ago", price: 225, image: "https://picsum.photos/seed/burger1/100/100" },
  { name: "Books", time: "5 days ago", price: 637, image: "https://picsum.photos/seed/books1/100/100" },
  { name: "Pepperoni Pizza", time: "1 week ago", price: 250, image: "https://picsum.photos/seed/pizza1/100/100" },
]

export default function SpendingSummaryPage() {
  return (
    <DashboardShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-4xl font-headline font-bold">Spending <span className="text-primary neon-text-glow">Summary</span></h1>
          <p className="text-muted-foreground text-sm max-w-2xl">Review your monthly spending trends and budget progress for April 2024</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <GlassCard className="p-8 border-white/10 space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Budget Progress & Donut */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-headline font-bold uppercase tracking-widest text-muted-foreground/80">Your Budget Progress</h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                         <div className="h-10 px-4 rounded-xl bg-primary/20 border border-primary/30 flex items-center gap-2">
                           <Zap className="w-4 h-4 text-primary" />
                           <span className="text-sm font-bold text-white">₦5,725 Spent</span>
                         </div>
                         <div className="h-10 w-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xs font-bold text-emerald-400">
                           275
                         </div>
                      </div>
                      <Progress value={95} className="h-2 bg-white/5 [&>div]:bg-gradient-to-r [&>div]:from-primary [&>div]:to-secondary" />
                      <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">
                        Over budget! Spending limit is ₦275 left
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-headline font-bold uppercase tracking-widest text-muted-foreground/80">Weekly Expenses</h3>
                    <div className="space-y-4 text-sm">
                      {[
                        { name: "Burger", amount: "15,995" },
                        { name: "Pizza", amount: "5,160" },
                        { name: "Books", amount: "16,040" },
                        { name: "Shawarma", amount: "5,000" }
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center group cursor-pointer hover:text-primary transition-colors">
                          <span className="text-muted-foreground group-hover:text-white">{item.name}</span>
                          <span className="font-bold">₦{item.amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Donut Chart and Legend */}
                <div className="relative flex flex-col items-center justify-center pt-8">
                  <div className="w-full h-[220px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={donutData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {donutData.map((entry, index) => (
                            <PieCell key={`cell-${index}`} fill={entry.color} stroke="none" />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        />
                      </RePieChart>
                    </ResponsiveContainer>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                       <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Spent</p>
                       <p className="text-lg font-bold">₦5,725</p>
                    </div>
                  </div>

                  {/* Donut Legend */}
                  <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4">
                    {donutData.map((entry, i) => (
                      <div key={i} className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                        <span>{entry.name}</span>
                        <span className="ml-auto text-white">{entry.value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Row: Recent Purchases + Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-white/5">
                <div className="space-y-6">
                  <h3 className="text-lg font-headline font-bold uppercase tracking-widest text-muted-foreground/80">Recent Purchases</h3>
                  <div className="space-y-4">
                    {recentPurchases.map((item, i) => (
                      <div key={i} className="flex items-center gap-4 group cursor-pointer">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-white/10">
                           <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className="text-sm font-bold truncate">{item.name}</p>
                           <p className="text-[10px] text-muted-foreground uppercase font-medium">{item.time}</p>
                        </div>
                        <div className="text-sm font-bold text-primary">₦{item.price}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-lg font-headline font-bold uppercase tracking-widest text-muted-foreground/80">Student Insights</h3>
                  <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                       <Lightbulb className="w-5 h-5 text-primary" />
                    </div>
                    <div className="space-y-2">
                       <p className="text-sm text-white/80 leading-relaxed font-medium">
                          Consider cutting down on fast food purchases to balance your budget.
                       </p>
                       <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Recommended Action</p>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <GlassCard className="p-8 border-white/10 space-y-8">
              <h3 className="text-xl font-headline font-bold">Spending Breakdown</h3>
              
              <div className="space-y-4">
                {[
                  { name: "Burger", price: "1,920" },
                  { name: "Pizza", price: "1,870" },
                  { name: "Books", price: "1,050" },
                  { name: "Stationery", price: "660" },
                  { name: "Shawarma", price: "990" }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">{item.name}</span>
                    <span className="font-bold">₦{item.price}</span>
                  </div>
                ))}
              </div>

              {/* Weekly Trend Chart */}
              <div className="h-[180px] w-full mt-8">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#64748b', fontSize: 10, fontWeight: 'bold' }} 
                    />
                    <YAxis hide />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(239,26,184,0.3)', borderRadius: '12px' }}
                      itemStyle={{ color: '#ef1ab8' }}
                    />
                    <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                      {weeklyChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 4 ? '#ef1ab8' : 'rgba(239,26,184,0.3)'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
                  Consider cutting down on fast food purchases to balance your budget for the rest of the month.
                </p>
                <Button className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-secondary text-base font-bold shadow-[0_0_30px_rgba(239,26,184,0.3)] hover:opacity-90 active:scale-[0.98] transition-all">
                  View Expensary
                </Button>
                <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                   <TrendingUp className="w-3 h-3 text-emerald-400" /> Weekly Expenses Tracked
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Bottom Category Selector Component */}
        <div className="flex justify-center pt-8 pb-12">
           <GlassCard className="inline-flex gap-8 px-10 py-4 rounded-full border-white/5 bg-white/5 backdrop-blur-3xl">
              {[
                { label: "Burger", id: "burger", icon: ChefHat },
                { label: "Pizza", id: "pizza", icon: Pizza },
                { label: "Pizza", id: "pizza2", icon: Pizza },
                { label: "Books", id: "books", icon: BookOpen },
                { label: "Stationery", id: "stationery", icon: PenTool }
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
        <div className="text-center py-12 border-t border-white/5">
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">© 2024 CampusSpend. All rights reserved.</p>
        </div>

      </div>
    </DashboardShell>
  )
}
