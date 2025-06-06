import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export const dynamic = "force-dynamic" // Não cachear esta rota

export async function GET() {
  try {
    // Caminho para a pasta de imagens das lojas
    const directory = path.join(process.cwd(), "public", "images", "lojas")

    // Verificar se o diretório existe
    if (!fs.existsSync(directory)) {
      return NextResponse.json({
        images: [],
        error: "Diretório não encontrado",
        directory,
      })
    }

    // Ler os arquivos do diretório
    const files = fs.readdirSync(directory)

    // Filtrar apenas arquivos de imagem
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"]
    const imageFiles = files.filter((file) => {
      const ext = path.extname(file).toLowerCase()
      return imageExtensions.includes(ext)
    })

    // Criar URLs para as imagens
    const imageUrls = imageFiles.map((file) => `/images/lojas/${file}`)

    // Retornar a lista de URLs
    return NextResponse.json({
      images: imageUrls,
      count: imageUrls.length,
      success: true,
    })
  } catch (error) {
    console.error("Erro ao ler diretório de imagens:", error)
    return NextResponse.json(
      {
        images: [],
        error: error instanceof Error ? error.message : "Erro desconhecido",
        success: false,
      },
      { status: 500 },
    )
  }
}
