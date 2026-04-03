"use client"

import * as React from "react"
import { AdminShell } from "@/components/layout/AdminShell"
import { GlassCard } from "@/components/ui/glass-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
  Plus, 
  Pencil, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  CheckSquare,
  Loader2,
  Package,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useFirestore, useCollection, useMemoFirebase } from "@/firebase"
import { collection, query, doc, setDoc, deleteDoc, serverTimestamp, updateDoc } from 'firebase/firestore'
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

export default function AdminManageCategoriesPage() {
  const db = useFirestore()
  const { toast } = useToast()
  
  // State for search and dialogs
  const [searchQuery, setSearchQuery] = React.useState("")
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [editingCategory, setEditingCategory] = React.useState<any>(null)
  const [isSaving, setIsSaving] = React.useState(false)
  const [formData, setFormData] = React.useState({ name: "", description: "" })

  // 1. Fetch Categories and Products (to count associations)
  const categoriesQuery = useMemoFirebase(() => collection(db, "categories"), [db])
  const productsQuery = useMemoFirebase(() => collection(db, "products"), [db])

  const { data: allCategories, isLoading: categoriesLoading } = useCollection(categoriesQuery)
  const { data: allProducts } = useCollection(productsQuery)

  // 2. Filter Logic
  const filteredCategories = React.useMemo(() => {
    if (!allCategories) return []
    let result = [...allCategories]
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(c => 
        c.name?.toLowerCase().includes(q) || 
        c.description?.toLowerCase().includes(q)
      )
    }
    return result.sort((a, b) => (a.name || "").localeCompare(b.name || ""))
  }, [allCategories, searchQuery])

  // 3. Actions
  const handleOpenDialog = (category?: any) => {
    if (category) {
      setEditingCategory(category)
      setFormData({ name: category.name, description: category.description || "" })
    } else {
      setEditingCategory(null)
      setFormData({ name: "", description: "" })
    }
    setIsDialogOpen(true)
  }

  const handleSaveCategory = async () => {
    if (!formData.name.trim()) return
    setIsSaving(true)
    try {
      if (editingCategory) {
        // Update
        const categoryRef = doc(db, "categories", editingCategory.id)
        await updateDoc(categoryRef, {
          ...formData,
          updatedAt: serverTimestamp()
        })
        toast({ title: "Category Updated", description: "The category details have been saved." })
      } else {
        // Create
        const categoryRef = doc(collection(db, "categories"))
        await setDoc(categoryRef, {
          id: categoryRef.id,
          ...formData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
        toast({ title: "Category Created", description: "New category added to marketplace." })
      }
      setIsDialogOpen(false)
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save category." })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteDoc(doc(db, "categories", id))
      toast({ title: "Category Deleted", description: "Category removed from database." })
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to remove category." })
    }
  }

  const getProductCount = (categoryName: string) => {
    if (!allProducts) return 0
    return allProducts.filter(p => p.category?.toLowerCase() === categoryName.toLowerCase()).length
  }

  return (
    <AdminShell>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-1000">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
          <CheckSquare className="w-3 h-3" /> Manage / <span className="text-white/80">Product Taxonomy</span>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl font-headline font-bold text-white tracking-tight">Manage Categories</h1>

        <GlassCard className="p-8 border-white/10 bg-black/20 backdrop-blur-3xl overflow-hidden relative space-y-8">
          
          {/* Action Row */}
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Button 
              onClick={() => handleOpenDialog()}
              className="h-12 px-8 rounded-2xl bg-gradient-to-r from-primary to-secondary font-bold shadow-[0_0_20px_rgba(239,26,184,0.3)] hover:opacity-90 transition-all flex gap-2 whitespace-nowrap"
            >
              <Plus className="w-5 h-5" /> Add Category
            </Button>

            <div className="relative flex-1 w-full group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input 
                placeholder="Search categories..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 bg-white/5 border-white/10 rounded-2xl pl-14 pr-6 text-sm focus:border-primary/50 transition-all placeholder:text-muted-foreground/40"
              />
            </div>
          </div>

          {/* Data Table */}
          <div className="rounded-2xl border border-white/5 overflow-hidden min-h-[400px] flex flex-col justify-center">
            {categoriesLoading ? (
              <div className="flex flex-col items-center gap-4 py-20">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Scanning Taxonomy...</p>
              </div>
            ) : filteredCategories.length > 0 ? (
              <Table>
                <TableHeader className="bg-white/5">
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground pl-8 w-[150px]">ID</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground">Category Name</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground">Description</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground text-center">Products</TableHead>
                    <TableHead className="text-[10px] font-bold uppercase tracking-widest py-6 text-muted-foreground text-right pr-8">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCategories.map((category) => (
                    <TableRow key={category.id} className="border-white/5 hover:bg-white/5 transition-colors group">
                      <TableCell className="pl-8 py-5 text-[10px] font-mono text-white/40">#{category.id.substring(0, 8)}</TableCell>
                      <TableCell className="py-5 text-sm font-bold text-white/80 group-hover:text-primary transition-colors">{category.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground truncate max-w-[200px]">{category.description || 'No description'}</TableCell>
                      <TableCell>
                        <div className="flex justify-center">
                          <div className="px-4 py-1 rounded-full border bg-white/5 border-white/10 text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                            <Package className="w-3 h-3 text-primary" />
                            {getProductCount(category.name)}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="pr-8">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => handleOpenDialog(category)}
                            className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 hover:bg-primary/20 hover:border-primary/40 group/btn transition-all"
                          >
                            <Pencil className="w-3.5 h-3.5 text-muted-foreground group-hover/btn:text-primary" />
                          </Button>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl bg-white/5 border border-white/10 hover:bg-rose-500/20 hover:border-rose-500/40 group/btn transition-all">
                                <Trash2 className="w-3.5 h-3.5 text-muted-foreground group-hover/btn:text-rose-500" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-card border-white/10">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-white font-headline">Delete Category?</AlertDialogTitle>
                                <AlertDialogDescription className="text-muted-foreground">
                                  This will permanently remove the category <strong>{category.name}</strong>. Products using this category will remain, but their category reference may become orphaned.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="border-white/10 hover:bg-white/5">Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDeleteCategory(category.id)}
                                  className="bg-rose-500 hover:bg-rose-600 text-white"
                                >
                                  Delete Permanently
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
                  <CheckSquare className="w-8 h-8 text-muted-foreground/20" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-white">No categories found</h3>
                  <p className="text-sm text-muted-foreground">Start by defining your marketplace taxonomy.</p>
                </div>
              </div>
            )}
          </div>

          {/* Table Footer */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
              Showing {filteredCategories.length} of {allCategories?.length || 0} categories
            </p>
          </div>
        </GlassCard>

        {/* Footer */}
        <div className="text-center py-8 border-t border-white/5">
           <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">© 2024 CampusSpend. Taxonomy Engine.</p>
        </div>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-card border-white/10 max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-headline font-bold text-white">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Category Name</Label>
                <Input 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Fast Food"
                  className="bg-white/5 border-white/10 rounded-xl h-12 focus:border-primary/50"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">Description</Label>
                <Textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="What kinds of products belong here?"
                  className="bg-white/5 border-white/10 rounded-xl min-h-[100px] focus:border-primary/50"
                />
              </div>
            </div>
            <DialogFooter>
              <Button 
                variant="ghost" 
                onClick={() => setIsDialogOpen(false)}
                className="rounded-xl border-white/10 hover:bg-white/5"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSaveCategory}
                disabled={isSaving || !formData.name.trim()}
                className="rounded-xl bg-primary hover:bg-primary/90 px-8 font-bold"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Category"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </AdminShell>
  )
}
