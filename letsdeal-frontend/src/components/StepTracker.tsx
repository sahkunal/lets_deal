import { FC } from "react";
import { EscrowState } from "../lib/escrowAccount";

const STEPS = [
  { state: EscrowState.Initialized, label: "init" },
  { state: EscrowState.FundsDeposited, label: "sol locked" },
  { state: EscrowState.NftDeposited, label: "nft locked" },
  { state: EscrowState.Completed, label: "settled" },
];

export const StepTracker: FC<{ current: EscrowState }> = ({ current }) => {
  const isRefunded = current === EscrowState.Refunded;

  return (
    <div style={{ display: "flex", gap: 6 }}>
      {STEPS.map((step, i) => {
        const done = !isRefunded && current > step.state;
        const active = !isRefunded && current === step.state;
        return (
          <div
            key={step.label}
            className="panel"
            style={{
              flex: 1,
              padding: "10px 12px",
              borderColor: active ? "var(--green)" : "var(--line)",
              background: active ? "rgba(53,224,138,0.06)" : "var(--bg-raised)",
            }}
          >
            <div className="mono-label" style={{ marginBottom: 4 }}>
              step {i + 1}
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: done
                  ? "var(--green)"
                  : active
                  ? "var(--text)"
                  : "var(--text-faint)",
              }}
            >
              {done ? "[x] " : active ? "[>] " : "[ ] "}
              {step.label}
            </div>
          </div>
        );
      })}
      {isRefunded && (
        <div
          className="panel"
          style={{
            flex: 1,
            padding: "10px 12px",
            borderColor: "var(--red)",
            background: "rgba(242,84,91,0.06)",
          }}
        >
          <div className="mono-label">status</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--red)" }}>
            [x] refunded
          </div>
        </div>
      )}
    </div>
  );
};
