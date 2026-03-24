"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { 
  Zap, 
  LayoutDashboard, 
  ShoppingBag, 
  Calendar as CalendarIcon, 
  BrainCircuit, 
  Store, 
  Settings, 
  LogOut, 
  Search,
  Bell,
  ChevronRight,
  ClipboardList,
  CreditCard,
  ShoppingCart,
  MessageSquare
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { 
  Sidebar, 
  SidebarContent, 
  SidebarFooter, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarHeader, 
  SidebarInset, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem, 
  SidebarProvider, 
  SidebarTrigger 
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Vendors", href: "/vendors", icon: Store },
  { name: "Cart", href: "/cart", icon: ShoppingCart },
  { name: "Expenses", href: "/calendar", icon: CreditCard },
  { name: "Feedback", href: "/feedback", icon: MessageSquare },
  { name: "Insights", href: "/insights", icon: BrainCircuit },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full nebula-bg p-4 md:p-8">
        
        {/* Main Wrapper Box to match the contained image style */}
        <div className="flex flex-1 w-full bg-black/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
          
          <Sidebar className="border-r-0 bg-transparent w-72">
            <SidebarHeader className="p-8 pb-4">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-[0_0_20px_rgba(239,26,184,0.5)] group-hover:scale-110 transition-transform">
                  <Zap className="text-white w-6 h-6" />
                </div>
                <span className="font-headline font-bold text-2xl tracking-tighter">CampusSpend</span>
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
                onClick={() => router.push("/login")}
                className="w-full justify-start text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl px-6 h-12"
              >
                <LogOut className="w-5 h-5 mr-4" />
                <span className="font-bold text-sm">Logout</span>
              </Button>
            </SidebarFooter>
          </Sidebar>

          <SidebarInset className="bg-transparent overflow-hidden">
            {/* Custom Header from image */}
            <header className="flex h-24 items-center gap-8 px-10 border-b border-white/5 sticky top-0 z-40 bg-transparent backdrop-blur-xl">
              <div className="hidden md:flex items-center gap-10">
                <Link href="/" className="text-sm font-bold tracking-widest uppercase hover:text-primary transition-colors">Home</Link>
                <Link href="#" className="text-sm font-bold tracking-widest uppercase hover:text-primary transition-colors">How it Works</Link>
                <Link href="/vendors" className="text-sm font-bold tracking-widest uppercase hover:text-primary transition-colors">Vendors</Link>
                <Link href="#" className="text-sm font-bold tracking-widest uppercase hover:text-primary transition-colors">Features</Link>
                <Link href="#" className="text-sm font-bold tracking-widest uppercase hover:text-primary transition-colors">About</Link>
              </div>

              <div className="ml-auto flex items-center gap-6">
                <div className="flex items-center gap-4 group cursor-pointer">
                  <Avatar className="w-10 h-10 border-2 border-primary/20 group-hover:border-primary transition-colors">
                    <AvatarImage src="https://picsum.photos/seed/gentuu/100/100" />
                    <AvatarFallback>G</AvatarFallback>
                  </Avatar>
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold tracking-wide">Gentuu</p>
                    <p className="text-[10px] text-muted-foreground font-medium">Hi, 1122024001</p>
                  </div>
                </div>
                <div className="h-10 px-6 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 shadow-inner">
                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Rs.</span>
                   <span className="text-sm font-headline font-bold text-primary">500.50</span>
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
