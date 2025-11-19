import { useActaClient } from "../ActaProvider"

export function useVaultApi() {
  const client = useActaClient()
  return {
    listVcIdsDirect: (args: { owner: string; vaultContractId?: string }) =>
      client.vaultListVcIdsDirect(args).then((r) => (Array.isArray(r.vc_ids) ? r.vc_ids : Array.isArray(r.result) ? r.result! : [])),
    getVcDirect: (args: { owner: string; vcId: string; vaultContractId?: string }) =>
      client.vaultGetVcDirect(args).then((r) => r.vc ?? r.result ?? null),
    verifyInVault: (args: { owner: string; vcId: string; vaultContractId?: string }) =>
      client.vaultVerify(args),
  }
}