import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import { ArrowRight, Wallet, Shield, ArrowDown } from "lucide-react";
import Image from "next/image";

export default function VaultPage() {
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
            <button className="btn-pill-solid">
              CONNECT WALLET
              <Wallet size={14} strokeWidth={1.5} />
            </button>
          </div>
        </FadeUp>


      </section>

      {/* Swap Card */}
      <section style={{ maxWidth: 1360, margin: "0 auto", padding: "20px clamp(24px, 5vw, 64px) 120px" }}>
        <div style={{ maxWidth: 500, margin: "0 auto" }}>
          <FadeUp>
            <div className="panel-glass" style={{ padding: 36 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                <h2 style={{ fontSize: 16, fontWeight: 450, color: "#FFFFFF", margin: 0, letterSpacing: "-0.01em" }}>New Escrow Account</h2>
                <span style={{ fontSize: 11, color: "#3ECBFF", letterSpacing: "0.08em", fontFamily: "monospace", fontWeight: 400 }}>DEVNET</span>
              </div>

              {/* You Pay */}
              <div style={{ background: "rgba(4, 20, 39, 0.6)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: 14, padding: "18px 20px", marginBottom: 6 }}>
                <div style={{ fontSize: 11, color: "#8BA3C7", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8, fontWeight: 400 }}>You Deposit</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <input
                    type="number"
                    placeholder="0.00"
                    disabled
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
                  disabled
                  style={{ fontSize: 13, fontFamily: "monospace", color: "#8BA3C7", background: "none", border: "none", outline: "none", width: "100%", fontWeight: 350 }}
                />
              </div>

              {/* Fields */}
              {[
                { label: "Seller Wallet Address", placeholder: "4Tzz…SellerAddress" },
                { label: "Timeout Deadline (hours)", placeholder: "24" },
              ].map((f) => (
                <div key={f.label} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: "#8BA3C7", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8, fontWeight: 400 }}>{f.label}</div>
                  <input
                    placeholder={f.placeholder}
                    disabled
                    style={{ width: "100%", background: "rgba(4, 20, 39, 0.6)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: 12, padding: "12px 16px", fontSize: 13, fontFamily: "monospace", color: "#8BA3C7", outline: "none", fontWeight: 350 }}
                  />
                </div>
              ))}

              <button className="btn-pill-solid" style={{ width: "100%", justifyContent: "center", marginTop: 10, opacity: 0.5, cursor: "not-allowed" }}>
                CONNECT WALLET TO DEPLOY
                <ArrowRight size={14} strokeWidth={1.5} />
              </button>

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
