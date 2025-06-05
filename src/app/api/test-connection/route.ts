import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { S3Client, ListBucketsCommand } from "@aws-sdk/client-s3"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    console.log("🔍 [TEST] === TESTE DE CONEXÃO ===")

    const results: Record<string, any> = {
      supabase: { status: "pending" },
      r2: { status: "pending" },
      env: {
        supabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        supabaseKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY.length > 0,
        r2AccountId: !!process.env.CLOUDFLARE_R2_ACCOUNT_ID,
        r2AccessKey: !!process.env.CLOUDFLARE_R2_ACCESS_KEY_ID && process.env.CLOUDFLARE_R2_ACCESS_KEY_ID.length > 0,
        r2SecretKey:
          !!process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY && process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY.length > 0,
        r2Bucket: !!process.env.CLOUDFLARE_R2_BUCKET_NAME,
      },
    }

    // Testar Supabase
    try {
      console.log("🔄 [TEST] Testando conexão Supabase...")

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

      if (!supabaseUrl || !supabaseKey) {
        throw new Error("Credenciais Supabase não configuradas")
      }

      const supabase = createClient(supabaseUrl, supabaseKey)
      const { data, error } = await supabase.from("products").select("count")

      if (error) throw error

      results.supabase = {
        status: "success",
        message: "Conexão com Supabase estabelecida",
        count: data?.[0]?.count || 0,
      }

      console.log("✅ [TEST] Supabase conectado")
    } catch (error) {
      console.error("❌ [TEST] Erro Supabase:", error)
      results.supabase = {
        status: "error",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      }
    }

    // Testar R2
    try {
      console.log("🔄 [TEST] Testando conexão R2...")

      const r2AccountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID!
      const r2AccessKey = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!
      const r2SecretKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!

      if (!r2AccountId || !r2AccessKey || !r2SecretKey) {
        throw new Error("Credenciais R2 não configuradas")
      }

      const r2Client = new S3Client({
        region: "auto",
        endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId: r2AccessKey,
          secretAccessKey: r2SecretKey,
        },
      })

      const command = new ListBucketsCommand({})
      const response = await r2Client.send(command)

      results.r2 = {
        status: "success",
        message: "Conexão com R2 estabelecida",
        buckets: response.Buckets?.length || 0,
      }

      console.log("✅ [TEST] R2 conectado")
    } catch (error) {
      console.error("❌ [TEST] Erro R2:", error)
      results.r2 = {
        status: "error",
        message: error instanceof Error ? error.message : "Erro desconhecido",
      }
    }

    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("❌ [TEST] Erro geral:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}
