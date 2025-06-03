"use client"

import { Star, ChevronDown, FileText, Calendar } from "lucide-react"
import { useWeeklyPdfs } from "@/app/hooks/useWeeklyPdfs"

export default function Hero() {
  const { latestPdf, loading } = useWeeklyPdfs()

  return (
    <section
      id="inicio"
      className="min-h-screen bg-gradient-to-br from-red-100 via-pink-50 via-green-100 to-yellow-50 relative overflow-hidden flex items-center"
    >
      {/* Animated background elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-red-400 to-pink-400 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-green-400 to-lime-400 rounded-full blur-2xl animate-bounce"></div>
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/3 left-1/4 w-28 h-28 bg-gradient-to-r from-red-300 to-rose-300 rounded-full blur-xl animate-bounce delay-500"></div>
      </div>

      {/* Moving gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-200/30 via-transparent via-green-200/30 to-yellow-200/30 animate-pulse"></div>

      <div className="container mx-auto px-4 relative">
        <div className="grid md:grid-cols-2 gap-12 items-center min-h-[80vh]">
          {/* Content */}
          <div className="space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-800 leading-tight">
              Tudo para seu
              <span className="text-red-600 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent animate-pulse">
                {" "}
                escritório
              </span>{" "}
              e
              <span className="text-green-600 bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent animate-pulse">
                {" "}
                escola
              </span>
            </h1>

            <p className="text-2xl text-gray-700 leading-relaxed">
              Na Papelaria você encontra os melhores produtos para escritório, escola e casa com preços imbatíveis e
              atendimento de qualidade excepcional.
            </p>
            <div className="flex items-center space-x-2">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-6 w-6 fill-current animate-pulse"
                    style={{ animationDelay: `${i * 200}ms` }}
                  />
                ))}
              </div>
              <span className="text-gray-700 font-medium text-lg">Mais de 1000 clientes satisfeitos</span>
            </div>
          </div>

          {/* PDF Preview */}
          <div className="relative flex justify-center">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-6 border border-gray-200 hover:shadow-3xl transition-all duration-500">
              {loading ? (
                <div className="h-[600px] w-[424px] flex items-center justify-center bg-gray-100 rounded-2xl">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando catálogo semanal...</p>
                  </div>
                </div>
              ) : latestPdf ? (
                <div className="space-y-0">
                  {/* PDF Container com header sobreposto */}
                  <a href={latestPdf.url} target="_blank" rel="noopener noreferrer" className="block relative group">
                    {/* Container principal do PDF */}
                    <div
                      className="relative bg-white rounded-lg shadow-lg overflow-hidden border border-gray-300"
                      style={{ width: "424px", height: "600px" }}
                    >
                      {/* PDF Object */}
                      <object
                        data={`${latestPdf.url}#page=1&view=FitH&toolbar=0`}
                        type="application/pdf"
                        className="w-full h-full"
                        style={{
                          overflow: "hidden",
                          pointerEvents: "none",
                        }}
                      >
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <p className="text-gray-600">Seu navegador não suporta visualização de PDF.</p>
                        </div>
                      </object>

                      {/* Overlay para esconder a barra de rolagem direita */}
                      <div className="absolute top-0 right-0 bottom-0 w-4 bg-white" style={{ zIndex: 10 }}></div>

                      {/* Header personalizado que cobre a barra do PDF */}
                      <div
                        className="absolute top-0 left-0 right-0 bg-gradient-to-r from-red-500 to-green-500 text-white p-3 rounded-t-lg"
                        style={{ zIndex: 20 }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <FileText className="h-5 w-5" />
                            <div>
                              <h3 className="font-bold text-base">{latestPdf.name}</h3>
                              <div className="flex items-center space-x-2 text-sm opacity-90">
                                <Calendar className="h-4 w-4" />
                                <span>
                                  Semana {latestPdf.week}/{latestPdf.year}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div
                            className="bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                            onClick={(e) => {
                              e.preventDefault()
                              window.open(latestPdf.url, "_blank")
                            }}
                          >
                            Abrir PDF
                          </div>
                        </div>
                      </div>

                      {/* Hover overlay */}
                      <div
                        className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center"
                        style={{ zIndex: 15 }}
                      >
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                          <div className="flex items-center space-x-2 text-gray-800 font-medium text-sm">
                            <FileText className="h-4 w-4" />
                            <span>Clique para abrir PDF completo</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* A4 Paper Effect */}
                    <div className="absolute -bottom-1 -right-1 w-full h-full bg-gray-200 rounded-lg -z-10"></div>
                    <div className="absolute -bottom-2 -right-2 w-full h-full bg-gray-300 rounded-lg -z-20"></div>
                  </a>
                </div>
              ) : (
                <div className="h-[600px] w-[424px] flex items-center justify-center bg-gray-100 rounded-2xl">
                  <div className="text-center">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Nenhum catálogo disponível</h3>
                    <p className="text-gray-600">O catálogo semanal será carregado em breve</p>
                  </div>
                </div>
              )}
            </div>

            {/* Additional floating element */}
            <div className="absolute top-1/2 -left-8 bg-gradient-to-r from-red-400 to-pink-400 text-white px-6 py-3 rounded-full font-semibold shadow-lg transform -rotate-45 animate-pulse delay-700">
              Novo!
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-8 w-8 text-gray-600" />
      </div>
    </section>
  )
}
