"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

const COOKIE_CONSENT_KEY = "styleum-cookie-consent"

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (!hasConsented) {
      // Small delay to prevent flash on page load
      const timer = setTimeout(() => setShowBanner(true), 1000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted")
    setShowBanner(false)
  }

  const handleDecline = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "declined")
    setShowBanner(false)
  }

  if (!showBanner) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom-5 duration-300">
      <div className="mx-auto max-w-4xl">
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-lg shadow-lg p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <p className="text-sm text-[#8A8A8A]">
                We use cookies to enhance your experience, analyze site usage, and assist in our marketing efforts.
                By continuing to use Styleum, you consent to our use of cookies.{" "}
                <Link href="/privacy#cookies" className="text-primary hover:underline">
                  Learn more
                </Link>
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDecline}
                className="text-[#8A8A8A] border-[#2A2A2A] hover:border-[#8A8A8A] bg-transparent"
              >
                Decline
              </Button>
              <Button
                size="sm"
                onClick={handleAccept}
              >
                Accept Cookies
              </Button>
              <button
                onClick={handleDecline}
                className="p-1 text-[#8A8A8A] hover:text-white transition-colors md:hidden"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
