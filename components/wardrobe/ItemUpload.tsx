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
    primary_color: "",
    fabric_type: "",
    brand: "",
    size: "",
    cost: "",
    purchase_date: "",
    condition: "",
    removeBg: false,
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
      uploadFormData.append("removeBg", formData.removeBg.toString())

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
        primary_color: formData.primary_color || null,
        fabric_type: formData.fabric_type || null,
        brand: formData.brand || null,
        size: formData.size || null,
        cost: formData.cost ? parseFloat(formData.cost) : null,
        purchase_date: formData.purchase_date || null,
        condition: formData.condition || null,
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
    } catch (error: any) {
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
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="removeBg"
            checked={formData.removeBg}
            onChange={(e) =>
              setFormData({ ...formData, removeBg: e.target.checked })
            }
            className="rounded"
          />
          <Label htmlFor="removeBg" className="text-sm">
            Remove background (uses remove.bg API)
          </Label>
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

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            disabled={uploading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="size">Size</Label>
          <Input
            id="size"
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
            disabled={uploading}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="primary_color">Primary Color</Label>
          <Input
            id="primary_color"
            type="color"
            value={formData.primary_color}
            onChange={(e) =>
              setFormData({ ...formData, primary_color: e.target.value })
            }
            disabled={uploading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cost">Cost ($)</Label>
          <Input
            id="cost"
            type="number"
            step="0.01"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            disabled={uploading}
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fabric_type">Fabric Type</Label>
          <Input
            id="fabric_type"
            value={formData.fabric_type}
            onChange={(e) =>
              setFormData({ ...formData, fabric_type: e.target.value })
            }
            disabled={uploading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="condition">Condition</Label>
          <Select
            value={formData.condition}
            onValueChange={(value) =>
              setFormData({ ...formData, condition: value })
            }
            disabled={uploading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="excellent">Excellent</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="worn">Worn</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="purchase_date">Purchase Date</Label>
        <Input
          id="purchase_date"
          type="date"
          value={formData.purchase_date}
          onChange={(e) =>
            setFormData({ ...formData, purchase_date: e.target.value })
          }
          disabled={uploading}
        />
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

