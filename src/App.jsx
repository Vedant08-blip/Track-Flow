import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProjectProvider } from './context/ProjectContext'
import { ToastProvider, ToastContainer } from './context/ToastContext'
import { ThemeProvider } from './context/ThemeContext'
import { CollaborationProvider } from './context/CollaborationContext'
import AppRouter from './routes/AppRouter'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <ProjectProvider>
              <CollaborationProvider>
                <AppRouter />
                <ToastContainer />
              </CollaborationProvider>
            </ProjectProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
