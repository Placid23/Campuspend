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
  SidebarProvider 
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { signOut } from 'firebase/auth'
import { useAuth, useUser } from '@/firebase'

const adminNavItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Manage Students", href: "/admin/students", icon: Users },
  { name: "Manage Vendors", href: "/admin/vendors", icon: Store },
  { name: "Manage Products", href: "/admin/products", icon: Package },
  { name: "Manage Categories", href: "/admin/categories", icon: Box },
  { name: "Reports", href: "/admin/reports", icon: ClipboardList },
  { name: "Threshold Settings", href: "/admin/settings", icon: AlertCircle },
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
    await signOut(auth)
    router.push("/login")
  }

  if (isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen nebula-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">Authenticating Admin...</p>
        </div>
      </div>
    )
  }

  if (!user || profile?.role !== 'admin') {
    return null
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full nebula-bg p-4 md:p-8 pt-[calc(1rem+env(safe-area-inset-top,0px))] pb-[calc(1rem+env(safe-area-inset-bottom,0px))]">
        <div className="flex flex-1 w-full bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
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
                {adminNavItems.map((item) => (
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
            <header className="flex h-24 items-center gap-8 px-10 border-b border-white/5 sticky top-0 z-40 bg-transparent backdrop-blur-xl">
              <div className="hidden md:flex items-center gap-10">
                <Link href="/admin/dashboard" className={cn("text-xs font-bold tracking-widest uppercase transition-colors", pathname === '/admin/dashboard' ? "text-primary" : "text-muted-foreground hover:text-white")}>Dashboard</Link>
                <Link href="/admin/reports" className={cn("text-xs font-bold tracking-widest uppercase transition-colors", pathname === '/admin/reports' ? "text-primary" : "text-muted-foreground hover:text-white")}>Reports</Link>
              </div>

              <div className="ml-auto flex items-center gap-6">
                <div className="flex items-center gap-4 group cursor-pointer">
                  <Avatar className="w-10 h-10 border-2 border-primary/20 group-hover:border-primary transition-colors">
                    <AvatarImage src={`https://picsum.photos/seed/${user?.uid || 'admin'}/100/100`} />
                    <AvatarFallback>{profile?.name?.charAt(0) || 'A'}</AvatarFallback>
                  </Avatar>
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold tracking-wide text-white">{profile?.name || 'Admin'}</p>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest">{user?.email}</p>
                  </div>
                </div>
              </div>
            </header>

            <main className="p-10 h-[calc(100vh-120px)] overflow-y-auto scrollbar-hide">
              {children}
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  )
}
