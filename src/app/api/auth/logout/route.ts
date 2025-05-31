import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST() {
  try {
    console.log("🚪 [AUTH] === LOGOUT INICIADO ===")

    const response = NextResponse.json({ 
      success: true, 
      message: "Logout bem-sucedido",
      debug: "Cookie cleared"
    })

    // Remover cookie de forma mais agressiva
    // Método 1: Expirar o cookie
    response.cookies.set("admin-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0, // Expira imediatamente
      expires: new Date(0), // Data no passado
      path: "/",
    })

    // Método 2: Deletar explicitamente
    response.cookies.delete("admin-token")

    // Método 3: Definir com valor vazio e expiração no passado
    response.cookies.set("admin-token", "deleted", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "lax",
      maxAge: -1, // Valor negativo para forçar expiração
      expires: new Date(Date.now() - 1000), // 1 segundo no passado
      path: "/",
    })

    console.log("✅ [AUTH] === LOGOUT CONCLUÍDO ===")
    console.log("🍪 [AUTH] Cookie admin-token removido")

    return response
  } catch (error) {
    console.error("❌ [AUTH] Erro no logout:", error)
    return NextResponse.json({ 
      error: "Erro interno do servidor", 
      success: false,
      debug: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}
