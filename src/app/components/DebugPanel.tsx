"use client"

import { useState } from "react"
import { RefreshCw, Bug, Trash2, Database, Eye, Save } from "lucide-react"

export default function DebugPanel() {
  const [debugInfo, setDebugInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const runDiagnostic = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/debug/products", {
        cache: "no-store",
      })

      const data = await response.json()
      setDebugInfo(data)

      if (!data.success) {
        setError(data.error || "Erro no diagnóstico")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro de conexão")
    } finally {
      setLoading(false)
    }
  }

  const testSaveProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      // Criar um produto de teste
      const testProducts = [
        {
          id: "test-" + Date.now(),
          name: "Produto Teste",
          description: "Produto para teste de salvamento",
          price: 10.99,
          image: "/placeholder.svg?height=300&width=300",
          category: "Teste",
          featured: false,
          order: 0,
        },
      ]

      const response = await fetch("/api/debug/save-products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products: testProducts }),
      })

      const data = await response.json()
      setDebugInfo(data)

      if (data.success) {
        alert("✅ Teste de salvamento bem-sucedido!")
      } else {
        setError(data.error || "Erro no teste de salvamento")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro no teste")
    } finally {
      setLoading(false)
    }
  }

  const clearCache = async () => {
    try {
      setLoading(true)

      // Limpar cache do servidor
      await fetch("/api/debug/cache-clear", {
        method: "POST",
      })

      // Limpar cache local
      if (typeof localStorage !== "undefined") {
        const keys = []
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i)
          if (key?.includes("coutyfil")) {
            keys.push(key)
          }
        }
        keys.forEach((key) => localStorage.removeItem(key))
      }

      alert("Cache limpo! Recarregando página...")
      window.location.reload()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao limpar cache")
    } finally {
      setLoading(false)
    }
  }

  const testAPI = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/products", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      const data = await response.json()

      alert(`API Response: ${data.success ? "✅ Sucesso" : "❌ Erro"}\nProdutos: ${data.products?.length || 0}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro na API")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white rounded-lg shadow-lg border-2 border-red-500 p-4 max-w-md">
        <div className="flex items-center space-x-2 mb-4">
          <Bug className="h-5 w-5 text-red-600" />
          <h3 className="font-bold text-gray-800">Debug Panel</h3>
        </div>

        <div className="space-y-2">
          <button
            onClick={runDiagnostic}
            disabled={loading}
            className="w-full flex items-center space-x-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            <Database className="h-4 w-4" />
            <span>Diagnosticar Produtos</span>
          </button>

          <button
            onClick={testSaveProducts}
            disabled={loading}
            className="w-full flex items-center space-x-2 bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700 disabled:bg-gray-400"
          >
            <Save className="h-4 w-4" />
            <span>Testar Salvamento</span>
          </button>

          <button
            onClick={testAPI}
            disabled={loading}
            className="w-full flex items-center space-x-2 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            <Eye className="h-4 w-4" />
            <span>Testar API</span>
          </button>

          <button
            onClick={clearCache}
            disabled={loading}
            className="w-full flex items-center space-x-2 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 disabled:bg-gray-400"
          >
            <Trash2 className="h-4 w-4" />
            <span>Limpar Cache</span>
          </button>
        </div>

        {loading && (
          <div className="mt-4 flex items-center space-x-2 text-blue-600">
            <RefreshCw className="h-4 w-4 animate-spin" />
            <span>Processando...</span>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            <strong>Erro:</strong> {error}
          </div>
        )}

        {debugInfo && (
          <div className="mt-4 p-3 bg-gray-50 border rounded text-xs max-h-40 overflow-y-auto">
            <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  )
}
