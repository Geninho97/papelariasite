import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

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

    // Verificar variáveis de ambiente DETALHADAMENTE
    const envVars = {
      CLOUDFLARE_R2_ACCOUNT_ID: process.env.CLOUDFLARE_R2_ACCOUNT_ID,
      CLOUDFLARE_R2_ACCESS_KEY_ID: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
      CLOUDFLARE_R2_SECRET_ACCESS_KEY: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
      CLOUDFLARE_R2_BUCKET_NAME: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    }

    console.log("🔍 [UPLOAD] Verificando variáveis de ambiente:")
    for (const [key, value] of Object.entries(envVars)) {
      const exists = !!value
      const length = value?.length || 0
      console.log(`   ${key}: ${exists ? "✅" : "❌"} (${length} chars)`)

      if (!exists) {
        return NextResponse.json(
          {
            error: `Configuração incompleta: ${key} não definida`,
            success: false,
            debug: { missingVar: key },
          },
          { status: 500 },
        )
      }
    }

    console.log("✅ [UPLOAD] Todas as variáveis de ambiente estão definidas")

    // Tentar importar e usar a função de upload
    try {
      console.log("📦 [UPLOAD] Importando módulo de storage...")
      const { uploadImageToCloud } = await import("@/app/lib/storage-clean")

      console.log("🚀 [UPLOAD] Iniciando upload para R2...")
      const imageUrl = await uploadImageToCloud(file)

      console.log("✅ [UPLOAD] Upload concluído com sucesso:", imageUrl)

      return NextResponse.json({
        url: imageUrl,
        success: true,
        method: "cloudflare-r2",
        filename: file.name,
        size: file.size,
      })
    } catch (uploadError) {
      console.error("💥 [UPLOAD] ERRO NO UPLOAD:", uploadError)

      // Log detalhado do erro
      if (uploadError instanceof Error) {
        console.error("💥 [UPLOAD] Mensagem:", uploadError.message)
        console.error("💥 [UPLOAD] Stack:", uploadError.stack)
        console.error("💥 [UPLOAD] Nome:", uploadError.name)
      }

      return NextResponse.json(
        {
          error: "Erro no upload para R2",
          details: uploadError instanceof Error ? uploadError.message : "Erro desconhecido",
          success: false,
          debug: {
            errorType: uploadError instanceof Error ? uploadError.name : typeof uploadError,
            errorMessage: uploadError instanceof Error ? uploadError.message : String(uploadError),
          },
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("💥 [UPLOAD] ERRO GERAL:", error)
    console.error("💥 [UPLOAD] Stack trace:", error instanceof Error ? error.stack : "N/A")

    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido",
        success: false,
        debug: {
          errorType: error instanceof Error ? error.name : typeof error,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 500 },
    )
  }
}
