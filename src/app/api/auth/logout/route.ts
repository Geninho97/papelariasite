import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST() {
  try {
    console.log("🚪 [AUTH] Logout realizado")

    const response = NextResponse.json({ success: true, message: "Logout bem-sucedido" })

    // Remover cookie de forma segura
    response.cookies.set("admin-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Expira imediatamente
      path: "/",
      // Adicionar domain apenas em produção se necessário
      ...(process.env.NODE_ENV === "production" && { domain: process.env.VERCEL_URL }),
    })

    return response
  } catch (error) {
    console.error("❌ [AUTH] Erro no logout:", error)
    return NextResponse.json({ error: "Erro interno do servidor", success: false }, { status: 500 })
  }
}
