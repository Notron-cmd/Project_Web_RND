const express = require("express")
const { dbGet, dbAll, dbRun } = require("../config/database")
const { auth, adminOnly } = require("../middleware/auth")
const router = express.Router()

// GET semua events (publik)
router.get("/", async (req, res, next) => {
  try {
    const events = await dbAll("SELECT * FROM events ORDER BY date ASC")
    res.json({ success: true, data: events })
  } catch (err) {
    next(err)
  }
})

// GET event by ID (publik)
router.get("/:id", async (req, res, next) => {
  try {
    const event = await dbGet("SELECT * FROM events WHERE id = ?", [req.params.id])

    if (!event) {
      return res.status(404).json({ error: "Event tidak ditemukan" })
    }

    res.json({ success: true, data: event })
  } catch (err) {
    next(err)
  }
})

// CREATE event (admin only)
router.post("/", auth, adminOnly, async (req, res, next) => {
  try {
    const { name, description, date, location, initial_quota } = req.body

    if (!name || !date || !location || !initial_quota) {
      return res.status(400).json({ error: "Semua field harus diisi" })
    }

    const result = await dbRun(
      "INSERT INTO events (name, description, date, location, initial_quota, current_quota) VALUES (?, ?, ?, ?, ?, ?)",
      [name, description, date, location, initial_quota, initial_quota],
    )

    res.status(201).json({
      success: true,
      message: "Event berhasil dibuat",
      data: { id: result.id, name, date, location, current_quota: initial_quota },
    })
  } catch (err) {
    next(err)
  }
})

// UPDATE event (admin only)
router.put("/:id", auth, adminOnly, async (req, res, next) => {
  try {
    const { name, description, date, location, initial_quota } = req.body
    const eventId = req.params.id

    const event = await dbGet("SELECT * FROM events WHERE id = ?", [eventId])
    if (!event) {
      return res.status(404).json({ error: "Event tidak ditemukan" })
    }

    // Hitung current_quota berdasarkan perubahan initial_quota
    let newCurrentQuota = event.current_quota
    if (initial_quota !== undefined && initial_quota !== event.initial_quota) {
      const diff = initial_quota - event.initial_quota
      newCurrentQuota = event.current_quota + diff
    }

    await dbRun(
      "UPDATE events SET name = ?, description = ?, date = ?, location = ?, initial_quota = ?, current_quota = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [
        name || event.name,
        description || event.description,
        date || event.date,
        location || event.location,
        initial_quota || event.initial_quota,
        newCurrentQuota,
        eventId,
      ],
    )

    res.json({
      success: true,
      message: "Event berhasil diupdate",
    })
  } catch (err) {
    next(err)
  }
})

// DELETE event (admin only)
router.delete("/:id", auth, adminOnly, async (req, res, next) => {
  try {
    const eventId = req.params.id

    const event = await dbGet("SELECT * FROM events WHERE id = ?", [eventId])
    if (!event) {
      return res.status(404).json({ error: "Event tidak ditemukan" })
    }

    // Hapus registrations terlebih dahulu
    await dbRun("DELETE FROM registrations WHERE event_id = ?", [eventId])
    await dbRun("DELETE FROM events WHERE id = ?", [eventId])

    res.json({
      success: true,
      message: "Event berhasil dihapus",
    })
  } catch (err) {
    next(err)
  }
})

// REGISTER user ke event
router.post("/:id/register", auth, async (req, res, next) => {
  try {
    const eventId = req.params.id
    const userId = req.user.id

    const event = await dbGet("SELECT * FROM events WHERE id = ?", [eventId])
    if (!event) {
      return res.status(404).json({ error: "Event tidak ditemukan" })
    }

    if (event.current_quota <= 0) {
      return res.status(400).json({ error: "Kuota event sudah habis" })
    }

    // Cek apakah user sudah terdaftar
    const existingReg = await dbGet("SELECT * FROM registrations WHERE user_id = ? AND event_id = ?", [userId, eventId])

    if (existingReg) {
      return res.status(400).json({ error: "Anda sudah terdaftar untuk event ini" })
    }

    // Tambah registrasi
    await dbRun("INSERT INTO registrations (user_id, event_id) VALUES (?, ?)", [userId, eventId])

    // Kurangi quota
    await dbRun("UPDATE events SET current_quota = current_quota - 1 WHERE id = ?", [eventId])

    res.json({
      success: true,
      message: "Pendaftaran berhasil",
    })
  } catch (err) {
    if (err.message.includes("UNIQUE")) {
      return res.status(400).json({ error: "Anda sudah terdaftar untuk event ini" })
    }
    next(err)
  }
})

// GET registrasi user (untuk dicek apakah user sudah daftar event tertentu)
router.get("/:id/check-registration", auth, async (req, res, next) => {
  try {
    const eventId = req.params.id
    const userId = req.user.id

    const registration = await dbGet("SELECT * FROM registrations WHERE user_id = ? AND event_id = ?", [
      userId,
      eventId,
    ])

    res.json({
      success: true,
      isRegistered: !!registration,
    })
  } catch (err) {
    next(err)
  }
})

module.exports = router
