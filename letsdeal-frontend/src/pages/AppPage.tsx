import React, { FC, useState } from 'react';
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
import { SolanaNavbar } from '../components/SolanaNavbar';
import { SolanaFooter } from '../components/SolanaFooter';
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
import { explorerAddress, explorerTx, SAMPLE_DEVNET_PRESETS } from '../constants';

const STORAGE_KEY = 'letsdeal:recent:deals';

export const AppPage: FC = () => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const [searchParams] = useSearchParams();

  const [tab, setTab] = useState<'create' | 'manage' | 'history'>('create');
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
  const [amount, setAmount] = useState('0.25');
  const [hours, setHours] = useState('24');

  const { escrow, error: escrowError, refresh, loading: escrowLoading } = useEscrow(escrowAddress);
  const countdown = useCountdown(escrow ? escrow.deadline.toNumber() : null);

  // Saved Deals
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
    setSeller(SAMPLE_DEVNET_PRESETS[0].seller);
    setMint(SAMPLE_DEVNET_PRESETS[0].mint);
    setAmount(SAMPLE_DEVNET_PRESETS[0].amount);
    setHours(SAMPLE_DEVNET_PRESETS[0].hours);
  };

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
    <div className="min-h-screen bg-[#000000] text-white flex flex-col justify-between selection:bg-white selection:text-black">
      <div>
        <SolanaNavbar />

        <main className="max-w-xl mx-auto px-4 pt-12 pb-20">
          
          {/* Main Card Container */}
          <div className="bg-[#08080A] border border-[#1E1E26] rounded-2xl p-6 sm:p-8 space-y-6">
            
            {/* Header Tabs */}
            <div className="flex items-center justify-between border-b border-[#1A1A22] pb-4">
              <div className="flex items-center gap-1 bg-[#101014] p-1 rounded-xl border border-[#22222A]">
                <button
                  onClick={() => setTab('create')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    tab === 'create'
                      ? 'bg-white text-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Create Deal
                </button>
                <button
                  onClick={() => setTab('manage')}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    tab === 'manage'
                      ? 'bg-white text-black'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  Deal Status
                </button>
              </div>

              <button
                onClick={() => setTab('history')}
                className={`text-xs font-mono px-3 py-1.5 rounded-lg transition-colors ${
                  tab === 'history' ? 'text-white bg-[#14141A]' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Saved ({savedDeals.length})
              </button>
            </div>

            {/* TAB 1: CREATE DEAL */}
            {tab === 'create' && (
              <div className="space-y-4">
                
                {/* Sample Fill Button */}
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span>Buyer locks SOL, Seller deposits NFT</span>
                  <button
                    type="button"
                    onClick={handleFillSample}
                    className="text-zinc-300 hover:text-white hover:underline flex items-center gap-1 text-[11px] font-mono"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Fill Test Data</span>
                  </button>
                </div>

                {/* Amount Box */}
                <div className="bg-[#0E0E12] border border-[#22222A] rounded-xl p-4 space-y-1">
                  <div className="text-[11px] font-mono text-zinc-500">You Pay (SOL)</div>
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="number"
                      min="0.001"
                      step="0.05"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-transparent text-3xl font-bold text-white outline-none"
                    />
                    <span className="px-2.5 py-1 rounded-md bg-[#181820] text-xs font-mono font-semibold text-zinc-200">
                      SOL
                    </span>
                  </div>
                </div>

                {/* Arrow Divider */}
                <div className="flex justify-center -my-2">
                  <div className="w-7 h-7 rounded-full bg-[#121216] border border-[#24242E] flex items-center justify-center text-zinc-400">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Seller & NFT Details */}
                <div className="space-y-3 bg-[#0E0E12] border border-[#22222A] rounded-xl p-4 font-mono text-xs">
                  <div>
                    <label className="text-zinc-500 block mb-1 text-[10px] uppercase">
                      Seller Solana Address
                    </label>
                    <input
                      type="text"
                      placeholder="4Tzz...SellerAddress"
                      value={seller}
                      onChange={(e) => setSeller(e.target.value)}
                      className="w-full bg-[#070709] border border-[#202028] rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none focus:border-zinc-400"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-500 block mb-1 text-[10px] uppercase">
                      NFT Mint Address (SPL Token)
                    </label>
                    <input
                      type="text"
                      placeholder="EPjF...MintAddress"
                      value={mint}
                      onChange={(e) => setMint(e.target.value)}
                      className="w-full bg-[#070709] border border-[#202028] rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-600 outline-none focus:border-zinc-400"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-500 block mb-1 text-[10px] uppercase">
                      Timeout Deadline
                    </label>
                    <select
                      value={hours}
                      onChange={(e) => setHours(e.target.value)}
                      className="w-full bg-[#070709] border border-[#202028] rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-zinc-400 cursor-pointer"
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
                  className="w-full py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs uppercase tracking-wider transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                >
                  {busy === 'create' ? 'Initializing On-Chain...' : 'Deploy Escrow Deal →'}
                </button>

                {!publicKey && (
                  <p className="text-xs font-mono text-zinc-500 text-center">
                    Connect your wallet in the top navbar to start.
                  </p>
                )}

              </div>
            )}

            {/* TAB 2: MANAGE ACTIVE DEAL */}
            {tab === 'manage' && (
              <div className="space-y-4">
                
                {/* Search / Paste Input */}
                <div className="flex gap-2 font-mono">
                  <input
                    type="text"
                    placeholder="Paste deal address..."
                    value={inputAddress}
                    onChange={(e) => setInputAddress(e.target.value)}
                    className="flex-1 bg-[#0E0E12] border border-[#22222A] rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 outline-none focus:border-zinc-400"
                  />
                  <button
                    onClick={() => {
                      if (inputAddress.trim().length >= 32) {
                        setEscrowAddress(inputAddress.trim());
                        saveDeal(inputAddress.trim());
                      }
                    }}
                    disabled={inputAddress.trim().length < 32}
                    className="px-4 py-2 rounded-xl bg-[#181820] hover:bg-[#22222C] text-white text-xs font-semibold disabled:opacity-30 transition-colors"
                  >
                    Open
                  </button>
                </div>

                {escrow ? (
                  <div className="space-y-4 pt-1 font-mono">
                    
                    {/* Status Pill Card */}
                    <div className="bg-[#0E0E12] border border-[#22222A] rounded-xl p-4 space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-zinc-500">STATE</span>
                        <span className="px-2.5 py-0.5 rounded-md bg-[#181820] text-zinc-200 font-semibold text-xs border border-[#262632]">
                          {EscrowStateLabel[escrow.state] || 'Active'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm">
                        <span className="text-zinc-500">LOCKED AMOUNT:</span>
                        <span className="font-bold text-white">
                          {(escrow.amount.toNumber() / LAMPORTS_PER_SOL).toFixed(3)} SOL
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-zinc-400">
                        <span>TIMEOUT DEADLINE:</span>
                        <span className={countdown.expired ? 'text-zinc-300 font-semibold' : 'text-zinc-300'}>
                          {countdown.label}
                        </span>
                      </div>

                      {/* Share Deal Address */}
                      <div className="pt-2 border-t border-[#1C1C26] flex items-center justify-between text-xs">
                        <span className="text-zinc-500 truncate max-w-[200px]">
                          {escrow.address.toBase58().slice(0, 8)}...{escrow.address.toBase58().slice(-8)}
                        </span>
                        <button
                          onClick={copyDealLink}
                          className="text-zinc-300 hover:text-white hover:underline flex items-center gap-1 font-medium"
                        >
                          {copiedLink ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedLink ? 'Copied' : 'Copy Deal Link'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Action Triggers */}
                    <div className="space-y-2">
                      {escrow.state === EscrowState.Initialized && (
                        <button
                          disabled={!isBuyer || busy === 'deposit-sol'}
                          onClick={handleDepositSol}
                          className="w-full py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs uppercase disabled:opacity-30 cursor-pointer transition-colors"
                        >
                          {busy === 'deposit-sol' ? 'Depositing SOL...' : isBuyer ? '1. Deposit SOL into Vault PDA' : 'Waiting for Buyer to deposit SOL'}
                        </button>
                      )}

                      {escrow.state === EscrowState.FundsDeposited && (
                        <button
                          disabled={!isSeller || busy === 'deposit-nft'}
                          onClick={handleDepositNft}
                          className="w-full py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs uppercase disabled:opacity-30 cursor-pointer transition-colors"
                        >
                          {busy === 'deposit-nft' ? 'Depositing NFT...' : isSeller ? '2. Deposit NFT into Vault' : 'Waiting for Seller to deposit NFT'}
                        </button>
                      )}

                      {escrow.state === EscrowState.NftDeposited && (
                        <button
                          disabled={busy === 'settle'}
                          onClick={handleSettle}
                          className="w-full py-3 rounded-xl bg-white hover:bg-zinc-200 text-black font-semibold text-xs uppercase disabled:opacity-30 cursor-pointer transition-colors"
                        >
                          {busy === 'settle' ? 'Settling Atomic Swap...' : '3. Settle Swap & Claim Assets'}
                        </button>
                      )}

                      {countdown.expired && escrow.state !== EscrowState.Completed && escrow.state !== EscrowState.Refunded && isBuyer && (
                        <button
                          disabled={busy === 'refund'}
                          onClick={handleRefund}
                          className="w-full py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs uppercase cursor-pointer transition-colors border border-zinc-700"
                        >
                          {busy === 'refund' ? 'Claiming Refund...' : 'Claim 100% SOL Refund'}
                        </button>
                      )}
                    </div>

                    {/* Explorer Link */}
                    <div className="text-center pt-1">
                      <a
                        href={explorerAddress(escrow.address.toBase58())}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-zinc-500 hover:text-white transition-colors inline-flex items-center gap-1"
                      >
                        <span>View On-Chain on Solana Explorer</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                  </div>
                ) : (
                  <div className="py-8 text-center text-xs font-mono text-zinc-500">
                    No active escrow deal loaded.
                  </div>
                )}

              </div>
            )}

            {/* TAB 3: SAVED DEALS */}
            {tab === 'history' && (
              <div className="space-y-3 font-mono">
                <div className="flex items-center justify-between text-xs text-zinc-400 pb-1 border-b border-[#1C1C26]">
                  <span>Recent Deals</span>
                  {savedDeals.length > 0 && (
                    <button
                      onClick={() => {
                        setSavedDeals([]);
                        localStorage.removeItem(STORAGE_KEY);
                      }}
                      className="text-zinc-500 hover:text-zinc-300 hover:underline text-[10px]"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {savedDeals.length === 0 ? (
                  <div className="py-8 text-center text-xs text-zinc-500">
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
                        className="flex items-center justify-between p-3 rounded-xl bg-[#0E0E12] hover:bg-[#14141A] border border-[#1E1E26] text-xs cursor-pointer transition-colors"
                      >
                        <span className="text-zinc-300 truncate mr-2">
                          {addr.slice(0, 10)}...{addr.slice(-8)}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => removeDeal(addr, e)}
                            className="text-zinc-500 hover:text-zinc-300 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-white font-medium">Open →</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Notification messages */}
            {txSig && (
              <div className="p-3 rounded-xl bg-[#121216] border border-[#242430] text-zinc-200 text-xs font-mono flex items-center justify-between">
                <span>Transaction confirmed on-chain!</span>
                <a
                  href={explorerTx(txSig)}
                  target="_blank"
                  rel="noreferrer"
                  className="underline font-medium text-white"
                >
                  View
                </a>
              </div>
            )}

            {txError && (
              <div className="p-3 rounded-xl bg-[#141012] border border-[#2C1820] text-zinc-300 text-xs font-mono">
                {txError}
              </div>
            )}

          </div>

          {/* Clean Trust Note */}
          <div className="mt-6 text-center text-xs font-mono text-zinc-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
            <span>Governed by Program Derived Address <code>vault</code></span>
          </div>

        </main>
      </div>

      <SolanaFooter />
    </div>
  );
};
