import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import FadeUp from "@/components/FadeUp";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

const sections = [
  {
    tag: "Quick Start",
    title: "Getting started",
    items: [
      { name: "Installation", desc: "Install Node.js, Solana CLI tools, and Anchor to build on top of LetsDeal." },
      { name: "Connect to Devnet", desc: "Configure your local cluster URL: solana config set --url devnet." },
      { name: "Get Devnet SOL", desc: "Request test tokens via solana airdrop 2 or the official Solana faucet." },
      { name: "Deploy Test Escrow", desc: "Instantiate an escrow account with locked parameters and verify PDA state." },
    ],
  },
  {
    tag: "Client SDK",
    title: "Zero-IDL Integration",
    items: [
      { name: "initialize()", desc: "Create escrow account with fixed parameters. Returns PDA address and transaction signature." },
      { name: "depositFunds()", desc: "Transfer SOL into the vault PDA. Validates account state before executing transfer." },
      { name: "depositNft()", desc: "Seller transfers NFT token into the vault's ATA. Enforces matching mint address." },
      { name: "executeTrade()", desc: "Atomic instruction. Both token legs succeed or the entire slot transaction reverts." },
      { name: "refund()", desc: "Buyer-only instruction. Validates Clock::get() has exceeded the stored deadline timestamp." },
    ],
  },
  {
    tag: "Reference",
    title: "Program addresses",
    items: [
      { name: "Program ID", desc: "FzwhoLmFm8avMRpgwTL5mWiC8oi8RSqkbDdYBU7SeQj (Devnet)" },
      { name: "Account Discriminator", desc: "SHA256('account:Escrow')[0..8] — deterministic compile-time constant." },
      { name: "PDA Seeds", desc: "[b'escrow', buyer_pubkey.as_ref(), escrow_id.to_le_bytes()]" },
      { name: "Token Program", desc: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="bg-subpage" style={{ minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section style={{ maxWidth: 1360, margin: "0 auto", padding: "64px clamp(24px, 5vw, 64px) 40px", display: "flex", flexDirection: "column", alignItems: "center" }}>


        <FadeUp>
          <div style={{ textAlign: "center", maxWidth: 560 }}>
            <span className="tag-cyan" style={{ display: "block", marginBottom: 14 }}>Documentation</span>
            <h1 style={{ fontSize: "clamp(34px, 4vw, 52px)", fontWeight: 300, letterSpacing: "-0.035em", lineHeight: 1.1, color: "#FFFFFF", margin: 0 }}>
              Developer documentation.
            </h1>
            <p style={{ fontSize: 14.5, fontWeight: 350, color: "#8BA3C7", lineHeight: 1.6, margin: "16px auto 0" }}>
              Complete technical documentation and integration instructions for the LetsDeal on-chain escrow protocol.
            </p>
          </div>
        </FadeUp>
      </section>

      {/* Content Layout */}
      <section style={{ maxWidth: 1360, margin: "0 auto", padding: "20px clamp(24px, 5vw, 64px) 120px" }}>
        <div style={{ display: "flex", gap: 40, alignItems: "flex-start", flexWrap: "wrap" }}>
          {/* Sidebar */}
          <div style={{ width: 240, flexShrink: 0 }}>
            <div className="panel-glass" style={{ padding: 22, position: "sticky", top: 100 }}>
              {sections.map((s) => (
                <div key={s.tag} style={{ marginBottom: 20 }}>
                  <div className="stat-label" style={{ marginBottom: 8 }}>{s.tag}</div>
                  {s.items.map((item) => (
                    <div
                      key={item.name}
                      style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 0", cursor: "pointer" }}
                    >
                      <ChevronRight size={12} strokeWidth={1.5} color="#8BA3C7" />
                      <span style={{ fontSize: 12, color: "#8BA3C7", fontWeight: 350, transition: "color 0.2s" }}>{item.name}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {sections.map((s, si) => (
              <FadeUp key={si} delay={si * 0.08}>
                <div style={{ marginBottom: 56 }}>
                  <SectionHeader tag={s.tag} headline={s.title} />
                  <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 12 }}>
                    {s.items.map((item, ii) => (
                      <div key={ii} className="panel-glass" style={{ padding: "20px 24px", display: "flex", alignItems: "flex-start", gap: 16 }}>
                        <div style={{ width: 32, height: 32, background: "rgba(0, 163, 255, 0.08)", border: "1px solid rgba(0, 163, 255, 0.2)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <ChevronRight size={14} strokeWidth={1.5} color="#3ECBFF" />
                        </div>
                        <div>
                          <h4 style={{ fontSize: 13.5, fontWeight: 450, color: "#FFFFFF", margin: "0 0 4px", fontFamily: item.name.includes("()") ? "monospace" : "inherit" }}>
                            {item.name}
                          </h4>
                          <p style={{ fontSize: 13, fontWeight: 350, color: "#8BA3C7", lineHeight: 1.6, margin: 0 }}>{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </FadeUp>
            ))}

            {/* Code snippet */}
            <FadeUp>
              <div className="panel-glass" style={{ padding: 28 }}>
                <div style={{ fontSize: 11, color: "#8BA3C7", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 14, fontWeight: 400 }}>Example — Initialize Escrow</div>
                <pre style={{ fontFamily: "monospace", fontSize: 12, color: "#3ECBFF", lineHeight: 1.7, margin: 0, overflowX: "auto", fontWeight: 350 }}>
{`const tx = await program.methods
  .initialize(
    buyerKey,
    sellerKey,
    new BN(1_500_000_000), // 1.5 SOL
    nftMint,
    new BN(deadline)       // Unix timestamp
  )
  .accounts({
    escrow: escrowPDA,
    payer: wallet.publicKey,
    systemProgram: SystemProgram.programId,
  })
  .rpc();`}
                </pre>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      <div className="divider" style={{ maxWidth: 1360, margin: "0 auto", padding: "0 clamp(24px, 5vw, 64px)" }} />
      <Footer />
    </div>
  );
}
