"use client"

import * as React from "react"
import { useState, useRef, useEffect } from "react"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Bot, 
  Send, 
  X, 
  MessageSquare, 
  Loader2, 
  BrainCircuit,
  Zap,
  Sparkles
} from "lucide-react"
import { spendingChat } from "@/ai/flows/spending-chat-flow"
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy, limit } from "firebase/firestore"
import { cn } from "@/lib/utils"

export function SpendingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<{role: 'user' | 'model', content: string}[]>([
    { role: 'model', content: "Node Active. I am the CafePay Intelligent Agent. How can I help you optimize your spending tree today?" }
  ])
  
  const scrollRef = useRef<HTMLDivElement>(null)
  const { user } = useUser()
  const db = useFirestore()

  const expensesQuery = useMemoFirebase(() => {
    if (!user) return null
    return query(collection(db, "users", user.uid, "expenses"), orderBy("expenseDate", "desc"), limit(10))
  }, [db, user])

  const { data: expenses } = useCollection(expensesQuery)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    
    const userMsg = input.trim()
    setInput("")
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const context = expenses?.map(e => ({
        description: e.description,
        amount: e.amount,
        category: e.categoryId
      }))

      const response = await spendingChat({
        history: messages,
        currentMessage: userMsg,
        spendingContext: context
      })

      setMessages(prev => [...prev, { role: 'model', content: response }])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', content: "Connectivity error in the intelligence node. Please try again." }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-24 right-6 z-[60] flex flex-col items-end">
      {isOpen && (
        <GlassCard className="w-[320px] md:w-[400px] h-[500px] mb-4 p-0 overflow-hidden flex flex-col border-primary/20 shadow-[0_0_50px_rgba(239,26,184,0.15)] animate-in slide-in-from-bottom-4 duration-500">
          <div className="p-4 bg-gradient-to-r from-primary/20 to-secondary/20 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary border border-primary/20 shadow-inner">
                <BrainCircuit className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-white uppercase tracking-widest">CafePay AI Chat</p>
                <p className="text-[8px] text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-1">
                   <Zap className="w-2 h-2 animate-pulse" /> Intelligence Node Active
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 text-muted-foreground hover:text-white">
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide bg-black/20">
            {messages.map((m, i) => (
              <div key={i} className={cn("flex", m.role === 'user' ? "justify-end" : "justify-start")}>
                <div className={cn(
                  "max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed",
                  m.role === 'user' 
                    ? "bg-primary/20 border border-primary/30 text-white rounded-tr-none shadow-lg" 
                    : "bg-white/5 border border-white/10 text-muted-foreground rounded-tl-none"
                )}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 p-3 rounded-2xl rounded-tl-none">
                  <Loader2 className="w-4 h-4 text-primary animate-spin" />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-white/10 bg-black/40">
            <div className="flex gap-2">
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about your spending path..."
                className="h-10 bg-white/5 border-white/10 rounded-xl text-xs focus:border-primary/50"
              />
              <Button onClick={handleSend} disabled={loading} size="icon" className="h-10 w-10 shrink-0 rounded-xl bg-primary hover:bg-primary/90">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </GlassCard>
      )}

      <Button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-16 h-16 rounded-full shadow-[0_0_30px_rgba(239,26,184,0.3)] transition-all duration-500",
          isOpen ? "bg-rose-500 rotate-90" : "bg-primary hover:scale-110"
        )}
      >
        {isOpen ? <X className="w-8 h-8 text-white" /> : <MessageSquare className="w-8 h-8 text-white" />}
        {!isOpen && <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-background flex items-center justify-center animate-bounce">
          <Sparkles className="w-2.5 h-2.5 text-white" />
        </div>}
      </Button>
    </div>
  )
}
