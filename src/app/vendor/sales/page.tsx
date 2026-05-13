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
  PenTool,
  Loader2,
  ShoppingBag,
  AlertTriangle,
  Database
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
import { useFirestore, useUser, useCollection, useMemoFirebase } from "@/firebase"
import { collectionGroup, query, where, orderBy, limit } from 'firebase/firestore'
import { format, subDays, startOfDay } from 'date-fns'

export default function SalesSummaryPage() {
  const { user, isProfileLoading } = useUser()
  const db = useFirestore()

  // 1. Fetch live order items for this vendor
  const itemsQuery = useMemoFirebase(() => {
    if (!user?.uid) return null
    return query(
      collectionGroup(db, "orderItems"),
      where("vendorOwnerId", "==", user.uid),
      limit(100)
    )
  }, [db, user?.uid])

  const { data: orderItems, isLoading, error: queryError } = useCollection(itemsQuery)

  // 2. Aggregate Data for Charts & Stats
  const stats = React.useMemo(() => {
    if (!orderItems) return { total: 0, count: 0, avg: 0, chart: [], top: [] }
    
    let total = 0
    const dailyMap: Record<string, { name: string, sales: number, orders: number }> = {}
    const productMap: Record<string, { name: string, sales: number, count: number }> = {}

    orderItems.forEach(item => {
      total += item.subtotal || 0
      
      // Daily aggregation
      const date = item.createdAt ? format(new Date(item.createdAt), 'MMM d') : 'Today'
      if (!dailyMap[date]) dailyMap[date] = { name: date, sales: 0, orders: 0 }
      dailyMap[date].sales += item.subtotal || 0
      dailyMap[date].orders += 1

      // Product aggregation
      if (!productMap[item.productId]) productMap[item.productId] = { name: item.name, sales: 0, count: 0 }
      productMap[item.productId].sales += item.subtotal || 0
      productMap[item.productId].count += item.quantity || 1
    })

    const chart = Object.values(dailyMap).slice(-14)
    const top = Object.values(productMap)
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5)
      .map(p => ({ ...p, percentage: ((p.sales / (total || 1)) * 100).toFixed(1) + "%" }))

    return { total, count: orderItems.length, avg: total / (orderItems.length || 1), chart, top }
  }, [orderItems])

  // 3. Robust Error Catching
  const hasIndexError = queryError?.message?.toLowerCase().includes('index') || queryError?.code === 'failed-precondition'

  if (hasIndexError) {
    return (
      <VendorShell>
        <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6 text-center max-w-md mx-auto p-6">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <Database className="w-10 h-10 text-amber-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-headline font-bold text-white uppercase tracking-tight">Sales Analytics Activation</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Real-time sales analytics require a <strong>vendorOwnerId</strong> cross-collection index to be active in your database.
            </p>
          </div>
          <Button asChild className="bg-amber-500 hover:bg-amber-600 text-black font-bold h-14 px-8 rounded-2xl w-full shadow-lg">
            <a href="https://console.firebase.google.com/v1/r/project/campusspend-733ab/firestore/indexes?create_exemption=Cl9wcm9qZWN0cy9jYW1wdXNzcGVuZC03MzNhYi9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvb3JkZXJJdGVtcy9maWVsZHMvdmVuZG9yT3duZXJJZBACGhEKDXZlbmRvck93bmVySWQQAQ" target="_blank" rel="noopener noreferrer">
              Activate Analytics Engine
            </a>
          </Button>
        </div>
      </VendorShell>
    )
  }

  if (isProfileLoading || isLoading) {
    return (
      <VendorShell>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-6">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground animate-pulse">Processing Sales Data...</p>
          </div>
        </div>
      </VendorShell>
    )
  }

  return (
    <VendorShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Sales Analytics</h1>
          <div className="flex items-center gap-4">
            <div className="h-12 px-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 group">
              <CalendarIcon className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-white/80">Real-time Performance</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <GlassCard className="p-6 border-white/10 bg-gradient-to-br from-primary/20 to-secondary/10 relative overflow-hidden group">
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 mb-4 flex items-center gap-2">
                   <TrendingUp className="w-3 h-3" /> Gross Volume
                </p>
                <h3 className="text-2xl font-bold text-white">₦{stats.total.toLocaleString()}</h3>
              </GlassCard>

              <GlassCard className="p-6 border-white/10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Total Orders</p>
                <h3 className="text-2xl font-bold text-white">{stats.count}</h3>
              </GlassCard>

              <GlassCard className="p-6 border-white/10">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-4">Avg. Ticket</p>
                <h3 className="text-2xl font-bold text-white">₦{Math.round(stats.avg).toLocaleString()}</h3>
              </GlassCard>
            </div>

            <GlassCard className="p-8 border-white/10 space-y-8 bg-white/5 backdrop-blur-3xl">
              <h3 className="text-lg font-headline font-bold text-white">Revenue Trend</h3>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={stats.chart}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(239,26,184,0.3)', borderRadius: '16px' }} />
                    <Bar dataKey="sales" fill="#ef1ab8" radius={[4, 4, 0, 0]} opacity={0.3} />
                    <Line type="monotone" dataKey="sales" stroke="#ef1ab8" strokeWidth={3} dot={{ fill: '#ef1ab8', r: 4 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

            <div className="space-y-6">
               <h3 className="text-xl font-headline font-bold text-white">Recent Transactions</h3>
               <div className="space-y-4">
                  {orderItems?.slice(0, 5).map((item) => (
                    <GlassCard key={item.id} className="p-4 border-white/5 hover:border-primary/20 transition-all flex items-center gap-6 group">
                       <div className="relative w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
                          <ShoppingBag className="w-5 h-5 text-primary" />
                       </div>
                       <div className="flex-1 min-w-0">
                          <h4 className="text-base font-bold text-white">{item.name}</h4>
                          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">TRANSACTION LOGGED</p>
                       </div>
                       <div className="text-right">
                          <p className="text-lg font-bold text-primary">₦{item.subtotal?.toLocaleString()}</p>
                       </div>
                    </GlassCard>
                  ))}
               </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <GlassCard className="p-8 border-white/10 space-y-8 bg-white/5 backdrop-blur-3xl">
              <h3 className="text-xl font-headline font-bold text-white">Top Listings</h3>
              <div className="space-y-6">
                {stats.top.map((product, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                       {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="text-sm font-bold text-white truncate">{product.name}</p>
                       <p className="text-[10px] text-muted-foreground">{product.count} units sold</p>
                    </div>
                    <div className="text-sm font-bold text-white">{product.percentage}</div>
                  </div>
                ))}
                {stats.top.length === 0 && (
                   <p className="text-xs text-muted-foreground italic">No sales recorded yet.</p>
                )}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </VendorShell>
  )
}
