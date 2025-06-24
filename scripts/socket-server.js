const { createServer } = require("http")
const { Server } = require("socket.io")
const express = require("express")

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
})

const rooms = new Map()

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)

  // Get query parameters from the connection
  const { roomCode, role, name } = socket.handshake.query
  console.log("Connection params:", { roomCode, role, name })

  // Automatically join room if parameters are provided
  if (roomCode && role && name) {
    socket.join(roomCode)

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
          timeRemaining: 1800,
        },
      })
    }

    const room = rooms.get(roomCode)
    room.players[role] = name

    // Check if all roles are filled
    if (room.players.designer && room.players.coder && room.players.pm) {
      room.gameState.phase = "design"
      startTimer(roomCode)
    }

    io.to(roomCode).emit("gameState", {
      ...room.gameState,
      players: room.players,
    })
  }

  socket.on("joinRoom", ({ roomCode, role, name }) => {
    socket.join(roomCode)

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
          timeRemaining: 1800,
        },
      })
    }

    const room = rooms.get(roomCode)
    room.players[role] = name

    // Check if all roles are filled
    if (room.players.designer && room.players.coder && room.players.pm) {
      room.gameState.phase = "design"
      startTimer(roomCode)
    }

    io.to(roomCode).emit("gameState", {
      ...room.gameState,
      players: room.players,
    })
  })

  socket.on("submitWishlist", (wishlist) => {
    const roomCode = Array.from(socket.rooms)[1]
    const room = rooms.get(roomCode)

    if (room) {
      room.gameState.wishlist = wishlist
      room.gameState.phase = "review"

      io.to(roomCode).emit("gameState", {
        ...room.gameState,
        players: room.players,
      })
    }
  })

  socket.on("submitCoderFeedback", (feedback) => {
    const roomCode = Array.from(socket.rooms)[1]
    const room = rooms.get(roomCode)

    if (room) {
      room.gameState.coderFeedback = feedback
      checkReviewComplete(room, roomCode)
    }
  })

  socket.on("submitPMDecisions", (decisions) => {
    const roomCode = Array.from(socket.rooms)[1]
    const room = rooms.get(roomCode)

    if (room) {
      room.gameState.pmDecisions = decisions
      checkReviewComplete(room, roomCode)
    }
  })

  socket.on("submitFinalVotes", (votes) => {
    const roomCode = Array.from(socket.rooms)[1]
    const room = rooms.get(roomCode)

    if (room) {
      const kept = []
      const cut = []

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

      io.to(roomCode).emit("gameState", {
        ...room.gameState,
        players: room.players,
      })
    }
  })

  socket.on("submitReflection", ({ role, reflection }) => {
    console.log(`${role} reflection:`, reflection)
  })

  socket.on("restartWorkshop", () => {
    const roomCode = Array.from(socket.rooms)[1]
    const room = rooms.get(roomCode)

    if (room) {
      room.gameState = {
        phase: "waiting",
        wishlist: [],
        coderFeedback: {},
        pmDecisions: {},
        finalScope: { kept: [], cut: [] },
        timeRemaining: 1800,
      }
      room.players = {}

      if (room.timer) {
        clearInterval(room.timer)
      }

      io.to(roomCode).emit("gameState", {
        ...room.gameState,
        players: room.players,
      })
    }
  })

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

function checkReviewComplete(room, roomCode) {
  const hasCoderFeedback = Object.keys(room.gameState.coderFeedback).length > 0
  const hasPMDecisions = Object.keys(room.gameState.pmDecisions).length > 0

  if (hasCoderFeedback && hasPMDecisions) {
    room.gameState.phase = "decision"

    io.to(roomCode).emit("gameState", {
      ...room.gameState,
      players: room.players,
    })
  }
}

function startTimer(roomCode) {
  const room = rooms.get(roomCode)
  if (!room) return

  room.timer = setInterval(() => {
    room.gameState.timeRemaining -= 1

    if (room.gameState.timeRemaining <= 0) {
      clearInterval(room.timer)
      room.gameState.phase = "summary"
    }

    io.to(roomCode).emit("gameState", {
      ...room.gameState,
      players: room.players,
    })
  }, 1000)
}

const PORT = process.env.SOCKET_PORT || 3001
server.listen(PORT, () => {
  console.log(`Socket.IO server running on port ${PORT}`)
})
