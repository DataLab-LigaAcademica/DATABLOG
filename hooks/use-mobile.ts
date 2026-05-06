import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    
    // Defer the initial check to avoid sync update linting error
    const rafId = requestAnimationFrame(() => {
      setIsMobile(mql.matches)
    })
    
    return () => {
      mql.removeEventListener("change", onChange)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return !!isMobile
}
