"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { VendorShell } from "@/components/layout/VendorShell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import { 
  FileSpreadsheet, 
  Upload, 
  Loader2,
  Trash2,
  Database,
  Info,
  CheckCircle,
  Zap,
  Sparkles
} from "lucide-react"
import { useFirestore, useUser, setDocumentNonBlocking } from "@/firebase"
import { collection, doc, serverTimestamp } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

interface ParsedProduct {
  name: string;
  category: string;
  price: number;
  stock: number;
  description: string;
}

export default function BulkImportPage() {
  const { user } = useUser()
  const db = useFirestore()
  const { toast } = useToast()
  const router = useRouter()
  
  const [csvContent, setCsvContent] = useState("")
  const [parsedData, setParsedProducts] = useState<ParsedProduct[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isParsing, setIsParsing] = useState(false)

  // Auto-parse on content change (Debounced)
  useEffect(() => {
    if (!csvContent.trim()) {
      setParsedProducts([])
      return
    }

    const timer = setTimeout(() => {
      handleParse()
    }, 600)

    return () => clearTimeout(timer)
  }, [csvContent])

  const handleParse = () => {
    setIsParsing(true)
    try {
      const lines = csvContent.split('\n')
      const products: ParsedProduct[] = lines.map(line => {
        const parts = line.split(',')
        if (parts.length < 3) return null
        const [name, category, price, stock, description] = parts.map(s => s?.trim())
        
        const priceNum = parseFloat(price?.replace(/[^0-9.]/g, ''))
        if (isNaN(priceNum)) return null

        return {
          name: name || "Untitled Item",
          category: category?.toLowerCase() || "fast-food",
          price: priceNum,
          stock: parseInt(stock) || 0,
          description: description || "No description provided."
        }
      }).filter((p): p is ParsedProduct => p !== null)

      setParsedProducts(products)
      if (products.length > 0) {
        toast({ title: "Nodes Identified", description: `${products.length} catalog items extracted from buffer.` })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsParsing(false)
    }
  }

  const handleSyncToCloud = () => {
    if (!user || parsedData.length === 0) return
    setIsProcessing(true)
    
    try {
      parsedData.forEach(product => {
        const productRef = doc(collection(db, "products"))
        setDocumentNonBlocking(productRef, {
          ...product,
          id: productRef.id,
          vendorOwnerId: user.uid,
          isActive: true,
          imageUrl: `https://picsum.photos/seed/${productRef.id}/600/600`,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        }, { merge: true })
      })

      toast({ title: "Inventory Synced", description: "Catalog is synchronizing across the marketplace." })
      
      setTimeout(() => {
        router.push("/vendor/manage")
      }, 1000)
    } catch (err) {
      toast({ variant: "destructive", title: "Sync Failed" })
      setIsProcessing(false)
    }
  }

  return (
    <VendorShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        
        <div className="space-y-2">
          <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Bulk Catalog <span className="text-primary neon-text-glow">Ingester</span></h1>
          <p className="text-muted-foreground text-sm max-w-xl font-medium">Automatic extraction node for high-velocity menu creation from Excel data.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-5 space-y-6">
            <GlassCard className="p-8 border-white/10 bg-black/20 space-y-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Sparkles className="w-32 h-32 text-primary" />
              </div>

              <div className="flex items-center gap-3 relative z-10">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-inner">
                   <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-headline font-bold text-white">Excel Buffer</h3>
              </div>

              <div className="space-y-6 relative z-10">
                 <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                       <Info className="w-3.5 h-3.5" /> Extraction Column Map
                    </p>
                    <div className="grid grid-cols-5 gap-2 text-[8px] font-bold uppercase tracking-tighter text-center text-muted-foreground">
                       <div className="p-2 rounded-lg bg-black/40 border border-white/5">Name</div>
                       <div className="p-2 rounded-lg bg-black/40 border border-white/5">Cat.</div>
                       <div className="p-2 rounded-lg bg-black/40 border border-white/5">Price</div>
                       <div className="p-2 rounded-lg bg-black/40 border border-white/5">Stock</div>
                       <div className="p-2 rounded-lg bg-black/40 border border-white/5">Desc.</div>
                    </div>
                    <p className="text-[9px] text-muted-foreground italic">Tip: Paste rows without headers from your spreadsheet.</p>
                 </div>
                 
                 <div className="relative">
                   <Textarea 
                     value={csvContent}
                     onChange={(e) => setCsvContent(e.target.value)}
                     placeholder="Paste rows here... (Example: Burger, Fast Food, 2500, 50, Beef patty)"
                     className="min-h-[280px] bg-white/5 border-white/10 rounded-2xl p-6 font-mono text-xs focus:border-primary/50 transition-all resize-none shadow-inner"
                   />
                   {isParsing && (
                     <div className="absolute inset-0 bg-black/40 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                     </div>
                   )}
                 </div>

                 <div className="flex gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => {setCsvContent(""); setParsedProducts([])}}
                      className="flex-1 h-14 rounded-2xl border-white/10 hover:bg-rose-500/10 hover:text-rose-500 font-bold uppercase tracking-widest text-[10px] transition-all"
                    >
                      <Trash2 className="w-4 h-4 mr-2" /> Clear Buffer
                    </Button>
                 </div>
              </div>
            </GlassCard>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <GlassCard className="p-0 border-white/10 bg-white/5 backdrop-blur-3xl overflow-hidden min-h-[480px] flex flex-col">
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
                 <div className="space-y-1">
                    <h3 className="text-lg font-headline font-bold text-white">Ingestion Preview</h3>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Real-time data verification</p>
                 </div>
                 <div className={cn(
                   "px-5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2",
                   parsedData.length > 0 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg" : "bg-white/5 text-muted-foreground"
                 )}>
                   {parsedData.length > 0 && <Zap className="w-3 h-3 animate-pulse" />}
                   {parsedData.length} Nodes Ready
                 </div>
              </div>
              
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                {parsedData.length > 0 ? (
                  <Table>
                    <TableHeader className="bg-black/20">
                      <TableRow className="border-white/5 hover:bg-transparent">
                        <TableHead className="text-[9px] font-bold uppercase py-4 pl-8">Listing Detail</TableHead>
                        <TableHead className="text-[9px] font-bold uppercase py-4">Price (₦)</TableHead>
                        <TableHead className="text-[9px] font-bold uppercase py-4">Stock</TableHead>
                        <TableHead className="text-[9px] font-bold uppercase py-4 text-center">Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedData.map((item, i) => (
                        <TableRow key={i} className="border-white/5 hover:bg-white/5 transition-colors group">
                          <TableCell className="pl-8 py-4">
                             <div className="space-y-0.5">
                                <p className="text-sm font-bold text-white/90 group-hover:text-primary transition-colors">{item.name}</p>
                                <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-tighter">{item.category}</p>
                             </div>
                          </TableCell>
                          <TableCell className="text-sm font-bold text-white/80">₦{item.price.toLocaleString()}</TableCell>
                          <TableCell className="text-sm text-white/60">{item.stock} u</TableCell>
                          <TableCell>
                             <div className="flex justify-center">
                                <CheckCircle className="w-4 h-4 text-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
                             </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-40 gap-4 opacity-40">
                     <div className="w-20 h-20 rounded-[2.5rem] border-2 border-dashed border-muted-foreground/30 flex items-center justify-center animate-pulse">
                        <Database className="w-8 h-8 text-muted-foreground" />
                     </div>
                     <p className="text-[10px] font-bold uppercase tracking-[0.4em]">Awaiting Data Paste</p>
                  </div>
                )}
              </div>

              {parsedData.length > 0 && (
                <div className="p-8 border-t border-white/5 bg-primary/5">
                   <Button 
                     disabled={isProcessing}
                     onClick={handleSyncToCloud}
                     className="w-full h-16 rounded-[1.5rem] bg-gradient-to-r from-primary to-secondary text-base font-bold shadow-[0_0_40px_rgba(239,26,184,0.3)] hover:opacity-90 active:scale-[0.98] transition-all"
                   >
                     {isProcessing ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : <Upload className="w-6 h-6 mr-3" />}
                     Execute Catalog Sync
                   </Button>
                </div>
              )}
            </GlassCard>
          </div>

        </div>

        <div className="text-center py-12 border-t border-white/5">
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.5em]">© 2024 CafePay Wallet • Academic Ingestion Node v4.2</p>
        </div>

      </div>
    </VendorShell>
  )
}
