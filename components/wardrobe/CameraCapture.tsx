'use client'

import { useCallback, useRef, useState } from 'react'
import Webcam from 'react-webcam'
import { Camera, FlipHorizontal, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CameraCaptureProps {
  onCapture: (imageData: string) => void
  onClose: () => void
}

export function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)

  const videoConstraints = {
    facingMode,
    width: { ideal: 1920 },
    height: { ideal: 1080 },
  }

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot()
    if (imageSrc) {
      onCapture(imageSrc)
    }
  }, [onCapture])

  const toggleFacingMode = useCallback(() => {
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'))
  }, [])

  const handleUserMedia = useCallback(() => {
    setHasPermission(true)
  }, [])

  const handleUserMediaError = useCallback(() => {
    setHasPermission(false)
  }, [])

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/50 to-transparent safe-area-top">
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="text-white hover:bg-white/20 touch-target"
        >
          <X className="w-6 h-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFacingMode}
          className="text-white hover:bg-white/20 touch-target"
        >
          <FlipHorizontal className="w-6 h-6" />
        </Button>
      </div>

      {/* Camera View */}
      <div className="relative w-full h-full">
        {hasPermission === false && (
          <div className="flex flex-col items-center justify-center h-full p-4 text-white">
            <Camera className="w-16 h-16 mb-4 opacity-50" />
            <h2 className="mb-2 text-xl font-bold">Camera Access Denied</h2>
            <p className="text-center text-white/80">
              Please allow camera access in your browser settings to take photos.
            </p>
          </div>
        )}

        {hasPermission !== false && (
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            onUserMedia={handleUserMedia}
            onUserMediaError={handleUserMediaError}
            className="object-cover w-full h-full"
            mirrored={facingMode === 'user'}
          />
        )}
      </div>

      {/* Capture Button */}
      {hasPermission && (
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center pb-8 safe-area-bottom">
          <Button
            size="lg"
            onClick={handleCapture}
            className={cn(
              'w-20 h-20 rounded-full bg-white border-4 border-white/30',
              'hover:bg-white/90 active:scale-95 transition-all',
              'shadow-lg touch-target-lg'
            )}
          >
            <Camera className="w-8 h-8 text-black" />
          </Button>
        </div>
      )}
    </div>
  )
}
