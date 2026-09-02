import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import BN from "bn.js";
import { PROGRAM_ID } from "../constants";
import { ixDiscriminator } from "./discriminator";
import { getVaultPda } from "./pda";
import { resolveAta } from "./ata";


function u64le(n: BN): Buffer {
  return n.toArrayLike(Buffer, "le", 8);
}

function i64le(n: BN): Buffer {
  // two's complement little-endian, 8 bytes
  return n.toTwos(64).toArrayLike(Buffer, "le", 8);
}

/**
 * initialize(amount, deadline, nft_mint)
 * Accounts: escrow(w,s,new) vault(w) buyer(w,s) seller system_program
 */
export function buildInitializeIx(params: {
  escrow: PublicKey;
  buyer: PublicKey;
  seller: PublicKey;
  amount: BN;
  deadline: BN;
  nftMint: PublicKey;
}): TransactionInstruction {
  const [vault] = getVaultPda(params.escrow);

  const data = Buffer.concat([
    ixDiscriminator("initialize"),
    u64le(params.amount),
    i64le(params.deadline),
    params.nftMint.toBuffer(),
  ]);

  return new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: params.escrow, isSigner: true, isWritable: true },
      { pubkey: vault, isSigner: false, isWritable: true },
      { pubkey: params.buyer, isSigner: true, isWritable: true },
      { pubkey: params.seller, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    data,
  });
}

/**
 * deposit_funds()
 * Accounts: escrow(w) buyer(w,s) vault(w) system_program
 */
export function buildDepositFundsIx(params: {
  escrow: PublicKey;
  buyer: PublicKey;
}): TransactionInstruction {
  const [vault] = getVaultPda(params.escrow);

  return new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: params.escrow, isSigner: false, isWritable: true },
      { pubkey: params.buyer, isSigner: true, isWritable: true },
      { pubkey: vault, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    data: ixDiscriminator("deposit_funds"),
  });
}

/**
 * deposit_nft()
 * Accounts: escrow(w) seller(w,s) seller_nft_account(w) vault(w) vault_nft_account(w) token_program
 */
export function buildDepositNftIx(params: {
  escrow: PublicKey;
  seller: PublicKey;
  sellerNftAccount: PublicKey;
  vaultNftAccount: PublicKey;
}): TransactionInstruction {
  const [vault] = getVaultPda(params.escrow);

  return new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: params.escrow, isSigner: false, isWritable: true },
      { pubkey: params.seller, isSigner: true, isWritable: true },
      { pubkey: params.sellerNftAccount, isSigner: false, isWritable: true },
      { pubkey: vault, isSigner: false, isWritable: true },
      { pubkey: params.vaultNftAccount, isSigner: false, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    data: ixDiscriminator("deposit_nft"),
  });
}

/**
 * execute_trade()
 * Accounts: escrow(w) vault(w) seller(w) buyer(w) vault_nft_account(w) buyer_nft_account(w) token_program system_program
 */
export function buildExecuteTradeIx(params: {
  escrow: PublicKey;
  seller: PublicKey;
  buyer: PublicKey;
  vaultNftAccount: PublicKey;
  buyerNftAccount: PublicKey;
}): TransactionInstruction {
  const [vault] = getVaultPda(params.escrow);

  return new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: params.escrow, isSigner: false, isWritable: true },
      { pubkey: vault, isSigner: false, isWritable: true },
      { pubkey: params.seller, isSigner: false, isWritable: true },
      { pubkey: params.buyer, isSigner: false, isWritable: true },
      { pubkey: params.vaultNftAccount, isSigner: false, isWritable: true },
      { pubkey: params.buyerNftAccount, isSigner: false, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    data: ixDiscriminator("execute_trade"),
  });
}

/**
 * refund()
 * Accounts: escrow(w) vault(w) buyer(w,s) system_program
 */
export function buildRefundIx(params: {
  escrow: PublicKey;
  buyer: PublicKey;
}): TransactionInstruction {
  const [vault] = getVaultPda(params.escrow);

  return new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: params.escrow, isSigner: false, isWritable: true },
      { pubkey: vault, isSigner: false, isWritable: true },
      { pubkey: params.buyer, isSigner: true, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    data: ixDiscriminator("refund"),
  });
}

export function createDepositFundsTx(params: {
  escrow: PublicKey;
  buyer: PublicKey;
}): Transaction {
  return new Transaction().add(
    buildDepositFundsIx({
      escrow: params.escrow,
      buyer: params.buyer,
    })
  );
}

export async function createDepositNftTx(
  connection: Connection,
  params: {
    escrow: PublicKey;
    seller: PublicKey;
    nftMint: PublicKey;
  }
): Promise<Transaction> {
  const [vaultPda] = getVaultPda(params.escrow);
  const sellerAta = await resolveAta(
    connection,
    params.seller,
    params.seller,
    params.nftMint,
    false
  );
  const vaultAta = await resolveAta(
    connection,
    params.seller,
    vaultPda,
    params.nftMint,
    true
  );

  const tx = new Transaction();
  if (vaultAta.createIx) {
    tx.add(vaultAta.createIx);
  }
  tx.add(
    buildDepositNftIx({
      escrow: params.escrow,
      seller: params.seller,
      sellerNftAccount: sellerAta.address,
      vaultNftAccount: vaultAta.address,
    })
  );
  return tx;
}

export async function createExecuteTradeTx(
  connection: Connection,
  params: {
    escrow: PublicKey;
    seller: PublicKey;
    buyer: PublicKey;
    nftMint: PublicKey;
    feePayer: PublicKey;
  }
): Promise<Transaction> {
  const [vaultPda] = getVaultPda(params.escrow);
  const vaultAta = await resolveAta(
    connection,
    params.feePayer,
    vaultPda,
    params.nftMint,
    true
  );
  const buyerAta = await resolveAta(
    connection,
    params.feePayer,
    params.buyer,
    params.nftMint,
    false
  );

  const tx = new Transaction();
  if (buyerAta.createIx) {
    tx.add(buyerAta.createIx);
  }
  tx.add(
    buildExecuteTradeIx({
      escrow: params.escrow,
      seller: params.seller,
      buyer: params.buyer,
      vaultNftAccount: vaultAta.address,
      buyerNftAccount: buyerAta.address,
    })
  );
  return tx;
}

export function createRefundTx(params: {
  escrow: PublicKey;
  buyer: PublicKey;
}): Transaction {
  return new Transaction().add(
    buildRefundIx({
      escrow: params.escrow,
      buyer: params.buyer,
    })
  );
}

