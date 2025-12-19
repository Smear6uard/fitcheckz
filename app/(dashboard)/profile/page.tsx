import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileForm } from "@/components/profile/ProfileForm"
import { ExternalLink } from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Manage your profile and style preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your profile details and style preferences to get better outfit recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About Styleum</CardTitle>
          <CardDescription>
            Learn more about the app and what we offer
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href="/?landing=true"
            className="inline-flex items-center gap-2 text-primary hover:underline"
          >
            Visit our homepage
            <ExternalLink className="h-4 w-4" />
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

