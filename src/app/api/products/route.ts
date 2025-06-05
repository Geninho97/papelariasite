import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// GET - Carregar produtos
export async function GET() {
  try {
    const { loadProductsFromCloud } = await import("@/app/lib/storage-clean")
    const products = await loadProductsFromCloud()

    return NextResponse.json({ products, success: true })
  } catch (error) {
    console.error("❌ Erro na API produtos:", error)
    return NextResponse.json(
      {
        products: [],
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}

// POST - Salvar produtos
export async function POST(request: Request) {
  try {
    const { products } = await request.json()

    if (!Array.isArray(products)) {
      return NextResponse.json(
        { error: "Dados inválidos - products deve ser um array", success: false },
        { status: 400 },
      )
    }

    const { saveProductsToCloud } = await import("@/app/lib/storage-clean")
    await saveProductsToCloud(products)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ Erro ao salvar produtos:", error)
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erro ao salvar produtos",
        success: false,
      },
      { status: 500 },
    )
  }
}
