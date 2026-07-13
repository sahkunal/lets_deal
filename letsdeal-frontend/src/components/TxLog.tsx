import { FC } from "react";
import { explorerTx } from "../constants";

export interface TxLogEntry {
  id: string;
  label: string;
  sig?: string;
  status: "pending" | "confirmed" | "error";
  error?: string;
}

export const TxLog: FC<{ entries: TxLogEntry[] }> = ({ entries }) => {
  if (entries.length === 0) return null;

  return (
    <div className="panel" style={{ padding: "12px 14px" }}>
      <div className="mono-label" style={{ marginBottom: 8 }}>
        tx log
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {entries.map((e) => (
          <div
            key={e.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12.5,
            }}
          >
            <span
              style={{
                color:
                  e.status === "confirmed"
                    ? "var(--green)"
                    : e.status === "error"
                    ? "var(--red)"
                    : "var(--amber)",
              }}
            >
              {e.status === "confirmed"
                ? "[ok]"
                : e.status === "error"
                ? "[fail]"
                : "[..]"}
            </span>
            <span style={{ color: "var(--text)" }}>{e.label}</span>
            {e.error && (
              <span style={{ color: "var(--red)", fontSize: 11.5 }}>
                — {e.error}
              </span>
            )}
            {e.sig && (
              <a
                href={explorerTx(e.sig)}
                target="_blank"
                rel="noreferrer"
                style={{ marginLeft: "auto", fontSize: 11.5 }}
              >
                view &gt;
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
