import React, { FC, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  Transaction,
} from '@solana/web3.js';
import BN from 'bn.js';
import { 
  ArrowDown, 
  ExternalLink, 
  Check, 
  Copy, 
  Sparkles, 
  Trash2,
  ShieldCheck
} from 'lucide-react';
import { Header } from '../components/Header';
import { useEscrow } from '../hooks/useEscrow';
import { useCountdown } from '../hooks/useCountdown';
import { EscrowState, EscrowStateLabel } from '../lib/escrowAccount';
import { getVaultPda } from '../lib/pda';
import {
  buildInitializeIx,
  buildDepositFundsIx,
  buildDepositNftIx,
  buildExecuteTradeIx,
  buildRefundIx,
} from '../lib/instructions';
import { resolveAta } from '../lib/ata';
import { explorerAddress, explorerTx, PROGRAM_ID } from '../constants';

const STORAGE_KEY = 'letsdeal:recent:deals';

export const UnifiedDashboard: FC<{ initialTab?: 'create' | 'manage' | 'history' }> = ({
  initialTab = 'create',
}) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [searchParams] = useSearchParams();

  const [tab, setTab] = useState<'create' | 'manage' | 'history'>(() => {
    const p = searchParams.get('tab');
    if (p === 'create' || p === 'manage' || p === 'history') return p;
    if (searchParams.get('deal')) return 'manage';
    return initialTab;
  });

  const [escrowAddress, setEscrowAddress] = useState<string | null>(() => {
    return searchParams.get('deal') || null;
  });

  const [inputAddress, setInputAddress] = useState('');
  const [busy, setBusy] = useState<string | null>(null);
  const [txSig, setTxSig] = useState<string | null>(null);
  const [txError, setTxError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Form State
  const [seller, setSeller] = useState('');
  const [mint, setMint] = useState('');
  const [amount, setAmount] = useState('0.1');
  const [hours, setHours] = useState('24');

  const { escrow, error: escrowError, refresh, loading: escrowLoading } = useEscrow(escrowAddress);
  const countdown = useCountdown(escrow ? escrow.deadline.toNumber() : null);

  // Saved Deals in LocalStorage
  const [savedDeals, setSavedDeals] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const saveDeal = (addr: string) => {
    const next = Array.from(new Set([addr, ...savedDeals])).slice(0, 10);
    setSavedDeals(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const removeDeal = (addr: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = savedDeals.filter((a) => a !== addr);
    setSavedDeals(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const handleFillSample = () => {
    setSeller('4Tzz6U9xM8pBq2vY5nK3jL7wR1dF8sE9aG0cH2eP4vM1');
    setMint('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');
    setAmount('0.15');
    setHours('6');
  };

  // Helper to run transactions
  async function runTx(label: string, action: () => Promise<Transaction>) {
    if (!publicKey) return;
    setTxError(null);
    setTxSig(null);
    try {
      const tx = await action();
      const sig = await sendTransaction(tx, connection);
      await connection.confirmTransaction(sig, 'confirmed');
      setTxSig(sig);
      refresh();
    } catch (err: any) {
      setTxError(err.message || 'Transaction failed or rejected by wallet.');
    } finally {
      setBusy(null);
    }
  }

  // 1. Create Deal
  const handleCreate = async () => {
    if (!publicKey || !seller || !mint || !amount) return;
    setBusy('create');
    const escrowKeypair = Keypair.generate();
    const sellerPubkey = new PublicKey(seller.trim());
    const nftMintPubkey = new PublicKey(mint.trim());
    const amountLamports = new BN(Math.round(parseFloat(amount) * LAMPORTS_PER_SOL));
    const deadline = new BN(
      Math.floor(Date.now() / 1000) + Math.round(parseFloat(hours) * 3600)
    );

    await runTx('Create Deal', async () => {
      const ix = buildInitializeIx({
        escrow: escrowKeypair.publicKey,
        buyer: publicKey,
        seller: sellerPubkey,
        amount: amountLamports,
        deadline,
        nftMint: nftMintPubkey,
      });
      const tx = new Transaction().add(ix);
      tx.feePayer = publicKey;
      tx.partialSign(escrowKeypair);
      return tx;
    });

    const newDealAddr = escrowKeypair.publicKey.toBase58();
    setEscrowAddress(newDealAddr);
    saveDeal(newDealAddr);
    setTab('manage');
  };

  // 2. Deposit Funds (Buyer)
  const handleDepositSol = async () => {
    if (!publicKey || !escrow) return;
    setBusy('deposit-sol');
    await runTx('Deposit SOL', async () => {
      const ix = buildDepositFundsIx({ escrow: escrow.address, buyer: publicKey });
      const tx = new Transaction().add(ix);
      tx.feePayer = publicKey;
      return tx;
    });
  };

  // 3. Deposit NFT (Seller)
  const handleDepositNft = async () => {
    if (!publicKey || !escrow) return;
    setBusy('deposit-nft');
    await runTx('Deposit NFT', async () => {
      const [vault] = getVaultPda(escrow.address);
      const tx = new Transaction();

      const sellerAta = await resolveAta(connection, publicKey, publicKey, escrow.nftMint);
      if (sellerAta.createIx) tx.add(sellerAta.createIx);

      const vaultAta = await resolveAta(connection, publicKey, vault, escrow.nftMint, true);
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
  };

  // 4. Settle Swap (Either)
  const handleSettle = async () => {
    if (!publicKey || !escrow) return;
    setBusy('settle');
    await runTx('Settle Trade', async () => {
      const [vault] = getVaultPda(escrow.address);
      const tx = new Transaction();

      const vaultAta = await resolveAta(connection, publicKey, vault, escrow.nftMint, true);
      if (vaultAta.createIx) tx.add(vaultAta.createIx);

      const buyerAta = await resolveAta(connection, publicKey, escrow.buyer, escrow.nftMint);
      if (buyerAta.createIx) tx.add(buyerAta.createIx);

      tx.add(
        buildExecuteTradeIx({
          escrow: escrow.address,
          seller: escrow.seller,
          buyer: escrow.buyer,
          vaultNftAccount: vaultAta.address,
          buyerNftAccount: buyerAta.address,
        })
      );
      tx.feePayer = publicKey;
      return tx;
    });
  };

  // 5. Refund (Buyer)
  const handleRefund = async () => {
    if (!publicKey || !escrow) return;
    setBusy('refund');
    await runTx('Claim Refund', async () => {
      const ix = buildRefundIx({ escrow: escrow.address, buyer: publicKey });
      const tx = new Transaction().add(ix);
      tx.feePayer = publicKey;
      return tx;
    });
  };

  const isBuyer = publicKey && escrow && escrow.buyer.equals(publicKey);
  const isSeller = publicKey && escrow && escrow.seller.equals(publicKey);

  const copyDealLink = () => {
    if (!escrowAddress) return;
    navigator.clipboard.writeText(escrowAddress);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0d0f14] text-slate-100 flex flex-col justify-between">
      <div>
        <Header />

        <main className="max-w-md mx-auto px-4 pt-10 pb-16">
          
          {/* Main Card Container */}
          <div className="bg-[#141720] border border-white/[0.08] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5">
            
            {/* Header Tabs */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
              <div className="flex items-center gap-1 bg-[#1c202c] p-1 rounded-xl">
                <button
                  onClick={() => setTab('create')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    tab === 'create'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Create Deal
                </button>
                <button
                  onClick={() => setTab('manage')}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    tab === 'manage'
                      ? 'bg-emerald-500 text-slate-950 shadow-sm font-bold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Deal Status
                </button>
              </div>

              <button
                onClick={() => setTab('history')}
                className={`text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
                  tab === 'history' ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-400 hover:text-white'
                }`}
              >
                Saved ({savedDeals.length})
              </button>
            </div>

            {/* TAB 1: CREATE DEAL */}
            {tab === 'create' && (
              <div className="space-y-4">
                
                {/* Intro with Sample data button */}
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Buyer locks SOL, Seller sends NFT</span>
                  <button
                    type="button"
                    onClick={handleFillSample}
                    className="text-emerald-400 hover:underline flex items-center gap-1 text-[11px]"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Fill Test Data</span>
                  </button>
                </div>

                {/* Amount Box */}
                <div className="bg-[#1a1e29] border border-white/[0.06] rounded-2xl p-4 space-y-1">
                  <div className="text-[11px] font-medium text-slate-400">You Pay (SOL)</div>
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="number"
                      min="0.001"
                      step="0.05"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-transparent text-2xl font-bold text-white outline-none"
                    />
                    <span className="px-2.5 py-1 rounded-xl bg-white/[0.08] text-xs font-bold text-slate-200">
                      SOL
                    </span>
                  </div>
                </div>

                {/* Arrow Divider */}
                <div className="flex justify-center -my-2">
                  <div className="w-8 h-8 rounded-full bg-[#1c202c] border border-white/[0.08] flex items-center justify-center text-slate-400">
                    <ArrowDown className="w-4 h-4" />
                  </div>
                </div>

                {/* Seller & NFT Details */}
                <div className="space-y-3 bg-[#1a1e29] border border-white/[0.06] rounded-2xl p-4">
                  <div>
                    <label className="text-[11px] font-medium text-slate-400 block mb-1">
                      Seller Solana Address
                    </label>
                    <input
                      type="text"
                      placeholder="Seller's public key"
                      value={seller}
                      onChange={(e) => setSeller(e.target.value)}
                      className="w-full bg-[#141720] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-400 block mb-1">
                      NFT Mint Address (SPL Token)
                    </label>
                    <input
                      type="text"
                      placeholder="Mint address of NFT"
                      value={mint}
                      onChange={(e) => setMint(e.target.value)}
                      className="w-full bg-[#141720] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-medium text-slate-400 block mb-1">
                      Deal Timeout Deadline
                    </label>
                    <select
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      className="w-full bg-[#141720] border border-white/[0.08] rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500 cursor-pointer"
                    >
                      <option value="1">1 Hour</option>
                      <option value="6">6 Hours</option>
                      <option value="24">24 Hours</option>
                      <option value="72">3 Days</option>
                    </select>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  disabled={!publicKey || !seller || !mint || busy === 'create'}
                  onClick={handleCreate}
                  className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  {busy === 'create' ? 'Creating Deal on Solana...' : 'Create Escrow Deal'}
                </button>

                {!publicKey && (
                  <p className="text-xs text-slate-400 text-center">
                    Connect your wallet in the top right to start.
                  </p>
                )}

              </div>
            )}

            {/* TAB 2: MANAGE ACTIVE DEAL */}
            {tab === 'manage' && (
              <div className="space-y-4">
                
                {/* Search / Paste Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Paste deal address..."
                    value={inputAddress}
                    onChange={(e) => setInputAddress(e.target.value)}
                    className="flex-1 bg-[#1a1e29] border border-white/[0.08] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none focus:border-emerald-500"
                  />
                  <button
                    onClick={() => {
                      if (inputAddress.trim().length >= 32) {
                        setEscrowAddress(inputAddress.trim());
                        saveDeal(inputAddress.trim());
                      }
                    }}
                    disabled={inputAddress.trim().length < 32}
                    className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-semibold disabled:opacity-30 transition-colors"
                  >
                    Open
                  </button>
                </div>

                {escrow ? (
                  <div className="space-y-4 pt-1">
                    
                    {/* Status Pill Card */}
                    <div className="bg-[#1a1e29] border border-white/[0.06] rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-400">Status</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-semibold text-xs border border-emerald-500/30">
                          {EscrowStateLabel[escrow.state] || 'Active'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Deal Amount:</span>
                        <span className="font-bold text-white">
                          {(escrow.amount.toNumber() / LAMPORTS_PER_SOL).toFixed(3)} SOL
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400">
                        <span>Time Remaining:</span>
                        <span className={countdown.expired ? 'text-rose-400 font-bold' : 'text-slate-200'}>
                          {countdown.label}
                        </span>
                      </div>

                      {/* Share Deal Address */}
                      <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
                        <span className="text-slate-400 truncate max-w-[200px]">
                          {escrow.address.toBase58().slice(0, 8)}...{escrow.address.toBase58().slice(-8)}
                        </span>
                        <button
                          onClick={copyDealLink}
                          className="text-emerald-400 hover:underline flex items-center gap-1 font-medium"
                        >
                          {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedLink ? 'Copied' : 'Copy Deal Address'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Action Triggers */}
                    <div className="space-y-2">
                      {escrow.state === EscrowState.Initialized && (
                        <button
                          disabled={!isBuyer || busy === 'deposit-sol'}
                          onClick={handleDepositSol}
                          className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase disabled:opacity-30 cursor-pointer transition-all"
                        >
                          {busy === 'deposit-sol' ? 'Depositing SOL...' : isBuyer ? '1. Deposit SOL into Vault' : 'Waiting for Buyer to deposit SOL'}
                        </button>
                      )}

                      {escrow.state === EscrowState.FundsDeposited && (
                        <button
                          disabled={!isSeller || busy === 'deposit-nft'}
                          onClick={handleDepositNft}
                          className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase disabled:opacity-30 cursor-pointer transition-all"
                        >
                          {busy === 'deposit-nft' ? 'Depositing NFT...' : isSeller ? '2. Deposit NFT to Vault' : 'Waiting for Seller to deposit NFT'}
                        </button>
                      )}

                      {escrow.state === EscrowState.NftDeposited && (
                        <button
                          disabled={busy === 'settle'}
                          onClick={handleSettle}
                          className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs uppercase disabled:opacity-30 cursor-pointer transition-all"
                        >
                          {busy === 'settle' ? 'Settling Swap...' : '3. Settle Swap & Transfer Assets'}
                        </button>
                      )}

                      {countdown.expired && escrow.state !== EscrowState.Completed && escrow.state !== EscrowState.Refunded && isBuyer && (
                        <button
                          disabled={busy === 'refund'}
                          onClick={handleRefund}
                          className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase cursor-pointer transition-all"
                        >
                          {busy === 'refund' ? 'Claiming Refund...' : 'Claim 100% SOL Refund'}
                        </button>
                      )}
                    </div>

                    {/* Solscan Link */}
                    <div className="text-center pt-1">
                      <a
                        href={explorerAddress(escrow.address.toBase58())}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-slate-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1"
                      >
                        <span>View on Solana Explorer</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                  </div>
                ) : (
                  <div className="py-8 text-center text-xs text-slate-500">
                    No active deal opened. Paste a deal address above.
                  </div>
                )}

              </div>
            )}

            {/* TAB 3: SAVED DEALS */}
            {tab === 'history' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400 pb-1 border-b border-white/[0.06]">
                  <span>Your Recent Deals</span>
                  {savedDeals.length > 0 && (
                    <button
                      onClick={() => {
                        setSavedDeals([]);
                        localStorage.removeItem(STORAGE_KEY);
                      }}
                      className="text-rose-400 hover:underline"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {savedDeals.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500">
                    No saved deals yet.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {savedDeals.map((addr) => (
                      <div
                        key={addr}
                        onClick={() => {
                          setEscrowAddress(addr);
                          setTab('manage');
                        }}
                        className="flex items-center justify-between p-3 rounded-xl bg-[#1a1e29] hover:bg-[#222735] border border-white/[0.06] text-xs cursor-pointer transition-colors"
                      >
                        <span className="text-slate-200 truncate mr-2">
                          {addr.slice(0, 10)}...{addr.slice(-8)}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => removeDeal(addr, e)}
                            className="text-slate-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-emerald-400 font-semibold">Open →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Notification messages */}
            {txSig && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-between">
                <span>Transaction confirmed on-chain!</span>
                <a
                  href={explorerTx(txSig)}
                  target="_blank"
                  rel="noreferrer"
                  className="underline font-bold"
                >
                  View
                </a>
              </div>
            )}

            {txError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {txError}
              </div>
            )}

          </div>

          {/* Clean Trust Note */}
          <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Non-custodial Solana PDA escrow • Zero counterparty risk</span>
          </div>

        </main>
      </div>
    </div>
  );
};
