"use client"

import type React from "react"

import { useState } from "react"
import { Lock, Eye, EyeOff, Loader2 } from "lucide-react"
import Link from "next/link"

interface LoginFormProps {
  onLogin: (password: string) => Promise<boolean>
  error?: string
  loading?: boolean
}

export default function LoginForm({ onLogin, error, loading }: LoginFormProps) {
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onLogin(password)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="bg-white p-6 rounded-full shadow-lg inline-block mb-4">
            <Lock className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Painel de Administração</h1>
          <p className="text-gray-600">Papelaria Coutyfil</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Palavra-passe de Administrador
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent pr-12"
                  placeholder="Digite a palavra-passe"
                  required
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600 text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-red-600 text-white py-4 px-6 rounded-lg hover:bg-red-700 transition-colors font-medium text-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Verificando...</span>
                </>
              ) : (
                <span>Entrar no Painel</span>
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">Acesso restrito apenas a administradores autorizados</p>
          </div>
        </div>

        {/* Back to site */}
        <div className="text-center mt-6">
          <Link href="/" className="text-gray-600 hover:text-red-600 transition-colors text-sm font-medium">
            ← Voltar ao site
          </Link>
        </div>
      </div>
    </div>
  )
}
