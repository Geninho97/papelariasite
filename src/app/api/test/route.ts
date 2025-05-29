import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    console.log("🔍 [TEST] Verificando configuração...")

    // Verificar variáveis de ambiente
    const hasToken = !!process.env.BLOB_READ_WRITE_TOKEN
    const tokenLength = process.env.BLOB_READ_WRITE_TOKEN?.length || 0

    console.log("🔑 [TEST] Token existe:", hasToken)
    console.log("📏 [TEST] Tamanho do token:", tokenLength)

    // Testar importação da Blob
    let blobImportOk = false
    try {
      const { list } = await import("@vercel/blob")
      blobImportOk = true
      console.log("📦 [TEST] Importação @vercel/blob: OK")
    } catch (error) {
      console.error("❌ [TEST] Erro ao importar @vercel/blob:", error)
    }

    // Testar listagem (se token existir)
    let blobListOk = false
    let blobError = null
    if (hasToken) {
      try {
        const { list } = await import("@vercel/blob")
        const result = await list()
        blobListOk = true
        console.log("📋 [TEST] Listagem Blob: OK, arquivos:", result.blobs.length)
      } catch (error) {
        blobError = error instanceof Error ? error.message : "Erro desconhecido"
        console.error("❌ [TEST] Erro na listagem Blob:", error)
      }
    }

    return NextResponse.json({
      success: true,
      environment: {
        hasToken,
        tokenLength,
        blobImportOk,
        blobListOk,
        blobError,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ [TEST] Erro geral:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
