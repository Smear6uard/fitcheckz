import Link from "next/link"
import { PasswordReset } from "@/components/auth/PasswordReset"

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Reset password</h1>
          <p className="text-muted-foreground">
            Enter your email to receive a reset link
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <PasswordReset />
        </div>
        <div className="text-center text-sm text-muted-foreground">
          <Link href="/login" className="text-primary hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

