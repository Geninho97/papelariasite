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

  // Carregar produtos - SEM useCallback para evitar loops
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
    }
    const newProducts = [...products, newProduct]
    await saveProducts(newProducts)
  }

  const updateProduct = async (id: string, updates: Partial<Product>) => {
    const newProducts = products.map((product) => (product.id === id ? { ...product, ...updates } : product))
    await saveProducts(newProducts)
  }

  const deleteProduct = async (id: string) => {
    const newProducts = products.filter((product) => product.id !== id)
    await saveProducts(newProducts)
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

  // Carregar produtos APENAS uma vez ao montar
  useEffect(() => {
    loadProducts()
  }, []) // IMPORTANTE: Array vazio

  // Polling simples - sem dependências complexas
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch("/api/products/last-modified", {
          cache: "no-store",
        })
        if (response.ok) {
          const data = await response.json()
          if (data.lastModified && data.lastModified > lastUpdate) {
            loadProducts(true)
          }
        }
      } catch (error) {
        // Silencioso
      }
    }, 30000) // 30 segundos

    return () => clearInterval(interval)
  }, [lastUpdate]) // Apenas lastUpdate como dependência

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
