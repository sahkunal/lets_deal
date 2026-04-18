import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, createMint, createAccount, mintTo, getAccount, createAssociatedTokenAccount, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { LetsDeal } from "../target/types/lets_deal";

describe("lets_deal", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const program = anchor.workspace.LetsDeal as Program<LetsDeal>;
  const provider = anchor.AnchorProvider.env();
  const buyer = provider.wallet as anchor.Wallet;
  const seller = Keypair.generate();

  let escrow: Keypair;
  let vaultPda: PublicKey;
  let nftMint: PublicKey;
  let sellerNftAccount: PublicKey;
  let vaultNftAccount: PublicKey;
  let buyerNftAccount: PublicKey;

  before(async () => {
    const tx = await provider.sendAndConfirm(
      new anchor.web3.Transaction().add(
        SystemProgram.transfer({
          fromPubkey: buyer.publicKey,
          toPubkey: seller.publicKey,
          lamports: 1 * LAMPORTS_PER_SOL,
        })
      )
    );
    console.log("Funded seller:", tx);
  });

  it("Initializes escrow", async () => {
    escrow = Keypair.generate();

    nftMint = await createMint(
      provider.connection,
      buyer.payer,
      seller.publicKey,
      null,
      0
    );

    [vaultPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), escrow.publicKey.toBuffer()],
      program.programId
    );

    // Regular token accounts for seller and buyer
    sellerNftAccount = (await getOrCreateAssociatedTokenAccount(
      provider.connection,
      buyer.payer,
      nftMint,
      seller.publicKey
    )).address;

    buyerNftAccount = (await getOrCreateAssociatedTokenAccount(
      provider.connection,
      buyer.payer,
      nftMint,
      buyer.publicKey
    )).address;

    // Vault token account — PDA owner needs allowOwnerOffCurve
    vaultNftAccount = (await getOrCreateAssociatedTokenAccount(
      provider.connection,
      buyer.payer,
      nftMint,
      vaultPda,
      true // allowOwnerOffCurve
    )).address;

    // Mint 1 NFT to seller
    await mintTo(
      provider.connection,
      buyer.payer,
      nftMint,
      sellerNftAccount,
      seller,
      1
    );

    const amount = new anchor.BN(1_000_000);
    const deadline = new anchor.BN(Math.floor(Date.now() / 1000) + 3600);

    const tx = await program.methods
      .initialize(amount, deadline, nftMint)
      .accounts({
        escrow: escrow.publicKey,
        vault: vaultPda,
        buyer: buyer.publicKey,
        seller: seller.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([escrow])
      .rpc();

    console.log("Initialize tx:", tx);
    const escrowState = await program.account.escrow.fetch(escrow.publicKey);
    console.log("Escrow state:", escrowState.state);
  });

  it("Deposits SOL into vault", async () => {
    const tx = await program.methods
      .depositFunds()
      .accounts({
        escrow: escrow.publicKey,
        buyer: buyer.publicKey,
        vault: vaultPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("DepositFunds tx:", tx);
    const vaultBalance = await provider.connection.getBalance(vaultPda);
    console.log("Vault balance:", vaultBalance);
  });

  it("Deposits NFT into vault", async () => {
    const tx = await program.methods
      .depositNft()
      .accounts({
        escrow: escrow.publicKey,
        seller: seller.publicKey,
        sellerNftAccount,
        vault: vaultPda,
        vaultNftAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .signers([seller])
      .rpc();

    console.log("DepositNFT tx:", tx);
    const vaultNft = await getAccount(provider.connection, vaultNftAccount);
    console.log("Vault NFT amount:", vaultNft.amount.toString());
  });

  it("Executes trade", async () => {
    const tx = await program.methods
  .executeTrade()
  .accounts({
    escrow: escrow.publicKey,
    vault: vaultPda,
    seller: seller.publicKey,
    buyer: buyer.publicKey,
    vaultNftAccount,
    buyerNftAccount,
    tokenProgram: TOKEN_PROGRAM_ID,
    systemProgram: SystemProgram.programId,
  })
  .rpc();

    console.log("ExecuteTrade tx:", tx);
    const buyerNft = await getAccount(provider.connection, buyerNftAccount);
    console.log("Buyer NFT amount:", buyerNft.amount.toString());
  });

  it("Refund (deposit then refund after deadline)", async () => {
    const refundEscrow = Keypair.generate();
    const [refundVault] = PublicKey.findProgramAddressSync(
      [Buffer.from("vault"), refundEscrow.publicKey.toBuffer()],
      program.programId
    );

    const amount = new anchor.BN(1_000_000);
    const deadline = new anchor.BN(Math.floor(Date.now() / 1000) + 10);

    await program.methods
      .initialize(amount, deadline, nftMint)
      .accounts({
        escrow: refundEscrow.publicKey,
        vault: refundVault,
        buyer: buyer.publicKey,
        seller: seller.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([refundEscrow])
      .rpc();

    await program.methods
      .depositFunds()
      .accounts({
        escrow: refundEscrow.publicKey,
        buyer: buyer.publicKey,
        vault: refundVault,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    console.log("Waiting for deadline...");
    await new Promise((resolve) => setTimeout(resolve, 12000));

    const tx = await program.methods
      .refund()
      .accounts({
        escrow: refundEscrow.publicKey,
        vault: refundVault,
        buyer: buyer.publicKey,
      })
      .rpc();

    console.log("Refund tx:", tx);
  });
});