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

// Configurações padrão do site (apenas para fallback)
const defaultSettings: SiteSettings = {
  heroImage: "/placeholder.svg?height=500&width=600&text=Produtos+Papelaria",
  heroTitle: "Tudo para seu escritório e escola",
  heroSubtitle:
    "Na Papelaria você encontra os melhores produtos para escritório, escola e casa com preços imbatíveis e atendimento de qualidade excepcional.",
}

// Carregar produtos da nuvem - SEM produtos padrão
export async function loadProductsFromCloud(): Promise<Product[]> {
  try {
    console.log("🔄 [STORAGE] Carregando produtos da nuvem...")

    // Verificar se o token existe
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.log("⚠️ [STORAGE] BLOB_READ_WRITE_TOKEN não configurado")
      return []
    }

    // Listar arquivos para verificar se products.json existe
    console.log("📋 [STORAGE] Listando arquivos na Blob...")
    const { blobs } = await list()
    console.log(
      "📋 [STORAGE] Arquivos encontrados na Blob:",
      blobs.map((b) => b.pathname),
    )

    const productsFile = blobs.find((blob) => blob.pathname === PRODUCTS_FILE)

    if (!productsFile) {
      console.log("📝 [STORAGE] Arquivo de produtos não encontrado na nuvem")
      console.log("🔄 [STORAGE] Retornando array vazio - produtos devem ser adicionados via admin")
      return []
    }

    console.log("📁 [STORAGE] Arquivo encontrado:", productsFile.url)

    // Carregar dados do arquivo
    console.log("📖 [STORAGE] Fazendo fetch do arquivo...")
    const response = await fetch(productsFile.url, {
      cache: "no-store", // Evitar cache
    })

    if (!response.ok) {
      throw new Error(`Erro ao carregar: ${response.status} - ${response.statusText}`)
    }

    console.log("📄 [STORAGE] Arquivo carregado, fazendo parse JSON...")
    const products = await response.json()

    // Validar se é um array
    if (!Array.isArray(products)) {
      console.error("❌ [STORAGE] Dados carregados não são um array:", typeof products)
      return []
    }

    console.log("✅ [STORAGE] Produtos carregados da nuvem:", products.length)
    return products
  } catch (error) {
    console.error("❌ [STORAGE] Erro ao carregar produtos da nuvem:", error)

    // Log mais detalhado do erro
    if (error instanceof Error) {
      console.error("📋 [STORAGE] Mensagem do erro:", error.message)
      console.error("📋 [STORAGE] Stack do erro:", error.stack)
    }

    console.log("🔄 [STORAGE] Retornando array vazio devido ao erro")
    return []
  }
}

// Salvar produtos na nuvem
export async function saveProductsToCloud(products: Product[]): Promise<void> {
  try {
    console.log("💾 [STORAGE] === INICIANDO SALVAMENTO ===")
    console.log("📊 [STORAGE] Número de produtos a salvar:", products.length)

    // Verificar se o token existe
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error("BLOB_READ_WRITE_TOKEN não configurado")
    }

    // Validar dados básicos
    if (!Array.isArray(products)) {
      throw new Error("Dados de produtos inválidos - não é um array")
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

    // Salvar na Blob - ADICIONADO allowOverwrite: true
    console.log("☁️ [STORAGE] Fazendo upload para Blob com allowOverwrite: true...")
    const blob = await put(PRODUCTS_FILE, jsonData, {
      access: "public",
      contentType: "application/json",
      allowOverwrite: true, // Permite sobrescrever o arquivo existente
    })

    console.log("✅ [STORAGE] === SALVAMENTO CONCLUÍDO ===")
    console.log("🔗 [STORAGE] URL do arquivo:", blob.url)
  } catch (error) {
    console.error("❌ [STORAGE] === ERRO NO SALVAMENTO ===")
    console.error("📋 [STORAGE] Erro completo:", error)

    // Log mais detalhado
    if (error instanceof Error) {
      console.error("📋 [STORAGE] Mensagem:", error.message)
      console.error("📋 [STORAGE] Stack:", error.stack)
    }

    throw error
  }
}

// Carregar configurações do site
export async function loadSiteSettings(): Promise<SiteSettings> {
  try {
    console.log("🔄 [STORAGE] Carregando configurações do site...")

    // Verificar se o token existe
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.log("⚠️ [STORAGE] BLOB_READ_WRITE_TOKEN não configurado, usando configurações padrão")
      return defaultSettings
    }

    const { blobs } = await list()
    const settingsFile = blobs.find((blob) => blob.pathname === SETTINGS_FILE)

    if (!settingsFile) {
      console.log("📝 [STORAGE] Arquivo de configurações não encontrado, criando com dados padrão...")
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
    console.log("✅ [STORAGE] Configurações carregadas da nuvem")
    return settings
  } catch (error) {
    console.error("❌ [STORAGE] Erro ao carregar configurações:", error)
    return defaultSettings
  }
}

// Salvar configurações do site
export async function saveSiteSettings(settings: SiteSettings): Promise<void> {
  try {
    console.log("💾 [STORAGE] Salvando configurações do site...")

    // Verificar se o token existe
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error("BLOB_READ_WRITE_TOKEN não configurado")
    }

    const jsonData = JSON.stringify(settings, null, 2)

    // ADICIONADO allowOverwrite: true
    const blob = await put(SETTINGS_FILE, jsonData, {
      access: "public",
      contentType: "application/json",
      allowOverwrite: true, // Permite sobrescrever o arquivo existente
    })

    console.log("✅ [STORAGE] Configurações salvas:", blob.url)
  } catch (error) {
    console.error("❌ [STORAGE] Erro ao salvar configurações:", error)
    throw error
  }
}

// Upload de imagem para a nuvem
export async function uploadImageToCloud(file: File): Promise<string> {
  try {
    console.log("📸 [STORAGE] Fazendo upload da imagem para a nuvem...")

    // Verificar se o token existe
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      throw new Error("BLOB_READ_WRITE_TOKEN não configurado")
    }

    // Gerar nome único para a imagem
    const timestamp = Date.now()
    const extension = file.name.split(".").pop()
    const filename = `products/image-${timestamp}.${extension}`

    console.log("📁 [STORAGE] Nome do arquivo:", filename)

    // Upload para Blob - Já usa addRandomSuffix: true para evitar sobrescrever imagens
    const blob = await put(filename, file, {
      access: "public",
      addRandomSuffix: true, // Já está configurado para adicionar sufixo aleatório
    })

    console.log("✅ [STORAGE] Imagem salva na nuvem:", blob.url)
    return blob.url
  } catch (error) {
    console.error("❌ [STORAGE] Erro ao fazer upload da imagem:", error)
    throw error
  }
}

// Função para inicializar a base de dados com produtos de exemplo (apenas para primeira vez)
export async function initializeDatabase(): Promise<void> {
  try {
    console.log("🔄 [STORAGE] Verificando se base de dados precisa ser inicializada...")

    // Verificar se o token existe
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.log("⚠️ [STORAGE] BLOB_READ_WRITE_TOKEN não configurado, pulando inicialização")
      return
    }

    const { blobs } = await list()
    const productsFile = blobs.find((blob) => blob.pathname === PRODUCTS_FILE)

    if (!productsFile) {
      console.log("📝 [STORAGE] Base de dados vazia, criando arquivo inicial...")
      await saveProductsToCloud([]) // Já vai usar allowOverwrite: true
      console.log("✅ [STORAGE] Base de dados inicializada com array vazio")
    } else {
      console.log("✅ [STORAGE] Base de dados já existe")
    }
  } catch (error) {
    console.error("❌ [STORAGE] Erro ao inicializar base de dados:", error)
    // Não fazer throw aqui para não quebrar a aplicação
  }
}
