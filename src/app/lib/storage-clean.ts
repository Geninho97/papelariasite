import { createClient } from "@supabase/supabase-js"
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"

// Configurações
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Configuração R2 com logs detalhados
console.log("🔧 [R2] Inicializando cliente R2...")

const r2AccountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID
const r2AccessKey = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
const r2SecretKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY

if (!r2AccountId || !r2AccessKey || !r2SecretKey) {
  console.error("❌ [R2] Credenciais R2 não configuradas:")
  console.error("   CLOUDFLARE_R2_ACCOUNT_ID:", !!r2AccountId)
  console.error("   CLOUDFLARE_R2_ACCESS_KEY_ID:", !!r2AccessKey)
  console.error("   CLOUDFLARE_R2_SECRET_ACCESS_KEY:", !!r2SecretKey)
}

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${r2AccountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: r2AccessKey!,
    secretAccessKey: r2SecretKey!,
  },
  forcePathStyle: false,
})

// Nome do bucket atualizado
const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || "coutyfil-assets"
console.log(`🪣 [R2] Usando bucket: ${BUCKET_NAME}`)

// URL pública do R2 - ATUALIZADA COM SUA URL REAL
const R2_PUBLIC_URL = "https://pub-bd3bd83c1f864ad880a287c264da1ae3.r2.dev"

console.log("🔧 [R2] Configuração:")
console.log("   Bucket:", BUCKET_NAME)
console.log("   Endpoint:", `https://${r2AccountId}.r2.cloudflarestorage.com`)
console.log("   Public URL:", R2_PUBLIC_URL)

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  featured: boolean
  order: number
  created_at?: string
  updated_at?: string
}

export interface WeeklyPdf {
  id: string
  name: string
  url: string
  uploadDate: string
  week: string
  year: number
  file_path: string
}

// ===== PRODUTOS =====

export async function loadProductsFromCloud(): Promise<Product[]> {
  try {
    console.log("🔄 Carregando produtos do Supabase...")

    const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("❌ Erro Supabase:", error)
      return []
    }

    console.log(`✅ ${data?.length || 0} produtos carregados`)
    return data || []
  } catch (error) {
    console.error("❌ Erro ao carregar produtos:", error)
    return []
  }
}

export async function saveProductsToCloud(products: Product[]): Promise<void> {
  try {
    console.log("💾 Salvando produtos no Supabase...")

    // Upsert produtos (insert ou update)
    const { error } = await supabase.from("products").upsert(
      products.map((product) => ({
        ...product,
        updated_at: new Date().toISOString(),
      })),
    )

    if (error) throw error

    console.log(`✅ ${products.length} produtos salvos`)
  } catch (error) {
    console.error("❌ Erro ao salvar produtos:", error)
    throw error
  }
}

// ===== IMAGENS =====

export async function uploadImageToCloud(file: File): Promise<string> {
  try {
    console.log("📸 [R2] Iniciando upload de imagem...")
    console.log(`📁 [R2] Arquivo: ${file.name} (${file.size} bytes)`)

    const timestamp = Date.now()
    const extension = file.name.split(".").pop()
    const fileName = `products/image-${timestamp}.${extension}`

    console.log(`📝 [R2] Nome do arquivo: ${fileName}`)
    console.log(`🪣 [R2] Bucket: ${BUCKET_NAME}`)

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    console.log(`📦 [R2] Buffer criado: ${buffer.length} bytes`)

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    })

    console.log("🚀 [R2] Enviando comando PutObject...")

    await r2Client.send(command)

    console.log("✅ [R2] Upload para R2 concluído")

    const imageUrl = `${R2_PUBLIC_URL}/${fileName}`

    console.log("🔗 [R2] URL gerada:", imageUrl)

    return imageUrl
  } catch (error) {
    console.error("💥 [R2] ERRO DETALHADO NO UPLOAD:")
    console.error("💥 [R2] Tipo do erro:", error instanceof Error ? error.constructor.name : typeof error)
    console.error("💥 [R2] Mensagem:", error instanceof Error ? error.message : String(error))

    if (error instanceof Error && error.stack) {
      console.error("💥 [R2] Stack trace:", error.stack)
    }

    // Verificar se é erro de credenciais
    if (error instanceof Error) {
      if (error.message.includes("credentials") || error.message.includes("access")) {
        throw new Error(
          "Erro de credenciais R2: Verifique CLOUDFLARE_R2_ACCESS_KEY_ID e CLOUDFLARE_R2_SECRET_ACCESS_KEY",
        )
      }
      if (error.message.includes("bucket") || error.message.includes("NoSuchBucket")) {
        throw new Error(`Bucket '${BUCKET_NAME}' não encontrado. Verifique se o bucket existe no Cloudflare R2`)
      }
      if (error.message.includes("endpoint") || error.message.includes("network")) {
        throw new Error("Erro de conexão com R2: Verifique CLOUDFLARE_R2_ACCOUNT_ID")
      }
    }

    throw error
  }
}

// ===== PDFs SEMANAIS =====

export async function loadWeeklyPdfsFromCloud(): Promise<WeeklyPdf[]> {
  try {
    console.log("📄 Carregando PDFs do Supabase...")

    const { data, error } = await supabase.from("weekly_pdfs").select("*").order("uploadDate", { ascending: false })

    if (error) {
      console.error("❌ Erro Supabase PDFs:", error)
      return []
    }

    console.log(`✅ ${data?.length || 0} PDFs carregados`)
    return data || []
  } catch (error) {
    console.error("❌ Erro ao carregar PDFs:", error)
    return []
  }
}

export async function addWeeklyPdf(file: File, name: string): Promise<WeeklyPdf> {
  try {
    console.log("📄 Upload de PDF para Cloudflare R2...")

    const timestamp = Date.now()
    const fileName = `weekly-pdfs/pdf-${timestamp}.pdf`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload para R2
    await r2Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: "application/pdf",
      }),
    )

    const pdfUrl = `${R2_PUBLIC_URL}/${fileName}`

    // Salvar metadata no Supabase
    const now = new Date()
    const newPdf: WeeklyPdf = {
      id: timestamp.toString(),
      name,
      url: pdfUrl,
      uploadDate: now.toISOString(),
      week: `${now.getDate()}/${now.getMonth() + 1}`,
      year: now.getFullYear(),
      file_path: fileName,
    }

    const { error } = await supabase.from("weekly_pdfs").insert([newPdf])

    if (error) throw error

    console.log("✅ PDF salvo:", newPdf.name)
    return newPdf
  } catch (error) {
    console.error("❌ Erro no upload de PDF:", error)
    throw error
  }
}

export async function deleteWeeklyPdf(pdfId: string): Promise<void> {
  try {
    console.log("🗑️ Deletando PDF...")

    // Buscar PDF para obter file_path
    const { data: pdf } = await supabase.from("weekly_pdfs").select("file_path").eq("id", pdfId).single()

    if (pdf?.file_path) {
      // Deletar do R2
      await r2Client.send(
        new DeleteObjectCommand({
          Bucket: BUCKET_NAME,
          Key: pdf.file_path,
        }),
      )
    }

    // Deletar do Supabase
    const { error } = await supabase.from("weekly_pdfs").delete().eq("id", pdfId)

    if (error) throw error

    console.log("✅ PDF deletado")
  } catch (error) {
    console.error("❌ Erro ao deletar PDF:", error)
    throw error
  }
}

export async function getLatestWeeklyPdf(): Promise<WeeklyPdf | null> {
  try {
    const { data, error } = await supabase
      .from("weekly_pdfs")
      .select("*")
      .order("uploadDate", { ascending: false })
      .limit(1)
      .single()

    if (error || !data) return null

    return data
  } catch (error) {
    return null
  }
}
