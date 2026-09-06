"use client";

import { FC, ReactNode, useMemo, useCallback } from "react";
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { WalletError } from "@solana/wallet-adapter-base";
import { RPC_URL } from "../constants";

import "@solana/wallet-adapter-react-ui/styles.css";

export const WalletContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  // Standard wallet auto-detection (Phantom, Solflare, Backpack, Coinbase)
  const wallets = useMemo(() => [], []);

  const onError = useCallback((error: WalletError) => {
    // Gracefully catch expected wallet events (e.g. extension locked, user rejected prompt, or multiple extension conflict)
    console.warn("[Solana Wallet]", error?.name || "WalletError", error?.message || error);
  }, []);

  return (
    <ConnectionProvider endpoint={RPC_URL} config={{ commitment: "confirmed" }}>
      <WalletProvider wallets={wallets} autoConnect onError={onError}>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
