const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { dbGet, dbRun } = require("../config/database")
const router = express.Router()

// Login
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: "Username dan password harus diisi" })
    }

    const user = await dbGet("SELECT * FROM users WHERE username = ?", [username])

    if (!user) {
      return res.status(401).json({ error: "Username atau password salah" })
    }

    const isValidPassword = bcrypt.compareSync(password, user.password)

    if (!isValidPassword) {
      return res.status(401).json({ error: "Username atau password salah" })
    }

    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    })

    res.json({
      success: true,
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    })
  } catch (err) {
    next(err)
  }
})

// Register (hanya untuk demo, bisa di-disable)
router.post("/register", async (req, res, next) => {
  try {
    const { username, password, role } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: "Username dan password harus diisi" })
    }

    const hashedPassword = bcrypt.hashSync(password, 10)
    const userRole = role === "admin" ? "admin" : "user"

    await dbRun("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", [username, hashedPassword, userRole])

    res.status(201).json({
      success: true,
      message: "Registrasi berhasil",
    })
  } catch (err) {
    if (err.message.includes("UNIQUE")) {
      return res.status(400).json({ error: "Username sudah terdaftar" })
    }
    next(err)
  }
})

module.exports = router
