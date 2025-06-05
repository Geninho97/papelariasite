// Sistema de cache local inteligente
interface CacheData {
  data: any
  timestamp: number
  version: string
  checksum?: string
}

interface CacheConfig {
  maxAge: number // em milissegundos
  key: string
  version: string
}

class LocalCache {
  private static instance: LocalCache
  private readonly CACHE_PREFIX = "coutyfil_"

  static getInstance(): LocalCache {
    if (!LocalCache.instance) {
      LocalCache.instance = new LocalCache()
    }
    return LocalCache.instance
  }

  // Verificar se o cache é válido
  private isCacheValid(cacheData: CacheData, maxAge: number): boolean {
    const now = Date.now()
    const age = now - cacheData.timestamp
    return age < maxAge && cacheData.version === this.getCurrentVersion()
  }

  // Gerar checksum simples para detectar mudanças
  private generateChecksum(data: any): string {
    return btoa(JSON.stringify(data)).slice(0, 16)
  }

  // Versão atual (pode ser baseada em build ou timestamp)
  private getCurrentVersion(): string {
    return process.env.NEXT_PUBLIC_APP_VERSION || "1.0.0"
  }

  // Salvar no cache
  set(config: CacheConfig, data: any): void {
    try {
      const cacheData: CacheData = {
        data,
        timestamp: Date.now(),
        version: config.version,
        checksum: this.generateChecksum(data),
      }

      localStorage.setItem(`${this.CACHE_PREFIX}${config.key}`, JSON.stringify(cacheData))

      console.log(`✅ [CACHE] Dados salvos: ${config.key}`)
    } catch (error) {
      console.warn(`⚠️ [CACHE] Erro ao salvar ${config.key}:`, error)
      // Se localStorage estiver cheio, limpar cache antigo
      this.clearOldCache()
    }
  }

  // Recuperar do cache
  get(config: CacheConfig): any | null {
    try {
      const cached = localStorage.getItem(`${this.CACHE_PREFIX}${config.key}`)

      if (!cached) {
        console.log(`📭 [CACHE] Cache vazio: ${config.key}`)
        return null
      }

      const cacheData: CacheData = JSON.parse(cached)

      if (!this.isCacheValid(cacheData, config.maxAge)) {
        console.log(`⏰ [CACHE] Cache expirado: ${config.key}`)
        this.remove(config.key)
        return null
      }

      console.log(`✅ [CACHE] Cache válido: ${config.key}`)
      return cacheData.data
    } catch (error) {
      console.warn(`⚠️ [CACHE] Erro ao ler ${config.key}:`, error)
      this.remove(config.key)
      return null
    }
  }

  // Verificar se precisa atualizar
  async needsUpdate(config: CacheConfig, remoteChecksum: string): Promise<boolean> {
    const cached = this.get(config)

    if (!cached) return true

    try {
      const cachedData = localStorage.getItem(`${this.CACHE_PREFIX}${config.key}`)
      if (!cachedData) return true

      const cacheData: CacheData = JSON.parse(cachedData)
      return cacheData.checksum !== remoteChecksum
    } catch {
      return true
    }
  }

  // Remover item específico
  remove(key: string): void {
    localStorage.removeItem(`${this.CACHE_PREFIX}${key}`)
    console.log(`🗑️ [CACHE] Removido: ${key}`)
  }

  // Limpar cache antigo (mais de 7 dias)
  clearOldCache(): void {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)

      if (key?.startsWith(this.CACHE_PREFIX)) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || "{}")
          if (data.timestamp < sevenDaysAgo) {
            localStorage.removeItem(key)
            console.log(`🧹 [CACHE] Cache antigo removido: ${key}`)
          }
        } catch {
          localStorage.removeItem(key)
        }
      }
    }
  }

  // Limpar todo o cache
  clearAll(): void {
    const keys = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(this.CACHE_PREFIX)) {
        keys.push(key)
      }
    }

    keys.forEach((key) => localStorage.removeItem(key))
    console.log(`🧹 [CACHE] Todo cache limpo (${keys.length} itens)`)
  }

  // Obter estatísticas do cache
  getStats(): { totalItems: number; totalSize: number; items: string[] } {
    let totalSize = 0
    const items: string[] = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(this.CACHE_PREFIX)) {
        const value = localStorage.getItem(key)
        if (value) {
          totalSize += value.length
          items.push(key.replace(this.CACHE_PREFIX, ""))
        }
      }
    }

    return {
      totalItems: items.length,
      totalSize: Math.round(totalSize / 1024), // KB
      items,
    }
  }
}

export const localCache = LocalCache.getInstance()

// Configurações de cache para diferentes tipos de dados
export const CACHE_CONFIGS = {
  PRODUCTS: {
    key: "products",
    maxAge: 30 * 60 * 1000, // 30 minutos
    version: "1.0.0",
  },
  WEEKLY_PDFS: {
    key: "weekly_pdfs",
    maxAge: 60 * 60 * 1000, // 1 hora
    version: "1.0.0",
  },
  PRODUCT_IMAGES: {
    key: "product_images",
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    version: "1.0.0",
  },
} as const
