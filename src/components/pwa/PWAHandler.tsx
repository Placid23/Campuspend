"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Download, Bell, Smartphone } from "lucide-react"
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
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsInstalled(true)
    }

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js')
        .then(reg => console.log('CafePay SW registered'))
        .catch(err => console.warn('SW failed'))
    }

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
        variant="outline"
        className="rounded-full px-4 md:px-6 bg-secondary/10 border-secondary/40 text-secondary-foreground hover:bg-secondary/20 font-bold uppercase tracking-widest text-[9px] md:text-[10px] h-10 md:h-12 shadow-inner"
      >
        <Smartphone className="mr-1.5 w-3 h-3 md:w-4 md:h-4" /> 
        <span className="hidden xs:inline">Install App</span>
        <span className="xs:hidden">App</span>
      </Button>
    )
  }

  if (isIOS) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline"
            className="rounded-full px-4 md:px-6 bg-secondary/10 border-secondary/40 text-secondary-foreground hover:bg-secondary/20 font-bold uppercase tracking-widest text-[9px] md:text-[10px] h-10 md:h-12 shadow-inner"
          >
            <Smartphone className="mr-1.5 w-3 h-3 md:w-4 md:h-4" /> 
            <span className="hidden xs:inline">Get App</span>
            <span className="xs:hidden">App</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-card border-white/10 max-w-sm rounded-[2.5rem] p-8">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline font-bold text-center">Install on iOS</DialogTitle>
          </DialogHeader>
          <div className="space-y-8 py-4 text-center">
            <div className="flex justify-center">
              <div className="w-20 h-20 rounded-3xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary relative overflow-hidden">
                <div className="absolute inset-0 bg-secondary/5 animate-pulse"></div>
                <Smartphone className="w-10 h-10 relative z-10" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed px-4">
              To install <span className="text-white font-bold">CafePay Wallet</span> on your iPhone, tap the <strong className="text-primary">Share</strong> icon then select <strong className="text-primary">"Add to Home Screen"</strong>.
            </p>
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
      toast({ title: "Alerts Enabled", description: "Background status updates activated." })
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
        className="w-12 h-12 rounded-full bg-primary/20 border border-primary/40 backdrop-blur-xl text-primary shadow-[0_0_20px_rgba(239,26,184,0.3)] hover:scale-110 active:scale-95 transition-all"
      >
        <Bell className="w-5 h-5" />
      </Button>
    </div>
  )
}
