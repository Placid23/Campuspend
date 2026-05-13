"use client"

import * as React from "react"
import { useState } from "react"
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
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Trash2,
  Database,
  Info
} from "lucide-react"
import { useFirestore, useUser, setDocumentNonBlocking } from "@/firebase"
import { collection, doc, serverTimestamp } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

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

  const handleParse = () => {
    if (!csvContent.trim()) return
    
    try {
      const lines = csvContent.split('\n')
      const products: ParsedProduct[] = lines.slice(1).map(line => {
        const [name, category, price, stock, description] = line.split(',').map(s => s.trim())
        return {
          name,
          category: category || "general",
          price: parseFloat(price) || 0,
          stock: parseInt(stock) || 0,
          description: description || ""
        }
      }).filter(p => p.name)

      setParsedProducts(products)
      toast({ title: "Extraction Successful", description: `${products.length} nodes identified from CSV buffer.` })
    } catch (err) {
      toast({ variant: "destructive", title: "Parsing Failed", description: "Verify CSV structure matches the template." })
    }
  }

  const handleSyncToCloud = () => {
    if (!user || parsedData.length === 0) return
    setIsProcessing(true)
    
    try {
      // Execute non-blocking writes for each product
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

      // Optimistic Success
      toast({ title: "Ingestion Initialized", description: "Catalog is synchronizing in the background." })
      
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
          <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Smart Bulk <span className="text-primary neon-text-glow">Ingester</span></h1>
          <p className="text-muted-foreground text-sm max-w-xl">High-fidelity catalog ingestion via CSV node. Copy data directly from Microsoft Excel.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Input Section */}
          <div className="lg:col-span-6 space-y-6">
            <GlassCard className="p-8 border-white/10 bg-black/20 space-y-6">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary border border-primary/20">
                   <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-headline font-bold text-white">CSV Buffer Ingestion</h3>
              </div>

              <div className="space-y-4">
                 <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                       <Info className="w-3 h-3 text-primary" /> Required Template Format
                    </p>
                    <code className="text-[10px] block font-mono text-primary/80 bg-black/40 p-3 rounded-lg overflow-x-auto whitespace-nowrap">
                       Name, Category, Price, Stock, Description
                    </code>
                 </div>
                 
                 <Textarea 
                   value={csvContent}
                   onChange={(e) => setCsvContent(e.target.value)}
                   placeholder="Paste your CSV lines here... (Skip headers)"
                   className="min-h-[240px] bg-white/5 border-white/10 rounded-2xl p-6 font-mono text-sm focus:border-primary/50 transition-all"
                 />

                 <div className="flex gap-4">
                    <Button 
                      onClick={handleParse} 
                      className="flex-1 h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 font-bold uppercase tracking-widest text-xs"
                    >
                      Parse Buffer
                    </Button>
                    <Button 
                      variant="ghost" 
                      onClick={() => {setCsvContent(""); setParsedProducts([])}}
                      className="h-14 w-14 rounded-2xl border border-white/5 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                 </div>
              </div>
            </GlassCard>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-6 space-y-6">
            <GlassCard className="p-0 border-white/10 bg-white/5 backdrop-blur-3xl overflow-hidden min-h-[400px]">
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                 <h3 className="text-lg font-headline font-bold text-white">Extraction Preview</h3>
                 <span className="px-4 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">{parsedData.length} Items</span>
              </div>
              
              <div className="max-h-[500px] overflow-y-auto scrollbar-hide">
                {parsedData.length > 0 ? (
                  <Table>
                    <TableHeader className="bg-white/5">
                      <TableRow className="border-white/5 hover:bg-transparent">
                        <TableHead className="text-[10px] font-bold uppercase py-4 pl-8">Item</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase py-4">Price</TableHead>
                        <TableHead className="text-[10px] font-bold uppercase py-4">Stock</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {parsedData.map((item, i) => (
                        <TableRow key={i} className="border-white/5 hover:bg-white/5 transition-colors">
                          <TableCell className="pl-8 py-4 font-bold text-sm text-white/80">{item.name}</TableCell>
                          <TableCell className="text-sm text-primary">₦{item.price.toLocaleString()}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{item.stock} u</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex flex-col items-center justify-center py-40 gap-4 opacity-40">
                     <Database className="w-12 h-12 text-muted-foreground" />
                     <p className="text-[10px] font-bold uppercase tracking-widest">Awaiting Extraction...</p>
                  </div>
                )}
              </div>

              {parsedData.length > 0 && (
                <div className="p-8 border-t border-white/5 bg-primary/5">
                   <Button 
                     disabled={isProcessing}
                     onClick={handleSyncToCloud}
                     className="w-full h-16 rounded-[2rem] bg-gradient-to-r from-primary to-secondary text-base font-bold shadow-[0_0_40px_rgba(239,26,184,0.3)] hover:opacity-90 active:scale-95 transition-all"
                   >
                     {isProcessing ? <Loader2 className="w-6 h-6 animate-spin mr-3" /> : <Upload className="w-5 h-5 mr-3" />}
                     Sync {parsedData.length} Items to Catalog
                   </Button>
                </div>
              )}
            </GlassCard>
          </div>

        </div>

        <div className="text-center py-12 border-t border-white/5">
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.5em]">© 2024 CafePay Wallet • High-Velocity Ingestion Node v4.1</p>
        </div>

      </div>
    </VendorShell>
  )
}
