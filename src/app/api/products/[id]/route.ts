import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// DELETE - Deletar produto específico
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const productId = params.id

    if (!productId) {
      return NextResponse.json({ error: "ID do produto é obrigatório", success: false }, { status: 400 })
    }

    console.log(`🗑️ [PRODUCTS] Deletando produto ${productId}`)

    // Carregar produtos atuais
    const { loadProductsFromCloud, saveProductsToCloud } = await import("@/app/lib/storage-optimized")
    const currentProducts = await loadProductsFromCloud()

    // Verificar se o produto existe
    const productExists = currentProducts.find((p) => p.id === productId)
    if (!productExists) {
      return NextResponse.json({ error: "Produto não encontrado", success: false }, { status: 404 })
    }

    // Remover o produto da lista
    const updatedProducts = currentProducts.filter((product) => product.id !== productId)

    // Salvar a lista atualizada
    await saveProductsToCloud(updatedProducts)

    console.log(`✅ [PRODUCTS] Produto ${productId} deletado com sucesso`)

    return NextResponse.json({
      success: true,
      message: "Produto deletado com sucesso",
      deletedProductId: productId,
      remainingProducts: updatedProducts.length,
    })
  } catch (error) {
    console.error("❌ Erro ao deletar produto:", error)
    return NextResponse.json(
      {
        error: "Erro ao deletar produto",
        details: error instanceof Error ? error.message : "Erro desconhecido",
        success: false,
      },
      { status: 500 },
    )
  }
}
