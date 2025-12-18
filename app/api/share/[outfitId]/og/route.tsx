import { ImageResponse } from "next/og"
import { createClient } from "@/lib/supabase/server"

export const runtime = "edge"

export async function GET(
  request: Request,
  { params }: { params: Promise<{ outfitId: string }> }
) {
  const { outfitId } = await params

  try {
    const supabase = await createClient()

    // Fetch outfit details
    const { data: outfit, error: outfitError } = await supabase
      .from("outfit_suggestions")
      .select("*")
      .eq("id", outfitId)
      .single()

    if (outfitError || !outfit) {
      return new Response("Outfit not found", { status: 404 })
    }

    // Fetch wardrobe items for this outfit
    const { data: items, error: itemsError } = await supabase
      .from("wardrobe_items")
      .select("id, item_name, category, photo_url, primary_color")
      .in("id", outfit.wardrobe_item_ids || [])

    if (itemsError) {
      console.error("Error fetching items:", itemsError)
    }

    const outfitItems = items || []

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #f5f5dc 0%, #e6e6fa 50%, #e0f2f1 100%)",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 40,
            }}
          >
            <div
              style={{
                fontSize: 48,
                fontWeight: 800,
                background: "linear-gradient(90deg, #a3e635, #14b8a6)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              FitCheckz
            </div>
            <div
              style={{
                fontSize: 32,
                marginLeft: 16,
              }}
            >
              ✨
            </div>
          </div>

          {/* Outfit Grid */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: 20,
              maxWidth: 800,
              padding: 20,
            }}
          >
            {outfitItems.slice(0, 4).map((item, index) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: 180,
                  height: 220,
                  background: "white",
                  borderRadius: 16,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  overflow: "hidden",
                }}
              >
                {item.photo_url ? (
                  <img
                    src={item.photo_url}
                    alt={item.item_name}
                    style={{
                      width: "100%",
                      height: 160,
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: 160,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#f5f5f5",
                      fontSize: 48,
                    }}
                  >
                    {item.category === "top" && "👕"}
                    {item.category === "bottom" && "👖"}
                    {item.category === "dress" && "👗"}
                    {item.category === "shoes" && "👟"}
                    {item.category === "accessories" && "👜"}
                    {!["top", "bottom", "dress", "shoes", "accessories"].includes(
                      item.category
                    ) && "✨"}
                  </div>
                )}
                <div
                  style={{
                    padding: "12px",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#1a1a1a",
                      textAlign: "center",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      maxWidth: "100%",
                    }}
                  >
                    {item.item_name}
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: "#6b7280",
                      textTransform: "capitalize",
                    }}
                  >
                    {item.category}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Outfit Info */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              marginTop: 32,
            }}
          >
            {outfit.occasion && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 20px",
                  background: "rgba(163, 230, 53, 0.2)",
                  borderRadius: 100,
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#365314",
                }}
              >
                {outfit.occasion === "casual" && "☕ Casual"}
                {outfit.occasion === "work" && "💼 Work"}
                {outfit.occasion === "date" && "💕 Date Night"}
                {outfit.occasion === "party" && "🎉 Party"}
                {outfit.occasion === "formal" && "✨ Formal"}
                {outfit.occasion === "workout" && "🏃 Workout"}
                {!["casual", "work", "date", "party", "formal", "workout"].includes(
                  outfit.occasion || ""
                ) && `✨ ${outfit.occasion}`}
              </div>
            )}
            {outfit.risk_level && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "8px 20px",
                  background: "rgba(20, 184, 166, 0.2)",
                  borderRadius: 100,
                  fontSize: 18,
                  fontWeight: 600,
                  color: "#134e4a",
                }}
              >
                {outfit.risk_level <= 2 && "🛡️ Safe"}
                {outfit.risk_level === 3 && "⚡ Balanced"}
                {outfit.risk_level >= 4 && "🔥 Bold"}
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              position: "absolute",
              bottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 16,
              color: "#6b7280",
            }}
          >
            <span>Created with</span>
            <span style={{ color: "#a3e635", fontWeight: 700 }}>FitCheckz</span>
            <span>🔥</span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error("OG Image generation error:", error)
    return new Response("Error generating image", { status: 500 })
  }
}
