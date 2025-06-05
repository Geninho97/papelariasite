"use client"

import { Star, ChevronDown, FileText } from "lucide-react"
import { useWeeklyPdfs } from "@/app/hooks/useWeeklyPdfs"
import { useEffect, useState } from "react"

export default function Hero() {
  const { latestPdf, loading } = useWeeklyPdfs()
  const [isMobile, setIsMobile] = useState(false)

  // Detectar tamanho da tela para ajustes responsivos
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Verificar no carregamento inicial
    checkMobile()

    // Adicionar listener para redimensionamento
    window.addEventListener("resize", checkMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

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
              Já está disponível o nosso folheto quinzenal! 🌟
            </div>
            <div className="text-xl sm:text-2xl text-gray-700 leading-relaxed">
              Repleto de produtos incríveis, com preços imperdíveis e descontos especiais só por tempo limitado.
            </div>
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
              <span className="text-gray-700 font-medium text-base sm:text-lg">Mais de 1000 clientes satisfeitos</span>
            </div>
          </div>

          {/* PDF Preview - Tablet Style - Ajustado para mobile */}
          <div className="relative flex justify-center mt-8 md:mt-0">
            {loading ? (
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
                        {/* Verificar se o PDF é recente (últimos 7 dias) */}
                        {new Date(latestPdf.uploadDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) && (
                          <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                            NOVO!
                          </span>
                        )}
                      </div>
                    </div>
                    <a
                      href={latestPdf.url}
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
                        href={latestPdf.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block relative group h-full w-full"
                      >
                        {/* PDF Display Area */}
                        <div className="relative bg-white rounded-xl shadow-lg h-full w-full overflow-hidden">
                          {/* PDF Object */}
                          <object
                            data={`${latestPdf.url}#page=1&view=FitH&toolbar=0&navpanes=0&scrollbar=0&statusbar=0&messages=0&zoom=page-fit`}
                            type="application/pdf"
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
                          </object>

                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center rounded-xl">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/95 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-lg">
                              <div className="flex items-center space-x-2 text-gray-800 font-medium text-xs sm:text-sm">
                                <FileText className="h-3 w-3 sm:h-4 sm:w-4" />
                                <span>Clique para abrir PDF completo</span>
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
              <div className="w-full max-w-[460px] h-[400px] sm:h-[500px] md:h-[600px] flex items-center justify-center bg-gray-100 rounded-2xl border-8 border-gray-300 shadow-2xl">
                <div className="text-center px-4">
                  <FileText className="h-12 w-12 sm:h-16 sm:w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2">Nenhum catálogo disponível</h3>
                  <div className="text-gray-600 text-sm sm:text-base">O catálogo semanal será carregado em breve</div>
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
