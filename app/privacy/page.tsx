import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import Link from "next/link"

export const metadata = {
  title: "Privacy Policy | Styleum",
  description: "Privacy Policy for Styleum - Learn how we collect, use, and protect your data.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="bg-card rounded-lg border border-border p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
            <p className="text-muted-foreground">Last Updated: December 12, 2025</p>
          </div>

          {/* Table of Contents */}
          <nav className="mb-10 p-4 bg-secondary/50 rounded-lg">
            <h2 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">Contents</h2>
            <ol className="space-y-1 text-sm">
              <li><a href="#introduction" className="text-primary hover:underline">1. Introduction</a></li>
              <li><a href="#information-we-collect" className="text-primary hover:underline">2. Information We Collect</a></li>
              <li><a href="#how-we-use" className="text-primary hover:underline">3. How We Use Your Information</a></li>
              <li><a href="#ai-services" className="text-primary hover:underline">4. AI and Third-Party Services</a></li>
              <li><a href="#image-storage" className="text-primary hover:underline">5. Image Storage and Retention</a></li>
              <li><a href="#data-sharing" className="text-primary hover:underline">6. Data Sharing</a></li>
              <li><a href="#user-rights" className="text-primary hover:underline">7. Your Rights</a></li>
              <li><a href="#cookies" className="text-primary hover:underline">8. Cookies and Analytics</a></li>
              <li><a href="#children" className="text-primary hover:underline">9. Children&apos;s Privacy</a></li>
              <li><a href="#california-gdpr" className="text-primary hover:underline">10. California & GDPR Rights</a></li>
              <li><a href="#security" className="text-primary hover:underline">11. Data Security</a></li>
              <li><a href="#changes" className="text-primary hover:underline">12. Changes to This Policy</a></li>
              <li><a href="#contact" className="text-primary hover:underline">13. Contact Us</a></li>
            </ol>
          </nav>

          <div className="space-y-10 text-muted-foreground">
            {/* 1. Introduction */}
            <section id="introduction">
              <h2 className="text-xl font-semibold mb-4 text-foreground">1. Introduction</h2>
              <p className="mb-4">
                Styleum (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is operated by <strong>Sameer Studios LLC</strong>.
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use
                our AI-powered fashion and outfit recommendation service at styleum.app (the &quot;Service&quot;).
              </p>
              <p>
                By using Styleum, you agree to the collection and use of information in accordance with this policy.
                If you do not agree with our policies and practices, please do not use our Service.
              </p>
            </section>

            {/* 2. Information We Collect */}
            <section id="information-we-collect">
              <h2 className="text-xl font-semibold mb-4 text-foreground">2. Information We Collect</h2>

              <h3 className="text-lg font-medium mb-2 text-foreground">Account Information</h3>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Email address</li>
                <li>Username</li>
                <li>Password (stored securely as a hash)</li>
                <li>Profile photo (optional)</li>
                <li>Authentication data from Google OAuth (if you sign in with Google)</li>
              </ul>

              <h3 className="text-lg font-medium mb-2 text-foreground">Wardrobe and Style Data</h3>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Photos of clothing items you upload</li>
                <li>Item metadata (category, color, brand, size, etc.)</li>
                <li>Style preferences and aesthetic choices</li>
                <li>Body type and sizing information (optional)</li>
                <li>Outfit history and favorites</li>
              </ul>

              <h3 className="text-lg font-medium mb-2 text-foreground">Usage Data</h3>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Features you use and actions you take</li>
                <li>Outfit ratings and feedback</li>
                <li>Time spent on the Service</li>
                <li>Device type, browser, and operating system</li>
                <li>IP address and general location (city/region level)</li>
              </ul>
            </section>

            {/* 3. How We Use Your Information */}
            <section id="how-we-use">
              <h2 className="text-xl font-semibold mb-4 text-foreground">3. How We Use Your Information</h2>
              <p className="mb-4">We use your information to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide personalized outfit recommendations using AI</li>
                <li>Analyze your wardrobe items to understand colors, styles, and categories</li>
                <li>Generate outfit visualizations</li>
                <li>Track your style preferences and improve recommendations over time</li>
                <li>Enable social features (public profiles, outfit sharing, follows)</li>
                <li>Process subscription payments (for Pro users)</li>
                <li>Send service-related communications (account verification, updates)</li>
                <li>Improve our AI models and Service quality (using aggregated, anonymized data)</li>
                <li>Prevent fraud and ensure security</li>
              </ul>
            </section>

            {/* 4. AI and Third-Party Services */}
            <section id="ai-services">
              <h2 className="text-xl font-semibold mb-4 text-foreground">4. AI and Third-Party Services</h2>
              <p className="mb-4">
                Styleum uses artificial intelligence to analyze your wardrobe and generate outfit recommendations.
                Your data may be processed by the following third-party services:
              </p>

              <h3 className="text-lg font-medium mb-2 text-foreground">AI Processing</h3>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li><strong>OpenRouter/Anthropic Claude</strong> - For analyzing clothing images and generating outfit recommendations</li>
                <li><strong>Replicate</strong> - For generating outfit visualization images</li>
              </ul>
              <p className="mb-4 text-sm">
                When you upload images or request outfit suggestions, your wardrobe data is sent to these AI services for processing.
                These services process data according to their respective privacy policies.
              </p>

              <h3 className="text-lg font-medium mb-2 text-foreground">Infrastructure & Services</h3>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li><strong>Supabase</strong> - Database, authentication, and image storage</li>
                <li><strong>Vercel</strong> - Application hosting and deployment</li>
                <li><strong>Google OAuth</strong> - Social authentication (optional)</li>
                <li><strong>Stripe</strong> - Payment processing for Pro subscriptions</li>
                <li><strong>Sentry</strong> - Error tracking and monitoring</li>
              </ul>
            </section>

            {/* 5. Image Storage and Retention */}
            <section id="image-storage">
              <h2 className="text-xl font-semibold mb-4 text-foreground">5. Image Storage and Retention</h2>
              <ul className="list-disc pl-6 space-y-1">
                <li>Wardrobe images are stored securely in Supabase Storage</li>
                <li>Images are retained for as long as your account is active</li>
                <li>When you delete an item, the image is permanently removed from our servers</li>
                <li>When you delete your account, all images and data are permanently deleted</li>
                <li>We do not sell your images or use them for purposes other than providing the Service</li>
                <li>Images sent to AI services for analysis are processed in real-time and not stored by those services beyond the immediate request</li>
              </ul>
            </section>

            {/* 6. Data Sharing */}
            <section id="data-sharing">
              <h2 className="text-xl font-semibold mb-4 text-foreground">6. Data Sharing</h2>
              <p className="mb-4">We do not sell your personal information. We may share your data in these limited circumstances:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>With your consent</strong> - When you make your profile or outfits public</li>
                <li><strong>Service providers</strong> - Third parties that help us operate the Service (as listed above)</li>
                <li><strong>Legal requirements</strong> - If required by law or to protect our rights</li>
                <li><strong>Business transfers</strong> - In connection with a merger, acquisition, or sale of assets</li>
              </ul>
            </section>

            {/* 7. Your Rights */}
            <section id="user-rights">
              <h2 className="text-xl font-semibold mb-4 text-foreground">7. Your Rights</h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Access</strong> - Request a copy of your personal data</li>
                <li><strong>Correction</strong> - Update or correct inaccurate information</li>
                <li><strong>Deletion</strong> - Delete your account and all associated data</li>
                <li><strong>Export</strong> - Request your data in a portable format</li>
                <li><strong>Opt-out</strong> - Unsubscribe from marketing communications</li>
                <li><strong>Restrict processing</strong> - Limit how we use your data in certain circumstances</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us at{" "}
                <a href="mailto:hello@styleum.app" className="text-primary hover:underline">hello@styleum.app</a>.
              </p>
            </section>

            {/* 8. Cookies and Analytics */}
            <section id="cookies">
              <h2 className="text-xl font-semibold mb-4 text-foreground">8. Cookies and Analytics</h2>
              <p className="mb-4">We use cookies and similar technologies for:</p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li><strong>Essential cookies</strong> - Required for authentication and core functionality</li>
                <li><strong>Preference cookies</strong> - Remember your settings and preferences</li>
                <li><strong>Analytics cookies</strong> - Understand how you use our Service (aggregated data)</li>
              </ul>
              <p>
                You can control cookies through your browser settings. Note that disabling essential cookies may affect Service functionality.
              </p>
            </section>

            {/* 9. Children's Privacy */}
            <section id="children">
              <h2 className="text-xl font-semibold mb-4 text-foreground">9. Children&apos;s Privacy</h2>
              <p className="mb-4">
                Styleum is not intended for children under 13 years of age. We do not knowingly collect personal
                information from children under 13. If you are a parent or guardian and believe your child has
                provided us with personal information, please contact us immediately.
              </p>
              <p>
                If we discover that we have collected personal information from a child under 13, we will
                promptly delete that information.
              </p>
            </section>

            {/* 10. California & GDPR Rights */}
            <section id="california-gdpr">
              <h2 className="text-xl font-semibold mb-4 text-foreground">10. California & GDPR Rights</h2>

              <h3 className="text-lg font-medium mb-2 text-foreground">California Residents (CCPA)</h3>
              <p className="mb-4">If you are a California resident, you have the right to:</p>
              <ul className="list-disc pl-6 mb-4 space-y-1">
                <li>Know what personal information we collect and how it&apos;s used</li>
                <li>Request deletion of your personal information</li>
                <li>Opt-out of the sale of personal information (we do not sell your data)</li>
                <li>Non-discrimination for exercising your privacy rights</li>
              </ul>

              <h3 className="text-lg font-medium mb-2 text-foreground">European Users (GDPR)</h3>
              <p className="mb-4">If you are in the European Economic Area, you have additional rights:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Right to access, rectify, and erase your data</li>
                <li>Right to data portability</li>
                <li>Right to restrict or object to processing</li>
                <li>Right to withdraw consent at any time</li>
                <li>Right to lodge a complaint with a supervisory authority</li>
              </ul>
            </section>

            {/* 11. Data Security */}
            <section id="security">
              <h2 className="text-xl font-semibold mb-4 text-foreground">11. Data Security</h2>
              <p className="mb-4">
                We implement appropriate technical and organizational measures to protect your personal information, including:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Encryption of data in transit (HTTPS/TLS)</li>
                <li>Secure password hashing</li>
                <li>Row-level security policies in our database</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal data on a need-to-know basis</li>
              </ul>
              <p className="mt-4">
                However, no method of transmission over the Internet is 100% secure. While we strive to protect
                your data, we cannot guarantee absolute security.
              </p>
            </section>

            {/* 12. Changes to This Policy */}
            <section id="changes">
              <h2 className="text-xl font-semibold mb-4 text-foreground">12. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any material changes
                by posting the new policy on this page and updating the &quot;Last Updated&quot; date. We encourage
                you to review this Privacy Policy periodically.
              </p>
            </section>

            {/* 13. Contact Us */}
            <section id="contact">
              <h2 className="text-xl font-semibold mb-4 text-foreground">13. Contact Us</h2>
              <p className="mb-4">If you have questions about this Privacy Policy or our data practices, please contact us:</p>
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
