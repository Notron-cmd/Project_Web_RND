const errorHandler = (err, req, res, next) => {
  console.error("Error:", err)

  if (err.code === "SQLITE_CONSTRAINT") {
    return res.status(400).json({ error: "Data sudah ada atau constraint violation" })
  }

  res.status(err.status || 500).json({
    error: err.message || "Terjadi kesalahan server",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  })
}

module.exports = errorHandler
