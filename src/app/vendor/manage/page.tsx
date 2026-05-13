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
  Plus,
  Package,
  Loader2,
  Database,
  TrendingUp
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { collection, query, where } from 'firebase/firestore'
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase'

export default function ManageProductsPage() {
  const { user, isProfileLoading } = useUser()
  const db = useFirestore()

  // 1. Fetch Merchant Products
  const productsQuery = useMemoFirebase(() => {
    if (!user?.uid) return null
    return query(
      collection(db, "products"),
      where("vendorOwnerId", "==", user.uid)
    )
  }, [db, user?.uid])

  const { data: products, isLoading, error } = useCollection(productsQuery)

  // 2. Early return for auth
  if (isProfileLoading || !user) {
    return (
      <VendorShell>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </div>
      </VendorShell>
    )
  }

  // 3. Handle specific Firestore index errors
  const hasIndexError = error?.message?.toLowerCase().includes('index') || error?.code === 'failed-precondition'

  if (hasIndexError) {
    return (
      <VendorShell>
        <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6 text-center max-w-md mx-auto p-6">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <Database className="w-10 h-10 text-amber-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-headline font-bold text-white uppercase tracking-tight">Inventory Index Required</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Your database needs an index to filter products for your specific merchant ID.
            </p>
          </div>
          <Button asChild className="bg-amber-500 hover:bg-amber-600 text-black font-bold h-14 px-8 rounded-2xl w-full shadow-lg">
            <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer">
              <TrendingUp className="mr-2 w-4 h-4" /> Resolve in Console
            </a>
          </Button>
        </div>
      </VendorShell>
    )
  }

  return (
    <VendorShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Manage Products</h1>
          <Link href="/vendor/add-product">
            <Button className="glow-button rounded-2xl h-12 bg-primary px-8 group font-bold">
              <Plus className="mr-2 w-4 h-4" /> Add New Product
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="relative group w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 pl-14 pr-6 text-sm focus:border-primary/50 transition-all placeholder:text-muted-foreground/40" 
                placeholder="Search your inventory..." 
              />
            </div>

            <GlassCard className="p-0 border-white/10 bg-white/5 backdrop-blur-3xl overflow-hidden min-h-[400px] flex flex-col justify-center">
              {isLoading ? (
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Retrieving Inventory...</p>
                </div>
              ) : products && products.length > 0 ? (
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground pl-8">Listing</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground">Category</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground">Price (₦)</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground">Stock</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground text-center">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((item) => (
                      <TableRow key={item.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                        <TableCell className="pl-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-black/20">
                              <Image src={item.imageUrl || `https://picsum.photos/seed/${item.id}/100/100`} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform" />
                            </div>
                            <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{item.name}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{item.category}</TableCell>
                        <TableCell className="text-sm font-bold text-white/80">₦{item.price.toLocaleString()}</TableCell>
                        <TableCell className="text-sm font-bold text-white/80">{item.stock}</TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <div className={cn(
                              "px-5 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest",
                              item.stock <= (item.lowStockThreshold || 0)
                                ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                                : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            )}>
                              {item.stock <= 0 ? "Out of Stock" : item.stock <= (item.lowStockThreshold || 0) ? "Low Stock" : "Active"}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center space-y-6 p-12">
                  <Package className="w-16 h-16 text-muted-foreground/20 mx-auto" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-headline font-bold text-white">No products listed</h3>
                    <p className="text-muted-foreground text-sm">Start building your campus menu by adding items.</p>
                  </div>
                  <Link href="/vendor/add-product">
                    <Button variant="outline" className="rounded-xl border-white/10 h-12 px-8">Add First Product</Button>
                  </Link>
                </div>
              )}
            </GlassCard>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <GlassCard className="p-8 border-white/10 space-y-8 bg-black/20">
              <h3 className="text-lg font-headline font-bold text-white">Merchant Summary</h3>
              <div className="space-y-6 border-t border-white/5 pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Listings</span>
                  <span className="text-xl font-bold text-white">{products?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Low Inventory</span>
                  <span className="text-xl font-bold text-amber-500">
                    {products?.filter(p => p.stock <= (p.lowStockThreshold || 0) && p.stock > 0).length || 0}
                  </span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </VendorShell>
  )
}
