import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST() {
  try {
    console.log("🧹 [DEBUG] === LIMPEZA FORÇADA DE COOKIES ===")

    const response = NextResponse.json({
      success: true,
      message: "Cookies limpos forçadamente",
      debug: "All admin cookies cleared",
    })

    // Limpar cookie de todas as formas possíveis
    const cookieOptions = [
      // Configuração padrão
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        maxAge: 0,
        expires: new Date(0),
        path: "/",
      },
      // Sem httpOnly (para casos especiais)
      {
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        maxAge: 0,
        expires: new Date(0),
        path: "/",
      },
      // Configuração mínima
      {
        maxAge: 0,
        expires: new Date(0),
        path: "/",
      },
    ]

    // Aplicar todas as configurações
    cookieOptions.forEach((options, index) => {
      response.cookies.set(`admin-token`, "", options)
      console.log(`🍪 [DEBUG] Cookie limpo com configuração ${index + 1}`)
    })

    // Deletar explicitamente
    response.cookies.delete("admin-token")

    console.log("✅ [DEBUG] === LIMPEZA CONCLUÍDA ===")
    return response
  } catch (error) {
    console.error("❌ [DEBUG] Erro na limpeza:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
