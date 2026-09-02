import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import FadeUp from "@/components/FadeUp";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

const layout = [
  { offset: "0..8", field: "discriminator", type: "[u8; 8]", size: "8", desc: "Anchor account identifier" },
  { offset: "8..40", field: "buyer", type: "Pubkey", size: "32", desc: "Buyer wallet address" },
  { offset: "40..72", field: "seller", type: "Pubkey", size: "32", desc: "Seller wallet address" },
  { offset: "72..80", field: "amount", type: "u64", size: "8", desc: "Lamports locked in escrow" },
  { offset: "80..88", field: "deadline", type: "i64", size: "8", desc: "Unix timestamp expiry" },
  { offset: "88..120", field: "nft_mint", type: "Pubkey", size: "32", desc: "Required NFT mint address" },
  { offset: "120..121", field: "state", type: "EscrowState", size: "1", desc: "0=Init 1=SOL 2=NFT 3=Done 4=Refund" },
];

const instructions = [
  { name: "initialize", signers: "Buyer + Escrow Keypair", desc: "Deploys the 113-byte on-chain escrow with locked parameters." },
  { name: "deposit_funds", signers: "Buyer", desc: "Transfers agreed SOL into Program Derived Address vault." },
  { name: "deposit_nft", signers: "Seller", desc: "Moves 1 NFT token into the vault's Associated Token Account." },
  { name: "execute_trade", signers: "Either", desc: "Atomic: delivers NFT to buyer, releases SOL to seller in one instruction." },
  { name: "refund", signers: "Buyer", desc: "Reclaims 100% SOL if Clock::get() > escrow.deadline." },
];

export default function TechnologyPage() {
  return (
    <div className="bg-subpage" style={{ minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section style={{ maxWidth: 1360, margin: "0 auto", padding: "64px clamp(24px, 5vw, 64px) 40px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 48, flexWrap: "wrap" }}>
        <FadeUp>
          <div style={{ maxWidth: 560 }}>
            <span className="tag-cyan" style={{ display: "block", marginBottom: 14 }}>Architecture</span>
            <h1 style={{ fontSize: "clamp(34px, 4vw, 52px)", fontWeight: 300, letterSpacing: "-0.035em", lineHeight: 1.1, color: "#FFFFFF", margin: "0 0 20px" }}>
              The protocol,
              <br />
              dissected.
            </h1>
            <p style={{ fontSize: 14.5, fontWeight: 350, color: "#8BA3C7", lineHeight: 1.65, margin: 0 }}>
              Complete technical architecture of the LetsDeal Anchor smart contract. 113 bytes. 5 instructions. Zero trust assumptions.
            </p>
          </div>
        </FadeUp>


      </section>

      {/* Program ID Banner */}
      <section style={{ maxWidth: 1360, margin: "0 auto", padding: "0 clamp(24px, 5vw, 64px) 60px" }}>
        <FadeUp>
          <div className="panel-glass" style={{ padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div className="stat-label" style={{ marginBottom: 4 }}>Program ID — Solana Devnet</div>
              <code style={{ fontFamily: "monospace", fontSize: 13.5, color: "#3ECBFF", letterSpacing: "-0.01em", fontWeight: 400 }}>
                FzwhoLmFm8avMRpgwTL5mWiC8oi8RSqkbDdYBU7SeQj
              </code>
            </div>
            <a
              href="https://explorer.solana.com/address/FzwhoLmFm8avMRpgwTL5mWiC8oi8RSqkbDdYBU7SeQj?cluster=devnet"
              target="_blank"
              rel="noreferrer"
              className="btn-pill-glass"
            >
              VIEW ON EXPLORER
              <ArrowRight size={13} strokeWidth={1.5} />
            </a>
          </div>
        </FadeUp>
      </section>

      {/* Account Layout Table */}
      <section style={{ maxWidth: 1360, margin: "0 auto", padding: "0 clamp(24px, 5vw, 64px) 80px" }}>
        <FadeUp>
          <SectionHeader
            tag="Account Layout"
            headline="113-byte Borsh memory layout"
            subline="Deterministic, fixed-size on-chain escrow memory. Zero dynamic heap allocation."
          />
        </FadeUp>

        <FadeUp delay={0.08}>
          <div style={{ marginTop: 36, overflow: "auto", borderRadius: 20, border: "1px solid rgba(255, 255, 255, 0.08)", background: "rgba(4, 20, 39, 0.4)" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "monospace", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "rgba(4, 20, 39, 0.6)", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
                  {["Offset", "Field", "Rust Type", "Size", "Description"].map((h) => (
                    <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: "#8BA3C7", fontWeight: 450 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {layout.map((row, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.04)" }}>
                    <td style={{ padding: "14px 20px", color: "#3ECBFF", fontWeight: 400 }}>{row.offset}</td>
                    <td style={{ padding: "14px 20px", color: "#FFFFFF", fontWeight: 450 }}>{row.field}</td>
                    <td style={{ padding: "14px 20px", color: "#8BA3C7", fontWeight: 350 }}>{row.type}</td>
                    <td style={{ padding: "14px 20px", color: "#8BA3C7", fontWeight: 350 }}>{row.size} B</td>
                    <td style={{ padding: "14px 20px", color: "#8BA3C7", fontWeight: 350 }}>{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeUp>
      </section>

      {/* Instructions */}
      <section style={{ maxWidth: 1360, margin: "0 auto", padding: "0 clamp(24px, 5vw, 64px) 120px" }}>
        <FadeUp>
          <SectionHeader tag="Instructions" headline="Five handlers, one guarantee." />
        </FadeUp>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginTop: 36 }}>
          {instructions.map((ix, i) => (
            <FadeUp key={i} delay={i * 0.06}>
              <div className="panel-glass" style={{ padding: 26 }}>
                <code style={{ fontSize: 13.5, color: "#3ECBFF", fontWeight: 450, display: "block", marginBottom: 8 }}>{ix.name}()</code>
                <p style={{ fontSize: 13, fontWeight: 350, color: "#8BA3C7", lineHeight: 1.55, margin: "0 0 14px" }}>{ix.desc}</p>
                <span className="stat-label">Signers: {ix.signers}</span>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      <div className="divider" style={{ maxWidth: 1360, margin: "0 auto", padding: "0 clamp(24px, 5vw, 64px)" }} />
      <Footer />
    </div>
  );
}
