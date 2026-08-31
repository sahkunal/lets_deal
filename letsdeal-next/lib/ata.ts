import { Connection, PublicKey, TransactionInstruction } from "@solana/web3.js";
import {
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";

/**
 * Returns the ATA address for (owner, mint), plus a create-instruction if
 * the account doesn't exist on-chain yet. Pass allowOwnerOffCurve=true for
 * PDA owners (the vault).
 */
export async function resolveAta(
  connection: Connection,
  payer: PublicKey,
  owner: PublicKey,
  mint: PublicKey,
  allowOwnerOffCurve = false
): Promise<{ address: PublicKey; createIx: TransactionInstruction | null }> {
  const address = getAssociatedTokenAddressSync(
    mint,
    owner,
    allowOwnerOffCurve
  );
  const info = await connection.getAccountInfo(address);
  if (info) {
    return { address, createIx: null };
  }
  return {
    address,
    createIx: createAssociatedTokenAccountInstruction(
      payer,
      address,
      owner,
      mint
    ),
  };
}
