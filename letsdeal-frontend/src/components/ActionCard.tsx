import { FC, ReactNode } from "react";

export const ActionCard: FC<{
  title: string;
  description: string;
  ready: boolean;
  readyLabel?: string;
  buttonLabel: string;
  loading?: boolean;
  danger?: boolean;
  onClick: () => void;
  extra?: ReactNode;
}> = ({
  title,
  description,
  ready,
  readyLabel = "your turn",
  buttonLabel,
  loading,
  danger,
  onClick,
  extra,
}) => {
  return (
    <div
      className="panel"
      style={{
        padding: "16px 18px",
        borderColor: ready ? "var(--green)" : "var(--line)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontWeight: 700, fontSize: 14 }}>{title}</span>
        {ready && (
          <span
            style={{
              marginLeft: "auto",
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              color: "var(--bg)",
              background: "var(--green)",
              padding: "2px 8px",
            }}
          >
            {readyLabel}
          </span>
        )}
      </div>
      <p style={{ margin: 0, fontSize: 12.5, color: "var(--text-dim)", lineHeight: 1.6 }}>
        {description}
      </p>
      {extra}
      <button
        className={`term-btn ${ready ? (danger ? "danger" : "primary") : ""}`}
        disabled={!ready || loading}
        onClick={onClick}
        style={{ marginTop: 4 }}
      >
        {loading ? "confirming..." : ready ? buttonLabel : "waiting..."}
      </button>
    </div>
  );
};
