"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  Store, 
  Settings, 
  LogOut, 
  ChevronRight,
  CreditCard,
  ShoppingCart,
  History,
  Menu,
  Moon,
  Sun,
  Zap
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
import { PermissionPrompt } from "@/components/pwa/PWAHandler"
import Image from "next/image"

const navItems = [
  { name: "Marketplace", href: "/vendors", icon: Store },
  { name: "My Tray", href: "/cart", icon: ShoppingCart },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Expenditure", href: "/calendar", icon: CreditCard },
  { name: "Track Logs", href: "/orders", icon: History },
  { name: "Preferences", href: "/settings", icon: Settings },
]

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const auth = useAuth()
  const { user, isUserLoading, profile, isProfileLoading } = useUser()
  const [theme, setTheme] = React.useState<'dark' | 'light'>('dark')

  React.useEffect(() => {
    const saved = localStorage.getItem('theme') || 'dark'
    setTheme(saved as any)
    document.documentElement.classList.toggle('dark', saved === 'dark')
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('theme', next)
    document.documentElement.classList.toggle('dark', next === 'dark')
  }

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

  if (isUserLoading || isProfileLoading) {
    return <AppLoader message="Syncing Wallet..." />
  }

  if (!user || profile?.role !== 'student') {
    return null
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full nebula-bg p-0 md:p-8 relative">
        <div className="flex flex-1 w-full bg-card/40 backdrop-blur-3xl border-0 md:border md:border-border rounded-none md:rounded-[2.5rem] overflow-hidden shadow-2xl">
          
          <Sidebar className="border-r-0 bg-transparent w-72">
            <SidebarHeader className="p-8 pb-4">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform overflow-hidden relative">
                  <Image src="/logo.png" alt="Logo" fill className="object-contain p-2 scale-125" />
                </div>
                <span className="font-headline font-bold text-2xl tracking-tighter">CafePay</span>
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
              <Button 
                variant="ghost" 
                onClick={toggleTheme}
                className="w-full justify-start text-muted-foreground hover:bg-accent rounded-2xl px-6 h-12"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5 mr-4" /> : <Moon className="w-5 h-5 mr-4" />}
                <span className="font-bold text-sm">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </Button>
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
            <header className="flex h-[calc(5rem+env(safe-area-inset-top,0px))] md:h-24 items-center gap-4 px-6 md:px-10 pt-[env(safe-area-inset-top,0px)] border-b border-border sticky top-0 z-40 bg-background/40 backdrop-blur-xl">
              <SidebarTrigger className="md:hidden h-10 w-10 flex items-center justify-center" />
              
              <div className="flex md:hidden items-center gap-2 flex-1">
                <div className="w-10 h-10 rounded-lg bg-primary relative flex items-center justify-center shadow-lg">
                  <Image src="/logo.png" alt="Logo" fill className="object-contain p-1 scale-125" />
                </div>
                <span className="font-headline font-bold text-lg tracking-tighter">CafePay</span>
              </div>

              <div className="ml-auto flex items-center gap-4 md:gap-6">
                <div className="h-10 px-4 md:px-6 rounded-2xl bg-muted/50 border border-border flex items-center gap-3 shadow-inner">
                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Balance</span>
                   <span className="text-sm font-headline font-bold text-primary">₦{profile?.walletBalance?.toLocaleString() || '0'}</span>
                </div>
              </div>
            </header>

            <main className="p-6 md:p-10 h-[calc(100vh-80px-env(safe-area-inset-top,0px))] md:h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide">
              {children}
            </main>
          </SidebarInset>
        </div>

        <PermissionPrompt />

        {/* Mobile Bottom Nav */}
        <div className="md:hidden fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] left-4 right-4 z-40">
          <div className="bg-card/80 backdrop-blur-3xl border border-border rounded-[2rem] h-16 flex items-center justify-around px-4 shadow-2xl">
            {[
              { icon: Store, label: "Market", href: "/vendors" },
              { icon: LayoutDashboard, label: "Home", href: "/dashboard" },
              { icon: CreditCard, label: "Bills", href: "/calendar" },
              { icon: ShoppingCart, label: "Tray", href: "/cart" },
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
              </Link>
            ))}
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}