## Link Repository Website R&D
https://github.com/Notron-cmd/Project_Web_RND.git

## Tech Stack 
### Frontend
- React 19 dengan TypeScript
- Next.js 16 (App Router)
- Tailwind CSS v4
- Lucide React (Icons)
- SWR/Fetch API untuk HTTP requests
- React Bits (background)

### Backend
- Node.js dengan Express.js
- SQLite3 database
- bcryptjs untuk password hashing
- jsonwebtoken (JWT) untuk authentication
- CORS untuk cross-origin requests

## 📁 Struktur Project

\`\`\`
project-rnd/
├── frontend/                     # React + Next.js Frontend
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── LoginPage.tsx
│   │   ├── UserDashboard.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── EventForm.tsx
│   │   ├── EventTable.tsx
│   │   └── ParticipantsList.tsx
│   ├── lib/
│   │   └── api-client.ts
│   ├── public/
│   ├── .env.local.example
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── package.json
│   └── README.md
│
├── backend/                      # Node.js + Express Backend
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── events.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── index.js
│   │   └── app.js
│   ├── database/
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
│
├── .gitignore
└── README.md

## Instalasi & Setup

### Prasyarat
- Node.js v18 atau lebih baru
- npm atau yarn

### Backend Setup

\`\`\`bash
cd backend
npm install
cp .env.example .env
npm run dev
\`\`\`

Backend akan berjalan di `http://localhost:5000`

### Frontend Setup

\`\`\`bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
\`\`\`

Frontend akan berjalan di `http://localhost:3000`