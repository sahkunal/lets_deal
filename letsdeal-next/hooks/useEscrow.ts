import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useCallback, useEffect, useState } from "react";
import {
  EscrowAccount,
  fetchEscrow,
  fetchVaultStatus,
} from "../lib/escrowAccount";

export interface VaultStatus {
  vaultPda: PublicKey;
  vaultBalanceLamports: number;
  vaultNftBalance: number;
}

export function useEscrow(escrowAddress: string | null, pollMs = 4000) {
  const { connection } = useConnection();
  const [escrow, setEscrow] = useState<EscrowAccount | null>(null);
  const [vaultStatus, setVaultStatus] = useState<VaultStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!escrowAddress) {
      setEscrow(null);
      setVaultStatus(null);
      return;
    }
    let pubkey: PublicKey;
    try {
      pubkey = new PublicKey(escrowAddress.trim());
    } catch {
      setError("invalid escrow address");
      return;
    }
    setLoading(true);
    try {
      const acc = await fetchEscrow(connection, pubkey);
      setEscrow(acc);
      if (acc) {
        setError(null);
        const vs = await fetchVaultStatus(connection, acc.address, acc.nftMint);
        setVaultStatus(vs);
      } else {
        setVaultStatus(null);
        setError("escrow account not found on this cluster");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "failed to fetch escrow");
    } finally {
      setLoading(false);
    }
  }, [connection, escrowAddress]);

  useEffect(() => {
    refresh();
    if (!escrowAddress) return;
    const id = setInterval(refresh, pollMs);
    return () => clearInterval(id);
  }, [refresh, escrowAddress, pollMs]);

  return { escrow, vaultStatus, loading, error, refresh };
}

