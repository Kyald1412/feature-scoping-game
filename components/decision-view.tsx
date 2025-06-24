"use client"

import { useState } from "react"
import type { Socket } from "socket.io-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { GameState } from "@/app/game/[roomCode]/page"
import { CheckCircle, XCircle, Clock, Users, MessageSquare, Smartphone, Palette, Image, Type, Shield, Link, BarChart3, Globe, Lock, Award } from "lucide-react"

interface DecisionViewProps {
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

export default function DecisionView({ socket, gameState, playerRole }: DecisionViewProps) {
  const [votes, setVotes] = useState<Record<number, boolean>>({})
  const [hasVoted, setHasVoted] = useState(false)

  const wishlistFeatures = FEATURES.filter((f) => gameState.wishlist.includes(f.id))

  const getFeatureStatus = (featureId: number) => {
    const coderFeedback = gameState.coderFeedback[featureId]
    const pmDecision = gameState.pmDecisions[featureId]

    if (!coderFeedback?.feasible) return "blocked"
    if (pmDecision?.include === false) return "cut"
    if (pmDecision?.include === true) return "included"
    return "pending"
  }

  const renderVisualMockup = (featureId: number) => {
    switch (featureId) {
      case 1: // Custom Color Theme
        return (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg text-white text-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Theme Selector</span>
              <div className="flex space-x-1">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              </div>
            </div>
            <div className="bg-white/20 p-2 rounded">
              <div className="w-full h-2 bg-white/30 rounded mb-1"></div>
              <div className="w-3/4 h-2 bg-white/30 rounded"></div>
            </div>
          </div>
        )
      
      case 2: // Multiple Photo Upload
        return (
          <div className="bg-gray-100 p-3 rounded-lg text-xs">
            <div className="grid grid-cols-3 gap-1 mb-2">
              <div className="aspect-square bg-blue-200 rounded flex items-center justify-center">
                <span className="text-blue-600">📷</span>
              </div>
              <div className="aspect-square bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500">+</span>
              </div>
              <div className="aspect-square bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500">+</span>
              </div>
            </div>
            <div className="text-gray-600">Drag & drop photos here</div>
          </div>
        )
      
      case 3: // Light/Dark Mode Toggle
        return (
          <div className="bg-gray-800 p-3 rounded-lg text-white text-xs">
            <div className="flex items-center justify-between">
              <span>🌙 Dark Mode</span>
              <div className="bg-blue-500 rounded-full p-1">
                <div className="w-3 h-3 bg-white rounded-full ml-auto"></div>
              </div>
            </div>
            <div className="mt-2 space-y-1">
              <div className="w-full h-1 bg-gray-600 rounded"></div>
              <div className="w-3/4 h-1 bg-gray-600 rounded"></div>
            </div>
          </div>
        )
      
      case 4: // Extended Bio Length
        return (
          <div className="bg-white border p-3 rounded-lg text-xs">
            <div className="mb-2">
              <div className="w-full h-16 border rounded p-2 bg-gray-50">
                <span className="text-gray-500">Tell us about yourself...</span>
              </div>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>0/500 characters</span>
              <span>✓</span>
            </div>
          </div>
        )
      
      case 5: // Custom Font Options
        return (
          <div className="bg-white border p-3 rounded-lg text-xs">
            <div className="mb-2">
              <div className="border rounded p-2">
                <span className="font-serif">Serif Font</span>
                <span className="text-gray-400 ml-2">↓</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="font-sans">Sans Serif</div>
              <div className="font-serif">Serif</div>
              <div className="font-mono">Monospace</div>
            </div>
          </div>
        )
      
      case 6: // Profile Verification Badge
        return (
          <div className="bg-white border p-3 rounded-lg text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">👤</span>
              </div>
              <div>
                <div className="flex items-center space-x-1">
                  <span className="font-medium">John Doe</span>
                  <span className="text-blue-500">✓</span>
                </div>
                <span className="text-gray-500">Verified Account</span>
              </div>
            </div>
          </div>
        )
      
      case 7: // Social Links Integration
        return (
          <div className="bg-white border p-3 rounded-lg text-xs">
            <div className="flex space-x-2">
              <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                <span className="text-white text-xs">f</span>
              </div>
              <div className="w-6 h-6 bg-blue-400 rounded flex items-center justify-center">
                <span className="text-white text-xs">in</span>
              </div>
              <div className="w-6 h-6 bg-pink-500 rounded flex items-center justify-center">
                <span className="text-white text-xs">📷</span>
              </div>
              <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center">
                <span className="text-gray-500 text-xs">+</span>
              </div>
            </div>
            <div className="mt-2 text-gray-500">Connect your social profiles</div>
          </div>
        )
      
      case 8: // Profile Analytics
        return (
          <div className="bg-white border p-3 rounded-lg text-xs">
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">1.2k</div>
                <div className="text-gray-500">Views</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">89</div>
                <div className="text-gray-500">Likes</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-purple-600">23</div>
                <div className="text-gray-500">Shares</div>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded">
              <div className="w-3/4 h-2 bg-blue-500 rounded"></div>
            </div>
          </div>
        )
      
      case 9: // Custom Profile URL
        return (
          <div className="bg-white border p-3 rounded-lg text-xs">
            <div className="mb-2">
              <div className="border rounded p-2 bg-gray-50">
                <span className="text-gray-500">profile.com/</span>
                <span className="font-medium">johndoe</span>
              </div>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>✓ Available</span>
              <span>Check</span>
            </div>
          </div>
        )
      
      case 10: // Profile Background Image
        return (
          <div className="bg-gradient-to-r from-blue-400 to-purple-500 p-3 rounded-lg text-white text-xs">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span>👤</span>
              </div>
              <div className="font-medium">John Doe</div>
              <div className="text-white/80">Software Developer</div>
            </div>
          </div>
        )
      
      case 11: // Privacy Controls
        return (
          <div className="bg-white border p-3 rounded-lg text-xs">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span>Profile Visibility</span>
                <div className="w-8 h-4 bg-gray-300 rounded-full">
                  <div className="w-4 h-4 bg-white rounded-full ml-0"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Show Email</span>
                <div className="w-8 h-4 bg-blue-500 rounded-full">
                  <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span>Allow Messages</span>
                <div className="w-8 h-4 bg-gray-300 rounded-full">
                  <div className="w-4 h-4 bg-white rounded-full ml-0"></div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case 12: // Profile Badges
        return (
          <div className="bg-white border p-3 rounded-lg text-xs">
            <div className="grid grid-cols-4 gap-1 mb-2">
              <div className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                <span className="text-xs">🏆</span>
              </div>
              <div className="w-6 h-6 bg-blue-400 rounded-full flex items-center justify-center">
                <span className="text-xs">⭐</span>
              </div>
              <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                <span className="text-xs">🎯</span>
              </div>
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xs">+</span>
              </div>
            </div>
            <div className="text-gray-500">Achievement badges</div>
          </div>
        )
      
      default:
        return (
          <div className="bg-gray-100 p-3 rounded-lg text-xs text-gray-600">
            Feature preview
          </div>
        )
    }
  }

  const submitVotes = () => {
    if (socket) {
      socket.emit("submitFinalVotes", votes)
      setHasVoted(true)
    }
  }

  const toggleVote = (featureId: number, include: boolean) => {
    setVotes((prev) => ({
      ...prev,
      [featureId]: include,
    }))
  }

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-6 h-6" />
            <span>Team Decision: Final Feature Scope</span>
          </CardTitle>
          <CardDescription>
            Review all feedback and vote on the final feature set for the User Profile Screen demo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">Make your final decisions as a team</p>
            {!hasVoted && (
              <Button onClick={submitVotes} className="bg-purple-600 hover:bg-purple-700">
                Submit Final Votes
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {wishlistFeatures.map((feature) => {
          const coderFeedback = gameState.coderFeedback[feature.id]
          const pmDecision = gameState.pmDecisions[feature.id]
          const status = getFeatureStatus(feature.id)

          return (
            <Card key={feature.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="font-semibold text-lg">{feature.title}</h3>
                      <Badge
                        className={
                          status === "included"
                            ? "bg-green-100 text-green-800"
                            : status === "cut"
                              ? "bg-red-100 text-red-800"
                              : status === "blocked"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-yellow-100 text-yellow-800"
                        }
                      >
                        {status === "included"
                          ? "Recommended"
                          : status === "cut"
                            ? "Not Recommended"
                            : status === "blocked"
                              ? "Not Feasible"
                              : "Under Review"}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-4">
                  {/* Feature Preview */}
                  <div className="md:col-span-1">
                    <h4 className="font-medium text-gray-800 mb-3 flex items-center space-x-2">
                      <span>🎨</span>
                      <span>UI Preview</span>
                    </h4>
                    {renderVisualMockup(feature.id)}
                  </div>

                  {/* Coder Feedback */}
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-medium text-red-800 mb-2 flex items-center space-x-2">
                      <span>💻</span>
                      <span>Technical Assessment</span>
                    </h4>
                    {coderFeedback ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          {coderFeedback.feasible ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span className="text-sm">{coderFeedback.feasible ? "Feasible" : "Not Feasible"}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-600" />
                          <span className="text-sm">{coderFeedback.effort}</span>
                        </div>
                        <div className="text-sm text-gray-700">
                          <MessageSquare className="w-4 h-4 inline mr-1" />
                          {coderFeedback.notes}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">Waiting for assessment...</p>
                    )}
                  </div>

                  {/* PM Decision */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2 flex items-center space-x-2">
                      <span>📊</span>
                      <span>Business Decision</span>
                    </h4>
                    {pmDecision ? (
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          {pmDecision.include ? (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-600" />
                          )}
                          <span className="text-sm">{pmDecision.include ? "Include" : "Exclude"}</span>
                        </div>
                        <div className="text-sm">
                          <Badge variant="outline">{pmDecision.priority}</Badge>
                        </div>
                        <div className="text-sm text-gray-700">
                          <MessageSquare className="w-4 h-4 inline mr-1" />
                          {pmDecision.notes}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">Waiting for decision...</p>
                    )}
                  </div>
                </div>

                {/* Final Vote */}
                {!hasVoted && (
                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Your Final Vote:</h4>
                    <div className="flex space-x-3">
                      <Button
                        variant={votes[feature.id] === true ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleVote(feature.id, true)}
                        disabled={status === "blocked"}
                        className="flex items-center space-x-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Include in Demo</span>
                      </Button>
                      <Button
                        variant={votes[feature.id] === false ? "destructive" : "outline"}
                        size="sm"
                        onClick={() => toggleVote(feature.id, false)}
                        className="flex items-center space-x-2"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Cut from Demo</span>
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
