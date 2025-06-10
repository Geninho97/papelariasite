import { type NextRequest, NextResponse } from "next/server"

// Proxy para contornar CORS e permitir cache de PDFs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pdfUrl = searchParams.get("url")

    if (!pdfUrl) {
      return NextResponse.json({ error: "URL do PDF é obrigatória" }, { status: 400 })
    }

    // Verificar se é uma URL válida do R2
    if (!pdfUrl.includes("r2.dev") && !pdfUrl.includes("cloudflare")) {
      return NextResponse.json({ error: "URL não autorizada" }, { status: 403 })
    }

    console.log(`🔄 [PDF-PROXY] Buscando PDF: ${pdfUrl}`)

    // Buscar o PDF do R2
    const response = await fetch(pdfUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PDF-Cache/1.0)",
      },
    })

    if (!response.ok) {
      console.error(`❌ [PDF-PROXY] Erro ao buscar PDF: ${response.status}`)
      return NextResponse.json({ error: `Erro ao buscar PDF: ${response.status}` }, { status: response.status })
    }

    // Obter o blob do PDF
    const pdfBlob = await response.blob()
    const pdfBuffer = await pdfBlob.arrayBuffer()

    console.log(`✅ [PDF-PROXY] PDF obtido com sucesso: ${(pdfBuffer.byteLength / (1024 * 1024)).toFixed(2)}MB`)

    // Retornar o PDF com headers apropriados para cache
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": pdfBuffer.byteLength.toString(),
        "Cache-Control": "public, max-age=3600", // Cache por 1 hora
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Disposition": "inline",
      },
    })
  } catch (error) {
    console.error("❌ [PDF-PROXY] Erro interno:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}

// Permitir CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  })
}
