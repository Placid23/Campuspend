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
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  ChefHat, 
  Pizza, 
  BookOpen, 
  PenTool, 
  ChevronRight,
  UtensilsCrossed,
  Zap
} from "lucide-react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const orderData = [
  { id: "#1006", vendor: "Burger Point", icon: "🍔", items: "Combo Meal", date: "Apr 22, 2024", amount: "Rs. 260", status: "Delivered" },
  { id: "#1005", vendor: "Bookstore Hub", icon: "📚", items: "Textbooks x 2", date: "Apr 22, 2024", amount: "Rs. 460", status: "Delivered" },
  { id: "#1004", vendor: "CampusPizza", icon: "🍕", items: "Pepperoni Pizza x 2", date: "Apr 22, 2024", amount: "Rs. 325", status: "Delivered" },
  { id: "#1003", vendor: "Bookstore Hub", icon: "📚", items: "Novel, Calculator", date: "Apr 22, 2024", amount: "Rs. 180", status: "Delivered" },
  { id: "#1002", vendor: "Burger Point", icon: "🍔", items: "Chicken Shawarma x 2", date: "Apr 22, 2024", amount: "Rs. 350", status: "Delivered" },
  { id: "#1001", vendor: "CampusPizza", icon: "🍕", items: "Pepperoni Pizza x 2", date: "Apr 21, 2024", amount: "Rs. 225", status: "Delivered" },
  { id: "#1001", vendor: "Stationery World", icon: "🧴", items: "Novel, Calculator", date: "Apr 17, 2024", amount: "Rs. 75", status: "Delivered" },
]

export default function OrderHistoryPage() {
  return (
    <DashboardShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
        
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-4xl font-headline font-bold text-white neon-text-glow">Order History</h1>
        </div>

        <GlassCard className="p-8 border-white/10 space-y-8 bg-white/5 backdrop-blur-3xl">
          
          {/* Filters Area */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
            <div className="md:col-span-3 space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Filter by Vendor:</label>
              <Select defaultValue="all">
                <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/30">
                  <SelectValue placeholder="All Vendors" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10">
                  <SelectItem value="all">All Vendors</SelectItem>
                  <SelectItem value="burger">Burger Point</SelectItem>
                  <SelectItem value="pizza">CampusPizza</SelectItem>
                  <SelectItem value="books">Bookstore Hub</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-3 space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Filter by Date:</label>
              <Select defaultValue="30">
                <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl focus:ring-primary/30">
                  <SelectValue placeholder="Last 30 Days" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10">
                  <SelectItem value="7">Last 7 Days</SelectItem>
                  <SelectItem value="30">Last 30 Days</SelectItem>
                  <SelectItem value="90">Last 90 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-3">
              <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-secondary text-sm font-bold shadow-[0_0_20px_rgba(239,26,184,0.3)] hover:opacity-90">
                Apply Filter
              </Button>
            </div>
          </div>

          {/* Table Section */}
          <div className="rounded-2xl border border-white/5 overflow-hidden">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6">ID</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6">Vendor</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6">Items</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6">Date</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6">Amount</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderData.map((order, i) => (
                  <TableRow key={i} className="border-white/5 hover:bg-white/5 transition-colors group">
                    <TableCell className="font-bold text-sm text-muted-foreground/80 group-hover:text-white">{order.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{order.icon}</span>
                        <span className="font-bold text-sm">{order.vendor}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground/80 group-hover:text-white">{order.items}</TableCell>
                    <TableCell className="text-sm text-muted-foreground/80 group-hover:text-white">{order.date}</TableCell>
                    <TableCell className="font-bold text-sm">{order.amount}</TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <div className="px-6 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold uppercase tracking-widest">
                          {order.status}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Area */}
          <div className="flex justify-center gap-2 pt-4">
            <Button variant="outline" size="sm" className="h-10 w-10 rounded-xl border-white/10 bg-white/5 text-primary border-primary">1</Button>
            <Button variant="outline" size="sm" className="h-10 w-10 rounded-xl border-white/10 bg-white/5 hover:bg-white/10">2</Button>
            <Button variant="outline" size="sm" className="h-10 w-10 rounded-xl border-white/10 bg-white/5 hover:bg-white/10">3</Button>
            <div className="flex items-center px-2 text-muted-foreground">...</div>
            <Button variant="outline" size="sm" className="h-10 w-10 rounded-xl border-white/10 bg-white/5 hover:bg-white/10">8</Button>
            <Button variant="outline" size="sm" className="h-10 px-6 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 flex gap-2">
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </GlassCard>

        {/* Bottom Category Selector Component */}
        <div className="flex justify-center pt-8 pb-12">
           <GlassCard className="inline-flex gap-8 px-10 py-4 rounded-full border-white/5 bg-white/5 backdrop-blur-3xl">
              {[
                { label: "Burger", id: "burger", icon: ChefHat },
                { label: "Pizza", id: "pizza", icon: Pizza },
                { label: "Books", id: "books", icon: BookOpen },
                { label: "Books", id: "books2", icon: BookOpen },
                { label: "Stationery", id: "stationery", icon: PenTool }
              ].map((nav, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
                   <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10 transition-all">
                      <nav.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                   </div>
                   <span className="text-[8px] font-bold uppercase tracking-widest">{nav.label}</span>
                </div>
              ))}
           </GlassCard>
        </div>

        {/* Footer Text */}
        <div className="text-center py-4 border-t border-white/5">
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">© 2024 CampusSpend. All rights reserved.</p>
        </div>

      </div>
    </DashboardShell>
  )
}
