import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import ProtectedRoute from './components/auth/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import ExamList from './pages/ExamList'
import ExamSession from './pages/ExamSession'
import Results from './pages/Results'
import Profile from './pages/Profile'
import Grammar from './pages/Grammar'
import VerbPatterns from './pages/VerbPatterns'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageExams from './pages/admin/ManageExams'
import ManageQuestions from './pages/admin/ManageQuestions'
import ManageUsers from './pages/admin/ManageUsers'

export default function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/exams" element={<ExamList />} />
          <Route path="/grammar" element={<Grammar />} />
          <Route path="/verbs" element={<VerbPatterns />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/exam/:id" element={<ProtectedRoute><ExamSession /></ProtectedRoute>} />
          <Route path="/results/:attemptId" element={<ProtectedRoute><Results /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/exams" element={<ProtectedRoute adminOnly><ManageExams /></ProtectedRoute>} />
          <Route path="/admin/questions" element={<ProtectedRoute adminOnly><ManageQuestions /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute adminOnly><ManageUsers /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}
