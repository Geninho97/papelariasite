// Sistema de cache específico para PDFs com duração de 24 horas
interface PdfCacheData {
  url: string
  blob: Blob
  timestamp: number
  name: string
  size: number
}

interface PdfCacheEntry {
  data: PdfCacheData
  expiresAt: number
}

class PdfCache {
  private static instance: PdfCache
  private readonly CACHE_PREFIX = "coutyfil_pdf_"
  private readonly CACHE_DURATION = 24 * 60 * 60 * 1000 // 24 horas
  private readonly MAX_CACHE_SIZE = 50 * 1024 * 1024 // 50MB máximo

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
    return `${this.CACHE_PREFIX}${btoa(url).slice(0, 32)}`
  }

  // Verificar se o cache é válido
  private isValidCache(entry: PdfCacheEntry): boolean {
    return Date.now() < entry.expiresAt
  }

  // Obter tamanho total do cache
  private getCacheSize(): number {
    if (!this.isClient()) return 0

    let totalSize = 0
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(this.CACHE_PREFIX)) {
        const value = localStorage.getItem(key)
        if (value) {
          totalSize += value.length
        }
      }
    }
    return totalSize
  }

  // Limpar cache antigo para fazer espaço
  private clearOldCache(): void {
    if (!this.isClient()) return

    const keys: string[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(this.CACHE_PREFIX)) {
        keys.push(key)
      }
    }

    // Ordenar por timestamp (mais antigo primeiro)
    keys.sort((a, b) => {
      try {
        const entryA = JSON.parse(localStorage.getItem(a) || "{}")
        const entryB = JSON.parse(localStorage.getItem(b) || "{}")
        return entryA.data?.timestamp - entryB.data?.timestamp
      } catch {
        return 0
      }
    })

    // Remover até ter espaço suficiente
    for (const key of keys) {
      if (this.getCacheSize() < this.MAX_CACHE_SIZE * 0.8) break
      localStorage.removeItem(key)
      console.log(`🗑️ [PDF-CACHE] Cache antigo removido: ${key}`)
    }
  }

  // Converter Blob para Base64 para armazenamento
  private async blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  // Converter Base64 de volta para Blob
  private base64ToBlob(base64: string): Blob {
    const [header, data] = base64.split(",")
    const mimeType = header.match(/:(.*?);/)?.[1] || "application/pdf"
    const byteCharacters = atob(data)
    const byteNumbers = new Array(byteCharacters.length)

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    return new Blob([byteArray], { type: mimeType })
  }

  // Gerar URL do proxy para contornar CORS
  private getProxyUrl(originalUrl: string): string {
    const encodedUrl = encodeURIComponent(originalUrl)
    return `/api/pdf-proxy?url=${encodedUrl}`
  }

  // Armazenar PDF no cache
  async cachePdf(url: string, name: string): Promise<string | null> {
    if (!this.isClient()) return null

    try {
      console.log(`📄 [PDF-CACHE] Iniciando cache do PDF: ${name}`)

      // Verificar se já está em cache e é válido
      const cached = this.getCachedPdf(url)
      if (cached) {
        console.log(`✅ [PDF-CACHE] PDF já em cache: ${name}`)
        return cached
      }

      // Usar proxy para contornar CORS
      const proxyUrl = this.getProxyUrl(url)
      console.log(`🔄 [PDF-CACHE] Usando proxy para buscar PDF: ${proxyUrl}`)

      // Baixar o PDF através do proxy
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

      console.log(`📦 [PDF-CACHE] PDF baixado via proxy: ${sizeInMB}MB`)

      // Verificar se há espaço suficiente
      if (this.getCacheSize() + blob.size > this.MAX_CACHE_SIZE) {
        console.log(`🧹 [PDF-CACHE] Limpando cache antigo...`)
        this.clearOldCache()
      }

      // Converter para base64 para armazenamento
      const base64 = await this.blobToBase64(blob)

      const cacheEntry: PdfCacheEntry = {
        data: {
          url,
          blob: blob, // Não armazenamos o blob diretamente, apenas para referência
          timestamp: Date.now(),
          name,
          size: blob.size,
        },
        expiresAt: Date.now() + this.CACHE_DURATION,
      }

      // Armazenar no localStorage (sem o blob, apenas metadados + base64)
      const storageData = {
        ...cacheEntry,
        base64Data: base64,
      }

      const key = this.generateKey(url)
      localStorage.setItem(key, JSON.stringify(storageData))

      // Criar URL do blob para uso imediato
      const blobUrl = URL.createObjectURL(blob)

      console.log(`✅ [PDF-CACHE] PDF armazenado em cache por 24h: ${name} (${sizeInMB}MB)`)

      return blobUrl
    } catch (error) {
      console.error(`❌ [PDF-CACHE] Erro ao cachear PDF:`, error)

      // Fallback: tentar usar o proxy diretamente
      try {
        const proxyUrl = this.getProxyUrl(url)
        console.log(`🔄 [PDF-CACHE] Tentando fallback com proxy: ${proxyUrl}`)
        return proxyUrl
      } catch (fallbackError) {
        console.error(`❌ [PDF-CACHE] Fallback também falhou:`, fallbackError)
        return null
      }
    }
  }

  // Recuperar PDF do cache
  getCachedPdf(url: string): string | null {
    if (!this.isClient()) return null

    try {
      const key = this.generateKey(url)
      const cached = localStorage.getItem(key)

      if (!cached) {
        console.log(`📭 [PDF-CACHE] PDF não encontrado no cache`)
        return null
      }

      const entry = JSON.parse(cached)

      if (!this.isValidCache(entry)) {
        console.log(`⏰ [PDF-CACHE] Cache expirado, removendo...`)
        localStorage.removeItem(key)
        return null
      }

      // Converter base64 de volta para blob
      const blob = this.base64ToBlob(entry.base64Data)
      const blobUrl = URL.createObjectURL(blob)

      const ageHours = Math.round((Date.now() - entry.data.timestamp) / (60 * 60 * 1000))
      const sizeInMB = (entry.data.size / (1024 * 1024)).toFixed(2)

      console.log(`✅ [PDF-CACHE] PDF recuperado do cache: ${entry.data.name} (${sizeInMB}MB, ${ageHours}h de idade)`)

      return blobUrl
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
      const entry = JSON.parse(cached)
      return this.isValidCache(entry)
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

    let totalSize = 0

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith(this.CACHE_PREFIX)) {
        try {
          const entry = JSON.parse(localStorage.getItem(key) || "{}")
          if (entry.data) {
            const age = Date.now() - entry.data.timestamp
            const expiresIn = entry.expiresAt - Date.now()

            pdfs.push({
              name: entry.data.name,
              size: `${(entry.data.size / (1024 * 1024)).toFixed(2)}MB`,
              age: `${Math.round(age / (60 * 60 * 1000))}h`,
              expiresIn: `${Math.round(expiresIn / (60 * 60 * 1000))}h`,
            })

            totalSize += entry.data.size
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
      console.log(`⚡ [PDF-CACHE] PDF já em cache, não é necessário pré-carregar: ${name}`)
      return
    }

    console.log(`🚀 [PDF-CACHE] Pré-carregando PDF em background: ${name}`)
    await this.cachePdf(url, name)
  }

  // Obter URL do proxy para uso direto (quando cache falha)
  getProxyUrlForDirect(url: string): string {
    return this.getProxyUrl(url)
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
    getProxyUrl: pdfCache.getProxyUrlForDirect.bind(pdfCache),
  }
}
