import React, { useContext } from "react"
import { ActaClient } from "../client"

/** React context holding the configured `ActaClient`. */
export const ActaProviderContext = React.createContext<{ client: ActaClient | null }>({ client: null })

/**
 * Access the `ActaClient` from React context.
 * Throws if used outside `ActaConfig` provider.
 */
export function useActaClient() {
  const ctx = useContext(ActaProviderContext)
  if (!ctx.client) throw new Error("useActaClient must be inside ActaConfig")
  return ctx.client
}