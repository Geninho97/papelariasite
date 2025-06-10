"use client"

import { useState, useEffect } from "react"
import { usePdfCache } from "@/app/lib/pdf-cache"
import { HardDrive, Clock, Trash2, RefreshCw } from 'lucide-react'

export default function PdfCacheInfo() {
  const { getCacheInfo, clearAllCache } = usePdfCache()
  const [cacheInfo, setCacheInfo] = useState<{
    totalPdfs: number
    totalSize: string
    pdfs: Array<{
      name: string
      size: string
      age: string
      expiresIn: string
    }>
  }>({ totalPdfs: 0, totalSize: "0MB", pdfs: [] })

  const refreshCacheInfo = () => {
    setCacheInfo(getCacheInfo())
  }

  useEffect(() => {
    refreshCacheInfo()
    
    // Atualizar a cada 30 segundos
    const interval = setInterval(refreshCacheInfo, 30000)
    return () => clearInterval(interval)
  }, [getCacheInfo])

  const handleClearCache = () => {
    if (confirm("Tem certeza que deseja limpar todo o cache de PDFs? Isso irá forçar o download novamente.")) {
      clearAllCache()
      refreshCacheInfo()
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <HardDrive className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Cache de PDFs (24h)</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={refreshCacheInfo}
            className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
            title="Atualizar informações"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
          <button
            onClick={handleClearCache}
            className="p-2 text-red-600 hover:text-red-800 transition-colors"
            title="Limpar cache"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Estatísticas gerais */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{cacheInfo.totalPdfs}</div>
          <div className="text-sm text-blue-700">PDFs em Cache</div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{cacheInfo.totalSize}</div>
          <div className="text-sm text-green-700">Espaço Usado</div>
        </div>
      </div>

      {/* Lista de PDFs em cache */}
      {cacheInfo.pdfs.length > 0 ? (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">PDFs Armazenados:</h4>
          {cacheInfo.pdfs.map((pdf, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="font-medium text-gray-800">{pdf.name}</div>
                <div className="text-sm text-gray-600">
                  {pdf.size} • Idade: {pdf.age}
                </div>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Clock className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">Expira em {pdf.expiresIn}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <HardDrive className="h-12 w-12 mx-auto mb-3 text-gray-400" />
          <p>Nenhum PDF em cache</p>
          <p className="text-sm mt-1">Os PDFs serão cacheados automaticamente quando visualizados</p>
        </div>
      )}

      {/* Informações sobre o cache */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="text-sm text-gray-600 space-y-1">
          <p>• PDFs são armazenados localmente por 24 horas</p>
          <p>• Cache máximo: 50MB (limpa automaticamente quando necessário)</p>
          <p>• Reduz tempo de carregamento e economiza largura de banda</p>
          <p>• Cache é específico para cada dispositivo/navegador</p>
        </div>
      </div>
    </div>
  )
}
