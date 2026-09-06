"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import SolanaCodeConsole from "@/components/SolanaCodeConsole";
import { PROGRAM_ID } from "@/constants";
import {
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  Terminal,
} from "lucide-react";
import {
  CoolRadarIcon,
  CoolVaultIcon,
  CoolSwapIcon,
  CoolTimelockIcon,
} from "@/components/CoolIcons";

export default function HomePage() {
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(PROGRAM_ID.toBase58());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-hero-page" style={{ minHeight: "100vh" }}>
      <Navbar />

      {/* ================================================================= */}
      {/* 1. SOLANA.COM HERO SECTION                                        */}
      {/* ================================================================= */}
      <section
        style={{
          position: "relative",
          maxWidth: 1440,
          margin: "0 auto",
          padding: "72px clamp(20px, 4vw, 56px) 64px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: "calc(90vh - 68px)",
        }}
      >
        {/* Top Content: Title + Subtext + CTA Buttons */}
        <div style={{ maxWidth: 960 }}>
          {/* Solana Devnet Badge Pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: 9999,
              padding: "4px 14px",
              marginBottom: 28,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                backgroundColor: "#14F195",
                boxShadow: "0 0 10px #14F195",
              }}
            />
            <span
              style={{
                fontSize: 12,
                color: "rgba(255, 255, 255, 0.8)",
                fontFamily: "monospace",
              }}
            >
              SOLANA DEVNET · LIVE PROTOCOL
            </span>
          </div>

          {/* Solana Iconic Display Headline */}
          <h1
            style={{
              fontSize: "clamp(32px, 6.5vw, 76px)",
              fontWeight: 700,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              margin: "0 0 20px",
              color: "#FFFFFF",
            }}
          >
            The capital market
            <br />
            <span className="font-light text-solana-gradient">
              for trustless OTC swaps.
            </span>
          </h1>

          <p
            style={{
              fontSize: "clamp(15px, 1.8vw, 20px)",
              fontWeight: 400,
              color: "rgba(255, 255, 255, 0.65)",
              lineHeight: 1.6,
              margin: "0 0 36px",
              maxWidth: 620,
            }}
          >
            LetsDeal is the high-performance non-custodial protocol powering
            peer-to-peer SOL ⇄ NFT settlement on Solana. Fast. Deterministic.
            Atomic 1-slot execution.
          </p>

          {/* Solana.com Dual CTAs */}
          <div
            style={{
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
            }}
            className="flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center"
          >
            <Link href="/vault" className="btn-solana-primary w-full sm:w-auto text-center justify-center">
              <span>Get started</span>
              <span className="btn-solana-arrow">
                <ArrowRight size={14} />
              </span>
            </Link>

            <Link href="/explore" className="btn-solana-secondary w-full sm:w-auto text-center justify-center">
              <span>Explore live swaps</span>
            </Link>
          </div>
        </div>

        {/* Solana.com Promo / Live Monitor Card */}
        <div
          style={{
            marginTop: 56,
            maxWidth: 580,
            background: "linear-gradient(135deg, rgba(153, 69, 255, 0.12) 0%, rgba(20, 241, 149, 0.08) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: 16,
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 20,
            flexWrap: "wrap",
            backdropFilter: "blur(12px)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: "rgba(20, 241, 149, 0.12)",
                border: "1px solid rgba(20, 241, 149, 0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <CoolRadarIcon size={26} />
            </div>
            <div>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#FFFFFF",
                  marginBottom: 2,
                }}
              >
                Devnet Program: Verified Online
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "rgba(255, 255, 255, 0.6)",
                  fontFamily: "monospace",
                }}
              >
                ID: {PROGRAM_ID.toBase58().slice(0, 6)}...{PROGRAM_ID.toBase58().slice(-6)}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }} className="w-full sm:w-auto justify-start sm:justify-end">
            <button
              onClick={copyAddress}
              style={{
                background: "rgba(255, 255, 255, 0.06)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: 9999,
                padding: "6px 12px",
                color: "#FFFFFF",
                fontSize: 12,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {copied ? <Check size={12} color="#14F195" /> : <Copy size={12} />}
              <span>{copied ? "Copied" : "Copy ID"}</span>
            </button>
            <Link
              href="/explore"
              style={{
                background: "#000000",
                color: "#14F195",
                border: "1px solid rgba(20, 241, 149, 0.4)",
                borderRadius: 9999,
                padding: "6px 14px",
                fontSize: 12,
                fontWeight: 500,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              Monitor →
            </Link>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)" }} />

      {/* ================================================================= */}
      {/* 2. SOLANA "MADE FOR MASS ADOPTION" PERFORMANCE METRICS BAR        */}
      {/* ================================================================= */}
      <section
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "36px clamp(16px, 4vw, 56px)",
        }}
      >
        <div className="solana-metrics-grid">
          {/* Metric 1 */}
          <div className="solana-metric-cell">
            <span
              style={{
                fontSize: 12,
                color: "rgba(255, 255, 255, 0.5)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontFamily: "monospace",
                marginBottom: 20,
              }}
            >
              EXECUTION SPEED
            </span>
            <div>
              <div
                style={{
                  fontSize: "clamp(32px, 3.8vw, 48px)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: "#FFFFFF",
                  lineHeight: 1,
                  marginBottom: 6,
                }}
              >
                1 SLOT
              </div>
              <div style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.65)" }}>
                Atomic dual-asset swap in a single transaction
              </div>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="solana-metric-cell">
            <span
              style={{
                fontSize: 12,
                color: "rgba(255, 255, 255, 0.5)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontFamily: "monospace",
                marginBottom: 20,
              }}
            >
              PROTOCOL OVERHEAD
            </span>
            <div>
              <div
                style={{
                  fontSize: "clamp(32px, 3.8vw, 48px)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: "#14F195",
                  lineHeight: 1,
                  marginBottom: 6,
                }}
              >
                0%
              </div>
              <div style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.65)" }}>
                Zero protocol cuts or intermediary desk fees
              </div>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="solana-metric-cell">
            <span
              style={{
                fontSize: 12,
                color: "rgba(255, 255, 255, 0.5)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontFamily: "monospace",
                marginBottom: 20,
              }}
            >
              PDA MEMORY FOOTPRINT
            </span>
            <div>
              <div
                style={{
                  fontSize: "clamp(32px, 3.8vw, 48px)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: "#FFFFFF",
                  lineHeight: 1,
                  marginBottom: 6,
                }}
              >
                121 B
              </div>
              <div style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.65)" }}>
                Fixed compile-time byte layout for ultra-cheap rent
              </div>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="solana-metric-cell">
            <span
              style={{
                fontSize: 12,
                color: "rgba(255, 255, 255, 0.5)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontFamily: "monospace",
                marginBottom: 20,
              }}
            >
              TARGET SETTLEMENT
            </span>
            <div>
              <div
                style={{
                  fontSize: "clamp(32px, 3.8vw, 48px)",
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: "#9945FF",
                  lineHeight: 1,
                  marginBottom: 6,
                }}
              >
                ~400 MS
              </div>
              <div style={{ fontSize: 13, color: "rgba(255, 255, 255, 0.65)" }}>
                Sub-second confirmation powered by Solana Devnet
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 3. SOLANA DEVELOPER EXPERIENCE — CODE CONSOLE                     */}
      {/* ================================================================= */}
      <section
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "36px clamp(16px, 4vw, 56px) 56px",
        }}
      >
        <div className="solana-dev-grid">
          <div>
            <span
              style={{
                fontSize: 12,
                fontFamily: "monospace",
                color: "#14F195",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: 12,
              }}
            >
              BUILD ON SOLANA
            </span>
            <h2
              style={{
                fontSize: "clamp(30px, 3.6vw, 46px)",
                fontWeight: 700,
                letterSpacing: "-0.035em",
                lineHeight: 1.1,
                color: "#FFFFFF",
                margin: "0 0 20px",
              }}
            >
              Engineered for speed.
              <br />
              <span className="font-light text-solana-gradient">
                Zero client-side IDL latency.
              </span>
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "rgba(255, 255, 255, 0.65)",
                lineHeight: 1.65,
                margin: "0 0 28px",
              }}
            >
              Direct instruction packing eliminates heavy JSON runtime dependencies.
              Build institutional OTC platforms, private NFT brokerages, or automated
              arbitrage executors using our zero-overhead SDK.
            </p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Link href="/docs" className="btn-solana-secondary">
                Read Documentation
              </Link>
              <a
                href="https://github.com/sahkunal/lets_deal"
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 20px",
                  fontSize: 14,
                  color: "rgba(255, 255, 255, 0.7)",
                  textDecoration: "none",
                }}
              >
                View on GitHub
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

          <div>
            <SolanaCodeConsole />
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 4. SOLANA ECOSYSTEM ARTICLES & FEATURE CARDS                      */}
      {/* ================================================================= */}
      <section
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "48px clamp(20px, 4vw, 56px) 80px",
        }}
      >
        <div style={{ marginBottom: 36, maxWidth: 640 }}>
          <span
            style={{
              fontSize: 12,
              fontFamily: "monospace",
              color: "#9945FF",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              display: "block",
              marginBottom: 10,
            }}
          >
            PROTOCOL PILLARS
          </span>
          <h2
            style={{
              fontSize: "clamp(28px, 3.2vw, 42px)",
              fontWeight: 700,
              letterSpacing: "-0.03em",
              color: "#FFFFFF",
              margin: 0,
            }}
          >
            How LetsDeal guarantees trustless settlement.
          </h2>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
          }}
        >
          {/* Card 1 */}
          <div className="solana-card" style={{ padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "3px 10px",
                  borderRadius: 9999,
                  background: "rgba(153, 69, 255, 0.15)",
                  border: "1px solid rgba(153, 69, 255, 0.3)",
                  color: "#9945FF",
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: "monospace",
                }}
              >
                PDA VAULTS
              </span>
              <CoolVaultIcon size={28} />
            </div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#FFFFFF",
                margin: "0 0 10px",
              }}
            >
              Zero Admin Keys
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.65)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Funds are isolated inside Program Derived Addresses mathematically
              generated from the escrow account. Nobody holds custody or private keys.
            </p>
          </div>

          {/* Card 2 */}
          <div className="solana-card" style={{ padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "3px 10px",
                  borderRadius: 9999,
                  background: "rgba(20, 241, 149, 0.15)",
                  border: "1px solid rgba(20, 241, 149, 0.3)",
                  color: "#14F195",
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: "monospace",
                }}
              >
                ATOMIC SWAP
              </span>
              <CoolSwapIcon size={28} />
            </div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#FFFFFF",
                margin: "0 0 10px",
              }}
            >
              Single-Slot Execution
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.65)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              SOL releases to the seller and the SPL NFT transfers to the buyer in the
              exact same slot. If any leg fails, the entire instruction aborts.
            </p>
          </div>

          {/* Card 3 */}
          <div className="solana-card" style={{ padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <span
                style={{
                  display: "inline-block",
                  padding: "3px 10px",
                  borderRadius: 9999,
                  background: "rgba(62, 203, 255, 0.15)",
                  border: "1px solid rgba(62, 203, 255, 0.3)",
                  color: "#3ECBFF",
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: "monospace",
                }}
              >
                DETERMINISTIC REFUND
              </span>
              <CoolTimelockIcon size={28} />
            </div>
            <h3
              style={{
                fontSize: 18,
                fontWeight: 600,
                color: "#FFFFFF",
                margin: "0 0 10px",
              }}
            >
              On-Chain Timelock
            </h3>
            <p
              style={{
                fontSize: 14,
                color: "rgba(255, 255, 255, 0.65)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              If the counterparty fails to deposit before the Unix timestamp expiration,
              the buyer reclaims 100% of their locked SOL with zero deductions.
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================= */}
      {/* 5. SOLANA FINAL CTA BANNER                                        */}
      {/* ================================================================= */}
      <section
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "36px clamp(16px, 4vw, 56px) 80px",
        }}
      >
        <div className="solana-cta-box">
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 320,
              height: 320,
              background: "radial-gradient(circle, rgba(153, 69, 255, 0.2) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div style={{ maxWidth: 580, position: "relative", zIndex: 1 }}>
            <span
              style={{
                fontSize: 12,
                color: "#14F195",
                fontFamily: "monospace",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: 12,
              }}
            >
              LAUNCH NOW
            </span>
            <h2
              style={{
                fontSize: "clamp(28px, 3.4vw, 44px)",
                fontWeight: 700,
                letterSpacing: "-0.035em",
                color: "#FFFFFF",
                margin: "0 0 16px",
                lineHeight: 1.1,
              }}
            >
              Start trading on Solana Devnet today.
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "rgba(255, 255, 255, 0.65)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Connect your wallet, instantiate a deterministic escrow account, and
              experience single-slot non-custodial swaps.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
              position: "relative",
              zIndex: 1,
            }}
            className="w-full sm:w-auto flex-col sm:flex-row items-stretch sm:items-center"
          >
            <Link href="/vault" className="btn-solana-primary w-full sm:w-auto text-center justify-center">
              <span>Open Terminal</span>
              <span className="btn-solana-arrow">
                <ArrowRight size={14} />
              </span>
            </Link>
            <Link href="/docs" className="btn-solana-secondary w-full sm:w-auto text-center justify-center">
              Developer Docs
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
