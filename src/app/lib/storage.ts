import { put, list } from "@vercel/blob"

const PRODUCTS_FILE = "products.json"
const SETTINGS_FILE = "site-settings.json"

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

export interface SiteSettings {
  heroImage: string
  heroTitle: string
  heroSubtitle: string
}

const defaultSettings: SiteSettings = {
  heroImage: "/placeholder.svg?height=500&width=600&text=Produtos+Papelaria",
  heroTitle: "Tudo para seu escritório e escola",
  heroSubtitle:
    "Na Papelaria você encontra os melhores produtos para escritório, escola e casa com preços imbatíveis e atendimento de qualidade excepcional.",
}

// Carregar produtos da nuvem
export async function loadProductsFromCloud(): Promise<Product[]> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return []
    }

    const { blobs } = await list()
    const productsFile = blobs.find((blob) => blob.pathname === PRODUCTS_FILE)

    if (!productsFile) {
      return []
    }

    const response = await fetch(productsFile.url, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Erro ao carregar: ${response.status} - ${response.statusText}`)
    }

    const products = await response.json()

    if (!Array.isArray(products)) {
      return []
    }

    return products
  } catch (error) {
    return []
  }
}

// Salvar produtos na nuvem
export async function saveProductsToCloud(products: Product[]): Promise<void> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error("BLOB_READ_WRITE_TOKEN não configurado")
    }

    if (!Array.isArray(products)) {
      throw new Error("Dados de produtos inválidos - não é um array")
    }

    // Validar estrutura dos produtos
    for (let i = 0; i < products.length; i++) {
      const product = products[i]
      if (!product.id || !product.name || typeof product.price !== "number") {
        throw new Error(`Produto inválido no índice ${i}: faltam campos obrigatórios`)
      }
    }

    const jsonData = JSON.stringify(products, null, 2)

    await put(PRODUCTS_FILE, jsonData, {
      access: "public",
      contentType: "application/json",
      allowOverwrite: true,
    })
  } catch (error) {
    throw error
  }
}

// Carregar configurações do site
export async function loadSiteSettings(): Promise<SiteSettings> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return defaultSettings
    }

    const { blobs } = await list()
    const settingsFile = blobs.find((blob) => blob.pathname === SETTINGS_FILE)

    if (!settingsFile) {
      await saveSiteSettings(defaultSettings)
      return defaultSettings
    }

    const response = await fetch(settingsFile.url, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Erro ao carregar configurações: ${response.status}`)
    }

    const settings = await response.json()
    return settings
  } catch (error) {
    return defaultSettings
  }
}

// Salvar configurações do site
export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error("BLOB_READ_WRITE_TOKEN não configurado")
    }

    const jsonData = JSON.stringify(settings, null, 2)

    await put(SETTINGS_FILE, jsonData, {
      access: "public",
      contentType: "application/json",
      allowOverwrite: true,
    })
  } catch (error) {
    throw error
  }
}

// Upload de imagem para a nuvem
export async function uploadImageToCloud(file: File): Promise<string> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error("BLOB_READ_WRITE_TOKEN não configurado")
    }

    const timestamp = Date.now()
    const extension = file.name.split(".").pop()
    const filename = `products/image-${timestamp}.${extension}`

    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: true,
    })

    return blob.url
  } catch (error) {
    throw error
  }
}

// Função para inicializar a base de dados
export async function initializeDatabase(): Promise<void> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return
    }

    const { blobs } = await list()
    const productsFile = blobs.find((blob) => blob.pathname === PRODUCTS_FILE)

    if (!productsFile) {
      await saveProductsToCloud([])
    }
  } catch (error) {
    // Não fazer throw para não quebrar a aplicação
  }
}
