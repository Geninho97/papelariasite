import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    console.log("Iniciando upload para Vercel Blob...")

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.log("Erro: Nenhum arquivo enviado")
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 })
    }

    // Verificar se é uma imagem
    if (!file.type.startsWith("image/")) {
      console.log("Erro: O arquivo não é uma imagem")
      return NextResponse.json({ error: "O arquivo deve ser uma imagem" }, { status: 400 })
    }

    // Limitar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.log("Erro: Arquivo muito grande")
      return NextResponse.json({ error: "A imagem deve ter no máximo 5MB" }, { status: 400 })
    }

    // Gerar um nome de arquivo único baseado no timestamp e nome original
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.]/g, "-")
    const filename = `produtos/${timestamp}-${originalName}`

    console.log(`Tentando fazer upload do arquivo: ${filename}`)

    // Verificar se o token está disponível
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("ERRO CRÍTICO: Token do Vercel Blob não encontrado!")
      return NextResponse.json(
        { error: "Configuração do servidor incompleta. Contate o administrador." },
        { status: 500 },
      )
    }

    // Fazer upload para o Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
    })

    console.log("Upload concluído com sucesso:", blob.url)

    // Retornar a URL da imagem
    return NextResponse.json({
      url: blob.url,
      success: true,
    })
  } catch (error) {
    // Log detalhado do erro
    console.error("Erro detalhado no upload:", error)

    // Verificar se é um erro específico do Vercel Blob
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao processar o upload"

    return NextResponse.json(
      {
        error: errorMessage,
        details: "Verifique os logs do servidor para mais informações",
      },
      { status: 500 },
    )
  }
}
