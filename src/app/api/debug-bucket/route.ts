import { NextResponse } from "next/server"
import { S3Client, ListBucketsCommand, HeadBucketCommand } from "@aws-sdk/client-s3"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    console.log("🔍 [DEBUG-BUCKET] === DIAGNÓSTICO DE BUCKET R2 ===")

    // Verificar variáveis de ambiente
    const r2AccountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID
    const r2AccessKey = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
    const r2SecretKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
    const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || "coutyfil-assets"

    console.log("🔑 [DEBUG-BUCKET] Verificando variáveis:")
    console.log(`   CLOUDFLARE_R2_ACCOUNT_ID: ${r2AccountId ? "✅" : "❌"} (${r2AccountId?.length || 0} chars)`)
    console.log(`   CLOUDFLARE_R2_ACCESS_KEY_ID: ${r2AccessKey ? "✅" : "❌"} (${r2AccessKey?.length || 0} chars)`)
    console.log(`   CLOUDFLARE_R2_SECRET_ACCESS_KEY: ${r2SecretKey ? "✅" : "❌"} (${r2SecretKey?.length || 0} chars)`)
    console.log(`   CLOUDFLARE_R2_BUCKET_NAME: ${bucketName ? "✅" : "❌"} (${bucketName})`)

    if (!r2AccountId || !r2AccessKey || !r2SecretKey) {
      return NextResponse.json({
        success: false,
        error: "Credenciais R2 incompletas",
        missingVars: {
          accountId: !r2AccountId,
          accessKey: !r2AccessKey,
          secretKey: !r2SecretKey,
        },
      })
    }

    // Criar cliente R2
    console.log("🔄 [DEBUG-BUCKET] Criando cliente R2...")
    const r2Client = new S3Client({
      region: "auto",
      endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: r2AccessKey,
        secretAccessKey: r2SecretKey,
      },
    })

    // Listar todos os buckets
    console.log("🔄 [DEBUG-BUCKET] Listando buckets...")
    const listCommand = new ListBucketsCommand({})
    const listResponse = await r2Client.send(listCommand)

    const buckets = listResponse.Buckets || []
    console.log(`✅ [DEBUG-BUCKET] ${buckets.length} buckets encontrados:`)
    buckets.forEach((bucket) => {
      console.log(`   - ${bucket.Name}`)
    })

    // Verificar se o bucket específico existe
    console.log(`🔄 [DEBUG-BUCKET] Verificando bucket '${bucketName}'...`)
    let bucketExists = false
    let bucketError = null

    try {
      const headCommand = new HeadBucketCommand({
        Bucket: bucketName,
      })
      await r2Client.send(headCommand)
      bucketExists = true
      console.log(`✅ [DEBUG-BUCKET] Bucket '${bucketName}' existe!`)
    } catch (error) {
      bucketError = error instanceof Error ? error.message : String(error)
      console.error(`❌ [DEBUG-BUCKET] Erro ao verificar bucket:`, bucketError)
    }

    return NextResponse.json({
      success: true,
      buckets: buckets.map((b) => b.Name),
      targetBucket: bucketName,
      targetBucketExists: bucketExists,
      targetBucketError: bucketError,
      allBucketsCount: buckets.length,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("💥 [DEBUG-BUCKET] ERRO GERAL:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
