"use client"

import * as React from "react"
import { AdminShell } from "@/components/layout/AdminShell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { 
  Search, 
  Trash2, 
  Loader2,
  Store,
  UserX,
  UserCheck,
  ShieldCheck,
  ShieldAlert,
  Plus,
  AlertTriangle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, doc, updateDoc, deleteDoc, serverTimestamp, setDoc } from 'firebase/firestore'
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
  
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  
  // Add Vendor State
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [newVendorData, setNewVendorData] = React.useState({
    name: "",
    email: "",
    pickupLocation: "",
  })

  // Stability: Fetch collection directly
  const vendorsQuery = useMemoFirebase(() => collection(db, "vendors"), [db])
  const { data: allVendors, isLoading, error } = useCollection(vendorsQuery)

  const filteredVendors = React.useMemo(() => {
    if (!allVendors) return []
    let result = [...allVendors]
    
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(v => 
        (v.name || "").toLowerCase().includes(q) || 
        (v.contactEmail || "").toLowerCase().includes(q)
      )
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(v => (v.status || 'Active').toLowerCase() === statusFilter)
    }
    
    return result.sort((a, b) => (a.name || "").localeCompare(b.name || ""))
  }, [allVendors, searchQuery, statusFilter])

  const handleAddVendor = async () => {
    if (!newVendorData.name || !newVendorData.email) return
    setIsSaving(true)
    
    const vendorId = `VND-${Date.now()}`
    const vendorRef = doc(db, "vendors", vendorId)
    const profileRef = doc(db, "userProfiles", vendorId)

    const vendorDoc = {
      id: vendorId,
      userId: vendorId,
      name: newVendorData.name,
      contactEmail: newVendorData.email,
      pickupLocation: newVendorData.pickupLocation,
      status: "Active",
      isVerified: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    const profileDoc = {
      id: vendorId,
      firebaseUid: vendorId,
      name: newVendorData.name,
      email: newVendorData.email,
      role: "vendor",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Initiate non-blocking writes
    setDoc(vendorRef, vendorDoc)
      .then(() => setDoc(profileRef, profileDoc))
      .then(() => {
        toast({ title: "Merchant Initialized", description: "New vendor profile created in registry." })
        setIsAddDialogOpen(false)
        setNewVendorData({ name: "", email: "", pickupLocation: "" })
      })
      .catch((err) => {
        console.error(err)
        toast({ variant: "destructive", title: "Registration Failed" })
      })
      .finally(() => setIsSaving(false))
  }

  const handleToggleStatus = async (vendorId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Inactive' ? 'Active' : 'Inactive'
    updateDoc(doc(db, "vendors", vendorId), {
      status: newStatus,
      updatedAt: serverTimestamp()
    }).then(() => toast({ title: "Status Updated" }))
  }

  const handleToggleVerification = async (vendorId: string, currentVerified: boolean) => {
    updateDoc(doc(db, "vendors", vendorId), {
      isVerified: !currentVerified,
      updatedAt: serverTimestamp()
    }).then(() => toast({ title: "Verification Updated" }))
  }

  const handleDeleteVendor = async (vendorId: string) => {
    deleteDoc(doc(db, "vendors", vendorId))
      .then(() => deleteDoc(doc(db, "userProfiles", vendorId)))
      .then(() => toast({ title: "Vendor Deleted" }))
  }

  if (error) {
    return (
      <AdminShell>
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4 text-center">
          <AlertTriangle className="w-12 h-12 text-rose-500" />
          <h2 className="text-xl font-bold">Failed to Load Registry</h2>
          <p className="text-muted-foreground text-sm max-w-xs">{error.message}</p>
          <Button onClick={() => window.location.reload()} variant="outline">Retry Sync</Button>
        </div>
      </AdminShell>
    )
  }

  return (
    <AdminShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h1 className="text-3xl font-headline font-bold text-white tracking-tight">Manage Vendors</h1>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="h-12 px-8 rounded-2xl bg-gradient-to-r from-primary to-secondary font-bold shadow-[0_0_20px_rgba(239,26,184,0.3)]"
          >
            <Plus className="w-5 h-5 mr-2" /> Add New Vendor
          </Button>
        </div>

        <GlassCard className="p-8 border-white/10 bg-black/20 backdrop-blur-3xl overflow-hidden relative">
          <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
            <div className="flex gap-4 w-full md:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-12 w-full md:w-44 bg-white/5 border-white/10 rounded-2xl px-6">
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
                className="h-12 bg-white/5 border-white/10 rounded-2xl pl-14 pr-6 text-sm"
              />
            </div>
          </div>

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
                    <TableHead className="text-[10px] font-bold uppercase py-6 pl-8">Store Name</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase py-6">Verification</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase py-6">Joined</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase py-6 text-center">Status</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase py-6 text-right pr-8">Actions</TableHead>
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
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{vendor.name || "Untitled Store"}</span>
                            <span className="text-[10px] text-muted-foreground font-mono">{vendor.id.substring(0, 8)}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          onClick={() => handleToggleVerification(vendor.id, !!vendor.isVerified)}
                          variant="ghost" 
                          size="sm" 
                          className={cn(
                            "h-9 px-4 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all",
                            vendor.isVerified 
                              ? "bg-amber-500/10 border-amber-500/30 text-amber-500" 
                              : "bg-white/5 border-white/10 text-muted-foreground"
                          )}
                        >
                          {vendor.isVerified ? (
                            <><ShieldCheck className="w-3 h-3 mr-2" /> Verified</>
                          ) : (
                            <><ShieldAlert className="w-3 h-3 mr-2" /> Unverified</>
                          )}
                        </Button>
                      </TableCell>
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
                            className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 hover:bg-amber-500/20 transition-all"
                          >
                            {(vendor.status || 'Active') === 'Active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 hover:bg-rose-500/20 transition-all">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-card border-white/10">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-white font-headline">Delete vendor account?</AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground">This will permanently purge the store and merchant profile from the system infrastructure.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-white/10 hover:bg-white/5">Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteVendor(vendor.id)}
                                  className="bg-rose-500 hover:bg-rose-600 text-white"
                                >
                                  Purge Data
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
              <div className="text-center py-20">
                <Search className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-white">No vendors found</h3>
                <p className="text-sm text-muted-foreground mt-2">Try syncing the demo registry from the dashboard.</p>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Add Vendor Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="bg-card border-white/10 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline font-bold text-white">Add New Merchant</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-widest">Public Store Name</Label>
                <Input 
                  value={newVendorData.name}
                  onChange={(e) => setNewVendorData({...newVendorData, name: e.target.value})}
                  className="bg-white/5 border-white/10 h-12 rounded-xl"
                  placeholder="e.g. Campus Bites"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-widest">Official Email</Label>
                <Input 
                  value={newVendorData.email}
                  onChange={(e) => setNewVendorData({...newVendorData, email: e.target.value})}
                  className="bg-white/5 border-white/10 h-12 rounded-xl"
                  placeholder="merchant@university.edu"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-widest">Default Pickup Location</Label>
                <Input 
                  value={newVendorData.pickupLocation}
                  onChange={(e) => setNewVendorData({...newVendorData, pickupLocation: e.target.value})}
                  className="bg-white/5 border-white/10 h-12 rounded-xl"
                  placeholder="e.g. Block A Cafeteria"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)} className="rounded-xl">Cancel</Button>
              <Button 
                onClick={handleAddVendor} 
                disabled={isSaving || !newVendorData.name || !newVendorData.email}
                className="bg-primary hover:bg-primary/90 rounded-xl px-8 font-bold"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Initialize Merchant"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminShell>
  )
}
