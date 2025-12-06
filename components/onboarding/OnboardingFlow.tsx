'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { StyleVibesStep } from './steps/StyleVibesStep'
import { OccasionsStep } from './steps/OccasionsStep'
import { PersonalInfoStep } from './steps/PersonalInfoStep'
import { ColorsStep } from './steps/ColorsStep'
import { GoalsStep } from './steps/GoalsStep'
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'

export interface OnboardingData {
  styleVibes: string[]
  typicalOccasions: string[]
  ageRange?: string
  gender?: string
  favoriteColors: string[]
  fashionGoals: string[]
}

const TOTAL_STEPS = 5

export function OnboardingFlow() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [data, setData] = useState<OnboardingData>({
    styleVibes: [],
    typicalOccasions: [],
    ageRange: undefined,
    gender: undefined,
    favoriteColors: [],
    fashionGoals: [],
  })

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Style Vibes
        return data.styleVibes.length > 0
      case 1: // Occasions
        return data.typicalOccasions.length > 0
      case 2: // Personal Info (optional)
        return true
      case 3: // Colors
        return data.favoriteColors.length > 0
      case 4: // Goals
        return data.fashionGoals.length > 0
      default:
        return true
    }
  }

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep((prev) => prev + 1)
    } else {
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1)
    }
  }

  const handleSkip = () => {
    handleSubmit()
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)

      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to save onboarding data')
      }

      toast.success('Welcome to FitCheckz!', {
        description: 'Your style profile has been saved.',
      })

      router.push('/dashboard')
    } catch (error: any) {
      console.error('Onboarding error:', error)
      toast.error('Failed to complete onboarding', {
        description: error.message || 'Please try again',
      })
      setIsSubmitting(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StyleVibesStep
            selectedVibes={data.styleVibes}
            onUpdate={(vibes) => updateData('styleVibes', vibes)}
          />
        )
      case 1:
        return (
          <OccasionsStep
            selectedOccasions={data.typicalOccasions}
            onUpdate={(occasions) => updateData('typicalOccasions', occasions)}
          />
        )
      case 2:
        return (
          <PersonalInfoStep
            ageRange={data.ageRange}
            gender={data.gender}
            onUpdateAge={(age) => updateData('ageRange', age)}
            onUpdateGender={(gender) => updateData('gender', gender)}
          />
        )
      case 3:
        return (
          <ColorsStep
            selectedColors={data.favoriteColors}
            onUpdate={(colors) => updateData('favoriteColors', colors)}
          />
        )
      case 4:
        return (
          <GoalsStep
            selectedGoals={data.fashionGoals}
            onUpdate={(goals) => updateData('fashionGoals', goals)}
          />
        )
      default:
        return null
    }
  }

  const progress = ((currentStep + 1) / TOTAL_STEPS) * 100

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Welcome to FitCheckz</h1>
          <p className="text-muted-foreground">
            Let's personalize your style experience
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStep + 1} of {TOTAL_STEPS}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card>
          <CardContent className="pt-6">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 0 || isSubmitting}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>

          <Button
            variant="ghost"
            onClick={handleSkip}
            disabled={isSubmitting}
          >
            Skip for now
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed() || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : currentStep === TOTAL_STEPS - 1 ? (
              'Complete'
            ) : (
              <>
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
