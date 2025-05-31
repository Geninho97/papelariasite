"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useProducts, type Product } from "../hooks/useProducts"
import { useAuth } from "../hooks/useAuth"
import { Plus, Edit, Trash2, Save, X, ArrowUp, ArrowDown, Eye, LogOut, RefreshCw, Database, Check, AlertCircle, Clock } from 'lucide-react'
import Link from "next/link"
import LoginForm from "./components/LoginForm"
import ImageUpload from "./components/ImageUpload"

export default function AdminPage() {
  const { isAuthenticated, loading: authLoading, error: authError, login, logout } = useAuth()
  const {
    products,
    getFeaturedProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleFeatured,
    loading,
    saving,
    refreshProducts,
    error,
    lastUpdate
  } = useProducts()
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Product>>({})
  const [operationStatus, setOperationStatus] = useState<{ type: "success" | "error" | null; message: string }>({
    type: null,
    message: "",
  })
  const [lastUpdateFormatted, setLastUpdateFormatted] = useState<string>("")

  const featuredProducts = getFeaturedProducts()

  const categories = ["Escolar", "Escritório", "Escrita", "Papel", "Eletrônicos", "Brinquedos", "Diversão"]

  // Formatar a data da última atualização
  useEffect(() => {
    if (lastUpdate) {
      const date = new Date(lastUpdate)
      setLastUpdateFormatted(
        `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
      )
    }
  }, [lastUpdate])

  // Função para mostrar status temporário
  const showStatus = (type: "success" | "error", message: string) => {
    setOperationStatus({ type, message })
    setTimeout(() => {
      setOperationStatus({ type: null, message: "" })
    }, 3000)
  }

  // Se ainda está verificando autenticação
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    )
  }

  // Se não estiver autenticado, mostrar formulário de login
  if (!isAuthenticated) {
    return <LoginForm onLogin={login} error={authError || undefined} loading={authLoading} />
  }

  // Loading inicial dos produtos
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Carregando dados da nuvem...</p>
          <p className="text-sm text-gray-500 mt-2">Todos os produtos são carregados da base de dados</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      showStatus("error", "Por favor, preencha todos os campos obrigatórios")
      return
    }

    try {
      if (editingProduct) {
        await updateProduct(editingProduct, formData)
        setEditingProduct(null)
        showStatus("success", "Produto atualizado com sucesso!")
      } else {
        const maxOrder = Math.max(...featuredProducts.map((p) => p.order), 0)
        await addProduct({
          ...formData,
          featured: true,
          order: maxOrder + 1,
          image: formData.image || "/placeholder.svg?height=300&width=300",
        } as Omit<Product, "id">)
        setIsAddingProduct(false)
        showStatus("success", "Produto adicionado com sucesso!")
      }
      setFormData({})
    } catch (error) {
      console.error("Erro ao salvar produto:", error)
      showStatus("error", "Erro ao salvar produto")
    }
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

  const moveProduct = async (index: number, direction: "up" | "down") => {
    const newProducts = [...featuredProducts]
    const targetIndex = direction === "up" ? index - 1 : index + 1

    if (targetIndex >= 0 && targetIndex < newProducts.length) {
      // Trocar posições
      ;[newProducts[index], newProducts[targetIndex]] = [newProducts[targetIndex], newProducts[index]]

      // Atualizar as ordens de forma otimizada
      try {
        for (let i = 0; i < newProducts.length; i++) {
          await updateProduct(newProducts[i].id, { order: i + 1 })
        }
        showStatus("success", "Ordem atualizada!")
      } catch (error) {
        showStatus("error", "Erro ao reordenar produtos")
      }
    }
  }

  const handleToggleFeatured = async (productId: string) => {
    try {
      await toggleFeatured(productId)
      showStatus("success", "Status de destaque atualizado!")
    } catch (error) {
      showStatus("error", error instanceof Error ? error.message : "Erro ao alterar destaque")
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm("Tem certeza que deseja apagar este produto?")) {
      try {
        await deleteProduct(productId)
        showStatus("success", "Produto apagado com sucesso!")
      } catch (error) {
        showStatus("error", "Erro ao apagar produto")
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Status Bar */}
        {operationStatus.type && (
          <div
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-2 ${
              operationStatus.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
            }`}
          >
            {operationStatus.type === "success" ? <Check className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
            <span>{operationStatus.message}</span>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 flex items-center space-x-3">
                <span>Painel de Administração</span>
                <Database className="h-8 w-8 text-green-600" />
              </h1>
              <p className="text-gray-600 mt-2">Gerir produtos na base de dados - Papelaria Coutyfil</p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1 text-sm text-green-600">
                  <Database className="h-4 w-4" />
                  <span>100% Base de Dados na Nuvem</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-blue-600">
                  <Database className="h-4 w-4" />
                  <span>{products.length} produtos na base</span>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Última atualização: {lastUpdateFormatted}</span>
                </div>
                {saving && (
                  <div className="flex items-center space-x-1 text-sm text-orange-600">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Salvando...</span>
                  </div>
                )}
                {error && (
                  <div className="flex items-center space-x-1 text-sm text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span>Erro na sincronização</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => refreshProducts()}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                <span>Atualizar Agora</span>
              </button>
              <Link
                href="/"
                className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Eye className="h-4 w-4" />
                <span>Ver Site</span>
              </Link>
              <button
                onClick={logout}
                className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sincronização Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h3 className="text-lg font-semibold text-blue-800 flex items-center">
            <RefreshCw className="h-5 w-5 mr-2" />
            Sincronização Automática
          </h3>
          <p className="text-blue-700 mt-1">
            O sistema verifica automaticamente por atualizações a cada 10 segundos. Quando alguém fizer alterações em outro dispositivo, 
            elas serão sincronizadas automaticamente. Também sincronizamos quando você volta a esta aba.
          </p>
          <p className="text-blue-600 text-sm mt-2">
            Última sincronização: {lastUpdateFormatted}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Total de Produtos</h3>
            <p className="text-3xl font-bold text-blue-600">{products.length}</p>
            <p className="text-sm text-gray-500 mt-1">Carregados da base de dados</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Produtos em Destaque</h3>
            <p className="text-3xl font-bold text-green-600">{featuredProducts.length}/6</p>
            <p className="text-sm text-gray-500 mt-1">Visíveis na página inicial</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-700">Status</h3>
            <p className={`text-3xl font-bold ${saving ? "text-orange-600" : "text-green-600"}`}>
              {saving ? "Salvando" : "Sincronizado"}
            </p>
            <p className="text-sm text-gray-500 mt-1">{saving ? "Atualizando dados..." : "Dados atualizados"}</p>
          </div>
        </div>

        {/* Add Product Button */}
        <div className="mb-6">
          <button
            onClick={() => setIsAddingProduct(true)}
            disabled={saving}
            className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Plus className="h-5 w-5" />
            <span>Adicionar Produto à Base de Dados</span>
          </button>
          <p className="text-sm text-gray-500 mt-2">Operações são instantâneas na interface e sincronizadas automaticamente</p>
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
          {featuredProducts.length === 0 ? (
            <div className="text-center py-8">
              <Database className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 text-lg">Nenhum produto em destaque na base de dados</p>
              <p className="text-gray-500 text-sm mt-2">Adicione produtos e marque-os como destaque</p>
            </div>
          ) : (
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
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* All Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Todos os Produtos na Base de Dados</h2>
          {products.length === 0 ? (
            <div className="text-center py-12">
              <Database className="h-24 w-24 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Base de dados vazia</h3>
              <p className="text-gray-600 mb-4">
                Não há produtos armazenados na base de dados. Adicione o primeiro produto para começar.
              </p>
              <button
                onClick={() => setIsAddingProduct(true)}
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
              >
                Adicionar Primeiro Produto
              </button>
            </div>
          ) : (
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
                      onClick={() => handleToggleFeatured(product.id)}
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
          )}
        </div>
      </div>
    </div>
  )
}
