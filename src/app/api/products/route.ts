import { NextResponse } from "next/server"

// Configuração para forçar execução dinâmica
export const dynamic = "force-dynamic"

// GET - Carregar produtos
export async function GET() {
  try {
    console.log("🔄 [API] GET /api/products - Iniciando...")

    // Verificar se o token existe primeiro
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("❌ [API] Token BLOB_READ_WRITE_TOKEN não encontrado!")
      return NextResponse.json(
        {
          error: "Token da Blob não configurado",
          details: "BLOB_READ_WRITE_TOKEN não encontrado nas variáveis de ambiente",
          success: false,
        },
        { status: 500 },
      )
    }

    // Importar funções dinamicamente para evitar erros de build
    const { loadProductsFromCloud } = await import("@/app/lib/storage")
    const products = await loadProductsFromCloud()

    console.log("✅ [API] GET /api/products - Sucesso, produtos:", products.length)
    return NextResponse.json({ products, success: true })
  } catch (error) {
    console.error("❌ [API] GET /api/products - Erro:", error)

    return NextResponse.json(
      {
        error: "Erro ao carregar produtos",
        details: error instanceof Error ? error.message : "Erro desconhecido",
        success: false,
      },
      { status: 500 },
    )
  }
}

// POST - Salvar produtos
export async function POST(request: Request) {
  try {
    console.log("💾 [API] POST /api/products - Iniciando...")

    // Verificar se o token existe primeiro
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("❌ [API] Token BLOB_READ_WRITE_TOKEN não encontrado!")
      return NextResponse.json(
        {
          error: "Token da Blob não configurado",
          details: "BLOB_READ_WRITE_TOKEN não encontrado nas variáveis de ambiente",
          success: false,
        },
        { status: 500 },
      )
    }

    // Verificar Content-Type
    const contentType = request.headers.get("content-type")
    console.log("📋 [API] Content-Type:", contentType)

    if (!contentType || !contentType.includes("application/json")) {
      console.error("❌ [API] Content-Type inválido")
      return NextResponse.json({ error: "Content-Type deve ser application/json", success: false }, { status: 400 })
    }

    // Ler dados do request
    const body = await request.json()
    console.log("📊 [API] Dados recebidos:", Object.keys(body))

    const { products } = body

    if (!Array.isArray(products)) {
      console.error("❌ [API] Dados inválidos - products não é array")
      return NextResponse.json(
        { error: "Dados inválidos - products deve ser um array", success: false },
        { status: 400 },
      )
    }

    console.log("📝 [API] Número de produtos a salvar:", products.length)

    // Importar função dinamicamente
    const { saveProductsToCloud } = await import("@/app/lib/storage")
    await saveProductsToCloud(products)

    console.log("✅ [API] POST /api/products - Sucesso!")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ [API] POST /api/products - Erro detalhado:", error)

    let errorMessage = "Erro ao salvar produtos"
    let errorDetails = "Erro desconhecido"

    if (error instanceof Error) {
      errorMessage = error.message
      errorDetails = error.stack || error.message
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
        success: false,
      },
      { status: 500 },
    )
  }
}
