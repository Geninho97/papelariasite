"use client"

import { useState, useEffect, useRef } from "react"

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Proteção contra loops infinitos
  const isCheckingRef = useRef(false)
  const lastCheckRef = useRef(0)
  const checkCountRef = useRef(0)

  // Verificar se está autenticado com proteção contra loops
  const checkAuth = async () => {
    // Evitar múltiplas verificações simultâneas
    if (isCheckingRef.current) {
      return
    }

    // Evitar verificações muito frequentes (mínimo 1 segundo entre verificações)
    const now = Date.now()
    if (now - lastCheckRef.current < 1000) {
      return
    }

    // Limitar número de tentativas consecutivas
    if (checkCountRef.current > 3) {
      setLoading(false)
      setIsAuthenticated(false)
      return
    }

    try {
      isCheckingRef.current = true
      lastCheckRef.current = now
      checkCountRef.current++

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
        checkCountRef.current = 0 // Reset contador em caso de sucesso
      } else {
        setIsAuthenticated(false)
        // Não definir erro para 401 - é comportamento normal quando não logado
        if (response.status !== 401) {
          setError("Erro de autenticação")
        }
      }
    } catch (error) {
      setIsAuthenticated(false)
      setError("Erro de conexão")
    } finally {
      setLoading(false)
      isCheckingRef.current = false
    }
  }

  // Login
  const login = async (password: string): Promise<boolean> => {
    try {
      setError(null)
      checkCountRef.current = 0 // Reset contador para login

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
      checkCountRef.current = 0 // Reset contador

      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      })

      // Limpar cookie via JavaScript como backup
      document.cookie = "admin-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"

      // Redirecionar para página de login
      window.location.href = "/admin"
    } catch (error) {
      // Mesmo com erro, garantir logout local
      setIsAuthenticated(false)
      document.cookie = "admin-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
      window.location.href = "/admin"
    }
  }

  // Verificar autenticação apenas uma vez ao montar o componente
  useEffect(() => {
    checkAuth()
  }, []) // Array de dependências vazio - executa apenas uma vez

  return {
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    checkAuth,
  }
}
