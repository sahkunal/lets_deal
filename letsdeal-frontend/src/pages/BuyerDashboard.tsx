import { FC, useEffect, useMemo, useState } from "react";
import {
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import BN from "bn.js";
import { Header } from "../components/Header";
import { StepTracker } from "../components/StepTracker";
import { StatCard } from "../components/StatCard";
import { ActionCard } from "../components/ActionCard";
import { TxLog, TxLogEntry } from "../components/TxLog";
import { CopyField } from "../components/CopyField";
import { useEscrow } from "../hooks/useEscrow";
import { useCountdown } from "../hooks/useCountdown";
import { EscrowState } from "../lib/escrowAccount";
import { getVaultPda } from "../lib/pda";
import {
  buildInitializeIx,
  buildDepositFundsIx,
  buildExecuteTradeIx,
  buildRefundIx,
} from "../lib/instructions";
import { resolveAta } from "../lib/ata";

const STORAGE_KEY = "letsdeal:buyer:escrows";

export const BuyerDashboard: FC = () => {
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

  // --- create new deal form state ---
  const [sellerInput, setSellerInput] = useState("");
  const [amountInput, setAmountInput] = useState("1");
  const [hoursInput, setHoursInput] = useState("24");
  const [mintInput, setMintInput] = useState("");

  const canCreate =
    publicKey && sellerInput.length > 30 && mintInput.length > 30 && +amountInput > 0;

  async function createDeal() {
    if (!publicKey || !canCreate) return;
    setBusy("create");
    const escrowKeypair = Keypair.generate();
    const seller = new PublicKey(sellerInput.trim());
    const nftMint = new PublicKey(mintInput.trim());
    const amountLamports = new BN(Math.round(+amountInput * LAMPORTS_PER_SOL));
    const deadline = new BN(
      Math.floor(Date.now() / 1000) + Math.round(+hoursInput * 3600)
    );

    await runTx("initialize escrow", async () => {
      const ix = buildInitializeIx({
        escrow: escrowKeypair.publicKey,
        buyer: publicKey,
        seller,
        amount: amountLamports,
        deadline,
        nftMint,
      });
      const tx = new Transaction().add(ix);
      tx.feePayer = publicKey;
      tx.partialSign(escrowKeypair);
      return tx;
    });

    setEscrowAddress(escrowKeypair.publicKey.toBase58());
    saveEscrow(escrowKeypair.publicKey.toBase58());
  }

  async function depositFunds() {
    if (!publicKey || !escrow) return;
    setBusy("deposit");
    await runTx("deposit sol", async () => {
      const ix = buildDepositFundsIx({ escrow: escrow.address, buyer: publicKey });
      const tx = new Transaction().add(ix);
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
        publicKey,
        escrow.nftMint
      );
      if (buyerAta.createIx) tx.add(buyerAta.createIx);

      tx.add(
        buildExecuteTradeIx({
          escrow: escrow.address,
          seller: escrow.seller,
          buyer: publicKey,
          vaultNftAccount: vaultAta.address,
          buyerNftAccount: buyerAta.address,
        })
      );
      tx.feePayer = publicKey;
      return tx;
    });
  }

  async function claimRefund() {
    if (!publicKey || !escrow) return;
    setBusy("refund");
    await runTx("refund", async () => {
      const ix = buildRefundIx({ escrow: escrow.address, buyer: publicKey });
      const tx = new Transaction().add(ix);
      tx.feePayer = publicKey;
      return tx;
    });
  }

  const isMyDeal = publicKey && escrow && escrow.buyer.equals(publicKey);

  return (
    <div style={{ minHeight: "100vh" }}>
      <Header role="buyer" />
      <main style={{ maxWidth: 860, margin: "0 auto", padding: "32px 24px" }}>
        {!escrow ? (
          <>
            <div className="panel" style={{ padding: 20, marginBottom: 20 }}>
              <div className="mono-label" style={{ marginBottom: 12 }}>
                load existing deal
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  className="term-input"
                  placeholder="escrow account address"
                  value={pasteInput}
                  onChange={(e) => setPasteInput(e.target.value)}
                />
                <button
                  className="term-btn"
                  onClick={() => setEscrowAddress(pasteInput.trim())}
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

            <div className="panel" style={{ padding: 20 }}>
              <div className="mono-label" style={{ marginBottom: 12 }}>
                or start a new deal
              </div>
              <div style={{ display: "grid", gap: 14 }}>
                <div>
                  <div className="mono-label" style={{ marginBottom: 6 }}>
                    seller wallet address
                  </div>
                  <input
                    className="term-input"
                    placeholder="seller's public key"
                    value={sellerInput}
                    onChange={(e) => setSellerInput(e.target.value)}
                  />
                </div>
                <div>
                  <div className="mono-label" style={{ marginBottom: 6 }}>
                    nft mint address
                  </div>
                  <input
                    className="term-input"
                    placeholder="mint of the NFT you're buying"
                    value={mintInput}
                    onChange={(e) => setMintInput(e.target.value)}
                  />
                </div>
                <div style={{ display: "flex", gap: 14 }}>
                  <div style={{ flex: 1 }}>
                    <div className="mono-label" style={{ marginBottom: 6 }}>
                      amount (sol)
                    </div>
                    <input
                      className="term-input"
                      type="number"
                      min="0"
                      step="0.01"
                      value={amountInput}
                      onChange={(e) => setAmountInput(e.target.value)}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="mono-label" style={{ marginBottom: 6 }}>
                      deadline (hours from now)
                    </div>
                    <input
                      className="term-input"
                      type="number"
                      min="0.01"
                      step="1"
                      value={hoursInput}
                      onChange={(e) => setHoursInput(e.target.value)}
                    />
                  </div>
                </div>
                <button
                  className="term-btn primary"
                  disabled={!canCreate || busy === "create"}
                  onClick={createDeal}
                >
                  {busy === "create" ? "confirming..." : "create escrow >"}
                </button>
                {!publicKey && (
                  <p style={{ fontSize: 11.5, color: "var(--text-dim)", margin: 0 }}>
                    connect a wallet to create a deal.
                  </p>
                )}
              </div>
            </div>
          </>
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
                label="escrow amount"
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

            <div style={{ marginBottom: 20 }}>
              <CopyField label="share with seller" value={escrow.address.toBase58()} />
            </div>

            {!isMyDeal && publicKey && (
              <p style={{ color: "var(--amber)", fontSize: 12, marginBottom: 16 }}>
                connected wallet is not the buyer on this escrow — actions below will
                fail on-chain unless you switch wallets.
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
                title="deposit sol"
                description="lock the agreed amount into the vault pda."
                ready={escrow.state === EscrowState.Initialized && !!isMyDeal}
                buttonLabel="deposit funds"
                loading={busy === "deposit"}
                onClick={depositFunds}
              />
              <ActionCard
                title="execute trade"
                description="swap: nft to buyer, sol to seller. runs once both sides have deposited."
                ready={escrow.state === EscrowState.NftDeposited}
                readyLabel="ready"
                buttonLabel="execute"
                loading={busy === "execute"}
                onClick={executeTrade}
              />
              <ActionCard
                title="waiting on seller"
                description="seller deposits the nft from their dashboard once sol is locked."
                ready={false}
                buttonLabel="n/a"
                onClick={() => {}}
              />
              <ActionCard
                title="refund"
                description="reclaim your sol if the deadline passes before the nft arrives."
                ready={
                  countdown.expired &&
                  escrow.state !== EscrowState.Completed &&
                  escrow.state !== EscrowState.Refunded &&
                  !!isMyDeal
                }
                readyLabel="available"
                danger
                buttonLabel="claim refund"
                loading={busy === "refund"}
                onClick={claimRefund}
              />
            </div>

            <TxLog entries={logs} />
          </>
        )}
      </main>
    </div>
  );
};
