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

  // Carregar produtos da nuvem
  const loadProducts = async () => {
    try {
      setLoading(true)
      console.log("🔄 Carregando produtos da API...")

      const response = await fetch("/api/products")
      const data = await response.json()

      if (data.success) {
        setProducts(data.products)
        console.log("✅ Produtos carregados:", data.products.length)
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("❌ Erro ao carregar produtos:", error)
    } finally {
      setLoading(false)
    }
  }

  // Salvar produtos na nuvem
  const saveProducts = async (newProducts: Product[]) => {
    try {
      setSaving(true)
      console.log("💾 Salvando produtos na nuvem...")

      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products: newProducts }),
      })

      const data = await response.json()

      if (data.success) {
        setProducts(newProducts)
        console.log("✅ Produtos salvos na nuvem")
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("❌ Erro ao salvar produtos:", error)
      alert("Erro ao salvar produtos. Tente novamente.")
    } finally {
      setSaving(false)
    }
  }

  // Carregar produtos ao inicializar
  useEffect(() => {
    loadProducts()
  }, [])

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

  return {
    products,
    loading,
    saving,
    getFeaturedProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    reorderFeaturedProducts,
    refreshProducts: loadProducts,
  }
}
