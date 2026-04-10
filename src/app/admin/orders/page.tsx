"use client"

import { useEffect, useState } from "react"
import { adminService } from "@/services/admin"
import { Order, User } from "@/services/types"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Loader2, ExternalLink, User as UserIcon, Mail, Phone } from "lucide-react"

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<(Order & { users: User })[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = async () => {
    try {
      const data = await adminService.getAllOrders()
      setOrders(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await adminService.updateOrderStatus(orderId, newStatus)
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o))
    } catch (err) {
      alert("Failed to update status")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'confirmed': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'shipped': return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      case 'delivered': return 'bg-green-500/10 text-green-500 border-green-500/20'
      default: return 'bg-zinc-800 text-zinc-400'
    }
  }

  if (loading) return <div className="flex-1 flex items-center justify-center"><Loader2 className="animate-spin" /></div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tighter italic">Global Orders</h1>
          <p className="text-zinc-500 text-sm">Monitor and manage all customer transactions.</p>
        </div>
        <Badge variant="outline" className="h-8 border-zinc-800 text-zinc-500">{orders.length} TOTAL RECORDS</Badge>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-zinc-950/50 uppercase text-[10px] tracking-widest font-bold">
              <TableRow className="border-zinc-800">
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id} className="border-zinc-800 hover:bg-zinc-800/30 transition-colors">
                  <TableCell className="font-mono text-zinc-400 text-xs">
                    #{order.id.slice(0, 8)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                       <span className="font-bold text-zinc-100">{order.users?.full_name || 'Generic User'}</span>
                       <span className="text-[10px] text-zinc-500 text-wrap max-w-[150px]">{order.users?.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-zinc-400">
                    {new Date(order.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="font-bold text-white">
                    ${order.total_amount.toFixed(2)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`capitalize text-[10px] ${getStatusColor(order.status)}`}>
                        {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Select defaultValue={order.status} onValueChange={(val) => handleStatusUpdate(order.id, val)}>
                      <SelectTrigger className="w-32 bg-zinc-950 border-zinc-800 text-[10px] h-8 font-bold uppercase tracking-wider">
                        <SelectValue placeholder="Update Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-zinc-900 border-zinc-800">
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
