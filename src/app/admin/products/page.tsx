"use client"

import { useEffect, useState } from "react"
import { adminService } from "@/services/admin"
import { Product, ProductDimension, FullProduct } from "@/services/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit2, Trash2, Loader2, Save, X } from "lucide-react"



export default function AdminProductsPage() {
  const [products, setProducts] = useState<FullProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<FullProduct | null>(null)
  const [isAdding, setIsAdding] = useState(false)

  const fetchProducts = async () => {
    try {
      const data = await adminService.listAllProducts()
      setProducts(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingProduct) return
    try {
      const saved = await adminService.upsertProduct(editingProduct)
      
      // If there are dimensions to save (especially for new products)
      if (editingProduct.product_dimensions && editingProduct.product_dimensions.length > 0) {
        await Promise.all(
          editingProduct.product_dimensions.map(dim => {
            const isTempId = dim.id && dim.id.length < 30; // Real UUIDs are 36 chars
            const dimToSave = { ...dim, product_id: saved.id };
            if (isTempId) delete (dimToSave as any).id;
            return adminService.upsertDimension(dimToSave);
          })
        )
      }

      await fetchProducts()
      setEditingProduct(null)
      setIsAdding(false)
    } catch (err) {
      alert("Error saving product")
    }
  }

  const handleUpdateDimension = async (dim: Partial<ProductDimension>) => {
    try {
      await adminService.upsertDimension(dim)
      await fetchProducts()
    } catch (err) {
      alert("Error saving dimension")
    }
  }

  const handleDeleteDimension = async (id: string) => {
    if (!confirm("Are you sure?")) return
    try {
      await adminService.deleteDimension(id)
      await fetchProducts()
    } catch (err) {
      alert("Error deleting dimension")
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product? All its dimensions will also be deleted.")) return
    try {
      await adminService.deleteProduct(id)
      await fetchProducts()
    } catch (err) {
      alert("Error deleting product")
    }
  }

  if (loading) return <div className="flex-1 flex items-center justify-center bg-zinc-950"><Loader2 className="animate-spin" /></div>

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter italic text-zinc-100">Inventory Control</h1>
          <p className="text-zinc-500 text-sm">Update stocks, manage dimensions, and catalog pricing.</p>
        </div>
        <Button onClick={() => {
          setIsAdding(true)
          setEditingProduct({ id: '', title: '', description: '', price: 0, discount_percent: 0, created_at: '', product_dimensions: [] })
        }} className="bg-red-600 hover:bg-red-500 font-bold uppercase text-[10px] tracking-widest px-6 shadow-lg shadow-red-900/20 w-full sm:w-auto">
          <Plus className="mr-2 size-4" /> Add Product
        </Button>
      </div>

      {(editingProduct || isAdding) && (
        <Card className="bg-zinc-900 border-zinc-800 shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between border-b border-zinc-800 bg-zinc-950/50 rounded-t-xl p-4 sm:p-6">
             <CardTitle className="uppercase text-sm tracking-widest font-black italic">{isAdding ? 'New Product' : 'Modify Product'}</CardTitle>
             <Button variant="ghost" size="icon" onClick={() => { setEditingProduct(null); setIsAdding(false); }}>
                <X className="size-4" />
             </Button>
          </CardHeader>
          <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
             <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="uppercase text-[10px] font-bold text-zinc-500 tracking-widest">Product Title</Label>
                    <Input className="bg-zinc-950 border-zinc-800" value={editingProduct?.title} onChange={e => setEditingProduct({...editingProduct!, title: e.target.value})} required />
                  </div>
                  <div className="space-y-2">
                    <Label className="uppercase text-[10px] font-bold text-zinc-500 tracking-widest">Description</Label>
                    <Textarea className="bg-zinc-950 border-zinc-800 h-24" value={editingProduct?.description} onChange={e => setEditingProduct({...editingProduct!, description: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div className="space-y-2">
                      <Label className="uppercase text-[10px] font-bold text-zinc-500 tracking-widest">Base Price ($)</Label>
                      <Input type="number" step="0.01" className="bg-zinc-950 border-zinc-800" value={editingProduct?.price} onChange={e => setEditingProduct({...editingProduct!, price: Number(e.target.value)})} required />
                    </div>
                    <div className="space-y-2">
                       <Label className="uppercase text-[10px] font-bold text-zinc-500 tracking-widest">Discount (%)</Label>
                       <Input type="number" className="bg-zinc-950 border-zinc-800" value={editingProduct?.discount_percent} onChange={e => setEditingProduct({...editingProduct!, discount_percent: Number(e.target.value)})} />
                     </div>
                  </div>

                  {isAdding && (
                    <div className="space-y-4 border-t border-zinc-800 pt-4">
                      <div className="flex justify-between items-center">
                        <Label className="uppercase text-[10px] font-bold text-red-500 tracking-widest">Initial Dimensions</Label>
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 text-[9px] uppercase font-bold"
                          onClick={() => {
                            const dims = [...(editingProduct?.product_dimensions || [])];
                            dims.push({ id: Math.random().toString(), label: '', length: 0, width: 0, height: 0, price: 0, product_id: '' });
                            setEditingProduct({...editingProduct!, product_dimensions: dims});
                          }}
                        >
                          <Plus className="mr-1 size-3" /> Add Size
                        </Button>
                      </div>
                      
                      {editingProduct?.product_dimensions.map((dim, idx) => (
                        <div key={dim.id} className="grid grid-cols-2 sm:grid-cols-4 gap-2 items-end bg-zinc-950/50 p-2 rounded-lg border border-zinc-800">
                          <div className="col-span-1 space-y-1">
                            <Label className="text-[8px] uppercase text-zinc-600">Label</Label>
                            <Input 
                              className="h-7 text-[10px] bg-zinc-900" 
                              placeholder="e.g. Small" 
                              value={dim.label} 
                              onChange={e => {
                                const dims = [...editingProduct.product_dimensions];
                                dims[idx].label = e.target.value;
                                setEditingProduct({...editingProduct, product_dimensions: dims});
                              }}
                            />
                          </div>
                          <div className="col-span-1 sm:col-span-2 space-y-1">
                            <Label className="text-[8px] uppercase text-zinc-600">L x W x H (cm)</Label>
                            <div className="flex items-center gap-1">
                              <Input className="h-7 text-[9px] bg-zinc-900 p-1" value={dim.length} onChange={e => {
                                const dims = [...editingProduct.product_dimensions];
                                dims[idx].length = Number(e.target.value);
                                setEditingProduct({...editingProduct, product_dimensions: dims});
                              }} />
                              <Input className="h-7 text-[9px] bg-zinc-900 p-1" value={dim.width} onChange={e => {
                                const dims = [...editingProduct.product_dimensions];
                                dims[idx].width = Number(e.target.value);
                                setEditingProduct({...editingProduct, product_dimensions: dims});
                              }} />
                              <Input className="h-7 text-[9px] bg-zinc-900 p-1" value={dim.height} onChange={e => {
                                const dims = [...editingProduct.product_dimensions];
                                dims[idx].height = Number(e.target.value);
                                setEditingProduct({...editingProduct, product_dimensions: dims});
                              }} />
                            </div>
                          </div>
                          <div className="col-span-2 sm:col-span-1 space-y-1">
                            <Label className="text-[8px] uppercase text-zinc-600">Price ($)</Label>
                            <div className="flex items-center gap-1">
                              <Input className="h-7 text-[9px] bg-zinc-900 p-1" value={dim.price} onChange={e => {
                                const dims = [...editingProduct.product_dimensions];
                                dims[idx].price = Number(e.target.value);
                                setEditingProduct({...editingProduct, product_dimensions: dims});
                              }} />
                              <Button 
                                type="button" 
                                variant="ghost" 
                                size="icon" 
                                className="size-6 text-zinc-600 hover:text-red-500"
                                onClick={() => {
                                  const dims = editingProduct.product_dimensions.filter((_, i) => i !== idx);
                                  setEditingProduct({...editingProduct, product_dimensions: dims});
                                }}
                              >
                                <Trash2 className="size-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <Button type="submit" className="w-full h-12 bg-red-600 hover:bg-red-500 font-bold uppercase tracking-widest text-xs">
                    <Save className="mr-2 size-4" /> {isAdding ? 'Deploy Product' : 'Commit Changes'}
                  </Button>
                </div>
             </form>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-8">
        {products.map((product) => (
          <Card key={product.id} className="bg-zinc-900 border-zinc-800 overflow-hidden flex flex-col group">
            <CardHeader className="flex flex-row items-start sm:items-center justify-between border-b border-zinc-800 gap-2 p-4 sm:p-6">
               <div className="flex flex-col min-w-0 flex-1">
                 <CardTitle className="text-zinc-100 text-sm sm:text-base truncate">{product.title}</CardTitle>
                 <CardDescription className="text-zinc-500 text-[10px] uppercase font-bold tracking-widest mt-1">BASE: ${product.price} | {product.discount_percent}% OFF</CardDescription>
               </div>
               <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                 <Button variant="outline" size="icon" onClick={() => setEditingProduct(product)} className="bg-zinc-950 border-zinc-800 hover:bg-zinc-800 size-8 sm:size-9">
                    <Edit2 className="size-3.5 sm:size-4" />
                 </Button>
                 <Button variant="outline" size="icon" onClick={() => handleDeleteProduct(product.id)} className="bg-zinc-950 border-zinc-800 hover:bg-red-900/40 hover:text-red-500 hover:border-red-900/50 size-8 sm:size-9">
                    <Trash2 className="size-3.5 sm:size-4" />
                 </Button>
               </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Desktop Table View */}
              <div className="hidden sm:block overflow-x-auto">
                <Table>
                  <TableHeader className="bg-zinc-950/30">
                     <TableRow className="border-zinc-800">
                        <TableHead className="text-[10px] uppercase tracking-widest font-bold h-10">Label</TableHead>
                        <TableHead className="text-[10px] uppercase tracking-widest font-bold h-10">L x W x H (cm)</TableHead>
                        <TableHead className="text-[10px] uppercase tracking-widest font-bold h-10">Price ($)</TableHead>
                        <TableHead className="text-right h-10"></TableHead>
                     </TableRow>
                  </TableHeader>
                  <TableBody>
                     {product.product_dimensions.map(dim => (
                       <TableRow key={dim.id} className="border-zinc-800 hover:bg-zinc-950/50">
                         <TableCell className="py-2">
                            <Input 
                              className="h-7 bg-transparent border-transparent hover:border-zinc-800 text-xs py-0 px-1 focus:bg-zinc-950" 
                              defaultValue={dim.label} 
                              onBlur={e => handleUpdateDimension({...dim, label: e.target.value})}
                            />
                         </TableCell>
                         <TableCell className="py-2">
                            <div className="flex items-center gap-1">
                               <Input className="w-12 h-7 bg-transparent border-transparent hover:border-zinc-800 text-[10px] p-1 text-center" defaultValue={dim.length} onBlur={e => handleUpdateDimension({...dim, length: Number(e.target.value)})} />
                               <span className="text-zinc-600 text-[8px]">x</span>
                               <Input className="w-12 h-7 bg-transparent border-transparent hover:border-zinc-800 text-[10px] p-1 text-center" defaultValue={dim.width} onBlur={e => handleUpdateDimension({...dim, width: Number(e.target.value)})} />
                               <span className="text-zinc-600 text-[8px]">x</span>
                               <Input className="w-12 h-7 bg-transparent border-transparent hover:border-zinc-800 text-[10px] p-1 text-center" defaultValue={dim.height} onBlur={e => handleUpdateDimension({...dim, height: Number(e.target.value)})} />
                            </div>
                         </TableCell>
                          <TableCell className="py-2">
                            <Input 
                              type="number" 
                              step="0.01" 
                              className="w-20 h-7 bg-transparent border-transparent hover:border-zinc-800 text-xs py-0 px-1 focus:bg-zinc-950" 
                              defaultValue={dim.price} 
                              onBlur={e => handleUpdateDimension({...dim, price: Number(e.target.value)})}
                            />
                          </TableCell>
                          <TableCell className="text-right py-2">
                             <Button variant="ghost" size="icon" className="size-6 text-zinc-600 hover:text-red-500" onClick={() => handleDeleteDimension(dim.id)}>
                                <Trash2 className="size-3" />
                             </Button>
                          </TableCell>
                       </TableRow>
                     ))}
                      <TableRow className="bg-zinc-950/20">
                         <TableCell colSpan={4} className="py-2">
                            <Button 
                              variant="ghost" 
                              className="w-full h-8 text-zinc-500 hover:text-zinc-300 text-[10px] font-bold uppercase tracking-widest"
                              onClick={() => handleUpdateDimension({ product_id: product.id, label: 'New Size', length: 0, width: 0, height: 0, price: 0 })}
                            >
                               <Plus className="mr-2 size-3" /> Add Dimension
                            </Button>
                         </TableCell>
                      </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Card View */}
              <div className="sm:hidden p-3 space-y-3">
                {product.product_dimensions.map(dim => (
                  <div key={dim.id} className="bg-zinc-950/50 rounded-lg p-3 border border-zinc-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <Input 
                        className="h-7 bg-transparent border-transparent hover:border-zinc-800 text-xs py-0 px-1 focus:bg-zinc-950 font-bold flex-1" 
                        defaultValue={dim.label} 
                        onBlur={e => handleUpdateDimension({...dim, label: e.target.value})}
                      />
                      <Button variant="ghost" size="icon" className="size-6 text-zinc-600 hover:text-red-500 flex-shrink-0" onClick={() => handleDeleteDimension(dim.id)}>
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5">
                      <div className="col-span-3">
                        <Label className="text-[8px] uppercase text-zinc-600">L x W x H</Label>
                        <div className="flex items-center gap-1">
                          <Input className="h-7 text-[10px] bg-zinc-900 p-1 text-center" defaultValue={dim.length} onBlur={e => handleUpdateDimension({...dim, length: Number(e.target.value)})} />
                          <span className="text-zinc-600 text-[8px]">x</span>
                          <Input className="h-7 text-[10px] bg-zinc-900 p-1 text-center" defaultValue={dim.width} onBlur={e => handleUpdateDimension({...dim, width: Number(e.target.value)})} />
                          <span className="text-zinc-600 text-[8px]">x</span>
                          <Input className="h-7 text-[10px] bg-zinc-900 p-1 text-center" defaultValue={dim.height} onBlur={e => handleUpdateDimension({...dim, height: Number(e.target.value)})} />
                        </div>
                      </div>
                      <div>
                        <Label className="text-[8px] uppercase text-zinc-600">Price</Label>
                        <Input 
                          type="number" 
                          step="0.01" 
                          className="h-7 text-[10px] bg-zinc-900 p-1 text-center" 
                          defaultValue={dim.price} 
                          onBlur={e => handleUpdateDimension({...dim, price: Number(e.target.value)})}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="ghost" 
                  className="w-full h-8 text-zinc-500 hover:text-zinc-300 text-[10px] font-bold uppercase tracking-widest"
                  onClick={() => handleUpdateDimension({ product_id: product.id, label: 'New Size', length: 0, width: 0, height: 0, price: 0 })}
                >
                  <Plus className="mr-2 size-3" /> Add Dimension
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
