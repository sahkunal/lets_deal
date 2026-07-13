import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useCallback, useEffect, useState } from "react";
import { EscrowAccount, fetchEscrow } from "../lib/escrowAccount";

export function useEscrow(escrowAddress: string | null, pollMs = 4000) {
  const { connection } = useConnection();
  const [escrow, setEscrow] = useState<EscrowAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!escrowAddress) {
      setEscrow(null);
      return;
    }
    let pubkey: PublicKey;
    try {
      pubkey = new PublicKey(escrowAddress);
    } catch {
      setError("invalid escrow address");
      return;
    }
    setLoading(true);
    try {
      const acc = await fetchEscrow(connection, pubkey);
      setEscrow(acc);
      setError(acc ? null : "escrow account not found on this cluster");
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

  return { escrow, loading, error, refresh };
}
