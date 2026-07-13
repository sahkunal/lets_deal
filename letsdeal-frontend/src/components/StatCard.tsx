import { FC, ReactNode } from "react";

export const StatCard: FC<{ label: string; value: ReactNode; accent?: string }> = ({
  label,
  value,
  accent,
}) => (
  <div className="panel" style={{ padding: "14px 16px" }}>
    <div className="mono-label" style={{ marginBottom: 8 }}>
      {label}
    </div>
    <div
      style={{
        fontSize: 22,
        fontWeight: 700,
        color: accent ?? "var(--text)",
      }}
    >
      {value}
    </div>
  </div>
);
