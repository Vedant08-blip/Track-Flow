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
import { ChatAssistantProvider } from './context/ChatAssistantContext'
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
                <TimeTrackingProvider>
                  <SkillBasedAssignmentProvider>
                    <GitHubIntegrationProvider>
                      <GoogleCalendarProvider>
                        <ChatAssistantProvider>
                          <AppRouter />
                          <ToastContainer />
                        </ChatAssistantProvider>
                      </GoogleCalendarProvider>
                    </GitHubIntegrationProvider>
                  </SkillBasedAssignmentProvider>
                </TimeTrackingProvider>
              </CollaborationProvider>
            </ProjectProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
