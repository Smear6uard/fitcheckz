"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Mail, Check, Sparkles } from "lucide-react"

export function EmailCaptureSection() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const error = await res.json()
        // Handle duplicate email (409 status)
        if (res.status === 409) {
          setSubmitted(true)
          toast.info("You're already on the list!")
          return
        }
        throw new Error(error.error || "Failed to sign up")
      }

      setSubmitted(true)
      toast.success("You're on the list! We'll notify you when new features drop.")
      setEmail("")
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative py-16 lg:py-20 bg-primary/10 overflow-hidden">
      {/* Floating decorative elements - small circles/dots in corners and edges */}
      <div className="absolute top-10 left-10 w-3 h-3 rounded-full bg-[#CCFF00]/20 z-0" />
      <div className="absolute top-20 right-20 w-2 h-2 rounded-full bg-white/20 z-0" />
      <div className="absolute bottom-20 left-20 w-4 h-4 rounded-full bg-[#CCFF00]/15 z-0" />
      <div className="absolute bottom-10 right-10 w-2.5 h-2.5 rounded-full bg-white/15 z-0" />
      {/* Large soft orb behind content for extra depth */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
      </div>
      
      <div className="mx-auto max-w-6xl px-6 relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          {/* Small sparkle icon to tie into brand */}
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 border border-primary/30">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-tight text-balance">
            Get early access
          </h2>
          <p className="mt-4 text-lg leading-8 text-muted-foreground">
            Be the first to know when new features drop.
          </p>
          
          {submitted ? (
            <div className="mt-8 flex items-center justify-center gap-2 text-primary">
              <Check className="h-5 w-5" />
              <p className="text-sm font-medium">You're on the list!</p>
            </div>
          ) : (
            <div className="mt-8 max-w-md mx-auto relative">
              {/* Subtle radial gradient behind form */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-2xl blur-xl -z-10" />
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 relative z-10">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="flex-1 py-5 text-base"
                  required
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="whitespace-nowrap text-lg px-10 py-6 hover:scale-[1.02] hover:animate-pulse transition-all duration-300"
                >
                  {loading ? (
                    "Adding..."
                  ) : (
                    <>
                      <Mail className="mr-2 h-5 w-5" />
                      Notify Me
                    </>
                  )}
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

