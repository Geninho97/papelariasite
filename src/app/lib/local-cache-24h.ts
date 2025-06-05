// Sistema de cache local otimizado para 24 horas
interface CacheData {
  data: any
  timestamp: number
  version: string
  checksum?: string
  lastCheck?: number // Última vez que verificou mudanças
}

interface CacheConfig {
  maxAge: number // Tempo máximo de vida do cache
  freshTime: number // Tempo considerado "fresco" (não verifica mudanças)
  key: string
  version: string
}

class LocalCache24H {
  private static instance: LocalCache24H
  private readonly CACHE_PREFIX = "coutyfil_24h_"

  static getInstance(): LocalCache24H {
    if (!LocalCache24H.instance) {
      LocalCache24H.instance = new LocalCache24H()
    }
    return LocalCache24H.instance
  }

  // Verificar se o cache é válido
  private isCacheValid(cacheData: CacheData, maxAge: number): boolean {
    const now = Date.now()
    const age = now - cacheData.timestamp
    return age < maxAge && cacheData.version === this.getCurrentVersion()
  }

  // Verificar se o cache é "fresco" (não precisa verificar mudanças)
  private isCacheFresh(cacheData: CacheData, freshTime: number): boolean {
    const now = Date.now()
    const lastCheck = cacheData.lastCheck || cacheData.timestamp
    const timeSinceCheck = now - lastCheck
    return timeSinceCheck < freshTime
  }

  // Gerar checksum para detectar mudanças
  private generateChecksum(data: any): string {
    return btoa(JSON.stringify(data)).slice(0, 16)
  }

  // Versão atual
  private getCurrentVersion(): string {
    return process.env.NEXT_PUBLIC_APP_VERSION || "2.0.0"
  }

  // Salvar no cache
  set(config: CacheConfig, data: any): void {
    try {
      const cacheData: CacheData = {
        data,
        timestamp: Date.now(),
        version: config.version,
        checksum: this.generateChecksum(data),
        lastCheck: Date.now(),
      }

      localStorage.setItem(`${this.CACHE_PREFIX}${config.key}`, JSON.stringify(cacheData))

      console.log(
        `✅ [CACHE-24H] Dados salvos: ${config.key} (válido por ${Math.round(config.maxAge / (60 * 60 * 1000))}h)`,
      )
    } catch (error) {
      console.warn(`⚠️ [CACHE-24H] Erro ao salvar ${config.key}:`, error)
      this.clearOldCache()
    }
  }

  // Recuperar do cache
  get(config: CacheConfig): { data: any; needsCheck: boolean } | null {
    try {
      const cached = localStorage.getItem(`${this.CACHE_PREFIX}${config.key}`)

      if (!cached) {
        console.log(`📭 [CACHE-24H] Cache vazio: ${config.key}`)
        return null
      }

      const cacheData: CacheData = JSON.parse(cached)

      if (!this.isCacheValid(cacheData, config.maxAge)) {
        console.log(`⏰ [CACHE-24H] Cache expirado: ${config.key}`)
        this.remove(config.key)
        return null
      }

      const isFresh = this.isCacheFresh(cacheData, config.freshTime)
      const age = Math.round((Date.now() - cacheData.timestamp) / (60 * 60 * 1000))

      console.log(
        `✅ [CACHE-24H] Cache válido: ${config.key} (idade: ${age}h, ${isFresh ? "fresco" : "precisa verificar"})`,
      )

      return {
        data: cacheData.data,
        needsCheck: !isFresh,
      }
    } catch (error) {
      console.warn(`⚠️ [CACHE-24H] Erro ao ler ${config.key}:`, error)
      this.remove(config.key)
      return null
    }
  }

  // Atualizar timestamp da última verificação
  updateLastCheck(key: string): void {
    try {
      const cached = localStorage.getItem(`${this.CACHE_PREFIX}${key}`)
      if (cached) {
        const cacheData: CacheData = JSON.parse(cached)
        cacheData.lastCheck = Date.now()
        localStorage.setItem(`${this.CACHE_PREFIX}${key}`, JSON.stringify(cacheData))
        console.log(`🔄 [CACHE-24H] Última verificação atualizada: ${key}`)
      }
    } catch (error) {
      console.warn(`⚠️ [CACHE-24H] Erro ao atualizar verificação ${key}:`, error)
    }
  }

  // Verificar se precisa atualizar baseado no checksum
  async needsUpdate(config: CacheConfig, remoteChecksum: string): Promise<boolean> {
    try {
      const cached = localStorage.getItem(`${this.CACHE_PREFIX}${config.key}`)
      if (!cached) return true

      const cacheData: CacheData = JSON.parse(cached)
      const needsUpdate = cacheData.checksum !== remoteChecksum

      if (needsUpdate) {
        console.log(`🔄 [CACHE-24H] Mudanças detectadas em ${config.key}`)
      } else {
        console.log(`✅ [CACHE-24H] Nenhuma mudança em ${config.key}`)
      }

      return needsUpdate
    } catch {
      return true
    }
  }

  // Remover item específico
  remove(key: string): void {
    localStorage.removeItem(`${this.CACHE_PREFIX}${key}`)
    console.log(`🗑️ [CACHE-24H] Removido: ${key}`)
  }

  // Limpar cache antigo (mais de 30 dias)
  clearOldCache(): void {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)

      if (key?.startsWith(this.CACHE_PREFIX)) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || "{}")
          if (data.timestamp < thirtyDaysAgo) {
            localStorage.removeItem(key)
            console.log(`🧹 [CACHE-24H] Cache antigo removido: ${key}`)
          }
        } catch {
          localStorage.removeItem(key)
        }
      }
    }
  }

  // Obter estatísticas detalhadas
  getDetailedStats(): {
    totalItems: number
    totalSize: number
    items: Array<{
      key: string
      age: string
      size: string
      isFresh: boolean
      isValid: boolean
    }>
  } {
    let totalSize = 0
    const items: Array<{
      key: string
      age: string
      size: string
      isFresh: boolean
      isValid: boolean
    }> = []

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(this.CACHE_PREFIX)) {
        const value = localStorage.getItem(key)
        if (value) {
          try {
            const data = JSON.parse(value)
            const age = Date.now() - data.timestamp
            const ageHours = Math.round(age / (60 * 60 * 1000))
            const sizeMB = (value.length / (1024 * 1024)).toFixed(2)

            totalSize += value.length
            items.push({
              key: key.replace(this.CACHE_PREFIX, ""),
              age: ageHours > 24 ? `${Math.round(ageHours / 24)}d` : `${ageHours}h`,
              size: `${sizeMB}MB`,
              isFresh: age < 6 * 60 * 60 * 1000, // 6 horas
              isValid: age < 24 * 60 * 60 * 1000, // 24 horas
            })
          } catch {
            items.push({
              key: key.replace(this.CACHE_PREFIX, ""),
              age: "erro",
              size: "erro",
              isFresh: false,
              isValid: false,
            })
          }
        }
      }
    }

    return {
      totalItems: items.length,
      totalSize: Math.round(totalSize / (1024 * 1024)), // MB
      items,
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
    console.log(`🧹 [CACHE-24H] Todo cache limpo (${keys.length} itens)`)
  }
}

export const localCache24H = LocalCache24H.getInstance()

// Configurações de cache para 24 horas
export const CACHE_CONFIGS_24H = {
  PRODUCTS: {
    key: "products",
    maxAge: 24 * 60 * 60 * 1000, // 24 horas
    freshTime: 6 * 60 * 60 * 1000, // 6 horas (verifica 4x por dia)
    version: "2.0.0",
  },
  WEEKLY_PDFS: {
    key: "weekly_pdfs",
    maxAge: 48 * 60 * 60 * 1000, // 48 horas
    freshTime: 12 * 60 * 60 * 1000, // 12 horas (verifica 2x por dia)
    version: "2.0.0",
  },
  PRODUCT_IMAGES: {
    key: "product_images",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 dias
    freshTime: 7 * 24 * 60 * 60 * 1000, // 7 dias (verifica 1x por semana)
    version: "2.0.0",
  },
} as const
