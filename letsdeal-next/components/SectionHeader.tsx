"use client";

interface SectionHeaderProps {
  tag: string;
  headline: string;
  subline?: string;
}

export default function SectionHeader({
  tag,
  headline,
  subline,
}: SectionHeaderProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <span className="section-tag">{tag}</span>
      <h2
        style={{
          fontSize: "clamp(30px, 3.8vw, 44px)",
          fontWeight: 250,
          letterSpacing: "-0.03em",
          lineHeight: 1.12,
          color: "#F5F7FA",
          margin: 0,
        }}
      >
        {headline}
      </h2>
      {subline && (
        <p
          style={{
            fontSize: 14.5,
            fontWeight: 350,
            color: "#8E9CAB",
            lineHeight: 1.6,
            maxWidth: 480,
            marginTop: 4,
          }}
        >
          {subline}
        </p>
      )}
    </div>
  );
}
