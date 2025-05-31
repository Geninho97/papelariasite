import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logout bem-sucedido",
    })

    response.cookies.set("admin-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
      expires: new Date(0),
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
