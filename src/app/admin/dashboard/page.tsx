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
  ClipboardList,
  Loader2
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
import Link from "next/link"
import { cn } from "@/lib/utils"
import { useFirestore, useUser, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, where, collectionGroup } from 'firebase/firestore'

export default function AdminDashboardPage() {
  const db = useFirestore()
  const { user, isProfileLoading } = useUser()

  // 1. Define Queries
  const studentsQuery = useMemoFirebase(() => query(collection(db, "userProfiles"), where("role", "==", "student")), [db])
  const vendorsQuery = useMemoFirebase(() => collection(db, "vendors"), [db])
  const ordersQuery = useMemoFirebase(() => collectionGroup(db, "orders"), [db])
  const productsQuery = useMemoFirebase(() => collection(db, "products"), [db])

  // 2. Fetch Data
  const { data: students, isLoading: studentsLoading } = useCollection(studentsQuery)
  const { data: vendors, isLoading: vendorsLoading } = useCollection(vendorsQuery)
  const { data: orders, isLoading: ordersLoading } = useCollection(ordersQuery)
  const { data: products, isLoading: productsLoading } = useCollection(productsQuery)

  // 3. Derived Data
  const totalRevenue = React.useMemo(() => orders?.reduce((sum, o) => sum + (o.totalAmount || 0), 0) || 0, [orders])
  
  const salesData = React.useMemo(() => [
    { name: 'Total', revenue: totalRevenue, orders: orders?.length || 0 }
  ], [totalRevenue, orders])

  const userDistribution = React.useMemo(() => [
    { name: 'Students', value: students?.length || 0, color: '#ef1ab8' },
    { name: 'Vendors', value: vendors?.length || 0, color: '#bc66eb' },
  ], [students, vendors])

  if (isProfileLoading || studentsLoading || vendorsLoading || ordersLoading || productsLoading) {
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
      <div className="space-y-8 animate-in fade-in duration-1000">
        
        {/* Page Title */}
        <h1 className="text-3xl font-headline font-bold text-white tracking-tight">Admin Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard className="p-6 border-white/5 bg-white/5 hover:border-primary/20 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Students</p>
                <h3 className="text-2xl font-bold text-white">{students?.length || 0}</h3>
              </div>
              <div className="p-2 rounded-xl bg-primary/10 text-primary">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
              Active Marketplace
            </p>
          </GlassCard>

          <GlassCard className="p-6 border-white/5 bg-white/5 hover:border-primary/20 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Vendors</p>
                <h3 className="text-2xl font-bold text-white">{vendors?.length || 0}</h3>
              </div>
              <div className="p-2 rounded-xl bg-secondary/10 text-secondary">
                <Store className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-1">
              Verified Merchants
            </p>
          </GlassCard>

          <GlassCard className="p-6 border-white/5 bg-white/5 hover:border-primary/20 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Orders</p>
                <h3 className="text-2xl font-bold text-white">{orders?.length || 0}</h3>
              </div>
              <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
              Live Transactions
            </p>
          </GlassCard>

          <GlassCard className="p-6 border-white/5 bg-white/5 hover:border-primary/20 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Revenue</p>
                <h3 className="text-2xl font-bold text-white">₦{totalRevenue.toLocaleString()}</h3>
              </div>
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>
            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
              Gross Volume
            </p>
          </GlassCard>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <GlassCard className="lg:col-span-7 p-8 border-white/10 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-headline font-bold text-white">Platform Performance</h3>
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
                  <Bar dataKey="orders" barSize={40} fill="#bc66eb" radius={[4, 4, 0, 0]} opacity={0.6} />
                  <Line type="monotone" dataKey="revenue" stroke="#ef1ab8" strokeWidth={3} dot={{ fill: '#ef1ab8', r: 4 }} activeDot={{ r: 6 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          <GlassCard className="lg:col-span-5 p-8 border-white/10 space-y-8">
            <h3 className="text-lg font-headline font-bold text-white">Users Distribution</h3>
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
                <p className="text-2xl font-bold text-white">{(students?.length || 0) + (vendors?.length || 0)}</p>
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
                  </div>
                </div>
              ))}
            </div>
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