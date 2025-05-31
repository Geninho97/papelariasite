import { NextResponse } from "next/server"
import { SignJWT } from "jose"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    console.log("🔐 [AUTH] Tentativa de login...")

    // Verificar se as variáveis de ambiente estão configuradas
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
    const JWT_SECRET = process.env.JWT_SECRET

    if (!ADMIN_PASSWORD) {
      console.error("❌ [AUTH] ADMIN_PASSWORD não configurado")
      return NextResponse.json({ error: "Configuração de segurança não encontrada", success: false }, { status: 500 })
    }

    if (!JWT_SECRET) {
      console.error("❌ [AUTH] JWT_SECRET não configurado")
      return NextResponse.json({ error: "Configuração de segurança não encontrada", success: false }, { status: 500 })
    }

    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: "Senha é obrigatória", success: false }, { status: 400 })
    }

    // Verificar senha usando apenas a variável de ambiente
    if (password !== ADMIN_PASSWORD) {
      console.log("❌ [AUTH] Senha incorreta")
      return NextResponse.json({ error: "Senha incorreta", success: false }, { status: 401 })
    }

    console.log("✅ [AUTH] Login bem-sucedido")

    // Criar JWT token usando a chave secreta da variável de ambiente
    const token = await new SignJWT({
      admin: true,
      timestamp: Date.now(),
      // Adicionar mais informações de segurança
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 horas
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(new TextEncoder().encode(JWT_SECRET))

    // Retornar token
    const response = NextResponse.json({ success: true, message: "Login bem-sucedido" })

    // Definir cookie seguro
    response.cookies.set("admin-token", token, {
      httpOnly: true, // Não acessível via JavaScript
      secure: process.env.NODE_ENV === "production", // HTTPS em produção
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 24 horas
      path: "/",
      // Adicionar domain apenas em produção se necessário
      ...(process.env.NODE_ENV === "production" && { domain: process.env.VERCEL_URL }),
    })

    return response
  } catch (error) {
    console.error("❌ [AUTH] Erro no login:", error)
    return NextResponse.json({ error: "Erro interno do servidor", success: false }, { status: 500 })
  }
}
