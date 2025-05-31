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
  const loadProducts = useCallback(async (silent: boolean = false) => {
    try {
      if (!silent) setLoading(true)
      setError(null)
      console.log("🔄 [HOOK] Carregando produtos da API...")

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
        console.log("✅ [HOOK] Produtos carregados:", data.products?.length || 0)
      } else {
        throw new Error(data.error || "Erro desconhecido")
      }
    } catch (error) {
      console.error("❌ [HOOK] Erro ao carregar produtos:", error)
      setError(error instanceof Error ? error.message : "Erro ao carregar produtos")
      // Em caso de erro, não alterar os produtos existentes
      if (products.length === 0) {
        setProducts([])
      }
    } finally {
      if (!silent) setLoading(false)
    }
  }, [products.length])

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
        console.log("🔄 [SYNC] Detectada atualização remota, recarregando produtos...")
        loadProducts(true) // Carregar silenciosamente
      }
    } catch (error) {
      console.error("❌ [SYNC] Erro ao verificar atualizações:", error)
    }
  }, [lastUpdate, loadProducts])

  // Salvar produtos na nuvem - OTIMIZADO
  const saveProducts = useCallback(
    async (newProducts: Product[]) => {
      try {
        setSaving(true)
        setError(null)
        console.log("💾 [HOOK] Salvando produtos na nuvem...")

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
        console.log("✅ [HOOK] Produtos salvos na nuvem")
      } catch (error) {
        console.error("❌ [HOOK] Erro ao salvar produtos:", error)
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

  // Sincronizar ao focar na janela (quando o usuário volta à aba)
  useEffect(() => {
    const handleFocus = () => {
      console.log("🔄 [SYNC] Janela focada, verificando atualizações...")
      checkForUpdates()
    }

    window.addEventListener('focus', handleFocus)
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [checkForUpdates])

  const getFeaturedProducts = useCallback(() => {
    return products
      .filter((product) => product.featured)
      .sort((a, b) => a.order - b.order)
      .slice(0, 6)
  }, [products])

  // OPERAÇÕES OTIMIZADAS - Atualização local imediata + salvamento em background

  const addProduct = useCallback(
    async (product: Omit<Product, "id">) => {
      const newProduct: Product = {
        ...product,
        id: Date.now().toString(),
      }
      const newProducts = [...products, newProduct]

      // Salvar em background sem bloquear UI
      saveProducts(newProducts)
    },
    [products, saveProducts],
  )

  const updateProduct = useCallback(
    async (id: string, updates: Partial<Product>) => {
      const newProducts = products.map((product) => (product.id === id ? { ...product, ...updates } : product))

      // Salvar em background sem bloquear UI
      saveProducts(newProducts)
    },
    [products, saveProducts],
  )

  const deleteProduct = useCallback(
    async (id: string) => {
      const newProducts = products.filter((product) => product.id !== id)

      // Salvar em background sem bloquear UI
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

      // Salvar em background sem bloquear UI
      saveProducts(newProducts)
    },
    [products, saveProducts],
  )

  // Função para toggle featured otimizada
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
