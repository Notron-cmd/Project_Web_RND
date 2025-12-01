"use client"

import { useState, useEffect } from "react"
import { LogOut, Plus, AlertCircle, Loader } from "lucide-react"
import { eventsApi, type Event } from "@/lib/api-client"
import EventForm from "./EventForm"
import EventTable from "./EventTable"

interface AdminDashboardProps {
  onLogout: () => void
  username: string
}

export default function AdminDashboard({ onLogout, username }: AdminDashboardProps) {
  const [events, setEvents] = useState<Event[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const data = await eventsApi.getAll()
      setEvents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load events")
    } finally {
      setLoading(false)
    }
  }

  const handleSaveEvent = async (eventData: Omit<Event, "id" | "created_at" | "updated_at">) => {
    try {
      setActionLoading(true)
      if (editingEvent) {
        await eventsApi.update(editingEvent.id, eventData)
        setEvents(events.map((e) => (e.id === editingEvent.id ? { ...e, ...eventData } : e)))
      } else {
        const newEvent = await eventsApi.create(eventData)
        setEvents([...events, newEvent])
      }
      setShowForm(false)
      setEditingEvent(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save event")
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeleteEvent = async (eventId: number) => {
    try {
      setActionLoading(true)
      await eventsApi.delete(eventId)
      setEvents(events.filter((e) => e.id !== eventId))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete event")
    } finally {
      setActionLoading(false)
    }
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setShowForm(true)
  }

  const handleCloseForm = () => {
    setShowForm(false)
    setEditingEvent(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#0f0f0f]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0f0f0f] bg-opacity-80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-sm text-gray-400">Halo, {username}!</p>
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

        {/* Add Event Button */}
        <button
          onClick={() => setShowForm(true)}
          disabled={actionLoading}
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all mb-8 shadow-lg shadow-blue-500/30 disabled:opacity-50"
        >
          <Plus className="w-5 h-5" />
          Tambah Event
        </button>

        {/* Form Modal */}
        {showForm && (
          <EventForm
            event={editingEvent}
            onSave={handleSaveEvent}
            onCancel={handleCloseForm}
            isLoading={actionLoading}
          />
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-400">Memuat event...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 bg-gray-900 bg-opacity-50 border border-gray-800 rounded-lg">
            <p className="text-gray-400">Tidak ada event. Buat event baru untuk memulai.</p>
          </div>
        ) : (
          <EventTable events={events} onEdit={handleEditEvent} onDelete={handleDeleteEvent} isLoading={actionLoading} />
        )}
      </div>
    </div>
  )
}
