import { NextResponse } from "next/server"

// Configuração para forçar execução dinâmica
export const dynamic = "force-dynamic"

// GET - Carregar produtos
export async function GET() {
  try {
    console.log("🔄 [API] === GET /api/products INICIADO ===")

    // Importar função dinamicamente
    const { loadProductsFromCloud } = await import("@/app/lib/storage")
    const products = await loadProductsFromCloud()

    console.log("✅ [API] === GET /api/products SUCESSO ===")
    console.log("📊 [API] Produtos retornados:", products.length)

    return NextResponse.json({ products, success: true })
  } catch (error) {
    console.error("❌ [API] === GET /api/products ERRO ===")
    console.error("📋 [API] Erro:", error)

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
    console.log("💾 [API] === POST /api/products INICIADO ===")

    // Verificar Content-Type
    const contentType = request.headers.get("content-type")
    console.log("📋 [API] Content-Type:", contentType)

    if (!contentType || !contentType.includes("application/json")) {
      console.error("❌ [API] Content-Type inválido")
      return NextResponse.json({ error: "Content-Type deve ser application/json", success: false }, { status: 400 })
    }

    // Ler dados do request
    console.log("📖 [API] Lendo dados do request...")
    const body = await request.json()
    console.log("📊 [API] Chaves recebidas:", Object.keys(body))
    console.log("📊 [API] Tipo de products:", typeof body.products)

    const { products } = body

    if (!Array.isArray(products)) {
      console.error("❌ [API] Dados inválidos - products não é array")
      console.error("📋 [API] Tipo recebido:", typeof products)
      console.error("📋 [API] Valor recebido:", products)
      return NextResponse.json(
        { error: "Dados inválidos - products deve ser um array", success: false },
        { status: 400 },
      )
    }

    console.log("📝 [API] Número de produtos a salvar:", products.length)
    console.log("🔍 [API] Primeiro produto:", products[0] ? JSON.stringify(products[0]) : "Nenhum")

    // Importar função dinamicamente
    console.log("📦 [API] Importando função de salvamento...")
    const { saveProductsToCloud } = await import("@/app/lib/storage")

    console.log("💾 [API] Chamando saveProductsToCloud...")
    await saveProductsToCloud(products)

    console.log("✅ [API] === POST /api/products SUCESSO ===")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ [API] === POST /api/products ERRO ===")
    console.error("📋 [API] Tipo do erro:", typeof error)
    console.error("📋 [API] Erro completo:", error)

    if (error instanceof Error) {
      console.error("📋 [API] Mensagem:", error.message)
      console.error("📋 [API] Stack:", error.stack)
    }

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
