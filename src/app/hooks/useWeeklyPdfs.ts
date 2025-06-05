"use client"

import { useState, useEffect } from "react"
import type { WeeklyPdf } from "@/app/lib/storage-optimized"

export function useWeeklyPdfs() {
  const [pdfs, setPdfs] = useState<WeeklyPdf[]>([])
  const [latestPdf, setLatestPdf] = useState<WeeklyPdf | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Carregar PDFs
  const loadPdfs = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch("/api/weekly-pdfs", {
        cache: "no-store",
        headers: {
          "Cache-Control": "no-cache",
        },
      })

      if (!response.ok) {
        throw new Error(`Erro HTTP: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        setPdfs(data.pdfs || [])
        setLatestPdf(data.latest || null)
      } else {
        throw new Error(data.error || "Erro desconhecido")
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro ao carregar PDFs")
    } finally {
      setLoading(false)
    }
  }

  // Adicionar novo PDF
  const addPdf = async (file: File, name: string) => {
    try {
      setSaving(true)
      setError(null)

      const formData = new FormData()
      formData.append("file", file)
      formData.append("name", name)

      const response = await fetch("/api/weekly-pdfs", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Erro ao fazer upload")
      }

      // Recarregar PDFs
      await loadPdfs()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro ao adicionar PDF")
      throw error
    } finally {
      setSaving(false)
    }
  }

  // Deletar PDF
  const deletePdf = async (pdfId: string) => {
    try {
      setSaving(true)
      setError(null)

      const response = await fetch(`/api/weekly-pdfs/${pdfId}`, {
        method: "DELETE",
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Erro ao deletar")
      }

      // Recarregar PDFs
      await loadPdfs()
    } catch (error) {
      setError(error instanceof Error ? error.message : "Erro ao deletar PDF")
      throw error
    } finally {
      setSaving(false)
    }
  }

  // Carregar PDFs ao montar
  useEffect(() => {
    loadPdfs()
  }, [])

  return {
    pdfs,
    latestPdf,
    loading,
    saving,
    error,
    addPdf,
    deletePdf,
    refreshPdfs: loadPdfs,
  }
}
