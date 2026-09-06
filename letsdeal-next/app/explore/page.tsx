"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FadeUp from "@/components/FadeUp";
import Link from "next/link";
import { ArrowRight, Search, RefreshCw, ExternalLink } from "lucide-react";
import { CoolVaultIcon, CoolRadarIcon, CoolNftMatrixIcon } from "@/components/CoolIcons";
import { useConnection } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { fetchAllEscrows, EscrowAccount, EscrowState, EscrowStateLabel } from "@/lib/escrowAccount";
import { explorerAddress } from "@/constants";

interface DisplayDeal {
  address: string;
  stateLabel: string;
  stateEnum: EscrowState;
  amountSol: number;
  deadlineUnix: number;
  deadlineDisplay: string;
  mint: string;
  buyer: string;
  seller: string;
  isLive: boolean;
}

const FALLBACK_DEALS: DisplayDeal[] = [
  {
    address: "28dfA6RRoTkD6hBJSvH3bXPKZEr7dHrYJpC6QsvrkzRc",
    stateLabel: "initialized",
    stateEnum: EscrowState.Initialized,
    amountSol: 50.0,
    deadlineUnix: 1788129960,
    deadlineDisplay: "Active",
    mint: "GPrm7LtyimuxwWt9uXfauyKJHmag4rFKTy1KtJSp1vAr",
    buyer: "FefrHtgQsMg8frMJsjKsFSshPJq17tdwxLZ8QUQuHXZt",
    seller: "FefrHtgQsMg8frMJsjKsFSshPJq17tdwxLZ8QUQuHXZt",
    isLive: true,
  },
  {
    address: "9KzT4...DevnetMock",
    stateLabel: "funds deposited",
    stateEnum: EscrowState.FundsDeposited,
    amountSol: 1.5,
    deadlineUnix: Math.floor(Date.now() / 1000) + 3600 * 18,
    deadlineDisplay: "18h left",
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    buyer: "4Tzz6U9xM8pBq2vY5nK3jL7wR1dF8sE9aG0cH2eP4vM1",
    seller: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    isLive: false,
  },
  {
    address: "7BmY2...DevnetMock",
    stateLabel: "nft deposited",
    stateEnum: EscrowState.NftDeposited,
    amountSol: 0.75,
    deadlineUnix: Math.floor(Date.now() / 1000) + 3600 * 6,
    deadlineDisplay: "6h left",
    mint: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263",
    buyer: "4Tzz6U9xM8pBq2vY5nK3jL7wR1dF8sE9aG0cH2eP4vM1",
    seller: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
    isLive: false,
  },
  {
    address: "3NxW9...DevnetMock",
    stateLabel: "completed",
    stateEnum: EscrowState.Completed,
    amountSol: 2.25,
    deadlineUnix: Math.floor(Date.now() / 1000) - 3600 * 2,
    deadlineDisplay: "Settled",
    mint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    buyer: "FefrHtgQsMg8frMJsjKsFSshPJq17tdwxLZ8QUQuHXZt",
    seller: "4Tzz6U9xM8pBq2vY5nK3jL7wR1dF8sE9aG0cH2eP4vM1",
    isLive: false,
  },
];

const stateColor: Record<EscrowState, string> = {
  [EscrowState.Initialized]: "#3ECBFF",
  [EscrowState.FundsDeposited]: "#F5C842",
  [EscrowState.NftDeposited]: "#818CF8",
  [EscrowState.Completed]: "#34D399",
  [EscrowState.Refunded]: "#F87171",
};

export default function ExplorePage() {
  const { connection } = useConnection();
  const [liveDeals, setLiveDeals] = useState<DisplayDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");

  const loadOnChainEscrows = useCallback(async () => {
    setLoading(true);
    try {
      const escrows: EscrowAccount[] = await fetchAllEscrows(connection);

      if (escrows.length > 0) {
        const formatted: DisplayDeal[] = escrows.map((e) => {
          const now = Math.floor(Date.now() / 1000);
          const deadline = e.deadline.toNumber();
          const diffHours = Math.round((deadline - now) / 3600);

          let deadlineDisplay = "Active";
          if (e.state === EscrowState.Completed) {
            deadlineDisplay = "Settled";
          } else if (e.state === EscrowState.Refunded) {
            deadlineDisplay = "Refunded";
          } else if (diffHours <= 0) {
            deadlineDisplay = "Expired";
          } else {
            deadlineDisplay = `${diffHours}h left`;
          }

          return {
            address: e.address.toBase58(),
            stateLabel: EscrowStateLabel[e.state],
            stateEnum: e.state,
            amountSol: e.amount.toNumber() / LAMPORTS_PER_SOL,
            deadlineUnix: deadline,
            deadlineDisplay,
            mint: e.nftMint.toBase58(),
            buyer: e.buyer.toBase58(),
            seller: e.seller.toBase58(),
            isLive: true,
          };
        });

        // Combine live with mocks for richer discovery showcase
        const liveAddrs = new Set(formatted.map((f) => f.address));
        const combined = [...formatted, ...FALLBACK_DEALS.filter((d) => !liveAddrs.has(d.address))];
        setLiveDeals(combined);
      } else {
        setLiveDeals(FALLBACK_DEALS);
      }
    } catch (err) {
      console.warn("Could not fetch on-chain escrows, using fallback preset:", err);
      setLiveDeals(FALLBACK_DEALS);
    } finally {
      setLoading(false);
    }
  }, [connection]);

  useEffect(() => {
    loadOnChainEscrows();
  }, [loadOnChainEscrows]);

  const filteredDeals = useMemo(() => {
    return liveDeals.filter((deal) => {
      const matchSearch =
        !search ||
        deal.address.toLowerCase().includes(search.toLowerCase()) ||
        deal.mint.toLowerCase().includes(search.toLowerCase());

      if (!matchSearch) return false;

      if (selectedFilter === "All") return true;
      if (selectedFilter === "Active") {
        return (
          deal.stateEnum === EscrowState.Initialized ||
          deal.stateEnum === EscrowState.FundsDeposited ||
          deal.stateEnum === EscrowState.NftDeposited
        );
      }
      if (selectedFilter === "Completed") return deal.stateEnum === EscrowState.Completed;
      if (selectedFilter === "Refunded") return deal.stateEnum === EscrowState.Refunded;
      return true;
    });
  }, [liveDeals, search, selectedFilter]);

  const totalVolume = useMemo(() => {
    return liveDeals.reduce((sum, d) => sum + d.amountSol, 0);
  }, [liveDeals]);

  return (
    <div className="bg-subpage" style={{ minHeight: "100vh" }}>
      <Navbar />

      {/* Hero */}
      <section
        style={{
          maxWidth: 1360,
          margin: "0 auto",
          padding: "60px clamp(24px, 5vw, 64px) 36px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* Subtle background glow aura */}
        <div
          style={{
            position: "absolute",
            top: "24%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 440,
            height: 280,
            background: "radial-gradient(circle, rgba(0, 163, 255, 0.2) 0%, transparent 70%)",
            filter: "blur(50px)",
            pointerEvents: "none",
          }}
        />

        <FadeUp>
          <div style={{ textAlign: "center" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <span
                style={{
                  background: "rgba(20, 241, 149, 0.12)",
                  border: "1px solid rgba(20, 241, 149, 0.3)",
                  color: "#14F195",
                  fontSize: 11,
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: 9999,
                  fontFamily: "monospace",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <CoolRadarIcon size={14} />
                SOLANA DEVNET EXPLORER
              </span>
              <span
                style={{
                  fontSize: 11,
                  color: "#9945FF",
                  letterSpacing: "0.08em",
                  fontFamily: "monospace",
                  background: "rgba(153, 69, 255, 0.1)",
                  padding: "4px 10px",
                  borderRadius: 9999,
                  border: "1px solid rgba(153, 69, 255, 0.2)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <CoolVaultIcon size={14} />
                121B STATE
              </span>
            </div>
            <h1 style={{ fontSize: "clamp(34px, 4.2vw, 54px)", fontWeight: 700, letterSpacing: "-0.035em", lineHeight: 1.05, color: "#FFFFFF", margin: 0 }}>
              Live on-chain escrows.
              <br />
              <span className="font-light text-solana-gradient">Verified on Solana.</span>
            </h1>
            <p style={{ fontSize: 14.5, fontWeight: 350, color: "#8BA3C7", lineHeight: 1.6, maxWidth: 520, margin: "16px auto 0" }}>
              Explore real-time cryptographic escrow accounts deployed under the LetsDeal program on Solana Devnet.
            </p>
          </div>
        </FadeUp>

        {/* Stats Row */}
        <div
          style={{
            display: "flex",
            gap: 12,
            marginTop: 28,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
          className="w-full"
        >
          <div className="panel-glass flex-1 min-w-[130px]" style={{ padding: "10px 16px", textAlign: "center" }}>
            <span className="stat-label">Tracked</span>
            <span className="stat-value" style={{ fontSize: 18 }}>{liveDeals.length}</span>
          </div>
          <div className="panel-glass flex-1 min-w-[130px]" style={{ padding: "10px 16px", textAlign: "center" }}>
            <span className="stat-label">Total Volume</span>
            <span className="stat-value" style={{ fontSize: 18, color: "#14F195" }}>
              {totalVolume.toFixed(2)} SOL
            </span>
          </div>
          <div className="panel-glass flex-1 min-w-[130px]" style={{ padding: "10px 16px", textAlign: "center" }}>
            <span className="stat-label">Execution</span>
            <span className="stat-value" style={{ fontSize: 18, color: "#3ECBFF" }}>PDA Vaults</span>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <div style={{ maxWidth: 1360, margin: "0 auto", padding: "0 clamp(16px, 4vw, 64px) 28px" }}>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <div
            className="panel-glass"
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", flex: 1, minWidth: 260 }}
          >
            <Search size={14} strokeWidth={1.5} color="#8BA3C7" />
            <input
              placeholder="Search by escrow or asset address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: "none",
                border: "none",
                outline: "none",
                color: "#FFFFFF",
                fontSize: 13,
                width: "100%",
                fontWeight: 350,
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{ background: "none", border: "none", color: "#8BA3C7", cursor: "pointer", fontSize: 12 }}
              >
                ✕
              </button>
            )}
          </div>

          {["All", "Active", "Completed", "Refunded"].map((f) => (
            <button
              key={f}
              onClick={() => setSelectedFilter(f)}
              className={selectedFilter === f ? "btn-solana-primary" : "btn-solana-secondary"}
              style={{
                fontSize: 12,
                padding: selectedFilter === f ? "6px 14px" : "6px 16px",
                height: 36,
                cursor: "pointer",
              }}
            >
              {f}
            </button>
          ))}

          <button
            onClick={loadOnChainEscrows}
            className="btn-pill-glass"
            style={{ fontSize: 11, padding: "8px 14px", display: "flex", alignItems: "center", gap: 6 }}
            title="Refresh from Solana Devnet"
          >
            <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
            Sync RPC
          </button>
        </div>
      </div>

      {/* Deals Grid */}
      <section style={{ maxWidth: 1360, margin: "0 auto", padding: "0 clamp(16px, 4vw, 64px) 120px" }}>
        {loading && liveDeals.length === 0 ? (
          <div className="panel-glass" style={{ padding: 60, textAlign: "center" }}>
            <RefreshCw className="animate-spin" size={28} color="#3ECBFF" style={{ margin: "0 auto 16px" }} />
            <div style={{ fontSize: 15, color: "#FFFFFF" }}>Connecting to Solana Devnet...</div>
            <div style={{ fontSize: 13, color: "#8BA3C7", marginTop: 4 }}>
              Querying program accounts with 121-byte escrow structure
            </div>
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="panel-glass" style={{ padding: 60, textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
              <CoolVaultIcon size={40} />
            </div>
            <div style={{ fontSize: 15, color: "#FFFFFF" }}>No escrows match your search.</div>
            <div style={{ fontSize: 13, color: "#8BA3C7", marginTop: 6 }}>
              Try searching for a different address or reset the filter.
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
              gap: 16,
            }}
          >
            {filteredDeals.map((deal, i) => (
              <FadeUp key={deal.address} delay={i * 0.04}>
                <div
                  className="panel-glass"
                  style={{
                    padding: 26,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                  }}
                >
                  <div>
                    {/* Top Row: Address + State Pill */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 18,
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontFamily: "monospace", fontSize: 12, color: "#FFFFFF", fontWeight: 450 }}>
                          {deal.address.slice(0, 6)}…{deal.address.slice(-6)}
                        </span>
                        {deal.isLive && (
                          <span
                            style={{
                              fontSize: 9,
                              background: "rgba(52, 211, 153, 0.15)",
                              color: "#34D399",
                              padding: "2px 6px",
                              borderRadius: 4,
                              fontFamily: "monospace",
                              fontWeight: 600,
                            }}
                          >
                            ON-CHAIN
                          </span>
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: 10.5,
                          fontWeight: 500,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: stateColor[deal.stateEnum] || "#8BA3C7",
                          background: `${stateColor[deal.stateEnum] || "#8BA3C7"}15`,
                          padding: "3px 8px",
                          borderRadius: 9999,
                          border: `1px solid ${stateColor[deal.stateEnum] || "#8BA3C7"}40`,
                        }}
                      >
                        {deal.stateLabel}
                      </span>
                    </div>

                    {/* Stats Grid */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: 12,
                        marginBottom: 18,
                      }}
                    >
                      <div className="stat-block">
                        <span className="stat-label" style={{ display: "flex", alignItems: "center", gap: 5 }}>
                          <CoolVaultIcon size={13} />
                          Agreed Amount
                        </span>
                        <span className="stat-value" style={{ color: "#14F195" }}>
                          {deal.amountSol.toFixed(2)} SOL
                        </span>
                      </div>
                      <div className="stat-block">
                        <span className="stat-label">Deadline</span>
                        <span
                          className="stat-value"
                          style={{
                            color: deal.deadlineDisplay.includes("left") ? "#F5C842" : "#FFFFFF",
                          }}
                        >
                          {deal.deadlineDisplay}
                        </span>
                      </div>
                    </div>

                    {/* Mint & Parties */}
                    <div
                      style={{
                        fontFamily: "monospace",
                        fontSize: 11,
                        color: "#8BA3C7",
                        marginBottom: 20,
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                      }}
                    >
                      <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", display: "flex", alignItems: "center", gap: 5 }}>
                        <CoolNftMatrixIcon size={13} />
                        Asset: <span style={{ color: "#FFFFFF" }}>{deal.mint}</span>
                      </div>
                      <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        Buyer: <span style={{ color: "#FFFFFF" }}>{deal.buyer}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 10 }}>
                    <Link
                      href={`/vault?escrow=${deal.address}`}
                      className="btn-solana-primary"
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        fontSize: 12,
                        padding: "8px 14px",
                      }}
                    >
                      <span>MANAGE IN VAULT</span>
                      <ArrowRight size={13} />
                    </Link>
                    <a
                      href={explorerAddress(deal.address)}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-pill-glass"
                      style={{ padding: "8px 12px" }}
                      title="View on Solana Explorer"
                    >
                      <ExternalLink size={13} />
                    </a>
                  </div>
                </div>
              </FadeUp>
            ))}
          </div>
        )}
      </section>

      <div className="divider" style={{ maxWidth: 1360, margin: "0 auto", padding: "0 clamp(24px, 5vw, 64px)" }} />
      <Footer />
    </div>
  );
}
