import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Terms of Service</CardTitle>
            <CardDescription>Last updated: {new Date().toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 prose prose-sm max-w-none">
            <div>
              <h2 className="text-xl font-semibold mb-3">Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By using FitCheckz, you agree to these Terms of Service. If you do not agree, please do not use the service.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">Service Description</h2>
              <p className="text-muted-foreground">
                FitCheckz provides AI-powered outfit recommendations based on your wardrobe. We reserve the right to 
                modify or discontinue the service at any time.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">User Responsibilities</h2>
              <p className="text-muted-foreground">
                You are responsible for maintaining the security of your account and for all activities that occur under 
                your account.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">Subscription and Cancellation</h2>
              <p className="text-muted-foreground">
                Pro subscriptions are billed monthly. You can cancel at any time from your account settings. 
                No refunds for partial months.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">Contact</h2>
              <p className="text-muted-foreground">
                For questions about these terms, contact us at{" "}
                <a href="mailto:hello@fitcheckz.com" className="text-primary hover:underline">
                  hello@fitcheckz.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}

