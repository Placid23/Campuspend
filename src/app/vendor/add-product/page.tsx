
"use client"

import * as React from "react"
import { VendorShell } from "@/components/layout/VendorShell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Plus, 
  ChevronRight, 
  ChefHat, 
  Pizza, 
  BookOpen, 
  PenTool, 
  Zap,
  Package,
  Info,
  Upload,
  Eye,
  Settings
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function AddProductPage() {
  return (
    <VendorShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        
        {/* Page Title */}
        <h1 className="text-3xl font-headline font-bold text-white tracking-tight">Add New Product</h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Form (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            <GlassCard className="p-10 border-white/10 space-y-10 bg-white/5 backdrop-blur-3xl">
              
              {/* Product Information Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-headline font-bold text-white/80 tracking-wide">Product Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                  {/* Upload Area */}
                  <div className="md:col-span-4 space-y-4">
                    <div className="aspect-square rounded-2xl border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center gap-4 group cursor-pointer hover:border-primary/50 transition-all relative overflow-hidden">
                       <div className="p-4 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                          <Plus className="w-8 h-8" />
                       </div>
                       <div className="text-center space-y-1">
                          <p className="text-sm font-bold text-white/90">Upload Image</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">or drag and drop</p>
                       </div>
                    </div>
                    <Button className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-secondary text-sm font-bold shadow-[0_0_20px_rgba(239,26,184,0.3)]">
                      1 Upload Image
                    </Button>
                    <p className="text-[10px] text-center text-muted-foreground uppercase tracking-widest">or drag and drop</p>
                  </div>

                  {/* Text Inputs */}
                  <div className="md:col-span-8 space-y-6">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Product Name</Label>
                       <Input 
                          placeholder="Enter product name" 
                          className="h-12 bg-white/5 border-white/10 rounded-xl px-6 focus:border-primary/50 transition-all text-sm"
                       />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Category</Label>
                       <Select defaultValue="fast-food">
                          <SelectTrigger className="h-12 bg-white/5 border-white/10 rounded-xl px-6 focus:ring-primary/30">
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-white/10">
                            <SelectItem value="fast-food">Fast Food</SelectItem>
                            <SelectItem value="drinks">Drinks</SelectItem>
                            <SelectItem value="books">Books</SelectItem>
                            <SelectItem value="stationery">Stationery</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                    <div className="space-y-2">
                       <Textarea 
                          placeholder="Enter product description here..." 
                          className="min-h-[120px] bg-white/5 border-white/10 rounded-xl p-6 focus:border-primary/50 transition-all text-sm"
                       />
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/5 w-full"></div>

              {/* Pricing & Stock Section */}
              <div className="space-y-6">
                 <h3 className="text-lg font-headline font-bold text-white/80 tracking-wide">Pricing & Stock</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Price (Rs.)</Label>
                       <div className="relative">
                          <Input defaultValue="0.00" className="h-12 bg-white/5 border-white/10 rounded-xl px-6 text-sm" />
                          <span className="absolute right-6 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">0.00</span>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Stock Quantity</Label>
                       <Input defaultValue="0" className="h-12 bg-white/5 border-white/10 rounded-xl px-6 text-sm" />
                    </div>
                    <div className="space-y-2">
                       <div className="flex items-center gap-2 mb-2">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Low Stock Alert</Label>
                          <Info className="w-3 h-3 text-muted-foreground/40" />
                       </div>
                       <Input defaultValue="5" className="h-12 bg-white/5 border-white/10 rounded-xl px-6 text-sm" />
                    </div>
                 </div>
              </div>

              <div className="h-px bg-white/5 w-full"></div>

              {/* Pricing & Status Section (Left) */}
              <div className="space-y-6">
                 <h3 className="text-lg font-headline font-bold text-white/80 tracking-wide">Pricing & Status</h3>
                 <div className="flex flex-wrap items-center gap-12">
                    <div className="flex items-center gap-4">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Visibility</span>
                       <div className="flex items-center gap-2 group cursor-pointer text-sm font-bold hover:text-primary transition-colors">
                          Public <ChevronRight className="w-4 h-4" />
                       </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Status:</span>
                       <div className="flex items-center gap-3">
                          <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> Active
                          </div>
                          <Switch defaultChecked className="data-[state=checked]:bg-emerald-500" />
                       </div>
                    </div>
                 </div>
              </div>
            </GlassCard>
          </div>

          {/* Right Column: Summary & Actions (4 cols) */}
          <div className="lg:col-span-4 space-y-8">
            <GlassCard className="p-8 border-white/10 space-y-8 bg-white/5">
              <h3 className="text-lg font-headline font-bold text-white">Product Information</h3>
              <div className="space-y-6">
                 <div className="space-y-1">
                    <div className="flex items-center gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                       <span className="text-xs font-bold text-white/80">Product Name</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground pl-4.5 uppercase tracking-widest font-bold">---</p>
                 </div>
                 <div className="space-y-2">
                    <div className="flex items-center gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                       <span className="text-xs font-bold text-white/80">Category</span>
                    </div>
                    <div className="pl-4.5">
                       <Select defaultValue="fast-food">
                          <SelectTrigger className="h-10 bg-white/5 border-white/10 rounded-xl px-4 focus:ring-primary/30 text-xs">
                            <SelectValue placeholder="Fast Food" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-white/10">
                            <SelectItem value="fast-food">Fast Food</SelectItem>
                          </SelectContent>
                       </Select>
                    </div>
                 </div>
                 <div className="space-y-1">
                    <div className="flex items-center gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                       <span className="text-xs font-bold text-white/80">Description</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground pl-4.5 leading-relaxed">Enter product description here...</p>
                 </div>
                 <div className="space-y-1">
                    <div className="flex items-center gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                       <span className="text-xs font-bold text-white/80">Additional Details (Optional)</span>
                    </div>
                 </div>
              </div>
            </GlassCard>

            <GlassCard className="p-8 border-primary/20 bg-primary/5 space-y-8">
              <h3 className="text-lg font-headline font-bold text-white">Visibility & Status</h3>
              <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                       <span className="text-xs font-bold text-white/80">Visibility</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-white cursor-pointer">
                       Public <ChevronRight className="w-3 h-3" />
                    </div>
                 </div>
                 <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                       <span className="text-xs font-bold text-white/80">Status</span>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-bold uppercase flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-emerald-400"></div> Active
                       </div>
                       <Switch defaultChecked className="data-[state=checked]:bg-emerald-500 scale-75" />
                    </div>
                 </div>
                 <Button className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-secondary text-base font-bold shadow-[0_0_30px_rgba(239,26,184,0.4)] hover:opacity-90 active:scale-[0.98] transition-all">
                    Add Product
                 </Button>
              </div>
            </GlassCard>
          </div>
        </div>

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
        <div className="text-center py-8 border-t border-white/5">
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">© 2024 CampusSpend. All rights reserved.</p>
        </div>

      </div>
    </VendorShell>
  )
}
