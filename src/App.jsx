import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProjectProvider } from './context/ProjectContext'
import { ToastProvider, ToastContainer } from './context/ToastContext'
import { ThemeProvider } from './context/ThemeContext'
import { CollaborationProvider } from './context/CollaborationContext'
import { TimeTrackingProvider } from './context/TimeTrackingContext'
import { SkillBasedAssignmentProvider } from './context/SkillBasedAssignmentContext'
import { GitHubIntegrationProvider } from './context/GitHubIntegrationContext'
import { GoogleCalendarProvider } from './context/GoogleCalendarContext'
import { ChatProvider } from './context/ChatContext'
import AppRouter from './routes/AppRouter'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <ProjectProvider>
              <ChatProvider>
                <CollaborationProvider>
                  <TimeTrackingProvider>
                    <SkillBasedAssignmentProvider>
                      <GitHubIntegrationProvider>
                        <GoogleCalendarProvider>
                          <AppRouter />
                          <ToastContainer />
                        </GoogleCalendarProvider>
                      </GitHubIntegrationProvider>
                    </SkillBasedAssignmentProvider>
                  </TimeTrackingProvider>
                </CollaborationProvider>
              </ChatProvider>
            </ProjectProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
