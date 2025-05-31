"use client"

import { useState, useEffect } from "react"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Verificar se está autenticado
  const checkAuth = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log("🔍 [AUTH] Verificando autenticação...")

      const response = await fetch("/api/auth/verify", {
        method: "GET",
        credentials: "include", // Incluir cookies
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      console.log("📡 [AUTH] Response status:", response.status)

      const data = await response.json()
      console.log("📋 [AUTH] Response data:", data)

      if (response.ok && data.authenticated) {
        setIsAuthenticated(true)
        console.log("✅ [AUTH] Usuário autenticado")
      } else {
        setIsAuthenticated(false)
        console.log("❌ [AUTH] Usuário não autenticado:", data.error)
      }
    } catch (error) {
      console.error("❌ [AUTH] Erro ao verificar autenticação:", error)
      setIsAuthenticated(false)
      setError("Erro de conexão")
    } finally {
      setLoading(false)
    }
  }

  // Login
  const login = async (password: string): Promise<boolean> => {
    try {
      setError(null)
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (data.success) {
        setIsAuthenticated(true)
        return true
      } else {
        setError(data.error || "Erro no login")
        return false
      }
    } catch (error) {
      console.error("Erro no login:", error)
      setError("Erro de conexão")
      return false
    }
  }

  // Logout
  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })
      setIsAuthenticated(false)
    } catch (error) {
      console.error("Erro no logout:", error)
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return {
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    checkAuth,
  }
}
