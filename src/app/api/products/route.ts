import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// GET - Carregar produtos
export async function GET() {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({
        products: [],
        success: true,
        message: "Token Blob não configurado, retornando array vazio",
      })
    }

    try {
      const { loadProductsFromCloud } = await import("@/app/lib/storage")
      const products = await loadProductsFromCloud()

      return NextResponse.json({ products, success: true })
    } catch (storageError) {
      return NextResponse.json({
        products: [],
        success: true,
        message: "Erro ao acessar storage, retornando array vazio",
      })
    }
  } catch (error) {
    return NextResponse.json({
      products: [],
      success: true,
      message: "Erro na API, retornando array vazio",
      error: error instanceof Error ? error.message : "Erro desconhecido",
    })
  }
}

// POST - Salvar produtos
export async function POST(request: Request) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        {
          error: "Configuração de storage não encontrada",
          success: false,
        },
        { status: 500 },
      )
    }

    const contentType = request.headers.get("content-type")

    if (!contentType || !contentType.includes("application/json")) {
      return NextResponse.json({ error: "Content-Type deve ser application/json", success: false }, { status: 400 })
    }

    const body = await request.json()
    const { products } = body

    if (!Array.isArray(products)) {
      return NextResponse.json(
        { error: "Dados inválidos - products deve ser um array", success: false },
        { status: 400 },
      )
    }

    const { saveProductsToCloud } = await import("@/app/lib/storage")
    await saveProductsToCloud(products)

    return NextResponse.json({ success: true })
  } catch (error) {
    let errorMessage = "Erro ao salvar produtos"
    let errorDetails = "Erro desconhecido"

    if (error instanceof Error) {
      errorMessage = error.message
      errorDetails = error.stack || error.message
    }

    return NextResponse.json(
      {
        error: errorMessage,
        details: errorDetails,
        success: false,
      },
      { status: 500 },
    )
  }
}
