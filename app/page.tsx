"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, Target, AlertTriangle, Lightbulb, Code, Palette, BarChart3, ArrowRight, ChevronDown, ChevronUp } from "lucide-react"

export default function HomePage() {
  const [roomCode, setRoomCode] = useState("")
  const [selectedRole, setSelectedRole] = useState<"designer" | "coder" | "pm" | null>(null)
  const [playerName, setPlayerName] = useState("")
  const [showJoinForm, setShowJoinForm] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())
  const router = useRouter()

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const createRoom = () => {
    const newRoomCode = generateRoomCode()
    setRoomCode(newRoomCode)
  }

  const joinRoom = () => {
    if (roomCode && selectedRole && playerName) {
      localStorage.setItem("playerName", playerName)
      localStorage.setItem("playerRole", selectedRole)
      localStorage.setItem("roomCode", roomCode)
      router.push(`/game/${roomCode}`)
    }
  }

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(section)) {
      newExpanded.delete(section)
    } else {
      newExpanded.add(section)
    }
    setExpandedSections(newExpanded)
  }

  const roles = [
    {
      id: "designer" as const,
      title: "Designer",
      description: "Choose features for the User Profile Screen",
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: "🎨",
    },
    {
      id: "coder" as const,
      title: "Coder",
      description: "Assess technical feasibility and effort",
      color: "bg-red-100 text-red-800 border-red-200",
      icon: "💻",
    },
    {
      id: "pm" as const,
      title: "Product Manager",
      description: "Make final decisions on feature scope",
      color: "bg-green-100 text-green-800 border-green-200",
      icon: "📊",
    },
  ]

  const featureOptions = [
    { id: "custom-theme", name: "🎨 Custom Color Theme", description: "Let users pick profile background color" },
    { id: "multiple-photos", name: "🖼️ Upload Multiple Photos", description: "Like a mini album or cover photo carousel" },
    { id: "dark-mode", name: "🌗 Light / Dark Mode Toggle", description: "Let users personalize their mood" },
    { id: "location", name: "📍 Add Location", description: "Show city/country under the name" },
    { id: "social-links", name: "🔗 Social Links", description: "Instagram, TikTok, LinkedIn links" },
    { id: "font-style", name: "🔣 Font Style Selector", description: "Let users choose from 3 fonts" },
    { id: "badges", name: "🎖️ User Badges", description: "Show user level, verified, or interests" },
    { id: "status", name: "💬 Status Message", description: "Short \"what's on your mind\" message" },
    { id: "recent-posts", name: "🎞️ Recent Posts Preview", description: "Show 3 recent posts at bottom of profile" },
    { id: "layout-variants", name: "🧩 Layout Variants", description: "Choose between grid, card, or full-width layouts" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Feature Freeze</h1>
          <p className="text-2xl text-gray-700 mb-2">Aligning Vision, Code, and Constraints</p>
          <p className="text-lg text-gray-600">
            A collaborative workshop simulation for cross-functional product teams
          </p>
        </div>

        {/* Workshop Overview Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <h3 className="font-semibold">3 Roles</h3>
              <p className="text-sm text-gray-600">Designer, Coder, PM</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Clock className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <h3 className="font-semibold">30 Minutes</h3>
              <p className="text-sm text-gray-600">Workshop Duration</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Target className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <h3 className="font-semibold">Real-time</h3>
              <p className="text-sm text-gray-600">Live Collaboration</p>
            </CardContent>
          </Card>
        </div>

        {/* Join Workshop Section */}
        <Card className="max-w-2xl mx-auto mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              Ready to Start?
            </CardTitle>
            <CardDescription>
              Join the workshop and experience collaborative feature scoping
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!showJoinForm ? (
              <Button 
                onClick={() => setShowJoinForm(true)} 
                className="w-full" 
                size="lg"
              >
                Join Workshop <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Your Name</label>
                  <Input placeholder="Enter your name" value={playerName} onChange={(e) => setPlayerName(e.target.value)} />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Choose Your Role</label>
                  <div className="grid gap-3">
                    {roles.map((role) => (
                      <div
                        key={role.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedRole === role.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedRole(role.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{role.icon}</span>
                            <div>
                              <h3 className="font-semibold">{role.title}</h3>
                              <p className="text-sm text-gray-600">{role.description}</p>
                            </div>
                          </div>
                          <Badge className={role.color}>{role.title}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Room Code</label>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Enter room code"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    />
                    <Button variant="outline" onClick={createRoom}>
                      Create Room
                    </Button>
                  </div>
                </div>

                <Button onClick={joinRoom} className="w-full" disabled={!roomCode || !selectedRole || !playerName}>
                  Start Workshop
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Workshop explanation sections - hidden when showJoinForm is true */}
        {!showJoinForm && (
          <>
            {/* Workshop Storyline */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🪧</span>
                  Workshop Storyline
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Context / Backstory</h3>
                  <p className="text-blue-800">
                    You're part of a cross-functional product team building <strong>Chroma</strong> — a social media app 
                    (think Instagram + Threads) where users express themselves through personalized profiles and creative content.
                  </p>
                  <p className="text-blue-800 mt-2">
                    Your team has been working hard to get the MVP ready. Now, with only <strong>5 days left</strong> before 
                    a major demo presentation to visiting Apple guests, your team decides to ship a User Profile screen — 
                    a key feature that highlights personalization and identity.
                  </p>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    The Real Problem: Misalignment
                  </h3>
                  <p className="text-red-800">
                    In many real-world teams, especially early-stage or fast-paced ones:
                  </p>
                  <ul className="text-red-800 mt-2 space-y-1">
                    <li>• Coders often feel left out of product decisions and are treated like task machines</li>
                    <li>• They're told "just build this" — without discussing whether it's realistic or meaningful</li>
                    <li>• As a result, designs get too ambitious, timelines slip, and frustration builds silently</li>
                    <li>• Meanwhile, designers don't get the feedback they need early enough to avoid rework</li>
                  </ul>
                  <p className="text-red-800 mt-2 font-semibold">
                    The problem isn't the team's talent — it's the lack of structured communication.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Why This Workshop Exists */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🎯</span>
                  Why This Workshop Exists
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  This simulation is designed to bring all voices to the table, especially the tech side. 
                  We want to show that:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <Code className="w-5 h-5 text-blue-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Developers belong in design conversations</h4>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Palette className="w-5 h-5 text-green-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Great design isn't just about visuals — it's about feasibility, prioritization, and value delivery</h4>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <BarChart3 className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">Product success depends on everyone co-owning decisions — not handing off work blindly</h4>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-orange-600 mt-1 flex-shrink-0" />
                    <div>
                      <h4 className="font-semibold">So today, you'll experience that first-hand</h4>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Main Feature Brief */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🧩</span>
                  Main Feature Brief: "Build the Chroma Profile"
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-700">
                  Your team must collaborate to design and build a User Profile Screen that allows users to:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <ul className="space-y-2 text-gray-700">
                      <li>• Upload their profile photo</li>
                      <li>• Display their name and a short bio</li>
                      <li>• Select their favorite content categories</li>
                      <li>• Customize how their profile looks</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <p className="text-orange-800 font-semibold mb-2">But you only have a few days left — so the big question is:</p>
                    <p className="text-orange-700 text-lg font-semibold">What stays? What gets simplified? What can wait?</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Designer Wishlist Options */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🎨</span>
                  Designer Wishlist Options (Pick 3–5)
                </CardTitle>
                <CardDescription>
                  These are the features the Designer can choose from during the workshop
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {featureOptions.map((feature) => (
                    <div key={feature.id} className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50">
                      <h4 className="font-semibold text-gray-900">{feature.name}</h4>
                      <p className="text-sm text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Team Flow Simulation */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">👥</span>
                  Team Flow Simulation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Badge className="bg-blue-100 text-blue-800">1</Badge>
                    <div>
                      <h4 className="font-semibold">The Designer picks 3–5 features</h4>
                      <p className="text-gray-600">Based on user value and creativity</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="bg-red-100 text-red-800">2</Badge>
                    <div>
                      <h4 className="font-semibold">The Coder reviews the wishlist</h4>
                      <p className="text-gray-600">Estimates feasibility or risk</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="bg-green-100 text-green-800">3</Badge>
                    <div>
                      <h4 className="font-semibold">The PM makes final scoping decisions</h4>
                      <p className="text-gray-600">Based on time, impact, and demo readiness</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="bg-purple-100 text-purple-800">4</Badge>
                    <div>
                      <h4 className="font-semibold">All roles negotiate trade-offs together</h4>
                      <p className="text-gray-600">As a real product team would</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* What You'll Learn */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🧠</span>
                  What You'll Learn
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold">How to speak up early about technical constraints — and be heard</h4>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold">How to ask the right questions as a team: "Do we really need this now?"</h4>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-semibold">How to co-own success by making better product decisions together</h4>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
