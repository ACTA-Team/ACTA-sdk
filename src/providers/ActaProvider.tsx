"use client";

import React, { useState } from "react";
import { baseURL } from "../types/types";
import { ActaClient } from "../client";
import { ActaProviderContext, useActaClient } from "./ActaClientContext";

export interface ActaConfigProps {
  baseURL: baseURL;
  apiKey: string;
  children: any;
}

/**
 * React provider that instantiates and exposes an `ActaClient`.
 * Wrap your app with this component to make the client available via `useActaClient()`.
 */
export const ActaConfig = ({ baseURL, apiKey, children }: ActaConfigProps) => {
  const [client] = useState(() => new ActaClient(baseURL, apiKey));

  return (
    <ActaProviderContext.Provider value={{ client }}>{children}</ActaProviderContext.Provider>
  );
};
