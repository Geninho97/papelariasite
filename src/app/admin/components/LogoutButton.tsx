"use client"

import { LogOut } from "lucide-react"

interface LogoutButtonProps {
  onLogout: () => void
}

export default function LogoutButton({ onLogout }: LogoutButtonProps) {
  const handleLogout = async () => {
    if (confirm("Tem certeza que deseja sair?")) {
      try {
        // Limpar cookie imediatamente
        document.cookie = "admin-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"

        // Chamar função de logout
        await onLogout()

        // Forçar redirecionamento
        window.location.href = "/admin"
      } catch (error) {
        console.error("Erro no logout:", error)
        // Mesmo com erro, redirecionar
        window.location.href = "/admin"
      }
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
    >
      <LogOut className="h-4 w-4" />
      <span>Sair</span>
    </button>
  )
}
