"use client"

import { useState } from "react"
import { Calendar, AlertCircle, Loader } from "lucide-react"
import { authApi } from "@/lib/api-client"
import Iridescence from './Iridescence';

interface LoginPageProps {
  onLogin: (role: "user" | "admin", username: string) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [selectedRole, setSelectedRole] = useState<"user" | "admin" | null>(null)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Username dan password harus diisi")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await authApi.login(username, password)
      onLogin(response.user.role as "user" | "admin", response.user.username)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login gagal")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* === BACKGROUND GALAXY === */}
      <div className="absolute inset-0 -z-10 bg-black">
        <Iridescence
          color={[0.2, 0.5, 0.8]}
          mouseReact={false}
          amplitude={0.1}
          speed={1.0}
        />
      </div>

      {/* === LOGIN CONTENT === */}
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 bg-opacity-10 rounded-full mb-6 border border-blue-500 border-opacity-30">
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
            <h1 className="text-6xl font-bold text-white mb-2">HMIF Event</h1>
            <p className="text-gray-300 text-lg">Rangkaian Event Program Studi Informatika</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-500 bg-opacity-10 border border-red-500 border-opacity-50 rounded-lg flex items-gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <div className="space-y-4 mb-8">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan Username"
                className="w-full px-4 py-3 bg-gray-900 bg-opacity-50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full px-4 py-3 bg-gray-900 bg-opacity-50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
          </div>

          {/* Button */}
          <button
            onClick={handleLogin}
            disabled={loading || !username || !password}
            className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
              loading || !username || !password
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/50"
            }`}
          >
            {loading && <Loader className="w-4 h-4 animate-spin" />}
            {loading ? "Loading..." : "Login"}
          </button>

        </div>
      </div>
    </div>
  )
}
