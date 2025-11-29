import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ItemUpload } from "@/components/wardrobe/ItemUpload"

export default function UploadPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Add Wardrobe Item</h1>
        <p className="text-muted-foreground">
          Upload a photo and add details about your clothing item
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Item Details</CardTitle>
          <CardDescription>
            Fill in the information about your wardrobe item
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ItemUpload />
        </CardContent>
      </Card>
    </div>
  )
}

