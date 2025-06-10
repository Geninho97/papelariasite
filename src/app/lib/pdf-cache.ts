// Sistema de cache específico para PDFs - VERSÃO OTIMIZADA
interface PdfCacheData {
  url: string
  name: string
  timestamp: number
  expiresAt: number
}

class PdfCache {
  private static instance: PdfCache
  private readonly CACHE_PREFIX = "pdf_"
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 horas

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
    const cleanUrl = url.replace(/[^a-zA-Z0-9]/g, "_")
    return `${this.CACHE_PREFIX}${cleanUrl.slice(0, 32)}`
  }

  // Verificar se o cache é válido
  private isValidCache(data: PdfCacheData): boolean {
    return Date.now() < data.expiresAt
  }

  // Gerar URL do proxy para contornar CORS
  getProxyUrl(originalUrl: string): string {
    const encodedUrl = encodeURIComponent(originalUrl)
    return `/api/pdf-proxy?url=${encodedUrl}`
  }

  // Armazenar PDF no cache (versão simplificada)
  async cachePdf(url: string, name: string): Promise<string | null> {
    if (!this.isClient()) {
      return this.getProxyUrl(url)
    }

    try {
      // Verificar se já está em cache
      const cached = this.getCachedPdf(url)
      if (cached) {
        return cached
      }

      // Sempre usar proxy para melhor compatibilidade
      const proxyUrl = this.getProxyUrl(url)

      // Salvar metadados no localStorage
      const cacheData: PdfCacheData = {
        url,
        name,
        timestamp: Date.now(),
        expiresAt: Date.now() + this.CACHE_DURATION,
      }

      const key = this.generateKey(url)
      localStorage.setItem(key, JSON.stringify(cacheData))

      return proxyUrl
    } catch (error) {
      console.error("Erro ao cachear PDF:", error)
      return this.getProxyUrl(url)
    }
  }

  // Recuperar PDF do cache
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
        localStorage.removeItem(key)
        return null
      }

      // Sempre retornar proxy URL
      return this.getProxyUrl(url)
    } catch (error) {
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
                size: "Proxy",
                age: `${Math.round(age / (60 * 60 * 1000))}h`,
                expiresIn: `${Math.round(expiresIn / (60 * 60 * 1000))}h`,
              })
            }
          }
        } catch {
          // Ignorar entradas corrompidas
        }
      }
    }

    return {
      totalPdfs: pdfs.length,
      totalSize: "Cache Proxy",
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
    console.log(`Cache de PDFs limpo (${keys.length} itens)`)
  }
}

export const pdfCache = PdfCache.getInstance()

// Hook simplificado para usar o cache de PDF
export function usePdfCache() {
  return {
    cachePdf: pdfCache.cachePdf.bind(pdfCache),
    getCachedPdf: pdfCache.getCachedPdf.bind(pdfCache),
    isPdfCached: pdfCache.isPdfCached.bind(pdfCache),
    getCacheInfo: pdfCache.getCacheInfo.bind(pdfCache),
    clearAllCache: pdfCache.clearAllCache.bind(pdfCache),
    getProxyUrl: pdfCache.getProxyUrl.bind(pdfCache),
  }
}
