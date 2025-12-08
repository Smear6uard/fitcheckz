import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PublicProfile } from "@/components/profile/PublicProfile"

interface PageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, bio, avatar_url")
    .eq("username", username)
    .eq("is_public", true)
    .single()

  if (!profile) {
    return {
      title: "Profile Not Found | FitCheckz",
    }
  }

  return {
    title: `${profile.display_name || profile.username} | FitCheckz`,
    description:
      profile.bio || `Check out ${profile.display_name || profile.username}'s style on FitCheckz`,
    openGraph: {
      title: `${profile.display_name || profile.username} on FitCheckz`,
      description:
        profile.bio || `Check out ${profile.display_name || profile.username}'s style`,
      images: profile.avatar_url ? [profile.avatar_url] : [],
    },
  }
}

export default async function PublicProfilePage({ params }: PageProps) {
  const { username } = await params
  const supabase = await createClient()

  // Get current user
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()

  // Fetch profile data
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/community/profile?username=${encodeURIComponent(username)}`,
    { cache: "no-store" }
  )

  if (!res.ok) {
    if (res.status === 404) {
      notFound()
    }
    if (res.status === 403) {
      return (
        <div className="container max-w-4xl py-12">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold mb-2">Private Profile</h1>
            <p className="text-muted-foreground">
              This profile is private. The user hasn't made their profile public.
            </p>
          </div>
        </div>
      )
    }
    throw new Error("Failed to load profile")
  }

  const data = await res.json()

  return (
    <div className="container max-w-4xl py-8">
      <PublicProfile
        profile={data.profile}
        outfits={data.outfits}
        isFollowing={data.isFollowing}
        isOwnProfile={data.isOwnProfile}
        currentUserId={currentUser?.id}
      />
    </div>
  )
}
