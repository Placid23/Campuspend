
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  Zap, 
  LayoutDashboard, 
  PlusCircle, 
  ShoppingCart, 
  History, 
  TrendingUp, 
  Settings, 
  LogOut, 
  ChevronRight,
  Bell,
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
import { useAuth, useUser } from '@/firebase'
import { AppLoader } from "@/components/ui/app-loader"

const vendorNavItems = [
  { name: "Dashboard", href: "/vendor/dashboard", icon: LayoutDashboard },
  { name: "Add Product", href: "/vendor/add-product", icon: PlusCircle },
  { name: "Manage Products", href: "/vendor/manage", icon: ShoppingCart },
  { name: "Orders", href: "/vendor/orders", icon: History },
  { name: "Sales Summary", href: "/vendor/sales", icon: TrendingUp },
  { name: "Profile / Settings", href: "/vendor/settings", icon: Settings },
]

export function VendorShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const auth = useAuth()
  const { user, isUserLoading, profile, isProfileLoading } = useUser()

  React.useEffect(() => {
    if (!isUserLoading && !isProfileLoading) {
      if (!user) {
        router.push("/login")
      } else if (profile && profile.role !== 'vendor') {
        if (profile.role === 'student') router.push("/dashboard")
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

  if (isUserLoading || isProfileLoading) {
    return <AppLoader message="Authenticating Vendor..." />
  }

  if (!user || profile?.role !== 'vendor') {
    return null
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full nebula-bg p-0 md:p-8 pt-[calc(0rem+env(safe-area-inset-top,0px))] pb-[calc(0rem+env(safe-area-inset-bottom,0px))]">
        <div className="flex flex-1 w-full bg-black/40 backdrop-blur-3xl border-0 md:border md:border-white/10 rounded-none md:rounded-[2.5rem] overflow-hidden shadow-none md:shadow-[0_0_100px_rgba(0,0,0,0.5)]">
          <Sidebar className="border-r-0 bg-transparent w-72">
            <SidebarHeader className="p-8 pb-4">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(239,26,184,0.5)] group-hover:scale-110 transition-transform">
                  <Zap className="text-white w-6 h-6" />
                </div>
                <span className="font-headline font-bold text-2xl tracking-tighter text-white">CampusSpend</span>
              </Link>
            </SidebarHeader>
            <SidebarContent className="px-6 py-8">
              <SidebarMenu className="gap-2">
                {vendorNavItems.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={pathname === item.href}
                      className={cn(
                        "h-12 px-6 rounded-2xl transition-all duration-300",
                        pathname === item.href
                          ? "bg-gradient-to-r from-primary to-secondary text-white shadow-[0_0_20px_rgba(239,26,184,0.3)]" 
                          : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Link href={item.href} className="flex items-center gap-4">
                        <item.icon className="w-5 h-5" />
                        <span className="font-bold text-sm tracking-wide">{item.name}</span>
                        {pathname === item.href && <ChevronRight className="ml-auto w-4 h-4 opacity-50" />}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="p-8">
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

          <SidebarInset className="bg-transparent overflow-hidden">
            <header className="flex h-20 md:h-24 items-center gap-4 px-6 md:px-10 border-b border-white/5 sticky top-0 z-40 bg-transparent backdrop-blur-xl pt-[env(safe-area-inset-top,0px)]">
              <SidebarTrigger className="md:hidden text-white h-10 w-10 pointer-events-auto" />
              
              <div className="hidden md:flex items-center gap-10">
                <Link href="/vendor/dashboard" className={cn("text-sm font-bold tracking-widest uppercase transition-colors", pathname === '/vendor/dashboard' ? "text-primary" : "text-muted-foreground hover:text-white")}>Dashboard</Link>
                <Link href="/vendor/manage" className="text-sm font-bold tracking-widest uppercase text-muted-foreground hover:text-white transition-colors">Inventory</Link>
                <Link href="/vendor/orders" className="text-sm font-bold tracking-widest uppercase text-muted-foreground hover:text-white transition-colors">Orders</Link>
              </div>

              <div className="ml-auto flex items-center gap-6">
                <div className="flex items-center gap-4 group cursor-pointer">
                  <Avatar className="w-8 h-8 md:w-10 md:h-10 border-2 border-primary/20 group-hover:border-primary transition-colors">
                    <AvatarImage src={`https://picsum.photos/seed/${user?.uid || 'vendor'}/100/100`} />
                    <AvatarFallback>{profile?.name?.charAt(0) || 'V'}</AvatarFallback>
                  </Avatar>
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold tracking-wide text-white">{profile?.name || 'Vendor'}</p>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{user?.email}</p>
                  </div>
                </div>
              </div>
            </header>

            <main className="p-6 md:p-10 h-[calc(100vh-80px)] md:h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide">
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  )
}
