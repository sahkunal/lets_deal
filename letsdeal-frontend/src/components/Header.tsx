import { FC } from "react";
import { Link } from "react-router-dom";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { CLUSTER_LABEL } from "../constants";

export const Header: FC<{ role?: "buyer" | "seller" }> = ({ role }) => {
  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 28px",
        borderBottom: "1px solid var(--line)",
        background: "var(--bg-raised)",
      }}
    >
      <Link
        to="/"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          textDecoration: "none",
          color: "var(--text)",
        }}
      >
        <span style={{ color: "var(--green)" }}>$</span>
        <span style={{ fontWeight: 700, letterSpacing: "0.02em" }}>
          letsdeal
        </span>
        <span className="blink" style={{ color: "var(--green)" }}>
          _
        </span>
        <span
          style={{
            fontSize: 10,
            color: "var(--text-dim)",
            border: "1px solid var(--line-strong)",
            padding: "2px 6px",
            marginLeft: 4,
            textTransform: "uppercase",
          }}
        >
          {CLUSTER_LABEL}
        </span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {role && (
          <span
            style={{
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: role === "buyer" ? "var(--purple)" : "var(--amber)",
              border: `1px solid ${
                role === "buyer" ? "var(--purple)" : "var(--amber)"
              }`,
              padding: "4px 10px",
            }}
          >
            {role} view
          </span>
        )}
        <WalletMultiButton />
      </div>
    </header>
  );
};
