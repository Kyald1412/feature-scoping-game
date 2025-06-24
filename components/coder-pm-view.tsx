"use client"

import { useState } from "react"
import type { Socket } from "socket.io-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import type { GameState } from "@/app/game/[roomCode]/page"
import { CheckCircle, XCircle, MessageSquare, Plus, Eye } from "lucide-react"

interface CoderPMViewProps {
  socket: Socket | null
  gameState: GameState
  playerRole: string
}

const FEATURES = [
  { id: 1, title: "Custom Color Theme", description: "Let users personalize their profile with custom colors" },
  { id: 2, title: "Multiple Photo Upload", description: "Allow users to upload and showcase multiple profile photos" },
  { id: 3, title: "Light/Dark Mode Toggle", description: "Theme switcher for better user experience" },
  { id: 4, title: "Extended Bio Length", description: "Increase bio character limit from 150 to 500 characters" },
  { id: 5, title: "Custom Font Options", description: "Multiple typography choices for profile text" },
  { id: 6, title: "Profile Verification Badge", description: "Blue checkmark for verified accounts" },
  { id: 7, title: "Social Links Integration", description: "Connect Instagram, Twitter, LinkedIn profiles" },
  { id: 8, title: "Profile Analytics", description: "Show profile view count and engagement stats" },
  { id: 9, title: "Custom Profile URL", description: "Let users choose their own profile URL slug" },
  { id: 10, title: "Profile Background Image", description: "Add a banner/cover photo to profiles" },
  { id: 11, title: "Privacy Controls", description: "Granular privacy settings for profile visibility" },
  { id: 12, title: "Profile Badges", description: "Achievement and interest badges for profiles" },
  { id: 13, title: "Profile Video Introduction", description: "Short video clips for personal introductions" },
  { id: 14, title: "Profile QR Code", description: "Generate shareable QR codes for profiles" },
  { id: 15, title: "Profile Templates", description: "Pre-designed profile layouts for different purposes" },
  { id: 16, title: "Profile Scheduling", description: "Schedule profile updates and content rotation" },
  { id: 17, title: "Profile Translation", description: "Automatic translation for international audiences" },
]

export default function CoderPMView({ socket, gameState, playerRole }: CoderPMViewProps) {
  const [feedback, setFeedback] = useState<Record<number, any>>({})
  const [expandedNotes, setExpandedNotes] = useState<Record<number, boolean>>({})
  const [showMockup, setShowMockup] = useState<Record<number, boolean>>(() => {
    // Initialize all features to show mockups by default
    const initialMockups: Record<number, boolean> = {}
    for (let i = 1; i <= 17; i++) {
      initialMockups[i] = true
    }
    return initialMockups
  })

  const wishlistFeatures = FEATURES.filter((f) => gameState.wishlist.includes(f.id))

  const updateFeedback = (featureId: number, field: string, value: any) => {
    setFeedback((prev) => ({
      ...prev,
      [featureId]: {
        ...prev[featureId],
        [field]: value,
      },
    }))
  }

  const toggleNotes = (featureId: number) => {
    setExpandedNotes((prev) => ({
      ...prev,
      [featureId]: !prev[featureId],
    }))
  }

  const toggleMockup = (featureId: number) => {
    setShowMockup((prev) => ({
      ...prev,
      [featureId]: !prev[featureId],
    }))
  }

  const submitFeedback = () => {
    if (socket) {
      if (playerRole === "coder") {
        socket.emit("submitCoderFeedback", feedback)
      } else if (playerRole === "pm") {
        socket.emit("submitPMDecisions", feedback)
      }
    }
  }

  const allFeedbackComplete = wishlistFeatures.every((feature) => {
    const fb = feedback[feature.id]
    if (playerRole === "coder") {
      return fb && fb.feasible !== undefined && fb.effort
    } else {
      return fb && fb.include !== undefined && fb.priority
    }
  })

  // Check if other role has submitted (this would come from gameState in a real app)
  const hasCoderSubmitted = Object.keys(gameState.coderFeedback || {}).length > 0
  const hasPMSubmitted = Object.keys(gameState.pmDecisions || {}).length > 0

  const getSubmissionStatus = () => {
    if (playerRole === "coder") {
      return {
        myStatus: allFeedbackComplete ? "submitted" : "working",
        otherStatus: hasPMSubmitted ? "submitted" : "waiting",
        otherRole: "PM"
      }
    } else {
      return {
        myStatus: allFeedbackComplete ? "submitted" : "working", 
        otherStatus: hasCoderSubmitted ? "submitted" : "waiting",
        otherRole: "Coder"
      }
    }
  }

  const submissionStatus = getSubmissionStatus()

  // Visual mockup components (same as designer view)
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
      
      case 13: // Profile Video Introduction
        return (
          <div className="bg-black p-3 rounded-lg text-white text-xs">
            <div className="aspect-video bg-gray-800 rounded flex items-center justify-center mb-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white">▶️</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span>Video Introduction</span>
              <span className="text-gray-400">0:30</span>
            </div>
          </div>
        )
      
      case 14: // Profile QR Code
        return (
          <div className="bg-white border p-3 rounded-lg text-xs">
            <div className="text-center">
              <div className="w-16 h-16 bg-black mx-auto mb-2 flex items-center justify-center">
                <div className="w-12 h-12 bg-white grid grid-cols-3 gap-0.5">
                  <div className="bg-black"></div>
                  <div className="bg-white"></div>
                  <div className="bg-black"></div>
                  <div className="bg-white"></div>
                  <div className="bg-black"></div>
                  <div className="bg-white"></div>
                  <div className="bg-black"></div>
                  <div className="bg-white"></div>
                  <div className="bg-black"></div>
                </div>
              </div>
              <div className="text-gray-600">Scan to view profile</div>
            </div>
          </div>
        )
      
      case 15: // Profile Templates
        return (
          <div className="bg-white border p-3 rounded-lg text-xs">
            <div className="grid grid-cols-3 gap-2 mb-2">
              <div className="aspect-square bg-blue-100 rounded border-2 border-blue-300 flex items-center justify-center">
                <span className="text-blue-600 text-xs">A</span>
              </div>
              <div className="aspect-square bg-green-100 rounded border flex items-center justify-center">
                <span className="text-green-600 text-xs">B</span>
              </div>
              <div className="aspect-square bg-purple-100 rounded border flex items-center justify-center">
                <span className="text-purple-600 text-xs">C</span>
              </div>
            </div>
            <div className="text-gray-600">Choose template</div>
          </div>
        )
      
      case 16: // Profile Scheduling
        return (
          <div className="bg-white border p-3 rounded-lg text-xs">
            <div className="mb-2">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium">Schedule Post</span>
                <span className="text-blue-600">📅</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded">
                <div className="w-1/3 h-2 bg-blue-500 rounded"></div>
              </div>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Next: 2 hours</span>
              <span>3 scheduled</span>
            </div>
          </div>
        )
      
      case 17: // Profile Translation
        return (
          <div className="bg-white border p-3 rounded-lg text-xs">
            <div className="flex items-center space-x-2 mb-2">
              <span>🇺🇸</span>
              <span className="text-gray-400">→</span>
              <span>🇪🇸</span>
            </div>
            <div className="space-y-1">
              <div className="w-full h-1 bg-gray-200 rounded"></div>
              <div className="w-3/4 h-1 bg-gray-200 rounded"></div>
              <div className="w-1/2 h-1 bg-gray-200 rounded"></div>
            </div>
            <div className="mt-2 text-gray-500">Auto-translate enabled</div>
          </div>
        )
      
      default:
        return (
          <div className="bg-gray-100 p-3 rounded-lg text-xs text-gray-600">
            UI Preview
          </div>
        )
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">{playerRole === "coder" ? "💻" : "📊"}</span>
            <span>{playerRole === "coder" ? "Coder: Technical Assessment" : "PM: Business Decisions"}</span>
          </CardTitle>
          <CardDescription>
            {playerRole === "coder"
              ? "Evaluate the technical feasibility and development effort for each feature. Technical notes are optional but helpful."
              : "Make strategic decisions about which features to include based on business impact. Business rationale is optional but helpful."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-600">Designer selected {wishlistFeatures.length} features</p>
              
              {/* Submission Status Indicator */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    submissionStatus.myStatus === "submitted" ? "bg-green-500" : "bg-yellow-500"
                  }`}></div>
                  <span className="text-xs text-gray-600">
                    {playerRole === "coder" ? "Coder" : "PM"}: {submissionStatus.myStatus}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    submissionStatus.otherStatus === "submitted" ? "bg-green-500" : "bg-gray-400"
                  }`}></div>
                  <span className="text-xs text-gray-600">
                    {submissionStatus.otherRole}: {submissionStatus.otherStatus}
                  </span>
                </div>
              </div>
            </div>
            
            <Button
              onClick={submitFeedback}
              disabled={!allFeedbackComplete}
              className={playerRole === "coder" ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"}
            >
              Submit {playerRole === "coder" ? "Assessment" : "Decisions"}
            </Button>
          </div>
          
          {/* Waiting Message */}
          {submissionStatus.myStatus === "submitted" && submissionStatus.otherStatus === "waiting" && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-blue-700">
                  Waiting for {submissionStatus.otherRole} to complete their {playerRole === "coder" ? "business decisions" : "technical assessment"}...
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-4">
        {wishlistFeatures.map((feature) => (
          <Card key={feature.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleMockup(feature.id)}
                    className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-xs">{showMockup[feature.id] ? 'Hide' : 'Preview'}</span>
                  </Button>
                  <Badge variant="outline">Feature #{feature.id}</Badge>
                </div>
              </div>

              {/* UI Mockup Preview */}
              {showMockup[feature.id] && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
                  <div className="text-xs text-gray-500 mb-2 font-medium">UI Preview:</div>
                  {renderVisualMockup(feature.id)}
                </div>
              )}

              {playerRole === "coder" ? (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="block text-sm font-medium mb-2">Feasible?</Label>
                      <div className="flex space-x-2">
                        <Button
                          variant={feedback[feature.id]?.feasible === true ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateFeedback(feature.id, "feasible", true)}
                          className="flex items-center space-x-1"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Yes</span>
                        </Button>
                        <Button
                          variant={feedback[feature.id]?.feasible === false ? "destructive" : "outline"}
                          size="sm"
                          onClick={() => updateFeedback(feature.id, "feasible", false)}
                          className="flex items-center space-x-1"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>No</span>
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="block text-sm font-medium mb-2">Development Effort</Label>
                      <Select onValueChange={(value) => updateFeedback(feature.id, "effort", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select effort" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-2 days">1-2 days</SelectItem>
                          <SelectItem value="3-5 days">3-5 days</SelectItem>
                          <SelectItem value="1-2 weeks">1-2 weeks</SelectItem>
                          <SelectItem value="2+ weeks">2+ weeks</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4" />
                        <span>Technical Notes</span>
                        <Badge variant="secondary" className="text-xs">Optional</Badge>
                      </Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleNotes(feature.id)}
                        className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
                      >
                        <Plus className={`w-4 h-4 transition-transform ${expandedNotes[feature.id] ? 'rotate-45' : ''}`} />
                        <span>{expandedNotes[feature.id] ? 'Hide' : 'Add Notes'}</span>
                      </Button>
                    </div>
                    {expandedNotes[feature.id] && (
                      <Textarea
                        placeholder="Technical concerns, dependencies, implementation details..."
                        value={feedback[feature.id]?.notes || ""}
                        onChange={(e) => updateFeedback(feature.id, "notes", e.target.value)}
                        className="min-h-[100px] resize-none"
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="block text-sm font-medium mb-2">Decision</Label>
                      <div className="flex space-x-2">
                        <Button
                          variant={feedback[feature.id]?.include === true ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateFeedback(feature.id, "include", true)}
                          className="flex items-center space-x-1"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Include</span>
                        </Button>
                        <Button
                          variant={feedback[feature.id]?.include === false ? "destructive" : "outline"}
                          size="sm"
                          onClick={() => updateFeedback(feature.id, "include", false)}
                          className="flex items-center space-x-1"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>Cut</span>
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Label className="block text-sm font-medium mb-2">Priority</Label>
                      <Select onValueChange={(value) => updateFeedback(feature.id, "priority", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Must Have">Must Have</SelectItem>
                          <SelectItem value="Nice to Have">Nice to Have</SelectItem>
                          <SelectItem value="Post-Launch">Post-Launch</SelectItem>
                          <SelectItem value="Not Needed">Not Needed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="text-sm font-medium flex items-center space-x-2">
                        <MessageSquare className="w-4 h-4" />
                        <span>Business Rationale</span>
                        <Badge variant="secondary" className="text-xs">Optional</Badge>
                      </Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleNotes(feature.id)}
                        className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
                      >
                        <Plus className={`w-4 h-4 transition-transform ${expandedNotes[feature.id] ? 'rotate-45' : ''}`} />
                        <span>{expandedNotes[feature.id] ? 'Hide' : 'Add Rationale'}</span>
                      </Button>
                    </div>
                    {expandedNotes[feature.id] && (
                      <Textarea
                        placeholder="Why include/exclude this feature? Business impact, user value, strategic alignment..."
                        value={feedback[feature.id]?.notes || ""}
                        onChange={(e) => updateFeedback(feature.id, "notes", e.target.value)}
                        className="min-h-[100px] resize-none"
                      />
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
