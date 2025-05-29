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
      const response = await fetch("/api/auth/verify", {
        credentials: "include", // Incluir cookies
      })

      const data = await response.json()
      setIsAuthenticated(data.authenticated)
    } catch (error) {
      console.error("Erro ao verificar autenticação:", error)
      setIsAuthenticated(false)
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
