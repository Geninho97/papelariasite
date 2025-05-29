"use client"

import { Heart, ChevronDown } from "lucide-react"
import { useProducts } from "../hooks/useProducts"

const categoryColors = {
  Escolar: "bg-green-600 text-white",
  Escritório: "bg-green-600 text-white",
  Escrita: "bg-red-500 text-white",
  Papel: "bg-green-600 text-white",
  Eletrônicos: "bg-red-500 text-white",
  Brinquedos: "bg-red-500 text-white",
  Diversão: "bg-green-600 text-white",
}

export default function Products() {
  const { getFeaturedProducts, loading } = useProducts()
  const products = getFeaturedProducts()

  if (loading) {
    return (
      <section
        id="produtos"
        className="min-h-screen bg-gradient-to-br from-white via-red-50 to-green-50 py-8 flex flex-col justify-center"
      >
        <div className="container mx-auto px-4 text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando produtos...</p>
        </div>
      </section>
    )
  }

  return (
    <section
      id="produtos"
      className="min-h-screen bg-gradient-to-br from-white via-red-50 to-green-50 py-8 flex flex-col justify-center"
    >
      <div className="container mx-auto px-4">
        {/* Header - Compacto */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Nossos Produtos</h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Descubra nossa ampla variedade de produtos de papelaria, material escolar e suprimentos para escritório
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-green-500 mx-auto mt-3 rounded-full"></div>
        </div>

        {/* Products Grid - Compacto */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group border border-gray-100 hover:border-red-200 transform hover:-translate-y-1"
            >
              {/* Product Image - Menor */}
              <div className="relative overflow-hidden h-36">
                <img
                  src={product.image || "/placeholder.svg?height=300&width=300"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2">
                  <button className="bg-white p-1.5 rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors">
                    <Heart className="h-3 w-3 text-gray-600" />
                  </button>
                </div>
                <div className="absolute top-2 left-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-bold ${categoryColors[product.category as keyof typeof categoryColors] || "bg-gray-500 text-white"}`}
                  >
                    {product.category}
                  </span>
                </div>
              </div>

              {/* Product Info - Compacto */}
              <div className="p-4">
                <h3 className="text-base font-bold text-gray-800 mb-2 group-hover:text-red-600 transition-colors line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-gray-600 mb-3 text-sm line-clamp-2">{product.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-green-600">€{product.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Nenhum produto em destaque no momento.</p>
          </div>
        )}
      </div>

      {/* Scroll indicator - Menor */}
      <div className="flex justify-center mt-6">
        <ChevronDown className="h-5 w-5 text-gray-600 animate-bounce" />
      </div>
    </section>
  )
}
