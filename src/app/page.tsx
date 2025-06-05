"use client"

import Header from "./components/Header"
import Hero from "./components/Hero"
import Products from "./components/Products"
import About from "./components/About"
import Contact from "./components/Contact"
import Footer from "./components/Footer"
import DebugPanel from "./components/DebugPanel"

export default function Page() {
  // Mostrar debug panel apenas em desenvolvimento
  const showDebug =
    process.env.NODE_ENV === "development" ||
    (typeof window !== "undefined" && window.location.search.includes("debug=true"))

  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Products />
      <About />
      <Contact />
      <Footer />
      {showDebug && <DebugPanel />}
    </main>
  )
}
