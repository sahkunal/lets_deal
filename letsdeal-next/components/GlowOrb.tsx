"use client";

export default function GlowOrb({ size = 340 }: { size?: number }) {
  return (
    <div
      className="glow-orb"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <div className="glow-orb-inner" />

      {/* Ring 1 */}
      <div
        style={{
          position: "absolute",
          inset: -20,
          borderRadius: "50%",
          border: "1px solid rgba(62, 203, 255, 0.08)",
          animation: "orb-pulse 5s ease-in-out infinite",
          animationDelay: "0.5s",
        }}
      />

      {/* Ring 2 */}
      <div
        style={{
          position: "absolute",
          inset: -48,
          borderRadius: "50%",
          border: "1px solid rgba(62, 203, 255, 0.04)",
          animation: "orb-pulse 5s ease-in-out infinite",
          animationDelay: "1s",
        }}
      />

      {/* Center dot */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#3ECBFF",
          boxShadow: "0 0 20px 4px rgba(62, 203, 255, 0.6)",
          zIndex: 2,
        }}
      />
    </div>
  );
}
