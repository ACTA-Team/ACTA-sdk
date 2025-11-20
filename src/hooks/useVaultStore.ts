import { useActaClient } from "../providers/ActaClientContext"

/**
 * Hook to submit signed XDR for storing a credential in the Vault.
 * @returns `{ vaultStore }` which returns tx result and optional verification.
 */
export function useVaultStore() {
  const client = useActaClient()
  return {
    vaultStore: (payload: { signedXdr: string; vcId: string; owner?: string; vaultContractId?: string }) =>
      client.vaultStore(payload),
  }
}