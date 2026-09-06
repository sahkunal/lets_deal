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
        On mobile/portrait: plays in native vertical orientation (no rotation).
        On desktop/widescreen landscape: rotated 90deg to span 16:9 widescreen edge-to-edge.
      */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        src="/bg-subpage.mp4"
        className="subpage-video-element"
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
