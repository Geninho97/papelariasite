import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    console.log("🔍 [DEBUG-PRODUCTS] === DIAGNÓSTICO COMPLETO ===")

    // 1. Verificar variáveis de ambiente
    const envCheck = {
      NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30) + "...",
      supabaseKeyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
    }

    console.log("🔑 [DEBUG-PRODUCTS] Variáveis:", envCheck)

    if (!envCheck.NEXT_PUBLIC_SUPABASE_URL || !envCheck.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({
        success: false,
        error: "Variáveis Supabase não configuradas",
        envCheck,
        step: "env-check",
      })
    }

    // 2. Testar conexão direta com Supabase
    console.log("🔄 [DEBUG-PRODUCTS] Testando conexão Supabase...")

    try {
      const { createClient } = await import("@supabase/supabase-js")
      const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

      // Testar query simples
      const {
        data: testData,
        error: testError,
        count,
      } = await supabase.from("products").select("*", { count: "exact" })

      if (testError) {
        console.error("❌ [DEBUG-PRODUCTS] Erro Supabase:", testError)
        return NextResponse.json({
          success: false,
          error: "Erro na conexão Supabase",
          supabaseError: testError.message,
          envCheck,
          step: "supabase-connection",
        })
      }

      console.log(`✅ [DEBUG-PRODUCTS] Supabase conectado - ${count} produtos encontrados`)

      // 3. Testar storage otimizado
      console.log("🔄 [DEBUG-PRODUCTS] Testando storage otimizado...")

      try {
        const { loadProductsFromCloud } = await import("@/app/lib/storage-optimized")
        const products = await loadProductsFromCloud()

        console.log(`📦 [DEBUG-PRODUCTS] Storage carregou ${products.length} produtos`)

        // 4. Verificar cache local
        const cacheStats = {
          localStorage: typeof localStorage !== "undefined",
          cacheKeys: [] as string[],
        }

        if (typeof localStorage !== "undefined") {
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i)
            if (key && key.includes("coutyfil")) {
              cacheStats.cacheKeys.push(key)
            }
          }
        }

        // 5. Testar API de produtos
        console.log("🔄 [DEBUG-PRODUCTS] Testando API de produtos...")

        const apiResponse = await fetch(`${process.env.VERCEL_URL || "http://localhost:3000"}/api/products`, {
          cache: "no-store",
        }).catch(() => null)

        const apiWorking = apiResponse?.ok || false

        return NextResponse.json({
          success: true,
          debug: {
            step: "complete",
            envCheck,
            supabase: {
              connected: true,
              productCount: count,
              sampleProduct: testData?.[0] || null,
            },
            storage: {
              working: true,
              productCount: products.length,
              sampleProduct: products[0] || null,
            },
            cache: cacheStats,
            api: {
              working: apiWorking,
              url: `${process.env.VERCEL_URL || "http://localhost:3000"}/api/products`,
            },
            recommendations: [
              count === 0 ? "❌ Nenhum produto na base de dados - adicione produtos primeiro" : null,
              products.length === 0 ? "❌ Storage não conseguiu carregar produtos" : null,
              !apiWorking ? "❌ API de produtos não está respondendo" : null,
            ].filter(Boolean),
          },
          timestamp: new Date().toISOString(),
        })
      } catch (storageError) {
        console.error("❌ [DEBUG-PRODUCTS] Erro no storage:", storageError)
        return NextResponse.json({
          success: false,
          error: "Erro no storage otimizado",
          details: storageError instanceof Error ? storageError.message : String(storageError),
          envCheck,
          supabase: { connected: true, productCount: count },
          step: "storage-test",
        })
      }
    } catch (supabaseError) {
      console.error("❌ [DEBUG-PRODUCTS] Erro ao conectar Supabase:", supabaseError)
      return NextResponse.json({
        success: false,
        error: "Erro ao conectar com Supabase",
        details: supabaseError instanceof Error ? supabaseError.message : String(supabaseError),
        envCheck,
        step: "supabase-import",
      })
    }
  } catch (error) {
    console.error("💥 [DEBUG-PRODUCTS] Erro geral:", error)
    return NextResponse.json({
      success: false,
      error: "Erro interno",
      details: error instanceof Error ? error.message : String(error),
      step: "general-error",
    })
  }
}
