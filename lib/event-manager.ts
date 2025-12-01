export interface Event {
  id: string
  name: string
  description: string
  date: string
  location: string
  quota: number
}

const STORAGE_KEY = "hmif_events"

const DEMO_EVENTS: Event[] = [
  {
    id: "1",
    name: "Workshop Web Development",
    description: "Belajar membuat website modern dengan React dan Next.js",
    date: "2025-12-10T14:00",
    location: "Ruang Lab A - UMN",
    quota: 30,
  },
  {
    id: "2",
    name: "Seminar UI/UX Design",
    description: "Mendalami prinsip design dan user experience terkini",
    date: "2025-12-15T15:00",
    location: "Aula HMIF",
    quota: 50,
  },
  {
    id: "3",
    name: "Gathering HMIF Gen XVI",
    description: "Berkumpul dan berkenalan dengan seluruh anggota HMIF",
    date: "2025-12-20T18:00",
    location: "Outdoor Area UMN",
    quota: 100,
  },
]

export const EventManager = {
  getEvents: (): Event[] => {
    if (typeof window === "undefined") return DEMO_EVENTS

    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : DEMO_EVENTS
    } catch {
      return DEMO_EVENTS
    }
  },

  saveEvents: (events: Event[]): void => {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events))
    } catch {
      console.error("Failed to save events")
    }
  },

  resetEvents: (): void => {
    if (typeof window === "undefined") return
    localStorage.removeItem(STORAGE_KEY)
  },
}
