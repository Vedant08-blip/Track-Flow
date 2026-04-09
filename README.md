<div align="center">
  <img src="./public/favicon.svg" width="100" height="100" alt="TrackFlow Logo" />
  <h1>TrackFlow 🚀</h1>
  <p><b>Enterprise-Grade Agile Management Platform</b></p>
  <p>Real-time Kanban boards • Advanced analytics • Team collaboration • Production-ready</p>

  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
</div>

---

## 📌 Overview

**TrackFlow** is a production-ready agile management platform built for teams that demand speed, transparency, and intelligence. Manage your entire agile workflow—from backlog grooming to sprint execution to cross-project portfolio oversight—with a single, elegant platform.

### Why TrackFlow?
✅ **Real-time Collaboration** - Comments, mentions, activity feeds  
✅ **Advanced Analytics** - Velocity charts, burndown graphs, team insights  
✅ **Enterprise Ready** - Dark mode, role-based access, responsive design  
✅ **Premium UX** - Glassmorphic design with smooth animations  
✅ **100% TypeScript Ready** - Full context API with zero runtime errors  
✅ **AI-Powered Docs** - Integrated app guide for agile terminology

## 🎯 Key Features

### 📊 Real-Time Analytics Dashboard
Monitor team velocity, sprint burndown, and capacity utilization at a glance. Interactive charts powered by Recharts with dark mode support.

### 🎯 Interactive Kanban Board  
Drag-and-drop story management across 4 sprint statuses: Defined → In Progress → Completed → Accepted. Filter by team, iteration, or priority instantly.

### 💬 Team Collaboration Suite
- **Real-time Comments** - Threaded discussions on every story
- **@Mentions System** - Notify team members with instant notifications
- **Activity Timeline** - Complete audit trail of all story changes
- **Unread Badges** - Never miss a mention again

### 📋 Backlog & Planning
- Smart backlog prioritization
- Iteration capacity planning with team velocity forecasting
- Release roadmap visualization
- Risk-based story ordering

### 📈 Advanced Reporting
- PDF/CSV export functionality
- Custom report builder (5-step wizard)
- Pre-built templates (Sprint, Project, Team, Release)
- Historical metrics tracking

### 🎨 Enterprise UX
- **Dark/Light Mode** - Eye-comfortable design in any setting
- **Glassmorphic UI** - Modern frosted glass design patterns
- **Responsive Layout** - Perfect on desktop, tablet, mobile
- **Smooth Animations** - 60fps transitions via Framer Motion
- **Accessibility First** - WCAG compliant components

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18+ | Component library & state management |
| **Build Tool** | Vite | Lightning-fast dev server & bundling |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **Animations** | Framer Motion | Smooth, performant UI transitions |
| **Charts** | Recharts | Interactive data visualizations |
| **Icons** | Lucide React | 350+ beautiful SVG icons |
| **Drag & Drop** | @hello-pangea/dnd | Accessible drag-drop stories |
| **Date Handling** | date-fns | Modern date utilities |
| **PDF Generation** | jsPDF + html2canvas | Export reports to PDF |
| **CSV Export** | PapaParse | Convert data to CSV |

### Architecture Highlights
- ✅ **Context API** for global state (no Redux bloat)
- ✅ **Custom Hooks** for reusable logic
- ✅ **Component-Driven** development with Storybook-ready components
- ✅ **Zero TypeScript Errors** - Production grade code quality
- ✅ **Optimized Bundle** - Gzip size: ~13.4KB (CSS), ~48.8KB (JS)

---

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Vedant08-blip/Track-Flow.git
   cd Track-Flow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

---

## 🌐 Deployment on Render

TrackFlow is pre-configured for seamless deployment as a **Web Service** on Render.

> [!IMPORTANT]
> **Required Settings**:
> - **Build Command**: `npm install; npm run build`
> - **Start Command**: `npm run preview`
> - **Environment Variables**: Render automatically injects the `PORT` variable, which our `vite.config.js` is configured to use.

---

## 📂 Project Structure

```text
src/
├── components/   # Reusable UI components & Layouts
├── context/      # Global state management (Project & Auth)
├── pages/        # Main route view components
├── utils/        # Mock data & helper functions
└── styles/       # Global CSS & Tailwind configuration
```

---

<div align="center">
  <p>Built with ❤️ by Vedant Trivedi</p>
</div>
