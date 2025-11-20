import { useActaClient } from "../providers/ActaClientContext";
import { CreateCredentialPayload } from "../types";

/**
 * Hook to issue a new credential via the API.
 * @returns `{ createCredential }` which posts to `/credentials`.
 */
export function useCreateCredential() {
  const client = useActaClient();

  return {
    createCredential: (payload: CreateCredentialPayload) =>
      client.createCredential(payload),
  };
}
