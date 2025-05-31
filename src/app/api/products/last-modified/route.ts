import { NextResponse } from "next/server"
import { list } from "@vercel/blob"

// Configuração para forçar execução dinâmica
export const dynamic = "force-dynamic"

// GET - Obter timestamp da última modificação
export async function GET() {
  try {
    console.log("🔄 [API] === GET /api/products/last-modified INICIADO ===")

    // Verificar se o token Blob existe
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("❌ [API] BLOB_READ_WRITE_TOKEN não encontrado")
      return NextResponse.json({
        lastModified: null,
        success: false,
        error: "Token Blob não configurado"
      })
    }

    try {
      // Listar arquivos para verificar o timestamp do products.json
      const { blobs } = await list()
      const productsFile = blobs.find((blob) => blob.pathname === "products.json")

      if (!productsFile) {
        return NextResponse.json({
          lastModified: null,
          success: true,
          message: "Arquivo de produtos não encontrado"
        })
      }

      // Retornar o timestamp da última modificação
      return NextResponse.json({
        lastModified: new Date(productsFile.uploadedAt).getTime(),
        success: true
      })
    } catch (storageError) {
      console.error("❌ [API] Erro ao acessar storage:", storageError)
      return NextResponse.json({
        lastModified: null,
        success: false,
        error: "Erro ao acessar storage"
      })
    }
  } catch (error) {
    console.error("❌ [API] === GET /api/products/last-modified ERRO ===")
    console.error("📋 [API] Erro:", error)

    return NextResponse.json({
      lastModified: null,
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido"
    })
  }
}
