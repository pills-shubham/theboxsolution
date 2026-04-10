"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { Server, Database, Cog } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/10 selection:text-primary overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] animate-pulse [animation-delay:1s]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">B</span>
            </div>
            <span className="font-bold tracking-tight">The Box Solution</span>
          </div>
          <ModeToggle />
        </div>
      </header>

      <main className="container relative z-10 mx-auto px-4 min-h-screen flex flex-col items-center justify-center text-center space-y-12">
        {/* Animated Icon Cluster */}
        <div className="relative group">
          <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse group-hover:bg-primary/30 transition-colors" />
          <div className="relative flex items-center justify-center gap-4 bg-card p-8 rounded-3xl border shadow-2xl">
            <div className="flex flex-col gap-4">
              <Server className="size-10 text-primary animate-bounce [animation-duration:3s]" />
              <Database className="size-10 text-muted-foreground animate-pulse" />
            </div>
            <div className="size-24 bg-primary/10 rounded-2xl flex items-center justify-center border-2 border-primary/20 animate-spin [animation-duration:8s]">
              <Cog className="size-12 text-primary" />
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="max-w-2xl space-y-6">
          <div className="space-y-2">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest rounded-full">
              System Update in Progress
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-balance leading-[1.1]">
              Under <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/50">Construction</span>
            </h1>
          </div>
          
          <p className="text-xl text-muted-foreground text-balance max-w-lg mx-auto leading-relaxed">
            Building APIs and setting up backend infrastructure for the ultimate packaging solution.
          </p>
        </div>

        {/* Progress Bar Mockup */}
        <div className="w-full max-w-md space-y-4">
          <div className="flex justify-between text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="size-2 bg-primary rounded-full animate-ping" />
              Initializing Backend Services...
            </span>
            <span>74%</span>
          </div>
          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden border">
            <div className="h-full bg-primary w-3/4 relative">
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.3)_50%,transparent_100%)] animate-[shimmer_2s_infinite]" />
            </div>
          </div>
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-bold">
            api.theboxsolution.io • postgres_vault_01 • node_worker_main
          </p>
        </div>

        {/* Footer */}
        <div className="absolute bottom-12 left-0 right-0 text-center">
            <p className="text-sm font-medium text-muted-foreground/60">
              The Box Solution &copy; 2026 • Premium Packaging Logic
            </p>
        </div>
      </main>

      <style jsx global>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  )
}
