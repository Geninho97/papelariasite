"use client"

import { useState, useEffect } from "react"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Verificar se está autenticado - SEM useCallback para evitar loops
  const checkAuth = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/auth/verify", {
        method: "GET",
        credentials: "include",
        headers: {
          "Cache-Control": "no-cache",
          Pragma: "no-cache",
        },
      })

      const data = await response.json()

      if (response.ok && data.authenticated) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    } catch (error) {
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
      setError("Erro de conexão")
      return false
    }
  }

  // Logout
  const logout = async () => {
    try {
      setIsAuthenticated(false)
      setError(null)

      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })

      document.cookie = "admin-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
      window.location.href = "/admin"
    } catch (error) {
      setIsAuthenticated(false)
      document.cookie = "admin-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
      window.location.href = "/admin"
    }
  }

  // Executar verificação APENAS uma vez ao montar
  useEffect(() => {
    checkAuth()
  }, []) // IMPORTANTE: Array vazio - executa apenas uma vez

  return {
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    checkAuth,
  }
}
