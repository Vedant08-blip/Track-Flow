<div align="center">

# 🚀 TrackFlow

**Enterprise-grade agile project management — built for clarity, speed, and real collaboration.**

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

</div>

---

## 📌 What is TrackFlow?

TrackFlow is a full-stack agile project management platform designed for engineering teams who need more than a basic task board. It combines sprint planning, real-time collaboration, AI-powered insights, GitHub integration, and detailed analytics — all in a single, responsive interface.

Whether you're managing a solo side project or coordinating across a team, TrackFlow gives you the tools to ship faster and communicate better.

---

## ✨ Core Features

### 🗂️ Agile Workflow
- **Kanban Board** — drag-and-drop task management with customizable columns
- **Backlog Management** — organize, prioritize, and groom your task backlog
- **Sprint Planning** — define sprints, assign work, and track progress against goals

### 🤝 Team & Collaboration
- **Real-time collaboration** — work simultaneously with your team without conflicts
- **Team communication** — built-in messaging and discussion threads per project

### 🤖 AI & Intelligence
- **AI Chat Assistant** — ask questions about your project and get instant, contextual insights
- **Intelligent Analysis** — AI-driven suggestions to improve team productivity and delivery

### 📊 Reporting & Analytics
- **Time Tracking** — log time per task and visualize where effort is going
- **Analytics Dashboard** — charts and graphs powered by Recharts for deep visibility
- **PDF & CSV Export** — generate professional reports and share them instantly

### 🔗 Integrations
- **GitHub Integration** — link repositories and issues directly to TrackFlow tasks
- **API-first backend** — RESTful Express API ready for future integrations

### 🎨 Customization
- **Theme Customization** — personalize the UI to match your team's style
- **Responsive UI** — works seamlessly across desktop and mobile
- **Smooth Animations** — Framer Motion powered transitions throughout

---

## 🏗️ Architecture
trackflow/
├── src/
│   ├── components/        # Reusable UI components (Kanban, modals, charts, etc.)
│   ├── context/           # Global state providers (auth, theme, project)
│   ├── pages/             # Route-level page components
│   ├── routes/            # App router configuration
│   └── utils/             # Helper functions and data generators
│
└── backend/
├── server.js          # Express server entry point
├── routes/            # API route handlers
└── models/            # Mongoose data models

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| Charts | Recharts |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT-based authentication |

---

## ⚡ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Frontend

```bash
git clone https://github.com/Vedant08-blip/Track-Flow.git
cd Track-Flow
npm install
npm run dev
```

App runs at `http://localhost:5173`

### Backend

```bash
cd backend
npm install
npm run dev
```

API runs at `http://localhost:5000/api/v1`

---

## 🔐 Environment Variables

### Frontend (`.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

### Backend (`.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trackflow
JWT_SECRET=your_secret_here
FRONTEND_URL=http://localhost:5173
API_VERSION=v1
```

> ⚠️ Never commit `.env` files. Add them to `.gitignore`.

---

## 📡 API Reference

Base URL: `http://localhost:5000/api/v1`

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Login and receive JWT |
| GET | `/projects` | Fetch all projects |
| POST | `/projects` | Create a new project |
| PUT | `/projects/:id` | Update a project |
| DELETE | `/projects/:id` | Delete a project |

---

## 📄 License

This project is licensed under the **BSD 2-Clause License**. See the [LICENSE](./LICENSE) file for details.

---

<div align="center">
  Made with ☕ and consistency — 122 commits and counting.
</div>