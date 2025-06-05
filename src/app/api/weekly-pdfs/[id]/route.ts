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

// DELETE - Deletar PDF semanal e seu arquivo
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const pdfId = params.id

    if (!pdfId) {
      return NextResponse.json({ error: "ID do PDF é obrigatório", success: false }, { status: 400 })
    }

    console.log(`🗑️ [PDFS] Deletando PDF ${pdfId} DEFINITIVAMENTE`)

    // 1. Buscar o PDF para obter o caminho do arquivo
    const { data: pdf, error: fetchError } = await supabase.from("weekly_pdfs").select("*").eq("id", pdfId).single()

    if (fetchError) {
      console.error("❌ [PDFS] Erro ao buscar PDF:", fetchError)
      return NextResponse.json(
        { error: "Erro ao buscar PDF", details: fetchError.message, success: false },
        { status: 500 },
      )
    }

    if (!pdf) {
      return NextResponse.json({ error: "PDF não encontrado", success: false }, { status: 404 })
    }

    // 2. Deletar o arquivo do R2 se ele existir
    if (pdf.file_path) {
      try {
        console.log(`📄 [PDFS] Deletando arquivo: ${pdf.file_path} do bucket ${BUCKET_NAME}`)

        await r2Client.send(
          new DeleteObjectCommand({
            Bucket: BUCKET_NAME,
            Key: pdf.file_path,
          }),
        )

        console.log("✅ [PDFS] Arquivo PDF deletado com sucesso do R2")
      } catch (fileError) {
        console.error("⚠️ [PDFS] Erro ao deletar arquivo do R2:", fileError)
        // Continuamos mesmo se houver erro na deleção do arquivo
      }
    } else {
      console.log("ℹ️ [PDFS] PDF não tem caminho de arquivo definido")
    }

    // 3. Deletar o PDF da Supabase
    const { error: deleteError } = await supabase.from("weekly_pdfs").delete().eq("id", pdfId)

    if (deleteError) {
      console.error("❌ [PDFS] Erro ao deletar PDF da Supabase:", deleteError)
      return NextResponse.json(
        { error: "Erro ao deletar PDF", details: deleteError.message, success: false },
        { status: 500 },
      )
    }

    console.log(`✅ [PDFS] PDF ${pdfId} deletado com sucesso da Supabase`)

    return NextResponse.json({
      success: true,
      message: "PDF e seu arquivo foram deletados com sucesso",
      deletedPdfId: pdfId,
      pdfName: pdf.name,
      fileDeleted: !!pdf.file_path,
    })
  } catch (error) {
    console.error("❌ [PDFS] Erro ao deletar PDF:", error)
    return NextResponse.json(
      {
        error: "Erro ao deletar PDF",
        details: error instanceof Error ? error.message : "Erro desconhecido",
        success: false,
      },
      { status: 500 },
    )
  }
}
