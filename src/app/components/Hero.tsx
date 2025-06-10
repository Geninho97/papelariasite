"use client"

import { Star, ChevronDown, FileText } from "lucide-react"
import { useWeeklyPdfs } from "@/app/hooks/useWeeklyPdfs"
import { usePdfCache } from "@/app/lib/pdf-cache"
import { useEffect, useState, useRef } from "react"

export default function Hero() {
  const { latestPdf, loading } = useWeeklyPdfs()
  const { getCachedPdf, cachePdf, isPdfCached, getProxyUrl } = usePdfCache()
  const [isMobile, setIsMobile] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [cachedPdfUrl, setCachedPdfUrl] = useState<string | null>(null)
  const [isCaching, setIsCaching] = useState(false)
  const logTimestamps = useRef<Record<string, number>>({})

  // Função para controlar logs repetitivos
  const logWithThrottle = (key: string, message: string, minInterval = 5000) => {
    const now = Date.now()
    const lastLog = logTimestamps.current[key] || 0

    if (now - lastLog >= minInterval) {
      console.log(message)
      logTimestamps.current[key] = now
    }
  }

  // Detectar tamanho da tela para ajustes responsivos
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Controlar quando o conteúdo está pronto para ser mostrado
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setIsReady(true)
      }, 100)

      return () => clearTimeout(timer)
    } else {
      setIsReady(false)
    }
  }, [loading])

  // Gerenciar cache do PDF
  useEffect(() => {
    if (latestPdf && isReady) {
      const handlePdfCache = async () => {
        try {
          // Verificar se já está em cache
          const cached = getCachedPdf(latestPdf.url)

          if (cached) {
            logWithThrottle("hero-cache-hit", `⚡ [HERO] Usando PDF do cache de 24h`)
            setCachedPdfUrl(cached)
          } else {
            logWithThrottle("hero-cache-miss", `📄 [HERO] PDF não está em cache, iniciando download...`)
            setIsCaching(true)

            // Cachear o PDF
            const cachedUrl = await cachePdf(latestPdf.url, latestPdf.name)

            if (cachedUrl) {
              logWithThrottle("hero-cache-success", `✅ [HERO] PDF cacheado com sucesso por 24h`)
              setCachedPdfUrl(cachedUrl)
            } else {
              logWithThrottle("hero-cache-fail", `⚠️ [HERO] Falha no cache, usando proxy direto`)
              const proxyUrl = getProxyUrl(latestPdf.url)
              setCachedPdfUrl(proxyUrl)
            }

            setIsCaching(false)
          }
        } catch (error) {
          console.error(`❌ [HERO] Erro no cache do PDF:`, error)
          // Fallback para proxy
          const proxyUrl = getProxyUrl(latestPdf.url)
          setCachedPdfUrl(proxyUrl)
          setIsCaching(false)
        }
      }

      handlePdfCache()
    }
  }, [latestPdf, isReady, getCachedPdf, cachePdf, getProxyUrl])

  // URL do PDF para usar (cache, proxy ou original)
  const pdfUrlToUse = cachedPdfUrl || latestPdf?.url

  return (
    <section
      id="inicio"
      className="min-h-screen bg-gradient-to-br from-red-100 via-pink-50 via-green-100 to-yellow-50 relative overflow-hidden flex items-center"
    >
      {/* Animated background elements - reduzidos em mobile */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20">
        <div className="absolute top-20 left-10 w-20 md:w-40 h-20 md:h-40 bg-gradient-to-r from-red-400 to-pink-400 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-16 md:w-32 h-16 md:h-32 bg-gradient-to-r from-green-400 to-lime-400 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute top-1/3 right-1/4 w-12 md:w-24 h-12 md:h-24 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/3 left-1/4 w-14 md:w-28 h-14 md:h-28 bg-gradient-to-r from-red-300 to-rose-300 rounded-full blur-xl animate-bounce delay-500"></div>
      </div>

      {/* Moving gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-200/30 via-transparent via-green-200/30 to-yellow-200/30 animate-pulse"></div>

      <div className="container mx-auto px-4 relative py-16 md:py-0">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 md:space-y-8 text-center md:text-left">
            {loading || !isReady ? (
              // Loading state - mostrar skeleton ou loading
              <div className="space-y-6 md:space-y-8">
                <div className="space-y-4">
                  <div className="h-12 sm:h-16 md:h-20 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="h-8 sm:h-10 bg-gray-200 rounded-lg animate-pulse w-3/4"></div>
                </div>
                <div className="space-y-3">
                  <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-5/6"></div>
                </div>
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-5 w-5 sm:h-6 sm:w-6 bg-gray-200 rounded animate-pulse"></div>
                    ))}
                  </div>
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-48"></div>
                </div>
              </div>
            ) : latestPdf ? (
              <>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight flex flex-col">
                  <span>Descubra os destaques</span>
                  <span>
                    no nosso{" "}
                    <span className="text-red-600 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent animate-pulse">
                      folheto!
                    </span>
                  </span>
                </h1>

                <div className="text-xl sm:text-2xl text-gray-700 leading-relaxed">
                  Já está disponível o nosso novo folheto !
                </div>
                <div className="text-xl sm:text-2xl text-gray-700 leading-relaxed">
                  Repleto de produtos incríveis, com preços imperdíveis e descontos especiais só por tempo limitado.
                </div>
              </>
            ) : (
              <>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight flex flex-col">
                  <span>Não perca, já na próxima semana</span>
                  <span>
                    estará disponível o nosso{" "}
                    <span className="text-red-600 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent animate-pulse">
                      folheto!
                    </span>
                  </span>
                </h1>

                <div className="text-xl sm:text-2xl text-gray-700 leading-relaxed">
                  Prepare-se para ofertas incríveis, descontos especiais e muitas surpresas!
                </div>
                <div className="text-xl sm:text-2xl text-gray-700 leading-relaxed">Fique atento e não perca!</div>
              </>
            )}

            {isReady && (
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <div className="flex text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 sm:h-6 sm:w-6 fill-current animate-pulse"
                      style={{ animationDelay: `${i * 200}ms` }}
                    />
                  ))}
                </div>
                <span className="text-gray-700 font-medium text-base sm:text-lg">
                  Mais de 1000 clientes satisfeitos
                </span>
              </div>
            )}
          </div>

          {/* PDF Preview - Tablet Style - Ajustado para mobile */}
          <div className="relative flex justify-center mt-8 md:mt-0">
            {loading || !isReady ? (
              <div className="w-full max-w-[460px] h-[400px] sm:h-[500px] md:h-[600px] flex items-center justify-center bg-gray-100 rounded-2xl border-8 border-gray-300 shadow-2xl">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                  <div className="text-gray-600">Carregando catálogo semanal...</div>
                </div>
              </div>
            ) : latestPdf ? (
              <div className="relative w-full max-w-[460px]">
                {/* Header flutuante separado */}
                <div className="bg-gradient-to-r from-red-500 to-green-500 text-white p-2 sm:p-3 rounded-xl mb-4 shadow-lg relative z-20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                      <div>
                        <h3 className="font-bold text-sm sm:text-base line-clamp-1">{latestPdf.name}</h3>
                        <div className="flex items-center space-x-2">
                          {/* Badge de proxy */}
                          {cachedPdfUrl && cachedPdfUrl.includes("/api/pdf-proxy") && (
                            <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                              🚀 PROXY
                            </span>
                          )}
                          {/* Badge de novo */}
                          {new Date(latestPdf.uploadDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                              NOVO!
                            </span>
                          )}
                          {/* Badge de carregamento */}
                          {isCaching && (
                            <span className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                              📥 CACHEANDO...
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <a
                      href={pdfUrlToUse}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/20 hover:bg-white/30 px-2 py-1 sm:px-3 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm font-medium"
                    >
                      Abrir PDF
                    </a>
                  </div>
                </div>

                {/* Tablet Container - Ajustado para mobile */}
                <div className="relative">
                  {/* Tablet Frame */}
                  <div
                    className="bg-gradient-to-b from-gray-200 to-gray-400 rounded-3xl p-3 sm:p-6 shadow-2xl border-2 border-gray-300 mx-auto"
                    style={{
                      width: "100%",
                      maxWidth: "460px",
                      height: isMobile ? "400px" : "600px",
                    }}
                  >
                    {/* Tablet Screen */}
                    <div className="bg-black rounded-2xl p-1 h-full w-full relative overflow-hidden">
                      {/* PDF Container */}
                      <a
                        href={pdfUrlToUse}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block relative group h-full w-full"
                      >
                        {/* PDF Display Area */}
                        <div className="relative bg-white rounded-xl shadow-lg h-full w-full overflow-hidden">
                          {/* PDF Object com permissões explícitas */}
                          <iframe
                            src={`${pdfUrlToUse}#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&zoom=page-fit`}
                            allow="fullscreen"
                            className="w-full h-full pdf-no-scrollbar"
                              style={{
                            overflow: "hidden",
                            pointerEvents: "none",
                            border: "none",
                            outline: "none",
                            }}
                            >
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <div className="text-gray-600 text-sm">
                                Seu navegador não suporta visualização de PDF.
                              </div>
                            </div>
                          </iframe>


                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center rounded-xl">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/95 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-lg">
                              <div className="flex items-center space-x-2 text-gray-800 font-medium text-xs sm:text-sm">
                                <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span>
                                  {cachedPdfUrl &&
                                  cachedPdfUrl !== latestPdf.url &&
                                  !cachedPdfUrl.includes("/api/pdf-proxy")
                                    ? "PDF em cache - Carregamento instantâneo!"
                                    : cachedPdfUrl && cachedPdfUrl.includes("/api/pdf-proxy")
                                      ? "PDF via proxy - Sem problemas de CORS!"
                                      : "Clique para abrir PDF completo"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>

                    {/* Tablet Home Button */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 sm:w-12 h-1 bg-gray-600 rounded-full"></div>
                  </div>

                  {/* Tablet Shadow/Stand Effect */}
                  <div className="absolute -bottom-4 -right-4 w-full h-full bg-gray-400/30 rounded-3xl -z-10 blur-sm"></div>
                  <div className="absolute -bottom-6 -right-6 w-full h-full bg-gray-500/20 rounded-3xl -z-20 blur-md"></div>
                </div>
              </div>
            ) : (
              <div className="relative w-full max-w-[460px]">
                {/* Header flutuante para "Em breve" */}
                <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white p-2 sm:p-3 rounded-xl mb-4 shadow-lg relative z-20">
                  <div className="flex items-center justify-center">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <FileText className="h-4 w-4 sm:h-5 sm:w-5" />
                      <div>
                        <h3 className="font-bold text-sm sm:text-base">Folheto em Preparação</h3>
                        <span className="bg-orange-600 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                          EM BREVE!
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tablet Container */}
                <div className="relative">
                  {/* Tablet Frame */}
                  <div
                    className="bg-gradient-to-b from-gray-200 to-gray-400 rounded-3xl p-3 sm:p-6 shadow-2xl border-2 border-gray-300 mx-auto"
                    style={{
                      width: "100%",
                      maxWidth: "460px",
                      height: isMobile ? "400px" : "600px",
                    }}
                  >
                    {/* Tablet Screen */}
                    <div className="bg-black rounded-2xl p-1 h-full w-full relative overflow-hidden">
                      {/* Imagem de Espera */}
                      <div className="relative bg-white rounded-xl shadow-lg h-full w-full overflow-hidden flex items-center justify-center">
                        <img
                          src="/images/wait.png"
                          alt="Aguarde o próximo folheto"
                          className="w-full h-full object-contain p-4"
                          onError={(e) => {
                            // Fallback se a imagem não carregar
                            const target = e.currentTarget
                            const parent = target.parentElement
                            if (parent) {
                              target.style.display = "none"
                              parent.innerHTML = `
                                <div class="text-center p-8">
                                  <div class="text-6xl mb-4">⏰</div>
                                  <h3 class="text-xl font-bold text-gray-800 mb-2">Em Breve</h3>
                                  <p class="text-gray-600">Novo folheto chegando!</p>
                                </div>
                              `
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Tablet Home Button */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 sm:w-12 h-1 bg-gray-600 rounded-full"></div>
                  </div>

                  {/* Tablet Shadow/Stand Effect */}
                  <div className="absolute -bottom-4 -right-4 w-full h-full bg-gray-400/30 rounded-3xl -z-10 blur-sm"></div>
                  <div className="absolute -bottom-6 -right-6 w-full h-full bg-gray-500/20 rounded-3xl -z-20 blur-md"></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600" />
      </div>

      {/* CSS para esconder scrollbar no Chrome/Safari/WebKit */}
      <style jsx>{`
        .pdf-no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .pdf-no-scrollbar::-webkit-scrollbar-track {
          display: none;
        }
        .pdf-no-scrollbar::-webkit-scrollbar-thumb {
          display: none;
        }
      `}</style>
    </section>
  )
}
