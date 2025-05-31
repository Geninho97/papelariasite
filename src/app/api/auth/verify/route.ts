import { NextResponse } from "next/server"
import { jwtVerify } from "jose"

export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  try {
    console.log("🔍 [AUTH] === VERIFICAÇÃO INICIADA ===")

    // Verificar se a chave secreta está configurada
    const JWT_SECRET = process.env.JWT_SECRET

    if (!JWT_SECRET) {
      console.error("❌ [AUTH] JWT_SECRET não configurado")
      return NextResponse.json(
        {
          authenticated: false,
          error: "Configuração de segurança não encontrada",
          debug: "JWT_SECRET missing",
        },
        { status: 500 },
      )
    }

    console.log("✅ [AUTH] JWT_SECRET configurado")

    // Extrair cookies do header
    const cookieHeader = request.headers.get("cookie")
    console.log("🍪 [AUTH] Cookie header existe:", !!cookieHeader)
    console.log("🍪 [AUTH] Cookie header completo:", cookieHeader)

    if (!cookieHeader) {
      console.log("❌ [AUTH] Nenhum cookie encontrado")
      return NextResponse.json(
        {
          authenticated: false,
          error: "Nenhum cookie encontrado",
          debug: "No cookie header",
        },
        { status: 401 },
      )
    }

    // Extrair token do cookie de forma mais robusta
    const cookies = cookieHeader.split(";").reduce((acc: Record<string, string>, cookie) => {
      const [key, value] = cookie.trim().split("=")
      if (key && value) {
        acc[key] = decodeURIComponent(value)
      }
      return acc
    }, {})

    console.log("🍪 [AUTH] Cookies encontrados:", Object.keys(cookies))

    const token = cookies["admin-token"]
    console.log("🔑 [AUTH] Token admin-token encontrado:", !!token)
    console.log("🔑 [AUTH] Tamanho do token:", token?.length || 0)

    // Verificar se o token não é "deleted" ou vazio
    if (!token || token === "deleted" || token === "") {
      console.log("❌ [AUTH] Token inválido ou removido")
      return NextResponse.json(
        {
          authenticated: false,
          error: "Token não encontrado ou inválido",
          debug: `Token value: ${token}`,
          availableCookies: Object.keys(cookies),
        },
        { status: 401 },
      )
    }

    try {
      console.log("🔍 [AUTH] Verificando JWT...")

      // Verificar JWT usando apenas a variável de ambiente
      const { payload } = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET))
      console.log("✅ [AUTH] Token JWT válido")
      console.log("📋 [AUTH] Payload:", payload)

      // Verificar se o token não expirou (verificação adicional)
      const now = Math.floor(Date.now() / 1000)
      if (payload.exp && payload.exp < now) {
        console.log("❌ [AUTH] Token expirado")
        console.log("⏰ [AUTH] Agora:", now, "Expiração:", payload.exp)
        return NextResponse.json(
          {
            authenticated: false,
            error: "Token expirado",
            debug: `Token expired. Now: ${now}, Exp: ${payload.exp}`,
          },
          { status: 401 },
        )
      }

      console.log("✅ [AUTH] === VERIFICAÇÃO BEM-SUCEDIDA ===")
      return NextResponse.json({
        authenticated: true,
        admin: true,
        debug: "Authentication successful",
      })
    } catch (jwtError) {
      console.error("❌ [AUTH] Erro na verificação JWT:", jwtError)

      // Log mais detalhado do erro JWT
      if (jwtError instanceof Error) {
        console.error("📋 [AUTH] JWT Error name:", jwtError.name)
        console.error("📋 [AUTH] JWT Error message:", jwtError.message)
      }

      return NextResponse.json(
        {
          authenticated: false,
          error: "Token inválido ou expirado",
          debug: `JWT verification failed: ${jwtError instanceof Error ? jwtError.message : "Unknown error"}`,
        },
        { status: 401 },
      )
    }
  } catch (error) {
    console.error("❌ [AUTH] === ERRO GERAL NA VERIFICAÇÃO ===")
    console.error("📋 [AUTH] Erro:", error)

    return NextResponse.json(
      {
        authenticated: false,
        error: "Erro interno do servidor",
        debug: error instanceof Error ? error.message : "Unknown server error",
      },
      { status: 500 },
    )
  }
}
