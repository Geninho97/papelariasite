import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    // Lista atualizada de categorias
    const categories = ["Mercearia", "Escritorio", "Escolar", "Brinquedos", "Eletrônicos", "Outros"]

    return NextResponse.json({
      categories,
      success: true,
    })
  } catch (error) {
    return NextResponse.json(
      {
        categories: [],
        error: error instanceof Error ? error.message : "Erro desconhecido",
        success: false,
      },
      { status: 500 },
    )
  }
}
