import { NextResponse } from "next/server"
import { list } from "@vercel/blob"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({
        lastModified: null,
        success: false,
        error: "Token Blob não configurado",
      })
    }

    try {
      const { blobs } = await list()
      const productsFile = blobs.find((blob) => blob.pathname === "products.json")

      if (!productsFile) {
        return NextResponse.json({
          lastModified: null,
          success: true,
          message: "Arquivo de produtos não encontrado",
        })
      }

      return NextResponse.json({
        lastModified: new Date(productsFile.uploadedAt).getTime(),
        success: true,
      })
    } catch (storageError) {
      return NextResponse.json({
        lastModified: null,
        success: false,
        error: "Erro ao acessar storage",
      })
    }
  } catch (error) {
    return NextResponse.json({
      lastModified: null,
      success: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    })
  }
}
