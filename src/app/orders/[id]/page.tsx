"use client"

import { useEffect, useState, use } from "react"
import { orderService } from "@/services/orders"
import { Order, OrderItem } from "@/services/types"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Package, MapPin, Calendar, CreditCard } from "lucide-react"
import Link from "next/link"

interface OrderDetailProps {
  params: Promise<{ id: string }>
}

export default function OrderDetailsPage({ params }: OrderDetailProps) {
  const { id } = use(params)
  const [order, setOrder] = useState<Order & { order_items: OrderItem[] } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await orderService.getOrderDetails(id)
        setOrder(data)
      } catch (err) {
          console.error(err)
      } finally {
          setLoading(false)
      }
    }
    fetch()
  }, [id])

  if (loading) return <div className="pt-24 container mx-auto px-4">Loading details...</div>
  if (!order) return <div className="pt-24 container mx-auto px-4">Order not found.</div>

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <Navbar />
      <main className="container mx-auto px-4 max-w-4xl">
        <Link href="/orders">
          <Button variant="ghost" className="mb-6 -ml-4">
            <ChevronLeft className="mr-2 size-4" />
            Back to Orders
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader className="border-b">
                <div className="flex justify-between items-center">
                   <div>
                    <CardTitle className="text-xl">Order Details</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">ID: {order.id}</p>
                   </div>
                   <Badge variant="outline" className={`capitalize ${getStatusColor(order.status)}`}>{order.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                 <div className="space-y-6">
                   {order.order_items.map((item) => (
                     <div key={item.id} className="flex gap-4">
                        <div className="size-16 bg-muted rounded-lg flex items-center justify-center">
                            <img src={`https://api.dicebear.com/7.x/shapes/svg?seed=${item.product_id}`} className="size-10" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold">{item.product?.title}</h4>
                            <p className="text-xs text-muted-foreground">{item.dimension?.label}</p>
                            <p className="text-sm mt-1">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold">${(item.price_at_time * (1 - item.discount_at_time/100) * item.quantity).toFixed(2)}</p>
                            <p className="text-[10px] text-muted-foreground">${(item.price_at_time * (1 - item.discount_at_time/100)).toFixed(2)} / unit</p>
                        </div>
                     </div>
                   ))}
                 </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <MapPin className="size-4" />
                        Delivery Address
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-1">
                    <p className="font-bold">{order.address?.name}</p>
                    <p className="text-muted-foreground">{order.address?.address_line}</p>
                    <p className="text-muted-foreground">{order.address?.city}, {order.address?.state} - {order.address?.pincode}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                        <Calendar className="size-4" />
                        Order Info
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Date</span>
                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Payment</span>
                        <span>COD (Mock)</span>
                    </div>
                    <div className="pt-4 border-t flex justify-between font-bold text-lg">
                        <span>Paid Total</span>
                        <span className="text-primary">${order.total_amount.toFixed(2)}</span>
                    </div>
                </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
    case 'confirmed': return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
    case 'shipped': return 'bg-purple-500/10 text-purple-600 border-purple-500/20'
    case 'delivered': return 'bg-green-500/10 text-green-600 border-green-500/20'
    default: return 'bg-muted text-muted-foreground'
  }
}
