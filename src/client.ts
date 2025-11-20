import axios, { AxiosInstance } from "axios";
import { baseURL, DEFAULT_VAULT_CONTRACT_ID, DEFAULT_ISSUANCE_CONTRACT_ID } from "./types/types";
import { CreateCredentialPayload, CreateCredentialResponse } from "./types";

/**
 * ACTA SDK HTTP client.
 *
 * Wraps ACTA API endpoints to issue, store, read, and verify credentials,
 * and to prepare transactions. The network is inferred from the `baseURL`.
 */
export class ActaClient {
  private axios: AxiosInstance;
  private network: "mainnet" | "testnet";

  /**
   * Initialize a new client instance.
   * @param baseURL - Base API URL for ACTA services (mainnet or testnet).
   * @param apiKey - Optional API key for authenticated endpoints.
   */
  constructor(baseURL: baseURL, apiKey: string) {
    this.axios = axios.create({ baseURL });
    this.network = baseURL.includes("mainnet") ? "mainnet" : "testnet";
    // if (apiKey) this.setApiKey(apiKey);
  }

  /**
   * Create a new credential
   * @param data - The data to create a new credential
   * @returns The response from the API CreateCredentialResponse
   */
  createCredential(data: CreateCredentialPayload) {
    return this.axios
      .post<CreateCredentialResponse>("/credentials", data)
      .then((r) => r.data);
  }

  /**
   * Fetch runtime configuration from the server.
   * @returns Resolved config: `rpcUrl`, `networkPassphrase`, `issuanceContractId`, `vaultContractId`.
   */
  getConfig() {
    return this.axios.get("/config").then((r) => {
      const d = r.data as {
        rpcUrl: string;
        networkPassphrase: string;
        issuanceContractId?: string;
        vaultContractId?: string;
      };
      const net = this.network;
      return {
        rpcUrl: d.rpcUrl,
        networkPassphrase: d.networkPassphrase,
        issuanceContractId: d.issuanceContractId || DEFAULT_ISSUANCE_CONTRACT_ID[net],
        vaultContractId: d.vaultContractId || DEFAULT_VAULT_CONTRACT_ID[net],
      };
    });
  }

  /**
   * Prepare an unsigned XDR to store a credential in the Vault.
   * @param args - Arguments describing the owner, VC, DID, and fields.
   * @returns `{ unsignedXdr }` to be signed by the caller.
   */
  prepareStoreTx(args: {
    owner: string;
    vcId: string;
    didUri: string;
    fields: Record<string, unknown>;
    vaultContractId?: string;
    issuer?: string;
  }) {
    return this.axios
      .post("/tx/prepare/store", args)
      .then((r) => r.data as { unsignedXdr: string });
  }

  /**
   * Prepare an unsigned XDR to issue a credential via the Issuance contract.
   * @param args - Arguments describing the owner, VC ID, and VC data.
   * @returns `{ unsignedXdr }` to be signed by the caller.
   */
  prepareIssueTx(args: {
    owner: string;
    vcId: string;
    vcData: string;
    vaultContractId?: string;
    issuer?: string;
    issuerDid?: string;
  }) {
    return this.axios
      .post("/tx/prepare/issue", args)
      .then((r) => r.data as { unsignedXdr: string });
  }

  /**
   * Submit a signed XDR to store a credential in the Vault.
   * @param payload - Signed XDR and identifiers.
   * @returns Store result with `vc_id`, `tx_id`, optional `issue_tx_id`, and `verification`.
   */
  vaultStore(payload: {
    signedXdr: string;
    vcId: string;
    owner?: string;
    vaultContractId?: string;
  }) {
    return this.axios.post("/vault/store", payload).then((r) => r.data as {
      vc_id: string;
      tx_id: string;
      issue_tx_id?: string;
      verification?: { status?: string; since?: string };
    });
  }

  /**
   * Verify a credential against the Vault contract.
   * @param args - Owner, VC ID, and optional Vault contract ID.
   * @returns Verification result with `vc_id`, `status`, and optional `since`.
   */
  vaultVerify(args: { owner: string; vcId: string; vaultContractId?: string }) {
    return this.axios
      .post("/vault/verify", args)
      .then((r) => r.data as { vc_id: string; status: string; since?: string });
  }

  /**
   * Verify a credential status via the Issuance contract.
   * @param vcId - Credential identifier.
   * @returns Verification result with `vc_id`, `status`, and optional `since`.
   */
  verifyStatus(vcId: string) {
    return this.axios
      .get(`/verify/${encodeURIComponent(vcId)}`)
      .then((r) => r.data as { vc_id: string; status: string; since?: string });
  }

  /**
   * List credential IDs directly from the Vault contract.
   * @param args - Owner and optional Vault contract ID.
   * @returns `{ vc_ids }` or `{ result }` with IDs.
   */
  vaultListVcIdsDirect(args: { owner: string; vaultContractId?: string }) {
    return this.axios
      .post("/vault/list_vc_ids_direct", args)
      .then((r) => r.data as { vc_ids?: string[]; result?: string[] });
  }

  /**
   * Read a credential directly from the Vault contract.
   * @param args - Owner, VC ID, and optional Vault contract ID.
   * @returns `{ vc }` or `{ result }` with credential contents.
   */
  vaultGetVcDirect(args: { owner: string; vcId: string; vaultContractId?: string }) {
    return this.axios
      .post("/vault/get_vc_direct", args)
      .then((r) => r.data as { vc?: unknown; result?: unknown });
  }
}
