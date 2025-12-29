import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProfileForm } from "@/components/profile/ProfileForm"
import { Button } from "@/components/ui/button"
import {
  ExternalLink,
  Trophy,
  BarChart3,
  Settings,
  Sparkles,
  ChevronRight
} from "lucide-react"

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">
          Manage your profile and style preferences
        </p>
      </div>

      {/* Quick Links - visible on mobile */}
      <div className="grid grid-cols-2 gap-3 md:hidden">
        <Link href="/achievements">
          <Card className="hover:bg-sidebar-accent transition-colors">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/10">
                <Trophy className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="font-medium text-sm">Achievements</p>
                <p className="text-xs text-muted-foreground">View badges</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/analytics">
          <Card className="hover:bg-sidebar-accent transition-colors">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10">
                <BarChart3 className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="font-medium text-sm">Analytics</p>
                <p className="text-xs text-muted-foreground">Your stats</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/settings">
          <Card className="hover:bg-sidebar-accent transition-colors">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-500/10">
                <Settings className="h-5 w-5 text-gray-500" />
              </div>
              <div>
                <p className="font-medium text-sm">Settings</p>
                <p className="text-xs text-muted-foreground">Preferences</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/onboarding">
          <Card className="hover:bg-sidebar-accent transition-colors">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-500/10">
                <Sparkles className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="font-medium text-sm">Style Quiz</p>
                <p className="text-xs text-muted-foreground">Retake quiz</p>
              </div>
            </CardContent>
          </Card>
        </Link>
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

      {/* Desktop-only quick links */}
      <div className="hidden md:block space-y-4">
        <h2 className="text-lg font-semibold">Quick Links</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="outline" className="justify-between h-auto py-4" asChild>
            <Link href="/achievements">
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-500" />
                <span>Achievements</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" className="justify-between h-auto py-4" asChild>
            <Link href="/analytics">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-blue-500" />
                <span>Analytics</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" className="justify-between h-auto py-4" asChild>
            <Link href="/settings">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-gray-500" />
                <span>Settings</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" className="justify-between h-auto py-4" asChild>
            <Link href="/onboarding">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span>Retake Style Quiz</span>
              </div>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

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

