// Sistema simples para proteger páginas em desenvolvimento

// Chave secreta para acesso (você pode alterar para qualquer valor)
const DEV_ACCESS_KEY = "coutyfil-dev-2024"

// Nome do cookie
const DEV_COOKIE_NAME = "coutyfil-dev-access"

// Verificar se tem acesso
export function hasDevAccess(): boolean {
  // Se estamos em desenvolvimento, sempre permitir acesso
  if (process.env.NODE_ENV === "development") {
    return true
  }

  // Verificar cookie
  if (typeof document !== "undefined") {
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim())
    const devCookie = cookies.find((cookie) => cookie.startsWith(`${DEV_COOKIE_NAME}=`))

    if (devCookie) {
      const value = devCookie.split("=")[1]
      return value === DEV_ACCESS_KEY
    }
  }

  return false
}

// Conceder acesso
export function grantDevAccess(): void {
  // Definir cookie que expira em 7 dias
  const expiryDate = new Date()
  expiryDate.setDate(expiryDate.getDate() + 7)

  document.cookie = `${DEV_COOKIE_NAME}=${DEV_ACCESS_KEY}; expires=${expiryDate.toUTCString()}; path=/`
}

// Verificar parâmetro de URL para acesso
export function checkDevAccessParam(url: string): boolean {
  try {
    const urlObj = new URL(url)
    return urlObj.searchParams.get("dev-access") === DEV_ACCESS_KEY
  } catch {
    // Se a URL não for válida
    return false
  }
}
