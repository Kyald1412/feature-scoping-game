"use client"

import { useState } from "react"
import type { Socket } from "socket.io-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import type { GameState } from "@/app/game/[roomCode]/page"
import { CheckCircle, XCircle, Download, RotateCcw, MessageSquare, Eye, Smartphone, Palette, Image, Type, Shield, Link, BarChart3, Globe, Lock, Award } from "lucide-react"

interface SummaryViewProps {
  socket: Socket | null
  gameState: GameState
  playerRole: string
}

const FEATURES = [
  { id: 1, title: "Custom Color Theme", description: "Let users personalize their profile with custom colors", icon: Palette, category: "Visual" },
  { id: 2, title: "Multiple Photo Upload", description: "Allow users to upload and showcase multiple profile photos", icon: Image, category: "Media" },
  { id: 3, title: "Light/Dark Mode Toggle", description: "Theme switcher for better user experience", icon: Smartphone, category: "UX" },
  { id: 4, title: "Extended Bio Length", description: "Increase bio character limit from 150 to 500 characters", icon: Type, category: "Content" },
  { id: 5, title: "Custom Font Options", description: "Multiple typography choices for profile text", icon: Type, category: "Visual" },
  { id: 6, title: "Profile Verification Badge", description: "Blue checkmark for verified accounts", icon: Shield, category: "Trust" },
  { id: 7, title: "Social Links Integration", description: "Connect Instagram, Twitter, LinkedIn profiles", icon: Link, category: "Social" },
  { id: 8, title: "Profile Analytics", description: "Show profile view count and engagement stats", icon: BarChart3, category: "Data" },
  { id: 9, title: "Custom Profile URL", description: "Let users choose their own profile URL slug", icon: Globe, category: "SEO" },
  { id: 10, title: "Profile Background Image", description: "Add a banner/cover photo to profiles", icon: Image, category: "Visual" },
  { id: 11, title: "Privacy Controls", description: "Granular privacy settings for profile visibility", icon: Lock, category: "Privacy" },
  { id: 12, title: "Profile Badges", description: "Achievement and interest badges for profiles", icon: Award, category: "Gamification" },
]

export default function SummaryView({ socket, gameState, playerRole }: SummaryViewProps) {
  const [reflection, setReflection] = useState("")
  const [hasSubmittedReflection, setHasSubmittedReflection] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const keptFeatures = FEATURES.filter((f) => gameState.finalScope.kept.includes(f.id))
  const cutFeatures = FEATURES.filter((f) => gameState.finalScope.cut.includes(f.id))

  const submitReflection = () => {
    if (socket && reflection.trim()) {
      socket.emit("submitReflection", { role: playerRole, reflection })
      setHasSubmittedReflection(true)
    }
  }

  const exportResults = () => {
    const results = {
      workshop: "Chroma Feature Scoping",
      timestamp: new Date().toISOString(),
      participants: gameState.players,
      originalWishlist: gameState.wishlist.length,
      finalScope: {
        kept: keptFeatures.map((f) => ({ id: f.id, title: f.title })),
        cut: cutFeatures.map((f) => ({ id: f.id, title: f.title })),
      },
      feedback: {
        technical: gameState.coderFeedback,
        business: gameState.pmDecisions,
      },
    }

    const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `chroma-feature-scope-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const restartWorkshop = () => {
    if (socket) {
      socket.emit("restartWorkshop")
    }
  }

  const getReflectionPrompt = (role: string) => {
    switch (role) {
      case "designer":
        return "How did it feel to have some of your features cut? What would you do differently next time?"
      case "coder":
        return "Which features were most challenging to assess? How could technical feasibility be better communicated?"
      case "pm":
        return "What was hardest to balance between user needs and technical constraints? Any surprises?"
      default:
        return "What did you learn from this feature scoping exercise?"
    }
  }

  const renderProfilePreview = () => {
    const hasCustomTheme = keptFeatures.some(f => f.id === 1)
    const hasMultiplePhotos = keptFeatures.some(f => f.id === 2)
    const hasDarkMode = keptFeatures.some(f => f.id === 3)
    const hasExtendedBio = keptFeatures.some(f => f.id === 4)
    const hasCustomFont = keptFeatures.some(f => f.id === 5)
    const hasVerification = keptFeatures.some(f => f.id === 6)
    const hasSocialLinks = keptFeatures.some(f => f.id === 7)
    const hasAnalytics = keptFeatures.some(f => f.id === 8)
    const hasBackgroundImage = keptFeatures.some(f => f.id === 10)
    const hasBadges = keptFeatures.some(f => f.id === 12)

    return (
      <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm mx-auto">
        {/* Header/Banner */}
        <div className={`h-24 ${hasBackgroundImage ? 'bg-gradient-to-r from-purple-400 to-pink-400' : 'bg-gray-100'} relative`}>
          {hasBackgroundImage && (
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-80"></div>
          )}
        </div>

        {/* Profile Section */}
        <div className="px-4 pb-4">
          {/* Profile Photo */}
          <div className="flex items-end -mt-12 mb-4">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                JD
              </div>
              {hasMultiplePhotos && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                  +2
                </div>
              )}
            </div>
            <div className="ml-4 flex-1">
              <div className="flex items-center gap-2">
                <h2 className={`font-bold text-lg ${hasCustomFont ? 'font-serif' : 'font-sans'}`}>
                  Jane Designer
                </h2>
                {hasVerification && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <p className="text-gray-600 text-sm">@janedesigner</p>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-4">
            <p className={`text-gray-800 ${hasExtendedBio ? 'text-sm leading-relaxed' : 'text-sm'}`}>
              {hasExtendedBio 
                ? "Creative designer passionate about user experience and visual storytelling. I love exploring new design trends and creating meaningful digital experiences that connect with people on a deeper level."
                : "Creative designer passionate about UX and visual storytelling."
              }
            </p>
          </div>

          {/* Stats/Analytics */}
          {hasAnalytics && (
            <div className="flex gap-4 mb-4 text-sm text-gray-600">
              <div>
                <span className="font-semibold">1.2k</span> views
              </div>
              <div>
                <span className="font-semibold">847</span> followers
              </div>
              <div>
                <span className="font-semibold">234</span> following
              </div>
            </div>
          )}

          {/* Social Links */}
          {hasSocialLinks && (
            <div className="flex gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs">
                IG
              </div>
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                TW
              </div>
              <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center text-white text-xs">
                IN
              </div>
            </div>
          )}

          {/* Badges */}
          {hasBadges && (
            <div className="flex gap-2 mb-4">
              <Badge variant="outline" className="text-xs">🎨 Designer</Badge>
              <Badge variant="outline" className="text-xs">⭐ Top Creator</Badge>
              <Badge variant="outline" className="text-xs">🏆 Verified</Badge>
            </div>
          )}

          {/* Theme Indicator */}
          {hasCustomTheme && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Palette className="w-4 h-4" />
              <span>Custom theme: Purple gradient</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">🎉</span>
            <span>Workshop Complete: Feature Scope Finalized</span>
          </CardTitle>
          <CardDescription>
            Your team has successfully scoped the User Profile Screen features for the Chroma demo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-800">✅ {keptFeatures.length} Features Included</Badge>
              <Badge className="bg-red-100 text-red-800">❌ {cutFeatures.length} Features Cut</Badge>
            </div>
            <div className="flex space-x-2">
            
              <Button variant="outline" onClick={exportResults}>
                <Download className="w-4 h-4 mr-2" />
                Export Results
              </Button>
              <Button variant="outline" onClick={restartWorkshop}>
                <RotateCcw className="w-4 h-4 mr-2" />
                New Session
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

    
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Features Kept */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span>Features Included ✅</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {keptFeatures.map((feature) => {
                const coderFeedback = gameState.coderFeedback[feature.id]
                const pmDecision = gameState.pmDecisions[feature.id]

                return (
                  <div key={feature.id} className="p-3 bg-green-50 rounded-lg">
                    <h4 className="font-medium">{feature.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-red-600">💻 {coderFeedback?.effort || "N/A"}</span>
                      <Badge variant="outline" className="text-xs">
                        {pmDecision?.priority || "N/A"}
                      </Badge>
                    </div>
                    {pmDecision?.notes && <p className="text-xs text-gray-700 mt-1 italic">"{pmDecision.notes}"</p>}
                  </div>
                )
              })}
              {keptFeatures.length === 0 && <p className="text-gray-500 text-center py-4">No features were kept</p>}
            </div>
          </CardContent>
        </Card>

        {/* Features Cut */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-red-700">
              <XCircle className="w-5 h-5" />
              <span>Features Cut ❌</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cutFeatures.map((feature) => {
                const coderFeedback = gameState.coderFeedback[feature.id]
                const pmDecision = gameState.pmDecisions[feature.id]

                return (
                  <div key={feature.id} className="p-3 bg-red-50 rounded-lg">
                    <h4 className="font-medium">{feature.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{feature.description}</p>
                    <div className="text-xs text-gray-700">
                      <strong>Reason:</strong>{" "}
                      {!coderFeedback?.feasible ? "Not technically feasible" : pmDecision?.notes || "Business decision"}
                    </div>
                  </div>
                )
              })}
              {cutFeatures.length === 0 && <p className="text-gray-500 text-center py-4">No features were cut</p>}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role-based Reflection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5" />
            <span>Your Reflection ({playerRole})</span>
          </CardTitle>
          <CardDescription>{getReflectionPrompt(playerRole)}</CardDescription>
        </CardHeader>
        <CardContent>
          {!hasSubmittedReflection ? (
            <div className="space-y-4">
              <Textarea
                placeholder="Share your thoughts about the workshop..."
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                className="min-h-[120px]"
              />
              <Button onClick={submitReflection} disabled={!reflection.trim()}>
                Submit Reflection
              </Button>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Your reflection:</p>
              <p className="italic">"{reflection}"</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
