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

/* FORÇAR CORES EM TODOS OS NAVEGADORES ANTIGOS - ULTRA AGRESSIVO */
.legacy-browser section,
.windows-7 section,
.legacy-chrome section {
  background: #ffffff !important; /* Fallback branco primeiro */
}

/* CORES INTERCALADAS - SALMÃO E VERDE */
/* 1. HERO/INÍCIO - SALMÃO */
.legacy-browser section#inicio,
.windows-7 section#inicio,
.legacy-chrome section#inicio {
  background-color: #fdf2f8 !important;
  background-image: none !important;
  background: #fdf2f8 !important;
  min-height: 100vh !important;
  display: -webkit-box !important;
  display: -ms-flexbox !important;
  display: flex !important;
  -webkit-box-align: center !important;
  -ms-flex-align: center !important;
  align-items: center !important;
}

/* 2. NOVIDADES - VERDE */
.legacy-browser section#novidades,
.windows-7 section#novidades,
.legacy-chrome section#novidades {
  background-color: #f0fdf4 !important;
  background-image: none !important;
  background: #f0fdf4 !important;
  min-height: 100vh !important;
  display: -webkit-box !important;
  display: -ms-flexbox !important;
  display: flex !important;
  -webkit-box-orient: vertical !important;
  -webkit-box-direction: normal !important;
  -ms-flex-direction: column !important;
  flex-direction: column !important;
  -webkit-box-pack: center !important;
  -ms-flex-pack: center !important;
  justify-content: center !important;
}

/* 3. SOBRE - SALMÃO */
.legacy-browser section#sobre,
.windows-7 section#sobre,
.legacy-chrome section#sobre {
  background-color: #fdf2f8 !important;
  background-image: none !important;
  background: #fdf2f8 !important;
  min-height: 100vh !important;
  display: -webkit-box !important;
  display: -ms-flexbox !important;
  display: flex !important;
  -webkit-box-align: center !important;
  -ms-flex-align: center !important;
  align-items: center !important;
}

/* 4. CONTATO - VERDE */
.legacy-browser section#contato,
.windows-7 section#contato,
.legacy-chrome section#contato {
  background-color: #f0fdf4 !important;
  background-image: none !important;
  background: #f0fdf4 !important;
  min-height: 100vh !important;
  display: -webkit-box !important;
  display: -ms-flexbox !important;
  display: flex !important;
  -webkit-box-align: center !important;
  -ms-flex-align: center !important;
  align-items: center !important;
}

/* FORÇAR LAYOUT HORIZONTAL NO HERO */
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

/* REMOVER TODOS OS GRADIENTES EM NAVEGADORES ANTIGOS */
.legacy-browser .bg-gradient-to-br,
.legacy-browser .bg-gradient-to-r,
.legacy-browser .bg-gradient-to-l,
.legacy-browser .bg-gradient-to-t,
.legacy-browser .bg-gradient-to-b,
.windows-7 .bg-gradient-to-br,
.windows-7 .bg-gradient-to-r,
.windows-7 .bg-gradient-to-l,
.windows-7 .bg-gradient-to-t,
.windows-7 .bg-gradient-to-b,
.legacy-chrome .bg-gradient-to-br,
.legacy-chrome .bg-gradient-to-r,
.legacy-chrome .bg-gradient-to-l,
.legacy-chrome .bg-gradient-to-t,
.legacy-chrome .bg-gradient-to-b {
  background-image: none !important;
  background: inherit !important;
}

/* FOOTER - TODO O TEXTO EM BRANCO */
.legacy-browser footer,
.windows-7 footer,
.legacy-chrome footer {
  background-color: #111827 !important;
  background-image: none !important;
  background: #111827 !important;
  color: #ffffff !important;
}

.legacy-browser footer *,
.windows-7 footer *,
.legacy-chrome footer * {
  color: #ffffff !important;
}

.legacy-browser footer h1,
.legacy-browser footer h2,
.legacy-browser footer h3,
.legacy-browser footer h4,
.legacy-browser footer h5,
.legacy-browser footer h6,
.legacy-browser footer p,
.legacy-browser footer span,
.legacy-browser footer div,
.legacy-browser footer a,
.legacy-browser footer li,
.windows-7 footer h1,
.windows-7 footer h2,
.windows-7 footer h3,
.windows-7 footer h4,
.windows-7 footer h5,
.windows-7 footer h6,
.windows-7 footer p,
.windows-7 footer span,
.windows-7 footer div,
.windows-7 footer a,
.windows-7 footer li,
.legacy-chrome footer h1,
.legacy-chrome footer h2,
.legacy-chrome footer h3,
.legacy-chrome footer h4,
.legacy-chrome footer h5,
.legacy-chrome footer h6,
.legacy-chrome footer p,
.legacy-chrome footer span,
.legacy-chrome footer div,
.legacy-chrome footer a,
.legacy-chrome footer li {
  color: #ffffff !important;
}

/* Remover animações de pulse/respirar no Windows 7 */
.windows-7 .animate-pulse,
.legacy-browser .animate-pulse,
.legacy-chrome .animate-pulse {
  animation: none !important;
  opacity: 1 !important;
}

/* Elementos decorativos de fundo - remover no Windows 7 */
.windows-7 section#inicio .absolute,
.legacy-browser section#inicio .absolute,
.legacy-chrome section#inicio .absolute {
  display: none !important;
}

/* CORREÇÃO ULTRA ESPECÍFICA PARA A PALAVRA "FOLHETO!" EM VERMELHO */
.windows-7 .bg-gradient-to-r.from-red-500.to-red-700.bg-clip-text.text-transparent,
.windows-7 .text-red-600.bg-gradient-to-r.from-red-500.to-red-700.bg-clip-text.text-transparent,
.windows-7 span.text-red-600.bg-gradient-to-r.from-red-500.to-red-700.bg-clip-text.text-transparent,
.windows-7 .bg-clip-text.text-transparent,
.legacy-browser .bg-gradient-to-r.from-red-500.to-red-700.bg-clip-text.text-transparent,
.legacy-browser .text-red-600.bg-gradient-to-r.from-red-500.to-red-700.bg-clip-text.text-transparent,
.legacy-browser span.text-red-600.bg-gradient-to-r.from-red-500.to-red-700.bg-clip-text.text-transparent,
.legacy-browser .bg-clip-text.text-transparent,
.legacy-chrome .bg-gradient-to-r.from-red-500.to-red-700.bg-clip-text.text-transparent,
.legacy-chrome .text-red-600.bg-gradient-to-r.from-red-500.to-red-700.bg-clip-text.text-transparent,
.legacy-chrome span.text-red-600.bg-gradient-to-r.from-red-500.to-red-700.bg-clip-text.text-transparent,
.legacy-chrome .bg-clip-text.text-transparent {
  background: none !important;
  background-image: none !important;
  color: #dc2626 !important;
  -webkit-background-clip: unset !important;
  background-clip: unset !important;
  -webkit-text-fill-color: #dc2626 !important;
  text-fill-color: #dc2626 !important;
}

/* CORREÇÃO PARA ESTRELAS DOURADAS */
.text-yellow-500,
.legacy-browser .text-yellow-500,
.windows-7 .text-yellow-500,
.legacy-chrome .text-yellow-500 {
  color: #eab308 !important;
}

.fill-current,
.legacy-browser .fill-current,
.windows-7 .fill-current,
.legacy-chrome .fill-current {
  fill: currentColor !important;
}

svg.text-yellow-500,
.legacy-browser svg.text-yellow-500,
.windows-7 svg.text-yellow-500,
.legacy-chrome svg.text-yellow-500 {
  color: #eab308 !important;
  fill: #eab308 !important;
}

svg.text-yellow-500 path,
.legacy-browser svg.text-yellow-500 path,
.windows-7 svg.text-yellow-500 path,
.legacy-chrome svg.text-yellow-500 path {
  fill: #eab308 !important;
}

/* FORÇAR CORES DOS ELEMENTOS */
.legacy-browser .bg-white,
.windows-7 .bg-white,
.legacy-chrome .bg-white {
  background-color: #ffffff !important;
  background-image: none !important;
}

.legacy-browser .text-white,
.windows-7 .text-white,
.legacy-chrome .text-white {
  color: #ffffff !important;
}

.legacy-browser .text-gray-300,
.windows-7 .text-gray-300,
.legacy-chrome .text-gray-300 {
  color: #d1d5db !important;
}

.legacy-browser .text-gray-600,
.windows-7 .text-gray-600,
.legacy-chrome .text-gray-600 {
  color: #4b5563 !important;
}

.legacy-browser .text-gray-800,
.windows-7 .text-gray-800,
.legacy-chrome .text-gray-800 {
  color: #1f2937 !important;
}

.legacy-browser .text-red-600,
.windows-7 .text-red-600,
.legacy-chrome .text-red-600 {
  color: #dc2626 !important;
}

.legacy-browser .text-green-600,
.windows-7 .text-green-600,
.legacy-chrome .text-green-600 {
  color: #16a34a !important;
}

/* Resto dos fallbacks básicos */
.legacy-browser .backdrop-blur-sm,
.windows-7 .backdrop-blur-sm,
.legacy-chrome .backdrop-blur-sm {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: none !important;
  -webkit-backdrop-filter: none !important;
}

.legacy-browser .rounded-xl,
.windows-7 .rounded-xl,
.legacy-chrome .rounded-xl {
  border-radius: 0.75rem;
}

.legacy-browser .rounded-2xl,
.windows-7 .rounded-2xl,
.legacy-chrome .rounded-2xl {
  border-radius: 1rem;
}

.legacy-browser .shadow-lg,
.windows-7 .shadow-lg,
.legacy-chrome .shadow-lg {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.legacy-browser .flex,
.windows-7 .flex,
.legacy-chrome .flex {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}

.legacy-browser .items-center,
.windows-7 .items-center,
.legacy-chrome .items-center {
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
}

.legacy-browser .justify-center,
.windows-7 .justify-center,
.legacy-chrome .justify-center {
  -webkit-box-pack: center;
  -ms-flex-pack: center;
  justify-content: center;
}

/* ANIMAÇÕES SIMPLIFICADAS */
.windows-7 .animate-spin,
.legacy-browser .animate-spin,
.legacy-chrome .animate-spin {
  -webkit-animation: legacy-spin 1s linear infinite;
  animation: legacy-spin 1s linear infinite;
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
`

    const style = document.createElement("style")
    style.textContent = fallbackCSS
    document.head.appendChild(style)

    console.log(
      `🎨 CORES FORÇADAS: ${browserInfo.name} ${browserInfo.version}${browserInfo.isWindows7 ? " (Windows 7)" : ""}. 
      ✅ Salmão/Verde intercalados
      ✅ Footer todo branco
      ✅ Palavra "folheto!" vermelha
      ✅ Estrelas douradas`,
    )
  }
}
