import { useActaClient } from "../providers/ActaClientContext"

export function useConfig() {
  const client = useActaClient()
  return {
    getConfig: () => client.getConfig(),
  }
}