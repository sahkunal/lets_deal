import { FC } from "react";
import { Link } from "react-router-dom";
import { Header } from "../components/Header";
import { PROGRAM_ID, CLUSTER_LABEL } from "../constants";

export const RoleSelect: FC = () => {
  return (
    <div style={{ minHeight: "100vh" }}>
      <Header />
      <main
        style={{
          maxWidth: 720,
          margin: "0 auto",
          padding: "72px 24px",
        }}
      >
        <p className="mono-label" style={{ marginBottom: 8 }}>
          trustless escrow · {CLUSTER_LABEL}
        </p>
        <h1
          style={{
            fontSize: 32,
            lineHeight: 1.3,
            margin: "0 0 12px",
            fontWeight: 700,
          }}
        >
          NFT ⇄ SOL, settled by a{" "}
          <span style={{ color: "var(--green)" }}>program</span>, not a
          promise.
        </h1>
        <p
          style={{
            color: "var(--text-dim)",
            fontSize: 14,
            lineHeight: 1.7,
            maxWidth: 560,
          }}
        >
          Funds and the NFT sit in a program-owned vault until both sides
          deliver. No custodian, no chat-app trust exercise. If the seller
          never shows up, the buyer reclaims everything after the deadline.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
            marginTop: 40,
          }}
        >
          <Link to="/buyer" style={{ textDecoration: "none" }}>
            <div
              className="panel"
              style={{
                padding: "24px",
                height: "100%",
                borderColor: "var(--line)",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "var(--purple)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 10,
                }}
              >
                buyer
              </div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
                start a new deal &gt;
              </div>
              <p style={{ fontSize: 12.5, color: "var(--text-dim)", margin: 0 }}>
                Lock up SOL, set a deadline, wait for the NFT to land, then
                execute the swap.
              </p>
            </div>
          </Link>

          <Link to="/seller" style={{ textDecoration: "none" }}>
            <div
              className="panel"
              style={{
                padding: "24px",
                height: "100%",
                borderColor: "var(--line)",
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  color: "var(--amber)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 10,
                }}
              >
                seller
              </div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>
                fulfil a deal &gt;
              </div>
              <p style={{ fontSize: 12.5, color: "var(--text-dim)", margin: 0 }}>
                Paste in the escrow address a buyer sent you, deposit the
                NFT once funds are locked.
              </p>
            </div>
          </Link>
        </div>

        <p
          style={{
            marginTop: 48,
            fontSize: 11,
            color: "var(--text-faint)",
            wordBreak: "break-all",
          }}
        >
          program: {PROGRAM_ID.toBase58()}
        </p>
      </main>
    </div>
  );
};
