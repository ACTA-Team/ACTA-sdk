import { useActaClient } from "../providers/ActaClientContext"

export function useVaultStore() {
  const client = useActaClient()
  return {
    vaultStore: (payload: { signedXdr: string; vcId: string; owner?: string; vaultContractId?: string }) =>
      client.vaultStore(payload),
  }
}