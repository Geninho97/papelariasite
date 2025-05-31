import { NextResponse } from "next/server"
import { jwtVerify } from "jose"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    const JWT_SECRET = process.env.JWT_SECRET

    if (!JWT_SECRET) {
      return NextResponse.json(
        {
          authenticated: false,
          error: "Configuração de segurança não encontrada",
        },
        { status: 500 },
      )
    }

    const cookieHeader = request.headers.get("cookie")

    if (!cookieHeader) {
      return NextResponse.json(
        {
          authenticated: false,
          error: "Nenhum cookie encontrado",
        },
        { status: 401 },
      )
    }

    const cookies = cookieHeader.split(";").reduce((acc: Record<string, string>, cookie) => {
      const [key, value] = cookie.trim().split("=")
      if (key && value) {
        acc[key] = decodeURIComponent(value)
      }
      return acc
    }, {})

    const token = cookies["admin-token"]

    if (!token || token === "deleted" || token === "") {
      return NextResponse.json(
        {
          authenticated: false,
          error: "Token não encontrado ou inválido",
        },
        { status: 401 },
      )
    }

    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))

      const now = Math.floor(Date.now() / 1000)
      if (payload.exp && payload.exp < now) {
        return NextResponse.json(
          {
            authenticated: false,
            error: "Token expirado",
          },
          { status: 401 },
        )
      }

      return NextResponse.json({
        authenticated: true,
        admin: true,
      })
    } catch (jwtError) {
      return NextResponse.json(
        {
          authenticated: false,
          error: "Token inválido ou expirado",
        },
        { status: 401 },
      )
    }
  } catch (error) {
    return NextResponse.json(
      {
        authenticated: false,
        error: "Erro interno do servidor",
      },
      { status: 500 },
    )
  }
}
