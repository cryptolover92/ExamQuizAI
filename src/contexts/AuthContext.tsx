import { createContext, useContext, useState, ReactNode } from 'react'

interface User {
  id: string
  email: string
  user_metadata?: {
    full_name?: string
  }
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  // Initialize with a mock user for testing
  // In a real app, this would come from an auth service
  useState(() => {
    // For testing purposes, we'll set a mock user
    // In a real implementation, this would be handled by your auth system
    setUser({
      id: 'test-user-id',
      email: 'test@example.com',
      user_metadata: {
        full_name: 'Test User'
      }
    })
  })

  const signOut = async () => {
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    loading,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
