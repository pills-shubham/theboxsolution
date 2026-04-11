"use client"

import { useEffect, useState } from "react"
import { cartService } from "@/services/cart"
import { addressService } from "@/services/address"
import { orderService } from "@/services/orders"
import { CartItem, Address } from "@/services/types"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MapPin, Plus, Check, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>("")
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [newAddress, setNewAddress] = useState({
    name: "", address_line: "", city: "", state: "", pincode: ""
  })
  const [loading, setLoading] = useState(true)
  const [placingOrder, setPlacingOrder] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      try {
        const [cartItems, addrList] = await Promise.all([
          cartService.getCart(),
          addressService.listAddresses()
        ])
        setItems(cartItems)
        setAddresses(addrList)
        if (addrList.length > 0) setSelectedAddressId(addrList[0].id)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const added = await addressService.addAddress(newAddress)
      setAddresses([...addresses, added])
      setSelectedAddressId(added.id)
      setShowAddressForm(false)
      setNewAddress({ name: "", address_line: "", city: "", state: "", pincode: "" })
    } catch (err) {
      alert("Failed to add address")
    }
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) return alert("Please select an address")
    setPlacingOrder(true)
    try {
      const orderId = await orderService.placeOrder(selectedAddressId)
      router.push(`/orders?success=true&id=${orderId}`)
    } catch (err: any) {
      alert(err.message || "Failed to place order")
    } finally {
      setPlacingOrder(false)
    }
  }

  const total = items.reduce((acc, item) => {
    const price = item.product?.price || 0
    const discount = item.product?.discount_percent || 0
    return acc + (price * (1 - discount / 100)) * item.quantity
  }, 0)

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin size-8 text-primary" />
    </div>
  )

  return (
    <div className="min-h-screen bg-background pt-20 sm:pt-24 pb-12">
      <Navbar />
      <main className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold flex items-center gap-2">
                  <MapPin className="size-4 sm:size-5" />
                  Delivery Address
                </h2>
                <Button variant="outline" size="sm" onClick={() => setShowAddressForm(!showAddressForm)}>
                  {showAddressForm ? "Cancel" : "Add New"}
                </Button>
              </div>

              {showAddressForm && (
                <Card className="mb-6">
                  <CardContent className="pt-4 sm:pt-6 p-4 sm:p-6">
                    <form onSubmit={handleAddAddress} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} required />
                      </div>
                      <div className="sm:col-span-2 space-y-2">
                        <Label>Address Line</Label>
                        <Input value={newAddress.address_line} onChange={e => setNewAddress({...newAddress, address_line: e.target.value})} required />
                      </div>
                      <div className="space-y-2">
                        <Label>City</Label>
                        <Input value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} required />
                      </div>
                      <div className="space-y-2">
                        <Label>State</Label>
                        <Input value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} required />
                      </div>
                      <div className="space-y-2">
                        <Label>Pincode</Label>
                        <Input value={newAddress.pincode} onChange={e => setNewAddress({...newAddress, pincode: e.target.value})} required />
                      </div>
                      <div className="sm:col-span-2">
                        <Button className="w-full" type="submit">Save Address</Button>
                      </div>
                    </form>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {addresses.map((addr) => (
                  <div
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      selectedAddressId === addr.id ? 'border-primary bg-primary/5' : 'border-muted hover:border-primary/20'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5 sm:space-y-1 min-w-0 flex-1">
                        <p className="font-bold text-sm sm:text-base">{addr.name}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">{addr.address_line}</p>
                        <p className="text-xs sm:text-sm text-muted-foreground">{addr.city}, {addr.state} - {addr.pincode}</p>
                      </div>
                      {selectedAddressId === addr.id && <Check className="size-4 sm:size-5 text-primary flex-shrink-0 ml-2" />}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
                <h2 className="text-lg sm:text-xl font-bold mb-4">Review Items</h2>
                <div className="space-y-2">
                    {items.map(item => (
                        <div key={item.id} className="flex justify-between items-center text-xs sm:text-sm p-3 bg-muted/50 rounded-lg">
                            <span className="truncate mr-2">{item.product?.title} x {item.quantity}</span>
                            <span className="font-medium flex-shrink-0">${((item.product?.price || 0) * (1 - (item.product?.discount_percent || 0) / 100) * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
            </section>
          </div>

          <div className="space-y-6">
            <Card className="sticky top-20 sm:top-24">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg">Order Review</CardTitle>
                <CardDescription>Final subtotal and shipping</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 p-4 pt-0 sm:p-6 sm:pt-0">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items ({items.length})</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-green-600 font-medium">Free</span>
                </div>
                <div className="pt-4 border-t flex justify-between font-bold text-lg sm:text-xl">
                  <span>Grand Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <Button 
                    className="w-full h-11 sm:h-12 text-base sm:text-lg" 
                    onClick={handlePlaceOrder}
                    disabled={placingOrder || !selectedAddressId}
                >
                  {placingOrder ? (
                    <>
                      <Loader2 className="mr-2 size-5 animate-spin" />
                      Placing Order...
                    </>
                  ) : "Place Order"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
