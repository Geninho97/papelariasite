import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST() {
  try {
    const { forceReloadProducts24H } = await import("@/app/lib/storage-24h")
    const products = await forceReloadProducts24H()

    return NextResponse.json({
      success: true,
      message: "Cache limpo e produtos recarregados da database",
      productCount: products.length,
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
