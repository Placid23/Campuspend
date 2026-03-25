
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
  ChefHat,
  Pizza,
  BookOpen,
  Box
} from "lucide-react"
import { cn } from "@/lib/utils"

const products = [
  { name: "Wireless Bluetooth Headphones", sku: "ELEC-001", category: "Electronics", stock: 120, price: "₦3,500", status: "Active" },
  { name: "Cotton T-Shirt", sku: "APP-102", category: "Apparel", stock: 320, price: "₦750", status: "Active" },
  { name: "Gaming Laptop", sku: "ELEC-205", category: "Electronics", stock: 5, price: "₦100,000", status: "Out of Stock" },
  { name: "Organic Green Tea", sku: "FOOD-089", category: "Groceries", stock: 18, price: "₦500", status: "Low Stock" },
  { name: "Stainless Steel Water Bottle", sku: "ACC-150", category: "Accessories", stock: 50, price: "₦700", status: "Active" },
  { name: "Running Shoes", sku: "SHOES-233", category: "Footwear", stock: 0, price: "₦4,000", status: "Out of Stock" },
]

export default function AdminManageProductsPage() {
  return (
    <AdminShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        
        {/* Breadcrumb / Path */}
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
          <Box className="w-3 h-3" /> Dashboard / <span className="text-white/80">Manage Products</span>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl font-headline font-bold text-white tracking-tight">Manage Products</h1>

        <GlassCard className="p-8 border-white/10 bg-black/20 backdrop-blur-3xl overflow-hidden relative space-y-8">
          
          {/* Filter Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Select defaultValue="total">
              <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-2xl px-6 focus:ring-primary/30">
                <div className="flex items-center gap-3">
                  <Package className="w-4 h-4 text-primary" />
                  <SelectValue placeholder="Total Products" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-card border-white/10">
                <SelectItem value="total">Total Products</SelectItem>
                <SelectItem value="active">Active Products</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all-cat">
              <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-2xl px-6 focus:ring-primary/30">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/10">
                <SelectItem value="all-cat">All Categories</SelectItem>
                <SelectItem value="elec">Electronics</SelectItem>
                <SelectItem value="food">Groceries</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all-stat">
              <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-2xl px-6 focus:ring-primary/30">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/10">
                <SelectItem value="all-stat">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="out">Out of Stock</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-2xl px-6 focus:ring-primary/30">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/10">
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-2xl px-6 focus:ring-primary/30">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent className="bg-card border-white/10">
                <SelectItem value="stock-low">Stock: Low to High</SelectItem>
                <SelectItem value="stock-high">Stock: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Row 2 */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Button className="h-12 px-8 rounded-2xl bg-gradient-to-r from-primary to-secondary font-bold shadow-[0_0_20px_rgba(239,26,184,0.3)] hover:opacity-90 transition-all flex gap-2 whitespace-nowrap">
              <Plus className="w-5 h-5" /> Add New Product
            </Button>

            <div className="relative flex-1 w-full group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search products..." 
                className="h-12 bg-white/5 border-white/10 rounded-2xl pl-14 pr-6 text-sm focus:border-primary/50 transition-all placeholder:text-muted-foreground/40"
              />
            </div>
          </div>

          {/* Data Table */}
          <div className="rounded-2xl border border-white/5 overflow-hidden">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground pl-8">Product Name</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground">SKU</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground">Category</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground">Stock</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground">Price</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground text-center">Status</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground text-right pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product, i) => (
                  <TableRow key={i} className="border-white/5 hover:bg-white/5 transition-colors group">
                    <TableCell className="pl-8 py-5 text-sm font-bold text-white/80 group-hover:text-primary transition-colors">{product.name}</TableCell>
                    <TableCell className="text-xs text-muted-foreground font-mono">{product.sku}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{product.category}</TableCell>
                    <TableCell className="text-sm text-white/80">{product.stock}</TableCell>
                    <TableCell className="text-sm font-bold text-white/90">{product.price}</TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <div className={cn(
                          "px-5 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest",
                          product.status === 'Active' 
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                            : product.status === 'Low Stock'
                            ? "bg-amber-500/10 border-amber-500/20 text-amber-400"
                            : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                        )}>
                          {product.status}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right pr-8">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/40 group/btn transition-all">
                          <Pencil className="w-4 h-4 text-muted-foreground group-hover/btn:text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 hover:bg-rose-500/20 hover:border-rose-500/40 group/btn transition-all">
                          <Trash2 className="w-4 h-4 text-muted-foreground group-hover/btn:text-rose-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 group/btn transition-all">
                          <MoreHorizontal className="w-4 h-4 text-muted-foreground group-hover/btn:text-white" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Table Footer / Pagination */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              Showing 1 to 8 of 350 entries
            </p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-10 w-10 rounded-xl text-muted-foreground hover:bg-white/5 border border-white/5">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button size="sm" className="h-10 w-10 rounded-xl bg-primary text-white font-bold shadow-[0_0_15px_rgba(239,26,184,0.4)]">1</Button>
              <Button variant="ghost" size="sm" className="h-10 w-10 rounded-xl text-muted-foreground hover:bg-white/5">2</Button>
              <Button variant="ghost" size="sm" className="h-10 w-10 rounded-xl text-muted-foreground hover:bg-white/5">3</Button>
              <Button variant="ghost" size="sm" className="h-10 w-10 rounded-xl text-muted-foreground hover:bg-white/5 border border-white/5">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* Floating Bottom Nav */}
        <div className="flex justify-center pt-8 pb-12">
           <GlassCard className="inline-flex gap-10 px-12 py-4 rounded-full border-white/10 bg-black/20 backdrop-blur-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)]">
              {[
                { label: "Burger", id: "burger", icon: ChefHat },
                { label: "Pizza", id: "pizza", icon: Pizza },
                { label: "Books", id: "books1", icon: BookOpen },
                { label: "Books", id: "books2", icon: Box }
              ].map((nav, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer opacity-60 hover:opacity-100 transition-all hover:scale-110">
                   <div className="w-10 h-10 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
                      <nav.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                   </div>
                   <span className="text-[8px] font-bold uppercase tracking-[0.2em]">{nav.label}</span>
                </div>
              ))}
           </GlassCard>
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-white/5">
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">© 2024 CampusSpend. All rights reserved.</p>
        </div>

      </div>
    </AdminShell>
  )
}
