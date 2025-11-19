ACTA SDK — Overview for Judges and Contributors

Purpose
- Provides a small React-friendly SDK to interact with ACTA’s credential services on Stellar.
- Exposes a typed client plus hooks and a provider to manage verifiable credentials, vault operations, and issuer authorization.
- Targets teams building dApps that issue, store, and verify credentials on mainnet or testnet.

Core Concepts
- Verifiable Credential (VC): A signed, portable proof bound to a subject (`vc_id`).
- Vault: On-chain contract that stores and verifies VCs for an owner.
- Issuance Contract: On-chain contract responsible for issuing credentials.
- Network: The SDK auto-detects `mainnet` vs `testnet` from the base URL and selects defaults accordingly.

Architecture
- Provider: Wrap React trees with `ActaConfig` to supply a configured `ActaClient` via context.
  - Defined in `src/providers/ActaProvider.tsx:14–19`.
- Client: `ActaClient` wraps ACTA HTTP APIs and provides higher-level methods for config, transactions, vault, and verification.
  - Defined in `src/client.ts:5–13`.
- Hooks: Thin wrappers around the client for idiomatic React usage.
  - Exported in `src/hooks/index.ts:4–10`.
- Package entry points and network constants are exposed from `src/index.ts:4–13` and `src/types/types.ts:8–21`.

Exports
- Root (`acta-sdk`): `ActaConfig`, `useActaClient`, `mainNet`, `testNet`, all hooks and types.
- Subpaths:
  - `acta-sdk/types` → typed payloads and responses.
  - `acta-sdk/hooks` → React hooks.
  - See `package.json:10–26` for the export map and `dist` build outputs.

Provider
- `ActaConfig` props: `baseURL`, `apiKey`, `children`.
- Internals: creates `ActaClient` once and provides it through `ActaProviderContext`.
- Reference:
  - Provider component `src/providers/ActaProvider.tsx:14–19`.
  - Context and consumer `src/providers/ActaClientContext.ts:4–9`.

Client Surface
- Configuration
  - `getConfig()` → resolves RPC URL, network passphrase, and contract IDs (with defaults).
    - `src/client.ts:26–41`, defaults from `src/types/types.ts:8–16`.
- Credential Issuance
  - `createCredential(payload)` → creates a VC via `/credentials`.
    - `src/client.ts:20–24`, payload type in `src/types/type.payload.ts:1–12`, response in `src/types/types.response.ts:1–4`.
- Transaction Preparation (unsigned XDR)
  - `prepareStoreTx(args)` → `/tx/prepare/store` returns `{ unsignedXdr }`.
    - `src/client.ts:44–55`.
  - `prepareIssueTx(args)` → `/tx/prepare/issue` returns `{ unsignedXdr }`.
    - `src/client.ts:57–68`.
- Vault API
  - `vaultStore(payload)` → submits signed XDR to store a credential in the vault.
    - `src/client.ts:70–82`.
  - `vaultVerify(args)` → verifies a credential’s status in the vault.
    - `src/client.ts:84–88`.
  - `vaultListVcIdsDirect(args)` and `vaultGetVcDirect(args)` → direct read operations.
    - `src/client.ts:96–106`.
- Verification API
  - `verifyStatus(vcId)` → read current verification status.
    - `src/client.ts:90–94`.

React Hooks
- `useConfig()`
  - Returns `{ getConfig }` bound to the client.
  - Reference: `src/hooks/useConfig.ts:3–7`.
- `useCreateCredential()`
  - Returns `{ createCredential }` bound to the client.
  - Reference: `src/hooks/useCreateCredential.ts:8–14`.
- `useTxPrepare()`
  - Returns `{ prepareStore, prepareIssue }` for unsigned XDR.
  - Reference: `src/hooks/useTxPrepare.ts:3–22`.
- `useVaultStore()`
  - Returns `{ vaultStore }` for sending signed XDR.
  - Reference: `src/hooks/useVaultStore.ts:3–8`.
- `useVaultApi()`
  - Returns `{ listVcIdsDirect, getVcDirect, verifyInVault }`.
  - Reference: `src/hooks/useVaultApi.ts:3–12`.
- `useAuthorizeIssuer()`
  - Builds and sends a transaction authorizing an issuer in the vault contract.
  - Reference: `src/hooks/useAuthorizeIssuer.ts:6–45`.
- `useCreateVault()`
  - Builds and sends a transaction initializing a vault for an owner.
  - Reference: `src/hooks/useCreateVault.ts:6–46`.

Typical Flows
- Initialize a vault for an owner
  - Retrieve network config → build vault `initialize` transaction → sign XDR → submit → wait for success.
  - Implemented by `useCreateVault()` using Stellar RPC and contracts.
- Authorize an issuer for a vault
  - Retrieve config → build `authorize_issuer` transaction → sign → submit → confirm.
  - Implemented by `useAuthorizeIssuer()`.
- Issue a credential
  - Option A: server-driven via `createCredential(payload)`.
  - Option B: client-driven by preparing an `issue` XDR, signing, and submitting.
- Store and verify a credential in the vault
  - Prepare `store` XDR → sign → `vaultStore()` → `vaultVerify()` or `verifyStatus()`.
- Read credentials directly from the vault
  - `vaultListVcIdsDirect()` → enumerate IDs; `vaultGetVcDirect()` → fetch VC content.

Networks and Contracts
- Base URLs
  - `mainNet`: `https://acta.build/api/mainnet` (`src/index.ts:8`).
  - `testNet`: `https://acta.build/api/testnet` (`src/index.ts:9`).
- Default Contract IDs (used when server does not provide overrides)
  - Vault: `src/types/types.ts:8–11`.
  - Issuance: `src/types/types.ts:13–16`.
- Default USDC issuer IDs are provided for convenience: `src/types/types.ts:18–21`.

Transactions and Signing
- The SDK prepares unsigned XDR either by building Stellar transactions locally (for vault operations) or by calling ACTA endpoints that return `{ unsignedXdr }`.
- Your application must supply a signer: a function that signs the XDR with the user’s keys.
  - Hooks expect a `signTransaction(unsignedXdr, { networkPassphrase })` callback and handle send-and-wait via Stellar RPC.
  - See `useCreateVault()` and `useAuthorizeIssuer()` for end-to-end signing and submission.

Error Handling and Constraints
- `useActaClient()` throws if called outside `ActaConfig` (`src/providers/ActaClientContext.ts:6–9`).
- Network selection is inferred from `baseURL` (`src/client.ts:9–13`).
- Vault operations require a valid `vaultContractId`; if absent, defaults are applied or the hook throws (`src/hooks/useCreateVault.ts:25`, `src/hooks/useAuthorizeIssuer.ts:25`).
- API responses are minimally shaped and typed; callers should handle nulls in direct reads (`src/hooks/useVaultApi.ts:6–9`).

Build and Distribution
- Build
  - Uses `tsup` to produce ESM, CJS, and type definitions.
  - Script: `npm run build` (`package.json:27–32`).
- Exports
  - Root and subpath exports configured in `package.json:10–26`.
- Peer Dependencies
  - `react` and `react-dom` `>=18 <20` (`package.json:55–58`).

Glossary
- `VC`: Verifiable Credential.
- `Vault`: Smart contract for storing/verifying VCs per owner.
- `XDR`: External Data Representation for Stellar transactions.
- `RPC`: Remote Procedure Call endpoint used to fetch accounts and submit transactions.

Notes for Reviewers
- The SDK intentionally keeps business logic minimal; it delegates transaction signing to the host app and relies on ACTA APIs for preparation and verification.
- Code paths are small and traceable; see references above to quickly navigate implementation details.