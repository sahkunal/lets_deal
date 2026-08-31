import { PublicKey } from "@solana/web3.js";

// Matches declare_id!() in programs/lets_deal/src/lib.rs
export const PROGRAM_ID = new PublicKey(
  "FzwhoLmFm8avMRpgwTL5mWiC8oi8RSqkbDdYBU7SeQj"
);

export const IDL_METADATA_PDA = new PublicKey(
  "Ba7ykesZrMTGyGkn2mVmGNrj2swWaMDq1BQnpGkN9DzH"
);

export const VAULT_SEED = "vault";

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

export function solscanAddress(addr: string) {
  return `https://solscan.io/account/${addr}${CLUSTER_LABEL === "devnet" ? "?cluster=devnet" : ""}`;
}

export function solscanTx(sig: string) {
  return `https://solscan.io/tx/${sig}${CLUSTER_LABEL === "devnet" ? "?cluster=devnet" : ""}`;
}

// Sample devnet mints for quick test filling
export const SAMPLE_DEVNET_PRESETS = [
  {
    label: "Cyber Samurai NFT",
    seller: "4Tzz6U9xM8pBq2vY5nK3jL7wR1dF8sE9aG0cH2eP4vM1",
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    amount: "0.25",
    hours: "2",
  },
  {
    label: "Mad Lads Devnet Mock",
    seller: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    amount: "1.0",
    hours: "24",
  },
];
