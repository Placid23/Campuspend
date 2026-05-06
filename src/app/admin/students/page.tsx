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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Search, 
  Plus, 
  Trash2, 
  Loader2,
  UserX,
  UserCheck,
  GraduationCap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, where, doc, updateDoc, deleteDoc, setDoc, serverTimestamp } from 'firebase/firestore'
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

export default function ManageStudentsPage() {
  const db = useFirestore()
  const { toast } = useToast()
  
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  
  // Add Student State
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [isSaving, setIsSaving] = React.useState(false)
  const [newStudentData, setNewStudentData] = React.useState({
    name: "",
    email: "",
    walletBalance: "5000"
  })

  const studentsQuery = useMemoFirebase(() => {
    return query(collection(db, "userProfiles"), where("role", "==", "student"))
  }, [db])

  const { data: allStudents, isLoading } = useCollection(studentsQuery)

  const filteredStudents = React.useMemo(() => {
    if (!allStudents) return []
    let result = [...allStudents]
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(s => 
        s.name?.toLowerCase().includes(q) || 
        s.email?.toLowerCase().includes(q)
      )
    }
    if (statusFilter !== 'all') {
      result = result.filter(s => (s.status || 'Active').toLowerCase() === statusFilter)
    }
    return result.sort((a, b) => (a.name || "").localeCompare(b.name || ""))
  }, [allStudents, searchQuery, statusFilter])

  const handleAddStudent = async () => {
    if (!newStudentData.name || !newStudentData.email) return
    setIsSaving(true)
    try {
      const studentId = `STU-${Date.now()}`
      const profileRef = doc(db, "userProfiles", studentId)

      const profileDoc = {
        id: studentId,
        firebaseUid: studentId,
        name: newStudentData.name,
        email: newStudentData.email,
        role: "student",
        walletBalance: parseFloat(newStudentData.walletBalance),
        monthlyBudget: 8000,
        status: "Active",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      }

      await setDoc(profileRef, profileDoc)
      toast({ title: "Student Registered", description: "Account profile added to registry." })
      setIsAddDialogOpen(false)
      setNewStudentData({ name: "", email: "", walletBalance: "5000" })
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not initialize student record." })
    } finally {
      setIsSaving(false)
    }
  }

  const handleToggleStatus = async (studentId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Suspended' ? 'Active' : 'Suspended'
    try {
      await updateDoc(doc(db, "userProfiles", studentId), {
        status: newStatus,
        updatedAt: serverTimestamp()
      })
      toast({ title: "Status Updated", description: `Account is now ${newStatus}.` })
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to update account status." })
    }
  }

  const handleDeleteStudent = async (studentId: string) => {
    try {
      await deleteDoc(doc(db, "userProfiles", studentId))
      toast({ title: "Student Removed", description: "Record purged from database." })
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to delete student record." })
    }
  }

  return (
    <AdminShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h1 className="text-3xl font-headline font-bold text-white tracking-tight">Student Directory</h1>
          <Button 
            onClick={() => setIsAddDialogOpen(true)}
            className="h-12 px-8 rounded-2xl bg-gradient-to-r from-primary to-secondary font-bold shadow-[0_0_20px_rgba(239,26,184,0.3)]"
          >
            <Plus className="w-5 h-5 mr-2" /> Add New Student
          </Button>
        </div>

        <GlassCard className="p-8 border-white/10 bg-black/20 backdrop-blur-3xl overflow-hidden relative">
          
          <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
            <div className="flex gap-4 w-full md:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-12 w-full md:w-44 bg-white/5 border-white/10 rounded-2xl px-6">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative flex-1 w-full group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search by name or email..." 
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
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Scanning Directory...</p>
              </div>
            ) : filteredStudents.length > 0 ? (
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-[10px] font-bold uppercase py-6 pl-8">Student</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase py-6">Email</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase py-6">Wallet</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase py-6 text-center">Status</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase py-6 text-right pr-8">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                      <TableCell className="pl-8 py-5">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-10 h-10 border border-white/10 shadow-lg">
                            <AvatarImage src={`https://picsum.photos/seed/${student.id}/100/100`} />
                            <AvatarFallback>{student.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{student.email}</TableCell>
                      <TableCell className="text-sm font-bold text-white/90">₦{student.walletBalance?.toLocaleString()}</TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <div className={cn(
                            "px-5 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest",
                            (student.status || 'Active') === 'Active' 
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                              : "bg-rose-500/10 border-rose-500/20 text-rose-400"
                          )}>
                            {student.status || 'Active'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right pr-8">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleToggleStatus(student.id, student.status || 'Active')}
                            className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 hover:bg-amber-500/20 transition-all"
                          >
                            {(student.status || 'Active') === 'Active' ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 hover:bg-rose-500/20 transition-all">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-card border-white/10">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-white font-headline">Purge student record?</AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground">This will permanently delete the identity and expenditure history for <strong>{student.name}</strong>.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-white/10 hover:bg-white/5">Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteStudent(student.id)}
                                  className="bg-rose-500 hover:bg-rose-600 text-white"
                                >
                                  Confirm Purge
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
                <GraduationCap className="w-12 h-12 text-muted-foreground/20 mx-auto" />
                <h3 className="text-lg font-bold text-white">Registry Empty</h3>
              </div>
            )}
          </div>
        </GlassCard>

        {/* Add Student Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="bg-card border-white/10 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline font-bold text-white">Enroll New Student</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-widest">Full Name</Label>
                <Input 
                  value={newStudentData.name}
                  onChange={(e) => setNewStudentData({...newStudentData, name: e.target.value})}
                  className="bg-white/5 border-white/10 h-12 rounded-xl"
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-widest">University Email</Label>
                <Input 
                  value={newStudentData.email}
                  onChange={(e) => setNewStudentData({...newStudentData, email: e.target.value})}
                  className="bg-white/5 border-white/10 h-12 rounded-xl"
                  placeholder="student@university.edu"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase text-muted-foreground/60 tracking-widest">Initial Wallet Grant (₦)</Label>
                <Input 
                  type="number"
                  value={newStudentData.walletBalance}
                  onChange={(e) => setNewStudentData({...newStudentData, walletBalance: e.target.value})}
                  className="bg-white/5 border-white/10 h-12 rounded-xl"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setIsAddDialogOpen(false)} className="rounded-xl">Cancel</Button>
              <Button 
                onClick={handleAddStudent} 
                disabled={isSaving || !newStudentData.name || !newStudentData.email}
                className="bg-primary hover:bg-primary/90 rounded-xl px-8 font-bold"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enroll Identity"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminShell>
  )
}