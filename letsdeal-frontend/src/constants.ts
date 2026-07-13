import { PublicKey } from "@solana/web3.js";

// Matches declare_id!() in programs/lets_deal/src/lib.rs
export const PROGRAM_ID = new PublicKey(
  "FzwhoLmFm8avMRpgwTL5mWiC8oi8RSqkbDdYBU7SeQj"
);

export const VAULT_SEED = "vault";

// Override with VITE_RPC_URL in .env for a private RPC (Helius/QuickNode/etc).
// Falls back to the public devnet RPC, which is rate-limited.
export const RPC_URL =
  import.meta.env.VITE_RPC_URL ?? "https://api.devnet.solana.com";

export const CLUSTER_LABEL = import.meta.env.VITE_CLUSTER_LABEL ?? "devnet";

export const EXPLORER_CLUSTER_QS =
  CLUSTER_LABEL === "mainnet" ? "" : `?cluster=${CLUSTER_LABEL}`;

export function explorerTx(sig: string) {
  return `https://explorer.solana.com/tx/${sig}${EXPLORER_CLUSTER_QS}`;
}

export function explorerAddress(addr: string) {
  return `https://explorer.solana.com/address/${addr}${EXPLORER_CLUSTER_QS}`;
}
