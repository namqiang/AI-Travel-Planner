import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@/types'
import { authService } from '@/services/authService'

interface AuthContextType {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 检查当前用户
    authService.getCurrentUser().then(currentUser => {
      setUser(currentUser as User)
      setLoading(false)
    }).catch(() => {
      setLoading(false)
    })

    // 监听认证状态变化
    const { data: { subscription } } = authService.onAuthStateChange((currentUser) => {
      setUser(currentUser as User)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    const { user: authUser } = await authService.signIn(email, password)
    setUser(authUser as User)
  }

  const signUp = async (email: string, password: string) => {
    const { user: authUser } = await authService.signUp(email, password)
    setUser(authUser as User)
  }

  const signOut = async () => {
    await authService.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
