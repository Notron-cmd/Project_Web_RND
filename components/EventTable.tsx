"use client"

import { Trash2, Edit2, Users, Loader } from "lucide-react"
import type { Event } from "@/lib/api-client"
import Iridescence from './Iridescence';

interface EventTableProps {
  events: Event[]
  onEdit: (event: Event) => void
  onDelete: (eventId: number) => Promise<void>
  isLoading?: boolean
}

export default function EventTable({ events, onEdit, onDelete, isLoading = false }: EventTableProps) {
  return (
    <div className="overflow-x-auto bg-gray-900 bg-opacity-50 border border-gray-800 rounded-lg">
      
      <table className="w-full">
        <thead className="bg-gray-800 bg-opacity-50 border-b border-gray-700">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Nama Event</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Tanggal</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Lokasi</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Sisa Kuota</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => (
            <tr
              key={event.id}
              className={`${
                index !== events.length - 1 ? "border-b border-gray-800" : ""
              } hover:bg-gray-800 hover:bg-opacity-30 transition-colors`}
            >
              <td className="px-6 py-4 text-white font-medium line-clamp-1">{event.name}</td>
              <td className="px-6 py-4 text-gray-400 text-sm">
                {new Date(event.date).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
              </td>
              <td className="px-6 py-4 text-gray-400 text-sm">{event.location}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    event.current_quota > 0
                      ? "bg-green-500 bg-opacity-10 text-green-400"
                      : "bg-red-500 bg-opacity-10 text-red-400"
                  }`}
                >
                  <Users className="w-4 h-4" />
                  {event.current_quota} / {event.initial_quota}
                </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(event)}
                    disabled={isLoading}
                    className="p-2 hover:bg-blue-500 hover:bg-opacity-10 text-blue-400 rounded-lg transition-colors disabled:opacity-50"
                    title="Edit"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(event.id)}
                    disabled={isLoading}
                    className="p-2 hover:bg-red-500 hover:bg-opacity-10 text-red-400 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                    title="Hapus"
                  >
                    {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
