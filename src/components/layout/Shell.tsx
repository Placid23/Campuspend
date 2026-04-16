"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  Zap, 
  LayoutDashboard, 
  Store, 
  Settings, 
  LogOut, 
  ChevronRight,
  CreditCard,
  ShoppingCart,
  History,
  Menu,
  Loader2
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
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from 'firebase/auth'
import { useAuth, useUser } from '@/firebase'

const navItems = [
  { name: "Vendors", href: "/vendors", icon: Store },
  { name: "Cart", href: "/cart", icon: ShoppingCart },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Expenses", href: "/calendar", icon: CreditCard },
  { name: "Orders", href: "/orders", icon: History },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const auth = useAuth()
  const { user, isUserLoading, profile, isProfileLoading } = useUser()

  // Route Guard: Only students can access this shell
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
    await signOut(auth)
    router.push("/login")
  }

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen nebula-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Authenticating...</p>
        </div>
      </div>
    )
  }

  if (!user || profile?.role !== 'student') {
    return null
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full nebula-bg p-0 md:p-8 relative">
        
        <div className="flex flex-1 w-full bg-black/40 backdrop-blur-3xl border-0 md:border md:border-white/10 rounded-none md:rounded-[2.5rem] overflow-hidden shadow-none md:shadow-[0_0_100px_rgba(0,0,0,0.5)]">
          
          <Sidebar className="border-r-0 bg-transparent w-72 hidden md:flex">
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
                {navItems.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={pathname === item.href || (item.href === '/vendors' && pathname.startsWith('/vendors'))}
                      className={cn(
                        "h-12 px-6 rounded-2xl transition-all duration-300",
                        (pathname === item.href || (item.href === '/vendors' && pathname.startsWith('/vendors')))
                          ? "bg-gradient-to-r from-primary to-secondary text-white shadow-[0_0_20px_rgba(239,26,184,0.3)]" 
                          : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Link href={item.href} className="flex items-center gap-4">
                        <item.icon className={cn("w-5 h-5")} />
                        <span className="font-bold text-sm tracking-wide">{item.name}</span>
                        {(pathname === item.href || (item.href === '/vendors' && pathname.startsWith('/vendors'))) && (
                          <ChevronRight className="ml-auto w-4 h-4 opacity-50" />
                        )}
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

          <Sidebar side="left" className="md:hidden" collapsible="offcanvas" />

          <SidebarInset className="bg-transparent overflow-hidden pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-0">
            <header className="flex h-[calc(5rem+env(safe-area-inset-top,0px))] md:h-24 items-center gap-4 px-6 md:px-10 pt-[env(safe-area-inset-top,0px)] border-b border-white/5 sticky top-0 z-40 bg-background/20 backdrop-blur-xl">
              <SidebarTrigger className="md:hidden text-white h-10 w-10" />
              
              <div className="flex md:hidden items-center gap-2 flex-1">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-[0_0_15px_rgba(239,26,184,0.5)]">
                  <Zap className="text-white w-5 h-5" />
                </div>
                <span className="font-headline font-bold text-lg tracking-tighter text-white">CampusSpend</span>
              </div>

              <div className="hidden md:flex items-center gap-10">
                <Link href="/" className="text-sm font-bold tracking-widest uppercase hover:text-primary transition-colors">Home</Link>
                <Link href="/vendors" className="text-sm font-bold tracking-widest uppercase hover:text-primary transition-colors">Vendors</Link>
              </div>

              <div className="ml-auto flex items-center gap-4 md:gap-6">
                <div className="flex items-center gap-3 md:gap-4 group cursor-pointer">
                  <Avatar className="w-8 h-8 md:w-10 md:h-10 border-2 border-primary/20 group-hover:border-primary transition-colors">
                    <AvatarImage src={`https://picsum.photos/seed/${user?.uid || 'student'}/100/100`} />
                    <AvatarFallback>{user?.email?.charAt(0).toUpperCase() || 'S'}</AvatarFallback>
                  </Avatar>
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold tracking-wide">{profile?.name || 'Student'}</p>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase truncate max-w-[100px]">{user?.email}</p>
                  </div>
                </div>
                <div className="h-9 md:h-10 px-4 md:px-6 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2 md:gap-3 shadow-inner">
                   <span className="text-[8px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">₦</span>
                   <span className="text-xs md:text-sm font-headline font-bold text-primary">{profile?.walletBalance?.toLocaleString() || '0'}</span>
                </div>
              </div>
            </header>

            <main className="p-6 md:p-10 h-[calc(100vh-80px-env(safe-area-inset-top,0px))] md:h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide">
              {children}
            </main>
          </SidebarInset>
        </div>

        <div className="md:hidden fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] left-4 right-4 z-50">
          <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-3xl h-16 flex items-center justify-around px-2 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
            {[
              { icon: Store, label: "Vendors", href: "/vendors" },
              { icon: LayoutDashboard, label: "Home", href: "/dashboard" },
              { icon: CreditCard, label: "Bills", href: "/calendar" },
              { icon: History, label: "Orders", href: "/orders" },
            ].map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-14 h-12 rounded-2xl transition-all active:scale-90",
                  pathname === item.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                <item.icon className={cn("w-5 h-5", pathname === item.href && "neon-text-glow")} />
                <span className="text-[8px] font-bold uppercase mt-1 tracking-tighter">{item.label}</span>
                {pathname === item.href && (
                  <div className="w-1 h-1 rounded-full bg-primary mt-0.5 shadow-[0_0_5px_rgba(239,26,184,1)]" />
                )}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </SidebarProvider>
  )
}
