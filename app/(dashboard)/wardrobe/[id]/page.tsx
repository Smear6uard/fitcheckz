"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { WardrobeItem } from "@/types/wardrobe"
import { toast } from "sonner"
import { ArrowLeft, Trash2 } from "lucide-react"
import { getErrorMessage } from "@/lib/utils/error-handling"

export default function WardrobeItemPage() {
  const params = useParams()
  const router = useRouter()
  const [item, setItem] = useState<WardrobeItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    if (params.id) {
      fetchItem(params.id as string)
    }
  }, [params.id])

  const fetchItem = async (id: string) => {
    try {
      const res = await fetch("/api/wardrobe")
      if (!res.ok) throw new Error("Failed to fetch items")
      const items = await res.json()
      const foundItem = items.find((i: WardrobeItem) => i.id === id)
      if (foundItem) {
        setItem(foundItem)
      } else {
        toast.error("Item not found")
        router.push("/wardrobe")
      }
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || "Failed to load item")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!item) return

    try {
      const res = await fetch(`/api/wardrobe/${item.id}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete item")

      toast.success("Item deleted")
      setShowDeleteDialog(false)
      router.push("/wardrobe")
    } catch (error: unknown) {
      toast.error(getErrorMessage(error) || "Failed to delete item")
    }
  }

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-20" />
          <Skeleton className="h-10 w-24" />
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <Skeleton className="aspect-square w-full rounded-t-lg" />
          </Card>
          <Card>
            <CardContent className="p-6 space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!item) {
    return null
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button variant="destructive" onClick={() => setShowDeleteDialog(true)}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Wardrobe Item</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{item.item_name}"? This action cannot be undone and the item will be permanently removed from your wardrobe.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <div className="aspect-square relative">
            <Image
              src={item.photo_url}
              alt={item.item_name}
              fill
              className="object-cover rounded-t-lg"
            />
          </div>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-4">
            <div>
              <h1 className="text-2xl font-bold">{item.item_name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <Badge>{item.category}</Badge>
                {item.brand && <Badge variant="outline">{item.brand}</Badge>}
              </div>
            </div>

            <div className="space-y-2">
              {item.primary_color && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Color:</span>
                  <div
                    className="w-6 h-6 rounded-full border border-border"
                    style={{ backgroundColor: item.primary_color }}
                    title={item.primary_color}
                  />
                  <span className="text-sm">{item.primary_color}</span>
                </div>
              )}
              {item.size && (
                <div>
                  <span className="text-sm text-muted-foreground">Size: </span>
                  <span className="text-sm">{item.size}</span>
                </div>
              )}
              {item.fabric_type && (
                <div>
                  <span className="text-sm text-muted-foreground">Fabric: </span>
                  <span className="text-sm">{item.fabric_type}</span>
                </div>
              )}
              {item.cost && (
                <div>
                  <span className="text-sm text-muted-foreground">Cost: </span>
                  <span className="text-sm">${item.cost.toFixed(2)}</span>
                </div>
              )}
              {item.condition && (
                <div>
                  <span className="text-sm text-muted-foreground">Condition: </span>
                  <span className="text-sm capitalize">{item.condition}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

