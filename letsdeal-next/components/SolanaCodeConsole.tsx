"use client";

import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";

interface Tab {
  id: string;
  label: string;
  lang: string;
  code: string;
}

const TABS: Tab[] = [
  {
    id: "ts",
    label: "TypeScript SDK",
    lang: "typescript",
    code: `import { Connection, PublicKey } from "@solana/web3.js";
import { createExecuteTradeTx } from "@/lib/instructions";

// Atomic 1-slot swap execution on Solana
const tx = await createExecuteTradeTx(connection, {
  escrow: new PublicKey("28dfA6RRoTkD6hBJSvH3bXPKZEr7dHrYJpC6QsvrkzRc"),
  seller: sellerKeypair.publicKey,
  buyer: buyerKeypair.publicKey,
  nftMint: new PublicKey("So11111111111111111111111111111111111111112"),
  feePayer: buyerKeypair.publicKey,
});

const sig = await sendAndConfirmTransaction(connection, tx, [buyerKeypair]);
console.log("Atomic Swap Settled:", sig);`,
  },
  {
    id: "rust",
    label: "Rust / Anchor",
    lang: "rust",
    code: `#[program]
pub mod lets_deal {
    use super::*;

    pub fn execute_trade(ctx: Context<ExecuteTrade>) -> Result<()> {
        instructions::execute_trade::handler(ctx)
    }

    pub fn refund(ctx: Context<Refund>) -> Result<()> {
        instructions::refund::handler(ctx)
    }
}

// Deterministic Vault Authority: [b"vault", escrow.key()]
#[derive(Accounts)]
pub struct ExecuteTrade<'info> {
    #[account(mut, has_one = buyer, has_one = seller)]
    pub escrow: Account<'info, Escrow>,
    /// CHECK: PDA vault verified via seeds
    #[account(mut, seeds = [b"vault", escrow.key().as_ref()], bump)]
    pub vault: AccountInfo<'info>,
}`,
  },
  {
    id: "discriminators",
    label: "Raw Binary Protocol",
    lang: "solana",
    code: `// Deterministic 8-byte instruction discriminators (SHA-256)
INITIALIZE     = [0xaf, 0xaf, 0x6d, 0x1f, 0x0d, 0x98, 0x9b, 0xed]
DEPOSIT_FUNDS  = [0x2f, 0x9c, 0xf6, 0x08, 0x76, 0x3d, 0x48, 0x72]
DEPOSIT_NFT    = [0x32, 0xd4, 0x6e, 0x8f, 0x57, 0x78, 0x06, 0x3a]
EXECUTE_TRADE  = [0x62, 0x0d, 0xb8, 0x69, 0xb7, 0x22, 0x5a, 0x8b]
REFUND         = [0x02, 0x50, 0x95, 0xeb, 0x64, 0xa5, 0x4d, 0xa4]

// Account Size: exactly 121 bytes (deterministic rent-exemption)`,
  },
];

export default function SolanaCodeConsole() {
  const [activeTab, setActiveTab] = useState<string>("ts");
  const [copied, setCopied] = useState(false);

  const currentTab = TABS.find((t) => t.id === activeTab) || TABS[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentTab.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        backgroundColor: "rgba(13, 12, 17, 0.78)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.7)",
      }}
    >
      {/* Console Top Window Bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px clamp(12px, 3vw, 20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          backgroundColor: "#09080D",
          flexWrap: "wrap",
          gap: 10,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", flex: 1, minWidth: 0 }}>
          {/* macOS window dots */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#FF5F56",
                display: "inline-block",
              }}
            />
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#FFBD2E",
                display: "inline-block",
              }}
            />
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: "#27C93F",
                display: "inline-block",
              }}
            />
          </div>

          {/* Language / Mode Tabs (horizontally scrollable on small screens) */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 4,
              overflowX: "auto",
              maxWidth: "100%",
              scrollbarWidth: "none",
            }}
          >
            {TABS.map((t) => {
              const isActive = t.id === activeTab;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  style={{
                    background: isActive
                      ? "rgba(255, 255, 255, 0.1)"
                      : "transparent",
                    color: isActive ? "#FFFFFF" : "#8BA3C7",
                    border: "none",
                    borderRadius: 9999,
                    padding: "4px 10px",
                    fontSize: 11.5,
                    fontWeight: isActive ? 500 : 400,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(255, 255, 255, 0.04)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: 6,
            padding: "4px 10px",
            color: "#8BA3C7",
            fontSize: 11,
            fontFamily: "monospace",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
        >
          {copied ? (
            <>
              <Check size={12} color="#14F195" />
              <span style={{ color: "#14F195" }}>COPIED</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>COPY</span>
            </>
          )}
        </button>
      </div>

      {/* Code Editor Body */}
      <div style={{ padding: "20px 24px", overflowX: "auto" }}>
        <pre
          style={{
            margin: 0,
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            fontSize: 13,
            lineHeight: 1.65,
            color: "#D1D5DB",
          }}
        >
          {currentTab.code}
        </pre>
      </div>

      {/* Bottom Status bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "8px 20px",
          borderTop: "1px solid rgba(255, 255, 255, 0.05)",
          backgroundColor: "#08070B",
          fontSize: 11,
          fontFamily: "monospace",
          color: "#526B8E",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Terminal size={11} color="#14F195" />
          <span>SOLANA_RUNTIME_V1</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span>SLOT_EXECUTION: ~400ms</span>
          <span style={{ color: "#14F195" }}>DETERMINISTIC_SAFE</span>
        </div>
      </div>
    </div>
  );
}
