import { NextResponse } from "next/server"
import { uploadImageToCloud } from "@/app/lib/storage"

export async function POST(request: Request) {
  try {
    console.log("=== UPLOAD API INICIADA ===")

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { error: "Nenhum arquivo enviado", success: false },
        { status: 400 }
      )
    }

    console.log(`📁 Arquivo: ${file.name} (${file.size} bytes, ${file.type})`)

    // Validações
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Apenas imagens são permitidas", success: false },
        { status: 400 }
      )
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      return NextResponse.json(
        { error: "Imagem muito grande (máximo 5MB)", success: false },
        { status: 400 }
      )
    }

    // Upload para a nuvem
    const imageUrl = await uploadImageToCloud(file)

    return NextResponse.json({
      url: imageUrl,
      success: true,
      method: "vercel-blob",
      filename: file.name,
      size: file.size,
    })

  } catch (error) {
    console.error("💥 ERRO na API:", error)

    return NextResponse.json(
      {
        error: "Erro ao fazer upload",
        details: error instanceof Error ? error.message : "Erro desconhecido",
        success: false,
      },
      { status: 500 }
    )
  }
}
