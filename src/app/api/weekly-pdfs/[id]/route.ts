import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// DELETE - Deletar PDF semanal
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        {
          error: "Configuração de storage não encontrada",
          success: false,
        },
        { status: 500 },
      )
    }

    const pdfId = params.id

    if (!pdfId) {
      return NextResponse.json(
        {
          error: "ID do PDF é obrigatório",
          success: false,
        },
        { status: 400 },
      )
    }

    const { deleteWeeklyPdf } = await import("@/app/lib/storage")
    await deleteWeeklyPdf(pdfId)

    return NextResponse.json({
      success: true,
      message: "PDF deletado com sucesso",
    })
  } catch (error) {
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
