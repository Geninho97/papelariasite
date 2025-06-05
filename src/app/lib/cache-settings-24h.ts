// Configuração de cache otimizada para atualizações diárias
export const CACHE_SETTINGS_24H = {
  // Tempo que o cache é considerado "fresco" (não verifica database)
  FRESH_TIME: {
    PRODUCTS: 6 * 60 * 60 * 1000, // 6 horas - só verifica mudanças 4x por dia
    PDFS: 12 * 60 * 60 * 1000, // 12 horas - PDFs mudam ainda menos
    IMAGES: 7 * 24 * 60 * 60 * 1000, // 7 dias - imagens raramente mudam
  },

  // Tempo máximo antes de forçar reload da database
  MAX_AGE: {
    PRODUCTS: 24 * 60 * 60 * 1000, // 24 horas - cache válido por 1 dia completo
    PDFS: 48 * 60 * 60 * 1000, // 48 horas - PDFs podem ficar 2 dias
    IMAGES: 30 * 24 * 60 * 60 * 1000, // 30 dias - imagens ficam 1 mês
  },

  // Intervalo para verificar mudanças em background (menos frequente)
  BACKGROUND_CHECK: 5 * 60 * 1000, // 5 minutos - verifica menos vezes
}

// Configuração ainda mais agressiva para economia máxima
export const ULTRA_AGGRESSIVE_CACHE = {
  FRESH_TIME: {
    PRODUCTS: 12 * 60 * 60 * 1000, // 12 horas - só verifica 2x por dia
    PDFS: 24 * 60 * 60 * 1000, // 24 horas - verifica 1x por dia
    IMAGES: 7 * 24 * 60 * 60 * 1000, // 7 dias
  },
  MAX_AGE: {
    PRODUCTS: 48 * 60 * 60 * 1000, // 48 horas - cache válido por 2 dias
    PDFS: 7 * 24 * 60 * 60 * 1000, // 7 dias
    IMAGES: 30 * 24 * 60 * 60 * 1000, // 30 dias
  },
  BACKGROUND_CHECK: 10 * 60 * 1000, // 10 minutos
}

// Função para converter tempo em formato legível
export function formatCacheTime(milliseconds: number): string {
  const hours = Math.floor(milliseconds / (60 * 60 * 1000))
  const days = Math.floor(hours / 24)

  if (days > 0) {
    return `${days} dia${days > 1 ? "s" : ""}`
  }
  return `${hours} hora${hours > 1 ? "s" : ""}`
}

// Estatísticas do cache
export function getCacheInfo() {
  return {
    products: {
      freshTime: formatCacheTime(CACHE_SETTINGS_24H.FRESH_TIME.PRODUCTS),
      maxAge: formatCacheTime(CACHE_SETTINGS_24H.MAX_AGE.PRODUCTS),
      description: "Produtos verificados 4x por dia, cache válido por 24h",
    },
    pdfs: {
      freshTime: formatCacheTime(CACHE_SETTINGS_24H.FRESH_TIME.PDFS),
      maxAge: formatCacheTime(CACHE_SETTINGS_24H.MAX_AGE.PDFS),
      description: "PDFs verificados 2x por dia, cache válido por 48h",
    },
    images: {
      freshTime: formatCacheTime(CACHE_SETTINGS_24H.FRESH_TIME.IMAGES),
      maxAge: formatCacheTime(CACHE_SETTINGS_24H.MAX_AGE.IMAGES),
      description: "Imagens verificadas 1x por semana, cache válido por 30 dias",
    },
  }
}
