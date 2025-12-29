import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import Link from "next/link"

export const metadata = {
  title: "Terms of Service | Styleum",
  description: "Terms of Service for Styleum - Read about our terms and conditions for using the service.",
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-card rounded-lg border border-border p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
            <p className="text-muted-foreground">Last Updated: December 12, 2025</p>
          </div>

          {/* Table of Contents */}
          <nav className="mb-10 p-4 bg-secondary/50 rounded-lg">
            <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Contents</h2>
            <ol className="space-y-1 text-sm">
              <li><a href="#acceptance" className="text-primary hover:underline">1. Acceptance of Terms</a></li>
              <li><a href="#service-description" className="text-primary hover:underline">2. Service Description</a></li>
              <li><a href="#user-accounts" className="text-primary hover:underline">3. User Accounts</a></li>
              <li><a href="#acceptable-use" className="text-primary hover:underline">4. Acceptable Use Policy</a></li>
              <li><a href="#intellectual-property" className="text-primary hover:underline">5. Intellectual Property</a></li>
              <li><a href="#ai-disclaimer" className="text-primary hover:underline">6. AI-Generated Content Disclaimer</a></li>
              <li><a href="#subscription" className="text-primary hover:underline">7. Subscription and Billing</a></li>
              <li><a href="#user-content" className="text-primary hover:underline">8. User Content</a></li>
              <li><a href="#privacy" className="text-primary hover:underline">9. Privacy</a></li>
              <li><a href="#limitation" className="text-primary hover:underline">10. Limitation of Liability</a></li>
              <li><a href="#disclaimer" className="text-primary hover:underline">11. Disclaimer of Warranties</a></li>
              <li><a href="#indemnification" className="text-primary hover:underline">12. Indemnification</a></li>
              <li><a href="#termination" className="text-primary hover:underline">13. Termination</a></li>
              <li><a href="#governing-law" className="text-primary hover:underline">14. Governing Law</a></li>
              <li><a href="#changes" className="text-primary hover:underline">15. Changes to Terms</a></li>
              <li><a href="#contact" className="text-primary hover:underline">16. Contact Us</a></li>
            </ol>
          </nav>

          <div className="space-y-10 text-muted-foreground">
            {/* 1. Acceptance of Terms */}
            <section id="acceptance">
              <h2 className="text-xl font-semibold mb-4 text-foreground">1. Acceptance of Terms</h2>
              <p className="mb-4">
                These Terms of Service (&quot;Terms&quot;) govern your access to and use of Styleum, an AI-powered
                fashion and outfit recommendation service operated by <strong>Sameer Studios LLC</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;).
              </p>
              <p className="mb-4">
                By accessing or using Styleum at styleum.app (the &quot;Service&quot;), you agree to be bound by these Terms.
                If you do not agree to these Terms, you may not access or use the Service.
              </p>
              <p>
                <strong>Age Requirement:</strong> You must be at least 13 years of age to use Styleum. By using the Service,
                you represent and warrant that you are at least 13 years old.
              </p>
            </section>

            {/* 2. Service Description */}
            <section id="service-description">
              <h2 className="text-xl font-semibold mb-4 text-foreground">2. Service Description</h2>
              <p className="mb-4">Styleum provides:</p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>AI-powered outfit recommendations based on your uploaded wardrobe</li>
                <li>Digital wardrobe management and organization</li>
                <li>Clothing item analysis using artificial intelligence</li>
                <li>Outfit visualization and styling suggestions</li>
                <li>Social features including public profiles, outfit sharing, and community exploration</li>
                <li>Style analytics and personalization</li>
              </ul>
              <p>
                We reserve the right to modify, suspend, or discontinue any part of the Service at any time,
                with or without notice. We shall not be liable to you or any third party for any modification,
                suspension, or discontinuation of the Service.
              </p>
            </section>

            {/* 3. User Accounts */}
            <section id="user-accounts">
              <h2 className="text-xl font-semibold mb-4 text-foreground">3. User Accounts</h2>
              <p className="mb-4">To use certain features of the Service, you must create an account. You agree to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Provide accurate, current, and complete information during registration</li>
                <li>Maintain and promptly update your account information</li>
                <li>Maintain the security and confidentiality of your login credentials</li>
                <li>Accept responsibility for all activities that occur under your account</li>
                <li>Notify us immediately of any unauthorized access or use of your account</li>
              </ul>
              <p>
                You may not create more than one account per person or share your account with others.
                We reserve the right to suspend or terminate accounts that violate these Terms.
              </p>
            </section>

            {/* 4. Acceptable Use Policy */}
            <section id="acceptable-use">
              <h2 className="text-xl font-semibold mb-4 text-foreground">4. Acceptable Use Policy</h2>
              <p className="mb-4">You agree not to use the Service to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Upload inappropriate, offensive, or explicit images</li>
                <li>Upload images that contain nudity or sexually explicit content</li>
                <li>Upload images that infringe on others&apos; intellectual property rights</li>
                <li>Upload images of people without their consent</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Impersonate any person or entity</li>
                <li>Use automated scripts, bots, or scrapers to access the Service</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Violate any applicable laws or regulations</li>
                <li>Engage in any activity that could damage our reputation</li>
              </ul>
              <p>
                We reserve the right to remove content and suspend or terminate accounts that violate this policy.
              </p>
            </section>

            {/* 5. Intellectual Property */}
            <section id="intellectual-property">
              <h2 className="text-xl font-semibold mb-4 text-foreground">5. Intellectual Property</h2>

              <h3 className="text-lg font-medium mb-2 text-foreground">Our Property</h3>
              <p className="mb-4">
                The Service, including its original content, features, functionality, design, code, and branding
                (excluding user content), is owned by Sameer Studios LLC and is protected by copyright, trademark,
                and other intellectual property laws. The Styleum name, logo, and all related marks are
                trademarks of Sameer Studios LLC.
              </p>

              <h3 className="text-lg font-medium mb-2 text-foreground">Your Content</h3>
              <p className="mb-4">
                You retain ownership of all photos and content you upload to Styleum. By uploading content,
                you grant us a non-exclusive, worldwide, royalty-free license to use, process, display, and
                store your content solely for the purpose of providing and improving the Service.
              </p>

              <h3 className="text-lg font-medium mb-2 text-foreground">AI-Generated Outputs</h3>
              <p>
                Outfit recommendations, style suggestions, and other AI-generated outputs are provided as part
                of the Service. While you may use these recommendations for personal purposes, the underlying
                AI models and technology remain the property of Sameer Studios LLC and our technology partners.
              </p>
            </section>

            {/* 6. AI-Generated Content Disclaimer */}
            <section id="ai-disclaimer">
              <h2 className="text-xl font-semibold mb-4 text-foreground">6. AI-Generated Content Disclaimer</h2>
              <div className="bg-secondary/50 p-4 rounded-lg mb-4">
                <p className="font-medium text-foreground mb-2">Important Notice:</p>
                <p>
                  Styleum uses artificial intelligence to generate outfit recommendations and styling suggestions.
                  These recommendations are for informational and entertainment purposes only.
                </p>
              </div>
              <ul className="list-disc pl-6 space-y-1">
                <li>AI recommendations are <strong>suggestions only</strong>, not professional fashion or styling advice</li>
                <li>We do not guarantee that recommendations will be suitable for any particular occasion or purpose</li>
                <li>AI analysis may not always be accurate in identifying colors, styles, or item characteristics</li>
                <li>You are solely responsible for your fashion choices and how you present yourself</li>
                <li>We are not liable for any outcomes resulting from following AI recommendations</li>
                <li>AI-generated outfit visualizations are approximations and may not reflect actual appearance</li>
              </ul>
            </section>

            {/* 7. Subscription and Billing */}
            <section id="subscription">
              <h2 className="text-xl font-semibold mb-4 text-foreground">7. Subscription and Billing</h2>

              <h3 className="text-lg font-medium mb-2 text-foreground">Free Tier</h3>
              <p className="mb-4">
                Styleum offers a free tier with limited features and usage caps. Free tier limitations
                may change at any time.
              </p>

              <h3 className="text-lg font-medium mb-2 text-foreground">Pro Subscription</h3>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Pro subscriptions are billed monthly via Stripe</li>
                <li>Payment is charged at the beginning of each billing period</li>
                <li>Subscriptions automatically renew unless cancelled</li>
                <li>You can cancel your subscription at any time from your account settings</li>
                <li>Cancellation takes effect at the end of the current billing period</li>
                <li>No refunds are provided for partial billing periods</li>
                <li>We reserve the right to change subscription pricing with 30 days notice</li>
              </ul>

              <h3 className="text-lg font-medium mb-2 text-foreground">Payment Processing</h3>
              <p>
                Payments are processed securely by Stripe. We do not store your complete credit card information.
                By subscribing, you agree to Stripe&apos;s terms of service.
              </p>
            </section>

            {/* 8. User Content */}
            <section id="user-content">
              <h2 className="text-xl font-semibold mb-4 text-foreground">8. User Content</h2>
              <p className="mb-4">
                You are solely responsible for all content you upload, post, or share through the Service, including
                wardrobe photos and profile information. You represent and warrant that:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>You own or have the right to use and share all content you upload</li>
                <li>Your content does not violate any third party&apos;s rights</li>
                <li>Your content complies with our Acceptable Use Policy</li>
                <li>Your content does not contain malicious code or viruses</li>
              </ul>
            </section>

            {/* 9. Privacy */}
            <section id="privacy">
              <h2 className="text-xl font-semibold mb-4 text-foreground">9. Privacy</h2>
              <p>
                Your privacy is important to us. Our collection and use of personal information is governed by our{" "}
                <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>, which is
                incorporated into these Terms by reference. By using the Service, you consent to our collection
                and use of data as described in our Privacy Policy.
              </p>
            </section>

            {/* 10. Limitation of Liability */}
            <section id="limitation">
              <h2 className="text-xl font-semibold mb-4 text-foreground">10. Limitation of Liability</h2>
              <p className="mb-4 uppercase text-sm font-medium">
                To the maximum extent permitted by applicable law:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Sameer Studios LLC shall not be liable for any indirect, incidental, special, consequential,
                  or punitive damages arising from your use of the Service
                </li>
                <li>
                  We shall not be liable for any loss of data, profits, revenue, or goodwill
                </li>
                <li>
                  We shall not be liable for any damages arising from AI recommendations or suggestions
                </li>
                <li>
                  Our total liability shall not exceed the amount you paid us in the 12 months preceding
                  the claim, or $100, whichever is greater
                </li>
                <li>
                  We are not responsible for any third-party services, content, or actions
                </li>
              </ul>
            </section>

            {/* 11. Disclaimer of Warranties */}
            <section id="disclaimer">
              <h2 className="text-xl font-semibold mb-4 text-foreground">11. Disclaimer of Warranties</h2>
              <div className="bg-secondary/50 p-4 rounded-lg">
                <p className="mb-4">
                  THE SERVICE IS PROVIDED &quot;AS IS&quot; AND &quot;AS AVAILABLE&quot; WITHOUT WARRANTIES OF ANY KIND,
                  EITHER EXPRESS OR IMPLIED.
                </p>
                <p className="mb-4">We specifically disclaim:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Any warranty of merchantability or fitness for a particular purpose</li>
                  <li>Any warranty that the Service will be uninterrupted, secure, or error-free</li>
                  <li>Any warranty regarding the accuracy of AI-generated recommendations</li>
                  <li>Any warranty that the Service will meet your specific requirements</li>
                </ul>
              </div>
            </section>

            {/* 12. Indemnification */}
            <section id="indemnification">
              <h2 className="text-xl font-semibold mb-4 text-foreground">12. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless Sameer Studios LLC and its officers, directors,
                employees, and agents from any claims, damages, losses, liabilities, and expenses (including
                reasonable attorneys&apos; fees) arising from your use of the Service, your violation of these Terms,
                or your violation of any rights of another.
              </p>
            </section>

            {/* 13. Termination */}
            <section id="termination">
              <h2 className="text-xl font-semibold mb-4 text-foreground">13. Termination</h2>

              <h3 className="text-lg font-medium mb-2 text-foreground">By You</h3>
              <p className="mb-4">
                You may delete your account at any time through your account settings. Upon deletion, your
                data will be permanently removed in accordance with our Privacy Policy.
              </p>

              <h3 className="text-lg font-medium mb-2 text-foreground">By Us</h3>
              <p className="mb-4">
                We may suspend or terminate your account at any time, with or without cause or notice, including
                for violation of these Terms. Upon termination, your right to use the Service will immediately cease.
              </p>

              <h3 className="text-lg font-medium mb-2 text-foreground">Effect of Termination</h3>
              <p>
                Sections relating to intellectual property, limitation of liability, disclaimer of warranties,
                indemnification, and governing law shall survive termination.
              </p>
            </section>

            {/* 14. Governing Law */}
            <section id="governing-law">
              <h2 className="text-xl font-semibold mb-4 text-foreground">14. Governing Law</h2>
              <p className="mb-4">
                These Terms shall be governed by and construed in accordance with the laws of the State of Delaware,
                United States, without regard to its conflict of law provisions.
              </p>
              <p>
                Any disputes arising from these Terms or the Service shall be resolved in the state or federal
                courts located in Delaware, and you consent to the personal jurisdiction of such courts.
              </p>
            </section>

            {/* 15. Changes to Terms */}
            <section id="changes">
              <h2 className="text-xl font-semibold mb-4 text-foreground">15. Changes to Terms</h2>
              <p className="mb-4">
                We reserve the right to modify these Terms at any time. We will notify you of material changes
                by posting the updated Terms on this page and updating the &quot;Last Updated&quot; date.
              </p>
              <p>
                Your continued use of the Service after any changes constitutes acceptance of the new Terms.
                If you do not agree to the modified Terms, you should discontinue use of the Service.
              </p>
            </section>

            {/* 16. Contact Us */}
            <section id="contact">
              <h2 className="text-xl font-semibold mb-4 text-foreground">16. Contact Us</h2>
              <p className="mb-4">If you have any questions about these Terms, please contact us:</p>
              <div className="bg-secondary/50 p-4 rounded-lg">
                <p className="font-medium text-foreground">Sameer Studios LLC</p>
                <p>Operating Styleum</p>
                <p className="mt-2">
                  Email:{" "}
                  <a href="mailto:hello@styleum.app" className="text-primary hover:underline">hello@styleum.app</a>
                </p>
                <p>Website: <Link href="/" className="text-primary hover:underline">styleum.app</Link></p>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
