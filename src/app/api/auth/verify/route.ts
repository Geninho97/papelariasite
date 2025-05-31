import { NextResponse } from "next/server"
import { jwtVerify } from "jose"

export const dynamic = "force-dynamic"

const JWT_SECRET = process.env.JWT_SECRET || "papelaria-secret-key-super-segura-2025"

export async function GET(request: Request) {
  try {
    console.log("🔍 [AUTH] Verificando token...")

    // Extrair cookies do header
    const cookieHeader = request.headers.get("cookie")
    console.log("🍪 [AUTH] Cookie header:", cookieHeader)

    if (!cookieHeader) {
      console.log("❌ [AUTH] Nenhum cookie encontrado")
      return NextResponse.json({ authenticated: false, error: "Nenhum cookie encontrado" }, { status: 401 })
    }

    // Extrair token do cookie
    const cookies = cookieHeader.split(";").reduce((acc: Record<string, string>, cookie) => {
      const [key, value] = cookie.trim().split("=")
      if (key && value) {
        acc[key] = decodeURIComponent(value)
      }
      return acc
    }, {})

    const token = cookies["admin-token"]
    console.log("🔑 [AUTH] Token encontrado:", !!token)
    console.log("📏 [AUTH] Tamanho do token:", token?.length || 0)

    if (!token) {
      console.log("❌ [AUTH] Token admin-token não encontrado nos cookies")
      return NextResponse.json({ authenticated: false, error: "Token não encontrado" }, { status: 401 })
    }

    try {
      // Verificar JWT
      const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
      console.log("✅ [AUTH] Token válido, payload:", payload)

      return NextResponse.json({ authenticated: true, admin: true })
    } catch (jwtError) {
      console.error("❌ [AUTH] Erro na verificação JWT:", jwtError)
      return NextResponse.json({ authenticated: false, error: "Token inválido ou expirado" }, { status: 401 })
    }
  } catch (error) {
    console.error("❌ [AUTH] Erro geral na verificação:", error)
    return NextResponse.json({ authenticated: false, error: "Erro interno do servidor" }, { status: 500 })
  }
}
