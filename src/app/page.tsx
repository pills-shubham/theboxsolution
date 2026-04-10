"use client"

import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { ArrowRight, Package, ShieldCheck, Zap, Globe, Loader2 } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { adminService } from "@/services/admin"
import { authService } from "@/services/auth"

export default function Home() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkRedirect = async () => {
      try {
        const user = await authService.getCurrentUser()
        if (user) {
          const isAdmin = await adminService.checkAdminStatus()
          if (isAdmin) {
            router.push('/admin')
          } else {
            router.push('/products')
          }
        } else {
          setLoading(false)
        }
      } catch (err) {
        setLoading(false)
      }
    }
    checkRedirect()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="size-10 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary/10">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse [animation-delay:2s]" />
        </div>

        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest rounded-full mb-6 inline-block">
              Premium Packaging Solutions
            </span>
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 leading-tight">
              The Ultimate <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary/80 to-primary/50">Box Solution.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 text-balance">
              Industrial-grade packaging for businesses of all sizes. Fast delivery, custom dimensions, and unbeatable durability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="h-14 px-8 text-lg font-bold group">
                  Explore Products
                  <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-bold">
                  Get Started
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: "Snap Delivery", desc: "Next-day shipping for standard orders." },
              { icon: ShieldCheck, title: "Industrial Strength", desc: "Corrugated layers for maximum protection." },
              { icon: Package, title: "Custom Sizes", desc: "Choose from hundreds of dimension variations." },
              { icon: Globe, title: "Eco-Friendly", desc: "100% recyclable and biodegradable materials." }
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-card p-8 rounded-3xl border hover:border-primary/50 transition-colors group"
              >
                <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                  <f.icon className="size-6" />
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-muted-foreground">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats / Proof */}
      <section className="py-20 border-y">
         <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
               <div className="text-center">
                  <p className="text-4xl font-black">10M+</p>
                  <p className="text-sm font-bold uppercase tracking-widest">Boxes Shipped</p>
               </div>
               <div className="text-center">
                  <p className="text-4xl font-black">25K</p>
                  <p className="text-sm font-bold uppercase tracking-widest">Active Clients</p>
               </div>
               <div className="text-center">
                  <p className="text-4xl font-black">99.9%</p>
                  <p className="text-sm font-bold uppercase tracking-widest">Safe Arrival</p>
               </div>
            </div>
         </div>
      </section>

      {/* Call to Action */}
      <section className="py-32">
         <div className="container mx-auto px-4">
            <div className="bg-primary rounded-[3rem] p-12 md:p-20 text-primary-foreground text-center relative overflow-hidden shadow-2xl">
               <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_50%)]" />
               <h2 className="text-4xl md:text-6xl font-black mb-8 relative z-10">Ready to secure your shipments?</h2>
               <p className="text-xl text-primary-foreground/80 max-w-xl mx-auto mb-10 relative z-10">
                  Join the thousands of businesses that trust The Box Solution for their logistics needs.
               </p>
               <Link href="/products" className="relative z-10">
                  <Button size="lg" variant="secondary" className="h-16 px-12 text-xl font-bold rounded-full">
                     Order Now
                  </Button>
               </Link>
            </div>
         </div>
      </section>

      <footer className="py-12 border-t">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
                <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold">B</span>
                </div>
                <span className="font-bold tracking-tight">The Box Solution</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2026 The Box Solution. All rights reserved.</p>
            <div className="flex gap-6 text-sm font-medium">
                <Link href="#" className="hover:text-primary">Terms</Link>
                <Link href="#" className="hover:text-primary">Privacy</Link>
                <Link href="#" className="hover:text-primary">Contact</Link>
            </div>
        </div>
      </footer>
    </div>
  )
}
