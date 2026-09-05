"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { ExternalLink, Terminal } from "lucide-react";
import { CoolSolanaLogo } from "@/components/CoolIcons";

function GithubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

const navLinks = [
  { label: "Terminal", href: "/vault" },
  { label: "Explorer", href: "/explore" },
  { label: "Docs", href: "/docs" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        height: 68,
        padding: "0 clamp(16px, 3.5vw, 56px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled ? "rgba(0, 0, 0, 0.82)" : "rgba(0, 0, 0, 0.4)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        transition: "all 0.25s ease",
      }}
    >
      {/* Brand: Official Solana Mark + LETSDEAL */}
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          textDecoration: "none",
        }}
      >
        <CoolSolanaLogo size={24} />
        <span
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#FFFFFF",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          LETSDEAL
        </span>
        <span
          style={{
            background: "rgba(20, 241, 149, 0.12)",
            border: "1px solid rgba(20, 241, 149, 0.3)",
            color: "#14F195",
            fontSize: 10,
            fontWeight: 600,
            padding: "2px 7px",
            borderRadius: 9999,
            letterSpacing: "0.04em",
          }}
        >
          SOLANA
        </span>
      </Link>

      {/* Center: Solana Pill Navigation */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "rgba(255, 255, 255, 0.03)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          padding: "4px 6px",
          borderRadius: 9999,
        }}
        className="hidden md:flex"
      >
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: 13.5,
                fontWeight: isActive ? 500 : 400,
                color: isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.65)",
                padding: "6px 16px",
                borderRadius: 9999,
                background: isActive
                  ? "rgba(255, 255, 255, 0.1)"
                  : "transparent",
                textDecoration: "none",
                transition: "all 0.15s ease",
              }}
            >
              {link.label}
            </Link>
          );
        })}

        <a
          href="https://github.com/sahkunal/lets_deal"
          target="_blank"
          rel="noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            fontSize: 13.5,
            color: "rgba(255, 255, 255, 0.65)",
            padding: "6px 14px",
            borderRadius: 9999,
            textDecoration: "none",
            transition: "all 0.15s ease",
          }}
        >
          <GithubIcon size={14} />
          GitHub
          <ExternalLink size={11} style={{ opacity: 0.6 }} />
        </a>
      </nav>

      {/* Right: Quick Terminal Jump + Connect Wallet */}
      <div className="hidden md:flex items-center gap-3">
        <Link
          href="/vault"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: 9999,
            padding: "7px 14px",
            color: "rgba(255, 255, 255, 0.85)",
            fontSize: 12,
            fontFamily: "monospace",
            textDecoration: "none",
            transition: "all 0.2s ease",
          }}
        >
          <Terminal size={12} color="#14F195" />
          <span>APP</span>
          <kbd
            style={{
              background: "rgba(0, 0, 0, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: 4,
              padding: "1px 4px",
              fontSize: 10,
              color: "#8BA3C7",
            }}
          >
            ⌘K
          </kbd>
        </Link>

        {mounted ? (
          <WalletMultiButton
            style={{
              backgroundColor: "#14F195",
              color: "#000000",
              border: "none",
              borderRadius: 9999,
              padding: "8px 18px",
              fontSize: 12,
              letterSpacing: "0.02em",
              fontWeight: 600,
              textTransform: "uppercase",
              fontFamily: "var(--font-inter), sans-serif",
              height: "auto",
              lineHeight: 1,
              transition: "all 0.2s ease",
              boxShadow: "0 0 16px rgba(20, 241, 149, 0.25)",
            }}
          />
        ) : (
          <div
            style={{
              backgroundColor: "rgba(20, 241, 149, 0.2)",
              color: "#14F195",
              border: "1px solid rgba(20, 241, 149, 0.4)",
              borderRadius: 9999,
              padding: "8px 18px",
              fontSize: 12,
              fontWeight: 600,
              textTransform: "uppercase",
              height: 36,
              display: "flex",
              alignItems: "center",
            }}
          >
            SELECT WALLET
          </div>
        )}
      </div>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          background: "rgba(255, 255, 255, 0.06)",
          border: "1px solid rgba(255, 255, 255, 0.12)",
          borderRadius: 9999,
          padding: "6px 14px",
          cursor: "pointer",
          color: "#FFFFFF",
          fontSize: 11,
          letterSpacing: "0.08em",
          fontWeight: 500,
          textTransform: "uppercase",
        }}
      >
        {menuOpen ? "CLOSE" : "MENU"}
      </button>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div
          style={{
            position: "absolute",
            top: 68,
            left: 0,
            right: 0,
            background: "rgba(5, 5, 8, 0.98)",
            backdropFilter: "blur(24px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "24px 32px",
            display: "flex",
            flexDirection: "column",
            gap: 18,
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontSize: 15,
                color: "#FFFFFF",
                textDecoration: "none",
              }}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://github.com/sahkunal/lets_deal"
            target="_blank"
            rel="noreferrer"
            style={{
              fontSize: 15,
              color: "#8BA3C7",
              display: "flex",
              alignItems: "center",
              gap: 8,
              textDecoration: "none",
            }}
          >
            <GithubIcon size={16} /> GitHub Repo
          </a>
          <Link
            href="/vault"
            onClick={() => setMenuOpen(false)}
            className="btn-solana-primary"
            style={{ width: "100%", justifyContent: "center", marginTop: 4 }}
          >
            <span>LAUNCH TERMINAL</span>
            <span className="btn-solana-arrow">
              <Terminal size={13} />
            </span>
          </Link>

          {mounted && (
            <div style={{ marginTop: 2, width: "100%" }}>
              <WalletMultiButton
                style={{
                  width: "100%",
                  justifyContent: "center",
                  backgroundColor: "rgba(20, 241, 149, 0.15)",
                  color: "#14F195",
                  border: "1px solid rgba(20, 241, 149, 0.4)",
                  borderRadius: 9999,
                  fontWeight: 600,
                  fontSize: 13,
                  height: 42,
                  fontFamily: "var(--font-inter), sans-serif",
                }}
              />
            </div>
          )}
        </div>
      )}
    </header>
  );
}
