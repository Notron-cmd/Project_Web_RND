const jwt = require("jsonwebtoken")

const auth = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]

    if (!token) {
      return res.status(401).json({ error: "Token tidak ditemukan" })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    res.status(401).json({ error: "Token tidak valid", details: err.message })
  }
}

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    res.status(403).json({ error: "Akses hanya untuk admin" })
  }
}

module.exports = { auth, adminOnly }
