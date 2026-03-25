
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
  ChefHat,
  Pizza,
  BookOpen,
  Box,
  MoreVertical
} from "lucide-react"
import { cn } from "@/lib/utils"

const vendors = [
  { id: "#32550", name: "Fresh Foods Catering", service: "Cafeteria Services", contact: "Lisa Warren", phone: "(555) 123-4567", status: "Active" },
  { id: "#32360", name: "EduSupplies Co.", service: "School Supplies", contact: "Mark Johnson", phone: "(555) 987-6543", status: "Inactive" },
  { id: "#32876", name: "CleanSweep Janitorial", service: "Cleaning Services", contact: "Tom Harris", phone: "(555) 634-3210", status: "Active" },
  { id: "#32876", name: "Tech Solutions Ltd.", service: "IT Services", contact: "Rachel Kim", phone: "(555) 788-1234", status: "Active" },
  { id: "#32643", name: "SportsGear Inc.", service: "Sports Equipment", contact: "David Lee", phone: "(555) 876-3432", status: "Inactive" },
  { id: "#32644", name: "SportsGear Inc.", service: "Sports Equipment", contact: "david@sportsgearinc.com", phone: "(555) 876-5432", status: "Inactive" },
  { id: "#32646", name: "SportsGear Inc.", service: "Sports Equipment", contact: "David Lee", phone: "(555) 876-3432", status: "Inactive" },
]

export default function ManageVendorsPage() {
  return (
    <AdminShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        
        {/* Page Title */}
        <h1 className="text-3xl font-headline font-bold text-white tracking-tight">Manage Vendors</h1>

        <GlassCard className="p-8 border-white/10 bg-black/20 backdrop-blur-3xl overflow-hidden relative">
          
          {/* Header Actions / Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
            <div className="flex gap-4 w-full md:w-auto">
              <Select defaultValue="all">
                <SelectTrigger className="h-12 w-full md:w-44 bg-white/5 border-white/10 rounded-2xl px-6 focus:ring-primary/30">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="food">Food & Beverage</SelectItem>
                  <SelectItem value="supplies">School Supplies</SelectItem>
                  <SelectItem value="services">Services</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all">
                <SelectTrigger className="h-12 w-full md:w-44 bg-white/5 border-white/10 rounded-2xl px-6 focus:ring-primary/30">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative flex-1 w-full group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search vendors..." 
                className="h-12 bg-white/5 border-white/10 rounded-2xl pl-14 pr-6 text-sm focus:border-primary/50 transition-all placeholder:text-muted-foreground/40"
              />
            </div>

            <Button className="h-12 px-8 rounded-2xl bg-gradient-to-r from-primary to-secondary font-bold shadow-[0_0_20px_rgba(239,26,184,0.3)] hover:opacity-90 transition-all flex gap-2 whitespace-nowrap">
              <Plus className="w-5 h-5" /> Add Vendor
            </Button>
          </div>

          {/* Data Table */}
          <div className="rounded-2xl border border-white/5 overflow-hidden">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground pl-8">ID</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground">Vendor Name</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground">Service Provided</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground">Contact Person</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground">Phone</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground text-center">Status</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground text-right pr-8">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {vendors.map((vendor, i) => (
                  <TableRow key={i} className="border-white/5 hover:bg-white/5 transition-colors group">
                    <TableCell className="pl-8 py-5 text-sm font-bold text-white/60">{vendor.id}</TableCell>
                    <TableCell>
                      <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{vendor.name}</span>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{vendor.service}</TableCell>
                    <TableCell className="text-sm text-muted-foreground truncate max-w-[150px]">{vendor.contact}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{vendor.phone}</TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <div className={cn(
                          "px-5 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest",
                          vendor.status === 'Active' 
                            ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                            : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                        )}>
                          {vendor.status}
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
              Showing 1 to 7 of 128 entries
            </p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="h-10 w-10 rounded-xl text-muted-foreground hover:bg-white/5">
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button size="sm" className="h-10 w-10 rounded-xl bg-primary text-white font-bold shadow-[0_0_15px_rgba(239,26,184,0.4)]">1</Button>
              <Button variant="ghost" size="sm" className="h-10 w-10 rounded-xl text-muted-foreground hover:bg-white/5">2</Button>
              <Button variant="ghost" size="sm" className="h-10 w-10 rounded-xl text-muted-foreground hover:bg-white/5">3</Button>
              <Button variant="ghost" size="sm" className="h-10 w-10 rounded-xl text-muted-foreground hover:bg-white/5">
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </GlassCard>

        {/* Floating Bottom Nav - Matches consistent UI footer */}
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
