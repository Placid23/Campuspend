"use client"

import * as React from "react"
import { VendorShell } from "@/components/layout/VendorShell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { 
  ShoppingBag, 
  Box, 
  Plus, 
  Loader2,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { collection, query, where, collectionGroup } from 'firebase/firestore'
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase'

export default function VendorDashboardPage() {
  const { user, profile, isProfileLoading } = useUser()
  const db = useFirestore()

  // 1. Define all hooks first (never after an early return)
  const productsQuery = useMemoFirebase(() => {
    if (!user) return null
    return query(collection(db, "products"), where("vendorOwnerId", "==", user.uid))
  }, [db, user?.uid])

  const itemsQuery = useMemoFirebase(() => {
    if (!user) return null
    return query(
      collectionGroup(db, "orderItems"), 
      where("vendorOwnerId", "==", user.uid)
    )
  }, [db, user?.uid])

  const { data: products, isLoading: productsLoading } = useCollection(productsQuery)
  const { data: orderItems, isLoading: itemsLoading } = useCollection(itemsQuery)

  // 2. Derive derived data
  const totalSales = React.useMemo(() => {
    return orderItems?.reduce((sum, item) => sum + item.subtotal, 0) || 0
  }, [orderItems])

  const pendingCount = orderItems?.filter(i => !i.status || i.status === 'placed' || i.status === 'preparing').length || 0

  // 3. Early return for UI state (loading/auth) after hooks are registered
  if (isProfileLoading || !user) {
    return (
      <VendorShell>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </VendorShell>
    )
  }

  return (
    <VendorShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-headline font-bold text-white">
              Welcome back, <span className="text-primary neon-text-glow">{profile?.name || 'Vendor'}!</span>
            </h1>
            <p className="text-muted-foreground text-sm">Managing your campus shop performance.</p>
          </div>
          <Link href="/vendor/add-product">
            <Button className="glow-button rounded-2xl h-12 bg-primary px-8 group">
              <Plus className="mr-2 w-4 h-4" /> Add New Product
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-12 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <GlassCard className="p-6 border-white/5 bg-gradient-to-br from-emerald-500/5 to-transparent">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Revenue</p>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">₦{totalSales.toLocaleString()}</h3>
              </GlassCard>

              <GlassCard className="p-6 border-white/5">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Items Sold</p>
                  <ShoppingBag className="w-4 h-4 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold text-white">{orderItems?.length || 0}</h3>
              </GlassCard>

              <GlassCard className="p-6 border-white/5 border-primary/20">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-primary">Pending Orders</p>
                  <Clock className="w-4 h-4 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-white">{pendingCount}</h3>
              </GlassCard>

              <GlassCard className="p-6 border-white/5">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Inventory</p>
                  <Box className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold text-white">{products?.length || 0}</h3>
              </GlassCard>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <GlassCard className="p-8 border-white/5 bg-white/5">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-headline font-bold">Recent Activity</h3>
                  <Link href="/vendor/orders">
                    <Button variant="link" className="text-primary text-[10px] font-bold uppercase tracking-widest p-0">View All</Button>
                  </Link>
                </div>
                <div className="space-y-4">
                  {orderItems?.slice(0, 5).map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-primary/20 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                          <ShoppingBag className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-sm font-bold">{item.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase font-medium">Status: {item.status || 'placed'}</p>
                        </div>
                      </div>
                      <p className="text-sm font-bold text-white">₦{item.subtotal.toLocaleString()}</p>
                    </div>
                  ))}
                  {(!orderItems || orderItems.length === 0) && (
                    <div className="py-12 text-center">
                      <ShoppingBag className="w-10 h-10 text-muted-foreground/20 mx-auto mb-2" />
                      <p className="text-[10px] text-muted-foreground uppercase font-bold">No sales recorded</p>
                    </div>
                  )}
                </div>
              </GlassCard>

              <GlassCard className="p-8 border-white/5 bg-white/5 flex flex-col justify-center items-center text-center space-y-6">
                <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <TrendingUp className="w-10 h-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-headline font-bold">Grow Your Shop</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">Add more items to your catalog to reach more students across the campus.</p>
                </div>
                <Link href="/vendor/add-product" className="w-full">
                  <Button className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 font-bold uppercase text-[10px] tracking-widest">Create Listing</Button>
                </Link>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </VendorShell>
  )
}
