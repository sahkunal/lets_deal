import React, { FC, useEffect, useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js';
import { 
  ArrowRightLeft, 
  ArrowLeft, 
  RefreshCw, 
  ShieldCheck, 
  Coins, 
  Clock, 
  Layers, 
  AlertCircle, 
  Search,
  CheckCircle2
} from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { StepTracker } from '../components/StepTracker';
import { StatCard } from '../components/StatCard';
import { ActionCard } from '../components/ActionCard';
import { TxLog, TxLogEntry } from '../components/TxLog';
import { CopyField } from '../components/CopyField';
import { useEscrow } from '../hooks/useEscrow';
import { useCountdown } from '../hooks/useCountdown';
import { EscrowState } from '../lib/escrowAccount';
import { getVaultPda } from '../lib/pda';
import { buildDepositNftIx, buildExecuteTradeIx } from '../lib/instructions';
import { resolveAta } from '../lib/ata';

const STORAGE_KEY = 'letsdeal:seller:escrows';

export const SellerDashboard: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const [escrowAddress, setEscrowAddress] = useState<string | null>(null);
  const [pasteInput, setPasteInput] = useState('');
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
    const next = Array.from(new Set([addr, ...savedEscrows])).slice(0, 8);
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
    pushLog({ id, label, status: 'pending' });
    try {
      const tx = await build();
      const sig = await sendTransaction(tx, connection);
      await connection.confirmTransaction(sig, 'confirmed');
      updateLog(id, { status: 'confirmed', sig });
      refresh();
    } catch (e) {
      updateLog(id, {
        status: 'error',
        error: e instanceof Error ? e.message : 'transaction failed',
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
    setBusy('deposit-nft');
    await runTx('Deposit NFT to Vault ATA', async () => {
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
    setBusy('execute');
    await runTx('Execute Atomic Trade Settlement', async () => {
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
    <div className="min-h-screen bg-[#0A0C10] text-[#F8FAFC] selection:bg-emerald-500/20 selection:text-emerald-400">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8">
        
        {/* Top Breadcrumb & Status */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-display text-white">
                Seller Escrow Portal
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                Inspect deal terms, deposit NFT collateral into Vault, and claim SOL.
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 font-mono text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>SOL LOCKED IN PDA VERIFIED</span>
          </div>
        </div>

        {!escrow ? (
          <div className="max-w-xl mx-auto space-y-6">
            
            {/* Load Deal Card */}
            <div className="bg-[#12161F]/90 border border-white/[0.1] rounded-3xl p-8 backdrop-blur-2xl shadow-2xl space-y-6">
              <div>
                <h2 className="text-lg font-bold font-display text-white">
                  Load an Escrow Deal
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Paste the Escrow Public Key shared by the buyer.
                </p>
              </div>

              <div className="space-y-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="e.g. 7Xkp...EscrowAccountAddress"
                    value={pasteInput}
                    onChange={(e) => setPasteInput(e.target.value)}
                    className="w-full bg-[#0E121A] border border-white/[0.1] rounded-xl pl-10 pr-4 py-3 text-xs font-mono text-slate-100 placeholder-slate-500 outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20"
                  />
                </div>

                <button
                  onClick={loadEscrow}
                  disabled={pasteInput.trim().length < 32}
                  className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-display font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-40 disabled:pointer-events-none shadow-lg shadow-purple-900/30 cursor-pointer"
                >
                  Fetch Escrow On-Chain →
                </button>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                    {error}
                  </div>
                )}
              </div>
            </div>

            {/* Saved Recent Deals */}
            {savedEscrows.length > 0 && (
              <div className="bg-[#12161F]/90 border border-white/[0.1] rounded-3xl p-6 backdrop-blur-2xl shadow-xl space-y-3">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  RECENT SELLER DEALS
                </h3>

                <div className="space-y-2">
                  {savedEscrows.map((addr) => (
                    <button
                      key={addr}
                      onClick={() => setEscrowAddress(addr)}
                      className="w-full text-left p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] text-xs font-mono text-slate-300 hover:text-purple-400 transition-colors flex items-center justify-between truncate"
                    >
                      <span className="truncate">{addr}</span>
                      <span className="text-[10px] text-slate-500 ml-2">Open →</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        ) : (
          /* ACTIVE LOADED DEAL FOR SELLER */
          <div className="space-y-6">
            
            {/* Back Button & Refresh */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setEscrowAddress(null)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.08] text-xs font-mono transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Search</span>
              </button>

              <button
                onClick={refresh}
                className="flex items-center gap-1.5 text-xs font-mono text-purple-400 hover:underline"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh On-Chain State</span>
              </button>
            </div>

            {/* Step Pipeline Tracker */}
            <StepTracker current={escrow.state} />

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                label="YOU RECEIVE"
                value={`${(escrow.amount.toNumber() / LAMPORTS_PER_SOL).toFixed(3)} SOL`}
                icon={Coins}
                accent="text-emerald-400"
              />

              <StatCard
                label="DEADLINE COUNTDOWN"
                value={countdown.label}
                subValue={countdown.expired ? 'Timeout Expired' : 'Deposit NFT before deadline'}
                icon={Clock}
                accent={countdown.expired ? 'text-rose-400' : 'text-slate-100'}
              />

              <StatCard
                label="SOL IN VAULT PDA"
                value={
                  vaultBalance === null
                    ? 'Fetching...'
                    : `${(vaultBalance / LAMPORTS_PER_SOL).toFixed(3)} SOL`
                }
                subValue="Locked by Buyer"
                icon={Layers}
                accent="text-cyan-400"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CopyField label="NFT MINT REQUIRED" value={escrow.nftMint.toBase58()} />
              <CopyField label="ESCROW ACCOUNT ADDRESS" value={escrow.address.toBase58()} />
            </div>

            {!isMyDeal && publicKey && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  Connected wallet is not the recorded Seller on this deal. Switch wallets to authorize the NFT deposit.
                </span>
              </div>
            )}

            {countdown.expired && escrow.state < EscrowState.NftDeposited && (
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  The deadline has expired. The buyer can reclaim their SOL at any time.
                </span>
              </div>
            )}

            {/* Action Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ActionCard
                title="1. Deposit NFT into Vault"
                description="Transfer 1 token of the required NFT mint into the Vault ATA. Requires SOL already locked."
                ready={escrow.state === EscrowState.FundsDeposited && !!isMyDeal}
                buttonLabel="Deposit NFT"
                loading={busy === 'deposit-nft'}
                onClick={depositNft}
              />

              <ActionCard
                title="2. Execute Trade (Claim SOL)"
                description="Finalize swap: releases the locked SOL directly to your wallet and delivers the NFT to the Buyer."
                ready={escrow.state === EscrowState.NftDeposited}
                readyLabel="Ready to Claim"
                buttonLabel="Execute & Claim SOL"
                loading={busy === 'execute'}
                onClick={executeTrade}
              />
            </div>

            {/* Transaction Logs */}
            <TxLog entries={logs} />

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
};
