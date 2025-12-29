"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { compressImage } from "@/lib/utils/imageOptimization"
import { getErrorMessage } from "@/lib/utils/error-handling"
import { Upload, X, Camera } from "lucide-react"
import Image from "next/image"
import { CameraCapture } from "./CameraCapture"
import { isMobileDevice, hasCamera } from "@/lib/utils/deviceDetection"
import { CelebrationAnimation } from "@/components/ui/celebration-animation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { UpgradePrompt } from "@/components/subscription/UpgradePrompt"

export function ItemUpload() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [compressionProgress, setCompressionProgress] = useState(0)
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [cameraAvailable, setCameraAvailable] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [milestone, setMilestone] = useState<string | null>(null)
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    item_name: "",
    category: "",
  })

  useEffect(() => {
    setIsMobile(isMobileDevice())
    setCameraAvailable(hasCamera())
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    if (!selectedFile.type.startsWith("image/")) {
      toast.error("Please select an image file")
      return
    }

    setFile(selectedFile)
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(selectedFile)
  }

  const handleCameraCapture = async (imageData: string) => {
    // Convert base64 to File object
    const response = await fetch(imageData)
    const blob = await response.blob()
    const file = new File([blob], `camera-${Date.now()}.jpg`, { type: "image/jpeg" })

    setFile(file)
    setPreview(imageData)
    setShowCamera(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file || isSubmitting || uploading) {
      if (!file) {
        toast.error("Please select an image")
      }
      return
    }

    setUploading(true)
    setIsSubmitting(true)

    try {
      // Compress image with progress
      setCompressionProgress(30)
      const compressedFile = await compressImage(file)
      setCompressionProgress(60)

      // Upload image
      const uploadFormData = new FormData()
      uploadFormData.append("file", compressedFile)

      const uploadRes = await fetch("/api/wardrobe/upload", {
        method: "POST",
        body: uploadFormData,
      })

      if (!uploadRes.ok) throw new Error("Failed to upload image")

      const { url } = await uploadRes.json()
      setCompressionProgress(80)

      // Create wardrobe item
      const itemData = {
        item_name: formData.item_name,
        photo_url: url,
        category: formData.category,
      }

      const res = await fetch("/api/wardrobe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        // Check if it's a limit error
        if (res.status === 403 && errorData.error?.includes("limit")) {
          setShowUpgradePrompt(true)
          return
        }
        throw new Error(errorData.error || "Failed to create item")
      }

      const result = await res.json()
      const totalCount = result.totalCount || 1

      setCompressionProgress(100)

      // Check for milestones
      if (totalCount === 1) {
        setMilestone("first")
        setShowCelebration(true)
        toast.success("🎉 Your first item! Welcome to Styleum!")
        // Reset form but keep submitting state until dialog closes
        setFormData({ item_name: "", category: "" })
        setFile(null)
        setPreview(null)
      } else if (totalCount === 3) {
        setMilestone("style-score")
        setShowCelebration(true)
        toast.success("✨ Style Score unlocked! Add more items to see your score grow.")
        setFormData({ item_name: "", category: "" })
        setFile(null)
        setPreview(null)
      } else if (totalCount === 10) {
        setMilestone("collection")
        setShowCelebration(true)
        toast.success("🌟 Amazing! You've built a solid wardrobe collection!")
        setFormData({ item_name: "", category: "" })
        setFile(null)
        setPreview(null)
      } else {
        toast.success("Item added to wardrobe!")
        // Reset form and navigate
        setFormData({ item_name: "", category: "" })
        setFile(null)
        setPreview(null)
        setIsSubmitting(false)
        setUploading(false)
        router.push("/wardrobe")
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || "Failed to upload item")
      setIsSubmitting(false)
    } finally {
      if (!showCelebration) {
        setUploading(false)
        setIsSubmitting(false)
      }
      setCompressionProgress(0)
    }
  }

  const handleCelebrationComplete = () => {
    setShowCelebration(false)
    setMilestone(null)
    setIsSubmitting(false)
    setUploading(false)
    router.push("/wardrobe")
  }

  const getMilestoneMessage = () => {
    switch (milestone) {
      case "first":
        return {
          title: "🎉 Welcome to Styleum!",
          description: "You've added your first item! Keep adding more to unlock personalized outfit recommendations.",
        }
      case "style-score":
        return {
          title: "✨ Style Score Unlocked!",
          description: "You've added 3 items! Your personalized style score is now available. Check your dashboard to see it!",
        }
      case "collection":
        return {
          title: "🌟 Wardrobe Collection Growing!",
          description: "You've added 10 items! Your wardrobe is getting impressive. Generate some outfits to see the magic!",
        }
      default:
        return { title: "", description: "" }
    }
  }

  const milestoneMsg = getMilestoneMessage()

  return (
    <>
      <UpgradePrompt
        open={showUpgradePrompt}
        onOpenChange={setShowUpgradePrompt}
        type="wardrobe"
        current={50}
        limit={50}
      />

      <Dialog open={showCelebration} onOpenChange={() => {}}>
        <DialogContent className="overflow-hidden z-[100] max-w-lg mx-auto p-0 border-0 shadow-2xl">
          {/* Celebration Animation Background */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <CelebrationAnimation trigger={showCelebration} size="lg" />
          </div>
          
          {/* Content */}
          <div className="relative z-10 bg-gradient-to-br from-primary/10 via-background to-primary/5 p-8 rounded-lg">
            <DialogHeader className="relative z-10 text-center">
              <DialogTitle className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-primary to-brand-lime bg-clip-text text-transparent">
                {milestoneMsg.title}
              </DialogTitle>
              <DialogDescription className="text-base pt-2 text-center text-foreground/90 max-w-md mx-auto">
                {milestoneMsg.description}
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center pt-8 pb-2 relative z-10">
              <Button 
                onClick={handleCelebrationComplete} 
                size="lg"
                className="bg-gradient-to-r from-brand-teal to-brand-lime text-brand-charcoal font-semibold hover:from-brand-teal/90 hover:to-brand-lime/90 shadow-lg px-8"
              >
                Continue
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {showCamera && (
        <CameraCapture
          onCapture={handleCameraCapture}
          onClose={() => setShowCamera(false)}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="image">Item Photo</Label>
          <div className="border-2 border-dashed rounded-lg p-4">
            {preview ? (
              <div className="relative aspect-square max-w-xs mx-auto">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 touch-target"
                  onClick={() => {
                    setPreview(null)
                    setFile(null)
                  }}
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center cursor-pointer py-4"
                >
                  <Upload className="h-12 w-12 text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </span>
                </label>

                {isMobile && cameraAvailable && (
                  <>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          Or
                        </span>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full touch-target"
                      onClick={() => setShowCamera(true)}
                      disabled={uploading || isSubmitting || showCelebration}
                    >
                      <Camera className="mr-2 h-4 w-4" />
                      Take Photo
                    </Button>
                  </>
                )}
              </div>
            )}
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={uploading || isSubmitting || showCelebration}
            />
          </div>
        </div>

        <div className="space-y-2">
        <Label htmlFor="item_name">Item Name *</Label>
        <Input
          id="item_name"
          value={formData.item_name}
          onChange={(e) =>
            setFormData({ ...formData, item_name: e.target.value })
          }
          required
          disabled={uploading || isSubmitting || showCelebration}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category *</Label>
        <Select
          value={formData.category}
          onValueChange={(value) =>
            setFormData({ ...formData, category: value })
          }
          required
          disabled={uploading || isSubmitting || showCelebration}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="top">Top</SelectItem>
            <SelectItem value="bottom">Bottom</SelectItem>
            <SelectItem value="dress">Dress</SelectItem>
            <SelectItem value="jacket">Jacket</SelectItem>
            <SelectItem value="shoes">Shoes</SelectItem>
            <SelectItem value="accessories">Accessories</SelectItem>
            <SelectItem value="outerwear">Outerwear</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" disabled={uploading || isSubmitting || showCelebration} className="w-full touch-target active:scale-95 transition-transform">
        {uploading
          ? compressionProgress > 0
            ? `Processing... ${compressionProgress}%`
            : "Uploading..."
          : "Add to Wardrobe"}
      </Button>
      </form>
    </>
  )
}

