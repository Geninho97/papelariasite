import { NextResponse } from "next/server"
import { jwtVerify } from "jose"

export const dynamic = "force-dynamic"

const JWT_SECRET = process.env.JWT_SECRET || "papelaria-secret-key-super-segura-2025"

export async function GET(request: Request) {
  try {
    console.log("🔍 [AUTH] Verificando token...")

    const token = request.headers.get("cookie")?.split("admin-token=")[1]?.split(";")[0]

    if (!token) {
      return NextResponse.json({ authenticated: false, error: "Token não encontrado" }, { status: 401 })
    }

    // Verificar JWT
    await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))

    console.log("✅ [AUTH] Token válido")
    return NextResponse.json({ authenticated: true })
  } catch (error) {
    console.error("❌ [AUTH] Token inválido:", error)
    return NextResponse.json({ authenticated: false, error: "Token inválido" }, { status: 401 })
  }
}
