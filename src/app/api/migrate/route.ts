import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST() {
  try {
    console.log("🚀 Iniciando migração híbrida...")

    const { migrateFromBlob } = await import("@/app/lib/storage-hybrid")
    await migrateFromBlob()

    return NextResponse.json({
      success: true,
      message: "Migração concluída com sucesso!",
    })
  } catch (error) {
    console.error("❌ Erro na migração:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
