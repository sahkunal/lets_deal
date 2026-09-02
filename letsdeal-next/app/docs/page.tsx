"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import { PROGRAM_ID } from "@/constants";
import { Terminal, Code, BookOpen, Layers } from "lucide-react";

const sections = [
  {
    tag: "Protocol Overview",
    title: "Core Mechanics",
    items: [
      {
        name: "Non-Custodial Architecture",
        desc: "Neither party nor protocol operators hold private keys. All funds and tokens are held directly in deterministic Program Derived Addresses.",
      },
      {
        name: "121-Byte Escrow State",
        desc: "Fixed compile-time memory footprint: 8-byte discriminator + 32 buyer + 32 seller + 8 price + 8 deadline + 32 nft_mint + 1 state enum.",
      },
      {
        name: "Zero-IDL Serialization",
        desc: "Direct byte buffer packing eliminates runtime JSON IDL overhead, reducing latency and enabling hardware-level execution speeds.",
      },
    ],
  },
  {
    tag: "Client SDK",
    title: "Instruction Lifecycle",
    items: [
      {
        name: "initialize()",
        desc: "Instantiates the 121-byte escrow account with locked trade terms: buyer, seller, price in lamports, NFT mint, and unix deadline.",
      },
      {
        name: "deposit_funds()",
        desc: "Transfers the agreed SOL from buyer to the vault PDA [b'vault', escrow.key()]. Validates state == Initialized.",
      },
      {
        name: "deposit_nft()",
        desc: "Seller transfers the verified NFT to the vault's Associated Token Account. Program checks matching mint address.",
      },
      {
        name: "execute_trade()",
        desc: "Atomic single-slot swap: releases locked SOL to seller and transfers vault NFT to buyer simultaneously. Sets state to Completed.",
      },
      {
        name: "refund()",
        desc: "Buyer-triggered recovery if deadline passes without trade execution. Returns 100% of deposited SOL from vault PDA.",
      },
    ],
  },
  {
    tag: "On-Chain Constants",
    title: "Program Addresses",
    items: [
      {
        name: "Program ID",
        desc: PROGRAM_ID.toBase58(),
      },
      {
        name: "Vault PDA Seeds",
        desc: "[b'vault', escrow_account.key().as_ref()]",
      },
      {
        name: "SPL Token Program",
        desc: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      },
      {
        name: "Associated Token Program",
        desc: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
      },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="bg-subpage" style={{ minHeight: "100vh" }}>
      <Navbar />

      {/* Header */}
      <section
        style={{
          maxWidth: 1360,
          margin: "0 auto",
          padding: "56px clamp(24px, 5vw, 64px) 36px",
        }}
      >
        <FadeUp>
          <div style={{ maxWidth: 640 }}>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 12,
                color: "#3ECBFF",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                display: "block",
                marginBottom: 10,
              }}
            >
              TECHNICAL DOCUMENTATION
            </span>
            <h1
              style={{
                fontSize: "clamp(34px, 4vw, 52px)",
                fontWeight: 300,
                letterSpacing: "-0.035em",
                lineHeight: 1.1,
                color: "#FFFFFF",
                margin: "0 0 16px",
              }}
            >
              Protocol architecture &amp; SDK reference.
            </h1>
            <p
              style={{
                fontSize: 15,
                fontWeight: 350,
                color: "#8BA3C7",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Deterministic state serialization, Program Derived Address vault mechanics,
              and transaction construction guidelines for LetsDeal on Solana.
            </p>
          </div>
        </FadeUp>
      </section>

      {/* Documentation Grid */}
      <section
        style={{
          maxWidth: 1360,
          margin: "0 auto",
          padding: "20px clamp(24px, 5vw, 64px) 100px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: 40,
            alignItems: "flex-start",
          }}
          className="grid-cols-1 lg:grid-cols-3"
        >
          {/* Left Column: Quick Reference Specs */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              className="panel-glass"
              style={{
                padding: 24,
                borderRadius: 16,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Terminal size={15} color="#3ECBFF" />
                <span
                  style={{
                    fontSize: 12,
                    fontFamily: "monospace",
                    color: "#FFFFFF",
                    fontWeight: 500,
                  }}
                >
                  STATE_SPECIFICATION
                </span>
              </div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 11,
                  color: "#8BA3C7",
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div>ESCROW_DISCRIMINATOR: 0x1fd57bbbba16da9b</div>
                <div>TOTAL_ACCOUNT_SIZE: 121 BYTES</div>
                <div>RENT_EXEMPT_RESERVE: ~0.00173 SOL</div>
                <div>CLUSTER: SOLANA DEVNET</div>
              </div>
            </div>

            <div
              className="panel-glass"
              style={{
                padding: 24,
                borderRadius: 16,
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Layers size={15} color="#00E599" />
                <span
                  style={{
                    fontSize: 12,
                    fontFamily: "monospace",
                    color: "#FFFFFF",
                    fontWeight: 500,
                  }}
                >
                  SECURITY_INVARIANTS
                </span>
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: "#8BA3C7",
                  lineHeight: 1.6,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div>• Zero protocol fees or tax cuts</div>
                <div>• Zero admin keys or pause mechanisms</div>
                <div>• Strict ATA ownership validation</div>
                <div>• Cryptographic deadline enforcement</div>
              </div>
            </div>
          </div>

          {/* Right Column: Sections & Code Samples */}
          <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
            {sections.map((s, si) => (
              <FadeUp key={si} delay={si * 0.06}>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                    <span
                      style={{
                        fontFamily: "monospace",
                        fontSize: 11,
                        color: "#3ECBFF",
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                      }}
                    >
                      {s.tag}
                    </span>
                    <h2
                      style={{
                        fontSize: 20,
                        fontWeight: 400,
                        color: "#FFFFFF",
                        margin: 0,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {s.title}
                    </h2>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: 12,
                      overflow: "hidden",
                      background: "rgba(2, 11, 22, 0.6)",
                    }}
                  >
                    {s.items.map((item, ii) => (
                      <div
                        key={ii}
                        style={{
                          padding: "16px 20px",
                          borderBottom:
                            ii < s.items.length - 1
                              ? "1px solid rgba(255, 255, 255, 0.06)"
                              : "none",
                          display: "flex",
                          flexDirection: "column",
                          gap: 4,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13.5,
                            fontWeight: 500,
                            color: "#FFFFFF",
                            fontFamily: item.name.includes("()")
                              ? "monospace"
                              : "inherit",
                          }}
                        >
                          {item.name}
                        </span>
                        <p
                          style={{
                            fontSize: 13,
                            color: "#8BA3C7",
                            lineHeight: 1.5,
                            margin: 0,
                            fontFamily:
                              item.desc.length < 50 && item.desc.includes("1")
                                ? "monospace"
                                : "inherit",
                          }}
                        >
                          {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeUp>
            ))}

            {/* SDK Code Snippet */}
            <FadeUp>
              <div
                className="panel-glass"
                style={{
                  padding: 24,
                  borderRadius: 16,
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Code size={15} color="#3ECBFF" />
                  <span
                    style={{
                      fontSize: 12,
                      fontFamily: "monospace",
                      color: "#FFFFFF",
                      fontWeight: 500,
                    }}
                  >
                    SDK_CLIENT_INTEGRATION
                  </span>
                </div>

                <div
                  style={{
                    background: "rgba(1, 5, 12, 0.85)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: 8,
                    padding: "16px 20px",
                    fontFamily: "monospace",
                    fontSize: 12,
                    color: "#8BA3C7",
                    lineHeight: 1.7,
                    overflowX: "auto",
                  }}
                >
                  <span style={{ color: "#526B8E" }}>
                    // 1. Initialize escrow with locked terms
                  </span>
                  <br />
                  <span style={{ color: "#FF7B72" }}>const</span> tx ={" "}
                  <span style={{ color: "#FF7B72" }}>await</span>{" "}
                  <span style={{ color: "#79C0FF" }}>createInitializeEscrowTx</span>
                  ({`{`}
                  <br />
                  &nbsp;&nbsp;escrow: escrowKeypair,
                  <br />
                  &nbsp;&nbsp;buyer: wallet.publicKey,
                  <br />
                  &nbsp;&nbsp;seller: counterpartyPubkey,
                  <br />
                  &nbsp;&nbsp;amountLamports: <span style={{ color: "#79C0FF" }}>50_000_000_000n</span>,{" "}
                  <span style={{ color: "#526B8E" }}>// 50 SOL</span>
                  <br />
                  &nbsp;&nbsp;nftMint: mintPubkey,
                  <br />
                  &nbsp;&nbsp;deadline: <span style={{ color: "#79C0FF" }}>1756857600n</span>,
                  <br />
                  {`}`});
                  <br />
                  <br />
                  <span style={{ color: "#526B8E" }}>
                    // 2. Deposit SOL to Vault PDA
                  </span>
                  <br />
                  <span style={{ color: "#FF7B72" }}>const</span> depositTx ={" "}
                  <span style={{ color: "#FF7B72" }}>await</span>{" "}
                  <span style={{ color: "#79C0FF" }}>createDepositFundsTx</span>
                  (escrowPubkey, wallet.publicKey);
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
