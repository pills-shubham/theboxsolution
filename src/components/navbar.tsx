"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingCart, Package, User, LogOut, Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import { authService } from "@/services/auth"
import { cartService } from "@/services/cart"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export function Navbar() {
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [cartCount, setCartCount] = useState(0)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const checkUser = async () => {
      const u = await authService.getCurrentUser()
      setUser(u)
    }
    checkUser()

    const fetchCartCount = async () => {
      const cart = await cartService.getCart()
      setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0))
    }
    fetchCartCount()
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform">
            <span className="text-primary-foreground font-bold">B</span>
          </div>
          <span className="font-bold tracking-tight hidden sm:inline">The Box Solution</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-4">
          <Link href="/products">
            <Button variant={pathname === '/products' ? 'default' : 'ghost'} size="sm">
              Products
            </Button>
          </Link>
          
          <Link href="/cart">
            <Button variant={pathname === '/cart' ? 'default' : 'ghost'} size="sm" className="relative">
              <ShoppingCart className="size-4 mr-2" />
              Cart
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 size-4 bg-primary text-[10px] font-bold text-primary-foreground rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>

          {user ? (
            <>
              <Link href="/orders">
                <Button variant={pathname === '/orders' ? 'default' : 'ghost'} size="sm">
                  <Package className="size-4 mr-2" />
                  Orders
                </Button>
              </Link>
              <div className="flex items-center gap-2 pl-2 border-l ml-2">
                {user.user_metadata?.avatar_url ? (
                  <img src={user.user_metadata.avatar_url} alt="Profile" className="size-7 rounded-full border border-primary/20" />
                ) : (
                  <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
                <Button variant="ghost" size="icon" className="size-8" onClick={() => authService.signOut().then(() => window.location.reload())}>
                  <LogOut className="size-4" />
                </Button>
              </div>
            </>
          ) : (
            <Link href="/login">
              <Button size="sm">
                <User className="size-4 mr-2" />
                Login
              </Button>
            </Link>
          )}
          <ModeToggle />
        </nav>

        {/* Mobile Nav Controls */}
        <div className="flex md:hidden items-center gap-2">
          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon" className="size-9">
              <ShoppingCart className="size-4" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 size-4 bg-primary text-[10px] font-bold text-primary-foreground rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
          <ModeToggle />
          <Button variant="ghost" size="icon" className="size-9" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur-lg animate-in slide-in-from-top-2 duration-200">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
            <Link href="/products">
              <Button variant={pathname === '/products' ? 'default' : 'ghost'} className="w-full justify-start">
                <Package className="size-4 mr-3" />
                Products
              </Button>
            </Link>
            <Link href="/cart">
              <Button variant={pathname === '/cart' ? 'default' : 'ghost'} className="w-full justify-start relative">
                <ShoppingCart className="size-4 mr-3" />
                Cart
                {cartCount > 0 && (
                  <span className="ml-auto bg-primary text-[10px] font-bold text-primary-foreground size-5 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <>
                <Link href="/orders">
                  <Button variant={pathname === '/orders' ? 'default' : 'ghost'} className="w-full justify-start">
                    <Package className="size-4 mr-3" />
                    My Orders
                  </Button>
                </Link>
                <div className="border-t my-2" />
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center gap-3">
                    {user.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="Profile" className="size-8 rounded-full border border-primary/20" />
                    ) : (
                      <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold">
                        {user.email?.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="text-sm font-medium truncate max-w-[180px]">{user.email}</span>
                  </div>
                  <Button variant="ghost" size="icon" className="size-8" onClick={() => authService.signOut().then(() => window.location.reload())}>
                    <LogOut className="size-4" />
                  </Button>
                </div>
              </>
            ) : (
              <Link href="/login">
                <Button className="w-full justify-start">
                  <User className="size-4 mr-3" />
                  Login
                </Button>
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
