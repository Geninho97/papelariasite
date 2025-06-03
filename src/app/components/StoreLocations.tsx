"use client"

import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function StoreLocations() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Venha-nos conhecer</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Estamos disponíveis para o ajudar nas nossas lojas físicas:
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-green-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Lojas */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Loja 1 */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Loja 1</h3>
            </div>
            <div className="space-y-3 pl-12">
              <p className="text-gray-700">
                Edf. Estádio, R. Abílio Miranda Loja Q e R
                <br />
                4560-501
                <br />
                Penafiel
              </p>
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span>255214418</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Segunda a Sexta: 9h às 19h</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 pl-6">
                <span>Sábado e Domingo: 9h às 13h</span>
              </div>
            </div>
          </div>

          {/* Loja 2 */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <MapPin className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800">Loja 2</h3>
            </div>
            <div className="space-y-3 pl-12">
              <p className="text-gray-700">
                Avenida São Miguel de Bustelo, 2835
                <br />
                4560-042 Bustelo PNF
                <br />
                Penafiel
              </p>
              <div className="flex items-center space-x-2 text-gray-600">
                <Phone className="h-4 w-4" />
                <span>255213418</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Segunda a Sexta: 9h às 19h</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 pl-6">
                <span>Sábado e Domingo: 9h às 13h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mapa */}
        <div className="mt-12 bg-gray-100 rounded-xl p-8 text-center h-64 flex items-center justify-center">
          <p className="text-gray-500 text-lg">Mapa da localização</p>
        </div>

        {/* Contato adicional */}
        <div className="mt-12 grid md:grid-cols-2 gap-8">
          {/* Email */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <Mail className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">E-mail</h3>
            </div>
            <div className="space-y-2 pl-12">
              <p className="text-gray-700">papelaria@coutyfil.pt</p>
              <p className="text-gray-700">geral@coutyfil.pt</p>
            </div>
          </div>

          {/* Horário */}
          <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Horário de Funcionamento</h3>
            </div>
            <div className="space-y-2 pl-12">
              <p className="text-gray-700">Segunda a Sexta: 9h às 19h</p>
              <p className="text-gray-700">Sábado: 9h às 13h</p>
              <p className="text-gray-700">Domingo: 9h às 13h</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
