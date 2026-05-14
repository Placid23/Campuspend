
"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
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
  FileUp,
  FileCheck
} from "lucide-react"
import { useFirestore, useUser, setDocumentNonBlocking } from "@/firebase"
import { collection, doc, serverTimestamp } from "firebase/firestore"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import * as XLSX from 'xlsx'

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
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [csvContent, setCsvContent] = useState("")
  const [parsedData, setParsedProducts] = useState<ParsedProduct[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isParsing, setIsParsing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  // Auto-parse on content change
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
        
        const priceNum = parseFloat(price?.replace(/[^0-9.]/g, '') || "0")
        if (isNaN(priceNum)) return null

        return {
          name: name || "Untitled Item",
          category: category?.toLowerCase() || "fast-food",
          price: priceNum,
          stock: parseInt(stock || "0") || 0,
          description: description || "No description provided."
        }
      }).filter((p): p is ParsedProduct => p !== null)

      setParsedProducts(products)
    } catch (err) {
      console.error(err)
    } finally {
      setIsParsing(false)
    }
  }

  const handleFile = async (file: File) => {
    const isExcel = file.name.endsWith(".xlsx") || file.name.endsWith(".xls")
    const isCSV = file.name.endsWith(".csv") || file.name.endsWith(".txt")

    if (!isExcel && !isCSV) {
      toast({ variant: "destructive", title: "Format Error", description: "Please upload .xlsx, .xls, or .csv files." })
      return
    }

    setIsParsing(true)
    const reader = new FileReader()

    if (isExcel) {
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer)
          const workbook = XLSX.read(data, { type: 'array' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const csv = XLSX.utils.sheet_to_csv(worksheet)
          setCsvContent(csv)
          toast({ title: "Excel Extracted", description: "Spreadsheet data mapped to ingestion buffer." })
        } catch (err) {
          toast({ variant: "destructive", title: "Parse Error", description: "Failed to read Excel workbook." })
        } finally {
          setIsParsing(false)
        }
      }
      reader.readAsArrayBuffer(file)
    } else {
      reader.onload = (e) => {
        setCsvContent(e.target?.result as string)
        setIsParsing(false)
      }
      reader.readAsText(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
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

      toast({ title: "Inventory Synced", description: `${parsedData.length} nodes successfully added to catalog.` })
      
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
          <h1 className="text-4xl font-headline font-bold text-white tracking-tight">Catalog <span className="text-primary neon-text-glow">Ingester</span></h1>
          <p className="text-muted-foreground text-sm max-w-xl font-medium">Native .xlsx and .csv support. Drag, drop, and automate your menu deployment.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-5 space-y-6">
            <GlassCard className="p-0 border-white/10 bg-black/20 overflow-hidden relative group">
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "p-12 border-2 border-dashed transition-all duration-500 cursor-pointer flex flex-col items-center justify-center text-center gap-6 group",
                  isDragging 
                    ? "bg-primary/20 border-primary shadow-[0_0_50px_rgba(239,26,184,0.3)] scale-[0.98]" 
                    : "bg-white/5 border-white/10 hover:border-primary/40 hover:bg-white/[0.07]"
                )}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".csv,.txt,.xlsx,.xls"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                
                <div className="relative">
                  <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className={cn(
                    "relative w-20 h-20 rounded-3xl flex items-center justify-center border transition-all duration-500",
                    isDragging ? "bg-primary text-white border-white/20 rotate-12" : "bg-white/5 border-white/10 text-primary"
                  )}>
                    {isDragging ? <FileCheck className="w-10 h-10 animate-bounce" /> : <FileUp className="w-10 h-10" />}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-headline font-bold text-white">Drop Excel or CSV</h3>
                  <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Native spreadsheet ingestion node</p>
                </div>
              </div>

              <div className="p-8 space-y-6 bg-white/5 border-t border-white/10">
                 <div className="p-6 rounded-3xl bg-black/40 border border-white/5 space-y-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                       <Info className="w-3.5 h-3.5" /> Spreadsheet Column Map
                    </p>
                    <div className="grid grid-cols-5 gap-2 text-[8px] font-bold uppercase tracking-tighter text-center text-muted-foreground">
                       <div className="p-2 rounded-lg bg-white/5 border border-white/5">Name</div>
                       <div className="p-2 rounded-lg bg-white/5 border border-white/5">Cat.</div>
                       <div className="p-2 rounded-lg bg-white/5 border border-white/5">Price</div>
                       <div className="p-2 rounded-lg bg-white/5 border border-white/5">Stock</div>
                       <div className="p-2 rounded-lg bg-white/5 border border-white/5">Desc.</div>
                    </div>
                 </div>
                 
                 <div className="space-y-3">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 ml-1">Manual Buffer (CSV)</p>
                   <Textarea 
                     value={csvContent}
                     onChange={(e) => setCsvContent(e.target.value)}
                     placeholder="Paste CSV rows here..."
                     className="min-h-[140px] bg-black/40 border-white/10 rounded-2xl p-6 font-mono text-xs focus:border-primary/50 transition-all resize-none"
                   />
                 </div>

                 <Button 
                   variant="outline" 
                   onClick={() => {setCsvContent(""); setParsedProducts([])}}
                   className="w-full h-12 rounded-xl border-white/10 hover:bg-rose-500/10 hover:text-rose-500 font-bold uppercase tracking-widest text-[10px]"
                 >
                   <Trash2 className="w-4 h-4 mr-2" /> Reset Ingestion Node
                 </Button>
              </div>
            </GlassCard>
          </div>

          <div className="lg:col-span-7 space-y-6">
            <GlassCard className="p-0 border-white/10 bg-white/5 backdrop-blur-3xl overflow-hidden min-h-[480px] flex flex-col">
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
                 <div className="space-y-1">
                    <h3 className="text-lg font-headline font-bold text-white">Ingestion Preview</h3>
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">Real-time data verification node</p>
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
                {isParsing ? (
                   <div className="flex flex-col items-center justify-center h-full py-40 gap-4">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Extracting Spreadsheet Grid...</p>
                   </div>
                ) : parsedData.length > 0 ? (
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
                     <p className="text-[10px] font-bold uppercase tracking-[0.4em]">Awaiting Spreadsheet Stream</p>
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
                     Execute Bulk Sync
                   </Button>
                </div>
              )}
            </GlassCard>
          </div>

        </div>

        <div className="text-center py-12 border-t border-white/5">
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.5em]">© 2024 CafePay Wallet • Industrial Ingestion Node v4.4</p>
        </div>

      </div>
    </VendorShell>
  )
}
