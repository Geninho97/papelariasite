import { createClient } from "@supabase/supabase-js"
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"

// Configurações
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.CLOUDFLARE_R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME!

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
    console.log("📸 Upload de imagem para Cloudflare R2...")

    const timestamp = Date.now()
    const extension = file.name.split(".").pop()
    const fileName = `products/image-${timestamp}.${extension}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    await r2Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileName,
        Body: buffer,
        ContentType: file.type,
      }),
    )

    const imageUrl = `https://pub-896eb014a0a0b9563d676660ab788b62.r2.dev/${fileName}`

    console.log("✅ Imagem enviada:", imageUrl)
    return imageUrl
  } catch (error) {
    console.error("❌ Erro no upload de imagem:", error)
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

    const pdfUrl = `https://pub-896eb014a0a0b9563d676660ab788b62.r2.dev/${fileName}`

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

// ===== MIGRAÇÃO =====

export async function migrateFromBlob(): Promise<void> {
  try {
    console.log("🔄 Iniciando migração do Vercel Blob...")

    // Carregar dados atuais do Blob
    const blobProducts = await import("./storage").then((m) => m.loadProductsFromCloud())
    const blobPdfs = await import("./storage").then((m) => m.loadWeeklyPdfsFromCloud())

    console.log(`📦 Encontrados: ${blobProducts.length} produtos, ${blobPdfs.length} PDFs`)

    // Migrar produtos
    if (blobProducts.length > 0) {
      await saveProductsToCloud(blobProducts)
      console.log("✅ Produtos migrados")
    }

    // Migrar PDFs (apenas metadata, arquivos ficam no Blob por enquanto)
    if (blobPdfs.length > 0) {
      const { error } = await supabase.from("weekly_pdfs").upsert(blobPdfs)

      if (error) throw error
      console.log("✅ PDFs migrados")
    }

    console.log("🎉 Migração concluída!")
  } catch (error) {
    console.error("❌ Erro na migração:", error)
    throw error
  }
}
