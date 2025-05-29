import { put, list } from "@vercel/blob"

const PRODUCTS_FILE = "products.json"

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

// Produtos padrão (caso não existam dados na nuvem)
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

// Carregar produtos da nuvem
export async function loadProductsFromCloud(): Promise<Product[]> {
  try {
    console.log("🔄 [STORAGE] Carregando produtos da nuvem...")

    // Listar arquivos para verificar se products.json existe
    const { blobs } = await list()
    console.log(
      "📋 [STORAGE] Arquivos encontrados na Blob:",
      blobs.map((b) => b.pathname),
    )

    const productsFile = blobs.find((blob) => blob.pathname === PRODUCTS_FILE)

    if (!productsFile) {
      console.log("📝 [STORAGE] Arquivo de produtos não encontrado, criando com dados padrão...")
      await saveProductsToCloud(defaultProducts)
      return defaultProducts
    }

    console.log("📁 [STORAGE] Arquivo encontrado:", productsFile.url)

    // Carregar dados do arquivo
    const response = await fetch(productsFile.url)
    if (!response.ok) {
      throw new Error(`Erro ao carregar: ${response.status} - ${response.statusText}`)
    }

    const products = await response.json()
    console.log("✅ [STORAGE] Produtos carregados da nuvem:", products.length)
    return products
  } catch (error) {
    console.error("❌ [STORAGE] Erro ao carregar produtos da nuvem:", error)
    console.log("🔄 [STORAGE] Usando produtos padrão...")
    return defaultProducts
  }
}

// Salvar produtos na nuvem
export async function saveProductsToCloud(products: Product[]): Promise<void> {
  try {
    console.log("💾 [STORAGE] === INICIANDO SALVAMENTO ===")
    console.log("📊 [STORAGE] Número de produtos a salvar:", products.length)
    console.log("🔍 [STORAGE] Primeiro produto:", products[0] ? JSON.stringify(products[0], null, 2) : "Nenhum")

    // Validar dados básicos
    if (!Array.isArray(products)) {
      throw new Error("Dados de produtos inválidos - não é um array")
    }

    if (products.length === 0) {
      console.warn("⚠️ [STORAGE] Array de produtos está vazio")
    }

    // Validar estrutura dos produtos
    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      if (!product.id || !product.name || typeof product.price !== "number") {
        console.error("❌ [STORAGE] Produto inválido no índice", i, ":", product)
        throw new Error(`Produto inválido no índice ${i}: faltam campos obrigatórios`)
      }
    }

    console.log("✅ [STORAGE] Validação dos produtos: OK")

    // Converter para JSON
    const jsonData = JSON.stringify(products, null, 2)
    console.log("📝 [STORAGE] JSON gerado, tamanho:", jsonData.length, "caracteres")
    console.log("🔍 [STORAGE] Primeiros 200 chars do JSON:", jsonData.substring(0, 200))

    // Salvar na Blob
    console.log("☁️ [STORAGE] Enviando para Vercel Blob...")
    console.log("📁 [STORAGE] Nome do arquivo:", PRODUCTS_FILE)

    const blob = await put(PRODUCTS_FILE, jsonData, {
      access: "public",
      contentType: "application/json",
    })

    console.log("✅ [STORAGE] === SALVAMENTO CONCLUÍDO ===")
    console.log("🔗 [STORAGE] URL do arquivo:", blob.url)
    console.log("📏 [STORAGE] Tamanho do JSON:", jsonData.length, "caracteres")
  } catch (error) {
    console.error("❌ [STORAGE] === ERRO NO SALVAMENTO ===")
    console.error("📋 [STORAGE] Tipo do erro:", typeof error)
    console.error("📋 [STORAGE] Erro completo:", error)

    if (error instanceof Error) {
      console.error("📋 [STORAGE] Mensagem:", error.message)
      console.error("📋 [STORAGE] Stack:", error.stack)
    }

    // Re-throw para que a API possa capturar
    throw error
  }
}

// Upload de imagem para a nuvem
export async function uploadImageToCloud(file: File): Promise<string> {
  try {
    console.log("📸 [STORAGE] Fazendo upload da imagem para a nuvem...")

    // Gerar nome único para a imagem
    const timestamp = Date.now()
    const extension = file.name.split(".").pop()
    const filename = `products/image-${timestamp}.${extension}`

    console.log("📁 [STORAGE] Nome do arquivo:", filename)

    // Upload para Blob
    const blob = await put(filename, file, {
      access: "public",
    })

    console.log("✅ [STORAGE] Imagem salva na nuvem:", blob.url)
    return blob.url
  } catch (error) {
    console.error("❌ [STORAGE] Erro ao fazer upload da imagem:", error)
    throw error
  }
}
