"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, Link, ImageIcon, Loader2 } from "lucide-react"

interface ImageUploadProps {
  value?: string
  onChange: (imageUrl: string) => void
  className?: string
}

export default function ImageUpload({ value, onChange, className = "" }: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadMethod, setUploadMethod] = useState<"upload" | "url">("upload")
  const [urlInput, setUrlInput] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    // Validar tipo de arquivo
    if (!file.type.startsWith("image/")) {
      setUploadError("Por favor, selecione apenas arquivos de imagem (JPG, PNG, GIF, etc.)")
      return
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("A imagem deve ter no máximo 5MB")
      return
    }

    try {
      setIsUploading(true)
      setUploadError(null)

      // Criar FormData para enviar o arquivo
      const formData = new FormData()
      formData.append("file", file)

      // Enviar para a API de upload
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || "Erro ao fazer upload da imagem")
      }

      // Atualizar com a URL da imagem
      onChange(result.url)
    } catch (error) {
      console.error("Erro no upload:", error)
      setUploadError(
        error instanceof Error
          ? `Erro: ${error.message}`
          : "Erro ao fazer upload da imagem. Tente novamente ou use URL.",
      )
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
      setUrlInput("")
    }
  }

  const removeImage = () => {
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Method Toggle */}
      <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg">
        <button
          type="button"
          onClick={() => setUploadMethod("upload")}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
            uploadMethod === "upload" ? "bg-white text-green-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <Upload className="h-4 w-4" />
          <span>Upload</span>
        </button>
        <button
          type="button"
          onClick={() => setUploadMethod("url")}
          className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
            uploadMethod === "url" ? "bg-white text-green-600 shadow-sm" : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <Link className="h-4 w-4" />
          <span>URL</span>
        </button>
      </div>

      {/* Current Image Preview */}
      {value && (
        <div className="relative">
          <img
            src={value || "/placeholder.svg"}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg border border-gray-300"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Upload Method */}
      {uploadMethod === "upload" && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
            id="image-upload"
            disabled={isUploading}
          />
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isUploading
                ? "border-blue-400 bg-blue-50"
                : dragActive
                  ? "border-green-500 bg-green-50"
                  : value
                    ? "border-gray-300 bg-gray-50"
                    : "border-gray-400 bg-gray-50 hover:border-green-500 hover:bg-green-50 cursor-pointer"
            }`}
            onClick={() => !isUploading && fileInputRef.current?.click()}
          >
            <div className="space-y-4">
              {isUploading ? (
                <div className="space-y-3">
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                  </div>
                  <p className="text-lg font-medium text-gray-700">A fazer upload...</p>
                </div>
              ) : (
                <>
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-700">
                      {value ? "Clique para alterar a imagem" : "Clique ou arraste uma imagem"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF até 5MB</p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Error message */}
          {uploadError && (
            <div className="mt-2 text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
              <p className="font-medium">Erro no upload:</p>
              <p>{uploadError}</p>
              <p className="mt-1 text-xs">Tente usar a opção URL como alternativa.</p>
            </div>
          )}
        </div>
      )}

      {/* URL Method */}
      {uploadMethod === "url" && (
        <div className="space-y-3">
          <div className="flex space-x-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              disabled={!urlInput.trim()}
              className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Adicionar
            </button>
          </div>
          <p className="text-xs text-gray-500">Cole o URL de uma imagem da internet</p>
        </div>
      )}
    </div>
  )
}
