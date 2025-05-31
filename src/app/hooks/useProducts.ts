"use client"

import { useState, useEffect, useCallback, useRef } from "react"

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

  // Referência para o intervalo de polling
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Carregar produtos da nuvem
  const loadProducts = useCallback(
    async (silent = false) => {
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
    },
    [products.length],
  )

  // Verificar atualizações
  const checkForUpdates = useCallback(async () => {
    try {
      const response = await fetch("/api/products/last-modified", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (!response.ok) return

      const data = await response.json()

      // Se o timestamp do servidor for mais recente que nosso último update, recarregar
      if (data.lastModified && data.lastModified > lastUpdate) {
        loadProducts(true) // Carregar silenciosamente
      }
    } catch (error) {
      // Silencioso - não mostrar erro de sincronização
    }
  }, [lastUpdate, loadProducts])

  // Salvar produtos na nuvem
  const saveProducts = useCallback(
    async (newProducts: Product[]) => {
      try {
        setSaving(true)
        setError(null)

        // ATUALIZAÇÃO OTIMISTA: Atualizar UI imediatamente
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
          // Se falhou, reverter para o estado anterior
          await loadProducts()
          throw new Error(data.error || "Erro ao salvar")
        }

        // Atualizar timestamp após salvamento bem-sucedido
        setLastUpdate(Date.now())
      } catch (error) {
        setError(error instanceof Error ? error.message : "Erro ao salvar produtos")
      } finally {
        setSaving(false)
      }
    },
    [loadProducts],
  )

  // Iniciar polling para sincronização
  useEffect(() => {
    // Iniciar polling para verificar atualizações a cada 10 segundos
    pollingIntervalRef.current = setInterval(() => {
      checkForUpdates()
    }, 10000)

    // Limpar intervalo ao desmontar
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [checkForUpdates])

  // Carregar produtos ao inicializar
  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  // Sincronizar ao focar na janela
  useEffect(() => {
    const handleFocus = () => {
      checkForUpdates()
    }

    window.addEventListener("focus", handleFocus)
    return () => {
      window.removeEventListener("focus", handleFocus)
    }
  }, [checkForUpdates])

  const getFeaturedProducts = useCallback(() => {
    return products
      .filter((product) => product.featured)
      .sort((a, b) => a.order - b.order)
      .slice(0, 6)
  }, [products])

  // OPERAÇÕES OTIMIZADAS
  const addProduct = useCallback(
    async (product: Omit<Product, "id">) => {
      const newProduct: Product = {
        ...product,
        id: Date.now().toString(),
      }
      const newProducts = [...products, newProduct]
      saveProducts(newProducts)
    },
    [products, saveProducts],
  )

  const updateProduct = useCallback(
    async (id: string, updates: Partial<Product>) => {
      const newProducts = products.map((product) => (product.id === id ? { ...product, ...updates } : product))
      saveProducts(newProducts)
    },
    [products, saveProducts],
  )

  const deleteProduct = useCallback(
    async (id: string) => {
      const newProducts = products.filter((product) => product.id !== id)
      saveProducts(newProducts)
    },
    [products, saveProducts],
  )

  const reorderFeaturedProducts = useCallback(
    async (productIds: string[]) => {
      const newProducts = products.map((product) => {
        const newOrder = productIds.indexOf(product.id)
        return {
          ...product,
          featured: newOrder !== -1,
          order: newOrder !== -1 ? newOrder + 1 : product.order,
        }
      })
      saveProducts(newProducts)
    },
    [products, saveProducts],
  )

  const toggleFeatured = useCallback(
    async (productId: string) => {
      const product = products.find((p) => p.id === productId)
      if (!product) return

      const featuredProducts = getFeaturedProducts()

      if (product.featured) {
        // Remover dos destaques
        await updateProduct(productId, { featured: false })
      } else {
        // Adicionar aos destaques (se houver espaço)
        if (featuredProducts.length < 6) {
          const maxOrder = Math.max(...featuredProducts.map((p) => p.order), 0)
          await updateProduct(productId, { featured: true, order: maxOrder + 1 })
        } else {
          throw new Error("Máximo de 6 produtos em destaque permitidos")
        }
      }
    },
    [products, getFeaturedProducts, updateProduct],
  )

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
