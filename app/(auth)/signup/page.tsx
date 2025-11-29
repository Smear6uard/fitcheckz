import Link from "next/link"
import { SignupForm } from "@/components/auth/SignupForm"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Create your account</h1>
          <p className="text-muted-foreground">
            Join Fitcheckz and start styling with confidence
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <SignupForm />
        </div>
        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  )
}

