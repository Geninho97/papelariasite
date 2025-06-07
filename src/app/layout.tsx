import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import BrowserCompatibility from "./components/BrowserCompatibility"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Coutyfil, Lda",
  keywords: "papelaria, material escolar, escritório, cadernos, canetas, papel",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <BrowserCompatibility />
        {children}
      </body>
    </html>
  )
}
