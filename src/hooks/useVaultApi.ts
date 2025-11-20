import { useActaClient } from "../providers/ActaClientContext"

/**
 * Hook for direct Vault contract reads and verification.
 * @returns helpers to list IDs, fetch VC content, and verify status in the Vault.
 */
export function useVaultApi() {
  const client = useActaClient()
  return {
    /** List VC IDs owned by `owner`. */
    listVcIdsDirect: (args: { owner: string; vaultContractId?: string }) =>
      client.vaultListVcIdsDirect(args).then((r) => (Array.isArray(r.vc_ids) ? r.vc_ids : Array.isArray(r.result) ? r.result! : [])),
    /** Fetch VC contents for `vcId`. */
    getVcDirect: (args: { owner: string; vcId: string; vaultContractId?: string }) =>
      client.vaultGetVcDirect(args).then((r) => r.vc ?? r.result ?? null),
    /** Verify VC status via the Vault. */
    verifyInVault: (args: { owner: string; vcId: string; vaultContractId?: string }) =>
      client.vaultVerify(args),
  }
}