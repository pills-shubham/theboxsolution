"use client"

import { useEffect, useState } from "react"
import { cartService } from "@/services/cart"
import { CartItem } from "@/services/types"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCart = async () => {
    try {
      const cartItems = await cartService.getCart()
      setItems(cartItems)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const updateQty = async (id: string, newQty: number) => {
    if (newQty < 1) return
    try {
      await cartService.updateQuantity(id, newQty)
      setItems(items.map(item => item.id === id ? { ...item, quantity: newQty } : item))
    } catch (err) {
      console.error(err)
    }
  }

  const removeItem = async (id: string) => {
    try {
      await cartService.removeFromCart(id)
      setItems(items.filter(item => item.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  const total = items.reduce((acc, item) => {
    const price = item.product?.price || 0
    const discount = item.product?.discount_percent || 0
    return acc + (price * (1 - discount / 100)) * item.quantity
  }, 0)

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <Navbar />
      <main className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
          <ShoppingBag className="size-8" />
          Your Shopping Cart
        </h1>

        {loading ? (
          <div className="space-y-4">
             {[1, 2].map(i => <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl border border-dashed">
            <p className="text-muted-foreground mb-6">Your cart is empty.</p>
            <Link href="/products">
              <Button>Start Shopping</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-4 p-4 bg-card rounded-2xl border items-center"
                  >
                    <div className="size-20 bg-muted rounded-lg flex-shrink-0 flex items-center justify-center">
                       <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${item.product_id}`} className="size-12 p-2" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold">{item.product?.title}</h3>
                      <p className="text-xs text-muted-foreground">{item.dimension?.label}</p>
                      <p className="text-sm font-semibold mt-1">
                        ${((item.product?.price || 0) * (1 - (item.product?.discount_percent || 0) / 100)).toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center border rounded-md">
                        <Button variant="ghost" size="icon" className="size-7" onClick={() => updateQty(item.id, item.quantity - 1)}>
                          <Minus className="size-3" />
                        </Button>
                        <span className="w-6 text-center text-xs font-bold">{item.quantity}</span>
                        <Button variant="ghost" size="icon" className="size-7" onClick={() => updateQty(item.id, item.quantity + 1)}>
                          <Plus className="size-3" />
                        </Button>
                      </div>
                      <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => removeItem(item.id)}>
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="space-y-6">
              <Card className="bg-primary/5 border-primary/20 p-6">
                <h3 className="font-bold mb-4">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-500 font-medium">Free</span>
                  </div>
                  <div className="pt-4 border-t flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
                <Link href="/checkout">
                  <Button className="w-full mt-6" size="lg">
                    Checkout
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
