"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/utils/error-handling"
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
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative py-16 lg:py-20 bg-gradient-to-b from-[#0A0A0A] to-[#141414] overflow-hidden">
      {/* Floating decorative elements */}
      <div className="absolute top-10 left-10 w-3 h-3 rounded-full bg-primary/20 z-0" />
      <div className="absolute top-20 right-20 w-2 h-2 rounded-full bg-white/10 z-0" />
      <div className="absolute bottom-20 left-20 w-4 h-4 rounded-full bg-primary/15 z-0" />
      <div className="absolute bottom-10 right-10 w-2.5 h-2.5 rounded-full bg-white/10 z-0" />
      {/* Large soft orb behind content */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-6 relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          {/* Sparkle icon */}
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 border border-primary/30">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h2 className="font-serif text-4xl font-normal tracking-tight text-white sm:text-5xl lg:text-6xl leading-tight text-balance">
            Get early access
          </h2>
          <p className="mt-4 text-lg leading-8 text-[#8A8A8A]">
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
                  className="flex-1 py-5 text-base bg-[#1A1A1A] border-[#2A2A2A] focus:border-primary text-white placeholder:text-[#8A8A8A]"
                  required
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="whitespace-nowrap text-lg px-10 py-6 hover:scale-[1.02] transition-all duration-300 shadow-lg hover:shadow-accent-lift"
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
