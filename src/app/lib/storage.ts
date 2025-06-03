import { put, list } from "@vercel/blob"

const PRODUCTS_FILE = "products.json"
const SETTINGS_FILE = "site-settings.json"
const WEEKLY_PDFS_FILE = "weekly-pdfs.json"

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

export interface WeeklyPdf {
  id: string
  name: string
  url: string
  uploadDate: string
  week: string
  year: number
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

// Upload de PDF semanal para a nuvem
export async function uploadWeeklyPdfToCloud(file: File, name: string): Promise<string> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error("BLOB_READ_WRITE_TOKEN não configurado")
    }

    const timestamp = Date.now()
    const filename = `weekly-pdfs/pdf-${timestamp}.pdf`

    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: true,
    })

    return blob.url
  } catch (error) {
    throw error
  }
}

// Carregar PDFs semanais da nuvem
export async function loadWeeklyPdfsFromCloud(): Promise<WeeklyPdf[]> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return []
    }

    const { blobs } = await list()
    const pdfsFile = blobs.find((blob) => blob.pathname === WEEKLY_PDFS_FILE)

    if (!pdfsFile) {
      return []
    }

    const response = await fetch(pdfsFile.url, {
      cache: "no-store",
    })

    if (!response.ok) {
      throw new Error(`Erro ao carregar PDFs: ${response.status}`)
    }

    const pdfs = await response.json()

    if (!Array.isArray(pdfs)) {
      return []
    }

    return pdfs
  } catch (error) {
    return []
  }
}

// Salvar PDFs semanais na nuvem
export async function saveWeeklyPdfsToCloud(pdfs: WeeklyPdf[]): Promise<void> {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error("BLOB_READ_WRITE_TOKEN não configurado")
    }

    const jsonData = JSON.stringify(pdfs, null, 2)

    await put(WEEKLY_PDFS_FILE, jsonData, {
      access: "public",
      contentType: "application/json",
      allowOverwrite: true,
    })
  } catch (error) {
    throw error
  }
}

// Adicionar novo PDF semanal
export async function addWeeklyPdf(file: File, name: string): Promise<WeeklyPdf> {
  try {
    // Upload do arquivo PDF
    const pdfUrl = await uploadWeeklyPdfToCloud(file, name)
    
    // Carregar PDFs existentes
    const existingPdfs = await loadWeeklyPdfsFromCloud()
    
    // Criar novo PDF
    const now = new Date()
    const newPdf: WeeklyPdf = {
      id: Date.now().toString(),
      name,
      url: pdfUrl,
      uploadDate: now.toISOString(),
      week: `${now.getDate()}/${now.getMonth() + 1}`,
      year: now.getFullYear()
    }
    
    // Adicionar à lista
    const updatedPdfs = [newPdf, ...existingPdfs]
    
    // Salvar lista atualizada
    await saveWeeklyPdfsToCloud(updatedPdfs)
    
    return newPdf
  } catch (error) {
    throw error
  }
}

// Obter PDF mais recente
export async function getLatestWeeklyPdf(): Promise<WeeklyPdf | null> {
  try {
    const pdfs = await loadWeeklyPdfsFromCloud()
    
    if (pdfs.length === 0) {
      return null
    }
    
    // Ordenar por data de upload (mais recente primeiro)
    const sortedPdfs = pdfs.sort((a, b) => 
      new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    )
    
    return sortedPdfs[0]
  } catch (error) {
    return null
  }
}

// Deletar PDF semanal
export async function deleteWeeklyPdf(pdfId: string): Promise<void> {
  try {
    const existingPdfs = await loadWeeklyPdfsFromCloud()
    const updatedPdfs = existingPdfs.filter(pdf => pdf.id !== pdfId)
    await saveWeeklyPdfsToCloud(updatedPdfs)
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
