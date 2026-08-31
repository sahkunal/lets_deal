"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import { ArrowRight, Wallet, Shield, ArrowDown, Sparkles } from "lucide-react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, Transaction } from "@solana/web3.js";
import BN from "bn.js";
import { buildInitializeIx } from "@/lib/instructions";
import { useEscrow } from "@/hooks/useEscrow";
import { EscrowState } from "@/lib/escrowAccount";

export default function VaultPage() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [sellerInput, setSellerInput] = useState("");
  const [mintInput, setMintInput] = useState("");
  const [amountInput, setAmountInput] = useState("0.5");
  const [hoursInput, setHoursInput] = useState("24");

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successEscrow, setSuccessEscrow] = useState<string | null>(null);

  const canCreate = publicKey && sellerInput.length > 30 && mintInput.length > 30 && Number(amountInput) > 0;

  const handleQuickPreset = () => {
    setSellerInput("4Tzz6U9xM8pBq2vY5nK3jL7wR1dF8sE9aG0cH2eP4vM1");
    setMintInput("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
    setAmountInput("0.25");
    setHoursInput("2");
  };

  async function createDeal() {
    if (!publicKey || !canCreate) return;
    setBusy(true);
    setError(null);
    setSuccessEscrow(null);

    try {
      const escrowKeypair = Keypair.generate();
      const seller = new PublicKey(sellerInput.trim());
      const nftMint = new PublicKey(mintInput.trim());
      const amountLamports = new BN(Math.round(Number(amountInput) * LAMPORTS_PER_SOL));
      const deadline = new BN(Math.floor(Date.now() / 1000) + Math.round(Number(hoursInput) * 3600));

      const ix = buildInitializeIx({
        escrow: escrowKeypair.publicKey,
        buyer: publicKey,
        seller,
        amount: amountLamports,
        deadline,
        nftMint,
      });

      const tx = new Transaction().add(ix);
      tx.feePayer = publicKey;
      tx.partialSign(escrowKeypair);

      const sig = await sendTransaction(tx, connection);
      await connection.confirmTransaction(sig, "confirmed");

      setSuccessEscrow(escrowKeypair.publicKey.toBase58());
      setSellerInput("");
      setMintInput("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Transaction failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bg-subpage" style={{ minHeight: "100vh" }}>
      <Navbar />

      {/* Hero Header */}
      <section style={{ maxWidth: 1360, margin: "0 auto", padding: "64px clamp(24px, 5vw, 64px) 40px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 48, flexWrap: "wrap" }}>
        <FadeUp>
          <div style={{ maxWidth: 540 }}>
            <span className="tag-cyan" style={{ display: "block", marginBottom: 14 }}>Vault Terminal</span>
            <h1 style={{ fontSize: "clamp(34px, 4vw, 52px)", fontWeight: 300, letterSpacing: "-0.035em", lineHeight: 1.1, color: "#FFFFFF", margin: "0 0 20px" }}>
              Create an escrow.<br />
              Lock your terms.
            </h1>
            <p style={{ fontSize: 14.5, fontWeight: 350, color: "#8BA3C7", lineHeight: 1.65, margin: "0 0 28px" }}>
              Connect your Solana wallet, define trade terms, and lock SOL in a tamper-proof Program Derived Address. Zero counterparty custody.
            </p>
          </div>
        </FadeUp>
      </section>

      {/* Swap Card */}
      <section style={{ maxWidth: 1360, margin: "0 auto", padding: "20px clamp(24px, 5vw, 64px) 120px" }}>
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <FadeUp>
            <div className="panel-glass" style={{ padding: 36 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                <div>
                  <h2 style={{ fontSize: 16, fontWeight: 450, color: "#FFFFFF", margin: 0, letterSpacing: "-0.01em" }}>New Escrow Account</h2>
                  <button 
                    onClick={handleQuickPreset}
                    style={{ background: "transparent", border: "none", color: "#3ECBFF", fontSize: 11, marginTop: 6, display: "flex", alignItems: "center", gap: 4, cursor: "pointer", padding: 0 }}
                  >
                    <Sparkles size={11} /> Auto-fill Sample Data
                  </button>
                </div>
                <span style={{ fontSize: 11, color: "#3ECBFF", letterSpacing: "0.08em", fontFamily: "monospace", fontWeight: 400 }}>DEVNET</span>
              </div>

              {/* You Pay */}
              <div style={{ background: "rgba(4, 20, 39, 0.6)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: 14, padding: "18px 20px", marginBottom: 6 }}>
                <div style={{ fontSize: 11, color: "#8BA3C7", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8, fontWeight: 400 }}>You Deposit</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    style={{ fontSize: 28, fontWeight: 250, color: "#FFFFFF", background: "none", border: "none", outline: "none", width: "60%", letterSpacing: "-0.03em" }}
                  />
                  <span style={{ fontSize: 12.5, fontWeight: 450, color: "#FFFFFF", background: "rgba(255,255,255,0.08)", padding: "6px 14px", borderRadius: 9999, border: "1px solid rgba(255,255,255,0.12)" }}>
                    SOL
                  </span>
                </div>
              </div>

              {/* Arrow */}
              <div style={{ display: "flex", justifyContent: "center", margin: "6px 0" }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(4, 20, 39, 0.8)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <ArrowDown size={14} strokeWidth={1.5} color="#8BA3C7" />
                </div>
              </div>

              {/* You Receive */}
              <div style={{ background: "rgba(4, 20, 39, 0.6)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: 14, padding: "18px 20px", marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: "#8BA3C7", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8, fontWeight: 400 }}>NFT Mint Address</div>
                <input
                  placeholder="EPjF…MintAddress"
                  value={mintInput}
                  onChange={(e) => setMintInput(e.target.value)}
                  style={{ fontSize: 13, fontFamily: "monospace", color: "#FFFFFF", background: "none", border: "none", outline: "none", width: "100%", fontWeight: 350 }}
                />
              </div>

              {/* Fields */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: "#8BA3C7", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8, fontWeight: 400 }}>Seller Wallet Address</div>
                <input
                  placeholder="4Tzz…SellerAddress"
                  value={sellerInput}
                  onChange={(e) => setSellerInput(e.target.value)}
                  style={{ width: "100%", background: "rgba(4, 20, 39, 0.6)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: 12, padding: "12px 16px", fontSize: 13, fontFamily: "monospace", color: "#FFFFFF", outline: "none", fontWeight: 350 }}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 11, color: "#8BA3C7", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8, fontWeight: 400 }}>Timeout Deadline (hours)</div>
                <input
                  placeholder="24"
                  type="number"
                  value={hoursInput}
                  onChange={(e) => setHoursInput(e.target.value)}
                  style={{ width: "100%", background: "rgba(4, 20, 39, 0.6)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: 12, padding: "12px 16px", fontSize: 13, fontFamily: "monospace", color: "#FFFFFF", outline: "none", fontWeight: 350 }}
                />
              </div>

              {error && (
                <div style={{ background: "rgba(248, 113, 113, 0.1)", border: "1px solid rgba(248, 113, 113, 0.2)", padding: 12, borderRadius: 8, marginBottom: 16, color: "#F87171", fontSize: 12 }}>
                  {error}
                </div>
              )}

              {successEscrow && (
                <div style={{ background: "rgba(52, 211, 153, 0.1)", border: "1px solid rgba(52, 211, 153, 0.2)", padding: 12, borderRadius: 8, marginBottom: 16, color: "#34D399", fontSize: 12 }}>
                  Escrow Created Successfully!<br/>
                  <span style={{ fontFamily: "monospace" }}>{successEscrow}</span>
                </div>
              )}

              {!publicKey ? (
                <button className="btn-pill-solid" disabled style={{ width: "100%", justifyContent: "center", opacity: 0.5, cursor: "not-allowed" }}>
                  CONNECT WALLET TO DEPLOY
                  <ArrowRight size={14} strokeWidth={1.5} />
                </button>
              ) : (
                <button 
                  className="btn-pill-solid" 
                  onClick={createDeal}
                  disabled={!canCreate || busy}
                  style={{ width: "100%", justifyContent: "center", opacity: canCreate && !busy ? 1 : 0.5, cursor: canCreate && !busy ? "pointer" : "not-allowed" }}
                >
                  {busy ? "DEPLOYING TO DEVNET..." : "DEPLOY ESCROW NOW"}
                  <ArrowRight size={14} strokeWidth={1.5} />
                </button>
              )}

              <div style={{ marginTop: 18, display: "flex", gap: 8, alignItems: "center", justifyContent: "center" }}>
                <Shield size={13} strokeWidth={1.5} color="#8BA3C7" />
                <span style={{ fontSize: 12, color: "#8BA3C7", fontWeight: 350 }}>Non-custodial · PDA vault · Zero admin keys</span>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      <div className="divider" style={{ maxWidth: 1360, margin: "0 auto", padding: "0 clamp(24px, 5vw, 64px)" }} />
      <Footer />
    </div>
  );
}
