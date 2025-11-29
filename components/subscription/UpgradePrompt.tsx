"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Sparkles } from "lucide-react"

interface UpgradePromptProps {
  message: string
  feature?: string
}

export function UpgradePrompt({ message, feature }: UpgradePromptProps) {
  return (
    <Card className="border-primary/50 bg-primary/5">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle>Upgrade to Pro</CardTitle>
        </div>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild>
          <Link href="/subscription">View Plans</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

