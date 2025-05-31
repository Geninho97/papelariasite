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

      console.log("🔍 [AUTH HOOK] Verificando autenticação...")

      const response = await fetch("/api/auth/verify", {
        method: "GET",
        credentials: "include", // Incluir cookies
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      console.log("📡 [AUTH HOOK] Response status:", response.status)
      console.log("📡 [AUTH HOOK] Response ok:", response.ok)

      const data = await response.json()
      console.log("📋 [AUTH HOOK] Response data:", data)

      if (response.ok && data.authenticated) {
        setIsAuthenticated(true)
        console.log("✅ [AUTH HOOK] Usuário autenticado")
      } else {
        setIsAuthenticated(false)
        console.log("❌ [AUTH HOOK] Usuário não autenticado:", data.error)
        console.log("🔍 [AUTH HOOK] Debug info:", data.debug)

        // Se há informações de debug, mostrar no erro
        if (data.debug) {
          setError(`${data.error} (${data.debug})`)
        }
      }
    } catch (error) {
      console.error("❌ [AUTH HOOK] Erro ao verificar autenticação:", error)
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
      console.log("🔐 [AUTH HOOK] Tentando login...")

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ password }),
      })

      console.log("📡 [AUTH HOOK] Login response status:", response.status)

      const data = await response.json()
      console.log("📋 [AUTH HOOK] Login response data:", data)

      if (data.success) {
        setIsAuthenticated(true)
        console.log("✅ [AUTH HOOK] Login bem-sucedido")
        return true
      } else {
        console.log("❌ [AUTH HOOK] Login falhou:", data.error)
        setError(data.debug ? `${data.error} (${data.debug})` : data.error)
        return false
      }
    } catch (error) {
      console.error("❌ [AUTH HOOK] Erro no login:", error)
      setError("Erro de conexão")
      return false
    }
  }

  // Logout
  const logout = async () => {
    try {
      console.log("🚪 [AUTH HOOK] Fazendo logout...")

      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })

      setIsAuthenticated(false)
      console.log("✅ [AUTH HOOK] Logout realizado")
    } catch (error) {
      console.error("❌ [AUTH HOOK] Erro no logout:", error)
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
