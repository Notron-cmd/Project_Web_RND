"use client"

import { useState } from "react"
import LoginPage from "@/components/LoginPage"
import UserDashboard from "@/components/UserDashboard"
import AdminDashboard from "@/components/AdminDashboard"
import { clearAuthToken } from "@/lib/api-client"

type UserRole = "user" | "admin" | null

export default function Home() {
  const [userRole, setUserRole] = useState<UserRole>(null)
  const [username, setUsername] = useState("")

  const handleLogout = () => {
    clearAuthToken()
    setUserRole(null)
    setUsername("")
  }

  const handleLogin = (role: "user" | "admin", loginUsername: string) => {
    setUserRole(role)
    setUsername(loginUsername)
  }

  if (!userRole) {
    return <LoginPage onLogin={handleLogin} />
  }

  if (userRole === "admin") {
    return <AdminDashboard onLogout={handleLogout} username={username} />
  }

  return <UserDashboard onLogout={handleLogout} username={username} />
}
