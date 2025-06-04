"use client"

import { Star, ChevronDown, FileText } from "lucide-react"
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-bold text-gray-800 leading-tight flex flex-col responsive-title">
              <span>Descubra as melhores</span>
              <span>
                <span className="text-red-600 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent animate-pulse">
                  promoções
                </span>{" "}
                da{" "}
                <span className="text-green-600 bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent animate-pulse">
                  semana!
                </span>
              </span>
            </h1>

            <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 leading-relaxed responsive-subtitle">
              O nosso folheto quinzenal já está disponível! 🌟
            </p>
            <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 leading-relaxed responsive-subtitle">
              Repleto de produtos incríveis, com preços imperdíveis e descontos especiais só por tempo limitado.
            </p>
            <div className="flex items-center space-x-2">
              <div className="flex text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-6 w-6 lg:h-8 lg:w-8 fill-current animate-pulse"
                    style={{ animationDelay: `${i * 200}ms` }}
                  />
                ))}
              </div>
              <span className="text-gray-700 font-medium text-lg md:text-xl lg:text-2xl responsive-text">
                Mais de 1000 clientes satisfeitos
              </span>
            </div>
          </div>

          {/* PDF Preview - Tablet Style */}
          <div className="relative flex justify-center">
            {loading ? (
              <div className="w-[320px] h-[480px] md:w-[400px] md:h-[600px] lg:w-[460px] lg:h-[650px] xl:w-[520px] xl:h-[700px] flex items-center justify-center bg-gray-100 rounded-2xl border-8 border-gray-300 shadow-2xl">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Carregando catálogo semanal...</p>
                </div>
              </div>
            ) : latestPdf ? (
              <div className="relative">
                {/* Header flutuante separado */}
                <div className="bg-gradient-to-r from-red-500 to-green-500 text-white p-3 rounded-xl mb-4 shadow-lg relative z-20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="h-5 w-5" />
                      <div>
                        <h3 className="font-bold text-base">{latestPdf.name}</h3>
                      </div>
                    </div>
                    <a
                      href={latestPdf.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/20 hover:bg-white/30 px-3 py-2 rounded-lg transition-colors text-sm font-medium"
                    >
                      Abrir PDF
                    </a>
                  </div>
                </div>

                {/* Tablet Container */}
                <div className="relative">
                  {/* Tablet Frame */}
                  <div
                    className="bg-gradient-to-b from-gray-200 to-gray-400 rounded-3xl p-6 shadow-2xl border-2 border-gray-300"
                    style={{
                      width: "clamp(320px, 40vw, 520px)",
                      height: "clamp(480px, 60vw, 700px)",
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
                              msOverflowStyle: "none" /* IE e Edge */,
                              scrollbarWidth: "none" /* Firefox */,
                            }}
                          >
                            <div className="w-full h-full flex items-center justify-center bg-gray-100">
                              <p className="text-gray-600">Seu navegador não suporta visualização de PDF.</p>
                            </div>
                          </object>

                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center rounded-xl">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                              <div className="flex items-center space-x-2 text-gray-800 font-medium text-sm">
                                <FileText className="h-4 w-4" />
                                <span>Clique para abrir PDF completo</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </a>
                    </div>

                    {/* Tablet Home Button */}
                    <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-600 rounded-full"></div>
                  </div>

                  {/* Tablet Shadow/Stand Effect */}
                  <div className="absolute -bottom-4 -right-4 w-full h-full bg-gray-400/30 rounded-3xl -z-10 blur-sm"></div>
                  <div className="absolute -bottom-6 -right-6 w-full h-full bg-gray-500/20 rounded-3xl -z-20 blur-md"></div>
                </div>
              </div>
            ) : (
              <div className="w-[320px] h-[480px] md:w-[400px] md:h-[600px] lg:w-[460px] lg:h-[650px] xl:w-[520px] xl:h-[700px] flex items-center justify-center bg-gray-100 rounded-2xl border-8 border-gray-300 shadow-2xl">
                <div className="text-center">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Nenhum catálogo disponível</h3>
                  <p className="text-gray-600">O catálogo semanal será carregado em breve</p>
                </div>
              </div>
            )}

            {/* Additional floating element */}
            <div className="absolute top-1/2 left-10 bg-gradient-to-r from-red-400 to-pink-400 text-white px-6 py-3 rounded-full font-semibold shadow-lg transform -rotate-45 animate-pulse delay-700">
              Novo!
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-8 w-8 text-gray-600" />
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
