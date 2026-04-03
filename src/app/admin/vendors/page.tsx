"use client"

import * as React from "react"
import { AdminShell } from "@/components/layout/AdminShell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  Search, 
  Plus, 
  Pencil, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  ChefHat,
  Pizza,
  BookOpen,
  Box,
  MoreVertical,
  Loader2,
  Store,
  UserX,
  UserCheck,
  Mail,
  Phone
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { format } from 'date-fns'
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function ManageVendorsPage() {
  const db = useFirestore()
  const { toast } = useToast()
  
  // State for UI filters
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [categoryFilter, setCategoryFilter] = React.useState("all")

  // 1. Fetch Vendors
  const vendorsQuery = useMemoFirebase(() => {
    return query(collection(db, "vendors"), orderBy("name", "asc"))
  }, [db])

  const { data: allVendors, isLoading } = useCollection(vendorsQuery)

  // 2. Filter Logic (Client-side)
  const filteredVendors = React.useMemo(() => {
    if (!allVendors) return []
    
    let result = [...allVendors]

    // Filter by Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(v => 
        v.name?.toLowerCase().includes(q) || 
        v.contactEmail?.toLowerCase().includes(q)
      )
    }

    // Filter by Status
    if (statusFilter !== 'all') {
      result = result.filter(v => (v.status || 'Active').toLowerCase() === statusFilter)
    }

    // Filter by Category (Service)
    if (categoryFilter !== 'all') {
      result = result.filter(v => v.service?.toLowerCase() === categoryFilter || v.category?.toLowerCase() === categoryFilter)
    }

    return result
  }, [allVendors, searchQuery, statusFilter, categoryFilter])

  // 3. Actions
  const handleToggleStatus = async (vendorId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Inactive' ? 'Active' : 'Inactive'
    try {
      await updateDoc(doc(db, "vendors", vendorId), {
        status: newStatus,
        updatedAt: serverTimestamp()
      })
      toast({
        title: "Status Updated",
        description: `Vendor store is now ${newStatus}.`
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update vendor status."
      })
    }
  }

  const handleDeleteVendor = async (vendorId: string) => {
    try {
      await deleteDoc(doc(db, "vendors", vendorId))
      toast({
        title: "Vendor Deleted",
        description: "Vendor record has been removed from the marketplace."
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete vendor record."
      })
    }
  }

  return (
    <AdminShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        
        {/* Page Title */}
        <h1 className="text-3xl font-headline font-bold text-white tracking-tight">Manage Vendors</h1>

        <GlassCard className="p-8 border-white/10 bg-black/20 backdrop-blur-3xl overflow-hidden relative">
          
          {/* Header Actions / Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
            <div className="flex gap-4 w-full md:w-auto">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="h-12 w-full md:w-44 bg-white/5 border-white/10 rounded-2xl px-6 focus:ring-primary/30">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="fast-food">Fast Food</SelectItem>
                  <SelectItem value="drinks">Drinks</SelectItem>
                  <SelectItem value="books">Books</SelectItem>
                  <SelectItem value="stationery">Stationery</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-12 w-full md:w-44 bg-white/5 border-white/10 rounded-2xl px-6 focus:ring-primary/30">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative flex-1 w-full group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search vendors..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 bg-white/5 border-white/10 rounded-2xl pl-14 pr-6 text-sm focus:border-primary/50 transition-all placeholder:text-muted-foreground/40"
              />
            </div>
          </div>

          {/* Data Table */}
          <div className="rounded-2xl border border-white/5 overflow-hidden min-h-[400px] flex flex-col justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center gap-4 py-20">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Fetching Merchant Directory...</p>
              </div>
            ) : filteredVendors.length > 0 ? (
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground pl-8">Store Name</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground">Category</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground">Contact Email</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground">Joined</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground text-center">Status</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground text-right pr-8">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredVendors.map((vendor) => (
                    <TableRow key={vendor.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                      <TableCell className="pl-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                            <Store className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{vendor.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground uppercase font-bold text-[10px] tracking-widest">
                        {vendor.service || vendor.category || 'General'}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{vendor.contactEmail}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {vendor.createdAt ? format(new Date(vendor.createdAt?.seconds * 1000 || vendor.createdAt), 'MMM dd, yyyy') : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <div className={cn(
                            "px-5 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest",
                            (vendor.status || 'Active') === 'Active' 
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                              : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                          )}>
                            {vendor.status || 'Active'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleToggleStatus(vendor.id, vendor.status || 'Active')}
                            title={ (vendor.status || 'Active') === 'Active' ? "Deactivate Store" : "Activate Store" }
                            className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 hover:bg-amber-500/20 hover:border-amber-500/40 group/btn transition-all"
                          >
                            {(vendor.status || 'Active') === 'Active' ? (
                              <UserX className="w-4 h-4 text-muted-foreground group-hover/btn:text-amber-500" />
                            ) : (
                              <UserCheck className="w-4 h-4 text-muted-foreground group-hover/btn:text-emerald-500" />
                            )}
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 hover:bg-rose-500/20 hover:border-rose-500/40 group/btn transition-all"
                              >
                                <Trash2 className="w-4 h-4 text-muted-foreground group-hover/btn:text-rose-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-card border-white/10">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-white font-headline">Remove vendor from marketplace?</AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground">
                                  This will remove <strong>{vendor.name}</strong> from the student marketplace. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-white/10 hover:bg-white/5">Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteVendor(vendor.id)}
                                  className="bg-rose-500 hover:bg-rose-600 text-white"
                                >
                                  Delete Vendor
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-20 space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto">
                  <Search className="w-8 h-8 text-muted-foreground/20" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">No vendors found</h3>
                  <p className="text-sm text-muted-foreground">Adjust your search or filters to see results.</p>
                </div>
              </div>
            )}
          </div>

          {/* Table Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              Showing {filteredVendors.length} of {allVendors?.length || 0} vendors
            </p>
          </div>
        </GlassCard>

        {/* Footer */}
        <div className="text-center py-8 border-t border-white/5">
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">© 2024 CampusSpend. Marketplace Operations.</p>
        </div>

      </div>
    </AdminShell>
  )
}
