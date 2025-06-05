import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    console.log("🔍 [PRODUCTS-DEBUG] === DIAGNÓSTICO DE PRODUTOS ===")

    // Verificar variáveis de ambiente
    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    }

    console.log("🔑 [PRODUCTS-DEBUG] Variáveis Supabase:")
    console.log("   NEXT_PUBLIC_SUPABASE_URL:", envCheck.NEXT_PUBLIC_SUPABASE_URL)
    console.log("   SUPABASE_SERVICE_ROLE_KEY:", envCheck.SUPABASE_SERVICE_ROLE_KEY)

    if (!envCheck.NEXT_PUBLIC_SUPABASE_URL || !envCheck.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({
        success: false,
        error: "Variáveis Supabase não configuradas",
        envCheck,
      })
    }

    // Testar conexão com Supabase
    console.log("🔄 [PRODUCTS-DEBUG] Testando conexão Supabase...")

    try {
      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

      // Testar query simples
      const { data, error, count } = await supabase.from("products").select("*", { count: "exact" }).limit(1)

      if (error) {
        console.error("❌ [PRODUCTS-DEBUG] Erro Supabase:", error)
        return NextResponse.json({
          success: false,
          error: "Erro na conexão Supabase",
          supabaseError: error.message,
          envCheck,
        })
      }

      console.log("✅ [PRODUCTS-DEBUG] Supabase conectado")
      console.log(`📊 [PRODUCTS-DEBUG] Total de produtos: ${count}`)

      return NextResponse.json({
        success: true,
        message: "Conexão Supabase OK",
        productCount: count,
        sampleData: data,
        envCheck,
      })
    } catch (supabaseError) {
      console.error("💥 [PRODUCTS-DEBUG] Erro ao conectar Supabase:", supabaseError)
      return NextResponse.json({
        success: false,
        error: "Erro ao importar/conectar Supabase",
        details: supabaseError instanceof Error ? supabaseError.message : String(supabaseError),
        envCheck,
      })
    }
  } catch (error) {
    console.error("💥 [PRODUCTS-DEBUG] Erro geral:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Erro interno",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
