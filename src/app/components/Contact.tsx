"use client"

import { MapPin, Phone, Clock, Globe, Mail } from "lucide-react"

export default function Contact() {
  return (
    <section
      id="contato"
      className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 flex items-center py-12 sm:py-16"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4">Venha-nos conhecer</h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
            Estamos disponíveis para o ajudar nas nossas lojas físicas:
          </p>
          <div className="w-16 sm:w-24 h-1 bg-gradient-to-r from-red-500 to-green-500 mx-auto mt-3 sm:mt-4 rounded-full"></div>
        </div>

        {/* Lojas em Balões - Ajustado para mobile */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 w-full max-w-7xl">
            {/* Loja 1 - Supermercado */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-7 sm:p-10 border border-gray-100 hover:scale-105">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="bg-red-100 p-2 sm:p-3 rounded-full">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">Coutyfil - Supermercado</h3>
              </div>

              <div className="space-y-3 sm:space-y-4 text-gray-700">
                <div className="space-y-1">
                  <a href="https://maps.app.goo.gl/9NywXPgtkRrrm4Lj8" target="_blank">
                  <p className="font-medium">Avenida São Miguel de Bustelo, 2835</p>
                  <p>4560-042 - Bustelo - Penafiel</p>
                  <p>Portugal</p>
                  </a>
                </div>

                <div className="flex flex-col pt-1 sm:pt-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-red-600" />
                    <a href="tel:255720225" className="font-medium">255720225</a>
                  </div>
                  <span className="text-xs text-gray-500 ml-6">(Chamada para rede fixa nacional)</span>
                </div>

                <div className="space-y-1 sm:space-y-2 pt-1 sm:pt-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-red-600" />
                    <span className="font-medium">Horário de Funcionamento</span>
                  </div>
                  <div className="ml-6 space-y-1 text-xs sm:text-sm">
                    <p>Segunda a Sábado: </p>
                    <p>9h às 12:30h e das 14:30h às 19h</p>
                    <p>Domingos: Encerrados</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Loja 2 - Papelaria */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-7 sm:p-10 border border-gray-100 hover:scale-105">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="bg-green-100 p-2 sm:p-3 rounded-full">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">Coutyfil - Papelaria</h3>
              </div>

              <div className="space-y-3 sm:space-y-4 text-gray-700">
                <div className="space-y-1">
                <a href="https://maps.app.goo.gl/D92pvzPqkWcGMqzw9" target="_blank">
                  <p className="font-medium">R. Abílio Miranda, Edf. Estádio, Loja Q/R</p>
                  <p>4560-501 Penafiel</p>
                  <p>Portugal</p>
                </a>
                </div>

                <div className="flex flex-col pt-1 sm:pt-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-green-600" />
                    <a href="tel:255213418" className="font-medium">255213418</a>
                  </div>
                  <span className="text-xs text-gray-500 ml-6">(Chamada para rede fixa nacional)</span>
                </div>

                <div className="space-y-1 sm:space-y-2 pt-1 sm:pt-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Horário de Funcionamento</span>
                  </div>
                  <div className="ml-6 space-y-1 text-xs sm:text-sm">
                    <p>Segunda a Sexta: 9h às 19h</p>
                    <p>Sábado e Domingo: 9h às 13h</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Loja 3 - Online */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-7 sm:p-10 border border-gray-100 hover:scale-105">
              <div className="flex items-center space-x-3 mb-4 sm:mb-6">
                <div className="bg-red-100 p-2 sm:p-3 rounded-full">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">Coutyfil - On-Line</h3>
              </div>

              <div className="space-y-3 sm:space-y-4 text-gray-700">
                <div className="space-y-1">
                  <p className="font-medium">Espaço destinado a venda</p>
                  <p className="font-medium">exclusiva de <span style={{ textDecorationLine: 'underline' }}>Alimentação Sem Gluten</span></p>
                  <p></p>
                </div>

                <div className="space-y-2 pt-1 sm:pt-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-green-600" />
                    <a
                      href="https://wa.me/351910146031"
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium hover:underline"
                    >
                      Whatsapp: 910146031
                    </a>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-blue-600" />
                    <a
                      href="https://www.coutyfil.pt"
                      target="_blank"
                      rel="noreferrer"
                      className="font-medium hover:underline"
                    >
                      www.coutyfil.pt
                    </a>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-gray-600" />
                    <a href="mailto:info@coutyfil.pt" className="font-medium hover:underline">
                      info@coutyfil.pt
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
