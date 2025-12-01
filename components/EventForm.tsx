"use client"

import type React from "react"
import { useState } from "react"
import { X, Loader } from "lucide-react"
import type { Event } from "@/lib/api-client"

interface EventFormProps {
  event: Event | null
  onSave: (eventData: Omit<Event, "id" | "created_at" | "updated_at">) => Promise<void>
  onCancel: () => void
  isLoading?: boolean
}

export default function EventForm({ event, onSave, onCancel, isLoading = false }: EventFormProps) {
  const [formData, setFormData] = useState({
    name: event?.name || "",
    description: event?.description || "",
    date: event?.date || "",
    location: event?.location || "",
    initial_quota: event?.initial_quota || 0,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = "Nama event wajib diisi"
    if (!formData.date) newErrors.date = "Tanggal wajib dipilih"
    if (!formData.location.trim()) newErrors.location = "Lokasi wajib diisi"
    if (formData.initial_quota < 1) newErrors.initial_quota = "Kuota minimal 1 peserta"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      setSubmitting(true)
      try {
        await onSave(formData)
      } finally {
        setSubmitting(false)
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 border border-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{event ? "Edit Event" : "Tambah Event Baru"}</h2>
          <button onClick={onCancel} className="p-1 hover:bg-gray-800 rounded-lg transition-colors">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Event Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nama Event</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Masukkan nama event"
            />
            {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Deskripsi</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
              rows={3}
              placeholder="Masukkan deskripsi event"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tanggal</label>
            <input
              type="datetime-local"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
            />
            {errors.date && <p className="text-red-400 text-sm mt-1">{errors.date}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Lokasi</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Masukkan lokasi event"
            />
            {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location}</p>}
          </div>

          {/* Quota */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Kuota Peserta</label>
            <input
              type="number"
              value={formData.initial_quota}
              onChange={(e) => setFormData({ ...formData, initial_quota: Number.parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
              min="1"
            />
            {errors.initial_quota && <p className="text-red-400 text-sm mt-1">{errors.initial_quota}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting || isLoading}
              className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={submitting || isLoading}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting && <Loader className="w-4 h-4 animate-spin" />}
              {event ? "Update" : "Tambah"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
