import { Connection, PublicKey } from "@solana/web3.js";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import BN from "bn.js";
import { PROGRAM_ID } from "../constants";
import { getVaultPda } from "./pda";

// Mirrors programs/lets_deal/src/state/escrow.rs exactly:
// #[account]
// pub struct Escrow {
//   pub buyer: Pubkey,       // 32
//   pub seller: Pubkey,      // 32
//   pub amount: u64,         // 8
//   pub deadline: i64,       // 8
//   pub nft_mint: Pubkey,    // 32
//   pub state: EscrowState,  // 1  (0=Initialized,1=FundsDeposited,2=NftDeposited,3=Completed,4=Refunded)
// }
// preceded by an 8-byte Anchor account discriminator.

export enum EscrowState {
  Initialized = 0,
  FundsDeposited = 1,
  NftDeposited = 2,
  Completed = 3,
  Refunded = 4,
}

export const EscrowStateLabel: Record<EscrowState, string> = {
  [EscrowState.Initialized]: "initialized",
  [EscrowState.FundsDeposited]: "funds deposited",
  [EscrowState.NftDeposited]: "nft deposited",
  [EscrowState.Completed]: "completed",
  [EscrowState.Refunded]: "refunded",
};

export interface EscrowAccount {
  address: PublicKey;
  buyer: PublicKey;
  seller: PublicKey;
  amount: BN;
  deadline: BN;
  nftMint: PublicKey;
  state: EscrowState;
}

export function decodeEscrow(address: PublicKey, data: Buffer): EscrowAccount {
  let offset = 8; // skip discriminator
  const buyer = new PublicKey(data.subarray(offset, offset + 32));
  offset += 32;
  const seller = new PublicKey(data.subarray(offset, offset + 32));
  offset += 32;
  const amount = new BN(data.subarray(offset, offset + 8), "le");
  offset += 8;
  const deadline = new BN(data.subarray(offset, offset + 8), "le");
  offset += 8;
  const nftMint = new PublicKey(data.subarray(offset, offset + 32));
  offset += 32;
  const state = data.readUInt8(offset) as EscrowState;

  return { address, buyer, seller, amount, deadline, nftMint, state };
}

export async function fetchEscrow(
  connection: Connection,
  address: PublicKey
): Promise<EscrowAccount | null> {
  const info = await connection.getAccountInfo(address);
  if (!info || info.data.length < 121) return null;
  return decodeEscrow(address, info.data);
}

export async function fetchAllEscrows(
  connection: Connection
): Promise<EscrowAccount[]> {
  try {
    const accounts = await connection.getProgramAccounts(PROGRAM_ID, {
      filters: [{ dataSize: 121 }],
    });

    const escrows: EscrowAccount[] = [];
    for (const acc of accounts) {
      try {
        const decoded = decodeEscrow(acc.pubkey, acc.account.data);
        escrows.push(decoded);
      } catch (err) {
        console.warn("Skipping undecodable account:", acc.pubkey.toBase58(), err);
      }
    }
    return escrows;
  } catch (error) {
    console.error("Failed to fetch all escrows:", error);
    return [];
  }
}

export async function fetchVaultStatus(
  connection: Connection,
  escrow: PublicKey,
  nftMint: PublicKey
): Promise<{
  vaultPda: PublicKey;
  vaultBalanceLamports: number;
  vaultNftBalance: number;
}> {
  const [vaultPda] = getVaultPda(escrow);
  let vaultBalanceLamports = 0;
  let vaultNftBalance = 0;

  try {
    vaultBalanceLamports = await connection.getBalance(vaultPda, "confirmed");
  } catch (e) {
    console.warn("Could not fetch vault SOL balance:", e);
  }

  try {
    const vaultAta = getAssociatedTokenAddressSync(nftMint, vaultPda, true);
    const ataInfo = await connection.getTokenAccountBalance(vaultAta, "confirmed");
    if (ataInfo?.value?.uiAmount !== null && ataInfo?.value?.uiAmount !== undefined) {
      vaultNftBalance = ataInfo.value.uiAmount;
    }
  } catch {
    // ATA may not exist yet, which is expected before deposit
    vaultNftBalance = 0;
  }

  return {
    vaultPda,
    vaultBalanceLamports,
    vaultNftBalance,
  };
}
