import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST() {
  try {
    console.log("🚪 [AUTH] Logout realizado")

    const response = NextResponse.json({ success: true, message: "Logout bem-sucedido" })

    // Remover cookie
    response.cookies.set("admin-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // Expira imediatamente
      path: "/",
    })

    return response
  } catch (error) {
    console.error("❌ [AUTH] Erro no logout:", error)
    return NextResponse.json({ error: "Erro interno do servidor", success: false }, { status: 500 })
  }
}
