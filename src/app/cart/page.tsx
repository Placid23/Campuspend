
"use client"

import { useState } from 'react'
import { useRouter } from "next/navigation"
import { DashboardShell } from "@/components/layout/Shell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { 
  Minus, 
  Plus, 
  Trash2, 
  Zap, 
  ArrowLeft, 
  ShoppingCart, 
  ShieldCheck, 
  ChefHat, 
  Pizza, 
  BookOpen, 
  PenTool,
  MapPin,
  Clock
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

const initialCart = [
  {
    id: "cheesy-burger",
    name: "Cheesy Burger",
    vendor: "FoodHub Café",
    price: 225.00,
    tags: ["Fast Food", "300m", "15-20 mins"],
    image: "https://picsum.photos/seed/burger-cart/200/200",
    quantity: 1
  },
  {
    id: "pepperoni-pizza",
    name: "Pepperoni Pizza",
    vendor: "FoodHub Café",
    price: 250.00,
    tags: ["Fast Food", "300m", "15-20 mins"],
    image: "https://picsum.photos/seed/pizza-cart/200/200",
    quantity: 1
  }
]

export default function CartPage() {
  const [cart, setCart] = useState(initialCart)
  const router = useRouter()

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ))
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.025
  const deliveryFee = 10.00
  const walletDiscount = 50.00
  const total = subtotal + tax + deliveryFee - walletDiscount

  return (
    <DashboardShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
        
        {/* Header Section */}
        <div className="space-y-2">
          <h1 className="text-4xl font-headline font-bold">Your <span className="text-primary neon-text-glow">Cart</span></h1>
          <p className="text-muted-foreground text-sm">Review and manage the items in your cart before proceeding to checkout.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <GlassCard className="p-8 border-white/10">
              <div className="flex items-center gap-2 mb-8 text-sm font-bold uppercase tracking-widest text-muted-foreground/80">
                From <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center"><Zap className="w-3 h-3 text-white" /></div> <span className="text-foreground">Foodhub</span>
              </div>

              <div className="space-y-8">
                {cart.map((item) => (
                  <div key={item.id} className="flex flex-col md:flex-row gap-6 items-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all">
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    
                    <div className="flex-1 space-y-3 text-center md:text-left">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-headline font-bold">{item.name}</h3>
                          <p className="text-xs text-muted-foreground">{item.vendor}</p>
                        </div>
                        <div className="text-lg font-bold">₦{item.price.toFixed(0)} <ShoppingCart className="inline w-3 h-3 text-muted-foreground/50 ml-1" /></div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        {item.tags.map((tag, i) => (
                          <div key={i} className="px-3 py-0.5 rounded-lg bg-primary/10 text-primary text-[8px] font-bold flex items-center gap-1">
                             {tag.includes('Food') ? <Zap className="w-2 h-2" /> : tag.includes('m') ? <MapPin className="w-2 h-2" /> : <Clock className="w-2 h-2" />}
                             {tag}
                          </div>
                        ))}
                      </div>

                      <div className="text-xs font-bold text-muted-foreground">₦{item.price.toFixed(0)}</div>
                    </div>

                    <div className="flex items-center gap-4 bg-white/5 rounded-xl border border-white/10 p-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg"
                        onClick={() => updateQuantity(item.id, -1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-lg"
                        onClick={() => updateQuantity(item.id, 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-8 border-t border-white/5 space-y-4">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <Zap className="w-3 h-3" />
                  </div>
                  Expenses will be auto-logged to help you track your spending.
                </div>
                <Link href="/vendors" className="inline-flex items-center gap-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
                  <ShoppingCart className="w-3 h-3" /> Continue Shopping
                </Link>
              </div>
            </GlassCard>
          </div>

          {/* Cart Summary (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <GlassCard className="p-8 border-white/10 space-y-8">
              <h3 className="text-xl font-headline font-bold">Cart Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-bold">₦{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Estimated Tax</span>
                  <span className="font-bold">₦{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="font-bold">₦{deliveryFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Wallet Discount</span>
                  <span className="font-bold text-rose-400">-₦{walletDiscount.toFixed(2)}</span>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-headline font-bold">Total</span>
                  <span className="text-2xl font-headline font-bold text-primary neon-text-glow">₦{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Wallet Balance</span>
                  <span className="font-bold">₦500.50</span>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={() => router.push('/checkout')}
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-secondary text-base font-bold shadow-[0_0_30px_rgba(239,26,184,0.3)] hover:opacity-90 active:scale-[0.98] transition-all"
                >
                  Proceed to Checkout
                </Button>
                <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-widest text-center">
                  <ShieldCheck className="w-3 h-3 text-primary" /> Secure payments. Student-verified vendors
                </div>
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
        <div className="text-center py-12 border-t border-white/5">
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">© 2024 CampusSpend. All rights reserved.</p>
        </div>

      </div>
    </DashboardShell>
  )
}
