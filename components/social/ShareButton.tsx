"use client"

import { useState } from "react"
import { animated, useSpring, config } from "@react-spring/web"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { toast } from "@/lib/utils/toast-personality"
import {
  Share2,
  Twitter,
  Link as LinkIcon,
  MessageCircle,
  Check,
  Send,
} from "lucide-react"
import {
  canShare,
  shareNative,
  copyToClipboard,
  getTwitterShareUrl,
  getWhatsAppShareUrl,
  openShareWindow,
  generateOutfitShareText,
  getOutfitShareUrl,
  type ShareData,
} from "@/lib/utils/social-share"

interface ShareButtonProps {
  outfitId: string
  occasion?: string
  score?: number
  className?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

export function ShareButton({
  outfitId,
  occasion,
  score,
  className,
  variant = "outline",
  size = "default",
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = getOutfitShareUrl(outfitId)
  const shareText = generateOutfitShareText(occasion, score)

  const shareData: ShareData = {
    title: "Check out my outfit!",
    text: shareText,
    url: shareUrl,
  }

  // Copy animation
  const copySpring = useSpring({
    scale: copied ? 1.2 : 1,
    config: config.wobbly,
  })

  // Check icon animation
  const checkSpring = useSpring({
    opacity: copied ? 1 : 0,
    scale: copied ? 1 : 0,
    config: config.gentle,
  })

  const handleNativeShare = async () => {
    const success = await shareNative(shareData)
    if (success) {
      setIsOpen(false)
    }
  }

  const handleTwitterShare = () => {
    const url = getTwitterShareUrl(shareText, shareUrl)
    openShareWindow(url, "Share on Twitter")
    setIsOpen(false)
  }

  const handleWhatsAppShare = () => {
    const url = getWhatsAppShareUrl(`${shareText} ${shareUrl}`)
    openShareWindow(url, "Share on WhatsApp")
    setIsOpen(false)
  }

  const handleTelegramShare = () => {
    const text = encodeURIComponent(shareText)
    const url = encodeURIComponent(shareUrl)
    openShareWindow(
      `https://t.me/share/url?url=${url}&text=${text}`,
      "Share on Telegram"
    )
    setIsOpen(false)
  }

  const handleCopyLink = async () => {
    await copyToClipboard(shareUrl)
    setCopied(true)
    toast.success("Link copied!")
    setTimeout(() => setCopied(false), 2000)
  }

  // If native share is available, use it directly on mobile
  const showNativeButton = canShare()

  if (showNativeButton && size === "icon") {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={handleNativeShare}
        className={cn("transition-all hover:scale-105", className)}
      >
        <Share2 className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn(
            "gap-2 transition-all",
            isOpen && "bg-primary/20 border-primary",
            className
          )}
        >
          <Share2 className="h-4 w-4" />
          {size !== "icon" && "Share"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {/* Copy Link */}
        <DropdownMenuItem
          onClick={handleCopyLink}
          className="cursor-pointer gap-3"
        >
          <animated.div
            style={{
              scale: copySpring.scale,
            }}
            className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-muted"
          >
            <LinkIcon
              className={cn(
                "h-4 w-4 transition-opacity",
                copied && "opacity-0"
              )}
            />
            <animated.div
              style={{
                opacity: checkSpring.opacity,
                scale: checkSpring.scale,
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Check className="h-4 w-4 text-green-500" />
            </animated.div>
          </animated.div>
          <div className="flex flex-col">
            <span className="font-medium">{copied ? "Copied!" : "Copy Link"}</span>
            <span className="text-xs text-muted-foreground">Share anywhere</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Native Share (if available) */}
        {showNativeButton && (
          <DropdownMenuItem
            onClick={handleNativeShare}
            className="cursor-pointer gap-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Share2 className="h-4 w-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-medium">Share...</span>
              <span className="text-xs text-muted-foreground">More options</span>
            </div>
          </DropdownMenuItem>
        )}

        {/* Twitter/X */}
        <DropdownMenuItem
          onClick={handleTwitterShare}
          className="cursor-pointer gap-3"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black">
            <Twitter className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">Twitter / X</span>
            <span className="text-xs text-muted-foreground">Post your look</span>
          </div>
        </DropdownMenuItem>

        {/* WhatsApp */}
        <DropdownMenuItem
          onClick={handleWhatsAppShare}
          className="cursor-pointer gap-3"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500">
            <MessageCircle className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">WhatsApp</span>
            <span className="text-xs text-muted-foreground">Send to friends</span>
          </div>
        </DropdownMenuItem>

        {/* Telegram */}
        <DropdownMenuItem
          onClick={handleTelegramShare}
          className="cursor-pointer gap-3"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
            <Send className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-medium">Telegram</span>
            <span className="text-xs text-muted-foreground">Share via chat</span>
          </div>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Preview info */}
        <div className="px-2 py-2">
          <p className="text-xs text-muted-foreground text-center">
            Includes preview image ✨
          </p>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

/**
 * Compact share button for cards
 */
export function ShareIconButton({
  outfitId,
  occasion,
  score,
  className,
}: Omit<ShareButtonProps, "variant" | "size">) {
  return (
    <ShareButton
      outfitId={outfitId}
      occasion={occasion}
      score={score}
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", className)}
    />
  )
}
