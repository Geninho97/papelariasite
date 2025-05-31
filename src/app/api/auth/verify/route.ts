import { NextResponse } from "next/server"
import { jwtVerify } from "jose"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    console.log("🔍 [AUTH] Verificando token...")

    // Verificar se a chave secreta está configurada
    const JWT_SECRET = process.env.JWT_SECRET

    if (!JWT_SECRET) {
      console.error("❌ [AUTH] JWT_SECRET não configurado")
      return NextResponse.json(
        { authenticated: false, error: "Configuração de segurança não encontrada" },
        { status: 500 },
      )
    }

    // Extrair cookies do header
    const cookieHeader = request.headers.get("cookie")
    console.log("🍪 [AUTH] Cookie header:", !!cookieHeader)

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

    if (!token) {
      console.log("❌ [AUTH] Token admin-token não encontrado nos cookies")
      return NextResponse.json({ authenticated: false, error: "Token não encontrado" }, { status: 401 })
    }

    try {
      // Verificar JWT usando apenas a variável de ambiente
      const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
      console.log("✅ [AUTH] Token válido")

      // Verificar se o token não expirou (verificação adicional)
      const now = Math.floor(Date.now() / 1000)
      if (payload.exp && payload.exp < now) {
        console.log("❌ [AUTH] Token expirado")
        return NextResponse.json({ authenticated: false, error: "Token expirado" }, { status: 401 })
      }

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
