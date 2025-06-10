import { type NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    // Obter URL do PDF a partir do parâmetro de consulta
    const url = request.nextUrl.searchParams.get("url")

    if (!url) {
      return NextResponse.json({ error: "URL do PDF não fornecida" }, { status: 400 })
    }

    // Verificar se a URL é válida e aponta para um PDF
    if (!url.startsWith("http") || (!url.includes(".pdf") && !url.includes("pdf-"))) {
      return NextResponse.json({ error: "URL inválida ou não é um PDF" }, { status: 400 })
    }

    // Buscar o PDF
    console.log(`🔄 [PDF-PROXY] Buscando PDF: ${url}`)
    const response = await fetch(url, {
      headers: {
        Accept: "application/pdf",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    })

    if (!response.ok) {
      console.error(`❌ [PDF-PROXY] Erro ao buscar PDF: ${response.status} ${response.statusText}`)
      return NextResponse.json(
        { error: `Erro ao buscar PDF: ${response.status} ${response.statusText}` },
        { status: response.status },
      )
    }

    // Obter o conteúdo do PDF como ArrayBuffer
    const pdfBuffer = await response.arrayBuffer()

    // Criar resposta com o PDF e headers apropriados
    const headers = new Headers()
    headers.set("Content-Type", "application/pdf")
    headers.set("Content-Length", pdfBuffer.byteLength.toString())
    headers.set("Content-Disposition", `inline; filename="pdf-${Date.now()}.pdf"`)
    headers.set("Access-Control-Allow-Origin", "*")
    headers.set("Cache-Control", "public, max-age=86400") // Cache por 24 horas

    console.log(`✅ [PDF-PROXY] PDF obtido com sucesso: ${(pdfBuffer.byteLength / (1024 * 1024)).toFixed(2)}MB`)

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error(`❌ [PDF-PROXY] Erro no proxy de PDF:`, error)
    return NextResponse.json({ error: "Erro ao processar o PDF" }, { status: 500 })
  }
}
