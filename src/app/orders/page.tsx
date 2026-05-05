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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { 
  ShoppingBag,
  ChevronRight,
  Loader2,
  Calendar,
  Receipt,
  Download,
  Info,
  ExternalLink,
  ShieldCheck,
  CreditCard
} from "lucide-react"
import Link from "next/link"
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase'
import { format } from 'date-fns'
import { cn } from "@/lib/utils"

export default function OrderHistoryPage() {
  const { user } = useUser()
  const db = useFirestore()
  
  const [selectedOrder, setSelectedOrder] = React.useState<any>(null)
  const [orderDetails, setOrderDetails] = React.useState<any[]>([])
  const [loadingDetails, setLoadingDetails] = React.useState(false)

  // Fetch real orders from Firestore subcollection
  const ordersQuery = useMemoFirebase(() => {
    if (!user) return null
    return query(
      collection(db, "users", user.uid, "orders"),
      orderBy("orderDate", "desc")
    )
  }, [db, user])

  const { data: orders, isLoading } = useCollection(ordersQuery)

  const handleOrderClick = async (order: any) => {
    if (!user) return
    setSelectedOrder(order)
    setLoadingDetails(true)
    try {
      const itemsRef = collection(db, "users", user.uid, "orders", order.id, "orderItems")
      const snap = await getDocs(itemsRef)
      const items = snap.docs.map(doc => doc.data())
      setOrderDetails(items)
    } catch (err) {
      console.error("Failed to fetch items", err)
    } finally {
      setLoadingDetails(false)
    }
  }

  return (
    <DashboardShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Track <span className="text-primary neon-text-glow">Logs</span></h1>
            <p className="text-muted-foreground text-sm max-w-xl">Purchase-Based Logging (PBL) provides automatic synchronization between orders and expenditure nodes.</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary/5 border border-primary/20 text-primary text-[10px] font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" /> PBL Synced
          </div>
        </div>

        <GlassCard className="p-0 border-white/10 bg-white/5 backdrop-blur-3xl overflow-hidden min-h-[400px] flex flex-col justify-center">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4 py-20">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Retrieving PBL Records...</p>
            </div>
          ) : orders && orders.length > 0 ? (
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-[10px] font-bold uppercase py-6 pl-8">Order ID</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase py-6">Timestamp</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase py-6">Items</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase py-6">Total (₦)</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase py-6 text-center">Status</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase py-6 text-right pr-8">Receipt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow 
                    key={order.id} 
                    onClick={() => handleOrderClick(order)}
                    className="border-white/5 hover:bg-white/5 transition-colors group cursor-pointer"
                  >
                    <TableCell className="pl-8 py-6 font-bold text-sm text-white/80 group-hover:text-primary transition-colors">
                      {order.id}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(order.orderDate), 'MMM dd, h:mm a')}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {order.itemCount || 1} units
                    </TableCell>
                    <TableCell className="font-bold text-sm text-white">
                      ₦{order.totalAmount?.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <div className={cn(
                          "px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest",
                          order.status === 'placed' ? "bg-amber-500/10 border-amber-500/30 text-amber-500" : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                        )}>
                          {order.status || 'Delivered'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                       <Button variant="ghost" size="icon" className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 group-hover:bg-primary/20 transition-all">
                          <Receipt className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                       </Button>
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
                <h3 className="text-xl font-headline font-bold text-white">No logs recorded</h3>
                <p className="text-muted-foreground">Transactions from campus vendors will appear here automatically.</p>
              </div>
              <Link href="/vendors">
                <Button variant="outline" className="rounded-xl border-white/10">Browse Marketplace</Button>
              </Link>
            </div>
          )}
        </GlassCard>

        {/* Receipt Dialog */}
        <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
          <DialogContent className="bg-card border-white/10 max-w-2xl overflow-hidden p-0 rounded-[2.5rem]">
            <div className="p-8 space-y-8 max-h-[85vh] overflow-y-auto scrollbar-hide">
              <DialogHeader>
                <div className="flex justify-between items-start mb-6">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Transaction Detail</p>
                    <DialogTitle className="text-3xl font-headline font-bold text-white">Digital Receipt</DialogTitle>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <Receipt className="w-6 h-6 text-primary" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                      <p className="text-[8px] font-bold uppercase text-muted-foreground">Order ID</p>
                      <p className="text-xs font-mono font-bold text-white truncate">{selectedOrder?.id}</p>
                   </div>
                   <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                      <p className="text-[8px] font-bold uppercase text-muted-foreground">Timestamp</p>
                      <p className="text-xs font-bold text-white">{selectedOrder && format(new Date(selectedOrder.orderDate), 'MMM dd, yyyy HH:mm')}</p>
                   </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground border-b border-white/5 pb-2">Purchase Breakdown</h4>
                {loadingDetails ? (
                  <div className="py-10 flex flex-col items-center gap-3">
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    <p className="text-[10px] font-bold uppercase text-muted-foreground">Scanning Logs...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orderDetails.map((item, i) => (
                      <div key={i} className="flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                            {item.quantity}x
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white/90">{item.name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-tighter">Unit: ₦{item.unitPrice?.toLocaleString()}</p>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-white">₦{item.subtotal?.toLocaleString()}</p>
                      </div>
                    ))}
                    <div className="pt-6 mt-6 border-t border-dashed border-white/10 space-y-4">
                       <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
                          <span>Subtotal</span>
                          <span>₦{(selectedOrder?.totalAmount * 0.97).toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between items-center text-sm font-medium text-muted-foreground">
                          <span>Tax/Service Fee</span>
                          <span>₦{(selectedOrder?.totalAmount * 0.03).toLocaleString()}</span>
                       </div>
                       <div className="flex justify-between items-center pt-2">
                          <span className="text-lg font-headline font-bold text-white">Grand Total</span>
                          <span className="text-2xl font-headline font-bold text-primary">₦{selectedOrder?.totalAmount?.toLocaleString()}</span>
                       </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 space-y-4">
                <div className="p-5 rounded-3xl bg-emerald-500/5 border border-emerald-500/20 flex gap-4 items-center">
                   <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                      <CreditCard className="w-5 h-5" />
                   </div>
                   <div className="space-y-1">
                      <p className="text-[10px] font-bold uppercase text-emerald-400">Payment Confirmed</p>
                      <p className="text-xs text-muted-foreground">Deducted from Digital Wallet. PBL Node successfully generated.</p>
                   </div>
                </div>
                <Button className="w-full h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 font-bold uppercase tracking-widest text-xs">
                  <Download className="w-4 h-4 mr-2" /> Download Log
                </Button>
              </div>
            </div>
            <div className="bg-primary/10 p-4 text-center border-t border-white/5">
                <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-primary/60">CafePay Wallet • Secure Transaction Hash: {selectedOrder?.id?.split('-')[1]}</p>
            </div>
          </DialogContent>
        </Dialog>

        {/* Info Footer */}
        <div className="text-center py-12 border-t border-white/5 space-y-4">
           <div className="flex justify-center gap-8">
              <div className="text-center">
                 <p className="text-2xl font-bold text-white">{orders?.length || 0}</p>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Logs</p>
              </div>
              <div className="text-center">
                 <p className="text-2xl font-bold text-white">₦{orders?.reduce((sum, o) => sum + (o.totalAmount || 0), 0).toLocaleString()}</p>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Volume</p>
              </div>
           </div>
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">© 2024 CafePay Wallet. Academic Prototype v4.1</p>
        </div>

      </div>
    </DashboardShell>
  )
}
