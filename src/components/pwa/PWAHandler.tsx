
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Download, Bell, Info } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function PWAHandler() {
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null)
  const [isInstalled, setIsInstalled] = React.useState(false)
  const [isIOS, setIsIOS] = React.useState(false)
  const { toast } = useToast()

  React.useEffect(() => {
    // Check if app is already installed
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true)
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase()
    setIsIOS(/iphone|ipad|ipod/.test(userAgent))

    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
      setIsInstalled(true)
    }
  }

  if (isInstalled) return null

  // If standard PWA prompt is supported (Chrome/Android)
  if (deferredPrompt) {
    return (
      <Button 
        onClick={handleInstall}
        className="rounded-full px-8 bg-secondary hover:bg-secondary/90 shadow-[0_0_30px_rgba(188,102,235,0.4)] animate-pulse font-bold uppercase tracking-widest text-xs h-12"
      >
        <Download className="mr-2 w-4 h-4" /> Install CafePay
      </Button>
    )
  }

  // If on iOS, show manual instructions
  if (isIOS) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className="rounded-full px-8 bg-secondary hover:bg-secondary/90 shadow-[0_0_30px_rgba(188,102,235,0.4)] font-bold uppercase tracking-widest text-xs h-12">
            <Download className="mr-2 w-4 h-4" /> Install App
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-card border-white/10 max-w-sm rounded-[2rem]">
          <DialogHeader>
            <DialogTitle className="text-xl font-headline font-bold text-center">Install on iOS</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4 text-center">
            <div className="flex justify-center">
               <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Download className="w-8 h-8" />
               </div>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                To install <strong>CafePay Wallet</strong> on your iPhone:
              </p>
              <ol className="text-left text-sm space-y-3 px-4">
                <li className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                  <span>Tap the <strong>Share</strong> button in Safari (box with up arrow).</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                  <span>Scroll down and tap <strong>"Add to Home Screen"</strong>.</span>
                </li>
                <li className="flex gap-3">
                  <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                  <span>Tap <strong>Add</strong> in the top right corner.</span>
                </li>
              </ol>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Generic fallback if neither prompt nor iOS is detected (manual desktop install or hidden)
  return null
}

export function PermissionPrompt() {
  const { toast } = useToast()

  const ask = async () => {
    if ("Notification" in window && Notification.permission !== "granted") {
      const res = await Notification.requestPermission()
      if (res === "granted") {
        toast({ title: "Notifications Enabled", description: "You will now receive transaction alerts." })
      }
    }
  }

  return (
    <div className="fixed bottom-24 right-6 z-50 animate-in fade-in slide-in-from-right duration-500">
      <Button 
        onClick={ask}
        size="icon" 
        className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 backdrop-blur-xl text-primary"
      >
        <Bell className="w-5 h-5" />
      </Button>
    </div>
  )
}
