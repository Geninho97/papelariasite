// Sistema para proteger páginas em desenvolvimento usando a mesma autenticação do admin

// Nome do cookie
const DEV_COOKIE_NAME = "coutyfil-dev-access"

// Verificar se tem acesso
export function hasDevAccess(): boolean {
  // Se estamos em desenvolvimento, sempre permitir acesso
  if (process.env.NODE_ENV === "development") {
    return true
  }

  // Verificar cookie de admin (reutilizar autenticação existente)
  if (typeof document !== "undefined") {
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim())

    // Verificar se o cookie de admin existe
    const adminCookie = cookies.find((cookie) => cookie.startsWith("admin-token="))
    if (adminCookie) {
      return true
    }

    // Verificar cookie específico de dev
    const devCookie = cookies.find((cookie) => cookie.startsWith(`${DEV_COOKIE_NAME}=`))
    if (devCookie) {
      return devCookie.split("=")[1] === "true"
    }
  }

  return false
}

// Conceder acesso após verificação bem-sucedida
export function grantDevAccess(): void {
  // Definir cookie que expira em 7 dias
  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + 7)

  document.cookie = `${DEV_COOKIE_NAME}=true; expires=${expiryDate.toUTCString()}; path=/`
}

// Verificar parâmetro de URL para acesso rápido (apenas para desenvolvimento)
export function checkDevAccessParam(url: string): boolean {
  try {
    const urlObj = new URL(url)
    // Parâmetro simplificado apenas para desenvolvimento
    return urlObj.searchParams.get("dev") === "true"
  } catch {
    // Se a URL não for válida
    return false
  }
}
