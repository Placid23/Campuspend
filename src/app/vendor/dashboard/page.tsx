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
  AlertTriangle,
  ArrowUpRight,
  Package,
  Database
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { collection, query, where, limit, orderBy, collectionGroup } from 'firebase/firestore'
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase'

export default function VendorDashboardPage() {
  const { user, profile, isProfileLoading } = useUser()
  const db = useFirestore()

  // 1. Fetch Merchant Products
  const productsQuery = useMemoFirebase(() => {
    if (!user?.uid) return null
    return query(collection(db, "products"), where("vendorOwnerId", "==", user.uid), limit(50))
  }, [db, user?.uid])

  // 2. Fetch Merchant Sales (Collection Group)
  // Simplified query to reduce index friction
  const itemsQuery = useMemoFirebase(() => {
    if (!user?.uid) return null
    return query(
      collectionGroup(db, "orderItems"), 
      where("vendorOwnerId", "==", user.uid),
      limit(20)
    )
  }, [db, user?.uid])

  const { data: products, isLoading: productsLoading } = useCollection(productsQuery)
  const { data: orderItems, error: queryError, isLoading: itemsLoading } = useCollection(itemsQuery)

  const totalSales = React.useMemo(() => {
    return orderItems?.reduce((sum, item) => sum + (item.subtotal || 0), 0) || 0
  }, [orderItems])

  const pendingCount = orderItems?.filter(i => !i.status || i.status === 'placed' || i.status === 'preparing').length || 0

  // 3. Robust Error Handling (Before Loading Spinner)
  const hasIndexError = queryError?.message?.toLowerCase().includes('index') || queryError?.code === 'failed-precondition'

  if (hasIndexError) {
    return (
      <VendorShell>
        <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-8 text-center max-w-lg mx-auto p-6 animate-in fade-in zoom-in duration-500">
          <div className="relative">
            <div className="absolute -inset-4 bg-amber-500/20 blur-2xl rounded-full opacity-50 animate-pulse"></div>
            <div className="w-24 h-24 rounded-3xl bg-amber-500/10 flex items-center justify-center border-2 border-amber-500/30 relative z-10">
              <Database className="w-12 h-12 text-amber-500" />
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-3xl font-headline font-bold text-white tracking-tight">System Activation Required</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              To track your merchant sales in real-time, the <strong>CafePay Intelligent Engine</strong> requires a cross-collection index. This is a one-time setup step for your project.
            </p>
          </div>
          <div className="w-full space-y-4 pt-4">
            <Button asChild className="w-full bg-amber-500 hover:bg-amber-600 text-black font-extrabold h-16 rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all">
              <a href="https://console.firebase.google.com/v1/r/project/campusspend-733ab/firestore/indexes?create_exemption=Cl9wcm9qZWN0cy9jYW1wdXNzcGVuZC03MzNhYi9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvb3JkZXJJdGVtcy9maWVsZHMvdmVuZG9yT3duZXJJZBACGhEKDXZlbmRvck93bmVySWQQAQ" target="_blank" rel="noopener noreferrer">
                <TrendingUp className="mr-2 w-5 h-5" /> Execute Index Setup
              </a>
            </Button>
            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.2em] opacity-60">Estimated activation time: 90 seconds</p>
          </div>
        </div>
      </VendorShell>
    )
  }

  // 4. Loading State
  if (isProfileLoading || itemsLoading || productsLoading) {
    return (
      <VendorShell>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="flex flex-col items-center gap-6">
             <Loader2 className="w-12 h-12 text-primary animate-spin" />
             <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground animate-pulse">Syncing Merchant HQ...</p>
          </div>
        </div>
      </VendorShell>
    )
  }

  return (
    <VendorShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-headline font-bold">
              Store <span className="text-primary neon-text-glow">Overview</span>
            </h1>
            <p className="text-muted-foreground text-sm">Real-time performance tracking for {profile?.name}.</p>
          </div>
          <div className="flex gap-4">
             <Link href="/vendor/add-product">
               <Button className="glow-button rounded-2xl h-12 bg-primary px-8 group font-bold">
                 <Plus className="mr-2 w-4 h-4" /> Add Product
               </Button>
             </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <GlassCard className="p-6 bg-emerald-500/5 border-emerald-500/20 group hover:border-emerald-500/40 transition-all">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Revenue</p>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform"><DollarSign className="w-4 h-4" /></div>
            </div>
            <h3 className="text-3xl font-bold">₦{totalSales.toLocaleString()}</h3>
          </GlassCard>

          <GlassCard className="p-6 bg-primary/5 border-primary/20 group hover:border-primary/40 transition-all">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Pending Orders</p>
              <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform"><Clock className="w-4 h-4" /></div>
            </div>
            <h3 className="text-3xl font-bold">{pendingCount}</h3>
          </GlassCard>

          <GlassCard className="p-6 bg-secondary/5 border-secondary/20 group hover:border-secondary/40 transition-all">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Items Sold</p>
              <div className="p-2 rounded-lg bg-secondary/10 text-secondary group-hover:scale-110 transition-transform"><ShoppingBag className="w-4 h-4" /></div>
            </div>
            <h3 className="text-3xl font-bold">{orderItems?.length || 0}</h3>
          </GlassCard>

          <GlassCard className="p-6 bg-muted/50 border-border group hover:border-primary/20 transition-all">
            <div className="flex justify-between items-start mb-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Active Catalog</p>
              <div className="p-2 rounded-lg bg-muted text-muted-foreground group-hover:scale-110 transition-transform"><Package className="w-4 h-4" /></div>
            </div>
            <h3 className="text-3xl font-bold">{products?.length || 0}</h3>
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <GlassCard className="p-8 border-border">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-headline font-bold flex items-center gap-3">
                <TrendingUp className="text-primary w-5 h-5" /> Recent Orders
              </h3>
              <Link href="/vendor/orders">
                <Button variant="ghost" size="sm" className="text-primary text-[10px] font-bold uppercase">Manage All</Button>
              </Link>
            </div>
            <div className="space-y-4">
              {orderItems?.slice(0, 5).map((item, i) => (
                <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-accent/20 border border-border hover:border-primary/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                      <ShoppingBag className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold truncate max-w-[150px]">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{item.status || 'placed'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold">₦{item.subtotal?.toLocaleString()}</p>
                  </div>
                </div>
              ))}
              {(!orderItems || orderItems.length === 0) && (
                <div className="py-20 text-center space-y-4">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground/20 mx-auto" />
                  <p className="text-[10px] text-muted-foreground uppercase font-bold">No transactions logged yet</p>
                </div>
              )}
            </div>
          </GlassCard>

          <GlassCard className="p-8 border-border flex flex-col justify-center items-center text-center space-y-8 bg-gradient-to-b from-transparent to-primary/5">
            <div className="relative">
              <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-50"></div>
              <div className="relative w-24 h-24 rounded-3xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                <TrendingUp className="w-12 h-12 text-primary" />
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="text-2xl font-headline font-bold">Scale Your Business</h3>
              <p className="text-muted-foreground text-sm max-w-sm">Every purchase is automatically logged and analyzed by the CafePay AI Engine. More products mean more data points for your growth.</p>
            </div>
            <Link href="/vendor/add-product" className="w-full">
              <Button className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-sm font-bold uppercase tracking-widest shadow-lg">
                Add New Catalog Item <ArrowUpRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </GlassCard>
        </div>
      </div>
    </VendorShell>
  )
}
