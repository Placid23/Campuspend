"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Download, Bell } from "lucide-react"
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

    // Register Service Worker for Background Tasks
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('CafePay ServiceWorker registered:', reg.scope))
        .catch(err => console.warn('ServiceWorker failed:', err))
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase()
    setIsIOS(/iphone|ipad|ipod/.test(userAgent))

    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
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

  if (isIOS) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button className="rounded-full px-8 bg-secondary hover:bg-secondary/90 shadow-[0_0_30px_rgba(188,102,235,0.4)] font-bold uppercase tracking-widest text-xs h-12">
            <Download className="mr-2 w-4 h-4" /> Install App
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-card border-white/10 max-w-sm rounded-[2rem]">
          <DialogHeader><DialogTitle className="text-xl font-headline font-bold text-center">Install on iOS</DialogTitle></DialogHeader>
          <div className="space-y-6 py-4 text-center">
            <div className="flex justify-center"><div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary"><Download className="w-8 h-8" /></div></div>
            <p className="text-sm text-muted-foreground leading-relaxed">Tap <strong>Share</strong> then <strong>"Add to Home Screen"</strong>.</p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return null
}

export function PermissionPrompt() {
  const { toast } = useToast()

  const ask = async () => {
    if (!("Notification" in window)) return
    
    const permission = await Notification.requestPermission()
    if (permission === "granted") {
      toast({ title: "Notifications Enabled", description: "You will receive background alerts even when app is closed." })
      // Trigger a test local notification via SW if registered
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({ type: 'TEST_NOTIFY' })
      }
    }
  }

  return (
    <div className="fixed bottom-24 right-6 z-50 animate-in fade-in slide-in-from-right duration-500">
      <Button 
        onClick={ask}
        size="icon" 
        className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 backdrop-blur-xl text-primary shadow-[0_0_20px_rgba(239,26,184,0.3)]"
      >
        <Bell className="w-5 h-5" />
      </Button>
    </div>
  )
}
