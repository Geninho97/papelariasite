"use client"

import { MapPin, Phone, Mail, Clock } from "lucide-react"

export default function Contact() {
  return (
    <section
      id="contato"
      className="min-h-screen bg-gradient-to-br from-red-50 via-white to-green-50 flex items-center py-8"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header - Compacto */}
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Entre em Contato</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Estamos aqui para ajudar! Entre em contato conosco através dos canais abaixo ou visite nossa loja física.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-green-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Contact Info */}
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-left">Informações de Contato</h3>

          {/* Grid 2x2 para as informações - Compacto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {/* Endereço */}
            <div className="flex items-start space-x-4 bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-red-100 p-3 rounded-xl">
                <MapPin className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-1 text-lg">Endereço</h4>
                <p className="text-gray-600 text-base">
                  Edf. Estádio, R. Abílio Miranda Loja Q e R
                  <br />
                  4560-501
                  <br />
                  Penafiel
                </p>
              </div>
            </div>

            {/* Telefone */}
            <div className="flex items-start space-x-4 bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-green-100 p-3 rounded-xl">
                <Phone className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-1 text-lg">Telefone</h4>
                <p className="text-gray-600 text-base">
                  255214418
                  <br />
                </p>
              </div>
            </div>

            {/* E-mail */}
            <div className="flex items-start space-x-4 bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-red-100 p-3 rounded-xl">
                <Mail className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-1 text-lg">E-mail</h4>
                <p className="text-gray-600 text-base">
                  papelaria@coutyfil.pt
                  <br />
                  geral@coutyfil.pt
                </p>
              </div>
            </div>

            {/* Horário */}
            <div className="flex items-start space-x-4 bg-white p-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="bg-green-100 p-3 rounded-xl">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-1 text-lg">Horário de Funcionamento</h4>
                <p className="text-gray-600 text-base">
                  Segunda a Sexta: 9h às 19h
                  <br />
                  Sábado: 9h às 13h
                  <br />
                  Domingo: 9h às 13h
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Map - Menor */}
        <div className="bg-gray-200 h-60 rounded-xl flex items-center justify-center shadow-lg">
          <p className="text-gray-500 text-lg">Mapa da localização</p>
        </div>
      </div>
    </section>
  )
}
