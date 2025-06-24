"use client"

import { useState } from "react"
import type { Socket } from "socket.io-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { GameState, Feature } from "@/app/game/[roomCode]/page"
import { 
  Palette, 
  Zap, 
  Shield, 
  Image, 
  FileText, 
  Users, 
  BarChart3, 
  Link, 
  Eye, 
  Award,
  Lightbulb,
  BookOpen,
  Target,
  Star,
  Clock,
  TrendingUp
} from "lucide-react"

interface DesignerViewProps {
  socket: Socket | null
  gameState: GameState
}

const FEATURES: (Feature & {
  visualMockup: string
  learningPoints: string[]
  designPrinciples: string[]
  userBenefits: string[]
})[] = [
  {
    id: 1,
    title: "Custom Color Theme",
    description: "Let users personalize their profile with custom colors",
    category: "Visual",
    complexity: "medium",
    impact: "high",
    visualMockup: "🎨 Color picker with preset themes and custom RGB sliders",
    learningPoints: [
      "Color psychology in UI design",
      "Accessibility considerations (contrast ratios)",
      "Brand consistency vs personalization"
    ],
    designPrinciples: [
      "User autonomy and personalization",
      "Visual hierarchy through color",
      "Consistency across components"
    ],
    userBenefits: [
      "Expresses personal style",
      "Improves emotional connection",
      "Enhances user engagement"
    ]
  },
  {
    id: 2,
    title: "Multiple Photo Upload",
    description: "Allow users to upload and showcase multiple profile photos",
    category: "Media",
    complexity: "high",
    impact: "high",
    visualMockup: "📸 Grid layout with drag-and-drop upload, image carousel",
    learningPoints: [
      "File upload UX patterns",
      "Image optimization and compression",
      "Storage management strategies"
    ],
    designPrinciples: [
      "Visual storytelling",
      "Content organization",
      "Performance optimization"
    ],
    userBenefits: [
      "Showcases personality better",
      "Tells visual stories",
      "Increases profile engagement"
    ]
  },
  {
    id: 3,
    title: "Light/Dark Mode Toggle",
    description: "Theme switcher for better user experience",
    category: "Visual",
    complexity: "low",
    impact: "medium",
    visualMockup: "🌙 Toggle switch with sun/moon icons, instant preview",
    learningPoints: [
      "System preference detection",
      "CSS media queries",
      "Theme switching patterns"
    ],
    designPrinciples: [
      "User comfort and accessibility",
      "Consistent visual language",
      "System integration"
    ],
    userBenefits: [
      "Reduces eye strain",
      "Works in different lighting",
      "Follows system preferences"
    ]
  },
  {
    id: 4,
    title: "Extended Bio Length",
    description: "Increase bio character limit from 150 to 500 characters",
    category: "Content",
    complexity: "low",
    impact: "medium",
    visualMockup: "📝 Textarea with character counter, expandable preview",
    learningPoints: [
      "Content strategy and information architecture",
      "Character limits and user behavior",
      "Progressive disclosure"
    ],
    designPrinciples: [
      "Content hierarchy",
      "Progressive disclosure",
      "User control and freedom"
    ],
    userBenefits: [
      "More self-expression",
      "Better storytelling",
      "Improved connection with others"
    ]
  },
  {
    id: 5,
    title: "Custom Font Options",
    description: "Multiple typography choices for profile text",
    category: "Visual",
    complexity: "medium",
    impact: "low",
    visualMockup: "🔤 Font selector with live preview, categorized options",
    learningPoints: [
      "Typography principles",
      "Font loading strategies",
      "Web font performance"
    ],
    designPrinciples: [
      "Typography as personality",
      "Readability and legibility",
      "Visual consistency"
    ],
    userBenefits: [
      "Personal brand expression",
      "Improved readability preferences",
      "Unique visual identity"
    ]
  },
  {
    id: 6,
    title: "Profile Verification Badge",
    description: "Blue checkmark for verified accounts",
    category: "Trust",
    complexity: "high",
    impact: "high",
    visualMockup: "✅ Blue checkmark badge, verification status indicator",
    learningPoints: [
      "Trust and credibility in UX",
      "Identity verification systems",
      "Social proof psychology"
    ],
    designPrinciples: [
      "Trust and credibility",
      "Visual hierarchy",
      "Status communication"
    ],
    userBenefits: [
      "Builds trust and credibility",
      "Reduces impersonation",
      "Increases profile authority"
    ]
  },
  {
    id: 7,
    title: "Social Links Integration",
    description: "Connect Instagram, Twitter, LinkedIn profiles",
    category: "Social",
    complexity: "medium",
    impact: "medium",
    visualMockup: "🔗 Social media icons with hover effects, link validation",
    learningPoints: [
      "Social media integration patterns",
      "API authentication flows",
      "Cross-platform consistency"
    ],
    designPrinciples: [
      "Cross-platform connectivity",
      "Visual consistency",
      "User convenience"
    ],
    userBenefits: [
      "Centralized social presence",
      "Easy cross-platform discovery",
      "Professional networking"
    ]
  },
  {
    id: 8,
    title: "Profile Analytics",
    description: "Show profile view count and engagement stats",
    category: "Analytics",
    complexity: "high",
    impact: "medium",
    visualMockup: "📊 Charts and graphs, engagement metrics dashboard",
    learningPoints: [
      "Data visualization principles",
      "Privacy and data ethics",
      "Analytics implementation"
    ],
    designPrinciples: [
      "Data transparency",
      "Privacy by design",
      "Actionable insights"
    ],
    userBenefits: [
      "Understand profile performance",
      "Optimize content strategy",
      "Track engagement growth"
    ]
  },
  {
    id: 9,
    title: "Custom Profile URL",
    description: "Let users choose their own profile URL slug",
    category: "Identity",
    complexity: "medium",
    impact: "medium",
    visualMockup: "🔗 URL input with availability checker, preview",
    learningPoints: [
      "URL structure and SEO",
      "Username validation patterns",
      "Database uniqueness constraints"
    ],
    designPrinciples: [
      "Personal branding",
      "URL simplicity",
      "SEO optimization"
    ],
    userBenefits: [
      "Professional personal brand",
      "Easy sharing and discovery",
      "SEO benefits"
    ]
  },
  {
    id: 10,
    title: "Profile Background Image",
    description: "Add a banner/cover photo to profiles",
    category: "Visual",
    complexity: "medium",
    impact: "high",
    visualMockup: "🖼️ Cover photo with overlay text, responsive cropping",
    learningPoints: [
      "Hero image design principles",
      "Responsive image handling",
      "Overlay text readability"
    ],
    designPrinciples: [
      "Visual storytelling",
      "Brand personality",
      "Content hierarchy"
    ],
    userBenefits: [
      "Strong visual impact",
      "Personal brand expression",
      "Professional appearance"
    ]
  },
  {
    id: 11,
    title: "Privacy Controls",
    description: "Granular privacy settings for profile visibility",
    category: "Privacy",
    complexity: "high",
    impact: "high",
    visualMockup: "🔒 Privacy settings panel, visibility toggles",
    learningPoints: [
      "Privacy by design principles",
      "User control and consent",
      "Data protection regulations"
    ],
    designPrinciples: [
      "User control and freedom",
      "Privacy by default",
      "Transparency and clarity"
    ],
    userBenefits: [
      "Control over personal data",
      "Flexible sharing options",
      "Peace of mind"
    ]
  },
  {
    id: 12,
    title: "Profile Badges",
    description: "Achievement and interest badges for profiles",
    category: "Gamification",
    complexity: "medium",
    impact: "low",
    visualMockup: "🏆 Badge collection grid, achievement notifications",
    learningPoints: [
      "Gamification principles",
      "User motivation psychology",
      "Achievement system design"
    ],
    designPrinciples: [
      "Recognition and achievement",
      "Social proof",
      "Visual appeal"
    ],
    userBenefits: [
      "Recognition and achievement",
      "Social status indicators",
      "Increased engagement"
    ]
  },
  {
    id: 13,
    title: "Profile Video Introduction",
    description: "Short video clips for personal introductions",
    category: "Media",
    complexity: "high",
    impact: "high",
    visualMockup: "🎥 Video player with play button, thumbnail preview",
    learningPoints: [
      "Video content UX patterns",
      "Media compression and optimization",
      "Autoplay and accessibility considerations"
    ],
    designPrinciples: [
      "Personal storytelling",
      "Media engagement",
      "Performance optimization"
    ],
    userBenefits: [
      "More personal connection",
      "Better self-expression",
      "Higher engagement rates"
    ]
  },
  {
    id: 14,
    title: "Profile QR Code",
    description: "Generate shareable QR codes for profiles",
    category: "Identity",
    complexity: "low",
    impact: "medium",
    visualMockup: "📱 QR code with profile link, share button",
    learningPoints: [
      "QR code generation and scanning",
      "Mobile-first design principles",
      "Offline-to-online bridging"
    ],
    designPrinciples: [
      "Easy sharing and discovery",
      "Cross-platform connectivity",
      "Physical-digital integration"
    ],
    userBenefits: [
      "Easy profile sharing",
      "Business card replacement",
      "Offline networking"
    ]
  },
  {
    id: 15,
    title: "Profile Templates",
    description: "Pre-designed profile layouts for different purposes",
    category: "Visual",
    complexity: "medium",
    impact: "medium",
    visualMockup: "🎨 Template gallery with preview thumbnails",
    learningPoints: [
      "Template design systems",
      "User customization patterns",
      "Design consistency"
    ],
    designPrinciples: [
      "Design accessibility",
      "Consistent visual language",
      "User choice and flexibility"
    ],
    userBenefits: [
      "Professional appearance",
      "Time-saving setup",
      "Consistent branding"
    ]
  },
  {
    id: 16,
    title: "Profile Scheduling",
    description: "Schedule profile updates and content rotation",
    category: "Content",
    complexity: "high",
    impact: "medium",
    visualMockup: "📅 Calendar interface with scheduled posts",
    learningPoints: [
      "Content scheduling UX",
      "Time-based automation",
      "User control and transparency"
    ],
    designPrinciples: [
      "Automation with control",
      "Time management",
      "Content freshness"
    ],
    userBenefits: [
      "Consistent activity",
      "Time management",
      "Better engagement"
    ]
  },
  {
    id: 17,
    title: "Profile Translation",
    description: "Automatic translation for international audiences",
    category: "Content",
    complexity: "high",
    impact: "medium",
    visualMockup: "🌍 Language selector with flag icons",
    learningPoints: [
      "Internationalization (i18n)",
      "Translation UX patterns",
      "Cultural considerations"
    ],
    designPrinciples: [
      "Global accessibility",
      "Cultural sensitivity",
      "Language inclusivity"
    ],
    userBenefits: [
      "Global reach",
      "International networking",
      "Cultural connection"
    ]
  }
]

export default function DesignerView({ socket, gameState }: DesignerViewProps) {
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>([])
  const [selectedFeature, setSelectedFeature] = useState<number | null>(null)

  const toggleFeature = (featureId: number) => {
    setSelectedFeatures((prev) =>
      prev.includes(featureId) ? prev.filter((id) => id !== featureId) : [...prev, featureId],
    )
  }

  const submitWishlist = () => {
    if (socket && selectedFeatures.length > 0) {
      socket.emit("submitWishlist", selectedFeatures)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Visual":
        return <Palette className="w-4 h-4" />
      case "Trust":
        return <Shield className="w-4 h-4" />
      case "Media":
        return <Image className="w-4 h-4" />
      case "Content":
        return <FileText className="w-4 h-4" />
      case "Social":
        return <Users className="w-4 h-4" />
      case "Analytics":
        return <BarChart3 className="w-4 h-4" />
      case "Identity":
        return <Link className="w-4 h-4" />
      case "Privacy":
        return <Eye className="w-4 h-4" />
      case "Gamification":
        return <Award className="w-4 h-4" />
      default:
        return <Zap className="w-4 h-4" />
    }
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "low":
        return "bg-gray-100 text-gray-800"
      case "medium":
        return "bg-blue-100 text-blue-800"
      case "high":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const selectedFeatureData = selectedFeature ? FEATURES.find(f => f.id === selectedFeature) : null

  // Visual mockup components
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
            {FEATURES.find(f => f.id === featureId)?.visualMockup}
          </div>
        )
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Learning Header */}
      <Card className="mb-6 border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-blue-800">
            <BookOpen className="w-5 h-5" />
            <span>Design Learning Hub</span>
          </CardTitle>
          <CardDescription className="text-blue-700">
            As a designer, you're learning to balance user needs, business goals, and technical constraints. 
            Each feature represents different design principles and UX patterns.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700">Select 3-7 features that create the best user experience</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700">Consider visual hierarchy and user flow</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span className="text-blue-700">Balance impact vs complexity for realistic scope</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selection Summary */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="text-2xl">🎨</span>
            <span>Designer: Choose Your Feature Wishlist</span>
          </CardTitle>
          <CardDescription>
            Select 3-7 features you believe are most important for the User Profile Screen. 
            Consider user impact, visual appeal, and learning opportunities.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <p className="text-sm text-gray-600">Selected: {selectedFeatures.length} features</p>
              {selectedFeatures.length > 0 && (
                <div className="flex space-x-1">
                  {selectedFeatures.slice(0, 3).map(id => {
                    const feature = FEATURES.find(f => f.id === id)
                    return (
                      <Badge key={id} variant="secondary" className="text-xs">
                        {feature?.title}
                      </Badge>
                    )
                  })}
                  {selectedFeatures.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{selectedFeatures.length - 3} more
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <Button
              onClick={submitWishlist}
              disabled={selectedFeatures.length === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Submit Wishlist ({selectedFeatures.length})
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Feature Grid */}
        <div className="lg:col-span-2">
          <div className="grid md:grid-cols-2 gap-4">
            {FEATURES.map((feature) => (
              <Card
                key={feature.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedFeatures.includes(feature.id) ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
                }`}
                onClick={() => {
                  toggleFeature(feature.id)
                  setSelectedFeature(feature.id)
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {getCategoryIcon(feature.category)}
                      <Checkbox checked={selectedFeatures.includes(feature.id)} onChange={() => {}} />
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {feature.category}
                    </Badge>
                  </div>

                  <h3 className="font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{feature.description}</p>

                  <div className="flex justify-between items-center">
                    <Badge className={getComplexityColor(feature.complexity)}>{feature.complexity} complexity</Badge>
                    <Badge className={getImpactColor(feature.impact)}>{feature.impact} impact</Badge>
                  </div>

                  {/* Quick Learning Preview */}
                  <div className="mt-3 pt-3 border-t">
                    <div className="flex items-center space-x-1 text-xs text-gray-500 mb-1">
                      <Lightbulb className="w-3 h-3" />
                      <span>Key Learning:</span>
                    </div>
                    <p className="text-xs text-gray-600">{feature.learningPoints[0]}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Feature Details Panel */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20 z-10">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>Feature Details</span>
              </CardTitle>
              <CardDescription>
                Click on a feature to learn more about design principles and implementation
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedFeatureData ? (
                <div className="space-y-4">
                  <div className="text-center p-4 bg-gray-100 rounded-lg text-2xl">
                    {renderVisualMockup(selectedFeatureData.id)}
                  </div>

                  <Tabs defaultValue="learning" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="learning">Learning</TabsTrigger>
                      <TabsTrigger value="principles">Principles</TabsTrigger>
                      <TabsTrigger value="benefits">Benefits</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="learning" className="space-y-3">
                      <h4 className="font-semibold text-sm">Learning Points:</h4>
                      <ul className="space-y-2 text-sm">
                        {selectedFeatureData.learningPoints.map((point, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>

                    <TabsContent value="principles" className="space-y-3">
                      <h4 className="font-semibold text-sm">Design Principles:</h4>
                      <ul className="space-y-2 text-sm">
                        {selectedFeatureData.designPrinciples.map((principle, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                            <span>{principle}</span>
                          </li>
                        ))}
                      </ul>
                    </TabsContent>

                    <TabsContent value="benefits" className="space-y-3">
                      <h4 className="font-semibold text-sm">User Benefits:</h4>
                      <ul className="space-y-2 text-sm">
                        {selectedFeatureData.userBenefits.map((benefit, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="flex items-center space-x-2 mt-3">
                        <TrendingUp className="w-4 h-4 text-gray-500" />
                        <span className="text-xs text-gray-500">
                          Complexity: {selectedFeatureData.complexity} | Impact: {selectedFeatureData.impact}
                        </span>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Select a feature to see detailed learning materials</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
