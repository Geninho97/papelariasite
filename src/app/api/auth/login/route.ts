import { NextResponse } from "next/server"
import { SignJWT } from "jose"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    console.log("🔐 [AUTH] === LOGIN INICIADO ===")

    // Verificar se as variáveis de ambiente estão configuradas
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
    const JWT_SECRET = process.env.JWT_SECRET

    console.log("🔍 [AUTH] ADMIN_PASSWORD configurado:", !!ADMIN_PASSWORD)
    console.log("🔍 [AUTH] JWT_SECRET configurado:", !!JWT_SECRET)

    if (!ADMIN_PASSWORD) {
      console.error("❌ [AUTH] ADMIN_PASSWORD não configurado")
      return NextResponse.json(
        {
          error: "Configuração de segurança não encontrada",
          success: false,
          debug: "ADMIN_PASSWORD missing",
        },
        { status: 500 },
      )
    }

    if (!JWT_SECRET) {
      console.error("❌ [AUTH] JWT_SECRET não configurado")
      return NextResponse.json(
        {
          error: "Configuração de segurança não encontrada",
          success: false,
          debug: "JWT_SECRET missing",
        },
        { status: 500 },
      )
    }

    const { password } = await request.json()
    console.log("📝 [AUTH] Password recebido:", !!password)

    if (!password) {
      return NextResponse.json(
        {
          error: "Senha é obrigatória",
          success: false,
          debug: "No password provided",
        },
        { status: 400 },
      )
    }

    // Verificar senha usando apenas a variável de ambiente
    if (password !== ADMIN_PASSWORD) {
      console.log("❌ [AUTH] Senha incorreta")
      return NextResponse.json(
        {
          error: "Senha incorreta",
          success: false,
          debug: "Password mismatch",
        },
        { status: 401 },
      )
    }

    console.log("✅ [AUTH] Senha correta, criando token...")

    // Criar JWT token usando a chave secreta da variável de ambiente
    const now = Math.floor(Date.now() / 1000)
    const exp = now + 24 * 60 * 60 // 24 horas

    console.log("⏰ [AUTH] Token timestamps - Now:", now, "Exp:", exp)

    const token = await new SignJWT({
      admin: true,
      timestamp: Date.now(),
      iat: now,
      exp: exp,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(new TextEncoder().encode(JWT_SECRET))

    console.log("🔑 [AUTH] Token criado, tamanho:", token.length)

    // Retornar token
    const response = NextResponse.json({
      success: true,
      message: "Login bem-sucedido",
      debug: "Token created successfully",
    })

    // Definir cookie seguro com configurações mais permissivas para debug
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      maxAge: 24 * 60 * 60, // 24 horas
      path: "/",
    }

    console.log("🍪 [AUTH] Configurações do cookie:", cookieOptions)

    response.cookies.set("admin-token", token, cookieOptions)

    console.log("✅ [AUTH] === LOGIN BEM-SUCEDIDO ===")
    return response
  } catch (error) {
    console.error("❌ [AUTH] === ERRO NO LOGIN ===")
    console.error("📋 [AUTH] Erro:", error)

    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        success: false,
        debug: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
