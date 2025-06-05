import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// GET - Carregar produtos
export async function GET() {
  try {
    console.log("🔄 [PRODUCTS] === CARREGANDO PRODUTOS ===")

    // Verificar variáveis de ambiente primeiro
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("❌ [PRODUCTS] Variáveis Supabase não configuradas")
      return NextResponse.json(
        {
          products: [],
          success: false,
          error: "Configuração Supabase incompleta",
          debug: {
            hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
            hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
          },
        },
        { status: 500 },
      )
    }

    console.log("✅ [PRODUCTS] Variáveis Supabase configuradas")

    // Tentar carregar produtos
    try {
      console.log("📦 [PRODUCTS] Importando storage...")
      const { loadProductsFromCloud } = await import("@/app/lib/storage-clean")

      console.log("🔄 [PRODUCTS] Carregando produtos...")
      const products = await loadProductsFromCloud()

      console.log(`✅ [PRODUCTS] ${products.length} produtos carregados`)

      return NextResponse.json({
        products,
        success: true,
        count: products.length,
        timestamp: new Date().toISOString(),
      })
    } catch (storageError) {
      console.error("💥 [PRODUCTS] Erro no storage:", storageError)

      return NextResponse.json(
        {
          products: [],
          success: false,
          error: "Erro ao carregar produtos do storage",
          details: storageError instanceof Error ? storageError.message : String(storageError),
          stack: storageError instanceof Error ? storageError.stack : undefined,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("💥 [PRODUCTS] Erro geral:", error)

    return NextResponse.json(
      {
        products: [],
        success: false,
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}

// POST - Salvar produtos
export async function POST(request: Request) {
  try {
    console.log("💾 [PRODUCTS] === SALVANDO PRODUTOS ===")

    const { products } = await request.json()

    if (!Array.isArray(products)) {
      console.error("❌ [PRODUCTS] Dados inválidos - não é array")
      return NextResponse.json(
        { error: "Dados inválidos - products deve ser um array", success: false },
        { status: 400 },
      )
    }

    console.log(`📊 [PRODUCTS] Salvando ${products.length} produtos`)

    const { saveProductsToCloud } = await import("@/app/lib/storage-clean")
    await saveProductsToCloud(products)

    console.log("✅ [PRODUCTS] Produtos salvos com sucesso")

    return NextResponse.json({
      success: true,
      count: products.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("💥 [PRODUCTS] Erro ao salvar:", error)

    return NextResponse.json(
      {
        error: "Erro ao salvar produtos",
        details: error instanceof Error ? error.message : String(error),
        success: false,
      },
      { status: 500 },
    )
  }
}
