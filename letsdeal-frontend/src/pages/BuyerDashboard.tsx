import React, { FC, useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
} from '@solana/web3.js';
import BN from 'bn.js';
import { 
  ArrowRightLeft, 
  Send, 
  Clock, 
  Sparkles, 
  Layers, 
  AlertCircle, 
  ArrowLeft, 
  ShieldCheck, 
  RefreshCw,
  Coins
} from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { StepTracker } from '../components/StepTracker';
import { StatCard } from '../components/StatCard';
import { ActionCard } from '../components/ActionCard';
import { TxLog, TxLogEntry } from '../components/TxLog';
import { CopyField } from '../components/CopyField';
import { VirtualEscrowCard } from '../components/VirtualEscrowCard';
import { useEscrow } from '../hooks/useEscrow';
import { useCountdown } from '../hooks/useCountdown';
import { EscrowState } from '../lib/escrowAccount';
import { getVaultPda } from '../lib/pda';
import {
  buildInitializeIx,
  buildDepositFundsIx,
  buildExecuteTradeIx,
  buildRefundIx,
} from '../lib/instructions';
import { resolveAta } from '../lib/ata';

const STORAGE_KEY = 'letsdeal:buyer:escrows';

export const BuyerDashboard: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [searchParams] = useSearchParams();

  const [escrowAddress, setEscrowAddress] = useState<string | null>(() => {
    return searchParams.get('escrow') || null;
  });
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

  // --- Create New Deal Form State ---
  const [sellerInput, setSellerInput] = useState('');
  const [amountInput, setAmountInput] = useState('0.5');
  const [hoursInput, setHoursInput] = useState('24');
  const [mintInput, setMintInput] = useState('');

  const canCreate =
    publicKey && sellerInput.length > 30 && mintInput.length > 30 && +amountInput > 0;

  // Preset Auto-Fill for effortless testing
  const handleQuickPreset = () => {
    setSellerInput('4Tzz6U9xM8pBq2vY5nK3jL7wR1dF8sE9aG0cH2eP4vM1');
    setMintInput('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
    setAmountInput('0.25');
    setHoursInput('2');
  };

  async function createDeal() {
    if (!publicKey || !canCreate) return;
    setBusy('create');
    const escrowKeypair = Keypair.generate();
    const seller = new PublicKey(sellerInput.trim());
    const nftMint = new PublicKey(mintInput.trim());
    const amountLamports = new BN(Math.round(+amountInput * LAMPORTS_PER_SOL));
    const deadline = new BN(
      Math.floor(Date.now() / 1000) + Math.round(+hoursInput * 3600)
    );

    await runTx('Initialize Escrow On-Chain', async () => {
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

    const newAddr = escrowKeypair.publicKey.toBase58();
    setEscrowAddress(newAddr);
    saveEscrow(newAddr);
  }

  async function depositFunds() {
    if (!publicKey || !escrow) return;
    setBusy('deposit');
    await runTx('Deposit SOL to Vault PDA', async () => {
      const ix = buildDepositFundsIx({ escrow: escrow.address, buyer: publicKey });
      const tx = new Transaction().add(ix);
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
    setBusy('refund');
    await runTx('Claim Timeout SOL Refund', async () => {
      const ix = buildRefundIx({ escrow: escrow.address, buyer: publicKey });
      const tx = new Transaction().add(ix);
      tx.feePayer = publicKey;
      return tx;
    });
  }

  const isMyDeal = publicKey && escrow && escrow.buyer.equals(publicKey);

  return (
    <div className="min-h-screen bg-[#0A0C10] text-[#F8FAFC] selection:bg-emerald-500/20 selection:text-emerald-400">
      <Header />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 space-y-8">
        
        {/* Top Breadcrumb & Status */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <ArrowRightLeft className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold font-display text-white">
                Buyer Escrow Portal
              </h1>
              <p className="text-xs text-slate-400 font-mono">
                Deploy terms, lock SOL in Vault PDA, and settle trades atomically.
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs">
            <ShieldCheck className="w-4 h-4" />
            <span>NON-CUSTODIAL GUARANTEE</span>
          </div>
        </div>

        {!escrow ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Create New Deal Form (7 cols) */}
            <div className="lg:col-span-7 bg-[#12161F]/90 border border-white/[0.1] rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold font-display text-white">
                    Start a New Escrow Deal
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Define swap terms, lock price, and set timeout duration.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleQuickPreset}
                  className="text-xs font-mono text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Fill Sample Data</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">
                    SELLER WALLET PUBLIC KEY
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 4Tzz...SellerSolanaAddress"
                    value={sellerInput}
                    onChange={(e) => setSellerInput(e.target.value)}
                    className="w-full bg-[#0E121A] border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs font-mono text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-slate-300">
                    NFT MINT ADDRESS (SPL TOKEN)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 8Yx1...NFTMintAddress"
                    value={mintInput}
                    onChange={(e) => setMintInput(e.target.value)}
                    className="w-full bg-[#0E121A] border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs font-mono text-slate-100 placeholder-slate-500 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">
                      AMOUNT (SOL)
                    </label>
                    <input
                      type="number"
                      min="0.001"
                      step="0.1"
                      value={amountInput}
                      onChange={(e) => setAmountInput(e.target.value)}
                      className="w-full bg-[#0E121A] border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs font-mono text-slate-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">
                      TIMEOUT DEADLINE (HOURS)
                    </label>
                    <input
                      type="number"
                      min="0.01"
                      step="1"
                      value={hoursInput}
                      onChange={(e) => setHoursInput(e.target.value)}
                      className="w-full bg-[#0E121A] border border-white/[0.1] rounded-xl px-4 py-2.5 text-xs font-mono text-slate-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>
                </div>

                <button
                  disabled={!canCreate || busy === 'create'}
                  onClick={createDeal}
                  className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-display font-bold text-sm uppercase tracking-wider transition-all disabled:opacity-40 disabled:pointer-events-none shadow-lg shadow-emerald-500/25 btn-shine-effect cursor-pointer"
                >
                  {busy === 'create' ? 'Initializing on Solana...' : 'Deploy & Initialize Escrow →'}
                </button>

                {!publicKey && (
                  <p className="text-xs font-mono text-amber-400 text-center">
                    ⚠️ Connect your Solana wallet (Phantom / Solflare / Backpack) in top navbar.
                  </p>
                )}
              </div>
            </div>

            {/* Right: Load Existing Escrow & Recent Deals (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Load Existing Card */}
              <div className="bg-[#12161F]/90 border border-white/[0.1] rounded-3xl p-6 backdrop-blur-2xl shadow-xl space-y-4">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  LOAD EXISTING DEAL BY ADDRESS
                </h3>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter Escrow Public Key"
                    value={pasteInput}
                    onChange={(e) => setPasteInput(e.target.value)}
                    className="flex-1 bg-[#0E121A] border border-white/[0.1] rounded-xl px-3.5 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 outline-none focus:border-emerald-400"
                  />
                  <button
                    onClick={() => setEscrowAddress(pasteInput.trim())}
                    disabled={pasteInput.trim().length < 32}
                    className="px-4 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-bold font-mono transition-colors disabled:opacity-40"
                  >
                    Load
                  </button>
                </div>

                {error && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono">
                    {error}
                  </div>
                )}
              </div>

              {/* Recent Saved Deals */}
              {savedEscrows.length > 0 && (
                <div className="bg-[#12161F]/90 border border-white/[0.1] rounded-3xl p-6 backdrop-blur-2xl shadow-xl space-y-3">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                    RECENT DEALS
                  </h3>

                  <div className="space-y-2">
                    {savedEscrows.map((addr) => (
                      <button
                        key={addr}
                        onClick={() => setEscrowAddress(addr)}
                        className="w-full text-left p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.05] text-xs font-mono text-slate-300 hover:text-emerald-400 transition-colors flex items-center justify-between truncate"
                      >
                        <span className="truncate">{addr}</span>
                        <span className="text-[10px] text-slate-500 ml-2">Open →</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

          </div>
        ) : (
          /* ACTIVE LOADED ESCROW VIEW */
          <div className="space-y-6">
            
            {/* Back Button & Reload */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => setEscrowAddress(null)}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.08] text-xs font-mono transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Switch / New Deal</span>
              </button>

              <button
                onClick={refresh}
                className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:underline"
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
                label="ESCROW PRICE"
                value={`${(escrow.amount.toNumber() / LAMPORTS_PER_SOL).toFixed(3)} SOL`}
                icon={Coins}
                accent="text-emerald-400"
              />

              <StatCard
                label="DEADLINE COUNTDOWN"
                value={countdown.label}
                subValue={countdown.expired ? 'Timeout Elapsed (Refund Available)' : 'Active Trading Window'}
                icon={Clock}
                accent={countdown.expired ? 'text-rose-400' : 'text-slate-100'}
              />

              <StatCard
                label="VAULT PDA BALANCE"
                value={
                  vaultBalance === null
                    ? 'Fetching...'
                    : `${(vaultBalance / LAMPORTS_PER_SOL).toFixed(3)} SOL`
                }
                subValue="Program-Derived Custody"
                icon={Layers}
                accent="text-cyan-400"
              />
            </div>

            {/* Escrow Address Share Field */}
            <CopyField
              label="ESCROW ON-CHAIN ADDRESS (SHARE WITH SELLER)"
              value={escrow.address.toBase58()}
            />

            {!isMyDeal && publicKey && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>
                  Connected wallet is not the recorded Buyer on this escrow. Actions requiring buyer authorization will revert on-chain.
                </span>
              </div>
            )}

            {/* 4 Action Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ActionCard
                title="1. Deposit SOL into Vault"
                description="Transfer the agreed SOL into the isolated Vault PDA locker."
                ready={escrow.state === EscrowState.Initialized && !!isMyDeal}
                buttonLabel="Deposit Funds"
                loading={busy === 'deposit'}
                onClick={depositFunds}
              />

              <ActionCard
                title="2. Execute Trade (Atomic Settlement)"
                description="Swap assets: transfers NFT to Buyer and releases SOL to Seller. Enabled once NFT is deposited."
                ready={escrow.state === EscrowState.NftDeposited}
                readyLabel="Ready to Settle"
                buttonLabel="Execute Atomic Swap"
                loading={busy === 'execute'}
                onClick={executeTrade}
              />

              <ActionCard
                title="3. Waiting for Seller NFT"
                description="Seller deposits the NFT from their seller portal once SOL is verified in the vault."
                ready={false}
                buttonLabel="Awaiting Seller Action"
                onClick={() => {}}
              />

              <ActionCard
                title="4. Claim Timeout Refund"
                description="Reclaim 100% of your SOL if the deadline expires before the seller deposits the NFT."
                ready={
                  countdown.expired &&
                  escrow.state !== EscrowState.Completed &&
                  escrow.state !== EscrowState.Refunded &&
                  !!isMyDeal
                }
                readyLabel="Refund Active"
                danger
                buttonLabel="Claim 100% SOL Refund"
                loading={busy === 'refund'}
                onClick={claimRefund}
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
