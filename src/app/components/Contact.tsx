"use client"

import { MapPin, Phone, Clock } from "lucide-react"

export default function Contact() {
  return (
    <section
      id="contato"
      className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 flex items-center py-8"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Venha-nos conhecer</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Estamos disponíveis para o ajudar nas nossas lojas físicas:
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-green-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Lojas */}
        <div className="grid md:grid-cols-2 gap-16 mb-16">
          {/* Loja 1 */}
          <div className="text-left">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-red-100 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Loja 1</h3>
            </div>

            <div className="space-y-4 text-gray-700">
              <div>
                <p>Edf. Estádio, R. Abílio Miranda Loja Q e R</p>
                <p>4560-501</p>
                <p>Penafiel</p>
              </div>

              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-600" />
                <span>255214418</span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <span>Segunda a Sexta: 9h às 19h</span>
                </div>
                <div className="ml-6">
                  <span>Sábado e Domingo: 9h às 13h</span>
                </div>
              </div>
            </div>
          </div>

          {/* Loja 2 */}
          <div className="text-left">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-green-100 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Loja 2</h3>
            </div>

            <div className="space-y-4 text-gray-700">
              <div>
                <p>Avenida São Miguel de Bustelo, 2835</p>
                <p>4560-042 Bustelo PNF</p>
                <p>Penafiel</p>
              </div>

              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-600" />
                <span>255213418</span>
              </div>

              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-600" />
                  <span>Segunda a Sexta: 9h às 19h</span>
                </div>
                <div className="ml-6">
                  <span>Sábado e Domingo: 9h às 13h</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mapa */}
        <div className="bg-gray-200 h-64 rounded-xl flex items-center justify-center shadow-lg">
          <p className="text-gray-500 text-lg">Mapa da localização</p>
        </div>
      </div>
    </section>
  )
}
