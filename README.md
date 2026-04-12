# TrackFlow

Enterprise-grade agile management platform focused on clarity, speed, and collaboration.

## Highlights
- Real-time collaboration and team communication
- AI chat assistant for project insights
- Kanban board, backlog, sprint planning
- Reporting with PDF/CSV export
- Time tracking and analytics
- Theme customization with responsive UI

## Features
- Team & Collaboration
- AI & Intelligence (Chat Assistant, Intelligent Analysis)
- Custom Design & Theme
- Time Tracking & Analytics
- GitHub Integration (repository & issue linking)
- Professional Reports (PDF & CSV)

## Project Structure
```
src/
  components/        # UI components
  context/           # App state providers
  pages/             # Route pages
  routes/            # App router
  utils/             # Helpers and generators
backend/
  server.js          # Express server entry
  routes/            # API routes
  models/            # Mongoose models
```

## Tech Stack
- React + Vite
- Tailwind CSS
- Framer Motion
- Recharts

## Quick Start
```bash
npm install
npm run dev
```

## Backend (Basic)
A minimal backend is available in `backend/` with auth and projects CRUD.

```bash
cd backend
npm install
npm run dev
```

API base: `http://localhost:5000/api/v1`

## Environment
Frontend:
```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Backend:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trackflow
JWT_SECRET=replace_me
FRONTEND_URL=http://localhost:5173
API_VERSION=v1
```

Do not commit `.env` files.

## License
MIT
