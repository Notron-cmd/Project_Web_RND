const express = require("express")
const cors = require("cors")
const { initDatabase } = require("./src/config/database")
const errorHandler = require("./src/middleware/errorHandler")
const eventRoutes = require("./src/routes/event")
const authRoutes = require("./src/routes/auth")

const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(
  cors({
    origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
    credentials: true,
  }),
)

// Initialize Database
initDatabase()

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/events", eventRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Server is running" })
})

// Error Handler Middleware
app.use(errorHandler)

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint tidak ditemukan" })
})

module.exports = app
