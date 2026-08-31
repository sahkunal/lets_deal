"use client";

import Image from "next/image";

export default function HeroCenterpiece() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 780,
        height: 520,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto",
      }}
      aria-hidden="true"
    >
      {/* 1. Core Radiant Cyan Backlight Aura (The Eclipse Halo) */}
      <div
        className="animate-glow-pulse"
        style={{
          position: "absolute",
          top: "34%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 440,
          height: 440,
          background:
            "radial-gradient(circle, rgba(0, 163, 255, 0.7) 0%, rgba(0, 120, 220, 0.35) 30%, rgba(0, 60, 150, 0.12) 55%, transparent 72%)",
          filter: "blur(40px)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* 2. Secondary Wider Ambient Blue Glow */}
      <div
        style={{
          position: "absolute",
          top: "34%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 680,
          height: 550,
          background:
            "radial-gradient(ellipse, rgba(10, 61, 104, 0.6) 0%, rgba(5, 37, 68, 0.3) 45%, transparent 75%)",
          filter: "blur(60px)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* 3. Status Metadata Node — TOP (Network) */}
      <div
        style={{
          position: "absolute",
          top: "4%",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <span className="hero-stat-node-label">Network</span>
        <span className="hero-stat-node-value">Solana Devnet</span>
      </div>

      {/* 4. Status Metadata Node — LEFT (Architecture) */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          left: "clamp(12px, 8vw, 60px)",
          zIndex: 10,
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <span className="hero-stat-node-label">Architecture</span>
        <span className="hero-stat-node-value">PDA Vaults</span>
      </div>

      {/* 5. Status Metadata Node — RIGHT (Status) */}
      <div
        style={{
          position: "absolute",
          top: "30%",
          right: "clamp(12px, 8vw, 60px)",
          zIndex: 10,
          textAlign: "right",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <span className="hero-stat-node-label">Status</span>
        <span className="hero-stat-node-value">Vault Online</span>
      </div>

      {/* 6. The Celestial Hand & Glowing Sphere Artwork */}
      <div
        className="animate-float"
        style={{
          position: "relative",
          zIndex: 5,
          width: "100%",
          maxWidth: 620,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        <Image
          src="/bg-hero.png"
          alt="LetsDeal Core"
          width={620}
          height={480}
          priority
          style={{
            objectFit: "contain",
            width: "auto",
            height: "auto",
            maxWidth: "100%",
            maxHeight: "100%",
            filter: "drop-shadow(0 0 50px rgba(0, 163, 255, 0.45))",
          }}
        />
      </div>

      {/* 7. Bottom Shadow Blend Gradient to merge hand cleanly into darkness */}
      <div
        style={{
          position: "absolute",
          bottom: -10,
          left: 0,
          right: 0,
          height: 100,
          background:
            "linear-gradient(to top, #01050C 20%, rgba(1, 5, 12, 0.8) 60%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 8,
        }}
      />
    </div>
  );
}
