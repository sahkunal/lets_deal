import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import Image from "next/image";

const MOCK_DEALS = [
  { id: "Fx2k...9pL3", state: "Awaiting NFT", amount: "1.5 SOL", mint: "B3nz...7Kwm", deadline: "18h left" },
  { id: "Qp8m...2rX7", state: "SOL Locked", amount: "0.5 SOL", mint: "Lm4j...8Xvn", deadline: "6h left" },
  { id: "Wr4t...5hN1", state: "Completed", amount: "2.0 SOL", mint: "Yn9s...3Pcz", deadline: "Settled" },
  { id: "Kd6w...1vZ8", state: "Refunded", amount: "0.25 SOL", mint: "Cx7b...4Tqr", deadline: "Expired" },
  { id: "Ah3r...6mQ2", state: "Awaiting NFT", amount: "3.0 SOL", mint: "Vp2e...9Wnk", deadline: "44h left" },
  { id: "Sb5n...8jK4", state: "SOL Locked", amount: "0.75 SOL", mint: "Rk6d...1Bhg", deadline: "2h left" },
];

const stateColor: Record<string, string> = {
  "Awaiting NFT": "#3ECBFF",
  "SOL Locked": "#F5C842",
  "Completed": "#4ADE80",
  "Refunded": "#8BA3C7",
};

export default function ExplorePage() {
  return (
    <div className="bg-subpage" style={{ minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section style={{ maxWidth: 1360, margin: "0 auto", padding: "64px clamp(24px, 5vw, 64px) 40px", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
        {/* Subtle background glow aura */}
        <div
          style={{
            position: "absolute",
            top: "24%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 440,
            height: 280,
            background: "radial-gradient(circle, rgba(0, 163, 255, 0.25) 0%, transparent 70%)",
            filter: "blur(50px)",
            pointerEvents: "none",
          }}
        />



        <FadeUp>
          <div style={{ textAlign: "center" }}>
            <span className="tag-cyan" style={{ display: "block", marginBottom: 14 }}>Live Explorer</span>
            <h1 style={{ fontSize: "clamp(34px, 4vw, 52px)", fontWeight: 300, letterSpacing: "-0.035em", lineHeight: 1.1, color: "#FFFFFF", margin: 0 }}>
              Live escrow deals,<br />on-chain.
            </h1>
            <p style={{ fontSize: 14.5, fontWeight: 350, color: "#8BA3C7", lineHeight: 1.6, maxWidth: 440, margin: "16px auto 0" }}>
              Browse active and settled cryptographic escrow accounts deployed on Solana Devnet.
            </p>
          </div>
        </FadeUp>
      </section>

      {/* Filter Bar */}
      <div style={{ maxWidth: 1360, margin: "0 auto", padding: "0 clamp(24px, 5vw, 64px) 40px" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div className="panel-glass" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", flex: 1, minWidth: 260 }}>
            <Search size={14} strokeWidth={1.5} color="#8BA3C7" />
            <input
              placeholder="Search by escrow address or NFT mint..."
              style={{ background: "none", border: "none", outline: "none", color: "#FFFFFF", fontSize: 13, width: "100%", fontWeight: 350 }}
            />
          </div>
          {["All", "Active", "Completed", "Refunded"].map((f) => (
            <button
              key={f}
              className="btn-pill-glass"
              style={{ fontSize: 11, padding: "8px 18px" }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Deals Grid */}
      <section style={{ maxWidth: 1360, margin: "0 auto", padding: "0 clamp(24px, 5vw, 64px) 120px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 18 }}>
          {MOCK_DEALS.map((deal, i) => (
            <FadeUp key={i} delay={i * 0.05}>
              <div className="panel-glass" style={{ padding: 26 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                  <span style={{ fontFamily: "monospace", fontSize: 12, color: "#8BA3C7" }}>{deal.id}</span>
                  <span style={{ fontSize: 11, fontWeight: 450, letterSpacing: "0.08em", color: stateColor[deal.state] || "#8BA3C7" }}>
                    {deal.state.toUpperCase()}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                  <div className="stat-block">
                    <span className="stat-label">Amount</span>
                    <span className="stat-value">{deal.amount}</span>
                  </div>
                  <div className="stat-block">
                    <span className="stat-label">Deadline</span>
                    <span className="stat-value" style={{ color: deal.deadline.includes("h left") && parseInt(deal.deadline) < 4 ? "#F87171" : "#FFFFFF" }}>
                      {deal.deadline}
                    </span>
                  </div>
                </div>

                <div style={{ fontFamily: "monospace", fontSize: 11, color: "#526B8E", marginBottom: 18 }}>
                  NFT Mint: {deal.mint}
                </div>

                <Link href="/vault" className="btn-pill-glass" style={{ width: "100%", justifyContent: "center" }}>
                  VIEW DEAL
                  <ArrowRight size={13} strokeWidth={1.5} />
                </Link>
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
