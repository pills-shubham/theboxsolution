"use client"

import { useState } from "react"
import { Product, ProductDimension } from "@/services/types"
import { cartService } from "@/services/cart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Minus, ShoppingCart, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect } from "react"
import { CartItem } from "@/services/types"

interface ProductCardProps {
  product: Product & { product_dimensions: ProductDimension[] }
}

export function ProductCard({ product }: ProductCardProps) {
  const [selectedDimension, setSelectedDimension] = useState(product.product_dimensions[0]?.id)
  const [adding, setAdding] = useState(false)
  const [cartItem, setCartItem] = useState<CartItem | null>(null)
  const [loadingCart, setLoadingCart] = useState(false)

  const checkCart = async () => {
    if (!selectedDimension) return
    setLoadingCart(true)
    try {
      const cart = await cartService.getCart()
      const existing = cart.find(item => item.product_id === product.id && item.dimension_id === selectedDimension)
      setCartItem(existing || null)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingCart(false)
    }
  }

  useEffect(() => {
    checkCart()
  }, [selectedDimension])

  const handleAddToCart = async () => {
    if (!selectedDimension) return
    setAdding(true)
    try {
      const newItem = await cartService.addToCart(product.id, selectedDimension, 1)
      setCartItem(newItem)
    } catch (err: any) {
      alert(err.message || "Failed to add to cart")
    } finally {
      setAdding(false)
    }
  }

  const updateQty = async (newQty: number) => {
    if (!cartItem) return
    if (newQty < 1) {
      setAdding(true)
      try {
        await cartService.removeFromCart(cartItem.id)
        setCartItem(null)
      } catch (err) {
        console.error(err)
      } finally {
        setAdding(false)
      }
      return
    }

    setAdding(true)
    try {
      const updated = await cartService.updateQuantity(cartItem.id, newQty)
      setCartItem(updated)
    } catch (err) {
      console.error(err)
    } finally {
      setAdding(false)
    }
  }

  const discountPrice = product.price * (1 - product.discount_percent / 100)

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="h-full flex flex-col overflow-hidden border-primary/10 hover:border-primary/30 transition-colors">
        <div className="aspect-video bg-muted flex items-center justify-center relative">
          <img 
            src={`https://api.dicebear.com/7.x/shapes/svg?seed=${product.id}`}
            alt={product.title}
            className="w-full h-full object-cover opacity-80"
          />
          {product.discount_percent > 0 && (
            <span className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full">
              -{product.discount_percent}%
            </span>
          )}
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-1">{product.title}</CardTitle>
          <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
        </CardHeader>
        <CardContent className="flex-1 space-y-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">${discountPrice.toFixed(2)}</span>
            {product.discount_percent > 0 && (
              <span className="text-sm text-muted-foreground line-through">${product.price.toFixed(2)}</span>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Dimension</label>
            <Select value={selectedDimension} onValueChange={setSelectedDimension}>
              <SelectTrigger>
                <SelectValue placeholder="Select size" />
              </SelectTrigger>
              <SelectContent>
                {product.product_dimensions.map((dim) => (
                  <SelectItem key={dim.id} value={dim.id}>
                    {dim.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Removed separate Qty counter from body, moving to footer logic */}
        </CardContent>
        <CardFooter className="h-16">
          <AnimatePresence mode="wait">
            {loadingCart ? (
              <div className="w-full flex justify-center">
                <Loader2 className="animate-spin text-muted-foreground" />
              </div>
            ) : cartItem ? (
              <motion.div 
                key="qty-controls"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full flex items-center justify-between bg-primary/5 rounded-lg p-1 border border-primary/10"
              >
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="size-10 hover:bg-primary/10" 
                  onClick={() => updateQty(cartItem.quantity - 1)}
                  disabled={adding}
                >
                  <Minus className="size-4" />
                </Button>
                <span className="font-bold text-lg">{cartItem.quantity}</span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="size-10 hover:bg-primary/10" 
                  onClick={() => updateQty(cartItem.quantity + 1)}
                  disabled={adding}
                >
                  <Plus className="size-4" />
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="add-button"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full"
              >
                <Button className="w-full h-10" onClick={handleAddToCart} disabled={adding}>
                  {adding ? <Loader2 className="animate-spin size-4" /> : (
                    <>
                      <ShoppingCart className="mr-2 size-4" />
                      Add to Cart
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
