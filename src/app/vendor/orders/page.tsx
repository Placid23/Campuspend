"use client"

import * as React from "react"
import { VendorShell } from "@/components/layout/VendorShell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Search,
  FileUp,
  ChevronRight,
  ChevronLeft,
  ShoppingBag,
  Loader2,
  Calendar
} from "lucide-react"
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer,
  Tooltip as ReTooltip
} from 'recharts'
import { cn } from "@/lib/utils"
import { collectionGroup, query, where, orderBy } from 'firebase/firestore'
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase'
import { format } from 'date-fns'

export default function VendorOrdersPage() {
  const { user } = useUser()
  const db = useFirestore()

  // Fetch real order items for this vendor using collectionGroup - REQUIRED: Filtered by vendorOwnerId
  const itemsQuery = useMemoFirebase(() => {
    if (!user) return null
    return query(
      collectionGroup(db, "orderItems"),
      where("vendorOwnerId", "==", user.uid)
    )
  }, [db, user])

  const { data: orderItems, isLoading } = useCollection(itemsQuery)

  const totalRevenue = React.useMemo(() => {
    return orderItems?.reduce((sum, item) => sum + item.subtotal, 0) || 0
  }, [orderItems])

  const summaryData = React.useMemo(() => {
    if (!orderItems) return []
    const deliveredCount = orderItems.length // Assuming items are auto-delivered for MVP
    return [
      { name: 'Delivered', value: deliveredCount, color: '#bc66eb', percentage: '100%' },
      { name: 'Pending', value: 0, color: '#f59e0b', percentage: '0%' },
      { name: 'Cancelled', value: 0, color: '#ef1ab8', percentage: '0%' },
    ]
  }, [orderItems])

  return (
    <VendorShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Vendor Orders</h1>
          <Button className="h-12 px-8 rounded-2xl bg-gradient-to-r from-primary to-secondary font-bold shadow-[0_0_20px_rgba(239,26,184,0.3)] hover:opacity-90 transition-all flex gap-2">
            <FileUp className="w-5 h-5" /> Export
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Orders List (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1 group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <Input 
                  placeholder="Search sales..." 
                  className="h-14 bg-white/5 border-white/10 rounded-2xl pl-14 pr-6 text-sm focus:border-primary/50 transition-all"
                />
              </div>
            </div>

            <GlassCard className="p-0 border-white/10 bg-white/5 backdrop-blur-3xl overflow-hidden min-h-[400px] flex flex-col justify-center">
              {isLoading ? (
                <div className="flex flex-col items-center gap-4 py-20">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Loading Sales Data...</p>
                </div>
              ) : orderItems && orderItems.length > 0 ? (
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground pl-8">Item</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground">Order ID</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground">Qty</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground text-center">Status</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground text-right pr-8">Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.map((item) => (
                      <TableRow key={item.id} className="border-white/5 hover:bg-white/5 transition-colors group cursor-pointer">
                        <TableCell className="pl-8 py-6">
                          <div className="space-y-0.5">
                            <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{item.name || 'Product'}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                              {item.createdAt ? format(new Date(item.createdAt), 'MMM d, h:mm a') : 'N/A'}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground font-mono">{item.orderId?.substring(0, 12)}...</TableCell>
                        <TableCell className="text-sm text-white/80">{item.quantity}x</TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <div className="px-4 py-1.5 rounded-full border bg-emerald-500/10 border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                              Delivered
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <span className="text-sm font-bold text-white">₦{item.subtotal?.toLocaleString()}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-20 space-y-6">
                  <div className="w-20 h-20 rounded-full bg-white/5 border border-dashed border-white/10 flex items-center justify-center mx-auto">
                    <ShoppingBag className="w-10 h-10 text-muted-foreground/20" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-headline font-bold text-white">No sales yet</h3>
                    <p className="text-muted-foreground">Orders for your products will appear here in real-time.</p>
                  </div>
                </div>
              )}
            </GlassCard>
          </div>

          {/* Sidebar Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <GlassCard className="p-8 border-white/10 space-y-8 bg-white/5 backdrop-blur-3xl">
              <h3 className="text-xl font-headline font-bold text-white">Sales Summary</h3>

              <div className="space-y-6">
                <div className="flex justify-between items-center group">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                    <span className="text-sm font-bold text-muted-foreground group-hover:text-white transition-colors">Total Revenue</span>
                  </div>
                  <span className="text-xl font-bold text-primary neon-text-glow">₦{totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center group">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20"></div>
                    <span className="text-sm font-bold text-muted-foreground group-hover:text-white transition-colors">Items Sold</span>
                  </div>
                  <span className="text-lg font-bold text-white">{orderItems?.length || 0}</span>
                </div>
              </div>

              {/* Donut Chart */}
              <div className="relative h-[220px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={summaryData.length > 0 ? summaryData : [{ name: 'Empty', value: 1, color: 'rgba(255,255,255,0.05)' }]}
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
                      {summaryData.length === 0 && <Cell fill="rgba(255,255,255,0.05)" stroke="none" />}
                    </Pie>
                    <ReTooltip 
                      contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(239,26,184,0.3)', borderRadius: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <p className="text-xl font-bold text-white">{orderItems?.length || 0}</p>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Total</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-white/5">
                <p className="text-[10px] text-muted-foreground text-center leading-relaxed">
                  Real-time sales tracking helps you manage inventory and optimize your pricing strategy.
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </VendorShell>
  )
}
