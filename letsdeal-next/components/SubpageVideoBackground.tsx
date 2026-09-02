"use client";

import { usePathname } from "next/navigation";

export default function SubpageVideoBackground() {
  const pathname = usePathname();

  // Only render on subpages (all pages apart from the landing page "/")
  if (pathname === "/") {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
        backgroundColor: "#01050C",
      }}
      aria-hidden="true"
    >
      {/* 
        Video is natively 9:16 vertical (612x1088).
        Rotating it horizontally transforms it into a 16:9 widescreen landscape presentation.
        Using 100vh width x 100vw height ensures the rotated element spans edge-to-edge
        with zero letterboxing, maximum sharpness, and GPU acceleration.
      */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        src="/bg-subpage.mp4"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "100vh",
          height: "100vw",
          minWidth: "100vh",
          minHeight: "100vw",
          transform: "translate(-50%, -50%) rotate(90deg) scale(1.02)",
          objectFit: "cover",
          objectPosition: "center",
          opacity: 0.65,
          filter: "contrast(1.18) brightness(1.04) saturate(1.15)",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      />

      {/* Cinematic ambient glass vignette to protect UI text readability while letting the visual shine */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 50% 50%, rgba(1, 5, 12, 0.12) 0%, rgba(1, 5, 12, 0.5) 60%, rgba(1, 5, 12, 0.88) 100%)",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
