import { NextResponse } from "next/server"
import { SignJWT } from "jose"

export const dynamic = "force-dynamic"

// Senha segura no backend (variável de ambiente)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Papelaria2025"
const JWT_SECRET = process.env.JWT_SECRET || "papelaria-secret-key-super-segura-2025"

export async function POST(request: Request) {
  try {
    console.log("🔐 [AUTH] Tentativa de login...")

    const { password } = await request.json()

    if (!password) {
      return NextResponse.json({ error: "Senha é obrigatória", success: false }, { status: 400 })
    }

    // Verificar senha
    if (password !== ADMIN_PASSWORD) {
      console.log("❌ [AUTH] Senha incorreta")
      return NextResponse.json({ error: "Senha incorreta", success: false }, { status: 401 })
    }

    console.log("✅ [AUTH] Login bem-sucedido")

    // Criar JWT token
    const token = await new SignJWT({ admin: true, timestamp: Date.now() })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(new TextEncoder().encode(JWT_SECRET))

    // Retornar token
    const response = NextResponse.json({ success: true, message: "Login bem-sucedido" })

    // Definir cookie seguro com configurações mais específicas
    response.cookies.set("admin-token", token, {
      httpOnly: true, // Não acessível via JavaScript
      secure: process.env.NODE_ENV === "production", // HTTPS em produção
      sameSite: "lax", // Mudança de "strict" para "lax" para melhor compatibilidade
      maxAge: 24 * 60 * 60, // 24 horas
      path: "/",
      domain: process.env.NODE_ENV === "production" ? ".vercel.app" : undefined, // Domain para produção
    })

    return response
  } catch (error) {
    console.error("❌ [AUTH] Erro no login:", error)
    return NextResponse.json({ error: "Erro interno do servidor", success: false }, { status: 500 })
  }
}
