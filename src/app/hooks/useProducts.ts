"use client"

import { useState, useEffect } from "react"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  featured: boolean
  order: number
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now())

  // Carregar produtos com cache otimizado
  const loadProducts = async (silent = false) => {
    try {
      if (!silent) setLoading(true)
      setError(null)

      const response = await fetch("/api/products", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setProducts(data.products || [])
        setLastUpdate(Date.now())
      } else {
        throw new Error(data.error || "Erro desconhecido")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro ao carregar produtos")
      if (products.length === 0) {
        setProducts([])
      }
    } finally {
      if (!silent) setLoading(false)
    }
  }

  // Salvar produtos
  const saveProducts = async (newProducts: Product[]) => {
    try {
      setSaving(true)
      setError(null)

      // Atualização otimista
      setProducts(newProducts)

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products: newProducts }),
      })

      const data = await response.json()

      if (!data.success) {
        await loadProducts()
        throw new Error(data.error || "Erro ao salvar")
      }

      setLastUpdate(Date.now())
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro ao salvar produtos")
    } finally {
      setSaving(false)
    }
  }

  // Funções de produtos
  const getFeaturedProducts = () => {
    return products
      .filter((product) => product.featured)
      .sort((a, b) => a.order - b.order)
      .slice(0, 6)
  }

  const addProduct = async (product: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      price: 0, // Definir preço como 0 já que não será exibido
    }
    const newProducts = [...products, newProduct]
    await saveProducts(newProducts)
  }

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const newProducts = products.map((product) => (product.id === id ? { ...product, ...updates } : product))
    await saveProducts(newProducts)
  }

  // Deletar produto DEFINITIVAMENTE da base de dados e do storage
  const deleteProduct = async (id: string) => {
    try {
      setSaving(true)
      setError(null)

      console.log(`🗑️ [PRODUCTS] Deletando produto ${id} DEFINITIVAMENTE`)

      // Remover da lista local (atualização otimista)
      const newProducts = products.filter((product) => product.id !== id)
      setProducts(newProducts)

      // Chamar a API específica para deletar o produto e sua imagem
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        // Se falhou, recarregar produtos
        await loadProducts()
        throw new Error(data.error || "Erro ao deletar produto")
      }

      console.log(`✅ [PRODUCTS] Produto ${id} deletado com sucesso:`, data.message)

      // Limpar cache local
      if (typeof localStorage !== "undefined") {
        try {
          // Tentar limpar cache de produtos
          localStorage.removeItem("coutyfil_products")
          localStorage.removeItem("coutyfil_products_last_check")

          // Limpar cache de 24h se existir
          localStorage.removeItem("coutyfil_24h_products")
        } catch (e) {
          // Ignorar erros de localStorage
        }
      }

      setLastUpdate(Date.now())
      return data
    } catch (error) {
      console.error(`❌ [PRODUCTS] Erro ao deletar produto ${id}:`, error)
      setError(error instanceof Error ? error.message : "Erro ao deletar produto")
      // Recarregar produtos em caso de erro
      await loadProducts()
      throw error
    } finally {
      setSaving(false)
    }
  }

  const toggleFeatured = async (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    const featuredProducts = getFeaturedProducts()

    if (product.featured) {
      await updateProduct(productId, { featured: false })
    } else {
      if (featuredProducts.length < 6) {
        const maxOrder = Math.max(...featuredProducts.map((p) => p.order), 0)
        await updateProduct(productId, { featured: true, order: maxOrder + 1 })
      } else {
        throw new Error("Máximo de 6 produtos em destaque permitidos")
      }
    }
  }

  const reorderFeaturedProducts = async (productIds: string[]) => {
    const newProducts = products.map((product) => {
      const newOrder = productIds.indexOf(product.id)
      return {
        ...product,
        featured: newOrder !== -1,
        order: newOrder !== -1 ? newOrder + 1 : product.order,
      }
    })
    await saveProducts(newProducts)
  }

  // Carregar produtos ao montar
  useEffect(() => {
    loadProducts()
  }, [])

  // Escutar atualizações do cache
  useEffect(() => {
    const handleProductsUpdated = (event: CustomEvent) => {
      console.log("🔄 [PRODUCTS] Cache atualizado automaticamente")
      setProducts(event.detail)
      setLastUpdate(Date.now())
    }

    window.addEventListener("productsUpdated", handleProductsUpdated as EventListener)

    return () => {
      window.removeEventListener("productsUpdated", handleProductsUpdated as EventListener)
    }
  }, [])

  return {
    products,
    loading,
    saving,
    error,
    lastUpdate,
    getFeaturedProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    reorderFeaturedProducts,
    toggleFeatured,
    refreshProducts: loadProducts,
  }
}
