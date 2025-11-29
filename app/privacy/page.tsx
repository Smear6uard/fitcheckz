import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Privacy Policy</CardTitle>
            <CardDescription>Last updated: {new Date().toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 prose prose-sm max-w-none">
            <div>
              <h2 className="text-xl font-semibold mb-3">Data Collection</h2>
              <p className="text-muted-foreground">
                FitCheckz collects and stores your wardrobe photos and style preferences to provide personalized outfit recommendations. 
                All data is encrypted and stored securely.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">Data Usage</h2>
              <p className="text-muted-foreground">
                Your wardrobe data is used solely to generate outfit recommendations. We never share or sell your personal 
                information to third parties.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">Data Deletion</h2>
              <p className="text-muted-foreground">
                You can delete your account at any time from your account settings. All your photos and data will be 
                permanently deleted.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-3">Contact</h2>
              <p className="text-muted-foreground">
                For questions about privacy, contact us at{" "}
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

