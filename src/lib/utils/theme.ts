import { useEffect, useState } from "react"

export type Theme = "system" | "light" | "dark"

const STORAGE_KEY = "fisco-theme"

function getSystemDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
}

function applyTheme(theme: Theme) {
  const dark = theme === "dark" || (theme === "system" && getSystemDark())
  document.documentElement.classList.toggle("dark", dark)
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem(STORAGE_KEY) as Theme | null) ?? "system"
  })

  useEffect(() => {
    applyTheme(theme)
    localStorage.setItem(STORAGE_KEY, theme)

    if (theme !== "system") return
    const mq = window.matchMedia("(prefers-color-scheme: dark)")
    const handler = () => applyTheme("system")
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [theme])

  function cycleTheme() {
    setThemeState((t) =>
      t === "system" ? "light" : t === "light" ? "dark" : "system"
    )
  }

  return { theme, setTheme: setThemeState, cycleTheme }
}
