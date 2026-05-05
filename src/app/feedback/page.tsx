
"use client"

import * as React from "react"
import { useState } from "react"
import { DashboardShell } from "@/components/layout/Shell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Frown, 
  Meh, 
  Smile, 
  Laugh, 
  Angry,
  Loader2,
  Send
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useFirestore, useUser } from "@/firebase"
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useToast } from "@/hooks/use-toast"

const ratings = [
  { id: 'angry', icon: Angry, color: 'text-rose-500', shadow: 'shadow-[0_0_20px_rgba(244,63,94,0.4)]' },
  { id: 'sad', icon: Frown, color: 'text-orange-400', shadow: 'shadow-[0_0_20px_rgba(251,146,60,0.4)]' },
  { id: 'neutral', icon: Meh, color: 'text-amber-400', shadow: 'shadow-[0_0_20px_rgba(251,191,36,0.4)]' },
  { id: 'happy', icon: Smile, color: 'text-emerald-400', shadow: 'shadow-[0_0_20px_rgba(16,185,129,0.4)]' },
  { id: 'ecstatic', icon: Laugh, color: 'text-lime-400', shadow: 'shadow-[0_0_20px_rgba(163,230,53,0.4)]' },
]

export default function FeedbackPage() {
  const { user, profile } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  
  const [selectedRating, setSelectedRating] = useState<string | null>(null)
  const [comment, setComment] = useState("")
  const [category, setCategory] = useState("other")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!selectedRating || !comment.trim()) {
      toast({ variant: "destructive", title: "Incomplete", description: "Please select a rating and leave a comment." })
      return
    }

    setIsSubmitting(true)
    try {
      await addDoc(collection(db, "system_feedback"), {
        userId: user?.uid,
        userName: profile?.name,
        rating: selectedRating,
        comment: comment,
        category: category,
        createdAt: serverTimestamp()
      })
      toast({ title: "Feedback Received", description: "Thank you for helping us improve CampusSpend!" })
      setComment("")
      setSelectedRating(null)
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Failed to send feedback." })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <DashboardShell>
      <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom duration-1000">
        
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-headline font-bold text-white neon-text-glow">User <span className="text-primary">Feedback</span></h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Help us engineer a better experience for the campus community.
          </p>
        </div>

        <GlassCard className="p-12 border-white/10 space-y-12 bg-white/5 backdrop-blur-3xl relative overflow-hidden">
          
          <div className="flex justify-center gap-6 md:gap-12">
            {ratings.map((rate) => (
              <button
                key={rate.id}
                onClick={() => setSelectedRating(rate.id)}
                className={cn(
                  "group relative transition-all duration-300",
                  selectedRating === rate.id ? "scale-125" : "hover:scale-110 opacity-60 hover:opacity-100"
                )}
              >
                <div className={cn(
                  "w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all",
                  selectedRating === rate.id && rate.shadow,
                  selectedRating === rate.id && "bg-white/10 border-white/20"
                )}>
                  <rate.icon className={cn("w-8 h-8 md:w-10 md:h-10", rate.color)} />
                </div>
              </button>
            ))}
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
               <h3 className="text-xl font-headline font-bold text-center text-white/90">Share your thoughts...</h3>
               <Textarea 
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="What can we improve?" 
                  className="min-h-[180px] bg-white/5 border-white/10 rounded-2xl p-6 focus:border-primary/50 transition-all text-lg"
               />
            </div>

            <div className="space-y-3">
               <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">Feedback Category</p>
               <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="h-14 bg-white/5 border-white/10 rounded-2xl px-6 focus:ring-primary/30">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-white/10">
                    <SelectItem value="service">Vendor Service</SelectItem>
                    <SelectItem value="app">App Experience</SelectItem>
                    <SelectItem value="pricing">Pricing & Deals</SelectItem>
                    <SelectItem value="other">General Feedback</SelectItem>
                  </SelectContent>
               </Select>
            </div>

            <div className="flex justify-center pt-4">
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full max-w-md h-16 rounded-2xl bg-gradient-to-r from-primary to-secondary text-xl font-bold shadow-[0_0_40px_rgba(239,26,184,0.4)]"
              >
                {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : <Send className="w-6 h-6 mr-2" />}
                Submit Report
              </Button>
            </div>
          </div>

          <div className="text-center pt-8 border-t border-white/5">
            <p className="text-sm text-muted-foreground font-medium">Your input directly influences our development roadmap.</p>
          </div>
        </GlassCard>

        <div className="text-center py-8 border-t border-white/5">
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">© 2024 CampusSpend. Experience Engineering Suite.</p>
        </div>
      </div>
    </DashboardShell>
  )
}
