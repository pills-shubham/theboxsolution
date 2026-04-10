"use client"

import { useEffect, useState } from "react"
import { orderService } from "@/services/orders"
import { Order } from "@/services/types"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Package, ChevronRight, CheckCircle2, Clock, Truck, Box } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const list = await orderService.listOrders()
        setOrders(list)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="size-4" />
      case 'confirmed': return <CheckCircle2 className="size-4" />
      case 'shipped': return <Truck className="size-4" />
      case 'delivered': return <Box className="size-4" />
      default: return <Clock className="size-4" />
    }
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

  return (
    <div className="min-h-screen bg-background pt-24 pb-12">
      <Navbar />
      <main className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Your Orders</h1>
          <Badge variant="outline">{orders.length} total</Badge>
        </div>

        {loading ? (
          <div className="space-y-4">
             {[1, 2, 3].map(i => <div key={i} className="h-40 bg-muted rounded-2xl animate-pulse" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-card border-dashed border-2 rounded-3xl p-12 text-center">
            <Package className="size-12 text-muted-foreground mx-auto mb-4 opacity-20" />
            <p className="text-muted-foreground mb-6">You haven't placed any orders yet.</p>
            <Link href="/products">
                <Button>Browse Products</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, idx) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link href={`/orders/${order.id}`}>
                  <Card className="hover:border-primary/30 transition-all group overflow-hidden">
                    <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                        <div className="space-y-1">
                            <CardTitle className="text-lg">Order #{order.id.slice(0, 8)}</CardTitle>
                            <CardDescription>{new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString()}</CardDescription>
                        </div>
                        <Badge variant="outline" className={`capitalize flex items-center gap-1.5 ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status}
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-end">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MapPin className="size-3" />
                                    {order.address?.name}, {order.address?.city}
                                </div>
                                <p className="text-2xl font-bold text-primary">${order.total_amount.toFixed(2)}</p>
                            </div>
                            <Button variant="ghost" size="sm" className="group-hover:translate-x-1 transition-transform">
                                Details <ChevronRight className="ml-1 size-4" />
                            </Button>
                        </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function MapPin({ className }: { className?: string }) {
    return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
}

// Button and Badge imported correctly
import { Button } from "@/components/ui/button"
