
"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  Zap, 
  LayoutDashboard, 
  Users, 
  Store, 
  Package, 
  ChevronRight,
  LogOut,
  Box,
  ClipboardList,
  AlertCircle,
  Menu,
  ShieldCheck,
  User
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
import Image from "next/image"

const adminNavItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Manage Students", href: "/admin/students", icon: Users },
  { name: "Manage Vendors", href: "/admin/vendors", icon: Store },
  { name: "Manage Products", href: "/admin/products", icon: Package },
  { name: "Manage Categories", href: "/admin/categories", icon: Box },
  { name: "System Reports", href: "/admin/reports", icon: ClipboardList },
  { name: "Thresholds", href: "/admin/settings", icon: AlertCircle },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const auth = useAuth()
  const { user, isUserLoading, profile, isProfileLoading } = useUser()

  React.useEffect(() => {
    if (!isUserLoading && !isProfileLoading) {
      if (!user) {
        router.push("/login")
      } else if (profile && profile.role !== 'admin') {
        if (profile.role === 'student') router.push("/dashboard")
        if (profile.role === 'vendor') router.push("/vendor/dashboard")
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
    return <AppLoader message="Authenticating Admin..." />
  }

  if (!user || profile?.role !== 'admin') {
    return null
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full nebula-bg p-0 md:p-8 pt-[calc(0rem+env(safe-area-inset-top,0px))] pb-[calc(0rem+env(safe-area-inset-bottom,0px))]">
        <div className="flex flex-1 w-full bg-black/40 backdrop-blur-3xl border-0 md:border md:border-white/10 rounded-none md:rounded-[2.5rem] overflow-hidden shadow-2xl">
          <Sidebar className="border-r-0 bg-transparent w-72">
            <SidebarHeader className="p-8 pb-4">
              <Link href="/" className="flex items-center gap-4 group">
                <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-[0_0_25px_rgba(239,26,184,0.6)] group-hover:scale-110 transition-transform overflow-hidden relative p-1.5 border border-white/20">
                  <Image src="/logo.png" alt="Logo" fill className="object-contain p-2 scale-150 drop-shadow-md" />
                </div>
                <div className="flex flex-col">
                  <span className="font-headline font-bold text-2xl tracking-tighter leading-none">CafePay</span>
                  <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-primary mt-1">Admin Protocol</span>
                </div>
              </Link>
            </SidebarHeader>
            <SidebarContent className="px-6 py-8">
              <SidebarMenu className="gap-2">
                {adminNavItems.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={pathname === item.href}
                      className={cn(
                        "h-12 px-6 rounded-2xl transition-all duration-300 font-bold",
                        pathname === item.href
                          ? "bg-gradient-to-r from-primary to-secondary text-white shadow-xl" 
                          : "hover:bg-white/5 text-muted-foreground hover:text-foreground"
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
              <Link href="/admin/profile" className="block w-full">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-muted-foreground hover:bg-white/5 rounded-2xl px-6 h-12 group"
                >
                  <ShieldCheck className="w-5 h-5 mr-4 group-hover:text-primary transition-colors" />
                  <span className="font-bold text-sm">Security Profile</span>
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

          <SidebarInset className="bg-transparent overflow-hidden">
            <header className="flex h-20 md:h-24 items-center gap-4 px-6 md:px-10 border-b border-white/5 sticky top-0 z-40 bg-transparent backdrop-blur-xl pt-[env(safe-area-inset-top,0px)]">
              <SidebarTrigger className="md:hidden text-white h-10 w-10 pointer-events-auto" />
              
              <div className="hidden md:flex items-center gap-10">
                <Link href="/admin/dashboard" className={cn("text-xs font-bold tracking-widest uppercase transition-colors", pathname === '/admin/dashboard' ? "text-primary" : "text-muted-foreground hover:text-white")}>Market Summary</Link>
                <Link href="/admin/reports" className={cn("text-xs font-bold tracking-widest uppercase transition-colors", pathname === '/admin/reports' ? "text-primary" : "text-muted-foreground hover:text-white")}>Analytics Engine</Link>
              </div>

              <div className="ml-auto flex items-center gap-6">
                <Link href="/admin/profile" className="flex items-center gap-4 group cursor-pointer">
                  <Avatar className="w-10 h-10 border-2 border-primary/20 group-hover:border-primary transition-colors shadow-xl">
                    <AvatarImage src={`https://picsum.photos/seed/${user?.uid || 'admin'}/100/100`} />
                    <AvatarFallback>{profile?.name?.charAt(0) || 'A'}</AvatarFallback>
                  </Avatar>
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold tracking-wide text-white group-hover:text-primary transition-colors">{profile?.name || 'Admin'}</p>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">Platform Overseer</p>
                  </div>
                </Link>
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
