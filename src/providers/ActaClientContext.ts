import React, { useContext } from "react"
import { ActaClient } from "../client"

export const ActaProviderContext = React.createContext<{ client: ActaClient | null }>({ client: null })

export function useActaClient() {
  const ctx = useContext(ActaProviderContext)
  if (!ctx.client) throw new Error("useActaClient must be inside ActaConfig")
  return ctx.client
}