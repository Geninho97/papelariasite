import { NextResponse } from "next/server"
import { loadProductsFromCloud, saveProductsToCloud } from "@/app/lib/storage"

// GET - Carregar produtos
export async function GET() {
  try {
    const products = await loadProductsFromCloud()
    return NextResponse.json({ products, success: true })
  } catch (error) {
    console.error("Erro ao carregar produtos:", error)
    return NextResponse.json({ error: "Erro ao carregar produtos", success: false }, { status: 500 })
  }
}

// POST - Salvar produtos
export async function POST(request: Request) {
  try {
    const { products } = await request.json()

    if (!Array.isArray(products)) {
      return NextResponse.json({ error: "Dados inválidos", success: false }, { status: 400 })
    }

    await saveProductsToCloud(products)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Erro ao salvar produtos:", error)
    return NextResponse.json({ error: "Erro ao salvar produtos", success: false }, { status: 500 })
  }
}
