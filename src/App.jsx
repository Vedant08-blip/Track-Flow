import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProjectProvider } from './context/ProjectContext'
import { ToastProvider, ToastContainer } from './context/ToastContext'
import AppRouter from './routes/AppRouter'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <ProjectProvider>
            <AppRouter />
            <ToastContainer />
          </ProjectProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
