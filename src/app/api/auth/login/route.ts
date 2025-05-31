import { NextResponse } from "next/server"
import { SignJWT } from "jose"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD
    const JWT_SECRET = process.env.JWT_SECRET

    if (!ADMIN_PASSWORD || !JWT_SECRET) {
      return NextResponse.json(
        {
          error: "Configuração de segurança não encontrada",
          success: false,
        },
        { status: 500 },
      )
    }

    const { password } = await request.json()

    if (!password) {
      return NextResponse.json(
        {
          error: "Senha é obrigatória",
          success: false,
        },
        { status: 400 },
      )
    }

    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        {
          error: "Senha incorreta",
          success: false,
        },
        { status: 401 },
      )
    }

    const now = Math.floor(Date.now() / 1000)
    const exp = now + 24 * 60 * 60 // 24 horas

    const token = await new SignJWT({
      admin: true,
      timestamp: Date.now(),
      iat: now,
      exp: exp,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(new TextEncoder().encode(JWT_SECRET))

    const response = NextResponse.json({
      success: true,
      message: "Login bem-sucedido",
    })

    response.cookies.set("admin-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60,
      path: "/",
    })

    return response
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        success: false,
      },
      { status: 500 },
    )
  }
}
