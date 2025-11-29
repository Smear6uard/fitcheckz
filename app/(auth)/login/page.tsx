import Link from "next/link"
import { LoginForm } from "@/components/auth/LoginForm"
import { Button } from "@/components/ui/button"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome back</h1>
          <p className="text-muted-foreground">
            Sign in to your Fitcheckz account
          </p>
        </div>
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm">
          <LoginForm />
          <div className="mt-4 text-center text-sm">
            <Link
              href="/reset-password"
              className="text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  )
}

