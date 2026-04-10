"use client"

import { useState } from "react"
import { authService } from "@/services/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError("")
    try {
      await authService.loginWithGoogle()
    } catch (err: any) {
      setError(err.message || "Failed to login with Google")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-primary/5 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <Card className="border-none shadow-2xl bg-card/50 backdrop-blur-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto size-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
               {/* Google Icon SVG */}
               <svg className="size-8" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight">Welcome Back</CardTitle>
            <CardDescription>
              Sign in to manage your orders and track shipments
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Button 
                variant="outline" 
                className="w-full h-12 text-lg font-semibold bg-background/50 border-primary/20 hover:bg-primary/5 transition-all" 
                onClick={handleGoogleLogin} 
                disabled={loading}
            >
              <svg className="mr-2 size-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="currentColor"
                />
              </svg>
              {loading ? "Connecting..." : "Continue with Google"}
            </Button>
            {error && <p className="text-sm text-destructive text-center font-medium">{error}</p>}
          </CardContent>
          <CardFooter className="flex flex-col gap-2 border-t pt-6">
            <p className="text-[10px] text-center text-muted-foreground px-8 uppercase tracking-widest font-bold">
              Secure Google OAuth 2.0 Encryption
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  )
}
