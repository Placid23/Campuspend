"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  Store, 
  History, 
  CreditCard,
  ShoppingBag,
  BrainCircuit,
  LogOut,
  User,
  Database,
  Zap,
  Smartphone,
  ChevronRight,
  Menu
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

const navGroups = [
  {
    label: "Operations",
    items: [
      { name: "Marketplace", href: "/vendors", icon: Store },
      { name: "My Tray", href: "/cart", icon: ShoppingBag },
      { name: "Order History", href: "/orders", icon: History },
    ]
  },
  {
    label: "Intelligence",
    items: [
      { name: "Home Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "AI Insights", href: "/insights", icon: BrainCircuit },
      { name: "Expenditure Map", href: "/calendar", icon: CreditCard },
    ]
  }
]

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const auth = useAuth()
  const db = useFirestore()
  const { toast } = useToast()
  const { user, isUserLoading, profile, isProfileLoading } = useUser()

  const itemsQuery = useMemoFirebase(() => {
    if (!user?.uid) return null
    return query(collectionGroup(db, "orderItems"), where("studentId", "==", user.uid))
  }, [user?.uid, db])

  const { data: orderItems, error: queryError } = useCollection(itemsQuery)
  const statusCache = React.useRef<Record<string, string>>({})
  const isFirstLoad = React.useRef(true)

  React.useEffect(() => {
    if (!orderItems || !profile?.settings?.notifications?.transactions) return
    if (isFirstLoad.current) {
      orderItems.forEach(item => { statusCache.current[item.id] = item.status || 'placed' })
      isFirstLoad.current = false
      return
    }
    orderItems.forEach(item => {
      const prevStatus = statusCache.current[item.id]
      const currentStatus = item.status || 'placed'
      if (prevStatus && prevStatus !== currentStatus) {
        toast({ title: "Order Update", description: `Your order for "${item.name}" is now ${currentStatus.toUpperCase()}.` })
        
        // Trigger Device Notification
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("CafePay Order Update", {
            body: `Your order for "${item.name}" is now ${currentStatus.toUpperCase()}.`,
            icon: '/logo.png'
          });
        }
        
        statusCache.current[item.id] = currentStatus
      }
    })
  }, [orderItems, profile, toast])

  React.useEffect(() => {
    if (!isUserLoading && !isProfileLoading) {
      if (!user) router.push("/login")
      else if (profile && profile.role !== 'student') {
        if (profile.role === 'vendor') router.push("/vendor/dashboard")
        if (profile.role === 'admin') router.push("/admin/dashboard")
      }
    }
  }, [user, isUserLoading, profile, isProfileLoading, router])

  const handleLogout = async () => {
    await signOut(auth)
    router.push("/login")
  }

  if (isUserLoading || (isProfileLoading && !profile)) {
    return <AppLoader message="Syncing Wallet..." />
  }

  if (!user || profile?.role !== 'student') return null

  const hasIndexError = queryError?.message?.toLowerCase().includes('index') || queryError?.code === 'failed-precondition'

  if (hasIndexError) {
    return (
      <div className="min-h-screen nebula-bg flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="relative mx-auto w-24 h-24">
             <div className="absolute -inset-4 bg-amber-500/20 blur-2xl rounded-full opacity-50" />
             <div className="w-24 h-24 rounded-3xl bg-amber-500/10 flex items-center justify-center border-2 border-amber-500/30 relative z-10">
               <Database className="w-10 h-10 text-amber-500" />
             </div>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-headline font-bold text-white uppercase">Student Index Required</h2>
            <p className="text-muted-foreground text-sm">To enable real-time tracking, we need to activate a collection group index for studentId.</p>
          </div>
          <Button asChild className="bg-amber-500 hover:bg-amber-600 text-black font-extrabold h-14 px-8 rounded-2xl w-full transition-all">
            <a href="https://console.firebase.google.com/v1/r/project/campusspend-733ab/firestore/indexes?create_exemption=Cltwcm9qZWN0cy9jYW1wdXNzcGVuZC03MzNhYi9kYXRhYmFzZXMvKGRlZmF1bHQpL2NvbGxlY3Rpb25Hcm91cHMvb3JkZXJJdGVtcy9maWVsZHMvc3R1ZGVudElkEAIaDQoJc3R1ZGVudElkEAE" target="_blank" rel="noopener noreferrer">Activate Student Index</a>
          </Button>
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
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center shadow-xl group-hover:scale-105 transition-transform relative p-1.5 border border-white/10">
                  <Image src="/logo.png" alt="Logo" fill className="object-contain p-2 scale-150" />
                </div>
                <div className="flex flex-col">
                  <span className="font-headline font-bold text-2xl tracking-tighter leading-none text-white">CafePay</span>
                  <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-primary mt-1">Student Wallet</span>
                </div>
              </Link>
            </SidebarHeader>
            <SidebarContent className="px-6 py-4">
              {navGroups.map((group) => (
                <div key={group.label} className="mb-8 last:mb-0">
                  <p className="px-6 mb-4 text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/40">{group.label}</p>
                  <SidebarMenu className="gap-2">
                    {group.items.map((item) => (
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
                </div>
              ))}
            </SidebarContent>
            <SidebarFooter className="p-8 space-y-4">
              <Link href="/settings" className="block w-full">
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:bg-accent rounded-2xl px-6 h-12 group">
                  <User className="w-5 h-5 mr-4 group-hover:text-primary transition-colors" />
                  <span className="font-bold text-sm">Account Center</span>
                </Button>
              </Link>
              <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl px-6 h-12">
                <LogOut className="w-5 h-5 mr-4" />
                <span className="font-bold text-sm">Terminate Session</span>
              </Button>
            </SidebarFooter>
          </Sidebar>

          <SidebarInset className="bg-transparent overflow-hidden pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-0">
            <header className="flex h-[calc(5rem+env(safe-area-inset-top,0px))] md:h-24 items-center gap-4 px-6 md:px-10 pt-[env(safe-area-inset-top,0px)] border-b border-border sticky top-0 z-40 bg-background/40 backdrop-blur-xl">
              <SidebarTrigger className="md:hidden h-10 w-10 flex items-center justify-center mr-1 text-white" />
              <div className="flex md:hidden items-center gap-2 flex-1">
                <div className="w-9 h-9 rounded-xl bg-white/5 relative flex items-center justify-center border border-white/10 p-1 shrink-0 overflow-hidden">
                  <Image src="/logo.png" alt="Logo" fill className="object-contain p-1.5 scale-125" />
                </div>
                <span className="font-headline font-bold text-base tracking-tighter hidden xs:block text-white">CafePay</span>
              </div>
              <div className="ml-auto flex items-center gap-3">
                <div className="h-10 md:h-12 px-3 md:px-5 rounded-2xl bg-card border border-border flex items-center gap-2 md:gap-4 shadow-inner relative overflow-hidden group">
                   <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <span className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest relative hidden sm:inline">Balance</span>
                   <div className="flex items-center gap-1 min-w-0">
                     <span className="text-[10px] md:text-sm font-bold text-primary shrink-0">₦</span>
                     <span className="text-sm md:text-xl font-headline font-bold text-primary relative truncate">
                       {(profile?.walletBalance || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
        <div className="md:hidden fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] left-6 right-6 z-40">
          <div className="bg-card/90 backdrop-blur-3xl border border-border rounded-[2rem] h-16 flex items-center justify-around px-4 shadow-2xl">
            {[
              { icon: Store, label: "Market", href: "/vendors" },
              { icon: LayoutDashboard, label: "Home", href: "/dashboard" },
              { icon: CreditCard, label: "Expend", href: "/calendar" },
              { icon: ShoppingBag, label: "Tray", href: "/cart" },
            ].map((item) => (
              <Link key={item.href} href={item.href} className={cn("flex flex-col items-center justify-center w-14 h-12 rounded-xl transition-all active:scale-90", pathname === item.href ? "text-primary bg-primary/10" : "text-muted-foreground")}>
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
