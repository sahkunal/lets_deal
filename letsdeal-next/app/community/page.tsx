import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SectionHeader from "@/components/SectionHeader";
import FadeUp from "@/components/FadeUp";
import { MessageCircle, ExternalLink } from "lucide-react";
import Image from "next/image";

const links = [
  {
    name: "GitHub",
    desc: "Smart contract source code, typescript client SDK, and open pull requests.",
    href: "https://github.com/sahkunal/lets_deal",
    cta: "Star Repository",
  },
  {
    name: "Twitter / X",
    desc: "Protocol developments, technical release updates, and ecosystem news.",
    href: "https://twitter.com",
    cta: "Follow Updates",
  },
  {
    name: "Discord",
    desc: "Developer discussions, architectural questions, and community support channels.",
    href: "#",
    cta: "Join Server",
  },
];

export default function CommunityPage() {
  return (
    <div className="bg-subpage" style={{ minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section style={{ maxWidth: 1360, margin: "0 auto", padding: "64px clamp(24px, 5vw, 64px) 40px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 48, flexWrap: "wrap" }}>
        <FadeUp>
          <div style={{ maxWidth: 520 }}>
            <span className="tag-cyan" style={{ display: "block", marginBottom: 14 }}>Ecosystem Network</span>
            <h1 style={{ fontSize: "clamp(34px, 4vw, 52px)", fontWeight: 300, letterSpacing: "-0.035em", lineHeight: 1.1, color: "#FFFFFF", margin: "0 0 20px" }}>
              Built in public.
              <br />
              Ship with us.
            </h1>
            <p style={{ fontSize: 14.5, fontWeight: 350, color: "#8BA3C7", lineHeight: 1.65, margin: 0 }}>
              LetsDeal is open protocol infrastructure. Contributions, security reviews, and developer integrations are welcomed.
            </p>
          </div>
        </FadeUp>


      </section>

      {/* Community Links */}
      <section style={{ maxWidth: 1360, margin: "0 auto", padding: "20px clamp(24px, 5vw, 64px) 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {links.map((l, i) => (
            <FadeUp key={i} delay={i * 0.08}>
              <div className="panel-glass" style={{ padding: 32, display: "flex", flexDirection: "column", gap: 18 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(0, 163, 255, 0.08)", border: "1px solid rgba(0, 163, 255, 0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {l.name === "Discord" ? (
                      <MessageCircle size={18} strokeWidth={1.5} color="#3ECBFF" />
                    ) : l.name === "GitHub" ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#3ECBFF"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                    ) : (
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="#3ECBFF"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63 5.905-5.63Zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    )}
                  </div>
                  <h3 style={{ fontSize: 15, fontWeight: 450, color: "#FFFFFF", margin: 0, letterSpacing: "-0.01em" }}>{l.name}</h3>
                </div>
                <p style={{ fontSize: 13.5, fontWeight: 350, color: "#8BA3C7", lineHeight: 1.55, margin: 0 }}>{l.desc}</p>
                <a
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-pill-glass"
                  style={{ width: "fit-content", fontSize: 11 }}
                >
                  {l.cta.toUpperCase()}
                  <ExternalLink size={12} strokeWidth={1.5} />
                </a>
              </div>
            </FadeUp>
          ))}
        </div>
      </section>

      {/* Metrics Strip */}
      <section style={{ maxWidth: 1360, margin: "0 auto", padding: "0 clamp(24px, 5vw, 64px) 120px" }}>
        <FadeUp>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 1, border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: 20, overflow: "hidden", background: "rgba(4, 20, 39, 0.3)" }}>
            {[
              { label: "Protocol Version", value: "v0.1.0" },
              { label: "Network", value: "Solana Devnet" },
              { label: "Account Size", value: "113 Bytes" },
              { label: "License", value: "MIT Open Source" },
            ].map((s, i) => (
              <div key={i} className="stat-block" style={{ padding: 26, background: "rgba(4, 20, 39, 0.4)", backdropFilter: "blur(12px)", borderRight: i < 3 ? "1px solid rgba(255, 255, 255, 0.06)" : "none" }}>
                <span className="stat-label">{s.label}</span>
                <span className="stat-value" style={{ fontSize: 16, fontWeight: 400 }}>{s.value}</span>
              </div>
            ))}
          </div>
        </FadeUp>
      </section>

      <div className="divider" style={{ maxWidth: 1360, margin: "0 auto", padding: "0 clamp(24px, 5vw, 64px)" }} />
      <Footer />
    </div>
  );
}
