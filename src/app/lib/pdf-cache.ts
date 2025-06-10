// Sistema de cache específico para PDFs com duração de 24 horas - VERSÃO CORRIGIDA
interface PdfCacheData {
  url: string
  name: string
  timestamp: number
  size: number
  expiresAt: number
}

class PdfCache {
  private static instance: PdfCache
  private readonly CACHE_PREFIX = "coutyfil_pdf_"
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 horas
  private readonly MAX_CACHE_SIZE = 50 * 1024 * 1024 // 50MB máximo
  private logTimestamps: Record<string, number> = {}

  static getInstance(): PdfCache {
    if (!PdfCache.instance) {
      PdfCache.instance = new PdfCache()
    }
    return PdfCache.instance
  }

  // Verificar se estamos no navegador
  private isClient(): boolean {
    return typeof window !== "undefined" && typeof localStorage !== "undefined"
  }

  // Gerar chave única para o PDF
  private generateKey(url: string): string {
    // Usar uma chave mais simples e confiável
    const cleanUrl = url.replace(/[^a-zA-Z0-9]/g, "_")
    return `${this.CACHE_PREFIX}${cleanUrl.slice(0, 32)}`
  }

  // Verificar se o cache é válido
  private isValidCache(data: PdfCacheData): boolean {
    return Date.now() < data.expiresAt
  }

  // Log controlado para evitar spam
  private logWithThrottle(key: string, message: string, minInterval = 5000): void {
    const now = Date.now()
    const lastLog = this.logTimestamps[key] || 0

    if (now - lastLog >= minInterval) {
      console.log(message)
      this.logTimestamps[key] = now
    }
  }

  // Gerar URL do proxy para contornar CORS
  getProxyUrl(originalUrl: string): string {
    const encodedUrl = encodeURIComponent(originalUrl)
    return `/api/pdf-proxy?url=${encodedUrl}`
  }

  // Armazenar PDF no cache (versão simplificada)
  async cachePdf(url: string, name: string): Promise<string | null> {
    if (!this.isClient()) {
      this.logWithThrottle("no-client", "📄 [PDF-CACHE] Não está no cliente, usando proxy direto")
      return this.getProxyUrl(url)
    }

    try {
      this.logWithThrottle("cache-init", `📄 [PDF-CACHE] Iniciando cache do PDF: ${name}`)

      // Verificar se já está em cache e é válido
      const cached = this.getCachedPdf(url)
      if (cached) {
        this.logWithThrottle("cache-hit", `✅ [PDF-CACHE] PDF já em cache: ${name}`)
        return cached
      }

      // Usar proxy para contornar CORS
      const proxyUrl = this.getProxyUrl(url)
      this.logWithThrottle("proxy-use", `🔄 [PDF-CACHE] Usando proxy: ${proxyUrl}`)

      // Tentar baixar o PDF através do proxy
      const response = await fetch(proxyUrl, {
        method: "GET",
        headers: {
          Accept: "application/pdf",
        },
      })

      if (!response.ok) {
        throw new Error(`Erro ao baixar PDF via proxy: ${response.status}`)
      }

      const blob = await response.blob()
      const sizeInMB = (blob.size / (1024 * 1024)).toFixed(2)

      this.logWithThrottle("download-complete", `📦 [PDF-CACHE] PDF baixado: ${sizeInMB}MB`)

      // Verificar se o PDF não é muito grande para cache
      if (blob.size > 10 * 1024 * 1024) {
        // 10MB
        this.logWithThrottle(
          "too-large",
          `⚠️ [PDF-CACHE] PDF muito grande para cache (${sizeInMB}MB), usando proxy direto`,
        )
        return proxyUrl
      }

      // Limpar cache antigo se necessário
      this.clearOldCache()

      // Criar URL do blob para uso imediato
      const blobUrl = URL.createObjectURL(blob)

      // Salvar metadados no localStorage (sem o blob, apenas referência)
      const cacheData: PdfCacheData = {
        url,
        name,
        timestamp: Date.now(),
        size: blob.size,
        expiresAt: Date.now() + this.CACHE_DURATION,
      }

      const key = this.generateKey(url)
      localStorage.setItem(key, JSON.stringify(cacheData))

      this.logWithThrottle("cache-store", `✅ [PDF-CACHE] PDF cacheado por 24h: ${name} (${sizeInMB}MB)`)

      return blobUrl
    } catch (error) {
      console.error(`❌ [PDF-CACHE] Erro ao cachear PDF:`, error)

      // Fallback: usar o proxy diretamente
      const proxyUrl = this.getProxyUrl(url)
      this.logWithThrottle("fallback", `🔄 [PDF-CACHE] Usando fallback com proxy: ${proxyUrl}`)
      return proxyUrl
    }
  }

  // Recuperar PDF do cache (versão simplificada)
  getCachedPdf(url: string): string | null {
    if (!this.isClient()) return null

    try {
      const key = this.generateKey(url)
      const cached = localStorage.getItem(key)

      if (!cached) {
        return null
      }

      const cacheData: PdfCacheData = JSON.parse(cached)

      if (!this.isValidCache(cacheData)) {
        this.logWithThrottle("cache-expired", `⏰ [PDF-CACHE] Cache expirado, removendo...`)
        localStorage.removeItem(key)
        return null
      }

      // Para PDFs em cache, sempre usar o proxy (mais confiável)
      const proxyUrl = this.getProxyUrl(url)

      const ageHours = Math.round((Date.now() - cacheData.timestamp) / (60 * 60 * 1000))
      this.logWithThrottle("cache-hit", `✅ [PDF-CACHE] PDF encontrado no cache (${ageHours}h), usando proxy`)

      return proxyUrl
    } catch (error) {
      console.error(`❌ [PDF-CACHE] Erro ao recuperar PDF do cache:`, error)
      return null
    }
  }

  // Verificar se PDF está em cache
  isPdfCached(url: string): boolean {
    if (!this.isClient()) return false

    const key = this.generateKey(url)
    const cached = localStorage.getItem(key)

    if (!cached) return false

    try {
      const cacheData: PdfCacheData = JSON.parse(cached)
      return this.isValidCache(cacheData)
    } catch {
      return false
    }
  }

  // Limpar cache antigo
  private clearOldCache(): void {
    if (!this.isClient()) return

    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(this.CACHE_PREFIX)) {
        keys.push(key)
      }
    }

    // Remover entradas expiradas
    for (const key of keys) {
      try {
        const cached = localStorage.getItem(key)
        if (cached) {
          const cacheData: PdfCacheData = JSON.parse(cached)
          if (!this.isValidCache(cacheData)) {
            localStorage.removeItem(key)
            this.logWithThrottle("cleanup", `🗑️ [PDF-CACHE] Cache expirado removido: ${key}`)
          }
        }
      } catch {
        // Remover entradas corrompidas
        localStorage.removeItem(key)
      }
    }
  }

  // Obter informações do cache
  getCacheInfo(): {
    totalPdfs: number
    totalSize: string
    pdfs: Array<{
      name: string
      size: string
      age: string
      expiresIn: string
    }>
  } {
    if (!this.isClient()) {
      return { totalPdfs: 0, totalSize: "0MB", pdfs: [] }
    }

    const pdfs: Array<{
      name: string
      size: string
      age: string
      expiresIn: string
    }> = []

    let totalSize = 0

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(this.CACHE_PREFIX)) {
        try {
          const cached = localStorage.getItem(key)
          if (cached) {
            const cacheData: PdfCacheData = JSON.parse(cached)

            if (this.isValidCache(cacheData)) {
              const age = Date.now() - cacheData.timestamp
              const expiresIn = cacheData.expiresAt - Date.now()

              pdfs.push({
                name: cacheData.name,
                size: `${(cacheData.size / (1024 * 1024)).toFixed(2)}MB`,
                age: `${Math.round(age / (60 * 60 * 1000))}h`,
                expiresIn: `${Math.round(expiresIn / (60 * 60 * 1000))}h`,
              })

              totalSize += cacheData.size
            }
          }
        } catch {
          // Ignorar entradas corrompidas
        }
      }
    }

    return {
      totalPdfs: pdfs.length,
      totalSize: `${(totalSize / (1024 * 1024)).toFixed(2)}MB`,
      pdfs,
    }
  }

  // Limpar todo o cache de PDFs
  clearAllCache(): void {
    if (!this.isClient()) return

    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(this.CACHE_PREFIX)) {
        keys.push(key)
      }
    }

    keys.forEach((key) => localStorage.removeItem(key))
    console.log(`🧹 [PDF-CACHE] ${keys.length} PDFs removidos do cache`)
  }

  // Pré-carregar PDF em background
  async preloadPdf(url: string, name: string): Promise<void> {
    if (this.isPdfCached(url)) {
      this.logWithThrottle("preload-skip", `⚡ [PDF-CACHE] PDF já em cache: ${name}`)
      return
    }

    this.logWithThrottle("preload", `🚀 [PDF-CACHE] Pré-carregando PDF: ${name}`)
    await this.cachePdf(url, name)
  }
}

export const pdfCache = PdfCache.getInstance()

// Hook para usar o cache de PDF
export function usePdfCache() {
  return {
    cachePdf: pdfCache.cachePdf.bind(pdfCache),
    getCachedPdf: pdfCache.getCachedPdf.bind(pdfCache),
    isPdfCached: pdfCache.isPdfCached.bind(pdfCache),
    getCacheInfo: pdfCache.getCacheInfo.bind(pdfCache),
    clearAllCache: pdfCache.clearAllCache.bind(pdfCache),
    preloadPdf: pdfCache.preloadPdf.bind(pdfCache),
    getProxyUrl: pdfCache.getProxyUrl.bind(pdfCache),
  }
}
