"use client"

import { useState, useMemo, useEffect } from "react"
import { LogOut, Search, MapPin, Clock, Users, AlertCircle, Loader } from "lucide-react"
import { eventsApi, type Event } from "@/lib/api-client"
import Iridescence from './Iridescence';

interface UserDashboardProps {
  onLogout: () => void
  username: string
}

export default function UserDashboard({ onLogout, username }: UserDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [events, setEvents] = useState<Event[]>([])
  const [registeredEvents, setRegisteredEvents] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [registering, setRegistering] = useState<number | null>(null)

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true)
        const data = await eventsApi.getAll()
        setEvents(data)

        // Check which events user is registered to
        const registrations = await Promise.all(
          data.map(async (event) => {
            const isRegistered = await eventsApi.checkRegistration(event.id)
            return isRegistered ? event.id : null
          }),
        )
        setRegisteredEvents(registrations.filter((id) => id !== null) as number[])
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load events")
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  const filteredEvents = useMemo(() => {
    return events.filter((event) => event.name.toLowerCase().includes(searchTerm.toLowerCase()))
  }, [events, searchTerm])

  const handleRegister = async (eventId: number) => {
    try {
      setRegistering(eventId)
      await eventsApi.register(eventId)

      // Update local state
      setRegisteredEvents([...registeredEvents, eventId])
      setEvents(events.map((e) => (e.id === eventId ? { ...e, current_quota: e.current_quota - 1 } : e)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to register")
    } finally {
      setRegistering(null)
    }
  }

  const isRegistered = (eventId: number) => registeredEvents.includes(eventId)

  return (    
    <div className="relative min-h-screen bg-black overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Iridescence
            color={[1, 1, 1]}
            mouseReact={false}
            amplitude={0.1}
            speed={1.0}
          />
      </div>

      <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f]">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-[#0f0f0f] bg-opacity-80 backdrop-blur-md border-b border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500 bg-opacity-10 rounded-lg">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Daftar Event HMIF</h1>
                  <p className="text-sm text-gray-400">Halo, {username}!</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 bg-opacity-10 text-red-400 hover:bg-opacity-20 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-500 bg-opacity-10 border border-red-500 border-opacity-50 rounded-lg flex items-gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Search Bar */}
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari event..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-gray-900 bg-opacity-50 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="text-center py-12">
              <Loader className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-400">Memuat event...</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">Event tidak ditemukan</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <div
                  key={event.id}
                  className="group bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-xl p-6 hover:border-blue-500 hover:border-opacity-50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                >
                  {/* Event Title */}
                  <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">{event.name}</h3>

                  {/* Event Description */}
                  <p className="text-gray-400 text-sm mb-4 line-clamp-2">{event.description}</p>

                  {/* Event Details */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <Clock className="w-4 h-4 text-blue-500" />
                      {new Date(event.date).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      {event.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span className={event.current_quota > 0 ? "text-green-400" : "text-red-400"}>
                        Sisa Kuota: {event.current_quota}
                      </span>
                    </div>
                  </div>

                  {/* Register Button */}
                  <button
                    onClick={() => handleRegister(event.id)}
                    disabled={event.current_quota === 0 || isRegistered(event.id) || registering === event.id}
                    className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      isRegistered(event.id)
                        ? "bg-green-500 bg-opacity-20 text-green-400 cursor-default"
                        : event.current_quota > 0
                          ? "bg-blue-500 text-white hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/50"
                          : "bg-gray-700 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    {registering === event.id && <Loader className="w-4 h-4 animate-spin" />}
                    {isRegistered(event.id) ? "✓ Terdaftar" : event.current_quota === 0 ? "Kuota Habis" : "Daftar"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
