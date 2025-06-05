import { NextResponse } from "next/server"
import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { createClient } from "@supabase/supabase-js"

export const dynamic = "force-dynamic"

// Configurações do R2
const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || "coutyfil-assets"
const R2_PUBLIC_URL = "https://pub-bd3bd83c1f864ad880a287c264da1ae3.r2.dev"

// Configurações do Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// DELETE - Deletar produto específico e sua imagem
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const productId = params.id

    if (!productId) {
      return NextResponse.json({ error: "ID do produto é obrigatório", success: false }, { status: 400 })
    }

    console.log(`🗑️ [PRODUCTS] Deletando produto ${productId} DEFINITIVAMENTE`)

    // 1. Buscar o produto para obter a URL da imagem
    const { data: product, error: fetchError } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single()

    if (fetchError) {
      console.error("❌ [PRODUCTS] Erro ao buscar produto:", fetchError)
      return NextResponse.json(
        { error: "Erro ao buscar produto", details: fetchError.message, success: false },
        { status: 500 },
      )
    }

    if (!product) {
      return NextResponse.json({ error: "Produto não encontrado", success: false }, { status: 404 })
    }

    // 2. Deletar a imagem do R2 se ela existir e for do nosso domínio
    if (product.image && product.image.includes(R2_PUBLIC_URL)) {
      try {
        // Extrair o caminho do arquivo da URL
        const imageUrl = new URL(product.image)
        const filePath = imageUrl.pathname.startsWith("/") ? imageUrl.pathname.substring(1) : imageUrl.pathname

        console.log(`🖼️ [PRODUCTS] Deletando imagem: ${filePath} do bucket ${BUCKET_NAME}`)

        await r2Client.send(
          new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: filePath,
          }),
        )

        console.log("✅ [PRODUCTS] Imagem deletada com sucesso do R2")
      } catch (imageError) {
        console.error("⚠️ [PRODUCTS] Erro ao deletar imagem do R2:", imageError)
        // Continuamos mesmo se houver erro na deleção da imagem
      }
    } else {
      console.log("ℹ️ [PRODUCTS] Produto não tem imagem no R2 ou é uma URL externa")
    }

    // 3. Deletar o produto da Supabase
    const { error: deleteError } = await supabase.from("products").delete().eq("id", productId)

    if (deleteError) {
      console.error("❌ [PRODUCTS] Erro ao deletar produto da Supabase:", deleteError)
      return NextResponse.json(
        { error: "Erro ao deletar produto", details: deleteError.message, success: false },
        { status: 500 },
      )
    }

    console.log(`✅ [PRODUCTS] Produto ${productId} deletado com sucesso da Supabase`)

    // 4. Limpar cache local (será feito no cliente)
    return NextResponse.json({
      success: true,
      message: "Produto e sua imagem foram deletados com sucesso",
      deletedProductId: productId,
      productName: product.name,
      imageDeleted: product.image && product.image.includes(R2_PUBLIC_URL),
    })
  } catch (error) {
    console.error("❌ [PRODUCTS] Erro ao deletar produto:", error)
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
