"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Explore", href: "/explore" },
  { label: "Vault", href: "/vault" },
  { label: "Technology", href: "/technology" },
  { label: "Lore", href: "/lore" },
  { label: "Community", href: "/community" },
  { label: "Docs", href: "/docs" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
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
        height: 84,
        padding: "0 clamp(24px, 5vw, 64px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: scrolled
          ? "rgba(1, 5, 12, 0.75)"
          : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(255, 255, 255, 0.06)"
          : "1px solid transparent",
        transition: "all 0.35s ease",
      }}
    >
      {/* Brand Wordmark matching OBELISK from reference */}
      <Link
        href="/"
        style={{
          fontSize: 16,
          fontWeight: 500,
          color: "#FFFFFF",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: 4,
        }}
      >
        LETSDEAL
      </Link>

      {/* Desktop Navigation */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: 36,
        }}
        className="hidden md:flex"
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`nav-link ${pathname === link.href ? "active" : ""}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Connect Glass Pill Button matching reference */}
      <div className="hidden md:block">
        <Link href="/vault" className="btn-pill-glass">
          CONNECT
        </Link>
      </div>

      {/* Mobile Hamburger */}
      <button
        className="md:hidden"
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: 9999,
          padding: "6px 14px",
          cursor: "pointer",
          color: "#FFFFFF",
          fontSize: 11,
          letterSpacing: "0.08em",
          fontWeight: 400,
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
            top: 84,
            left: 0,
            right: 0,
            background: "rgba(1, 5, 12, 0.96)",
            backdropFilter: "blur(24px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
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
              className="nav-link"
              style={{ fontSize: 14 }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/vault"
            onClick={() => setMenuOpen(false)}
            className="btn-pill-solid"
            style={{ width: "fit-content", marginTop: 8 }}
          >
            CONNECT
          </Link>
        </div>
      )}
    </header>
  );
}
