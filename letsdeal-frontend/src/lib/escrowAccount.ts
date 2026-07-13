import { Connection, PublicKey } from "@solana/web3.js";
import BN from "bn.js";

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
  if (!info) return null;
  return decodeEscrow(address, info.data);
}
