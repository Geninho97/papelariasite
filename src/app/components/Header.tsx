"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-primary-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <a href="/#inicio" className="transition-transform duration-300 hover:scale-110">
              <img src="/images/logo.png" alt="Papelaria Coutyfil Logo" className="h-12 w-auto" />
            </a>
          </div>

          {/* Desktop Navigation - removido "Início" */}
          <nav className="hidden md:flex space-x-8">
            <a href="/#novidades" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Novidades
            </a>
            <a href="/produtos" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Produtos
            </a>
            <a href="/#sobre" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Sobre Nós
            </a>
            <a href="/#contato" className="text-gray-700 hover:text-primary-600 transition-colors font-medium">
              Contato
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center">
            <button className="md:hidden" onClick={toggleMenu} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-6 w-6 text-gray-600" /> : <Menu className="h-6 w-6 text-gray-600" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - removido "Início" */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-primary-100 pt-4">
            <div className="flex flex-col space-y-4">
              <a
                href="/#novidades"
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Novidades
              </a>
              <a
                href="/produtos"
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Produtos
              </a>
              <a
                href="/#sobre"
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre Nós
              </a>
              <a
                href="/#contato"
                className="text-gray-700 hover:text-primary-600 transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Contato
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}
