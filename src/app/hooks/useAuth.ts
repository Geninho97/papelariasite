"use client"

import { useState } from "react"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false) // Começar como false
  const [error, setError] = useState<string | null>(null)

  // Login
  const login = async (password: string): Promise<boolean> => {
    try {
      setLoading(true)
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
        setLoading(false)
        return true
      } else {
        setError(data.error || "Erro no login")
        setLoading(false)
        return false
      }
    } catch (error) {
      setError("Erro de conexão")
      setLoading(false)
      return false
    }
  }

  // Logout
  const logout = async () => {
    try {
      setIsAuthenticated(false)
      setError(null)

      // Limpar cookie via JavaScript
      document.cookie = "admin-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"

      // Tentar chamar API de logout (mas não esperar)
      fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      }).catch(() => {
        // Ignorar erros
      })

      // Redirecionar imediatamente
      window.location.href = "/admin"
    } catch (error) {
      // Mesmo com erro, garantir logout local
      setIsAuthenticated(false)
      document.cookie = "admin-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
      window.location.href = "/admin"
    }
  }

  // Verificação manual apenas quando necessário
  const checkAuth = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/auth/verify", {
        method: "GET",
        credentials: "include",
        headers: {
          "Cache-Control": "no-cache",
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

  return {
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    checkAuth, // Expor para uso manual
  }
}
