import { useActaClient } from "../providers/ActaClientContext"

/**
 * Hook to access server configuration via the client.
 * @returns `{ getConfig }` which resolves RPC URL, network passphrase, and contract IDs.
 */
export function useConfig() {
  const client = useActaClient()
  return {
    getConfig: () => client.getConfig(),
  }
}