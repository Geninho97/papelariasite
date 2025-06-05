import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// GET - Carregar produtos com cache otimizado
export async function GET() {
  try {
    console.log("🔄 [PRODUCTS] === CARREGANDO PRODUTOS ===")

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("❌ [PRODUCTS] Variáveis Supabase não configuradas")
      return NextResponse.json(
        {
          products: [],
          success: false,
          error: "Configuração Supabase incompleta",
        },
        { status: 500 },
      )
    }

    console.log("✅ [PRODUCTS] Variáveis Supabase configuradas")

    try {
      console.log("📦 [PRODUCTS] Importando storage otimizado...")
      const { loadProductsFromCloud } = await import("@/app/lib/storage-optimized")

      console.log("🔄 [PRODUCTS] Carregando produtos...")
      const products = await loadProductsFromCloud()

      console.log(`✅ [PRODUCTS] ${products.length} produtos carregados`)

      return NextResponse.json({
        products,
        success: true,
        count: products.length,
        timestamp: new Date().toISOString(),
        cached: true, // Indica que pode estar usando cache
      })
    } catch (storageError) {
      console.error("💥 [PRODUCTS] Erro no storage:", storageError)

      return NextResponse.json(
        {
          products: [],
          success: false,
          error: "Erro ao carregar produtos do storage",
          details: storageError instanceof Error ? storageError.message : String(storageError),
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
      },
      { status: 500 },
    )
  }
}

// POST - Salvar produtos
export async function POST(request: Request) {
  try {
    console.log("💾 [PRODUCTS] === SALVANDO PRODUTOS ===")

    const body = await request.json()
    console.log("📋 [PRODUCTS] Body recebido:", JSON.stringify(body, null, 2))

    const { products } = body

    if (!products) {
      console.error("❌ [PRODUCTS] Campo 'products' não encontrado no body")
      return NextResponse.json({ error: "Campo 'products' é obrigatório", success: false }, { status: 400 })
    }

    if (!Array.isArray(products)) {
      console.error("❌ [PRODUCTS] Dados inválidos - não é array:", typeof products)
      return NextResponse.json(
        { error: "Dados inválidos - products deve ser um array", success: false },
        { status: 400 },
      )
    }

    console.log(`📊 [PRODUCTS] Salvando ${products.length} produtos`)

    // Verificar se temos variáveis de ambiente
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("❌ [PRODUCTS] Variáveis Supabase não configuradas")
      return NextResponse.json({ error: "Configuração Supabase incompleta", success: false }, { status: 500 })
    }

    try {
      const { saveProductsToCloud } = await import("@/app/lib/storage-optimized")
      await saveProductsToCloud(products)

      console.log("✅ [PRODUCTS] Produtos salvos com sucesso")

      return NextResponse.json({
        success: true,
        count: products.length,
        timestamp: new Date().toISOString(),
      })
    } catch (storageError) {
      console.error("💥 [PRODUCTS] Erro no storage:", storageError)

      return NextResponse.json(
        {
          error: "Erro ao salvar produtos no storage",
          details: storageError instanceof Error ? storageError.message : String(storageError),
          success: false,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("💥 [PRODUCTS] Erro geral:", error)

    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : String(error),
        success: false,
      },
      { status: 500 },
    )
  }
}
