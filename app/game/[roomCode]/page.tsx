"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import io, { type Socket } from "socket.io-client"
import DesignerView from "@/components/designer-view"
import CoderPMView from "@/components/coder-pm-view"
import DecisionView from "@/components/decision-view"
import SummaryView from "@/components/summary-view"
import GameHeader from "@/components/game-header"
import { Card, CardContent } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export interface Feature {
  id: number
  title: string
  description: string
  category: string
  complexity: "low" | "medium" | "high"
  impact: "low" | "medium" | "high"
}

export interface GameState {
  phase: "waiting" | "design" | "review" | "decision" | "summary"
  players: {
    designer?: string
    coder?: string
    pm?: string
  }
  wishlist: number[]
  coderFeedback: Record<number, { feasible: boolean; effort: string; notes: string }>
  pmDecisions: Record<number, { include: boolean; priority: string; notes: string }>
  finalScope: {
    kept: number[]
    cut: number[]
  }
  timeRemaining: number
}

export default function GamePage() {
  const params = useParams()
  const roomCode = params.roomCode as string
  const [socket, setSocket] = useState<Socket | null>(null)
  const [gameState, setGameState] = useState<GameState | null>(null)
  const [playerRole, setPlayerRole] = useState<string | null>(null)
  const [playerName, setPlayerName] = useState<string | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    // Get player info from localStorage
    const role = localStorage.getItem("playerRole")
    const name = localStorage.getItem("playerName")
    setPlayerRole(role)
    setPlayerName(name)

    // Initialize socket connection
    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
      query: { roomCode, role, name },
    })

    newSocket.on("connect", () => {
      setConnected(true)
      console.log("Connected to server")
    })

    newSocket.on("gameState", (state: GameState) => {
      setGameState(state)
    })

    newSocket.on("disconnect", () => {
      setConnected(false)
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [roomCode])

  if (!connected || !gameState || !playerRole) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card>
          <CardContent className="flex items-center space-x-4 p-6">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Connecting to workshop...</span>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderGameView = () => {
    switch (gameState.phase) {
      case "waiting":
        return (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center p-8">
              <h2 className="text-2xl font-bold mb-4">Waiting for Players</h2>
              <p className="text-gray-600 mb-4">
                Room Code: <strong>{roomCode}</strong>
              </p>
              <div className="space-y-2">
                <p>Designer: {gameState.players.designer || "Waiting..."}</p>
                <p>Coder: {gameState.players.coder || "Waiting..."}</p>
                <p>PM: {gameState.players.pm || "Waiting..."}</p>
              </div>
            </CardContent>
          </Card>
        )

      case "design":
        return playerRole === "designer" ? (
          <DesignerView socket={socket} gameState={gameState} />
        ) : (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center p-8">
              <h2 className="text-2xl font-bold mb-4">Designer is Choosing Features</h2>
              <p className="text-gray-600">
                Please wait while the designer selects features for the User Profile Screen.
              </p>
            </CardContent>
          </Card>
        )

      case "review":
        return playerRole === "coder" || playerRole === "pm" ? (
          <CoderPMView socket={socket} gameState={gameState} playerRole={playerRole} />
        ) : (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="text-center p-8">
              <h2 className="text-2xl font-bold mb-4">Review in Progress</h2>
              <p className="text-gray-600">Coder and PM are reviewing your feature selections.</p>
            </CardContent>
          </Card>
        )

      case "decision":
        return <DecisionView socket={socket} gameState={gameState} playerRole={playerRole} />

      case "summary":
        return <SummaryView socket={socket} gameState={gameState} playerRole={playerRole} />

      default:
        return <div>Unknown game phase</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <GameHeader gameState={gameState} playerRole={playerRole} playerName={playerName} />
      <div className="container mx-auto px-4 py-8">{renderGameView()}</div>
    </div>
  )
}
