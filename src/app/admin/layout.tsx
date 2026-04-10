"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { adminService } from "@/services/admin"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, ShoppingBag, Box, LogOut, Loader2, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { authService } from "@/services/auth"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const check = async () => {
      const status = await adminService.checkAdminStatus()
      if (status === false) {
        // Not authorized
        router.push('/admin/login')
      } else {
        setIsAdmin(true)
      }
    }
    check()
  }, [router])

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <Loader2 className="size-8 text-primary animate-spin" />
      </div>
    )
  }

  const menuItems = [
    { label: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "All Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Inventory", href: "/admin/products", icon: Box },
  ]

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-zinc-800 flex flex-col p-6 hidden md:flex">
        <div className="flex items-center gap-3 mb-10 px-2">
           <div className="size-8 bg-red-600 rounded flex items-center justify-center font-bold shadow-lg shadow-red-900/20">A</div>
           <span className="font-black tracking-tighter uppercase text-lg">Admin Solution</span>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button 
                variant={pathname === item.href ? "secondary" : "ghost"} 
                className="w-full justify-start font-bold uppercase text-xs tracking-widest"
              >
                <item.icon className="mr-3 size-4" />
                {item.label}
              </Button>
            </Link>
          ))}
        </nav>

        <div className="pt-6 border-t border-zinc-800">
           <Button 
             variant="ghost" 
             className="w-full justify-start text-zinc-500 hover:text-white"
             onClick={() => authService.signOut().then(() => router.push('/'))}
           >
              <LogOut className="mr-3 size-4" />
              Exit Portal
           </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col p-8 overflow-y-auto">
        <div className="mb-8 flex items-center justify-between">
           <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-widest">
              <ShieldCheck className="size-3 text-red-500" />
              Secure Administrative Session
           </div>
           <div className="text-xs text-zinc-500 font-mono">
              STATUS: <span className="text-green-500">ENCRYPTED/LIVE</span>
           </div>
        </div>
        {children}
      </main>
    </div>
  )
}
