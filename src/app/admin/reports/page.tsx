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
  MoreVertical,
  Loader2,
  Store
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, where, collectionGroup, orderBy } from 'firebase/firestore'
import { format } from 'date-fns'

export default function AdminReportsPage() {
  const db = useFirestore()

  // 1. Fetch live data
  const ordersQuery = useMemoFirebase(() => collectionGroup(db, "orders"), [db])
  const itemsQuery = useMemoFirebase(() => collectionGroup(db, "orderItems"), [db])
  const vendorsQuery = useMemoFirebase(() => collection(db, "vendors"), [db])
  const studentsQuery = useMemoFirebase(() => query(collection(db, "userProfiles"), where("role", "==", "student")), [db])

  const { data: orders, isLoading: ordersLoading } = useCollection(ordersQuery)
  const { data: items, isLoading: itemsLoading } = useCollection(itemsQuery)
  const { data: vendors, isLoading: vendorsLoading } = useCollection(vendorsQuery)
  const { data: students, isLoading: studentsLoading } = useCollection(studentsQuery)

  // 2. Calculations
  const totalRevenue = React.useMemo(() => orders?.reduce((sum, o) => sum + (o.totalAmount || 0), 0) || 0, [orders])
  
  const revenueTrend = React.useMemo(() => {
    if (!orders) return []
    // Group by date
    const groups: Record<string, number> = {}
    orders.forEach(o => {
      try {
        const date = format(new Date(o.orderDate), 'MMM d')
        groups[date] = (groups[date] || 0) + o.totalAmount
      } catch (e) {
        console.error("Invalid date in order", o)
      }
    })
    return Object.entries(groups).map(([name, value]) => ({ name, value }))
  }, [orders])

  const topProducts = React.useMemo(() => {
    if (!items) return []
    const sales: Record<string, { name: string, count: number }> = {}
    items.forEach(i => {
      if (!sales[i.productId]) sales[i.productId] = { name: i.name, count: 0 }
      sales[i.productId].count += i.quantity
    })
    return Object.values(sales)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [items])

  const topVendorsList = React.useMemo(() => {
    if (!items || !vendors) return []
    const revs: Record<string, number> = {}
    items.forEach(i => {
      revs[i.vendorOwnerId] = (revs[i.vendorOwnerId] || 0) + i.subtotal
    })
    return vendors.map(v => ({
      name: v.name,
      revenue: revs[v.id] || 0,
      status: "Completed"
    })).sort((a, b) => b.revenue - a.revenue).slice(0, 5)
  }, [items, vendors])

  if (ordersLoading || itemsLoading || vendorsLoading || studentsLoading) {
    return (
      <AdminShell>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
          <ClipboardList className="w-3 h-3" /> Reports / <span className="text-white/80">Platform Analytics</span>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl font-headline font-bold text-white tracking-tight">System Reports</h1>

        {/* Top Metric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-0 border-white/5 bg-black/20 overflow-hidden">
            <div className="p-4 border-b border-white/5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500 flex items-center gap-2">
                <Banknote className="w-3 h-3" /> Total Revenue
              </p>
            </div>
            <div className="p-8 space-y-1">
              <h3 className="text-2xl font-bold text-white">₦{totalRevenue.toLocaleString()}</h3>
            </div>
          </GlassCard>

          <GlassCard className="p-0 border-white/5 bg-black/20 overflow-hidden">
            <div className="p-4 border-b border-white/5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                <Users className="w-3 h-3" /> User Base
              </p>
            </div>
            <div className="p-8 space-y-1">
              <div className="flex items-center gap-3">
                <h3 className="text-2xl font-bold text-white">{students?.length || 0}</h3>
                <span className="text-[10px] font-bold text-muted-foreground/60 uppercase ml-auto">Active Students</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-0 border-white/5 bg-black/20 overflow-hidden">
            <div className="p-4 border-b border-white/5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-secondary flex items-center gap-2">
                <ShoppingBag className="w-3 h-3" /> Transactions
              </p>
            </div>
            <div className="p-8 space-y-1">
              <h3 className="text-2xl font-bold text-white">{orders?.length || 0}</h3>
            </div>
          </GlassCard>
        </div>

        {/* Main Analytics Card */}
        <GlassCard className="p-8 border-white/10 bg-black/20 backdrop-blur-3xl space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
          
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-headline font-bold text-white">Revenue Analysis</h2>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrend}>
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
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-4">
            {/* Top-Selling Products */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80">Top-Selling Products</h3>
              <div className="space-y-4">
                {topProducts.map((product, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <span className="text-xs font-bold text-muted-foreground/40 w-4">{i + 1}</span>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-muted-foreground group-hover:text-primary transition-colors">
                      <Package className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-bold text-white/80">{product.name}</p>
                    <span className="ml-auto text-xs font-bold text-white">{product.count} sales</span>
                  </div>
                ))}
                {topProducts.length === 0 && <p className="text-xs text-muted-foreground italic">No sales recorded yet.</p>}
              </div>
            </div>

            {/* Top Vendors by Revenue */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/80">Top Vendors by Revenue</h3>
              <div className="space-y-4">
                {topVendorsList.map((vendor, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <span className="text-xs font-bold text-muted-foreground/40 w-4">{i + 1}</span>
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 text-muted-foreground group-hover:text-secondary transition-colors">
                      <Store className="w-4 h-4" />
                    </div>
                    <p className="text-sm font-bold text-white/80">{vendor.name}</p>
                    <div className="ml-auto flex items-center gap-4">
                      <span className="text-xs font-bold text-white">₦{vendor.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
                {topVendorsList.length === 0 && <p className="text-xs text-muted-foreground italic">No vendor activity recorded.</p>}
              </div>
            </div>
          </div>
        </GlassCard>

        {/* Footer */}
        <div className="text-center py-8 border-t border-white/5">
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">© 2024 CampusSpend. Platform Integrity Engine.</p>
        </div>

      </div>
    </AdminShell>
  )
}
