const sqlite3 = require("sqlite3").verbose()
const path = require("path")
const fs = require("fs")

const dbPath = path.join(__dirname, "../../database/hmif_events.db")

// Buat folder database jika belum ada
const dbDir = path.dirname(dbPath)
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true })
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error saat membuka database:", err)
  } else {
    console.log("Database terhubung di:", dbPath)
  }
})

// Enable foreign keys
db.run("PRAGMA foreign_keys = ON")

const initDatabase = () => {
  // Create Users Table
  db.run(
    `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('user', 'admin')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `,
    (err) => {
      if (err) console.error("Error creating users table:", err)
      else console.log("Users table ready")
    },
  )

  // Create Events Table
  db.run(
    `
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      date TEXT NOT NULL,
      location TEXT NOT NULL,
      initial_quota INTEGER NOT NULL,
      current_quota INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `,
    (err) => {
      if (err) console.error("Error creating events table:", err)
      else console.log("Events table ready")
    },
  )

  // Create Registrations Table
  db.run(
    `
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      event_id INTEGER NOT NULL,
      registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (event_id) REFERENCES events(id),
      UNIQUE(user_id, event_id)
    )
  `,
    (err) => {
      if (err) console.error("Error creating registrations table:", err)
      else console.log("Registrations table ready")
    },
  )

  // Seed default admin dan user jika belum ada
  seedDefaultUsers()
}

const seedDefaultUsers = () => {
  const bcrypt = require("bcryptjs")

  db.all("SELECT * FROM users WHERE username IN (?, ?)", ["admin", "user"], (err, rows) => {
    if (err) return console.error("Error checking users:", err)

    if (!rows || rows.length === 0) {
      const hashedAdminPassword = bcrypt.hashSync("admin123", 10)
      const hashedUserPassword = bcrypt.hashSync("user123", 10)

      db.run(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        ["admin", hashedAdminPassword, "admin"],
        (err) => {
          if (err) console.error("Error seeding admin:", err)
          else console.log("Admin user created")
        },
      )

      db.run(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        ["user", hashedUserPassword, "user"],
        (err) => {
          if (err) console.error("Error seeding user:", err)
          else console.log("Default user created")
        },
      )
    }
  })
}

// Promisified database functions
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err)
      else resolve({ id: this.lastID, changes: this.changes })
    })
  })
}

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err)
      else resolve(row)
    })
  })
}

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err)
      else resolve(rows)
    })
  })
}

module.exports = {
  db,
  initDatabase,
  dbRun,
  dbGet,
  dbAll,
}
