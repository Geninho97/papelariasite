"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { hasDevAccess, grantDevAccess, checkDevAccessParam } from "@/app/lib/dev-access"
import { Lock, Key, Loader2 } from "lucide-react"

interface DevProtectionProps {
  children: React.ReactNode
  pageName: string
}

export default function DevProtection({ children, pageName }: DevProtectionProps) {
  const [hasAccess, setHasAccess] = useState(false)
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Verificar acesso quando o componente montar
    const checkAccess = () => {
      // Verificar se já tem acesso via cookie
      if (hasDevAccess()) {
        setHasAccess(true)
        setIsLoading(false)
        return
      }

      // Verificar parâmetro na URL (apenas para desenvolvimento)
      if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
        if (checkDevAccessParam(window.location.href)) {
          grantDevAccess()
          setHasAccess(true)
          setIsLoading(false)
          return
        }
      }

      setIsLoading(false)
    }

    checkAccess()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Usar a mesma API de login do admin
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (data.success) {
        // Login bem-sucedido
        grantDevAccess()
        setHasAccess(true)
      } else {
        // Login falhou
        setError(data.error || "Senha incorreta")
      }
    } catch (error) {
      setError("Erro ao verificar senha. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acesso...</p>
        </div>
      </div>
    )
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-6 sm:p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="bg-red-100 p-3 rounded-full inline-flex items-center justify-center mb-4">
              <Lock className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Página em Desenvolvimento</h1>
            <p className="text-gray-600 mt-2">
              Esta página está em desenvolvimento e não está disponível para o público.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Senha de Administrador
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Digite a senha de administrador"
                  disabled={isSubmitting}
                />
                <Key className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
              {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center space-x-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Verificando...</span>
                </>
              ) : (
                <span>Acessar {pageName}</span>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <a href="/" className="text-red-600 hover:text-red-800 font-medium">
              ← Voltar para a página inicial
            </a>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
