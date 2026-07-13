import { FC, useEffect, useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js";
import { Header } from "../components/Header";
import { StepTracker } from "../components/StepTracker";
import { StatCard } from "../components/StatCard";
import { ActionCard } from "../components/ActionCard";
import { TxLog, TxLogEntry } from "../components/TxLog";
import { useEscrow } from "../hooks/useEscrow";
import { useCountdown } from "../hooks/useCountdown";
import { EscrowState } from "../lib/escrowAccount";
import { getVaultPda } from "../lib/pda";
import { buildDepositNftIx, buildExecuteTradeIx } from "../lib/instructions";
import { resolveAta } from "../lib/ata";

const STORAGE_KEY = "letsdeal:seller:escrows";

export const SellerDashboard: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [escrowAddress, setEscrowAddress] = useState<string | null>(null);
  const [pasteInput, setPasteInput] = useState("");
  const [vaultBalance, setVaultBalance] = useState<number | null>(null);
  const [logs, setLogs] = useState<TxLogEntry[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  const { escrow, error, refresh } = useEscrow(escrowAddress);
  const countdown = useCountdown(escrow ? escrow.deadline.toNumber() : null);

  const [savedEscrows, setSavedEscrows] = useState<string[]>([]);
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setSavedEscrows(JSON.parse(raw));
  }, []);

  const saveEscrow = (addr: string) => {
    const next = Array.from(new Set([addr, ...savedEscrows])).slice(0, 10);
    setSavedEscrows(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  useEffect(() => {
    if (!escrow) {
      setVaultBalance(null);
      return;
    }
    const [vault] = getVaultPda(escrow.address);
    connection.getBalance(vault).then(setVaultBalance).catch(() => {});
  }, [escrow, connection]);

  const pushLog = (entry: TxLogEntry) =>
    setLogs((l) => [entry, ...l].slice(0, 8));

  const updateLog = (id: string, patch: Partial<TxLogEntry>) =>
    setLogs((l) => l.map((e) => (e.id === id ? { ...e, ...patch } : e)));

  async function runTx(label: string, build: () => Promise<Transaction>) {
    if (!publicKey) return;
    const id = crypto.randomUUID();
    pushLog({ id, label, status: "pending" });
    try {
      const tx = await build();
      const sig = await sendTransaction(tx, connection);
      await connection.confirmTransaction(sig, "confirmed");
      updateLog(id, { status: "confirmed", sig });
      refresh();
    } catch (e) {
      updateLog(id, {
        status: "error",
        error: e instanceof Error ? e.message : "transaction failed",
      });
    } finally {
      setBusy(null);
    }
  }

  function loadEscrow() {
    const addr = pasteInput.trim();
    if (addr.length < 32) return;
    setEscrowAddress(addr);
    saveEscrow(addr);
  }

  async function depositNft() {
    if (!publicKey || !escrow) return;
    setBusy("deposit-nft");
    await runTx("deposit nft", async () => {
      const [vault] = getVaultPda(escrow.address);
      const tx = new Transaction();

      const sellerAta = await resolveAta(
        connection,
        publicKey,
        publicKey,
        escrow.nftMint
      );
      if (sellerAta.createIx) tx.add(sellerAta.createIx);

      const vaultAta = await resolveAta(
        connection,
        publicKey,
        vault,
        escrow.nftMint,
        true
      );
      if (vaultAta.createIx) tx.add(vaultAta.createIx);

      tx.add(
        buildDepositNftIx({
          escrow: escrow.address,
          seller: publicKey,
          sellerNftAccount: sellerAta.address,
          vaultNftAccount: vaultAta.address,
        })
      );
      tx.feePayer = publicKey;
      return tx;
    });
  }

  async function executeTrade() {
    if (!publicKey || !escrow) return;
    setBusy("execute");
    await runTx("execute trade", async () => {
      const [vault] = getVaultPda(escrow.address);
      const tx = new Transaction();

      const vaultAta = await resolveAta(
        connection,
        publicKey,
        vault,
        escrow.nftMint,
        true
      );
      if (vaultAta.createIx) tx.add(vaultAta.createIx);

      const buyerAta = await resolveAta(
        connection,
        publicKey,
        escrow.buyer,
        escrow.nftMint
      );
      if (buyerAta.createIx) tx.add(buyerAta.createIx);

      tx.add(
        buildExecuteTradeIx({
          escrow: escrow.address,
          seller: publicKey,
          buyer: escrow.buyer,
          vaultNftAccount: vaultAta.address,
          buyerNftAccount: buyerAta.address,
        })
      );
      tx.feePayer = publicKey;
      return tx;
    });
  }

  const isMyDeal = publicKey && escrow && escrow.seller.equals(publicKey);

  return (
    <div style={{ minHeight: "100vh" }}>
      <Header role="seller" />
      <main style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px" }}>
        {!escrow ? (
          <div className="panel" style={{ padding: 20 }}>
            <div className="mono-label" style={{ marginBottom: 12 }}>
              load a deal
            </div>
            <p style={{ fontSize: 12.5, color: "var(--text-dim)", marginTop: 0 }}>
              paste the escrow account address the buyer sent you.
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                className="term-input"
                placeholder="escrow account address"
                value={pasteInput}
                onChange={(e) => setPasteInput(e.target.value)}
              />
              <button
                className="term-btn"
                onClick={loadEscrow}
                disabled={pasteInput.trim().length < 32}
              >
                load
              </button>
            </div>
            {error && (
              <p style={{ color: "var(--red)", fontSize: 12, marginTop: 8 }}>
                {error}
              </p>
            )}
            {savedEscrows.length > 0 && (
              <div style={{ marginTop: 14 }}>
                <div className="mono-label" style={{ marginBottom: 6 }}>
                  recent
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {savedEscrows.map((addr) => (
                    <button
                      key={addr}
                      className="term-btn"
                      style={{ textAlign: "left", fontSize: 11 }}
                      onClick={() => setEscrowAddress(addr)}
                    >
                      {addr}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <button
              className="term-btn"
              style={{ marginBottom: 16, fontSize: 11 }}
              onClick={() => setEscrowAddress(null)}
            >
              &lt; back
            </button>

            <div style={{ marginBottom: 16 }}>
              <StepTracker current={escrow.state} />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 12,
                marginBottom: 20,
              }}
            >
              <StatCard
                label="you receive"
                value={`${(escrow.amount.toNumber() / LAMPORTS_PER_SOL).toFixed(3)} SOL`}
              />
              <StatCard
                label="deadline"
                value={countdown.label}
                accent={countdown.expired ? "var(--red)" : undefined}
              />
              <StatCard
                label="vault balance"
                value={
                  vaultBalance === null
                    ? "..."
                    : `${(vaultBalance / LAMPORTS_PER_SOL).toFixed(3)} SOL`
                }
              />
            </div>

            {!isMyDeal && publicKey && (
              <p style={{ color: "var(--amber)", fontSize: 12, marginBottom: 16 }}>
                connected wallet is not the seller on this escrow — depositing will
                fail on-chain unless you switch wallets.
              </p>
            )}

            {countdown.expired && escrow.state < EscrowState.NftDeposited && (
              <p style={{ color: "var(--red)", fontSize: 12, marginBottom: 16 }}>
                deadline has passed. the buyer can reclaim their sol at any time —
                depositing now may still let you complete the trade if they haven't
                refunded yet, but don't count on it.
              </p>
            )}

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gap: 12,
                marginBottom: 20,
              }}
            >
              <ActionCard
                title="deposit nft"
                description="send the nft into the vault. requires sol already locked by the buyer."
                ready={escrow.state === EscrowState.FundsDeposited && !!isMyDeal}
                buttonLabel="deposit nft"
                loading={busy === "deposit-nft"}
                onClick={depositNft}
              />
              <ActionCard
                title="execute trade"
                description="swap: nft to buyer, sol released to you. either side can trigger this."
                ready={escrow.state === EscrowState.NftDeposited}
                readyLabel="ready"
                buttonLabel="execute"
                loading={busy === "execute"}
                onClick={executeTrade}
              />
            </div>

            <TxLog entries={logs} />
          </>
        )}
      </main>
    </div>
  );
};
