import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import FadeUp from "@/components/FadeUp";
import Link from "next/link";
import {
  Shield,
  Zap,
  Lock,
  RefreshCw,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Non-Custodial PDA Vaults",
    desc: "Assets are isolated inside Program Derived Addresses. No admin keys, no centralized desk, zero counterparty risk.",
  },
  {
    icon: Zap,
    title: "Atomic Settlement",
    desc: "A single transaction slot atomically delivers the NFT to the buyer and releases SOL to the seller simultaneously.",
  },
  {
    icon: Lock,
    title: "Deterministic Execution",
    desc: "Instruction discriminators computed on-chain. Zero runtime IDL dependencies, 100% verifiable binary execution.",
  },
  {
    icon: RefreshCw,
    title: "Automated Refunds",
    desc: "If the expiration deadline passes before the seller deposits, the buyer reclaims 100% of their locked SOL.",
  },
];

const steps = [
  {
    n: "01",
    title: "Initialize Escrow",
    desc: "Buyer instantiates a 113-byte on-chain escrow account defining price, counterparty, NFT mint, and expiration timestamp.",
  },
  {
    n: "02",
    title: "Lock SOL in Vault",
    desc: "Buyer transfers agreed SOL into the Program Derived Address vault. Funds are cryptographically locked on-chain.",
  },
  {
    n: "03",
    title: "Deposit NFT",
    desc: "Seller transfers the verified NFT into the vault's Associated Token Account, transitioning state to ready.",
  },
  {
    n: "04",
    title: "Atomic Execution",
    desc: "execute_trade() swaps ownership: NFT transfers to buyer, SOL releases to seller in a single transaction slot.",
  },
];

export default function HomePage() {
  return (
    <div className="bg-hero-page" style={{ minHeight: "100vh" }}>
      <Navbar />

      {/* ================================================================= */}
      {/* HERO SECTION — Full viewport with cinematic image background       */}
      {/* ================================================================= */}
      <section
        style={{
          position: "relative",
          minHeight: "calc(100vh - 84px)",
          maxWidth: 1360,
          margin: "0 auto",
          padding: "0 clamp(24px, 5vw, 64px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          paddingBottom: 56,
          overflow: "hidden",
        }}
      >
        {/* ---- Floating Status Nodes ---- */}
        {/* These float over the image at the exact positions matching the reference */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingTop: 48,
            alignItems: "flex-start",
          }}
        >
          {/* Left stat */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              textAlign: "left",
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 350,
                color: "rgba(255,255,255,0.55)",
                letterSpacing: "0.02em",
              }}
            >
              Architecture
            </span>
            <span
              style={{
                fontSize: 14.5,
                fontWeight: 400,
                color: "#FFFFFF",
                letterSpacing: "-0.01em",
              }}
            >
              PDA Vaults
            </span>
          </div>

          {/* Center stat */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              textAlign: "center",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              top: 48,
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 350,
                color: "rgba(255,255,255,0.55)",
                letterSpacing: "0.02em",
              }}
            >
              Network
            </span>
            <span
              style={{
                fontSize: 14.5,
                fontWeight: 400,
                color: "#FFFFFF",
                letterSpacing: "-0.01em",
              }}
            >
              Solana Devnet
            </span>
          </div>

          {/* Right stat */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 4,
              textAlign: "right",
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 350,
                color: "rgba(255,255,255,0.55)",
                letterSpacing: "0.02em",
              }}
            >
              Status
            </span>
            <span
              style={{
                fontSize: 14.5,
                fontWeight: 400,
                color: "#FFFFFF",
                letterSpacing: "-0.01em",
              }}
            >
              Vault Online
            </span>
          </div>
        </div>

        {/* ---- Empty space — image fills the visual middle ---- */}
        <div style={{ flex: 1 }} />

        {/* ---- Bottom Split Layout: Headline Left, Description+Button Right ---- */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 48,
            flexWrap: "wrap",
          }}
        >
          {/* Bottom Left — Giant Hero Headline */}
          <div style={{ maxWidth: 620 }}>
            <h1
              style={{
                fontSize: "clamp(38px, 4.8vw, 60px)",
                fontWeight: 350,
                letterSpacing: "-0.038em",
                lineHeight: 1.05,
                color: "#FFFFFF",
                margin: 0,
                textShadow: "0 2px 30px rgba(0,0,0,0.6)",
              }}
            >
              Where trustless trade
              <br />
              meets certainty.
            </h1>
          </div>

          {/* Bottom Right — Description + Solid White Pill Button */}
          <div
            style={{
              maxWidth: 380,
              display: "flex",
              flexDirection: "column",
              gap: 22,
            }}
          >
            <p
              style={{
                fontSize: 14,
                fontWeight: 350,
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.6,
                margin: 0,
                textShadow: "0 1px 8px rgba(0,0,0,0.6)",
              }}
            >
              Own, swap, and settle your on-chain assets with zero counterparty
              trust. Non-custodial PDA escrow engineered for Solana.
            </p>
            <div>
              <Link href="/vault" className="btn-pill-solid">
                ENTER THE VAULT
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom border */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "clamp(24px, 5vw, 64px)",
            right: "clamp(24px, 5vw, 64px)",
            height: 1,
            background: "rgba(255,255,255,0.1)",
          }}
        />
      </section>

      {/* ================================================================= */}
      {/* BELOW-THE-FOLD: Solid dark bg so image doesn't repeat there       */}
      {/* ================================================================= */}
      <div style={{ background: "linear-gradient(180deg, rgba(1,5,12,0) 0%, #01050c 6%)", paddingTop: 4 }}>

        {/* ================================================================= */}
        {/* FEATURES GRID                                                      */}
        {/* ================================================================= */}
        <section
          style={{
            maxWidth: 1360,
            margin: "0 auto",
            padding: "90px clamp(24px, 5vw, 64px)",
          }}
        >
          <FadeUp>
            <SectionHeader
              tag="Protocol Design"
              headline="Built for certainty, not convenience."
              subline="Every mechanism in LetsDeal is designed so neither party can deviate. On-chain math enforces the agreement."
            />
          </FadeUp>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 20,
              marginTop: 52,
            }}
          >
            {features.map((f, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div className="panel-glass" style={{ padding: 30, height: "100%" }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: "rgba(0, 163, 255, 0.08)",
                      border: "1px solid rgba(0, 163, 255, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 20,
                    }}
                  >
                    <f.icon size={18} strokeWidth={1.5} color="#3ECBFF" />
                  </div>
                  <h3
                    style={{
                      fontSize: 15,
                      fontWeight: 450,
                      color: "#FFFFFF",
                      margin: "0 0 10px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {f.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 13.5,
                      fontWeight: 350,
                      color: "#8BA3C7",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {f.desc}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* ================================================================= */}
        {/* 4-STEP PIPELINE                                                    */}
        {/* ================================================================= */}
        <section
          style={{
            maxWidth: 1360,
            margin: "0 auto",
            padding: "0 clamp(24px, 5vw, 64px) 90px",
          }}
        >
          <div className="divider" style={{ marginBottom: 80 }} />
          <FadeUp>
            <SectionHeader
              tag="Execution Model"
              headline="Four precise phases, zero friction."
            />
          </FadeUp>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 1,
              marginTop: 52,
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 20,
              overflow: "hidden",
              background: "rgba(4, 20, 39, 0.3)",
            }}
          >
            {steps.map((step, i) => (
              <FadeUp key={i} delay={i * 0.08}>
                <div
                  style={{
                    padding: "36px 30px",
                    background: "rgba(4, 20, 39, 0.4)",
                    backdropFilter: "blur(12px)",
                    borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
                    height: "100%",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: 11,
                      color: "#3ECBFF",
                      letterSpacing: "0.1em",
                      display: "block",
                      marginBottom: 16,
                      fontWeight: 400,
                    }}
                  >
                    {step.n}
                  </span>
                  <h4
                    style={{
                      fontSize: 15,
                      fontWeight: 450,
                      color: "#FFFFFF",
                      margin: "0 0 10px",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {step.title}
                  </h4>
                  <p
                    style={{
                      fontSize: 13,
                      fontWeight: 350,
                      color: "#8BA3C7",
                      lineHeight: 1.6,
                      margin: 0,
                    }}
                  >
                    {step.desc}
                  </p>
                </div>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* ================================================================= */}
        {/* FINAL CTA                                                          */}
        {/* ================================================================= */}
        <section
          style={{
            maxWidth: 1360,
            margin: "0 auto",
            padding: "0 clamp(24px, 5vw, 64px) 120px",
            textAlign: "center",
          }}
        >
          <FadeUp>
            <div
              style={{
                position: "relative",
                padding: "76px 40px",
                borderRadius: 24,
                border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(4, 20, 39, 0.5)",
                backdropFilter: "blur(20px)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 500,
                  height: 250,
                  background: "radial-gradient(ellipse, rgba(0,163,255,0.2) 0%, transparent 70%)",
                  pointerEvents: "none",
                }}
              />
              <span className="tag-cyan" style={{ display: "block", marginBottom: 16 }}>
                Get Started
              </span>
              <h2
                style={{
                  fontSize: "clamp(30px, 4vw, 46px)",
                  fontWeight: 300,
                  letterSpacing: "-0.035em",
                  lineHeight: 1.12,
                  color: "#FFFFFF",
                  margin: "0 0 28px",
                }}
              >
                Deploy your first escrow
                <br />
                in under 60 seconds.
              </h2>
              <Link href="/vault" className="btn-pill-solid">
                ENTER THE VAULT
                <ArrowRight size={14} strokeWidth={1.5} />
              </Link>
            </div>
          </FadeUp>
        </section>

        <div
          className="divider"
          style={{ maxWidth: 1360, margin: "0 auto", padding: "0 clamp(24px, 5vw, 64px)" }}
        />
        <Footer />
      </div>
    </div>
  );
}
