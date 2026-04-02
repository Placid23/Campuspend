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
  ShoppingBag,
  Loader2,
  Clock,
  Play,
  CheckCircle2,
  Truck
} from "lucide-react"
import { cn } from "@/lib/utils"
import { collectionGroup, query, where, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase'
import { format } from 'date-fns'
import { useToast } from "@/hooks/use-toast"

export default function VendorOrdersPage() {
  const { user, isProfileLoading } = useUser()
  const db = useFirestore()
  const { toast } = useToast()

  // 1. Hooks first
  const itemsQuery = useMemoFirebase(() => {
    if (!user) return null
    return query(
      collectionGroup(db, "orderItems"),
      where("vendorOwnerId", "==", user.uid)
    )
  }, [db, user?.uid])

  const { data: orderItems, isLoading } = useCollection(itemsQuery)

  // 2. Status updater
  const updateStatus = async (itemPath: string, newStatus: string) => {
    try {
      const itemRef = doc(db, itemPath)
      await updateDoc(itemRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      })
      toast({
        title: "Status Updated",
        description: `Item marked as ${newStatus}.`,
      })
    } catch (error) {
      console.error("Failed to update status", error)
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not update order status.",
      })
    }
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'preparing': return { color: "bg-blue-500/10 text-blue-400 border-blue-500/20", label: "Preparing" }
      case 'ready': return { color: "bg-purple-500/10 text-purple-400 border-purple-500/20", label: "Ready" }
      case 'completed': return { color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", label: "Completed" }
      default: return { color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", label: "Placed" }
    }
  }

  // 3. Early return
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
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Order Lifecycle</h1>
          <Button variant="outline" className="border-white/10 rounded-xl h-12 px-6">
            <FileUp className="w-4 h-4 mr-2" /> Export Sales
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-12 space-y-6">
            <div className="relative group max-w-md">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary" />
              <Input placeholder="Search orders..." className="h-14 bg-white/5 border-white/10 rounded-2xl pl-14" />
            </div>

            <GlassCard className="p-0 border-white/10 bg-white/5 backdrop-blur-3xl overflow-hidden min-h-[400px]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-4">
                  <Loader2 className="w-10 h-10 text-primary animate-spin" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Syncing Merchant Data...</p>
                </div>
              ) : orderItems && orderItems.length > 0 ? (
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-[10px] font-bold uppercase py-6 pl-8">Item Details</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase py-6">Order ID</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase py-6">Quantity</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase py-6 text-center">Status</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase py-6 text-right pr-8">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orderItems.map((item) => {
                      const status = getStatusConfig(item.status)
                      return (
                        <TableRow key={item.id} className="border-white/5 hover:bg-white/5 transition-colors">
                          <TableCell className="pl-8 py-6">
                            <div className="space-y-0.5">
                              <p className="text-sm font-bold text-white">{item.name}</p>
                              <p className="text-[10px] text-muted-foreground">
                                {item.createdAt ? format(new Date(item.createdAt), 'MMM d, h:mm a') : 'N/A'}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs font-mono text-muted-foreground">{item.orderId?.substring(0, 12)}</TableCell>
                          <TableCell className="text-sm text-white/80">{item.quantity}x</TableCell>
                          <TableCell>
                            <div className="flex justify-center">
                              <div className={cn("px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest", status.color)}>
                                {status.label}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-right pr-8">
                            <div className="flex items-center justify-end gap-2">
                              {(!item.status || item.status === 'placed') && (
                                <Button size="sm" onClick={() => updateStatus(item.path, 'preparing')} className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 border border-blue-500/40 rounded-xl px-4 text-[10px] font-bold uppercase">
                                  Prepare
                                </Button>
                              )}
                              {item.status === 'preparing' && (
                                <Button size="sm" onClick={() => updateStatus(item.path, 'ready')} className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 border border-purple-500/40 rounded-xl px-4 text-[10px] font-bold uppercase">
                                  Ready
                                </Button>
                              )}
                              {item.status === 'ready' && (
                                <Button size="sm" onClick={() => updateStatus(item.path, 'completed')} className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/40 rounded-xl px-4 text-[10px] font-bold uppercase">
                                  Complete
                                </Button>
                              )}
                              {item.status === 'completed' && (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-4" />
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-40 space-y-6">
                  <ShoppingBag className="w-16 h-16 text-muted-foreground/20 mx-auto" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-headline font-bold text-white">No active orders</h3>
                    <p className="text-muted-foreground text-sm">When students purchase items, they will appear here.</p>
                  </div>
                </div>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </VendorShell>
  )
}
