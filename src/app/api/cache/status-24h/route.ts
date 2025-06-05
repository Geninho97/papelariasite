import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const { getCacheStatus24H, getCacheStats24H } = await import("@/app/lib/storage-24h")
    const status = getCacheStatus24H()
    const stats = getCacheStats24H()

    return NextResponse.json({
      success: true,
      status,
      stats,
      timestamp: new Date().toISOString(),
      message: "Cache configurado para 24 horas - economia máxima!",
    })
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
