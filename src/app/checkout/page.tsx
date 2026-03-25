
"use client"

import { DashboardShell } from "@/components/layout/Shell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { 
  CheckCircle2, 
  Zap, 
  MapPin, 
  Clock, 
  ChefHat, 
  Pizza, 
  BookOpen, 
  PenTool,
  Mail,
  ChevronRight
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function CheckoutPage() {
  return (
    <DashboardShell>
      <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-top duration-1000">
        
        {/* Success Header */}
        <div className="flex flex-col items-center text-center space-y-6">
          <div className="relative">
            <div className="absolute -inset-4 bg-emerald-500/20 blur-2xl rounded-full opacity-50 animate-pulse"></div>
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/50 flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
          </div>
          <div className="space-y-2">
            <h1 className="text-5xl font-headline font-bold tracking-tight text-white neon-text-glow">Order Confirmed!</h1>
            <p className="text-muted-foreground max-w-md mx-auto">Thank you for your purchase. Your order has been successfully placed!</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Info (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            <GlassCard className="p-8 border-white/10 space-y-10">
              
              <div className="grid md:grid-cols-2 gap-12">
                {/* Items Summary */}
                <div className="space-y-6">
                  <h3 className="text-lg font-headline font-bold uppercase tracking-widest text-muted-foreground/80">Checkout Overview</h3>
                  <div className="space-y-6">
                    {[
                      { 
                        name: "Cheesy Burger", 
                        vendor: "FoodHub Café", 
                        price: "₦225", 
                        tags: ["Fast Food", "300m", "15-20 mins"],
                        image: "https://picsum.photos/seed/burger-big/100/100"
                      },
                      { 
                        name: "Pepperoni Pizza", 
                        vendor: "FoodHub Café", 
                        price: "₦250", 
                        tags: ["Fast Food", "300m", "15-20 mins"],
                        image: "https://picsum.photos/seed/pizz1/100/100"
                      }
                    ].map((item, i) => (
                      <div key={i} className="flex gap-4 items-center">
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-sm">{item.name}</h4>
                            <span className="font-bold text-sm">{item.price}</span>
                          </div>
                          <p className="text-[10px] text-muted-foreground">{item.vendor}</p>
                          <div className="flex gap-2">
                             {item.tags.map((tag, j) => (
                               <div key={j} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-[7px] font-bold flex items-center gap-1 uppercase">
                                 {tag.includes('Food') ? <Zap className="w-2 h-2" /> : tag.includes('m') ? <MapPin className="w-2 h-2" /> : <Clock className="w-2 h-2" />}
                                 {tag}
                               </div>
                             ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-6 border-t border-white/5 space-y-3">
                    <div className="flex justify-between items-center">
                       <span className="text-xs font-bold text-emerald-400">Wallet Discount : ₦50</span>
                       <span className="text-sm font-bold text-rose-400">-₦50</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                       <Clock className="w-3 h-3" /> Taal via wiler : 15-20 mins <span className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-primary"><Zap className="w-2 h-2" /></span>
                    </div>
                  </div>
                </div>

                {/* Logistics */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="text-lg font-headline font-bold uppercase tracking-widest text-muted-foreground/80">Delivery Address</h3>
                    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                      <Avatar className="w-10 h-10 border border-primary/20">
                        <AvatarImage src="https://picsum.photos/seed/gentuu/100/100" />
                        <AvatarFallback>G</AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                        <p className="text-sm font-bold">Student</p>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">ID: STU1234001</p>
                        <div className="pt-2 text-xs text-muted-foreground space-y-1">
                           <p>Main Dormitory,</p>
                           <p>University Road, Campusville</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-headline font-bold uppercase tracking-widest text-muted-foreground/80">Payment</h3>
                    <div className="space-y-3 text-xs">
                       <div className="flex justify-between">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span className="font-bold">₦475.00</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="text-muted-foreground">Tax</span>
                          <span className="font-bold text-primary">₦11.88</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="text-muted-foreground">Wallet Discount</span>
                          <span className="font-bold text-rose-400">-₦50.00</span>
                       </div>
                       <div className="flex justify-between">
                          <span className="text-muted-foreground">Delivery Fee</span>
                          <span className="font-bold">₦10.00</span>
                       </div>
                       <div className="pt-3 border-t border-white/5 flex justify-between items-center">
                          <span className="text-base font-bold uppercase tracking-tighter">Total</span>
                          <span className="text-lg font-bold text-primary">₦446.88</span>
                       </div>
                       <div className="flex justify-between text-[10px] pt-1">
                          <span className="text-muted-foreground uppercase font-bold tracking-widest">Paid via Wallet</span>
                          <span className="font-bold text-primary">₦53.62</span>
                       </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8 border-t border-white/5 flex items-center gap-3 text-[10px] text-muted-foreground font-medium">
                 <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"><Mail className="w-4 h-4" /></div>
                 An order confirmation email with the details of your purchase has been sent to your inbox.
              </div>
            </GlassCard>
          </div>

          {/* Summary Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <GlassCard className="p-8 border-primary/20 space-y-8 bg-primary/5">
              <h3 className="text-xl font-headline font-bold">Order Summary</h3>
              
              <div className="space-y-4 text-sm font-medium">
                <div className="flex justify-between">
                   <span className="text-muted-foreground">Subtotal</span>
                   <span>₦475.00</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-muted-foreground">Tax</span>
                   <span className="text-primary">₦11.88</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-muted-foreground">Wallet Discount</span>
                   <span className="text-rose-400">-₦50.00</span>
                </div>
                <div className="flex justify-between">
                   <span className="text-muted-foreground">Delivery Fee</span>
                   <span>₦10.00</span>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 space-y-1">
                 <div className="flex justify-between items-center">
                    <span className="text-xl font-headline font-bold">Total</span>
                    <span className="text-xl font-headline font-bold text-primary neon-text-glow">₦446.88</span>
                 </div>
                 <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                    <span>Paid via Wallet</span>
                    <span className="text-primary">₦53.62</span>
                 </div>
              </div>

              <div className="space-y-4">
                 <Button className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-secondary text-base font-bold shadow-[0_0_30px_rgba(239,26,184,0.3)] hover:opacity-90 active:scale-[0.98] transition-all">
                    Track Order
                 </Button>
                 <Link href="/dashboard" className="block w-full">
                   <Button variant="outline" className="w-full h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 text-base font-bold text-muted-foreground">
                      Back to Dashboard
                   </Button>
                 </Link>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Bottom Navigation Categories */}
        <div className="flex justify-center pt-8">
           <GlassCard className="inline-flex gap-8 px-10 py-4 rounded-full border-white/5 bg-white/5 backdrop-blur-3xl">
              {[
                { label: "Burger", id: "burger", icon: ChefHat },
                { label: "Pizza", id: "pizza", icon: Pizza },
                { label: "Books", id: "books1", icon: BookOpen },
                { label: "Books", id: "books2", icon: BookOpen },
                { label: "Stationery", id: "stationery", icon: PenTool }
              ].map((nav, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group cursor-pointer opacity-60 hover:opacity-100 transition-opacity">
                   <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10">
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
    </DashboardShell>
  )
}
