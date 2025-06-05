import { NextResponse } from "next/server"

export const dynamic = "force_dynamic"

export async function POST(request: Request) {
  try {
    console.log("🔄 [UPLOAD] === INICIANDO UPLOAD ===")

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.log("❌ [UPLOAD] Nenhum arquivo enviado")
      return NextResponse.json({ error: "Nenhum arquivo enviado", success: false }, { status: 400 })
    }

    console.log(`📁 [UPLOAD] Arquivo: ${file.name} (${file.size} bytes, ${file.type})`)

    // Validações
    if (!file.type.startsWith("image/")) {
      console.log("❌ [UPLOAD] Tipo de arquivo inválido:", file.type)
      return NextResponse.json({ error: "Apenas imagens são permitidas", success: false }, { status: 400 })
    }

    if (file.size > 5 * 1024 * 1024) {
      console.log("❌ [UPLOAD] Arquivo muito grande:", file.size)
      return NextResponse.json({ error: "Imagem muito grande (máximo 5MB)", success: false }, { status: 400 })
    }

    try {
      console.log("📦 [UPLOAD] Importando módulo de storage otimizado...")
      const { uploadImageToCloud } = await import("@/app/lib/storage-optimized")

      console.log("🚀 [UPLOAD] Iniciando upload para R2...")
      const imageUrl = await uploadImageToCloud(file)

      console.log("✅ [UPLOAD] Upload concluído com sucesso:", imageUrl)

      return NextResponse.json({
        url: imageUrl,
        success: true,
        method: "cloudflare-r2",
        filename: file.name,
        size: file.size,
        cached: true, // Indica que a imagem foi cacheada localmente
      })
    } catch (uploadError) {
      console.error("💥 [UPLOAD] ERRO NO UPLOAD:", uploadError)

      return NextResponse.json(
        {
          error: "Erro no upload para R2",
          details: uploadError instanceof Error ? uploadError.message : "Erro desconhecido",
          success: false,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("💥 [UPLOAD] ERRO GERAL:", error)

    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido",
        success: false,
      },
      { status: 500 },
    )
  }
}
