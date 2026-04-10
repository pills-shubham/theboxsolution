"use client"

import { useState } from "react"
import { authService } from "@/services/auth"
import { adminService } from "@/services/admin"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldAlert, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminLoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleAdminLogin = async () => {
    setLoading(true)
    setError("")
    try {
      // Step 1: Login with Google
      await authService.loginWithGoogle();
      
      // The redirect will go to /auth/callback
      // Inside /auth/callback, we should check if they came from /admin/login 
      // but for simplicity, the dashboard will check admin status on load.
    } catch (err: any) {
      setError("Login failed")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 p-4 relative">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:40px_40px]" />
      <div className="absolute h-full w-full bg-black [mask-image:radial-gradient(50%_50%_at_50%_50%,transparent_0%,black_100%)]" />
      
      <Card className="w-full max-w-md bg-zinc-900 border-zinc-800 shadow-2xl relative z-10">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto size-14 bg-red-500/10 rounded-full flex items-center justify-center mb-2">
             <ShieldAlert className="size-8 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-black tracking-tight text-white uppercase">Admin Portal</CardTitle>
          <CardDescription className="text-zinc-400">
            Authorized Personnel Only. Unautorized access attempt is logged.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <Button 
            variant="outline" 
            className="w-full h-12 bg-zinc-800 hover:bg-zinc-700 border-zinc-700 text-white font-bold transition-all"
            onClick={handleAdminLogin}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin mr-2" /> : (
                <svg className="size-5 mr-3" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
                </svg>
            )}
            Continue to Secure Login
          </Button>
          {error && <p className="text-xs text-red-500 text-center font-bold tracking-widest uppercase">{error}</p>}
        </CardContent>
      </Card>
    </div>
  )
}
