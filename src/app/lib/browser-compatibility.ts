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

  return {
    name,
    version,
    isOld: detectOldBrowser(),
    isWindows7: detectWindows7(),
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
      
      /* Gradientes específicos para o hero - apenas Windows 7 */
      .windows-7 .bg-gradient-to-br {
        background: linear-gradient(135deg, rgba(254, 202, 202, 0.4) 0%, rgba(255, 255, 255, 0.3) 50%, rgba(187, 247, 208, 0.4) 100%) !important;
      }
      
      /* Layout específico para Windows 7 - forçar folheto à direita */
      .windows-7 .grid.md\\:grid-cols-2 {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-wrap: nowrap;
        flex-wrap: nowrap;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        gap: 2rem;
      }

      .windows-7 .grid.md\\:grid-cols-2 > * {
        width: 50%;
        padding: 0;
      }

      /* Garantir que o texto fique à esquerda e o folheto à direita */
      .windows-7 .grid.md\\:grid-cols-2 > *:first-child {
        -webkit-box-ordinal-group: 1;
        -ms-flex-order: 0;
        order: 0;
      }

      .windows-7 .grid.md\\:grid-cols-2 > *:last-child {
        -webkit-box-ordinal-group: 2;
        -ms-flex-order: 1;
        order: 1;
      }

      /* Ajustes específicos para resolução 1600x1200 no Windows 7 */
      @media (min-width: 1400px) {
        .windows-7 .grid.md\\:grid-cols-2 {
          gap: 3rem;
        }
        
        .windows-7 .grid.md\\:grid-cols-2 > *:first-child {
          width: 45%;
        }
        
        .windows-7 .grid.md\\:grid-cols-2 > *:last-child {
          width: 55%;
        }
      }
      
      .legacy-browser .bg-gradient-to-r {
        background: linear-gradient(90deg, #ef4444 0%, #22c55e 100%) !important;
      }
      
      /* Correção específica para a palavra "folheto!" no Windows 7 */
      .windows-7 .bg-gradient-to-r.from-red-500.to-red-700.bg-clip-text.text-transparent {
        background: none !important;
        color: #dc2626 !important;
        -webkit-background-clip: unset !important;
        background-clip: unset !important;
      }
      
      /* Fallback para backdrop-blur */
      .legacy-browser .backdrop-blur-sm {
        background: rgba(255, 255, 255, 0.95) !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
      }
      
      /* Fallback para aspect-ratio */
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
      
      .legacy-browser .aspect-square {
        position: relative;
        padding-bottom: 100%;
        height: 0;
        overflow: hidden;
      }
      
      .legacy-browser .aspect-square > * {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      /* Fallback para grid - melhorado */
      .legacy-browser .grid {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        margin: -0.5rem;
      }
      
      .legacy-browser .grid > * {
        padding: 0.5rem;
        box-sizing: border-box;
      }
      
      .legacy-browser .grid-cols-1 > * {
        width: 100%;
      }
      
      .legacy-browser .md\\:grid-cols-2 > * {
        width: 100%;
      }
      
      .legacy-browser .md\\:grid-cols-3 > * {
        width: 100%;
      }
      
      .legacy-browser .lg\\:grid-cols-3 > * {
        width: 100%;
      }
      
      /* Responsivo para grid */
      @media (min-width: 768px) {
        .legacy-browser .md\\:grid-cols-2 > * {
          width: 50%;
        }
        
        .legacy-browser .md\\:grid-cols-3 > * {
          width: 33.333333%;
        }
      }
      
      @media (min-width: 1024px) {
        .legacy-browser .lg\\:grid-cols-3 > * {
          width: 33.333333%;
        }
      }
      
      /* Fallback para flexbox gap - removido para evitar conflitos */
      .legacy-browser .gap-6,
      .legacy-browser .gap-8,
      .legacy-browser .gap-10 {
        margin: -0.5rem;
      }
      
      .legacy-browser .gap-6 > *,
      .legacy-browser .gap-8 > *,
      .legacy-browser .gap-10 > * {
        margin: 0.5rem;
      }
      
      /* Fallback para space utilities */
      .legacy-browser .space-x-2 > * + * {
        margin-left: 0.5rem;
      }
      
      .legacy-browser .space-x-3 > * + * {
        margin-left: 0.75rem;
      }
      
      .legacy-browser .space-y-1 > * + * {
        margin-top: 0.25rem;
      }
      
      .legacy-browser .space-y-2 > * + * {
        margin-top: 0.5rem;
      }
      
      .legacy-browser .space-y-3 > * + * {
        margin-top: 0.75rem;
      }
      
      .legacy-browser .space-y-4 > * + * {
        margin-top: 1rem;
      }
      
      /* Fallback para transform */
      .legacy-browser .hover\\:scale-105:hover {
        -webkit-transform: scale(1.05);
        -ms-transform: scale(1.05);
        transform: scale(1.05);
      }
      
      .legacy-browser .hover\\:-translate-y-1:hover {
        -webkit-transform: translateY(-0.25rem);
        -ms-transform: translateY(-0.25rem);
        transform: translateY(-0.25rem);
      }
      
      .legacy-browser .transform {
        -webkit-transform: translateZ(0);
        transform: translateZ(0);
      }
      
      /* Fallback para border-radius */
      .legacy-browser .rounded-xl {
        border-radius: 0.75rem;
      }
      
      .legacy-browser .rounded-2xl {
        border-radius: 1rem;
      }
      
      .legacy-browser .rounded-full {
        border-radius: 50%;
      }
      
      .legacy-browser .rounded-lg {
        border-radius: 0.5rem;
      }
      
      /* Fallback para shadow */
      .legacy-browser .shadow-lg {
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      }
      
      .legacy-browser .shadow-xl {
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      }
      
      .legacy-browser .shadow-2xl {
        box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      }
      
      .legacy-browser .shadow-md {
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      }
      
      /* Fallback para transition */
      .legacy-browser .transition-all {
        -webkit-transition: all 0.15s ease-in-out;
        -o-transition: all 0.15s ease-in-out;
        transition: all 0.15s ease-in-out;
      }
      
      .legacy-browser .transition-colors {
        -webkit-transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
        -o-transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
        transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
      }
      
      .legacy-browser .transition-transform {
        -webkit-transition: -webkit-transform 0.15s ease-in-out;
        -o-transition: transform 0.15s ease-in-out;
        transition: transform 0.15s ease-in-out;
      }
      
      .legacy-browser .duration-300 {
        -webkit-transition-duration: 300ms;
        -o-transition-duration: 300ms;
        transition-duration: 300ms;
      }
      
      /* Fallback para animações */
      .legacy-browser .animate-pulse {
        -webkit-animation: legacy-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        animation: legacy-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
      
      .legacy-browser .animate-bounce {
        -webkit-animation: legacy-bounce 1s infinite;
        animation: legacy-bounce 1s infinite;
      }
      
      .legacy-browser .animate-spin {
        -webkit-animation: legacy-spin 1s linear infinite;
        animation: legacy-spin 1s linear infinite;
      }
      
      @-webkit-keyframes legacy-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      
      @keyframes legacy-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
      
      @-webkit-keyframes legacy-bounce {
        0%, 100% { 
          -webkit-transform: translateY(0);
          transform: translateY(0);
        }
        50% { 
          -webkit-transform: translateY(-25%);
          transform: translateY(-25%);
        }
      }
      
      @keyframes legacy-bounce {
        0%, 100% { 
          transform: translateY(0);
        }
        50% { 
          transform: translateY(-25%);
        }
      }
      
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
      
      /* Fallback para cores modernas */
      .legacy-browser .text-red-600 {
        color: #dc2626 !important;
      }
      
      .legacy-browser .text-green-600 {
        color: #16a34a !important;
      }
      
      .legacy-browser .text-blue-600 {
        color: #2563eb !important;
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
      
      .legacy-browser .bg-red-100 {
        background-color: #fee2e2 !important;
      }
      
      .legacy-browser .bg-green-100 {
        background-color: #dcfce7 !important;
      }
      
      .legacy-browser .bg-blue-100 {
        background-color: #dbeafe !important;
      }
      
      .legacy-browser .bg-white {
        background-color: #ffffff !important;
      }
      
      .legacy-browser .bg-gray-100 {
        background-color: #f3f4f6 !important;
      }
      
      /* Fallback para hover states */
      .legacy-browser .hover\\:text-red-700:hover {
        color: #b91c1c !important;
      }
      
      .legacy-browser .hover\\:text-green-700:hover {
        color: #15803d !important;
      }
      
      .legacy-browser .hover\\:text-blue-700:hover {
        color: #1d4ed8 !important;
      }
      
      .legacy-browser .hover\\:underline:hover {
        text-decoration: underline !important;
      }
      
      .legacy-browser .hover\\:shadow-xl:hover {
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04) !important;
      }
      
      /* Fallback específico para o catálogo */
      .legacy-browser .catalog-container {
        background: #ffffff;
        border: 2px solid #e5e7eb;
        border-radius: 0.75rem;
        padding: 2rem;
        text-align: center;
        min-height: 400px;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
      }
      
      /* Melhorias para resolução 1600x1200 */
      @media (min-width: 1400px) {
        .legacy-browser .container {
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .legacy-browser .lg\\:grid-cols-3 > * {
          width: 33.333333%;
          padding: 1rem;
        }
        
        .legacy-browser .text-3xl,
        .legacy-browser .text-4xl,
        .legacy-browser .text-5xl {
          font-size: 2.5rem;
          line-height: 1.2;
        }
      }
      
      /* Fallback para flex utilities */
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
      
      .legacy-browser .flex-col {
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
      }
    `

    const style = document.createElement("style")
    style.textContent = fallbackCSS
    document.head.appendChild(style)

    console.log(
      `Navegador detectado: ${browserInfo.name} ${browserInfo.version}${browserInfo.isWindows7 ? " (Windows 7)" : ""}. Aplicando fallbacks de compatibilidade.`,
    )
  }
}
