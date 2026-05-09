"use client"

import { useState, useEffect } from 'react'
import { useRouter } from "next/navigation"
import { DashboardShell } from "@/components/layout/Shell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { 
  Minus, 
  Plus, 
  Trash2, 
  ShoppingCart, 
  ShieldCheck, 
  Loader2
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { doc, setDoc, updateDoc, collection } from 'firebase/firestore'
import { useFirestore, useUser, errorEmitter, FirestorePermissionError } from '@/firebase'
import { useToast } from "@/hooks/use-toast"

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const router = useRouter()
  const db = useFirestore()
  const { user, profile } = useUser()
  const { toast } = useToast()

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('campus-spend-cart') || '[]')
    setCart(savedCart)
  }, [])

  const updateQuantity = (id: string, delta: number) => {
    const newCart = cart.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    )
    setCart(newCart)
    localStorage.setItem('campus-spend-cart', JSON.stringify(newCart))
  }

  const removeItem = (id: string) => {
    const newCart = cart.filter(item => item.id !== id)
    setCart(newCart)
    localStorage.setItem('campus-spend-cart', JSON.stringify(newCart))
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const tax = subtotal * 0.025
  const deliveryFee = 10.00
  const total = subtotal + tax + deliveryFee

  const handleCheckout = async () => {
    if (!user || !profile) return
    if (cart.length === 0) return

    if (profile.walletBalance < total) {
      toast({
        variant: "destructive",
        title: "Insufficient Balance",
        description: "Your digital wallet does not have enough funds for this order."
      })
      return
    }

    setIsProcessing(true)

    const orderId = `ORD-${Date.now()}`
    const studentId = user.uid
    const now = new Date().toISOString()

    // 1. Prepare Parent Order Document
    const orderRef = doc(db, "users", studentId, "orders", orderId)
    const orderData = {
      id: orderId,
      studentId,
      orderDate: now,
      totalAmount: total,
      status: "placed",
      itemCount: cart.length,
      createdAt: now,
      updatedAt: now
    }

    // 2. Prepare Expense Document
    const expenseId = `EXP-${Date.now()}`
    const expenseRef = doc(db, "users", studentId, "expenses", expenseId)
    const expenseData = {
      id: expenseId,
      studentId,
      orderId,
      amount: total,
      expenseDate: now,
      description: `Purchase of ${cart.length} items`,
      categoryId: cart[0]?.category || "general",
      createdAt: now,
      updatedAt: now
    }

    // 3. Initiate Non-blocking writes
    // DO NOT await mutation calls to avoid UI blocking and 10s timeouts
    setDoc(orderRef, orderData).catch(err => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: orderRef.path,
        operation: 'create',
        requestResourceData: orderData
      }));
    });
    
    // Process items in parallel
    cart.forEach(item => {
      const itemRef = doc(collection(db, "users", studentId, "orders", orderId, "orderItems"))
      const itemData = {
        id: itemRef.id,
        orderId,
        studentId,
        productId: item.id,
        name: item.name,
        quantity: item.quantity,
        unitPrice: item.price,
        subtotal: item.price * item.quantity,
        vendorOwnerId: item.vendorOwnerId,
        status: "placed",
        createdAt: now,
        updatedAt: now
      }
      setDoc(itemRef, itemData).catch(err => {
        errorEmitter.emit('permission-error', new FirestorePermissionError({
          path: itemRef.path,
          operation: 'create',
          requestResourceData: itemData
        }));
      });
    });

    setDoc(expenseRef, expenseData).catch(err => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: expenseRef.path,
        operation: 'create',
        requestResourceData: expenseData
      }));
    });

    const profileRef = doc(db, "userProfiles", studentId)
    const profileUpdate = { 
      walletBalance: profile.walletBalance - total,
      updatedAt: now
    }
    updateDoc(profileRef, profileUpdate).catch(err => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: profileRef.path,
        operation: 'update',
        requestResourceData: profileUpdate
      }));
    });

    // Proceed to success screen optimistically
    localStorage.removeItem('campus-spend-cart')
    toast({ title: "Order Placed!", description: "Funds deducted from your wallet." })
    
    // Artificial delay for visual transition feedback
    setTimeout(() => {
      router.push("/checkout")
      setIsProcessing(false)
    }, 800)
  }

  return (
    <DashboardShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-700">
        <div className="space-y-2">
          <h1 className="text-4xl font-headline font-bold">Your <span className="text-primary neon-text-glow">Tray</span></h1>
          <p className="text-muted-foreground text-sm">Review your selected items before checking out.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-6">
            <GlassCard className="p-8 border-white/10">
              {cart.length === 0 ? (
                <div className="py-20 text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-white/5 border border-dashed border-white/10 flex items-center justify-center mx-auto">
                    <ShoppingCart className="w-10 h-10 text-muted-foreground/20" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-headline font-bold text-white">Your tray is empty</h3>
                    <p className="text-muted-foreground text-sm">Discover amazing vendors on campus.</p>
                  </div>
                  <Link href="/vendors">
                    <Button variant="outline" className="rounded-xl border-white/10">Browse Marketplace</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-8">
                  {cart.map((item) => (
                    <div key={item.id} className="flex flex-col md:flex-row gap-6 items-center p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-primary/20 transition-all">
                      <div className="relative w-24 h-24 rounded-2xl overflow-hidden shrink-0">
                        <Image src={item.imageUrl || `https://picsum.photos/seed/${item.id}/200/200`} alt={item.name} fill className="object-cover" />
                      </div>
                      <div className="flex-1 space-y-1 text-center md:text-left">
                        <h3 className="text-xl font-headline font-bold">{item.name}</h3>
                        <p className="text-xs text-muted-foreground uppercase font-bold tracking-widest">{item.category}</p>
                        <div className="text-lg font-bold pt-2">₦{item.price.toLocaleString()}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-4 bg-white/5 rounded-xl border border-white/10 p-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, -1)}><Minus className="w-3 h-3" /></Button>
                          <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => updateQuantity(item.id, 1)}><Plus className="w-3 h-3" /></Button>
                        </div>
                        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-rose-500" onClick={() => removeItem(item.id)}><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </GlassCard>
          </div>

          {cart.length > 0 && (
            <div className="lg:col-span-4 space-y-6">
              <GlassCard className="p-8 border-white/10 space-y-8">
                <h3 className="text-xl font-headline font-bold">Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-bold">₦{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">VAT (2.5%)</span>
                    <span className="font-bold">₦{tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service Fee</span>
                    <span className="font-bold">₦{deliveryFee.toLocaleString()}</span>
                  </div>
                </div>
                <div className="pt-6 border-t border-white/5 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-headline font-bold">Total</span>
                    <span className="text-2xl font-headline font-bold text-primary neon-text-glow">₦{total.toLocaleString()}</span>
                  </div>
                </div>
                <Button 
                  disabled={isProcessing || (profile?.walletBalance || 0) < total}
                  onClick={handleCheckout}
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-primary to-secondary text-base font-bold shadow-[0_0_30px_rgba(239,26,184,0.3)]"
                >
                  {isProcessing ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <ShieldCheck className="w-5 h-5 mr-2" />}
                  {(profile?.walletBalance || 0) < total ? "Insufficient Balance" : "Complete Order"}
                </Button>
              </GlassCard>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  )
}
