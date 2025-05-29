"use client"

import { useState, useEffect } from "react"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  featured: boolean
  order: number
}

const defaultProducts: Product[] = [
  {
    id: "1",
    name: "Puzzle 3D",
    description: "Cria figuras de diferentes animais marinhos com puzzles 3D!",
    price: 45.9,
    image: "/images/3d.jpg",
    category: "Brinquedos",
    featured: true,
    order: 1,
  },
  {
    id: "2",
    name: "X-Ato Colorido",
    description: "X-ato colorido para cortes precisos!",
    price: 32.5,
    image: "/images/xato.jpg",
    category: "Escritório",
    featured: true,
    order: 2,
  },
  {
    id: "3",
    name: "Canetas com Glitter",
    description: "Canetas com Glitter coloridas de alta qualidade!",
    price: 18.9,
    image: "/images/caneta.jpg",
    category: "Escrita",
    featured: true,
    order: 3,
  },
  {
    id: "4",
    name: "Caneta de 5 Cores",
    description: "Caneta onde a escolha da cor é toda sua!",
    price: 22.9,
    image: "/images/5caneta.jpg",
    category: "Diversão",
    featured: true,
    order: 4,
  },
  {
    id: "5",
    name: "PEN Kingston 32Gb",
    description: "Leve, rápida e com espaço para tudo! Os teus ficheiros vão adorar esta viagem.",
    price: 89.9,
    image: "/images/pen.jpg",
    category: "Eletrônicos",
    featured: true,
    order: 5,
  },
  {
    id: "6",
    name: "Mochila Escolar",
    description: "Mochila Escolar do Stich, de certeza que vais adorar!",
    price: 25.9,
    image: "/images/bag.jpg",
    category: "Escolar",
    featured: true,
    order: 6,
  },
]

// Chave para armazenamento no localStorage
const STORAGE_KEY = "papelaria-products-v2"

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Carregar produtos do localStorage ou usar produtos padrão
    const savedProducts = localStorage.getItem(STORAGE_KEY)
    if (savedProducts) {
      try {
        setProducts(JSON.parse(savedProducts))
      } catch (error) {
        console.error("Erro ao carregar produtos:", error)
        setProducts(defaultProducts)
      }
    } else {
      setProducts(defaultProducts)
    }
    setLoading(false)
  }, [])

  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProducts))
  }

  const getFeaturedProducts = () => {
    return products
      .filter((product) => product.featured)
      .sort((a, b) => a.order - b.order)
      .slice(0, 6)
  }

  const addProduct = (product: Omit<Product, "id">) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
    }
    const newProducts = [...products, newProduct]
    saveProducts(newProducts)
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const newProducts = products.map((product) => (product.id === id ? { ...product, ...updates } : product))
    saveProducts(newProducts)
  }

  const deleteProduct = (id: string) => {
    const newProducts = products.filter((product) => product.id !== id)
    saveProducts(newProducts)
  }

  const reorderFeaturedProducts = (productIds: string[]) => {
    const newProducts = products.map((product) => {
      const newOrder = productIds.indexOf(product.id)
      return {
        ...product,
        featured: newOrder !== -1,
        order: newOrder !== -1 ? newOrder + 1 : product.order,
      }
    })
    saveProducts(newProducts)
  }

  return {
    products,
    loading,
    getFeaturedProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    reorderFeaturedProducts,
  }
}
