"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useProducts, type Product } from "../hooks/useProducts"
import { Plus, Edit, Trash2, Save, X, ArrowUp, ArrowDown, Eye, LogOut } from "lucide-react"
import LoginForm from "./components/LoginForm"
import ImageUpload from "./components/ImageUpload"

// Palavra-passe do administrador
const ADMIN_PASSWORD = "Papelaria2025"

export default function AdminPage() {
  const { products, getFeaturedProducts, addProduct, updateProduct, deleteProduct } = useProducts()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginError, setLoginError] = useState("")
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Product>>({})

  const featuredProducts = getFeaturedProducts()

  const categories = ["Escolar", "Escritório", "Escrita", "Papel", "Eletrônicos", "Brinquedos", "Diversão"]

  // Verificar se já está autenticado (sessão)
  useEffect(() => {
    const authStatus = sessionStorage.getItem("admin-authenticated")
    if (authStatus === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogin = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setLoginError("")
      // Salvar estado de autenticação na sessão (expira quando fechar o browser)
      sessionStorage.setItem("admin-authenticated", "true")
    } else {
      setLoginError("Palavra-passe incorreta. Tente novamente.")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("admin-authenticated")
    setIsAddingProduct(false)
    setEditingProduct(null)
    setFormData({})
  }

  // Se não estiver autenticado, mostrar formulário de login
  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} error={loginError} />
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      alert("Por favor, preencha todos os campos obrigatórios")
      return
    }

    if (editingProduct) {
      updateProduct(editingProduct, formData)
      setEditingProduct(null)
    } else {
      const maxOrder = Math.max(...featuredProducts.map((p) => p.order), 0)
      addProduct({
        ...formData,
        featured: true,
        order: maxOrder + 1,
        image: formData.image || "/placeholder.svg?height=300&width=300",
      } as Omit<Product, "id">)
      setIsAddingProduct(false)
    }
    setFormData({})
  }

  const handleEdit = (product: Product) => {
    setEditingProduct(product.id)
    setFormData(product)
    setIsAddingProduct(false)
  }

  const handleCancel = () => {
    setIsAddingProduct(false)
    setEditingProduct(null)
    setFormData({})
  }

  const moveProduct = (index: number, direction: "up" | "down") => {
    const newProducts = [...featuredProducts]
    const targetIndex = direction === "up" ? index - 1 : index + 1

    if (targetIndex >= 0 && targetIndex < newProducts.length) {
      ;[newProducts[index], newProducts[targetIndex]] = [newProducts[targetIndex], newProducts[index]]

      // Atualizar as ordens
      newProducts.forEach((product, idx) => {
        updateProduct(product.id, { order: idx + 1 })
      })
    }
  }

  const toggleFeatured = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (product) {
      if (product.featured) {
        // Remover dos destaques
        updateProduct(productId, { featured: false })
      } else {
        // Adicionar aos destaques (máximo 6)
        if (featuredProducts.length < 6) {
          const maxOrder = Math.max(...featuredProducts.map((p) => p.order), 0)
          updateProduct(productId, { featured: true, order: maxOrder + 1 })
        } else {
          alert("Máximo de 6 produtos em destaque permitidos")
        }
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Painel de Administração</h1>
              <p className="text-gray-600 mt-2">Gerir produtos em destaque da Papelaria Coutyfil</p>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="/"
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>Ver Site</span>
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Total de Produtos</h3>
            <p className="text-3xl font-bold text-blue-600">{products.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Produtos em Destaque</h3>
            <p className="text-3xl font-bold text-green-600">{featuredProducts.length}/6</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Categorias</h3>
            <p className="text-3xl font-bold text-purple-600">{categories.length}</p>
          </div>
        </div>

        {/* Add Product Button */}
        <div className="mb-6">
          <button
            onClick={() => setIsAddingProduct(true)}
            disabled={featuredProducts.length >= 6}
            className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Plus className="h-5 w-5" />
            <span>Adicionar Produto</span>
          </button>
          {featuredProducts.length >= 6 && (
            <p className="text-sm text-gray-500 mt-2">Máximo de 6 produtos em destaque atingido</p>
          )}
        </div>

        {/* Add/Edit Product Form */}
        {(isAddingProduct || editingProduct) && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-6">
              {editingProduct ? "Editar Produto" : "Adicionar Novo Produto"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Produto *</label>
                  <input
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preço (€) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price || ""}
                    onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Categoria *</label>
                <select
                  value={formData.category || ""}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                >
                  <option value="">Selecionar categoria</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição *</label>
                <textarea
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Imagem do Produto</label>
                <ImageUpload
                  value={formData.image || ""}
                  onChange={(imageUrl) => setFormData({ ...formData, image: imageUrl })}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Save className="h-4 w-4" />
                  <span>{editingProduct ? "Atualizar" : "Adicionar"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Cancelar</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Featured Products */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Produtos em Destaque (Ordem de Exibição)</h2>
          <div className="space-y-4">
            {featuredProducts.map((product, index) => (
              <div key={product.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                <img
                  src={product.image || "/placeholder.svg?height=80&width=80"}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{product.name}</h3>
                  <p className="text-sm text-gray-600">
                    {product.category} • €{product.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => moveProduct(index, "up")}
                    disabled={index === 0}
                    className="p-2 text-gray-600 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => moveProduct(index, "down")}
                    disabled={index === featuredProducts.length - 1}
                    className="p-2 text-gray-600 hover:text-gray-800 disabled:text-gray-300 disabled:cursor-not-allowed"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleEdit(product)} className="p-2 text-blue-600 hover:text-blue-800">
                    <Edit className="h-4 w-4" />
                  </button>
                  <button onClick={() => deleteProduct(product.id)} className="p-2 text-red-600 hover:text-red-800">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Todos os Produtos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                <img
                  src={product.image || "/placeholder.svg?height=150&width=150"}
                  alt={product.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  {product.category} • €{product.price.toFixed(2)}
                </p>
                <div className="flex justify-between items-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.featured ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {product.featured ? "Em Destaque" : "Normal"}
                  </span>
                  <button
                    onClick={() => toggleFeatured(product.id)}
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      product.featured
                        ? "bg-red-100 text-red-800 hover:bg-red-200"
                        : "bg-green-100 text-green-800 hover:bg-green-200"
                    }`}
                  >
                    {product.featured ? "Remover" : "Destacar"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
