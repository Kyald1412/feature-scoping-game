import { Badge } from "@/components/ui/badge"
import { Clock, Users } from "lucide-react"
import type { GameState } from "@/app/game/[roomCode]/page"

interface GameHeaderProps {
  gameState: GameState
  playerRole: string | null
  playerName: string | null
}

export default function GameHeader({ gameState, playerRole, playerName }: GameHeaderProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "designer":
        return "bg-blue-100 text-blue-800"
      case "coder":
        return "bg-red-100 text-red-800"
      case "pm":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPhaseTitle = (phase: string) => {
    switch (phase) {
      case "waiting":
        return "Waiting for Players"
      case "design":
        return "Feature Selection"
      case "review":
        return "Technical Review"
      case "decision":
        return "Final Decisions"
      case "summary":
        return "Workshop Summary"
      default:
        return "Workshop"
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">Chroma Feature Workshop</h1>
            <Badge variant="outline" className="text-sm">
              {getPhaseTitle(gameState.phase)}
            </Badge>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span className="font-mono text-sm">{formatTime(gameState.timeRemaining)}</span>
            </div>

            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span className="text-sm">{Object.keys(gameState.players).length}/3</span>
            </div>

            {playerRole && (
              <Badge className={getRoleBadgeColor(playerRole)}>
                {playerRole === "pm" ? "PM" : playerRole} - {playerName}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
