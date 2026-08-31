"use client";

import Image from "next/image";

export default function HeroArtwork() {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 720,
        height: 420,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto",
      }}
      aria-hidden="true"
    >
      {/* Background Radial Glow Aura */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 500,
          height: 350,
          background:
            "radial-gradient(ellipse at center, rgba(62, 203, 255, 0.28) 0%, rgba(0, 140, 255, 0.12) 40%, rgba(6, 11, 20, 0) 70%)",
          filter: "blur(30px)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Outer Subtle Orbit Ring */}
      <div
        style={{
          position: "absolute",
          top: "22%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 320,
          height: 320,
          borderRadius: "50%",
          border: "1px solid rgba(62, 203, 255, 0.12)",
          boxShadow: "0 0 40px rgba(62, 203, 255, 0.08)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* The Hero Image (Hand holding electric glowing sphere) */}
      <div
        className="hero-art-floating"
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 620,
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          src="/bg-hero.png"
          alt="LetsDeal Quantum Protocol Core"
          width={620}
          height={350}
          priority
          style={{
            objectFit: "contain",
            width: "auto",
            height: "auto",
            maxWidth: "100%",
            maxHeight: "100%",
            filter: "drop-shadow(0 0 45px rgba(62, 203, 255, 0.35))",
          }}
        />
      </div>

      {/* Subtle bottom fade gradient to merge into dark bg */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          background:
            "linear-gradient(to top, rgba(6, 11, 20, 0.95) 0%, transparent 100%)",
          pointerEvents: "none",
          zIndex: 2,
        }}
      />
    </div>
  );
}
