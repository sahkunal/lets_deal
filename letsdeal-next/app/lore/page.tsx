import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import FadeUp from "@/components/FadeUp";
import Image from "next/image";

const timeline = [
  {
    year: "2024",
    event: "Protocol Conceived",
    detail: "Two builders, one shared frustration with custodial OTC desks that held funds for days with counterparty risk.",
  },
  {
    year: "2024 Q3",
    event: "Anchor Smart Contract",
    detail: "First version of the protocol built in Rust using Anchor. Deterministic PDA vaults, zero dynamic state.",
  },
  {
    year: "2024 Q4",
    event: "Devnet Deployment",
    detail: "Program ID FzwhoLmFm8avMRpgwTL5mWiC8oi8RSqkbDdYBU7SeQj deployed to Solana Devnet. First atomic swap tested.",
  },
  {
    year: "2025",
    event: "Zero-IDL Architecture",
    detail: "Trade terminal and developer SDK shipped. Zero-IDL client runtime with direct binary instruction serialization.",
  },
  {
    year: "Future",
    event: "Mainnet & Beyond",
    detail: "Mainnet deployment, multi-asset routing, and permissionless escrow pools for any SPL token pair.",
  },
];

export default function LorePage() {
  return (
    <div className="bg-subpage" style={{ minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section style={{ maxWidth: 1360, margin: "0 auto", padding: "64px clamp(24px, 5vw, 64px) 40px", display: "flex", flexDirection: "column", alignItems: "center" }}>


        <FadeUp>
          <div style={{ textAlign: "center", maxWidth: 560 }}>
            <span className="tag-cyan" style={{ display: "block", marginBottom: 14 }}>Genesis Lore</span>
            <h1 style={{ fontSize: "clamp(34px, 4vw, 52px)", fontWeight: 300, letterSpacing: "-0.035em", lineHeight: 1.1, color: "#FFFFFF", margin: 0 }}>
              Why we built this.
            </h1>
            <p style={{ fontSize: 14.5, fontWeight: 350, color: "#8BA3C7", lineHeight: 1.6, margin: "16px auto 0" }}>
              Every protocol starts with a fundamental problem. Ours was simple: OTC crypto trades require counterparty trust. We replaced trust with math.
            </p>
          </div>
        </FadeUp>
      </section>

      {/* Quote Statement */}
      <section style={{ maxWidth: 780, margin: "0 auto", padding: "0 clamp(24px, 5vw, 64px) 60px" }}>
        <FadeUp>
          <div className="panel-glass" style={{ padding: "38px 34px" }}>
            <p style={{ fontSize: 16, fontWeight: 250, color: "#FFFFFF", lineHeight: 1.75, margin: 0, letterSpacing: "-0.01em" }}>
              &ldquo;Over-the-counter trades in crypto typically rely on either blind trust, centralized escrow intermediaries, or complex multi-sigs.
              None of these are trustless. LetsDeal reduces the trade to a single Anchor program that neither party controls,
              backed by Solana&apos;s 400ms finality.&rdquo;
            </p>
            <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
              <span className="stat-label">— LetsDeal Protocol Genesis</span>
            </div>
          </div>
        </FadeUp>
      </section>

      {/* Timeline */}
      <section style={{ maxWidth: 1360, margin: "0 auto", padding: "0 clamp(24px, 5vw, 64px) 120px" }}>
        <FadeUp>
          <SectionHeader tag="Milestones" headline="The progression." />
        </FadeUp>

        <div style={{ marginTop: 44, display: "flex", flexDirection: "column" }}>
          {timeline.map((t, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "140px 1fr",
                  gap: 40,
                  padding: "28px 0",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                  alignItems: "flex-start",
                }}
              >
                <div>
                  <span style={{ fontFamily: "monospace", fontSize: 12, color: "#3ECBFF", letterSpacing: "0.06em", fontWeight: 400 }}>
                    {t.year}
                  </span>
                </div>
                <div>
                  <h3 style={{ fontSize: 14.5, fontWeight: 450, color: "#FFFFFF", margin: "0 0 6px", letterSpacing: "-0.01em" }}>
                    {t.event}
                  </h3>
                  <p style={{ fontSize: 13.5, fontWeight: 350, color: "#8BA3C7", lineHeight: 1.6, margin: 0 }}>
                    {t.detail}
                  </p>
                </div>
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
