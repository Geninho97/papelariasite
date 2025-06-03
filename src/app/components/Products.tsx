"use client"

import { Heart, ChevronDown, ArrowRight, Plus, RefreshCw } from "lucide-react"
import { useProducts } from "../hooks/useProducts"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Products() {
  const { getFeaturedProducts, loading, lastUpdate } = useProducts()
  const products = getFeaturedProducts()
  const [lastSyncTime, setLastSyncTime] = useState<string>("")

  // Atualizar o tempo da última sincronização
  useEffect(() => {
    if (lastUpdate) {
      const date = new Date(lastUpdate)
      setLastSyncTime(`${date.toLocaleDateString()} ${date.toLocaleTimeString()}`)
    }
  }, [lastUpdate])

  if (loading) {
    return (
      <section
        id="novidades"
        className="min-h-screen bg-gradient-to-br from-white via-red-50 to-green-50 py-8 flex flex-col justify-center"
      >
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando novidades da nuvem...</p>
        </div>
      </section>
    )
  }

  // Se não há produtos, mostrar mensagem para adicionar
  if (products.length === 0) {
    return (
      <section
        id="novidades"
        className="min-h-screen bg-gradient-to-br from-white via-red-50 to-green-50 py-8 flex flex-col justify-center"
      >
        <div className="container mx-auto px-4 text-center">
          {/* Header */}
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Novidades</h2>
            <p className="text-base text-gray-600 max-w-2xl mx-auto">
              Descubra os nossos produtos mais recentes e populares em destaque
            </p>
            <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-green-500 mx-auto mt-3 rounded-full"></div>
          </div>

          {/* Empty State */}
          <div className="bg-white rounded-xl shadow-lg p-12 max-w-2xl mx-auto">
            <div className="text-gray-400 mb-6">
              <Plus className="h-24 w-24 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Nenhum produto em destaque</h3>
            <p className="text-gray-600 mb-8 text-lg">
              Os produtos são carregados diretamente da base de dados na nuvem. Use o painel de administração para
              adicionar produtos em destaque.
            </p>
            <Link
              href="/admin"
              className="inline-flex items-center space-x-3 bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              <span>Ir para o Painel Admin</span>
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-8">
          <ChevronDown className="h-5 w-5 text-gray-600 animate-bounce" />
        </div>
      </section>
    )
  }

  return (
    <section
      id="novidades"
      className="min-h-screen bg-gradient-to-br from-white via-red-50 to-green-50 py-8 flex flex-col justify-center"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Novidades</h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Descubra os nossos produtos mais recentes e populares em destaque
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-green-500 mx-auto mt-3 rounded-full"></div>
          <div className="flex items-center justify-center mt-2 text-xs text-gray-500">
            <RefreshCw className="h-3 w-3 mr-1" />
            <span>Última sincronização: {lastSyncTime}</span>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto mb-8">
          {products.map((product) => (
            <Link
              href={`/produtos/${product.id}`}
              key={product.id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border-2 border-red-500 transform hover:-translate-y-1"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden h-36">
                <img
                  src={product.image || "/placeholder.svg?height=300&width=300"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2">
                  <button
                    className="bg-white p-1.5 rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
                    onClick={(e) => {
                      e.preventDefault()
                    }}
                  >
                    <Heart className="h-3 w-3 text-gray-600" />
                  </button>
                </div>
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-600 text-white">
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="text-base font-bold text-gray-800 mb-2 group-hover:text-red-600 transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-3 text-sm line-clamp-2">{product.description}</p>
                <div className="flex justify-end items-center">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">Ver detalhes</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Ver Todos os Produtos Button */}
        <div className="text-center mb-8">
          <Link
            href="/produtos"
            className="inline-flex items-center space-x-3 bg-gradient-to-r from-red-600 to-green-600 hover:from-red-700 hover:to-green-700 text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <span>Ver Todos os Produtos</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="text-sm text-gray-600 mt-2">Explore todo o nosso catálogo</p>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="flex justify-center mt-6">
        <ChevronDown className="h-5 w-5 text-gray-600 animate-bounce" />
      </div>
    </section>
  )
}
