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

## 🏗️ Project Structure

```
TrackFlow/
├── 📁 src/                          # Frontend (React + Vite)
│   ├── components/
│   │   ├── auth/                    # Login, register components
│   │   ├── backlog/                 # Backlog management UI
│   │   ├── board/                   # Kanban board components
│   │   ├── dashboard/               # Dashboard & overview
│   │   ├── planning/                # Sprint planning components
│   │   ├── portfolio/               # Portfolio view
│   │   ├── reports/                 # Reporting & exports
│   │   ├── shared/                  # Reusable components (buttons, modals, etc.)
│   │   └── timeline/                # Timeline/Gantt components
│   │
│   ├── context/                     # Global state management
│   │   ├── AuthContext.jsx          # Authentication state
│   │   ├── ProjectContext.jsx       # Project state
│   │   ├── ThemeContext.jsx         # Theme switching
│   │   ├── ChatAssistantContext.jsx # AI chat state
│   │   ├── TimeTrackingContext.jsx  # Time tracking state
│   │   ├── GitHubIntegrationContext.jsx
│   │   └── CollaborationContext.jsx # Real-time collaboration
│   │
│   ├── pages/                       # Route-level pages
│   │   ├── LoginPage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── BoardPage.jsx
│   │   ├── BacklogPage.jsx
│   │   ├── PlanningPage.jsx
│   │   ├── ReportsPage.jsx
│   │   └── PortfolioPage.jsx
│   │
│   ├── routes/                      # Router configuration
│   │   └── AppRouter.jsx
│   │
│   ├── utils/                       # Helper functions
│   │   ├── helpers.js
│   │   ├── mockData.js
│   │   └── reportGenerator.js
│   │
│   ├── hooks/                       # Custom React hooks
│   │   └── useUserProfile.js
│   │
│   ├── data/                        # Static data
│   │   └── avatarMetadata.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── 📁 backend/                      # Backend (Node.js + Express)
│   ├── server.js                    # Express server entry point
│   │
│   ├── config/
│   │   └── database.js              # MongoDB connection
│   │
│   ├── models/                      # Mongoose schemas
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── schemas.js
│   │
│   ├── routes/                      # API route handlers
│   │   ├── auth.js
│   │   ├── projectRoutes.js
│   │   ├── storyRoutes.js
│   │   ├── iterationRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── teamRoutes.js
│   │   ├── commentRoutes.js
│   │   └── index.js
│   │
│   ├── controllers/                 # Business logic
│   │   ├── userController.js
│   │   ├── projectController.js
│   │   ├── storyController.js
│   │   ├── iterationController.js
│   │   ├── chatController.js
│   │   ├── teamController.js
│   │   └── commentController.js
│   │
│   ├── middleware/                  # Express middleware
│   │   ├── authMiddleware.js        # JWT verification
│   │   ├── errorMiddleware.js
│   │   └── validationMiddleware.js
│   │
│   ├── services/                    # External service integrations
│   │   └── databaseService.js
│   │
│   ├── utils/                       # Helper utilities
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   └── logger.js
│   │
│   └── package.json
│
├── 📁 public/                       # Static assets
│   ├── screenshots/
│   ├── Avatar/
│   └── favicon.svg
│
├── vite.config.js
├── package.json
├── README.md
└── LICENSE
```

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
  Made with ☕ and consistency — 122 commits and still counting.
</div>