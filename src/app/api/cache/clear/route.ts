import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST() {
  try {
    const { clearAllCache } = await import("@/app/lib/storage-optimized")
    clearAllCache()

    return NextResponse.json({
      success: true,
      message: "Cache limpo com sucesso",
      timestamp: new Date().toISOString(),
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
