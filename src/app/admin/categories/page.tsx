
"use client"

import * as React from "react"
import { AdminShell } from "@/components/layout/AdminShell"
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
  Pencil, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  CheckSquare,
  ChefHat,
  Pizza,
  BookOpen,
  Box
} from "lucide-react"
import { cn } from "@/lib/utils"

const categories = [
  { id: "#1", name: "Electronics", count: 128, status: "Active", actionStatus: "Active" },
  { id: "#2", name: "Apparel", count: 72, status: "Active", actionStatus: "Active" },
  { id: "#3", name: "Groceries", count: 54, status: "Active", actionStatus: "Active" },
  { id: "#4", name: "Footwear", count: 46, status: "Active", actionStatus: "Bad onog" },
  { id: "#5", name: "Accessories", count: 28, status: "Active", actionStatus: "Brcmeed" },
  { id: "#6", name: "Books", count: 22, status: "Active", actionStatus: "Boa proded" },
]

export default function AdminManageCategoriesPage() {
  return (
    <AdminShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        
        {/* Breadcrumb / Path */}
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
          <CheckSquare className="w-3 h-3" /> Manage / <span className="text-white/80">Categories Report</span>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl font-headline font-bold text-white tracking-tight">Manage Categories</h1>

        <GlassCard className="p-8 border-white/10 bg-black/20 backdrop-blur-3xl overflow-hidden relative space-y-8">
          
          {/* Action Row */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Button className="h-12 px-8 rounded-2xl bg-gradient-to-r from-primary to-secondary font-bold shadow-[0_0_20px_rgba(239,26,184,0.3)] hover:opacity-90 transition-all flex gap-2 whitespace-nowrap">
              <Plus className="w-5 h-5" /> Add Category
            </Button>

            <div className="relative flex-1 w-full group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search categories..." 
                className="h-12 bg-white/5 border-white/10 rounded-2xl pl-14 pr-6 text-sm focus:border-primary/50 transition-all placeholder:text-muted-foreground/40"
              />
            </div>
          </div>

          {/* Data Table */}
          <div className="rounded-2xl border border-white/5 overflow-hidden">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground pl-8 w-[100px]">ID</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground">Category Name</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground">Number of Products</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground text-center">Status</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category, i) => (
                  <TableRow key={i} className="border-white/5 hover:bg-white/5 transition-colors group">
                    <TableCell className="pl-8 py-5 text-sm font-bold text-white/60">{category.id}</TableCell>
                    <TableCell className="py-5 text-sm font-bold text-white/80 group-hover:text-primary transition-colors">{category.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{category.count}</TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <div className="px-5 py-1.5 rounded-full border bg-emerald-500/10 border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                          {category.status}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="pr-8">
                      <div className="flex items-center justify-center gap-4">
                        <Button 
                          variant="ghost" 
                          className={cn(
                            "h-8 px-4 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all",
                            category.actionStatus === 'Active' 
                              ? "bg-primary/10 border-primary/20 text-primary hover:bg-primary/20" 
                              : "bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20"
                          )}
                        >
                          {category.actionStatus}
                        </Button>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/40 group/btn transition-all">
                            <Pencil className="w-3.5 h-3.5 text-muted-foreground group-hover/btn:text-primary" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 hover:bg-rose-500/20 hover:border-rose-500/40 group/btn transition-all">
                            <Trash2 className="w-3.5 h-3.5 text-muted-foreground group-hover/btn:text-rose-500" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 group/btn transition-all">
                            <Plus className="w-3.5 h-3.5 text-muted-foreground group-hover/btn:text-white" />
                          </Button>
                        </div>
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
              Showing 1 to 6 of 6 entries
            </p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-white/5 border border-white/5">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button size="sm" className="h-8 w-8 rounded-lg bg-primary text-white font-bold shadow-[0_0_15px_rgba(239,26,184,0.4)]">1</Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-white/5">2</Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-white/5">3</Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-white/5 border border-white/5">
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
