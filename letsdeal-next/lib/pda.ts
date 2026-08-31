import { PublicKey } from "@solana/web3.js";
import { PROGRAM_ID, VAULT_SEED } from "../constants";

export function getVaultPda(escrow: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from(VAULT_SEED), escrow.toBuffer()],
    PROGRAM_ID
  );
}
