'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Image as ImageIcon, AlertCircle, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

interface VisualizationButtonProps {
  outfitId: string
  existingVisualization?: string | null
  onVisualizationComplete?: (url: string) => void
}

type VisualizationStatus = 'idle' | 'generating' | 'polling' | 'completed' | 'failed'

const MAX_POLLING_TIME = 120000 // 2 minutes
const POLL_INTERVAL = 2000 // 2 seconds

export function VisualizationButton({
  outfitId,
  existingVisualization,
  onVisualizationComplete,
}: VisualizationButtonProps) {
  const [status, setStatus] = useState<VisualizationStatus>(
    existingVisualization ? 'completed' : 'idle'
  )
  const [error, setError] = useState<string | null>(null)
  const [pollingStartTime, setPollingStartTime] = useState<number | null>(null)

  const handleGenerate = async () => {
    try {
      setStatus('generating')
      setError(null)

      const response = await fetch(`/api/outfits/${outfitId}/visualize`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.limit_reached) {
          toast.error('Limit reached', {
            description: data.error,
            action: {
              label: 'Upgrade',
              onClick: () => (window.location.href = '/subscription'),
            },
          })
          setStatus('idle')
          return
        }
        throw new Error(data.error || 'Failed to start visualization')
      }

      setStatus('polling')
      setPollingStartTime(Date.now())
    } catch (error: any) {
      console.error('Visualization generation error:', error)
      setError(error.message)
      setStatus('failed')
      toast.error('Failed to generate visualization', {
        description: error.message,
      })
    }
  }

  const checkStatus = async () => {
    try {
      const response = await fetch(`/api/outfits/${outfitId}/visualize/status`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to check status')
      }

      if (data.status === 'completed') {
        setStatus('completed')
        setPollingStartTime(null)
        toast.success('Visualization complete!', {
          description: 'Your outfit visualization is ready',
        })
        if (onVisualizationComplete && data.visualization_url) {
          onVisualizationComplete(data.visualization_url)
        }
      } else if (data.status === 'failed') {
        setStatus('failed')
        setPollingStartTime(null)
        setError(data.error || 'Visualization failed')
        toast.error('Visualization failed', {
          description: data.error || 'Please try again',
        })
      }
    } catch (error: any) {
      console.error('Status check error:', error)
      setError(error.message)
      setStatus('failed')
      setPollingStartTime(null)
    }
  }

  useEffect(() => {
    if (status !== 'polling' || !pollingStartTime) return

    // Check for timeout
    const elapsed = Date.now() - pollingStartTime
    if (elapsed >= MAX_POLLING_TIME) {
      setStatus('failed')
      setError('Visualization timed out. Please try again.')
      setPollingStartTime(null)
      toast.error('Visualization timed out', {
        description: 'Please try generating again',
      })
      return
    }

    // Poll for status
    const interval = setInterval(checkStatus, POLL_INTERVAL)

    return () => clearInterval(interval)
  }, [status, pollingStartTime])

  const handleRetry = () => {
    setError(null)
    setStatus('idle')
  }

  if (status === 'completed' && existingVisualization) {
    return (
      <Badge variant="secondary" className="gap-1">
        <ImageIcon className="h-3 w-3" />
        Visualization Ready
      </Badge>
    )
  }

  if (status === 'failed') {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-sm text-destructive">
          <AlertCircle className="h-4 w-4" />
          <span>{error || 'Visualization failed'}</span>
        </div>
        <Button
          onClick={handleRetry}
          variant="outline"
          size="sm"
          className="w-full"
        >
          Try Again
        </Button>
      </div>
    )
  }

  if (status === 'generating') {
    return (
      <Button disabled size="sm" className="w-full">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Starting...
      </Button>
    )
  }

  if (status === 'polling') {
    return (
      <Button disabled size="sm" className="w-full">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Generating... (this may take 10-20 seconds)
      </Button>
    )
  }

  return (
    <Button
      onClick={handleGenerate}
      size="sm"
      className="w-full"
      variant="default"
    >
      <Sparkles className="mr-2 h-4 w-4" />
      Generate Visualization
    </Button>
  )
}
