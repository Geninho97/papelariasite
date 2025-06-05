"use client"

import { ChevronDown } from "lucide-react"

export default function About() {
  return (
    <section
      id="sobre"
      className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 flex items-center relative pt-16 sm:pt-20"
    >
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-20 items-center mb-12 sm:mb-16 md:mb-20">
          {/* Content */}
          <div className="space-y-6 sm:space-y-8 lg:space-y-10">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 sm:mb-6 lg:mb-8">
                Quem Somos ?
              </h2>
              <div className="w-24 sm:w-32 h-1.5 sm:h-2 bg-gradient-to-r from-red-500 to-green-500 mb-4 sm:mb-6 lg:mb-8 rounded-full"></div>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed mb-4 sm:mb-6 lg:mb-8">
                A Coutyfil é uma empresa familiar, sediada em Penafiel e dedicada à venda ao retalho desde 1964. Ao
                longo dos mais de 60 anos mantemos o nosso compromisso, o nosso profissionalismo e a nossa vontade em
                ser a melhor alternativa no comércio tradicional de forma a garantir a satisfação dos nossos clientes
                baseada numa relação de proximidade e confiança.
              </p>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed">
                Procuramos diariamente estabelecer as melhores parcerias com os mais diversos fornecedores para que de
                uma forma rápida e segura possamos ir ao encontro dos gostos e necessidades dos clientes. Cada cliente
                merece o nosso melhor e é com esse foco que continuamos presentes.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              <div className="text-center bg-white p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-red-600 mb-2 sm:mb-3">10+</div>
                <div className="text-gray-600 font-semibold text-sm sm:text-base lg:text-lg">Anos de Experiência</div>
              </div>
              <div className="text-center bg-white p-4 sm:p-6 lg:p-8 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-green-600 mb-2 sm:mb-3">1000+</div>
                <div className="text-gray-600 font-semibold text-sm sm:text-base lg:text-lg">Clientes Satisfeitos</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative mt-6 lg:mt-0">
            <img
              src="/images/loja.png?height=600&width=700"
              alt="Nossa loja"
              className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-3xl border-4 border-white transform hover:scale-105 transition-all duration-500"
            />
            <div className="absolute -bottom-4 sm:-bottom-6 lg:-bottom-8 -right-4 sm:-right-6 lg:-right-8 bg-gradient-to-r from-red-500 to-green-500 text-white p-3 sm:p-4 lg:p-6 rounded-xl sm:rounded-2xl shadow-xl sm:shadow-2xl transform hover:scale-110 transition-all duration-300">
              <p className="font-bold text-base sm:text-lg lg:text-xl">Visite as nossas lojas!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-6 w-6 sm:h-8 sm:w-8 text-gray-600" />
      </div>
    </section>
  )
}
