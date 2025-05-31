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

  // Referências para controle de polling e proteção contra loops
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isLoadingRef = useRef(false)
  const lastLoadRef = useRef(0)

  // Carregar produtos da nuvem com proteção contra loops
  const loadProducts = useCallback(
    async (silent = false) => {
      // Evitar múltiplas chamadas simultâneas
      if (isLoadingRef.current) {
        return
      }

      // Evitar chamadas muito frequentes (mínimo 2 segundos entre carregamentos)
      const now = Date.now()
      if (now - lastLoadRef.current < 2000) {
        return
      }

      try {
        isLoadingRef.current = true
        lastLoadRef.current = now

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
        isLoadingRef.current = false
      }
    },
    [products.length],
  )

  // Verificar atualizações com proteção
  const checkForUpdates = useCallback(async () => {
    // Não verificar se já está carregando
    if (isLoadingRef.current) {
      return
    }

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

  // Iniciar polling para sincronização com intervalo maior
  useEffect(() => {
    // Polling menos frequente - a cada 30 segundos em vez de 10
    pollingIntervalRef.current = setInterval(() => {
      checkForUpdates()
    }, 30000)

    // Limpar intervalo ao desmontar
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current)
      }
    }
  }, [checkForUpdates])

  // Carregar produtos ao inicializar - apenas uma vez
  useEffect(() => {
    loadProducts()
  }, []) // Array vazio - executa apenas uma vez

  // Sincronizar ao focar na janela com throttling
  useEffect(() => {
    let focusTimeout: NodeJS.Timeout

    const handleFocus = () => {
      // Debounce para evitar múltiplas chamadas
      clearTimeout(focusTimeout)
      focusTimeout = setTimeout(() => {
        checkForUpdates()
      }, 1000)
    }

    window.addEventListener("focus", handleFocus)
    return () => {
      window.removeEventListener("focus", handleFocus)
      clearTimeout(focusTimeout)
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
