
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Download, Bell, ShieldCheck } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function PWAHandler() {
  const [deferredPrompt, setDeferredPrompt] = React.useState<any>(null)
  const [isInstalled, setIsInstalled] = React.useState(false)
  const { toast } = useToast()

  React.useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
    }

    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Automatically request basic permissions on mount
    const requestPermissions = async () => {
      try {
        if ("Notification" in window) {
          const permission = await Notification.requestPermission()
          if (permission === "granted") {
            console.log("Notification permission granted.")
          }
        }
      } catch (e) {
        console.error("Permission request failed", e)
      }
    }
    
    // Delay request slightly for better UX
    const timer = setTimeout(requestPermissions, 3000)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      clearTimeout(timer)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) {
      toast({
        title: "Installation Note",
        description: "To install, use your browser's menu and select 'Add to Home Screen'."
      })
      return
    }
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setDeferredPrompt(null)
      setIsInstalled(true)
    }
  }

  if (isInstalled || !deferredPrompt) return null

  return (
    <Button 
      onClick={handleInstall}
      className="rounded-full px-6 bg-secondary hover:bg-secondary/90 shadow-[0_0_20px_rgba(188,102,235,0.3)] animate-bounce"
    >
      <Download className="mr-2 w-4 h-4" /> Install CafePay
    </Button>
  )
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
