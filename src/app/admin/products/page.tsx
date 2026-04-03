"use client"

import * as React from "react"
import { AdminShell } from "@/components/layout/AdminShell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  Pencil, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Package,
  MoreHorizontal,
  Loader2,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore'
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
import Image from "next/image"

export default function AdminManageProductsPage() {
  const db = useFirestore()
  const { toast } = useToast()
  
  // State for UI filters
  const [searchQuery, setSearchQuery] = React.useState("")
  const [categoryFilter, setCategoryFilter] = React.useState("all")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [sortFilter, setSortFilter] = React.useState("newest")

  // 1. Fetch Products
  const productsQuery = useMemoFirebase(() => collection(db, "products"), [db])
  const { data: allProducts, isLoading } = useCollection(productsQuery)

  // 2. Filter & Sort Logic
  const filteredProducts = React.useMemo(() => {
    if (!allProducts) return []
    
    let result = [...allProducts]

    // Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p => 
        p.name?.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q)
      )
    }

    // Category
    if (categoryFilter !== 'all') {
      result = result.filter(p => p.category?.toLowerCase() === categoryFilter)
    }

    // Status
    if (statusFilter !== 'all') {
      result = result.filter(p => {
        const stock = p.stock || 0
        const lowThreshold = p.lowStockThreshold || 5
        if (statusFilter === 'active') return stock > lowThreshold
        if (statusFilter === 'low') return stock <= lowThreshold && stock > 0
        if (statusFilter === 'out') return stock <= 0
        return true
      })
    }

    // Sort
    result.sort((a, b) => {
      if (sortFilter === 'price-low') return (a.price || 0) - (b.price || 0)
      if (sortFilter === 'price-high') return (b.price || 0) - (a.price || 0)
      if (sortFilter === 'stock-low') return (a.stock || 0) - (b.stock || 0)
      if (sortFilter === 'stock-high') return (b.stock || 0) - (a.stock || 0)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return result
  }, [allProducts, searchQuery, categoryFilter, statusFilter, sortFilter])

  // 3. Actions
  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteDoc(doc(db, "products", productId))
      toast({
        title: "Product Removed",
        description: "The item has been deleted from the global catalog."
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove product."
      })
    }
  }

  const handleToggleVisibility = async (productId: string, currentStatus: boolean) => {
    try {
      await updateDoc(doc(db, "products", productId), {
        isActive: !currentStatus,
        updatedAt: serverTimestamp()
      })
      toast({
        title: "Visibility Updated",
        description: `Product is now ${!currentStatus ? 'Visible' : 'Hidden'} in marketplace.`
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update product visibility."
      })
    }
  }

  return (
    <AdminShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        
        {/* Breadcrumb / Path */}
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
          <Package className="w-3 h-3" /> Dashboard / <span className="text-white/80">Global Inventory</span>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl font-headline font-bold text-white tracking-tight">Manage Products</h1>

        <GlassCard className="p-8 border-white/10 bg-black/20 backdrop-blur-3xl overflow-hidden relative space-y-8">
          
          {/* Filter Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-2xl px-6 focus:ring-primary/30">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/10">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="fast-food">Fast Food</SelectItem>
                <SelectItem value="drinks">Drinks</SelectItem>
                <SelectItem value="books">Books</SelectItem>
                <SelectItem value="stationery">Stationery</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-2xl px-6 focus:ring-primary/30">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/10">
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">In Stock</SelectItem>
                <SelectItem value="low">Low Stock</SelectItem>
                <SelectItem value="out">Out of Stock</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortFilter} onValueChange={setSortFilter}>
              <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-2xl px-6 focus:ring-primary/30">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/10">
                <SelectItem value="newest">Sort: Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="stock-low">Stock: Low to High</SelectItem>
                <SelectItem value="stock-high">Stock: High to Low</SelectItem>
              </SelectContent>
            </Select>

            <div className="relative group w-full">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 bg-white/5 border-white/10 rounded-2xl pl-14 pr-6 text-sm focus:border-primary/50 transition-all placeholder:text-muted-foreground/40"
              />
            </div>
          </div>

          {/* Data Table */}
          <div className="rounded-2xl border border-white/5 overflow-hidden min-h-[400px] flex flex-col justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center gap-4 py-20">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Scanning Inventory...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground pl-8">Product</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground">Category</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground">Stock</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground">Price</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground text-center">Status</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground text-right pr-8">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.map((product) => {
                    const stock = product.stock || 0
                    const lowThreshold = product.lowStockThreshold || 5
                    let statusLabel = "Active"
                    let statusColor = "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    
                    if (stock <= 0) {
                      statusLabel = "Out of Stock"
                      statusColor = "bg-rose-500/10 border-rose-500/20 text-rose-400"
                    } else if (stock <= lowThreshold) {
                      statusLabel = "Low Stock"
                      statusColor = "bg-amber-500/10 border-amber-500/20 text-amber-400"
                    }

                    return (
                      <TableRow key={product.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                        <TableCell className="pl-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-white/10 shrink-0">
                              <Image src={product.imageUrl || `https://picsum.photos/seed/${product.id}/100/100`} alt={product.name} fill className="object-cover" />
                            </div>
                            <span className="text-sm font-bold text-white group-hover:text-primary transition-colors truncate max-w-[200px]">{product.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground uppercase font-bold text-[10px] tracking-widest">{product.category}</TableCell>
                        <TableCell className="text-sm text-white/80">{product.stock}</TableCell>
                        <TableCell className="text-sm font-bold text-white/90">₦{product.price?.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex justify-center">
                            <div className={cn("px-5 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest", statusColor)}>
                              {statusLabel}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right pr-8">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleToggleVisibility(product.id, product.isActive ?? true)}
                              title={product.isActive === false ? "Show Product" : "Hide Product"}
                              className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/40 group/btn transition-all"
                            >
                              <MoreHorizontal className="w-4 h-4 text-muted-foreground group-hover/btn:text-primary" />
                            </Button>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 hover:bg-rose-500/20 hover:border-rose-500/40 group/btn transition-all">
                                  <Trash2 className="w-4 h-4 text-muted-foreground group-hover/btn:text-rose-500" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-card border-white/10">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-white font-headline">Delete product from catalog?</AlertDialogTitle>
                                  <AlertDialogDescription className="text-muted-foreground">
                                    This will permanently remove <strong>{product.name}</strong>. This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="border-white/10 hover:bg-white/5">Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteProduct(product.id)}
                                    className="bg-rose-500 hover:bg-rose-600 text-white"
                                  >
                                    Remove Product
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-20 space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                  <Package className="w-8 h-8 text-muted-foreground/20" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">No products found</h3>
                  <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms.</p>
                </div>
              </div>
            )}
          </div>

          {/* Table Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              Showing {filteredProducts.length} of {allProducts?.length || 0} products
            </p>
          </div>
        </GlassCard>

        {/* Footer */}
        <div className="text-center py-8 border-t border-white/5">
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">© 2024 CampusSpend. Global Logistics Engine.</p>
        </div>

      </div>
    </AdminShell>
  )
}
