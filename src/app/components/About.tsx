"use client"

import { ChevronDown } from "lucide-react"

export default function About() {
  return (
    <section
      id="sobre"
      className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50 flex items-center relative pt-20"
    >
      <div className="container mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-20">
          {/* Content */}
          <div className="space-y-10">
            <div>
              <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-8">Sobre a Papelaria</h2>
              <div className="w-32 h-2 bg-gradient-to-r from-red-500 to-green-500 mb-8 rounded-full"></div>
              <p className="text-2xl text-gray-600 leading-relaxed mb-8">
                Há mais de 10 anos no mercado, nossa papelaria é referência em material escolar, produtos para
                escritório e suprimentos para a sua casa. Nossa missão é oferecer produtos de qualidade com preços
                justos e atendimento excepcional.
              </p>
              <p className="text-xl text-gray-600 leading-relaxed">
                Trabalhamos com as melhores marcas do mercado e mantemos um stock sempre atualizado para atender a todas
                as suas necessidades, seja para uso pessoal, escolar ou em casa.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-8">
              <div className="text-center bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="text-5xl font-bold text-red-600 mb-3">10+</div>
                <div className="text-gray-600 font-semibold text-lg">Anos de Experiência</div>
              </div>
              <div className="text-center bg-white p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <div className="text-5xl font-bold text-green-600 mb-3">1000+</div>
                <div className="text-gray-600 font-semibold text-lg">Clientes Satisfeitos</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <img
              src="/images/loja.png?height=600&width=700"
              alt="Nossa loja"
              className="w-full h-[500px] object-cover rounded-3xl shadow-3xl border-4 border-white transform hover:scale-105 transition-all duration-500"
            />
            <div className="absolute -bottom-8 -right-8 bg-gradient-to-r from-red-500 to-green-500 text-white p-6 rounded-2xl shadow-2xl transform hover:scale-110 transition-all duration-300">
              <p className="font-bold text-xl">Visite a nossa loja!</p>
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
