"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { adminService } from "@/services/admin"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, ShoppingBag, Box, LogOut, Loader2, ShieldCheck, Menu, X } from "lucide-react"
import Link from "next/link"
import { authService } from "@/services/auth"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (pathname === '/admin/login') {
      setIsAdmin(true)
      return
    }

    const check = async () => {
      const status = await adminService.checkAdminStatus()
      if (status === false) {
        router.push('/admin/login')
      } else {
        setIsAdmin(true)
      }
    }
    check()
  }, [router, pathname])

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  if (isAdmin === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <Loader2 className="size-8 text-primary animate-spin" />
      </div>
    )
  }

  // Render children directly for login page to avoid sidebar
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  const menuItems = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "All Orders", href: "/admin/orders", icon: ShoppingBag },
    { label: "Inventory", href: "/admin/products", icon: Box },
  ]

  const currentPage = menuItems.find(item => item.href === pathname)

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-3 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
           <div className="size-8 bg-red-600 rounded flex items-center justify-center font-bold shadow-lg shadow-red-900/20">A</div>
           <div className="flex flex-col">
             <span className="font-black tracking-tighter uppercase text-sm leading-tight">Admin Panel</span>
             {currentPage && (
               <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{currentPage.label}</span>
             )}
           </div>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-9 px-3 border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 gap-2 font-bold uppercase text-[10px] tracking-widest"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          Menu
        </Button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar — Desktop: always visible. Mobile: slides in */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-50 h-full w-64 border-r border-zinc-800 flex flex-col p-6 bg-zinc-950
        transition-transform duration-300 ease-in-out
        md:translate-x-0 md:flex
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Close button for mobile only */}
        <div className="md:hidden flex justify-end mb-2">
          <Button variant="ghost" size="icon" className="size-8 text-zinc-500 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="size-5" />
          </Button>
        </div>
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
      <main className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 overflow-y-auto min-w-0 pb-24 md:pb-8">
        <div className="mb-6 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
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

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-md">
        <nav className="flex items-center justify-around py-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} className="flex-1">
                <button className={`w-full flex flex-col items-center gap-1 py-1.5 rounded-lg transition-colors ${
                  isActive 
                    ? 'text-red-500' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}>
                  <item.icon className={`size-5 ${isActive ? 'drop-shadow-[0_0_6px_rgba(239,68,68,0.5)]' : ''}`} />
                  <span className="text-[9px] font-bold uppercase tracking-widest">{item.label}</span>
                  {isActive && <div className="w-1 h-1 rounded-full bg-red-500" />}
                </button>
              </Link>
            )
          })}
          <button 
            className="flex-1 flex flex-col items-center gap-1 py-1.5 text-zinc-500 hover:text-zinc-300 transition-colors"
            onClick={() => authService.signOut().then(() => router.push('/'))}
          >
            <LogOut className="size-5" />
            <span className="text-[9px] font-bold uppercase tracking-widest">Exit</span>
          </button>
        </nav>
      </div>
    </div>
  )
}
