import { useActaClient } from "../ActaProvider"

export function useConfig() {
  const client = useActaClient()
  return {
    getConfig: () => client.getConfig(),
  }
}