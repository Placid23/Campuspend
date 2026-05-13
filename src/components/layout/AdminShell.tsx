"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Package, 
  LogOut,
  Box,
  ClipboardList,
  AlertCircle,
  ShieldCheck,
  Zap,
  Settings
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
  { name: "System Overview", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Student Directory", href: "/admin/students", icon: Users },
  { name: "Vendor Registry", href: "/admin/vendors", icon: Store },
  { name: "Global Inventory", href: "/admin/products", icon: Package },
  { name: "Product Taxonomy", href: "/admin/categories", icon: Box },
  { name: "Platform Analytics", href: "/admin/reports", icon: ClipboardList },
  { name: "Security Thresholds", href: "/admin/settings", icon: AlertCircle },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const auth = useAuth()
  const { user, isUserLoading, profile, isProfileLoading } = useUser()

  React.useEffect(() => {
    if (!isUserLoading && !isProfileLoading) {
      if (!user) router.push("/login")
      else if (profile && profile.role !== 'admin') {
        if (profile.role === 'student') router.push("/dashboard")
        else if (profile.role === 'vendor') router.push("/vendor/dashboard")
      }
    }
  }, [user, isUserLoading, profile, isProfileLoading, router])

  const handleLogout = async () => {
    await signOut(auth)
    router.push("/login")
  }

  if (isUserLoading || (isProfileLoading && !profile)) return <AppLoader message="Authorizing Administrator..." />
  if (!user || profile?.role !== 'admin') return null

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full nebula-bg p-0 md:p-8">
        <div className="flex flex-1 w-full bg-black/40 backdrop-blur-3xl border-0 md:border md:border-white/10 rounded-none md:rounded-[2.5rem] overflow-hidden shadow-2xl">
          <Sidebar className="border-r-0 bg-transparent w-72">
            <SidebarHeader className="p-8 pb-4">
              <Link href="/" className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 p-2 relative overflow-hidden">
                  <Image src="/logo.png" alt="Logo" fill className="object-contain p-2 scale-150" />
                </div>
                <div className="flex flex-col">
                  <span className="font-headline font-bold text-2xl tracking-tighter leading-none text-white">CafePay</span>
                  <span className="text-[8px] font-bold uppercase tracking-[0.3em] text-primary mt-1">System Root</span>
                </div>
              </Link>
            </SidebarHeader>
            <SidebarContent className="px-6 py-8">
              <SidebarMenu className="gap-2">
                {adminNavItems.map((item) => (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton asChild isActive={pathname === item.href} className={cn("h-12 px-6 rounded-2xl transition-all font-bold", pathname === item.href ? "bg-gradient-to-r from-primary to-secondary text-white shadow-xl" : "hover:bg-white/5 text-muted-foreground")}>
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
              <Link href="/admin/profile" className="w-full">
                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:bg-white/5 rounded-2xl px-6 h-12 group">
                  <ShieldCheck className="w-5 h-5 mr-4 group-hover:text-primary transition-colors" />
                  <span className="font-bold text-sm">Security Profile</span>
                </Button>
              </Link>
              <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl px-6 h-12">
                <LogOut className="w-5 h-5 mr-4" />
                <span className="font-bold text-sm">Terminate Session</span>
              </Button>
            </SidebarFooter>
          </Sidebar>

          <SidebarInset className="bg-transparent overflow-hidden">
            <header className="flex h-20 md:h-24 items-center gap-4 px-6 md:px-10 border-b border-white/5 sticky top-0 z-40 bg-transparent backdrop-blur-xl">
              <SidebarTrigger className="md:hidden text-white" />
              <div className="ml-auto flex items-center gap-4">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-white">{profile?.name || 'Administrator'}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Platform Root Infrastructure</p>
                </div>
                <Avatar className="w-10 h-10 border-2 border-primary/20 shadow-2xl">
                  <AvatarImage src={`https://picsum.photos/seed/${user?.uid}/100/100`} />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
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
