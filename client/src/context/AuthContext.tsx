import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '../api/axios'
import { User } from '../types'

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(localStorage.getItem('accessToken'))
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('accessToken')
    if (stored) {
      api.get('/api/auth/me')
        .then(({ data }) => { setUser(data.user); setToken(stored) })
        .catch(() => { localStorage.removeItem('accessToken'); setToken(null) })
        .finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/api/auth/login', { email, password })
    localStorage.setItem('accessToken', data.accessToken)
    setToken(data.accessToken)
    setUser(data.user)
  }

  const register = async (name: string, email: string, password: string) => {
    const { data } = await api.post('/api/auth/register', { name, email, password })
    localStorage.setItem('accessToken', data.accessToken)
    setToken(data.accessToken)
    setUser(data.user)
  }

  const logout = async () => {
    await api.post('/api/auth/logout').catch(() => {})
    localStorage.removeItem('accessToken')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
