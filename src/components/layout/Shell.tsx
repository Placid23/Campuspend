"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  Store, 
  Settings, 
  LogOut, 
  CreditCard,
  ShoppingCart,
  History,
  User,
  ChevronRight,
  Bell,
  Menu,
  AlertTriangle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarHeader, 
  SidebarInset, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from 'firebase/auth'
import { useAuth, useUser, useCollection, useMemoFirebase, useFirestore } from '@/firebase'
import { collectionGroup, query, where } from 'firebase/firestore'
import { AppLoader } from "@/components/ui/app-loader"
import { PermissionPrompt } from "@/components/pwa/PWAHandler"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

const navItems = [
  { name: "Marketplace", href: "/vendors", icon: Store },
  { name: "My Tray", href: "/cart", icon: ShoppingCart },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Expenditure", href: "/calendar", icon: CreditCard },
  { name: "Track Logs", href: "/orders", icon: History },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const auth = useAuth()
  const db = useFirestore()
  const { toast } = useToast()
  const { user, isUserLoading, profile, isProfileLoading } = useUser()

  // 1. Stable Index Query
  const itemsQuery = useMemoFirebase(() => {
    if (!user?.uid) return null
    return query(
      collectionGroup(db, "orderItems"),
      where("studentId", "==", user.uid)
    )
  }, [user?.uid, db])

  const { data: orderItems, error: queryError } = useCollection(itemsQuery)
  const statusCache = React.useRef<Record<string, string>>({})
  const isFirstLoad = React.useRef(true)

  // 2. Status Notifications
  React.useEffect(() => {
    if (!orderItems || !profile?.settings?.notifications?.transactions) return

    if (isFirstLoad.current) {
      orderItems.forEach(item => {
        statusCache.current[item.id] = item.status || 'placed'
      })
      isFirstLoad.current = false
      return
    }

    orderItems.forEach(item => {
      const prevStatus = statusCache.current[item.id]
      const currentStatus = item.status || 'placed'

      if (prevStatus && prevStatus !== currentStatus) {
        toast({
          title: "Order Update",
          description: `Your order for "${item.name}" is now ${currentStatus.toUpperCase()}.`,
        })
        statusCache.current[item.id] = currentStatus
      }
    })
  }, [orderItems, profile, toast])

  // 3. Guards
  React.useEffect(() => {
    if (!isUserLoading && !isProfileLoading) {
      if (!user) {
        router.push("/login")
      } else if (profile && profile.role !== 'student') {
        if (profile.role === 'vendor') router.push("/vendor/dashboard")
        if (profile.role === 'admin') router.push("/admin/dashboard")
      }
    }
  }, [user, isUserLoading, profile, isProfileLoading, router])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  if (isUserLoading || (isProfileLoading && !profile)) {
    return <AppLoader message="Syncing Wallet..." />
  }

  if (!user || profile?.role !== 'student') {
    return null
  }

  // 4. Handle Missing Index Error gracefully
  if (queryError?.message?.includes('requires an index')) {
    return (
      <div className="min-h-screen nebula-bg flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 rounded-full bg-amber-500/10 flex items-center justify-center border border-amber-500/20 mx-auto shadow-[0_0_50px_rgba(245,158,11,0.2)]">
            <AlertTriangle className="w-10 h-10 text-amber-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-headline font-bold text-white">Action Required: Enable Index</h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              To track your order status in real-time, a cross-collection index is required for your project.
            </p>
          </div>
          <Button asChild className="bg-amber-500 hover:bg-amber-600 text-black font-bold h-12 px-8 rounded-xl w-full">
            <a href="https://console.firebase.google.com/v1/r/project/campusspend-733ab/firestore/indexes?create_exemption=Cltwcm9qZWN0cy9jYW1wdXNzcGVuZC03MzNhYi9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvb3JkZXJJdGVtcy9maWVsZHMvc3R1ZGVudElkEAIaDQoJc3R1ZGVudElkEAE" target="_blank" rel="noopener noreferrer">
              Create studentId Index
            </a>
          </Button>
          <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest opacity-50">Estimated setup time: 1 minute</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full nebula-bg p-0 md:p-8 relative">
        <div className="flex flex-1 w-full bg-card/40 backdrop-blur-3xl border-0 md:border md:border-border rounded-none md:rounded-[2.5rem] overflow-hidden shadow-2xl">
          
          <Sidebar className="border-r-0 bg-transparent w-72">
            <SidebarHeader className="p-8 pb-4">
              <Link href="/" className="flex items-center gap-4 group">
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform overflow-hidden relative p-1.5 border border-white/10">
                  <Image src="/logo.png" alt="Logo" fill className="object-contain p-2 scale-150" />
                </div>
                <div className="flex flex-col">
                  <span className="font-headline font-bold text-2xl tracking-tighter leading-none">CafePay</span>
                  <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-primary mt-1">Student Wallet</span>
                </div>
              </Link>
            </SidebarHeader>
            <SidebarContent className="px-6 py-8">
              <SidebarMenu className="gap-2">
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={pathname === item.href || (item.href === '/vendors' && pathname.startsWith('/vendors'))}
                      className={cn(
                        "h-12 px-6 rounded-2xl transition-all duration-300 font-bold",
                        (pathname === item.href || (item.href === '/vendors' && pathname.startsWith('/vendors')))
                          ? "bg-gradient-to-r from-primary to-secondary text-white shadow-xl" 
                          : "hover:bg-accent text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Link href={item.href} className="flex items-center gap-4">
                        <item.icon className="w-5 h-5" />
                        <span className="text-sm tracking-wide">{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="p-8 space-y-4">
              <Link href="/settings" className="block w-full">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-muted-foreground hover:bg-accent rounded-2xl px-6 h-12 group"
                >
                  <User className="w-5 h-5 mr-4 group-hover:text-primary transition-colors" />
                  <span className="font-bold text-sm">Settings</span>
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                onClick={handleLogout}
                className="w-full justify-start text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl px-6 h-12"
              >
                <LogOut className="w-5 h-5 mr-4" />
                <span className="font-bold text-sm">Logout</span>
              </Button>
            </SidebarFooter>
          </Sidebar>

          <SidebarInset className="bg-transparent overflow-hidden pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-0">
            <header className="flex h-[calc(5rem+env(safe-area-inset-top,0px))] md:h-24 items-center gap-4 px-6 md:px-10 pt-[env(safe-area-inset-top,0px)] border-b border-border sticky top-0 z-40 bg-background/40 backdrop-blur-xl overflow-hidden">
              <SidebarTrigger className="md:hidden h-10 w-10 flex items-center justify-center mr-1" />
              
              <div className="flex md:hidden items-center gap-2 min-w-0 flex-1">
                <div className="w-9 h-9 rounded-xl bg-white/5 relative flex items-center justify-center shadow-lg border border-white/10 p-1 shrink-0 overflow-hidden">
                  <Image src="/logo.png" alt="Logo" fill className="object-contain p-1.5 scale-125" />
                </div>
                <span className="font-headline font-bold text-base tracking-tighter truncate xs:block hidden">CafePay</span>
              </div>

              <div className="ml-auto flex items-center gap-3 shrink-0 min-w-0">
                <div className="h-10 md:h-12 px-3 md:px-6 rounded-2xl bg-card border border-border flex items-center gap-2 md:gap-4 shadow-inner relative overflow-hidden group max-w-[150px] md:max-w-none">
                   <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <span className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest relative hidden sm:inline">Balance</span>
                   <div className="flex items-center gap-1 min-w-0">
                     <span className="text-[10px] md:text-sm font-bold text-primary shrink-0">₦</span>
                     <span className="text-sm md:text-xl font-headline font-bold text-primary relative truncate">
                       {profile?.walletBalance?.toLocaleString() || '0'}
                     </span>
                   </div>
                </div>
              </div>
            </header>

            <main className="p-4 md:p-10 h-[calc(100vh-80px-env(safe-area-inset-top,0px))] md:h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide">
              {children}
            </main>
          </SidebarInset>
        </div>

        <PermissionPrompt />

        {/* Mobile Bottom Nav */}
        <div className="md:hidden fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] left-6 right-6 z-40">
          <div className="bg-card/90 backdrop-blur-3xl border border-border rounded-[2rem] h-16 flex items-center justify-around px-4 shadow-2xl">
            {[
              { icon: Store, label: "Market", href: "/vendors" },
              { icon: LayoutDashboard, label: "Home", href: "/dashboard" },
              { icon: CreditCard, label: "Expend", href: "/calendar" },
              { icon: ShoppingCart, label: "Tray", href: "/cart" },
            ].map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all active:scale-90",
                  pathname === item.href ? "text-primary bg-primary/10" : "text-muted-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", pathname === item.href && "neon-text-glow")} />
                <span className="text-[7px] font-bold uppercase mt-1 tracking-tighter">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
