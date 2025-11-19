/**
 * Provider for the ACTA SDK
 */
export { ActaConfig } from "./providers/ActaProvider";
export { useActaClient } from "./providers/ActaClientContext";

// Export all the enviroments
export const mainNet = "https://acta.build/api/mainnet";
export const testNet = "https://acta.build/api/testnet";

// Export all hooks and types
export * from "./hooks";
export * from "./types";
