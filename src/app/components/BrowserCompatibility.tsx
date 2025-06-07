"use client"

import { useEffect } from "react"
import { applyCompatibilityStyles } from "@/app/lib/browser-compatibility"

export default function BrowserCompatibility() {
  useEffect(() => {
    // Aplicar estilos de compatibilidade quando o componente montar
    applyCompatibilityStyles()
  }, [])

  return null // Este componente não renderiza nada visualmente
}
