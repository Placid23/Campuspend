
"use client"

import * as React from "react"
import { VendorShell } from "@/components/layout/VendorShell"
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
  Loader2
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { collection, query, where } from 'firebase/firestore'
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase'

export default function VendorDashboardPage() {
  const { user, profile } = useUser()
  const db = useFirestore()

  const productsQuery = useMemoFirebase(() => {
    if (!user) return null
    return query(collection(db, "products"), where("vendorOwnerId", "==", user.uid))
  }, [db, user])

  const { data: products, isLoading: productsLoading } = useCollection(productsQuery)

  return (
    <VendorShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-headline font-bold text-white">
              Welcome back, <span className="text-primary neon-text-glow">{profile?.name || 'Vendor'}!</span>
            </h1>
            <p className="text-muted-foreground text-sm">Here's your sales overview and recent activity.</p>
          </div>
          <Link href="/vendor/add-product">
            <Button className="glow-button rounded-2xl h-12 bg-primary px-8 group">
              <Plus className="mr-2 w-4 h-4" /> Add New Product
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-12 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <GlassCard className="p-6 border-white/5 hover:border-primary/20 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Sales</p>
                  <div className="p-2 rounded-lg bg-white/5 text-primary">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-white">Rs. 0</h3>
                  <p className="text-[10px] text-muted-foreground font-bold">Waiting for first order</p>
                </div>
              </GlassCard>

              <GlassCard className="p-6 border-white/5 hover:border-primary/20 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Orders</p>
                  <div className="p-2 rounded-lg bg-white/5 text-secondary">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-white">0</h3>
                  <p className="text-[10px] text-muted-foreground font-bold">New Ecosystem Active</p>
                </div>
              </GlassCard>

              <GlassCard className="p-6 border-white/5 hover:border-primary/20 transition-all">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Active Products</p>
                  <div className="p-2 rounded-lg bg-white/5 text-blue-400">
                    <Box className="w-4 h-4" />
                  </div>
                </div>
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-white">
                    {productsLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : products?.length || 0}
                  </h3>
                  <p className="text-[10px] text-emerald-400 font-bold">Inventory Synchronized</p>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </VendorShell>
  )
}
