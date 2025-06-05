import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    console.log("🔍 [DEBUG-SAVE] === TESTE DE SALVAMENTO ===")

    const body = await request.json()
    console.log("📋 [DEBUG-SAVE] Body completo:", JSON.stringify(body, null, 2))

    const { products } = body

    // Verificações detalhadas
    const checks = {
      hasProducts: !!products,
      isArray: Array.isArray(products),
      count: Array.isArray(products) ? products.length : 0,
      firstProduct: Array.isArray(products) && products.length > 0 ? products[0] : null,
      envVars: {
        supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
    }

    console.log("🔍 [DEBUG-SAVE] Verificações:", checks)

    if (!checks.hasProducts) {
      return NextResponse.json({
        success: false,
        error: "Campo 'products' não encontrado",
        checks,
      })
    }

    if (!checks.isArray) {
      return NextResponse.json({
        success: false,
        error: "Products não é um array",
        checks,
        productType: typeof products,
      })
    }

    if (!checks.envVars.supabaseUrl || !checks.envVars.supabaseKey) {
      return NextResponse.json({
        success: false,
        error: "Variáveis Supabase não configuradas",
        checks,
      })
    }

    // Tentar salvar
    try {
      const { saveProductsToCloud } = await import("@/app/lib/storage-optimized")
      await saveProductsToCloud(products)

      return NextResponse.json({
        success: true,
        message: "Produtos salvos com sucesso",
        checks,
      })
    } catch (saveError) {
      console.error("❌ [DEBUG-SAVE] Erro ao salvar:", saveError)
      return NextResponse.json({
        success: false,
        error: "Erro ao salvar",
        details: saveError instanceof Error ? saveError.message : String(saveError),
        checks,
      })
    }
  } catch (error) {
    console.error("💥 [DEBUG-SAVE] Erro geral:", error)
    return NextResponse.json({
      success: false,
      error: "Erro interno",
      details: error instanceof Error ? error.message : String(error),
    })
  }
}
