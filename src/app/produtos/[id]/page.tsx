"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, ShoppingBag, Heart, Share2 } from "lucide-react"
import Link from "next/link"
import { useProducts, type Product } from "@/app/hooks/useProducts"
import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"

export default function ProductPage() {
  const params = useParams()
  const router = useRouter()
  const { products, loading } = useProducts()
  const [product, setProduct] = useState<Product | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])

  // Carregar produto com base no ID da URL
  useEffect(() => {
    if (!loading && products.length > 0) {
      const productId = params.id as string
      const foundProduct = products.find((p) => p.id === productId)

      if (foundProduct) {
        setProduct(foundProduct)
        setSelectedImage(foundProduct.image)

        // Encontrar produtos relacionados (mesma categoria)
        const related = products
          .filter((p) => p.category === foundProduct.category && p.id !== foundProduct.id)
          .slice(0, 3)
        setRelatedProducts(related)
      } else {
        // Produto não encontrado, redirecionar
        router.push("/")
      }
    }
  }, [params.id, products, loading, router])

  // Imagens adicionais simuladas (na implementação real, viriam do banco de dados)
  const additionalImages = product
    ? [
        product.image,
        `/placeholder.svg?height=600&width=600&text=Imagem+2`,
        `/placeholder.svg?height=600&width=600&text=Imagem+3`,
      ]
    : []

  if (loading || !product) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Carregando produto...</p>
          </div>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-white via-red-50 to-green-50 py-8">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-red-600 transition-colors">
              Início
            </Link>
            <span>/</span>
            <Link href="/#produtos" className="hover:text-red-600 transition-colors">
              Produtos
            </Link>
            <span>/</span>
            <Link href={`/#produtos`} className="hover:text-red-600 transition-colors">
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{product.name}</span>
          </nav>

          {/* Back Button */}
          <Link
            href="/#produtos"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Voltar aos produtos</span>
          </Link>

          {/* Product Details */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
            <div className="grid md:grid-cols-2 gap-8 p-6">
              {/* Product Images */}
              <div className="space-y-4">
                {/* Main Image */}
                <div className="bg-gray-100 rounded-lg overflow-hidden h-80 flex items-center justify-center">
                  <img
                    src={selectedImage || product.image}
                    alt={product.name}
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Thumbnail Gallery */}
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {additionalImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(img)}
                      className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                        selectedImage === img ? "border-red-500" : "border-gray-200"
                      }`}
                    >
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`${product.name} - Imagem ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">{product.name}</h1>
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-green-600 text-white rounded-full text-sm font-medium">
                      {product.category}
                    </span>
                    <span className="text-gray-500 text-sm">ID: {product.id}</span>
                  </div>
                </div>

                <div className="text-3xl font-bold text-red-600">€{product.price.toFixed(2)}</div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Descrição</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">Características</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Produto de alta qualidade</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Garantia de satisfação</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span>Entrega disponível</span>
                    </li>
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-4 pt-6">
                  <button className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-colors">
                    <ShoppingBag className="h-5 w-5" />
                    <span>Adicionar ao Carrinho</span>
                  </button>
                  <button className="bg-gray-200 hover:bg-gray-300 p-3 rounded-lg transition-colors">
                    <Heart className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="bg-gray-200 hover:bg-gray-300 p-3 rounded-lg transition-colors">
                    <Share2 className="h-5 w-5 text-gray-600" />
                  </button>
                </div>

                {/* Availability */}
                <div className="flex items-center space-x-2 text-sm">
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="text-green-600 font-medium">Em stock</span>
                  <span className="text-gray-500">- Pronto para entrega</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Produtos Relacionados</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Link
                    href={`/produtos/${relatedProduct.id}`}
                    key={relatedProduct.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border-2 border-red-500"
                  >
                    <div className="h-48 overflow-hidden">
                      <img
                        src={relatedProduct.image || "/placeholder.svg?height=300&width=300"}
                        alt={relatedProduct.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-gray-800 mb-1">{relatedProduct.name}</h3>
                      <p className="text-red-600 font-bold">€{relatedProduct.price.toFixed(2)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
