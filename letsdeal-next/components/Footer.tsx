"use client";

import Link from "next/link";

const PROGRAM_ID = "FzwhoLmFm8avMRpgwTL5mWiC8oi8RSqkbDdYBU7SeQj";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "64px clamp(24px, 5vw, 64px) 40px",
        maxWidth: 1360,
        margin: "0 auto",
        width: "100%",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
          gap: 48,
        }}
        className="grid-cols-2 sm:grid-cols-4"
      >
        {/* Brand Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Link
            href="/"
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: "#FFFFFF",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            LETSDEAL
          </Link>
          <p
            style={{
              fontSize: 13,
              fontWeight: 350,
              color: "#8BA3C7",
              lineHeight: 1.6,
              maxWidth: 220,
            }}
          >
            Non-custodial OTC escrow protocol for trustless SOL ⇄ NFT swaps on Solana.
          </p>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 11,
              color: "#526B8E",
            }}
          >
            Program:{" "}
            <a
              href={`https://explorer.solana.com/address/${PROGRAM_ID}?cluster=devnet`}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#3ECBFF", textDecoration: "none" }}
            >
              {PROGRAM_ID.slice(0, 6)}…{PROGRAM_ID.slice(-6)}
            </a>
          </div>
        </div>

        {/* Protocol Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span
            style={{
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#526B8E",
              fontWeight: 450,
            }}
          >
            Protocol
          </span>
          {[
            { label: "Trade Terminal", href: "/vault" },
            { label: "Live Explorer", href: "/explore" },
            { label: "Technical Docs", href: "/docs" },
          ].map((l) => (
            <Link
              key={l.label}
              href={l.href}
              style={{
                fontSize: 13,
                fontWeight: 350,
                color: "#8BA3C7",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = "#FFFFFF")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color = "#8BA3C7")
              }
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Developer Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span
            style={{
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#526B8E",
              fontWeight: 450,
            }}
          >
            Developers
          </span>
          {[
            { label: "GitHub Source", href: "https://github.com/sahkunal/lets_deal" },
            { label: "Anchor Program", href: `https://explorer.solana.com/address/${PROGRAM_ID}?cluster=devnet` },
            { label: "Solscan Contract", href: `https://solscan.io/account/${PROGRAM_ID}?cluster=devnet` },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: 13,
                fontWeight: 350,
                color: "#8BA3C7",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = "#FFFFFF")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color = "#8BA3C7")
              }
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* Ecosystem Links */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span
            style={{
              fontSize: 11,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#526B8E",
              fontWeight: 450,
            }}
          >
            Ecosystem
          </span>
          {[
            { label: "Solana.com", href: "https://solana.com" },
            { label: "Solscan", href: "https://solscan.io" },
            { label: "Anchor Lang", href: "https://anchor-lang.com" },
            { label: "Solana Faucet", href: "https://solfaucet.com" },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: 13,
                fontWeight: 350,
                color: "#8BA3C7",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) =>
                ((e.target as HTMLElement).style.color = "#FFFFFF")
              }
              onMouseLeave={(e) =>
                ((e.target as HTMLElement).style.color = "#8BA3C7")
              }
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        style={{
          marginTop: 48,
          paddingTop: 24,
          borderTop: "1px solid rgba(255, 255, 255, 0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <span
          style={{ fontSize: 12, color: "#526B8E", fontFamily: "monospace" }}
        >
          © {new Date().getFullYear()} LETSDEAL PROTOCOL — SOLANA DEVNET
        </span>
        <div style={{ display: "flex", gap: 18 }}>
          <a
            href="https://github.com/sahkunal/lets_deal"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#8BA3C7", transition: "color 0.2s" }}
            onMouseEnter={(e) =>
              ((e.target as HTMLElement).style.color = "#3ECBFF")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLElement).style.color = "#8BA3C7")
            }
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noreferrer"
            style={{ color: "#8BA3C7", transition: "color 0.2s" }}
            onMouseEnter={(e) =>
              ((e.target as HTMLElement).style.color = "#3ECBFF")
            }
            onMouseLeave={(e) =>
              ((e.target as HTMLElement).style.color = "#8BA3C7")
            }
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
