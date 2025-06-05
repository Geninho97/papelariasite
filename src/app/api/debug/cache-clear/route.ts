import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST() {
  try {
    console.log("🧹 [DEBUG] === LIMPEZA COMPLETA DE CACHE ===")

    // Limpar cache do storage otimizado
    try {
      const { clearAllCache } = await import("@/app/lib/storage-optimized")
      clearAllCache()
      console.log("✅ [DEBUG] Cache do storage otimizado limpo")
    } catch (error) {
      console.log("⚠️ [DEBUG] Erro ao limpar cache otimizado:", error)
    }

    // Simular limpeza do localStorage (será feito no cliente)
    const response = NextResponse.json({
      success: true,
      message: "Cache do servidor limpo. Limpe também o cache do navegador.",
      instructions: [
        "1. Abra as ferramentas de desenvolvedor (F12)",
        "2. Vá para Application > Storage",
        "3. Limpe Local Storage",
        "4. Recarregue a página",
      ],
      timestamp: new Date().toISOString(),
    })

    // Adicionar headers para forçar reload
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate")
    response.headers.set("Pragma", "no-cache")
    response.headers.set("Expires", "0")

    return response
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
