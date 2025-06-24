import type { NextRequest } from "next/server"
import type { Server as NetServer } from "http"
import type { Server as SocketIOServer } from "socket.io"
import type { NextApiResponse } from "next"

export interface NextApiResponseServerIO extends NextApiResponse {
  socket: {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}

interface GameRoom {
  id: string
  players: {
    designer?: string
    coder?: string
    pm?: string
  }
  gameState: {
    phase: "waiting" | "design" | "review" | "decision" | "summary"
    wishlist: number[]
    coderFeedback: Record<number, { feasible: boolean; effort: string; notes: string }>
    pmDecisions: Record<number, { include: boolean; priority: string; notes: string }>
    finalScope: {
      kept: number[]
      cut: number[]
    }
    timeRemaining: number
  }
  timer?: NodeJS.Timeout
}

const rooms: Map<string, GameRoom> = new Map()

export async function GET(req: NextRequest) {
  return new Response("Socket.IO server is running", { status: 200 })
}

// This would typically be handled by a separate Socket.IO server
// For demo purposes, we'll create a mock implementation
export async function POST(req: NextRequest) {
  const body = await req.json()

  // Mock socket events handling
  switch (body.event) {
    case "joinRoom":
      return handleJoinRoom(body)
    case "submitWishlist":
      return handleSubmitWishlist(body)
    case "submitCoderFeedback":
      return handleSubmitCoderFeedback(body)
    case "submitPMDecisions":
      return handleSubmitPMDecisions(body)
    case "submitFinalVotes":
      return handleSubmitFinalVotes(body)
    default:
      return new Response("Unknown event", { status: 400 })
  }
}

function handleJoinRoom(data: any) {
  const { roomCode, role, name } = data

  if (!rooms.has(roomCode)) {
    rooms.set(roomCode, {
      id: roomCode,
      players: {},
      gameState: {
        phase: "waiting",
        wishlist: [],
        coderFeedback: {},
        pmDecisions: {},
        finalScope: { kept: [], cut: [] },
        timeRemaining: 18000, // 30 minutes
      },
    })
  }

  const room = rooms.get(roomCode)!
  room.players[role as keyof typeof room.players] = name

  // Check if all roles are filled
  if (room.players.designer && room.players.coder && room.players.pm) {
    room.gameState.phase = "design"
    startTimer(roomCode)
  }

  return new Response(JSON.stringify({ success: true, gameState: room.gameState }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}

function handleSubmitWishlist(data: any) {
  const { roomCode, wishlist } = data
  const room = rooms.get(roomCode)

  if (room) {
    room.gameState.wishlist = wishlist
    room.gameState.phase = "review"
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}

function handleSubmitCoderFeedback(data: any) {
  const { roomCode, feedback } = data
  const room = rooms.get(roomCode)

  if (room) {
    room.gameState.coderFeedback = feedback
    checkReviewComplete(room)
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}

function handleSubmitPMDecisions(data: any) {
  const { roomCode, decisions } = data
  const room = rooms.get(roomCode)

  if (room) {
    room.gameState.pmDecisions = decisions
    checkReviewComplete(room)
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}

function handleSubmitFinalVotes(data: any) {
  const { roomCode, votes } = data
  const room = rooms.get(roomCode)

  if (room) {
    // Process final votes and determine kept/cut features
    const kept: number[] = []
    const cut: number[] = []

    Object.entries(votes).forEach(([featureId, include]) => {
      const id = Number.parseInt(featureId)
      if (include) {
        kept.push(id)
      } else {
        cut.push(id)
      }
    })

    room.gameState.finalScope = { kept, cut }
    room.gameState.phase = "summary"
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}

function checkReviewComplete(room: GameRoom) {
  const hasCoderFeedback = Object.keys(room.gameState.coderFeedback).length > 0
  const hasPMDecisions = Object.keys(room.gameState.pmDecisions).length > 0

  if (hasCoderFeedback && hasPMDecisions) {
    room.gameState.phase = "decision"
  }
}

function startTimer(roomCode: string) {
  const room = rooms.get(roomCode)
  if (!room) return

  room.timer = setInterval(() => {
    room.gameState.timeRemaining -= 1

    if (room.gameState.timeRemaining <= 0) {
      clearInterval(room.timer)
      room.gameState.phase = "summary"
    }
  }, 1000)
}
