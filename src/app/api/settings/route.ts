import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// GET - Carregar configurações
export async function GET() {
  try {
    console.log("🔄 [API] === GET /api/settings INICIADO ===")

    const { loadSiteSettings } = await import("@/app/lib/storage")
    const settings = await loadSiteSettings()

    console.log("✅ [API] === GET /api/settings SUCESSO ===")
    return NextResponse.json({ settings, success: true })
  } catch (error) {
    console.error("❌ [API] === GET /api/settings ERRO ===")
    console.error("📋 [API] Erro:", error)

    return NextResponse.json(
      {
        error: "Erro ao carregar configurações",
        details: error instanceof Error ? error.message : "Erro desconhecido",
        success: false,
      },
      { status: 500 },
    )
  }
}

// POST - Salvar configurações
export async function POST(request: Request) {
  try {
    console.log("💾 [API] === POST /api/settings INICIADO ===")

    const { settings } = await request.json()

    if (!settings) {
      return NextResponse.json({ error: "Configurações são obrigatórias", success: false }, { status: 400 })
    }

    const { saveSiteSettings } = await import("@/app/lib/storage")
    await saveSiteSettings(settings)

    console.log("✅ [API] === POST /api/settings SUCESSO ===")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ [API] === POST /api/settings ERRO ===")
    console.error("📋 [API] Erro:", error)

    return NextResponse.json(
      {
        error: "Erro ao salvar configurações",
        details: error instanceof Error ? error.message : "Erro desconhecido",
        success: false,
      },
      { status: 500 },
    )
  }
}
