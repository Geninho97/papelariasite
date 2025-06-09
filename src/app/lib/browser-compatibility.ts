// Utilitário para detectar navegadores antigos e aplicar fallbacks
export function detectOldBrowser(): boolean {
  if (typeof window === "undefined") return false

  const userAgent = navigator.userAgent
  const isChrome = /Chrome\/(\d+)/.test(userAgent)
  const chromeVersion = isChrome ? Number.parseInt(userAgent.match(/Chrome\/(\d+)/)?.[1] || "0") : 0

  // Chrome versões antigas (< 110)
  if (isChrome && chromeVersion < 110) return true

  // Internet Explorer
  if (/MSIE|Trident/.test(userAgent)) return true

  // Firefox antigo (< 100)
  const isFirefox = /Firefox\/(\d+)/.test(userAgent)
  const firefoxVersion = isFirefox ? Number.parseInt(userAgent.match(/Firefox\/(\d+)/)?.[1] || "0") : 0
  if (isFirefox && firefoxVersion < 100) return true

  // Safari antigo (< 15)
  const isSafari = /Safari\/(\d+)/.test(userAgent) && !/Chrome/.test(userAgent)
  const safariVersion = isSafari ? Number.parseInt(userAgent.match(/Version\/(\d+)/)?.[1] || "0") : 0
  if (isSafari && safariVersion < 15) return true

  return false
}

export function detectWindows7(): boolean {
  if (typeof window === "undefined") return false

  const userAgent = navigator.userAgent
  // Detectar Windows 7 especificamente
  return /Windows NT 6\.1/.test(userAgent)
}

export function getBrowserInfo(): { name: string; version: number; isOld: boolean; isWindows7: boolean } {
  if (typeof window === "undefined") return { name: "unknown", version: 0, isOld: false, isWindows7: false }

  const userAgent = navigator.userAgent
  let name = "unknown"
  let version = 0
  const isWindows7 = detectWindows7()

  if (/Chrome\/(\d+)/.test(userAgent)) {
    name = "Chrome"
    version = Number.parseInt(userAgent.match(/Chrome\/(\d+)/)?.[1] || "0")
  } else if (/Firefox\/(\d+)/.test(userAgent)) {
    name = "Firefox"
    version = Number.parseInt(userAgent.match(/Firefox\/(\d+)/)?.[1] || "0")
  } else if (/Safari\/(\d+)/.test(userAgent) && !/Chrome/.test(userAgent)) {
    name = "Safari"
    version = Number.parseInt(userAgent.match(/Version\/(\d+)/)?.[1] || "0")
  } else if (/MSIE|Trident/.test(userAgent)) {
    name = "Internet Explorer"
    version = Number.parseInt(userAgent.match(/MSIE (\d+)/)?.[1] || "0")
  }

  // Detecção mais específica para Chrome no Windows 7
  if (isWindows7 && name === "Chrome") {
    document.documentElement.classList.add("legacy-chrome")
  }

  return {
    name,
    version,
    isOld: detectOldBrowser(),
    isWindows7,
  }
}

export function applyCompatibilityStyles(): void {
  if (typeof window === "undefined") return

  const browserInfo = getBrowserInfo()

  if (browserInfo.isOld || browserInfo.isWindows7) {
    // Adicionar classe para navegadores antigos ou Windows 7
    document.documentElement.classList.add("legacy-browser")

    if (browserInfo.isWindows7) {
      document.documentElement.classList.add("windows-7")
    }

    document.documentElement.classList.add(`legacy-${browserInfo.name.toLowerCase().replace(" ", "-")}`)

    // Criar e injetar CSS de fallback
    const fallbackCSS = `
  .legacy-browser {
    /* Fallbacks para gradientes */
    --gradient-fallback-red: #fee2e2;
    --gradient-fallback-green: #f0fdf4;
    --gradient-fallback-blue: #dbeafe;
    --gradient-fallback-yellow: #fef3c7;
  }
  
  /* FORÇAR LAYOUT HORIZONTAL NO WINDOWS 7 - ULTRA ESPECÍFICO */
  .windows-7 section#inicio {
    min-height: 100vh !important;
    display: -webkit-box !important;
    display: -ms-flexbox !important;
    display: flex !important;
    -webkit-box-align: center !important;
    -ms-flex-align: center !important;
    align-items: center !important;
    /* GRADIENTE SUAVE COMPATÍVEL COM WINDOWS 7 - ROSA/SALMÃO */
    background: #fdf2f8 !important;
    background: -webkit-linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%) !important;
    background: -moz-linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%) !important;
    background: -o-linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%) !important;
    background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%) !important;
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#fdf2f8', endColorstr='#fbcfe8', GradientType=1) !important;
  }

  .windows-7 section#inicio .container {
    width: 100% !important;
    max-width: 1400px !important;
    margin: 0 auto !important;
    padding: 0 2rem !important;
  }

  .windows-7 section#inicio .container > .grid {
    display: -webkit-box !important;
    display: -ms-flexbox !important;
    display: flex !important;
    -webkit-box-orient: horizontal !important;
    -webkit-box-direction: normal !important;
    -ms-flex-direction: row !important;
    flex-direction: row !important;
    -webkit-box-align: center !important;
    -ms-flex-align: center !important;
    align-items: center !important;
    -webkit-box-pack: justify !important;
    -ms-flex-pack: justify !important;
    justify-content: space-between !important;
    gap: 4rem !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  .windows-7 section#inicio .container > .grid > div:first-child {
    -webkit-box-flex: 0 !important;
    -ms-flex: 0 0 auto !important;
    flex: 0 0 auto !important;
    width: 500px !important;
    max-width: 500px !important;
    min-width: 400px !important;
    text-align: left !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .windows-7 section#inicio .container > .grid > div:last-child {
    -webkit-box-flex: 1 !important;
    -ms-flex: 1 1 auto !important;
    flex: 1 1 auto !important;
    max-width: 600px !important;
    padding: 0 !important;
    margin: 0 !important;
    display: -webkit-box !important;
    display: -ms-flexbox !important;
    display: flex !important;
    -webkit-box-pack: center !important;
    -ms-flex-pack: center !important;
    justify-content: center !important;
  }

  /* Fallback para Chrome muito antigo - usar table layout */
  .windows-7.legacy-chrome section#inicio .container > .grid {
    display: table !important;
    width: 100% !important;
    table-layout: fixed !important;
    border-spacing: 4rem 0 !important;
  }

  .windows-7.legacy-chrome section#inicio .container > .grid > div {
    display: table-cell !important;
    vertical-align: middle !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .windows-7.legacy-chrome section#inicio .container > .grid > div:first-child {
    width: 40% !important;
    text-align: left !important;
  }

  .windows-7.legacy-chrome section#inicio .container > .grid > div:last-child {
    width: 60% !important;
    text-align: center !important;
  }

  /* Ajustes específicos para resolução 1600x1200 */
  @media (min-width: 1400px) and (max-width: 1700px) {
    .windows-7 section#inicio .container {
      max-width: 1500px !important;
      padding: 0 3rem !important;
    }

    .windows-7 section#inicio .container > .grid {
      gap: 5rem !important;
    }

    .windows-7 section#inicio .container > .grid > div:first-child {
      width: 550px !important;
      max-width: 550px !important;
    }

    .windows-7 section#inicio .container > .grid > div:last-child {
      max-width: 700px !important;
    }
  }

  /* Remover margens e paddings conflitantes */
  .windows-7 section#inicio .space-y-6,
  .windows-7 section#inicio .space-y-8 {
    margin: 0 !important;
  }

  .windows-7 section#inicio .space-y-6 > *,
  .windows-7 section#inicio .space-y-8 > * {
    margin-top: 1.5rem !important;
    margin-bottom: 0 !important;
  }

  .windows-7 section#inicio .space-y-6 > *:first-child,
  .windows-7 section#inicio .space-y-8 > *:first-child {
    margin-top: 0 !important;
  }

  /* GRADIENTES SUAVES COMPATÍVEIS PARA OUTRAS SEÇÕES */
  .windows-7 .bg-gradient-to-br,
  .windows-7 .bg-gradient-to-r,
  .windows-7 .bg-gradient-to-l,
  .windows-7 .bg-gradient-to-t,
  .windows-7 .bg-gradient-to-b {
    /* Fallback para navegadores que não suportam gradientes */
    background: #f8fafc !important;
  }

  /* CORES INTERCALADAS COM GRADIENTES SUAVES PARA AS SEÇÕES NO WINDOWS 7 */
  .windows-7 section#novidades {
    background: #f1f5f9 !important;
    background: -webkit-linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%) !important;
    background: -moz-linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%) !important;
    background: -o-linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%) !important;
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%) !important;
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#f1f5f9', endColorstr='#cbd5e1', GradientType=1) !important;
  }

  .windows-7 section#sobre {
    background: #f0fdf4 !important;
    background: -webkit-linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%) !important;
    background: -moz-linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%) !important;
    background: -o-linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%) !important;
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%) !important;
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#f0fdf4', endColorstr='#bbf7d0', GradientType=1) !important;
  }

  .windows-7 section#contato {
    background: #fefce8 !important;
    background: -webkit-linear-gradient(135deg, #fefce8 0%, #fef3c7 50%, #fde68a 100%) !important;
    background: -moz-linear-gradient(135deg, #fefce8 0%, #fef3c7 50%, #fde68a 100%) !important;
    background: -o-linear-gradient(135deg, #fefce8 0%, #fef3c7 50%, #fde68a 100%) !important;
    background: linear-gradient(135deg, #fefce8 0%, #fef3c7 50%, #fde68a 100%) !important;
    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#fefce8', endColorstr='#fde68a', GradientType=1) !important;
  }

  /* Remover animações de pulse/respirar no Windows 7 */
  .windows-7 .animate-pulse {
    animation: none !important;
    opacity: 1 !important;
  }

  /* Elementos decorativos de fundo - remover no Windows 7 */
  .windows-7 section#inicio .absolute {
    display: none !important;
  }
  
  /* CORREÇÃO ULTRA ESPECÍFICA PARA A PALAVRA "FOLHETO!" EM VERMELHO */
  /* Targeting múltiplas variações possíveis */
  .windows-7 .bg-gradient-to-r.from-red-500.to-red-700.bg-clip-text.text-transparent,
  .windows-7 .text-red-600.bg-gradient-to-r.from-red-500.to-red-700.bg-clip-text.text-transparent,
  .windows-7 span.text-red-600.bg-gradient-to-r.from-red-500.to-red-700.bg-clip-text.text-transparent,
  .windows-7 .bg-clip-text.text-transparent {
    background: none !important;
    background-image: none !important;
    color: #dc2626 !important; /* Vermelho forte */
    -webkit-background-clip: unset !important;
    background-clip: unset !important;
    -webkit-text-fill-color: #dc2626 !important;
    text-fill-color: #dc2626 !important;
  }

  /* Fallback ainda mais específico para Chrome */
  .windows-7.legacy-chrome .bg-gradient-to-r.from-red-500.to-red-700.bg-clip-text.text-transparent,
  .windows-7.legacy-chrome .text-red-600.bg-gradient-to-r.from-red-500.to-red-700.bg-clip-text.text-transparent,
  .windows-7.legacy-chrome span.text-red-600.bg-gradient-to-r.from-red-500.to-red-700.bg-clip-text.text-transparent {
    background: none !important;
    background-image: none !important;
    color: #dc2626 !important;
    -webkit-background-clip: unset !important;
    background-clip: unset !important;
    -webkit-text-fill-color: #dc2626 !important;
    text-fill-color: #dc2626 !important;
  }

  /* CORREÇÃO GLOBAL PARA TODOS OS NAVEGADORES - FORÇAR VERMELHO */
  .legacy-browser .bg-gradient-to-r.from-red-500.to-red-700.bg-clip-text.text-transparent,
  .legacy-browser .text-red-600.bg-gradient-to-r.from-red-500.to-red-700.bg-clip-text.text-transparent,
  .legacy-browser span.text-red-600.bg-gradient-to-r.from-red-500.to-red-700.bg-clip-text.text-transparent {
    background: none !important;
    background-image: none !important;
    color: #dc2626 !important;
    -webkit-background-clip: unset !important;
    background-clip: unset !important;
    -webkit-text-fill-color: #dc2626 !important;
    text-fill-color: #dc2626 !important;
  }

  /* CORREÇÃO PARA ESTRELAS DOURADAS EM TODOS OS NAVEGADORES */
  .text-yellow-500 {
    color: #eab308 !important;
  }

  .fill-current {
    fill: currentColor !important;
  }

  /* Forçar cor dourada nas estrelas especificamente */
  .text-yellow-500.fill-current {
    color: #eab308 !important;
    fill: #eab308 !important;
  }

  /* Fallback para SVG das estrelas */
  svg.text-yellow-500 {
    color: #eab308 !important;
    fill: #eab308 !important;
  }

  svg.text-yellow-500 path {
    fill: #eab308 !important;
  }
  
  /* CORREÇÃO PARA FOOTER - MANTER CORES ORIGINAIS */
  .windows-7 footer,
  .legacy-browser footer {
    background-color: #111827 !important; /* Cinza escuro original */
    background: #111827 !important;
    color: #ffffff !important;
  }

  .windows-7 footer *,
  .legacy-browser footer * {
    color: inherit !important;
  }

  .windows-7 footer .text-white,
  .legacy-browser footer .text-white {
    color: #ffffff !important;
  }

  .windows-7 footer .text-gray-300,
  .legacy-browser footer .text-gray-300 {
    color: #d1d5db !important;
  }

  .windows-7 footer .text-primary-400,
  .legacy-browser footer .text-primary-400 {
    color: #f87171 !important;
  }

  .windows-7 footer .text-secondary-400,
  .legacy-browser footer .text-secondary-400 {
    color: #a3e635 !important;
  }

  /* CORREÇÃO PARA FUNDOS DAS SEÇÕES - MANTER GRADIENTES COLORIDOS */
  .windows-7 section {
    background: inherit !important;
  }

  /* Forçar gradientes específicos para cada seção */
  .windows-7 section#inicio {
    background: #fdf2f8 !important;
    background: -webkit-linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%) !important;
    background: -moz-linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%) !important;
    background: -o-linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%) !important;
    background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 50%, #fbcfe8 100%) !important;
  }

  .windows-7 section#novidades {
    background: #f1f5f9 !important;
    background: -webkit-linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%) !important;
    background: -moz-linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%) !important;
    background: -o-linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%) !important;
    background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 50%, #cbd5e1 100%) !important;
  }

  .windows-7 section#sobre {
    background: #f0fdf4 !important;
    background: -webkit-linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%) !important;
    background: -moz-linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%) !important;
    background: -o-linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%) !important;
    background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%) !important;
  }

  .windows-7 section#contato {
    background: #fefce8 !important;
    background: -webkit-linear-gradient(135deg, #fefce8 0%, #fef3c7 50%, #fde68a 100%) !important;
    background: -moz-linear-gradient(135deg, #fefce8 0%, #fef3c7 50%, #fde68a 100%) !important;
    background: -o-linear-gradient(135deg, #fefce8 0%, #fef3c7 50%, #fde68a 100%) !important;
    background: linear-gradient(135deg, #fefce8 0%, #fef3c7 50%, #fde68a 100%) !important;
  }

  /* CORREÇÃO PARA ELEMENTOS BRANCOS QUE PERDERAM COR */
  .windows-7 .bg-white,
  .legacy-browser .bg-white {
    background-color: #ffffff !important;
  }

  .windows-7 .bg-gray-900,
  .legacy-browser .bg-gray-900 {
    background-color: #111827 !important;
  }

  /* CORREÇÃO PARA CARDS E ELEMENTOS COM FUNDO */
  .windows-7 .bg-gradient-to-br,
  .legacy-browser .bg-gradient-to-br {
    background: inherit !important;
  }

  /* Manter cores dos textos */
  .windows-7 .text-white,
  .legacy-browser .text-white {
    color: #ffffff !important;
  }

  .windows-7 .text-gray-300,
  .legacy-browser .text-gray-300 {
    color: #d1d5db !important;
  }

  .windows-7 .text-gray-600,
  .legacy-browser .text-gray-600 {
    color: #4b5563 !important;
  }

  .windows-7 .text-gray-800,
  .legacy-browser .text-gray-800 {
    color: #1f2937 !important;
  }
  
  /* Resto dos fallbacks... */
  .legacy-browser .backdrop-blur-sm {
    background: rgba(255, 255, 255, 0.95) !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }
  
  .legacy-browser .aspect-video {
    position: relative;
    padding-bottom: 56.25%;
    height: 0;
    overflow: hidden;
  }
  
  .legacy-browser .aspect-video > * {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .legacy-browser .rounded-xl {
    border-radius: 0.75rem;
  }
  
  .legacy-browser .rounded-2xl {
    border-radius: 1rem;
  }
  
  .legacy-browser .rounded-full {
    border-radius: 50%;
  }
  
  .legacy-browser .shadow-lg {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
  
  .legacy-browser .shadow-xl {
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  
  .legacy-browser .shadow-2xl {
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }
  
  .legacy-browser .transition-all {
    -webkit-transition: all 0.15s ease-in-out;
    -o-transition: all 0.15s ease-in-out;
    transition: all 0.15s ease-in-out;
  }
  
  /* ANIMAÇÕES SIMPLIFICADAS PARA WINDOWS 7 */
  .windows-7 .animate-pulse {
    animation: none !important;
    opacity: 1 !important;
  }
  
  .windows-7 .animate-bounce {
    animation: none !important;
  }
  
  .windows-7 .animate-spin {
    -webkit-animation: legacy-spin 1s linear infinite;
    animation: legacy-spin 1s linear infinite;
  }
  
  /* Manter apenas animação de spin para loading */
  @-webkit-keyframes legacy-spin {
    from { 
      -webkit-transform: rotate(0deg);
      transform: rotate(0deg);
    }
    to { 
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  
  @keyframes legacy-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .legacy-browser .text-red-600 {
    color: #dc2626 !important;
  }
  
  .legacy-browser .text-green-600 {
    color: #16a34a !important;
  }
  
  .legacy-browser .text-gray-600 {
    color: #4b5563 !important;
  }
  
  .legacy-browser .text-gray-700 {
    color: #374151 !important;
  }
  
  .legacy-browser .text-gray-800 {
    color: #1f2937 !important;
  }
  
  .legacy-browser .bg-white {
    background-color: #ffffff !important;
  }
  
  .legacy-browser .bg-gray-100 {
    background-color: #f3f4f6 !important;
  }
  
  .legacy-browser .flex {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
  }
  
  .legacy-browser .items-center {
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }
  
  .legacy-browser .justify-center {
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
  }
`

    const style = document.createElement("style")
    style.textContent = fallbackCSS
    document.head.appendChild(style)

    console.log(
      `Navegador detectado: ${browserInfo.name} ${browserInfo.version}${browserInfo.isWindows7 ? " (Windows 7)" : ""}. Aplicando gradientes suaves e palavra "folheto!" em vermelho.`,
    )
  }
}
