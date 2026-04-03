
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  Loader2,
  UserX,
  UserCheck,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, where, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore'
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
  
  // State for UI filters
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("all")
  const [sortOrder, setSortOrder] = React.useState("newest")

  // 1. Fetch Students Query
  const studentsQuery = useMemoFirebase(() => {
    return query(
      collection(db, "userProfiles"), 
      where("role", "==", "student")
    )
  }, [db])

  const { data: allStudents, isLoading } = useCollection(studentsQuery)

  // 2. Filter & Sort Logic (Client-side for better UX on lists < 1000)
  const filteredStudents = React.useMemo(() => {
    if (!allStudents) return []
    
    let result = [...allStudents]

    // Filter by Search
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(s => 
        s.name?.toLowerCase().includes(q) || 
        s.email?.toLowerCase().includes(q)
      )
    }

    // Filter by Status
    if (statusFilter !== 'all') {
      result = result.filter(s => (s.status || 'Active').toLowerCase() === statusFilter)
    }

    // Sort
    result.sort((a, b) => {
      if (sortOrder === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sortOrder === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      if (sortOrder === 'name') return (a.name || "").localeCompare(b.name || "")
      return 0
    })

    return result
  }, [allStudents, searchQuery, statusFilter, sortOrder])

  // 3. Actions
  const handleToggleStatus = async (studentId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Suspended' ? 'Active' : 'Suspended'
    try {
      await updateDoc(doc(db, "userProfiles", studentId), {
        status: newStatus,
        updatedAt: new Date().toISOString()
      })
      toast({
        title: "Status Updated",
        description: `Student account is now ${newStatus}.`
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update student status."
      })
    }
  }

  const handleDeleteStudent = async (studentId: string) => {
    try {
      await deleteDoc(doc(db, "userProfiles", studentId))
      toast({
        title: "Student Deleted",
        description: "Account record has been removed from the database."
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete student record."
      })
    }
  }

  return (
    <AdminShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        
        {/* Page Title */}
        <h1 className="text-3xl font-headline font-bold text-white tracking-tight">Manage Students</h1>

        <GlassCard className="p-8 border-white/10 bg-black/20 backdrop-blur-3xl overflow-hidden relative">
          
          {/* Header Actions / Filters */}
          <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
            <div className="flex gap-4 w-full md:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-12 w-full md:w-40 bg-white/5 border-white/10 rounded-2xl px-6 focus:ring-primary/30">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={setSortOrder}>
                <SelectTrigger className="h-12 w-full md:w-56 bg-white/5 border-white/10 rounded-2xl px-6 focus:ring-primary/30">
                  <SelectValue placeholder="Sort By: Newest First" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10">
                  <SelectItem value="newest">Sort By: Newest First</SelectItem>
                  <SelectItem value="oldest">Sort By: Oldest First</SelectItem>
                  <SelectItem value="name">Sort By: Name</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="relative flex-1 w-full group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search by name or email..." 
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
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Fetching Student Directory...</p>
              </div>
            ) : filteredStudents.length > 0 ? (
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground pl-8">ID</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground">Name</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground">Email</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground">Registration Date</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground text-center">Status</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground text-right pr-8">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredStudents.map((student) => (
                    <TableRow key={student.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                      <TableCell className="pl-8 py-5 text-[10px] font-mono text-white/40">{student.id.substring(0, 8)}...</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <Avatar className="w-10 h-10 border border-white/10">
                            <AvatarImage src={`https://picsum.photos/seed/${student.id}/100/100`} />
                            <AvatarFallback>{student.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-bold text-white group-hover:text-primary transition-colors">{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{student.email}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {student.createdAt ? format(new Date(student.createdAt), 'MMM dd, yyyy') : 'N/A'}
                      </TableCell>
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
                            title={ (student.status || 'Active') === 'Active' ? "Suspend User" : "Activate User" }
                            className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 hover:bg-amber-500/20 hover:border-amber-500/40 group/btn transition-all"
                          >
                            {(student.status || 'Active') === 'Active' ? (
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
                                <AlertDialogTitle className="text-white font-headline">Permanently remove student?</AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground">
                                  This will delete the student profile for <strong>{student.name}</strong> from the database. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-white/10 hover:bg-white/5">Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteStudent(student.id)}
                                  className="bg-rose-500 hover:bg-rose-600 text-white"
                                >
                                  Delete Profile
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
                  <h3 className="text-lg font-bold text-white">No students found</h3>
                  <p className="text-sm text-muted-foreground">Adjust your search or filters to see results.</p>
                </div>
              </div>
            )}
          </div>

          {/* Table Footer / Pagination Info */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              Showing {filteredStudents.length} of {allStudents?.length || 0} students
            </p>
          </div>
        </GlassCard>

        {/* Footer */}
        <div className="text-center py-8 border-t border-white/5">
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">© 2024 CampusSpend. Student Intelligence Systems.</p>
        </div>

      </div>
    </AdminShell>
  )
}
