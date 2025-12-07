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
import { Upload, X, Camera } from "lucide-react"
import Image from "next/image"
import { CameraCapture } from "./CameraCapture"
import { isMobileDevice, hasCamera } from "@/lib/utils/deviceDetection"

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
    if (!file) {
      toast.error("Please select an image")
      return
    }

    setUploading(true)

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

      if (!res.ok) throw new Error("Failed to create item")

      setCompressionProgress(100)
      toast.success("Item added to wardrobe!")
      router.push("/wardrobe")
    } catch (error: unknown) {
      toast.error(error.message || "Failed to upload item")
    } finally {
      setUploading(false)
      setCompressionProgress(0)
    }
  }

  return (
    <>
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
                >
                  <X className="h-4 w-4" />
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
                      disabled={uploading}
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
              disabled={uploading}
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
          disabled={uploading}
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
          disabled={uploading}
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

      <Button type="submit" disabled={uploading} className="w-full touch-target">
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

