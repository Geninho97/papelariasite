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

export function applyCompatibilityStyles(): void {
  if (typeof window === "undefined") return

  if (detectOldBrowser()) {
    // Adicionar classe para navegadores antigos
    document.documentElement.classList.add("legacy-browser")

    // Criar e injetar CSS de fallback
    const fallbackCSS = `
      .legacy-browser {
        /* Fallbacks para gradientes */
        --gradient-fallback-red: #fee2e2;
        --gradient-fallback-green: #f0fdf4;
        --gradient-fallback-blue: #dbeafe;
      }
      
      .legacy-browser .bg-gradient-to-br {
        background: var(--gradient-fallback-red) !important;
      }
      
      .legacy-browser .bg-gradient-to-r {
        background: linear-gradient(to right, #ef4444, #22c55e) !important;
      }
      
      /* Fallback para backdrop-blur */
      .legacy-browser .backdrop-blur-sm {
        background: rgba(255, 255, 255, 0.9) !important;
        backdrop-filter: none !important;
      }
      
      /* Fallback para aspect-ratio */
      .legacy-browser .aspect-video {
        position: relative;
        padding-bottom: 56.25%;
        height: 0;
      }
      
      .legacy-browser .aspect-video > * {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      
      /* Fallback para grid */
      .legacy-browser .grid {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
      }
      
      .legacy-browser .grid-cols-1 > * {
        width: 100%;
      }
      
      .legacy-browser .md\\:grid-cols-2 > * {
        width: 50%;
      }
      
      .legacy-browser .md\\:grid-cols-3 > * {
        width: 33.333333%;
      }
      
      .legacy-browser .lg\\:grid-cols-3 > * {
        width: 33.333333%;
      }
      
      /* Fallback para flexbox gap */
      .legacy-browser .gap-6 > * {
        margin: 0.75rem;
      }
      
      .legacy-browser .gap-8 > * {
        margin: 1rem;
      }
      
      .legacy-browser .gap-10 > * {
        margin: 1.25rem;
      }
      
      /* Fallback para space-x e space-y */
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
      
      /* Fallback para transition */
      .legacy-browser .transition-all {
        -webkit-transition: all 0.15s ease-in-out;
        transition: all 0.15s ease-in-out;
      }
      
      .legacy-browser .transition-colors {
        -webkit-transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
        transition: color 0.15s ease-in-out, background-color 0.15s ease-in-out, border-color 0.15s ease-in-out;
      }
      
      .legacy-browser .transition-transform {
        -webkit-transition: -webkit-transform 0.15s ease-in-out;
        transition: transform 0.15s ease-in-out;
      }
      
      .legacy-browser .duration-300 {
        -webkit-transition-duration: 300ms;
        transition-duration: 300ms;
      }
      
      /* Fallback para animações */
      .legacy-browser .animate-pulse {
        -webkit-animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      }
      
      .legacy-browser .animate-bounce {
        -webkit-animation: bounce 1s infinite;
        animation: bounce 1s infinite;
      }
      
      .legacy-browser .animate-spin {
        -webkit-animation: spin 1s linear infinite;
        animation: spin 1s linear infinite;
      }
      
      @-webkit-keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: .5; }
      }
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: .5; }
      }
      
      @-webkit-keyframes bounce {
        0%, 100% { 
          -webkit-transform: translateY(0);
          transform: translateY(0);
        }
        50% { 
          -webkit-transform: translateY(-25%);
          transform: translateY(-25%);
        }
      }
      
      @keyframes bounce {
        0%, 100% { 
          transform: translateY(0);
        }
        50% { 
          transform: translateY(-25%);
        }
      }
      
      @-webkit-keyframes spin {
        from { 
          -webkit-transform: rotate(0deg);
          transform: rotate(0deg);
        }
        to { 
          -webkit-transform: rotate(360deg);
          transform: rotate(360deg);
        }
      }
      
      @keyframes spin {
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
      
      /* Fallback para responsive design */
      @media (min-width: 768px) {
        .legacy-browser .md\\:grid-cols-2 > * {
          width: calc(50% - 1rem);
        }
        
        .legacy-browser .md\\:grid-cols-3 > * {
          width: calc(33.333333% - 1rem);
        }
      }
      
      @media (min-width: 1024px) {
        .legacy-browser .lg\\:grid-cols-3 > * {
          width: calc(33.333333% - 1rem);
        }
      }
    `

    const style = document.createElement("style")
    style.textContent = fallbackCSS
    document.head.appendChild(style)

    console.log("Navegador antigo detectado. Aplicando fallbacks de compatibilidade.")
  }
}
