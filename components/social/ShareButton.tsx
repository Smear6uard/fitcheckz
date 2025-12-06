"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Share2,
  Twitter,
  Facebook,
  Link as LinkIcon,
  MessageCircle,
} from "lucide-react"
import {
  canShare,
  shareNative,
  copyToClipboard,
  getTwitterShareUrl,
  getFacebookShareUrl,
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

  const shareUrl = getOutfitShareUrl(outfitId)
  const shareText = generateOutfitShareText(occasion, score)

  const shareData: ShareData = {
    title: "Check out my outfit!",
    text: shareText,
    url: shareUrl,
  }

  const handleNativeShare = async () => {
    const success = await shareNative(shareData)
    if (success) {
      setIsOpen(false)
    }
  }

  const handleTwitterShare = () => {
    const url = getTwitterShareUrl(shareText, shareUrl)
    openShareWindow(url, 'Share on Twitter')
    setIsOpen(false)
  }

  const handleFacebookShare = () => {
    const url = getFacebookShareUrl(shareUrl)
    openShareWindow(url, 'Share on Facebook')
    setIsOpen(false)
  }

  const handleWhatsAppShare = () => {
    const url = getWhatsAppShareUrl(`${shareText} ${shareUrl}`)
    openShareWindow(url, 'Share on WhatsApp')
    setIsOpen(false)
  }

  const handleCopyLink = async () => {
    await copyToClipboard(shareUrl)
    setIsOpen(false)
  }

  // If native share is available, use it directly on mobile
  const showNativeButton = canShare()

  if (showNativeButton && size === "icon") {
    return (
      <Button
        variant={variant}
        size={size}
        onClick={handleNativeShare}
        className={className}
      >
        <Share2 className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {showNativeButton && (
          <>
            <DropdownMenuItem onClick={handleNativeShare}>
              <Share2 className="h-4 w-4 mr-2" />
              Share...
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </>
        )}

        <DropdownMenuItem onClick={handleTwitterShare}>
          <Twitter className="h-4 w-4 mr-2" />
          Twitter
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleFacebookShare}>
          <Facebook className="h-4 w-4 mr-2" />
          Facebook
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleWhatsAppShare}>
          <MessageCircle className="h-4 w-4 mr-2" />
          WhatsApp
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleCopyLink}>
          <LinkIcon className="h-4 w-4 mr-2" />
          Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
