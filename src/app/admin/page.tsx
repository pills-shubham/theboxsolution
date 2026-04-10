"use client"

import { useEffect, useState } from "react"
import { adminService } from "@/services/admin"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingBag, TrendingUp, Users, Package, AlertCircle } from "lucide-react"

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalProducts: 0
  })

  useEffect(() => {
    const fetch = async () => {
      try {
        const orders = await adminService.getAllOrders()
        const products = await adminService.listAllProducts()
        
        setStats({
          totalOrders: orders.length,
          totalRevenue: orders.reduce((acc, o) => acc + o.total_amount, 0),
          pendingOrders: orders.filter(o => o.status === 'pending').length,
          totalProducts: products.length
        })
      } catch (err) {
        console.error(err)
      }
    }
    fetch()
  }, [])

  const cards = [
    { label: "Total Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Pending", value: stats.pendingOrders, icon: AlertCircle, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { label: "Catalog Items", value: stats.totalProducts, icon: Package, color: "text-purple-500", bg: "bg-purple-500/10" },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tighter italic">Command Center</h1>
        <p className="text-zinc-500 text-sm">Real-time metrics for The Box Solution operations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card) => (
          <Card key={card.label} className="bg-zinc-900 border-zinc-800 shadow-xl">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">{card.label}</CardTitle>
                <div className={`p-2 rounded-lg ${card.bg}`}>
                   <card.icon className={`size-4 ${card.color}`} />
                </div>
             </CardHeader>
             <CardContent>
                <div className="text-2xl font-black text-zinc-100">{card.value}</div>
             </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <Card className="bg-zinc-900 border-zinc-800 p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="size-20 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700">
               <Users className="size-10 text-zinc-500" />
            </div>
            <h3 className="font-bold text-xl uppercase tracking-widest italic">User Base Expansion</h3>
            <p className="text-zinc-500 text-sm max-w-sm">Detailed user analytics and growth metrics are currently being indexed. Stand by for live feed.</p>
         </Card>
         <Card className="bg-zinc-900 border-zinc-800 p-8 flex flex-col items-center justify-center text-center space-y-4">
            <div className="size-20 bg-zinc-800 rounded-full flex items-center justify-center border border-zinc-700">
               <TrendingUp className="size-10 text-zinc-500" />
            </div>
            <h3 className="font-bold text-xl uppercase tracking-widest italic">Revenue Forecast</h3>
            <p className="text-zinc-500 text-sm max-w-sm">Projected quarterly earnings based on historical trends will appear here after more data points.</p>
         </Card>
      </div>
    </div>
  )
}
