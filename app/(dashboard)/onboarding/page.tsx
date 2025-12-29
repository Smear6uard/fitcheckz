import { StyleQuiz } from "@/components/onboarding/StyleQuiz"

export const metadata = {
  title: "Style Quiz | Styleum",
  description: "Tell us about your style preferences to get personalized outfit recommendations",
}

export default function OnboardingPage() {
  return (
    <div className="container max-w-2xl py-6">
      <StyleQuiz />
    </div>
  )
}
