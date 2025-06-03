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

        {/* Lojas em Balões */}
        <div className="flex justify-center">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
            {/* Loja 1 - Supermercado */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:scale-105">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-red-100 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Coutyfil - Supermercado</h3>
              </div>

              <div className="space-y-4 text-gray-700">
                <div className="space-y-1">
                  <p className="font-medium">Avenida São Miguel de Bustelo, 2835</p>
                  <p>4560-042 - Bustelo - Penafiel</p>
                  <p>Portugal</p>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Phone className="h-4 w-4 text-red-600" />
                  <span className="font-medium">255720225</span>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-red-600" />
                    <span className="font-medium">Horário de Funcionamento</span>
                  </div>
                  <div className="ml-6 space-y-1 text-sm">
                    <p>Segunda a Sexta: 9h às 19h</p>
                    <p>Sábado e Domingo: 9h às 13h</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Loja 2 - Papelaria */}
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-8 border border-gray-100 hover:scale-105">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-green-100 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Coutyfil - Papelaria</h3>
              </div>

              <div className="space-y-4 text-gray-700">
                <div className="space-y-1">
                  <p className="font-medium">R. Abílio Miranda, Edf. Estádio, Loja Q/R</p>
                  <p>4560-501 Penafiel</p>
                  <p>Portugal</p>
                </div>

                <div className="flex items-center space-x-2 pt-2">
                  <Phone className="h-4 w-4 text-green-600" />
                  <span className="font-medium">255213418</span>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-green-600" />
                    <span className="font-medium">Horário de Funcionamento</span>
                  </div>
                  <div className="ml-6 space-y-1 text-sm">
                    <p>Segunda a Sexta: 9h às 19h</p>
                    <p>Sábado e Domingo: 9h às 13h</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mapa */}
        <div className="mt-16 flex justify-center">
          <div className="bg-gray-200 h-64 rounded-xl flex items-center justify-center shadow-lg max-w-4xl w-full">
            <p className="text-gray-500 text-lg">Mapa da localização</p>
          </div>
        </div>
      </div>
    </section>
  )
}
