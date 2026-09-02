"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import {
  ArrowRight,
  ArrowDown,
  Sparkles,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import {
  CoolVaultIcon,
  CoolSwapIcon,
  CoolTimelockIcon,
  CoolNftMatrixIcon,
} from "@/components/CoolIcons";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, LAMPORTS_PER_SOL, PublicKey, Transaction } from "@solana/web3.js";
import BN from "bn.js";
import {
  buildInitializeIx,
  buildDepositFundsIx,
  createDepositFundsTx,
  createDepositNftTx,
  createExecuteTradeTx,
  createRefundTx,
} from "@/lib/instructions";
import { useEscrow } from "@/hooks/useEscrow";
import { useCountdown } from "@/hooks/useCountdown";
import { EscrowState, EscrowStateLabel } from "@/lib/escrowAccount";
import { explorerAddress, explorerTx } from "@/constants";

const KNOWN_DEVNET_ESCROW = "28dfA6RRoTkD6hBJSvH3bXPKZEr7dHrYJpC6QsvrkzRc";

function VaultContent() {
  const searchParams = useSearchParams();
  const initialEscrow = searchParams.get("escrow") || "";
  const initialTab = searchParams.get("tab") === "manage" || initialEscrow ? "manage" : "create";

  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [activeTab, setActiveTab] = useState<"create" | "manage">(initialTab);

  // Form states for creation
  const [sellerInput, setSellerInput] = useState("");
  const [mintInput, setMintInput] = useState("");
  const [amountInput, setAmountInput] = useState("0.5");
  const [hoursInput, setHoursInput] = useState("24");
  const [autoDeposit, setAutoDeposit] = useState(true);

  // Manage / inspect states
  const [searchEscrowInput, setSearchEscrowInput] = useState(initialEscrow);
  const [activeEscrowAddr, setActiveEscrowAddr] = useState<string | null>(initialEscrow || null);

  // Action status
  const [busy, setBusy] = useState(false);
  const [actionLabel, setActionLabel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [txSuccess, setTxSuccess] = useState<{ sig: string; desc: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Hook for active escrow on-chain data
  const { escrow, vaultStatus, loading: escrowLoading, error: escrowError, refresh } = useEscrow(
    activeEscrowAddr,
    4000
  );

  const countdown = useCountdown(escrow ? escrow.deadline.toNumber() : null);

  useEffect(() => {
    if (initialEscrow) {
      setSearchEscrowInput(initialEscrow);
      setActiveEscrowAddr(initialEscrow);
      setActiveTab("manage");
    }
  }, [initialEscrow]);

  const canCreate =
    publicKey && sellerInput.trim().length > 30 && mintInput.trim().length > 30 && Number(amountInput) > 0;

  const handleQuickPreset = () => {
    setSellerInput("4Tzz6U9xM8pBq2vY5nK3jL7wR1dF8sE9aG0cH2eP4vM1");
    setMintInput("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
    setAmountInput("0.25");
    setHoursInput("2");
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 1. Create Escrow Deal
  async function handleCreateDeal() {
    if (!publicKey || !canCreate) return;
    setBusy(true);
    setActionLabel(autoDeposit ? "Deploying & Locking SOL..." : "Deploying Escrow...");
    setError(null);
    setTxSuccess(null);

    try {
      const escrowKeypair = Keypair.generate();
      const seller = new PublicKey(sellerInput.trim());
      const nftMint = new PublicKey(mintInput.trim());
      const amountLamports = new BN(Math.round(Number(amountInput) * LAMPORTS_PER_SOL));
      const deadline = new BN(Math.floor(Date.now() / 1000) + Math.round(Number(hoursInput) * 3600));

      const initIx = buildInitializeIx({
        escrow: escrowKeypair.publicKey,
        buyer: publicKey,
        seller,
        amount: amountLamports,
        deadline,
        nftMint,
      });

      const tx = new Transaction().add(initIx);

      if (autoDeposit) {
        const depositIx = buildDepositFundsIx({
          escrow: escrowKeypair.publicKey,
          buyer: publicKey,
        });
        tx.add(depositIx);
      }

      tx.feePayer = publicKey;
      tx.partialSign(escrowKeypair);

      const sig = await sendTransaction(tx, connection);
      await connection.confirmTransaction(sig, "confirmed");

      const newAddr = escrowKeypair.publicKey.toBase58();
      setTxSuccess({
        sig,
        desc: autoDeposit
          ? `Escrow initialized & ${amountInput} SOL locked in vault!`
          : "Escrow initialized on-chain!",
      });
      setActiveEscrowAddr(newAddr);
      setSearchEscrowInput(newAddr);
      setActiveTab("manage");
      setSellerInput("");
      setMintInput("");
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Transaction failed");
    } finally {
      setBusy(false);
      setActionLabel(null);
    }
  }

  // 2. Deposit Funds (Buyer)
  async function handleDepositFunds() {
    if (!publicKey || !escrow) return;
    setBusy(true);
    setActionLabel("Locking SOL in Vault...");
    setError(null);
    setTxSuccess(null);

    try {
      const tx = createDepositFundsTx({
        escrow: escrow.address,
        buyer: publicKey,
      });
      const sig = await sendTransaction(tx, connection);
      await connection.confirmTransaction(sig, "confirmed");
      setTxSuccess({ sig, desc: "SOL deposited into vault successfully!" });
      refresh();
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Deposit failed");
    } finally {
      setBusy(false);
      setActionLabel(null);
    }
  }

  // 3. Deposit NFT (Seller)
  async function handleDepositNft() {
    if (!publicKey || !escrow) return;
    setBusy(true);
    setActionLabel("Depositing NFT into Vault ATA...");
    setError(null);
    setTxSuccess(null);

    try {
      const tx = await createDepositNftTx(connection, {
        escrow: escrow.address,
        seller: publicKey,
        nftMint: escrow.nftMint,
      });
      const sig = await sendTransaction(tx, connection);
      await connection.confirmTransaction(sig, "confirmed");
      setTxSuccess({ sig, desc: "NFT deposited into vault ATA successfully!" });
      refresh();
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "NFT deposit failed");
    } finally {
      setBusy(false);
      setActionLabel(null);
    }
  }

  // 4. Execute Trade (Buyer or Seller)
  async function handleExecuteTrade() {
    if (!publicKey || !escrow) return;
    setBusy(true);
    setActionLabel("Executing Atomic Trade Swap...");
    setError(null);
    setTxSuccess(null);

    try {
      const tx = await createExecuteTradeTx(connection, {
        escrow: escrow.address,
        seller: escrow.seller,
        buyer: escrow.buyer,
        nftMint: escrow.nftMint,
        feePayer: publicKey,
      });
      const sig = await sendTransaction(tx, connection);
      await connection.confirmTransaction(sig, "confirmed");
      setTxSuccess({ sig, desc: "Trade settled atomically! NFT & SOL exchanged." });
      refresh();
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Trade execution failed");
    } finally {
      setBusy(false);
      setActionLabel(null);
    }
  }

  // 5. Claim Refund (Buyer if expired)
  async function handleRefund() {
    if (!publicKey || !escrow) return;
    setBusy(true);
    setActionLabel("Claiming Vault Refund...");
    setError(null);
    setTxSuccess(null);

    try {
      const tx = createRefundTx({
        escrow: escrow.address,
        buyer: publicKey,
      });
      const sig = await sendTransaction(tx, connection);
      await connection.confirmTransaction(sig, "confirmed");
      setTxSuccess({ sig, desc: "100% of vault funds refunded to buyer!" });
      refresh();
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "Refund failed");
    } finally {
      setBusy(false);
      setActionLabel(null);
    }
  }

  // Role detection
  const isBuyer = publicKey && escrow ? publicKey.equals(escrow.buyer) : false;
  const isSeller = publicKey && escrow ? publicKey.equals(escrow.seller) : false;

  const stateColors: Record<EscrowState, string> = {
    [EscrowState.Initialized]: "#3ECBFF",
    [EscrowState.FundsDeposited]: "#F5C842",
    [EscrowState.NftDeposited]: "#818CF8",
    [EscrowState.Completed]: "#34D399",
    [EscrowState.Refunded]: "#F87171",
  };

  return (
    <div className="bg-subpage" style={{ minHeight: "100vh" }}>
      <Navbar />

      {/* Hero Header */}
      <section
        style={{
          maxWidth: 1360,
          margin: "0 auto",
          padding: "56px clamp(24px, 5vw, 64px) 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 32,
          flexWrap: "wrap",
        }}
      >
        <FadeUp>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <span
                style={{
                  background: "rgba(20, 241, 149, 0.12)",
                  border: "1px solid rgba(20, 241, 149, 0.3)",
                  color: "#14F195",
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: 9999,
                  fontFamily: "monospace",
                }}
              >
                SOLANA VAULT TERMINAL
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "#9945FF",
                  letterSpacing: "0.08em",
                  fontFamily: "monospace",
                  background: "rgba(153, 69, 255, 0.1)",
                  padding: "4px 10px",
                  borderRadius: 9999,
                  border: "1px solid rgba(153, 69, 255, 0.2)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <CoolVaultIcon size={13} />
                PDA VERIFIED
              </span>
            </div>
            <h1
              style={{
                fontSize: "clamp(32px, 4vw, 48px)",
                fontWeight: 700,
                letterSpacing: "-0.035em",
                lineHeight: 1.05,
                color: "#FFFFFF",
                margin: 0,
              }}
            >
              Non-custodial escrow terminal.
              <br />
              <span className="font-light text-solana-gradient">
                Atomic SOL ⇄ NFT swaps.
              </span>
            </h1>
            <p style={{ fontSize: 14, fontWeight: 350, color: "#8BA3C7", lineHeight: 1.6, maxWidth: 580, margin: "14px 0 0" }}>
              Deploy deterministic escrow contracts, lock SOL and SPL tokens in Program Derived Address vaults,
              and execute atomic swaps with zero counterparty risk.
            </p>
          </div>
        </FadeUp>

        {/* Tab Switcher */}
        <div
          style={{
            padding: 4,
            display: "flex",
            borderRadius: 9999,
            gap: 6,
            background: "rgba(13, 12, 17, 0.8)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <button
            onClick={() => setActiveTab("create")}
            className={activeTab === "create" ? "btn-solana-primary" : "btn-solana-secondary"}
            style={{
              padding: "8px 20px",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Create Escrow
          </button>
          <button
            onClick={() => setActiveTab("manage")}
            className={activeTab === "manage" ? "btn-solana-primary" : "btn-solana-secondary"}
            style={{
              padding: "8px 20px",
              fontSize: 12,
              cursor: "pointer",
            }}
          >
            Inspect &amp; Manage Escrow
          </button>
        </div>
      </section>

      {/* Main Terminal Container */}
      <section style={{ maxWidth: 1360, margin: "0 auto", padding: "16px clamp(24px, 5vw, 64px) 120px" }}>
        {/* Global Notifications */}
        {error && (
          <div
            style={{
              maxWidth: 800,
              margin: "0 auto 24px",
              background: "rgba(248, 113, 113, 0.12)",
              border: "1px solid rgba(248, 113, 113, 0.3)",
              padding: "14px 18px",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              gap: 12,
              color: "#F87171",
              fontSize: 13,
            }}
          >
            <AlertCircle size={18} />
            <div style={{ flex: 1 }}>{error}</div>
            <button
              onClick={() => setError(null)}
              style={{ background: "none", border: "none", color: "#F87171", cursor: "pointer", fontSize: 12 }}
            >
              ✕
            </button>
          </div>
        )}

        {txSuccess && (
          <div
            style={{
              maxWidth: 800,
              margin: "0 auto 24px",
              background: "rgba(52, 211, 153, 0.12)",
              border: "1px solid rgba(52, 211, 153, 0.3)",
              padding: "14px 18px",
              borderRadius: 12,
              color: "#34D399",
              fontSize: 13,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <CheckCircle2 size={18} />
              <strong>{txSuccess.desc}</strong>
            </div>
            <a
              href={explorerTx(txSuccess.sig)}
              target="_blank"
              rel="noreferrer"
              style={{
                color: "#3ECBFF",
                fontSize: 12,
                fontFamily: "monospace",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                textDecoration: "underline",
              }}
            >
              View on Solana Explorer <ExternalLink size={11} />
            </a>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: CREATE ESCROW                                                      */}
        {/* ========================================================================= */}
        {activeTab === "create" && (
          <div style={{ maxWidth: 520, margin: "0 auto" }}>
            <FadeUp>
              <div className="panel-glass" style={{ padding: 36 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                  <div>
                    <h2 style={{ fontSize: 17, fontWeight: 450, color: "#FFFFFF", margin: 0, letterSpacing: "-0.01em" }}>
                      New Escrow Parameters
                    </h2>
                    <button
                      onClick={handleQuickPreset}
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "#3ECBFF",
                        fontSize: 11,
                        marginTop: 6,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      <Sparkles size={12} /> Auto-fill Sample Data
                    </button>
                  </div>
                  <span style={{ fontSize: 11, color: "#8BA3C7", fontFamily: "monospace" }}>121 BYTES</span>
                </div>

                {/* You Deposit */}
                <div
                  style={{
                    background: "rgba(4, 20, 39, 0.6)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: 14,
                    padding: "18px 20px",
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: "#8BA3C7",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    Buyer Deposit Amount
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <input
                      type="number"
                      placeholder="0.00"
                      value={amountInput}
                      onChange={(e) => setAmountInput(e.target.value)}
                      style={{
                        fontSize: 28,
                        fontWeight: 250,
                        color: "#FFFFFF",
                        background: "none",
                        border: "none",
                        outline: "none",
                        width: "60%",
                        letterSpacing: "-0.03em",
                      }}
                    />
                    <span
                      style={{
                        fontSize: 12.5,
                        fontWeight: 450,
                        color: "#FFFFFF",
                        background: "rgba(255,255,255,0.08)",
                        padding: "6px 14px",
                        borderRadius: 9999,
                        border: "1px solid rgba(255,255,255,0.12)",
                      }}
                    >
                      SOL
                    </span>
                  </div>
                </div>

                {/* Arrow */}
                <div style={{ display: "flex", justifyContent: "center", margin: "6px 0" }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "rgba(4, 20, 39, 0.8)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ArrowDown size={14} strokeWidth={1.5} color="#8BA3C7" />
                  </div>
                </div>

                {/* NFT Mint */}
                <div
                  style={{
                    background: "rgba(4, 20, 39, 0.6)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: 14,
                    padding: "16px 20px",
                    marginBottom: 16,
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      color: "#8BA3C7",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    Required NFT Mint Address
                  </div>
                  <input
                    placeholder="EPjF…MintAddress (32 bytes)"
                    value={mintInput}
                    onChange={(e) => setMintInput(e.target.value)}
                    style={{
                      fontSize: 13,
                      fontFamily: "monospace",
                      color: "#FFFFFF",
                      background: "none",
                      border: "none",
                      outline: "none",
                      width: "100%",
                    }}
                  />
                </div>

                {/* Seller Wallet Address */}
                <div style={{ marginBottom: 16 }}>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#8BA3C7",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    Seller Wallet Address
                  </div>
                  <input
                    placeholder="4Tzz…SellerWallet (32 bytes)"
                    value={sellerInput}
                    onChange={(e) => setSellerInput(e.target.value)}
                    style={{
                      width: "100%",
                      background: "rgba(4, 20, 39, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: 12,
                      padding: "12px 16px",
                      fontSize: 13,
                      fontFamily: "monospace",
                      color: "#FFFFFF",
                      outline: "none",
                    }}
                  />
                </div>

                {/* Timeout Deadline */}
                <div style={{ marginBottom: 20 }}>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#8BA3C7",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      marginBottom: 8,
                    }}
                  >
                    Timeout Deadline (hours from now)
                  </div>
                  <input
                    placeholder="24"
                    type="number"
                    value={hoursInput}
                    onChange={(e) => setHoursInput(e.target.value)}
                    style={{
                      width: "100%",
                      background: "rgba(4, 20, 39, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: 12,
                      padding: "12px 16px",
                      fontSize: 13,
                      fontFamily: "monospace",
                      color: "#FFFFFF",
                      outline: "none",
                    }}
                  />
                </div>

                {/* Auto deposit toggle */}
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 26,
                    cursor: "pointer",
                    fontSize: 12.5,
                    color: "#8BA3C7",
                    background: "rgba(0, 163, 255, 0.05)",
                    padding: "10px 14px",
                    borderRadius: 10,
                    border: "1px solid rgba(0, 163, 255, 0.15)",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={autoDeposit}
                    onChange={(e) => setAutoDeposit(e.target.checked)}
                    style={{ accentColor: "#3ECBFF", width: 16, height: 16, cursor: "pointer" }}
                  />
                  <span>
                    Lock <strong style={{ color: "#FFFFFF" }}>{amountInput || 0} SOL</strong> into vault immediately in the same slot
                  </span>
                </label>

                {/* Deploy Button */}
                {!publicKey ? (
                  <button
                    className="btn-solana-secondary"
                    disabled
                    style={{ width: "100%", justifyContent: "center", opacity: 0.5, cursor: "not-allowed" }}
                  >
                    CONNECT WALLET TO DEPLOY
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    className="btn-solana-primary"
                    onClick={handleCreateDeal}
                    disabled={!canCreate || busy}
                    style={{
                      width: "100%",
                      justifyContent: "center",
                      opacity: canCreate && !busy ? 1 : 0.5,
                      cursor: canCreate && !busy ? "pointer" : "not-allowed",
                    }}
                  >
                    <span>{busy ? actionLabel || "DEPLOYING TO DEVNET..." : "DEPLOY ESCROW NOW"}</span>
                    <span className="btn-solana-arrow">
                      <ArrowRight size={14} />
                    </span>
                  </button>
                )}

                <div style={{ marginTop: 18, display: "flex", gap: 8, alignItems: "center", justifyContent: "center" }}>
                  <CoolVaultIcon size={15} />
                  <span style={{ fontSize: 12, color: "#8BA3C7", fontWeight: 350 }}>
                    Non-custodial · PDA vault · Zero admin keys
                  </span>
                </div>
              </div>
            </FadeUp>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: INSPECT & MANAGE ESCROW                                            */}
        {/* ========================================================================= */}
        {activeTab === "manage" && (
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <FadeUp>
              {/* Lookup Bar */}
              <div
                className="panel-glass"
                style={{
                  padding: 20,
                  marginBottom: 24,
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <div style={{ flex: 1, minWidth: 280 }}>
                  <div style={{ fontSize: 11, color: "#8BA3C7", textTransform: "uppercase", marginBottom: 6 }}>
                    Escrow Account Address
                  </div>
                  <input
                    placeholder="Enter on-chain Escrow address..."
                    value={searchEscrowInput}
                    onChange={(e) => setSearchEscrowInput(e.target.value)}
                    style={{
                      width: "100%",
                      background: "rgba(4, 20, 39, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: 10,
                      padding: "10px 14px",
                      fontSize: 13,
                      fontFamily: "monospace",
                      color: "#FFFFFF",
                      outline: "none",
                    }}
                  />
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-end", marginTop: 18 }}>
                  <button
                    onClick={() => setActiveEscrowAddr(searchEscrowInput.trim())}
                    className="btn-pill-solid"
                    style={{ padding: "10px 20px", fontSize: 12 }}
                  >
                    LOAD ESCROW
                  </button>
                  <button
                    onClick={() => {
                      setSearchEscrowInput(KNOWN_DEVNET_ESCROW);
                      setActiveEscrowAddr(KNOWN_DEVNET_ESCROW);
                    }}
                    className="btn-pill-glass"
                    style={{ padding: "10px 14px", fontSize: 11, color: "#3ECBFF" }}
                    title="Load verified Devnet sample escrow"
                  >
                    Sample Escrow
                  </button>
                </div>
              </div>

              {/* Escrow Display Card */}
              {escrowLoading && (
                <div className="panel-glass" style={{ padding: 48, textAlign: "center" }}>
                  <RefreshCw className="animate-spin" size={24} color="#3ECBFF" style={{ margin: "0 auto 12px" }} />
                  <div style={{ fontSize: 14, color: "#8BA3C7" }}>Fetching on-chain escrow state from Devnet...</div>
                </div>
              )}

              {escrowError && !escrowLoading && (
                <div
                  className="panel-glass"
                  style={{
                    padding: 36,
                    textAlign: "center",
                    border: "1px solid rgba(248, 113, 113, 0.2)",
                  }}
                >
                  <AlertCircle size={28} color="#F87171" style={{ margin: "0 auto 12px" }} />
                  <h3 style={{ fontSize: 16, color: "#FFFFFF", margin: "0 0 8px" }}>Escrow Not Found</h3>
                  <p style={{ fontSize: 13, color: "#8BA3C7", maxWidth: 460, margin: "0 auto 20px" }}>
                    {escrowError}. Make sure you are connected to Solana Devnet and the account has been initialized.
                  </p>
                  <button
                    onClick={() => {
                      setSearchEscrowInput(KNOWN_DEVNET_ESCROW);
                      setActiveEscrowAddr(KNOWN_DEVNET_ESCROW);
                    }}
                    className="btn-pill-solid"
                    style={{ fontSize: 12 }}
                  >
                    Load Verified Devnet Escrow
                  </button>
                </div>
              )}

              {escrow && !escrowLoading && (
                <div className="panel-glass" style={{ padding: 36 }}>
                  {/* Top Bar: Address + Status + Copy */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: 16,
                      borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                      paddingBottom: 24,
                      marginBottom: 28,
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: "#8BA3C7" }}>Escrow Account:</span>
                        <span style={{ fontFamily: "monospace", fontSize: 14, color: "#FFFFFF", fontWeight: 500 }}>
                          {escrow.address.toBase58()}
                        </span>
                        <button
                          onClick={() => handleCopy(escrow.address.toBase58())}
                          style={{
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: copied ? "#34D399" : "#8BA3C7",
                            padding: 2,
                          }}
                          title="Copy address"
                        >
                          <Copy size={13} />
                        </button>
                        <a
                          href={explorerAddress(escrow.address.toBase58())}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "#3ECBFF", display: "inline-flex", alignItems: "center" }}
                          title="View on Solana Explorer"
                        >
                          <ExternalLink size={13} />
                        </a>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span
                          style={{
                            fontSize: 11,
                            padding: "3px 10px",
                            borderRadius: 9999,
                            fontFamily: "monospace",
                            fontWeight: 600,
                            letterSpacing: "0.05em",
                            textTransform: "uppercase",
                            color: stateColors[escrow.state],
                            background: `${stateColors[escrow.state]}18`,
                            border: `1px solid ${stateColors[escrow.state]}40`,
                          }}
                        >
                          {EscrowStateLabel[escrow.state]}
                        </span>

                        {/* Connected Role Indicator */}
                        {publicKey && (
                          <span
                            style={{
                              fontSize: 11,
                              color: isBuyer ? "#34D399" : isSeller ? "#818CF8" : "#8BA3C7",
                              background: "rgba(255,255,255,0.04)",
                              padding: "3px 10px",
                              borderRadius: 9999,
                            }}
                          >
                            {isBuyer ? "● YOU ARE THE BUYER" : isSeller ? "● YOU ARE THE SELLER" : "● OBSERVING"}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={refresh}
                      className="btn-pill-glass"
                      style={{ fontSize: 11, padding: "6px 12px", display: "flex", alignItems: "center", gap: 6 }}
                    >
                      <RefreshCw size={11} /> Refresh On-Chain State
                    </button>
                  </div>

                  {/* 4-Phase Visual Pipeline Stepper */}
                  <div style={{ marginBottom: 32 }}>
                    <div style={{ fontSize: 11, color: "#8BA3C7", textTransform: "uppercase", marginBottom: 14 }}>
                      Lifecycle Phase Progress
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: 8,
                      }}
                    >
                      {[
                        { label: "1. Initialized", active: escrow.state >= EscrowState.Initialized },
                        { label: "2. SOL Locked", active: escrow.state >= EscrowState.FundsDeposited },
                        { label: "3. NFT Locked", active: escrow.state >= EscrowState.NftDeposited },
                        {
                          label: escrow.state === EscrowState.Refunded ? "4. Refunded" : "4. Executed",
                          active: escrow.state === EscrowState.Completed || escrow.state === EscrowState.Refunded,
                        },
                      ].map((step, idx) => (
                        <div
                          key={idx}
                          style={{
                            background: step.active ? "rgba(0, 163, 255, 0.1)" : "rgba(255, 255, 255, 0.03)",
                            border: `1px solid ${step.active ? "#3ECBFF" : "rgba(255, 255, 255, 0.08)"}`,
                            borderRadius: 8,
                            padding: "10px 12px",
                            textAlign: "center",
                          }}
                        >
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 500,
                              color: step.active ? "#FFFFFF" : "#526B8E",
                            }}
                          >
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                      gap: 16,
                      marginBottom: 32,
                    }}
                  >
                    <div className="stat-block">
                      <span className="stat-label">Agreed Amount</span>
                      <span className="stat-value" style={{ color: "#FFFFFF" }}>
                        {(escrow.amount.toNumber() / LAMPORTS_PER_SOL).toFixed(4)} SOL
                      </span>
                    </div>

                    <div className="stat-block">
                      <span className="stat-label">Expiration Deadline</span>
                      <span
                        className="stat-value"
                        style={{
                          color: countdown.expired ? "#F87171" : "#FFFFFF",
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <Clock size={15} />
                        {countdown.label}
                      </span>
                    </div>

                    <div className="stat-block">
                      <span className="stat-label">Vault SOL Balance</span>
                      <span className="stat-value" style={{ color: "#34D399" }}>
                        {vaultStatus ? `${(vaultStatus.vaultBalanceLamports / LAMPORTS_PER_SOL).toFixed(4)} SOL` : "..."}
                      </span>
                    </div>

                    <div className="stat-block">
                      <span className="stat-label">Vault NFT Holdings</span>
                      <span className="stat-value" style={{ color: "#818CF8" }}>
                        {vaultStatus ? `${vaultStatus.vaultNftBalance} NFT` : "..."}
                      </span>
                    </div>
                  </div>

                  {/* Counterparty & Mint Info */}
                  <div
                    style={{
                      background: "rgba(4, 20, 39, 0.5)",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: 14,
                      padding: 20,
                      marginBottom: 32,
                      display: "flex",
                      flexDirection: "column",
                      gap: 12,
                      fontSize: 12.5,
                      fontFamily: "monospace",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
                      <span style={{ color: "#8BA3C7" }}>Buyer:</span>
                      <a
                        href={explorerAddress(escrow.buyer.toBase58())}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "#FFFFFF", textDecoration: "underline" }}
                      >
                        {escrow.buyer.toBase58()}
                      </a>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
                      <span style={{ color: "#8BA3C7" }}>Seller:</span>
                      <a
                        href={explorerAddress(escrow.seller.toBase58())}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "#FFFFFF", textDecoration: "underline" }}
                      >
                        {escrow.seller.toBase58()}
                      </a>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
                      <span style={{ color: "#8BA3C7" }}>NFT Mint:</span>
                      <a
                        href={explorerAddress(escrow.nftMint.toBase58())}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "#FFFFFF", textDecoration: "underline" }}
                      >
                        {escrow.nftMint.toBase58()}
                      </a>
                    </div>
                    {vaultStatus && (
                      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
                        <span style={{ color: "#8BA3C7" }}>Vault PDA:</span>
                        <a
                          href={explorerAddress(vaultStatus.vaultPda.toBase58())}
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "#3ECBFF", textDecoration: "underline" }}
                        >
                          {vaultStatus.vaultPda.toBase58()}
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Contextual Action Center */}
                  <div
                    style={{
                      borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                      paddingTop: 24,
                    }}
                  >
                    {/* Action 1: Buyer Deposit SOL */}
                    {escrow.state === EscrowState.Initialized && (
                      <div>
                        <div style={{ marginBottom: 12, fontSize: 13, color: "#8BA3C7" }}>
                          Phase 1 complete: Escrow is initialized. Buyer must lock agreed SOL into the vault PDA.
                        </div>
                        <button
                          onClick={handleDepositFunds}
                          disabled={!isBuyer || busy}
                          className="btn-solana-primary"
                          style={{
                            width: "100%",
                            justifyContent: "center",
                            opacity: isBuyer && !busy ? 1 : 0.5,
                            cursor: isBuyer && !busy ? "pointer" : "not-allowed",
                            gap: 8,
                          }}
                        >
                          <CoolVaultIcon size={18} />
                          {busy ? actionLabel : `DEPOSIT ${(escrow.amount.toNumber() / LAMPORTS_PER_SOL).toFixed(4)} SOL (BUYER)`}
                        </button>
                        {!isBuyer && (
                          <div style={{ fontSize: 11, color: "#8BA3C7", textAlign: "center", marginTop: 8 }}>
                            Connect with buyer wallet ({escrow.buyer.toBase58().slice(0, 8)}…) to deposit funds.
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action 2: Seller Deposit NFT */}
                    {escrow.state === EscrowState.FundsDeposited && (
                      <div>
                        <div style={{ marginBottom: 12, fontSize: 13, color: "#8BA3C7" }}>
                          Phase 2 complete: SOL is secured in vault. Seller must deposit the required NFT.
                        </div>
                        <button
                          onClick={handleDepositNft}
                          disabled={!isSeller || busy}
                          className="btn-solana-primary"
                          style={{
                            width: "100%",
                            justifyContent: "center",
                            opacity: isSeller && !busy ? 1 : 0.5,
                            cursor: isSeller && !busy ? "pointer" : "not-allowed",
                            background: "#818CF8",
                            color: "#FFFFFF",
                            gap: 8,
                          }}
                        >
                          <CoolNftMatrixIcon size={18} />
                          {busy ? actionLabel : "DEPOSIT NFT TO VAULT (SELLER)"}
                        </button>
                        {!isSeller && (
                          <div style={{ fontSize: 11, color: "#8BA3C7", textAlign: "center", marginTop: 8 }}>
                            Connect with seller wallet ({escrow.seller.toBase58().slice(0, 8)}…) to deposit NFT.
                          </div>
                        )}
                      </div>
                    )}

                    {/* Action 3: Execute Trade */}
                    {escrow.state === EscrowState.NftDeposited && (
                      <div>
                        <div style={{ marginBottom: 12, fontSize: 13, color: "#8BA3C7" }}>
                          Both legs secured in vault! Execute trade to atomically swap NFT to buyer and SOL to seller.
                        </div>
                        <button
                          onClick={handleExecuteTrade}
                          disabled={busy}
                          className="btn-solana-primary"
                          style={{
                            width: "100%",
                            justifyContent: "center",
                            background: "#14F195",
                            color: "#01050C",
                            gap: 8,
                          }}
                        >
                          <CoolSwapIcon size={18} />
                          {busy ? actionLabel : "EXECUTE ATOMIC SWAP NOW"}
                        </button>
                      </div>
                    )}

                    {/* Action 4: Refund Claim (if expired) */}
                    {(escrow.state === EscrowState.Initialized || escrow.state === EscrowState.FundsDeposited) &&
                      countdown.expired && (
                        <div style={{ marginTop: 16 }}>
                          <button
                            onClick={handleRefund}
                            disabled={!isBuyer || busy}
                            className="btn-pill-glass"
                            style={{
                              width: "100%",
                              justifyContent: "center",
                              borderColor: "rgba(248, 113, 113, 0.4)",
                              color: "#F87171",
                            }}
                          >
                            CLAIM 100% BUYER REFUND (DEADLINE EXPIRED)
                          </button>
                        </div>
                      )}

                    {/* Completed State */}
                    {escrow.state === EscrowState.Completed && (
                      <div
                        style={{
                          background: "rgba(52, 211, 153, 0.1)",
                          border: "1px solid rgba(52, 211, 153, 0.2)",
                          padding: 18,
                          borderRadius: 12,
                          textAlign: "center",
                          color: "#34D399",
                        }}
                      >
                        <CheckCircle2 size={24} style={{ margin: "0 auto 8px" }} />
                        <h4 style={{ fontSize: 15, margin: "0 0 4px" }}>Trade Settled Atomically</h4>
                        <p style={{ fontSize: 12.5, color: "#8BA3C7", margin: 0 }}>
                          NFT delivered to Buyer · SOL transferred to Seller · Zero counterparty custody
                        </p>
                      </div>
                    )}

                    {/* Refunded State */}
                    {escrow.state === EscrowState.Refunded && (
                      <div
                        style={{
                          background: "rgba(248, 113, 113, 0.1)",
                          border: "1px solid rgba(248, 113, 113, 0.2)",
                          padding: 18,
                          borderRadius: 12,
                          textAlign: "center",
                          color: "#F87171",
                        }}
                      >
                        <h4 style={{ fontSize: 15, margin: "0 0 4px" }}>Escrow Refunded</h4>
                        <p style={{ fontSize: 12.5, color: "#8BA3C7", margin: 0 }}>
                          The expiration deadline elapsed and vault SOL was safely refunded to the Buyer.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </FadeUp>
          </div>
        )}
      </section>

      <div className="divider" style={{ maxWidth: 1360, margin: "0 auto", padding: "0 clamp(24px, 5vw, 64px)" }} />
      <Footer />
    </div>
  );
}

export default function VaultPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#01050c" }} />}>
      <VaultContent />
    </Suspense>
  );
}
