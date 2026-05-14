
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
  Pencil,
  Trash2,
  FileSpreadsheet,
  Zap,
  MoreVertical,
  AlertCircle
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { collection, query, where, deleteDoc, doc } from 'firebase/firestore'
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase'
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function ManageProductsPage() {
  const { user, isProfileLoading } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = React.useState("")

  const productsQuery = useMemoFirebase(() => {
    if (!user?.uid) return null
    return query(collection(db, "products"), where("vendorOwnerId", "==", user.uid))
  }, [db, user?.uid])

  const { data: products, isLoading, error } = useCollection(productsQuery)

  const filteredProducts = React.useMemo(() => {
    if (!products) return []
    return products.filter(p => 
      p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [products, searchQuery])

  const handleDelete = async (productId: string) => {
    try {
      await deleteDoc(doc(db, "products", productId))
      toast({ title: "Product Removed", description: "The item has been deleted from your catalog." })
    } catch (err) {
      toast({ variant: "destructive", title: "Deletion Failed" })
    }
  }

  if (isProfileLoading || !user) return <VendorShell><div className="flex items-center justify-center h-[60vh]"><Loader2 className="w-12 h-12 text-primary animate-spin" /></div></VendorShell>

  const hasIndexError = error?.message?.toLowerCase().includes('index') || error?.code === 'failed-precondition'

  if (hasIndexError) {
    return (
      <VendorShell>
        <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-6 text-center max-w-md mx-auto p-6">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
            <Database className="w-10 h-10 text-amber-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-headline font-bold text-white uppercase tracking-tight">Index Required</h2>
            <p className="text-muted-foreground text-sm">Your database needs an index to filter products for your specific merchant ID.</p>
          </div>
          <Button asChild className="bg-amber-500 hover:bg-amber-600 text-black font-bold h-14 px-8 rounded-2xl w-full shadow-lg">
            <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer">Activate Index Node</a>
          </Button>
        </div>
      </VendorShell>
    )
  }

  return (
    <VendorShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Active Inventory</h1>
          <div className="flex gap-4">
             <Link href="/vendor/import">
               <Button variant="outline" className="rounded-2xl border-white/10 h-12 px-6 hover:bg-white/5 font-bold uppercase tracking-widest text-[10px]">
                 <FileSpreadsheet className="mr-2 w-4 h-4" /> Bulk Import
               </Button>
             </Link>
             <Link href="/vendor/add-product">
               <Button className="glow-button rounded-2xl h-12 bg-primary px-8 group font-bold">
                 <Plus className="mr-2 w-4 h-4" /> Add Item
               </Button>
             </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <div className="relative group w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl h-14 pl-14 pr-6 text-sm focus:border-primary/50 transition-all placeholder:text-muted-foreground/40" 
                placeholder="Search catalog ID, menu item, or category..." 
              />
            </div>

            <GlassCard className="p-0 border-white/10 bg-white/5 backdrop-blur-3xl overflow-hidden min-h-[400px]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-40 gap-4">
                  <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Retrieving Inventory...</p>
                </div>
              ) : filteredProducts.length > 0 ? (
                <Table>
                  <TableHeader className="bg-white/5">
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-[10px] font-bold uppercase py-6 pl-8">Listing</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase py-6">Price</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase py-6">Stock</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase py-6 text-center">Status</TableHead>
                      <TableHead className="text-[10px] font-bold uppercase py-6 text-right pr-8">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((item) => (
                      <TableRow key={item.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                        <TableCell className="pl-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10 shrink-0 bg-black/20 shadow-inner">
                              <Image src={item.imageUrl || `https://picsum.photos/seed/${item.id}/100/100`} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform" />
                            </div>
                            <div className="min-w-0">
                               <p className="text-sm font-bold text-white group-hover:text-primary transition-colors truncate">{item.name}</p>
                               <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">{item.category}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm font-bold text-white/80">₦{item.price.toLocaleString()}</TableCell>
                        <TableCell className="text-sm font-bold text-white/80">{item.stock}</TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <div className={cn(
                              "px-5 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest",
                              item.stock <= (item.lowStockThreshold || 0) ? "bg-amber-500/10 border-amber-500/20 text-amber-400" : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                            )}>
                              {item.stock <= 0 ? "Out of Stock" : item.stock <= (item.lowStockThreshold || 0) ? "Low Stock" : "Active"}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                           <div className="flex items-center justify-end gap-2">
                              <Link href={`/vendor/products/${item.id}/edit`}>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 hover:bg-primary/20 transition-all">
                                  <Pencil className="w-4 h-4 text-muted-foreground" />
                                </Button>
                              </Link>
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 hover:bg-rose-500/20 transition-all">
                                    <Trash2 className="w-4 h-4 text-muted-foreground" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-card border-white/10">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-white font-headline">Delete item from catalog?</AlertDialogTitle>
                                    <AlertDialogDescription className="text-muted-foreground">This will permanently remove <strong>{item.name}</strong> from the marketplace registry.</AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="border-white/10 hover:bg-white/5 text-white">Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-rose-500 hover:bg-rose-600 text-white">Confirm Removal</AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                           </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center space-y-6 p-20">
                  <div className="w-20 h-20 rounded-full bg-white/5 border border-dashed border-white/10 flex items-center justify-center mx-auto">
                    <Package className="w-10 h-10 text-muted-foreground/20" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-headline font-bold text-white">Catalog Empty</h3>
                    <p className="text-muted-foreground text-sm">Start building your campus menu by adding items or using the bulk ingester.</p>
                  </div>
                  <div className="flex justify-center gap-4">
                    <Link href="/vendor/import"><Button variant="outline" className="rounded-xl border-white/10 h-12 px-8">Bulk Import</Button></Link>
                    <Link href="/vendor/add-product"><Button className="rounded-xl bg-primary h-12 px-8 font-bold">Add Item</Button></Link>
                  </div>
                </div>
              )}
            </GlassCard>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <GlassCard className="p-8 border-white/10 space-y-8 bg-black/20">
              <h3 className="text-lg font-headline font-bold text-white flex items-center gap-2"><Zap className="w-5 h-5 text-primary" /> Catalog Status</h3>
              <div className="space-y-6 border-t border-white/5 pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Global Listings</span>
                  <span className="text-xl font-bold text-white">{products?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Replenish Alerts</span>
                  <span className="text-xl font-bold text-amber-500">{products?.filter(p => p.stock <= (p.lowStockThreshold || 0) && p.stock > 0).length || 0}</span>
                </div>
                <Link href="/vendor/import" className="block pt-4">
                   <Button variant="outline" className="w-full h-12 rounded-xl border-primary/20 bg-primary/5 text-primary text-[10px] font-bold uppercase">Open Bulk Ingester</Button>
                </Link>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </VendorShell>
  )
}
