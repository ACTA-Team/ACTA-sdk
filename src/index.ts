/**
 * Entry point for the ACTA SDK.
 *
 * Exposes the provider, client hooks, environment base URLs,
 * and re-exports hooks and types.
 */
export { ActaConfig } from "./providers/ActaProvider";
export { useActaClient } from "./providers/ActaClientContext";

/** Base API URL for ACTA mainnet. */
export const mainNet = "https://acta.build/api/mainnet";
/** Base API URL for ACTA testnet. */
export const testNet = "https://acta.build/api/testnet";

/** Re-export all hooks. */
export * from "./hooks";
/** Re-export all type definitions. */
export * from "./types";
