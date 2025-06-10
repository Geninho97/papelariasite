import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pdfUrl = searchParams.get("url")

    if (!pdfUrl) {
      return new NextResponse("URL do PDF é obrigatória", { status: 400 })
    }

    console.log(`🔄 [PDF-PROXY] Buscando PDF: ${pdfUrl}`)

    // Buscar o PDF do R2
    const response = await fetch(pdfUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; PDF-Proxy/1.0)",
      },
    })

    if (!response.ok) {
      console.error(`❌ [PDF-PROXY] Erro ao buscar PDF: ${response.status}`)
      return new NextResponse(`Erro ao buscar PDF: ${response.status}`, {
        status: response.status,
      })
    }

    const pdfBuffer = await response.arrayBuffer()
    console.log(`✅ [PDF-PROXY] PDF servido com sucesso (${(pdfBuffer.byteLength / 1024 / 1024).toFixed(2)}MB)`)

    // Retornar o PDF com headers apropriados
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Length": pdfBuffer.byteLength.toString(),
        "Cache-Control": "public, max-age=86400", // Cache por 24 horas
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Access-Control-Allow-Headers": "Content-Type",
        // Headers para resolver problemas de fullscreen
        "Permissions-Policy": "fullscreen=*",
        "X-Frame-Options": "SAMEORIGIN",
        "Content-Security-Policy": "frame-ancestors 'self'",
      },
    })
  } catch (error) {
    console.error("❌ [PDF-PROXY] Erro interno:", error)
    return new NextResponse("Erro interno do servidor", { status: 500 })
  }
}
