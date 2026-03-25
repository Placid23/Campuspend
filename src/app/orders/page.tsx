"use client"

import * as React from "react"
import { DashboardShell } from "@/components/layout/Shell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  ShoppingBag,
  ChevronRight,
  Loader2,
  Calendar
} from "lucide-react"
import { collection, query, orderBy } from 'firebase/firestore'
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase'
import { format } from 'date-fns'

export default function OrderHistoryPage() {
  const { user } = useUser()
  const db = useFirestore()

  // Fetch real orders from Firestore subcollection
  const ordersQuery = useMemoFirebase(() => {
    if (!user) return null
    return query(
      collection(db, "users", user.uid, "orders"),
      orderBy("orderDate", "desc")
    )
  }, [db, user])

  const { data: orders, isLoading } = useCollection(ordersQuery)

  return (
    <DashboardShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
        
        <div className="space-y-2">
          <h1 className="text-4xl font-headline font-bold text-white neon-text-glow">Order History</h1>
          <p className="text-muted-foreground text-sm">Review your past purchases and tracked expenses.</p>
        </div>

        <GlassCard className="p-0 border-white/10 bg-white/5 backdrop-blur-3xl overflow-hidden min-h-[400px] flex flex-col justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4 py-20">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Retrieving Records...</p>
            </div>
          ) : orders && orders.length > 0 ? (
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground pl-8">Order ID</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground">Date</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground">Items</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground">Amount</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-center text-muted-foreground pr-8">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                    <TableCell className="pl-8 py-6 font-bold text-sm text-white/80 group-hover:text-primary transition-colors">
                      {order.id}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(order.orderDate), 'MMM dd, yyyy')}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {order.itemCount || 1} {order.itemCount === 1 ? 'item' : 'items'}
                    </TableCell>
                    <TableCell className="font-bold text-sm text-white">
                      ₦{order.totalAmount?.toLocaleString()}
                    </TableCell>
                    <TableCell className="pr-8">
                      <div className="flex justify-center">
                        <div className="px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                          {order.status || 'Delivered'}
                        </div>
                      </div>
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
                <h3 className="text-xl font-headline font-bold text-white">No orders yet</h3>
                <p className="text-muted-foreground">When you make a purchase, it will appear here.</p>
              </div>
              <Link href="/vendors">
                <Button variant="outline" className="rounded-xl border-white/10">Browse Marketplace</Button>
              </Link>
            </div>
          )}
        </GlassCard>

        {orders && orders.length > 0 && (
          <div className="flex justify-center pt-8 border-t border-white/5">
             <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
               Total orders tracked: {orders.length}
             </p>
          </div>
        )}
      </div>
    </DashboardShell>
  )
}