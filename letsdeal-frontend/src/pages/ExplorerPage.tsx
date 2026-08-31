import React, { FC, useState } from 'react';
import { useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Search, ExternalLink, RefreshCw, CheckCircle2, AlertCircle, Layers } from 'lucide-react';
import { SolanaNavbar } from '../components/SolanaNavbar';
import { SolanaFooter } from '../components/SolanaFooter';
import { decodeEscrow, EscrowStateLabel } from '../lib/escrowAccount';
import { getVaultPda } from '../lib/pda';
import { PROGRAM_ID, CLUSTER_LABEL, explorerAddress, solscanAddress } from '../constants';

export const ExplorerPage: FC = () => {
  const { connection } = useConnection();
  const [addressInput, setAddressInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accountData, setAccountData] = useState<any | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressInput.trim()) return;

    setLoading(true);
    setError(null);
    setAccountData(null);

    try {
      const pubkey = new PublicKey(addressInput.trim());
      const accountInfo = await connection.getAccountInfo(pubkey, 'confirmed');

      if (!accountInfo) {
        setError(`Account ${pubkey.toBase58()} was not found on Solana ${CLUSTER_LABEL}.`);
        return;
      }

      if (!accountInfo.owner.equals(PROGRAM_ID)) {
        setError(`Account exists, but is owned by ${accountInfo.owner.toBase58()} instead of lets_deal (${PROGRAM_ID.toBase58()}).`);
        return;
      }

      const decoded = decodeEscrow(pubkey, accountInfo.data);
      const [vaultPda] = getVaultPda(pubkey);
      const vaultLamports = await connection.getBalance(vaultPda).catch(() => 0);

      setAccountData({
        address: pubkey.toBase58(),
        owner: accountInfo.owner.toBase58(),
        lamports: accountInfo.lamports,
        dataLength: accountInfo.data.length,
        vaultPda: vaultPda.toBase58(),
        vaultBalanceSol: vaultLamports / LAMPORTS_PER_SOL,
        buyer: decoded.buyer.toBase58(),
        seller: decoded.seller.toBase58(),
        amountSol: (decoded.amount.toNumber() / LAMPORTS_PER_SOL).toFixed(4),
        deadlineIso: new Date(decoded.deadline.toNumber() * 1000).toISOString(),
        deadlineUnix: decoded.deadline.toNumber(),
        nftMint: decoded.nftMint.toBase58(),
        stateLabel: EscrowStateLabel[decoded.state] ?? 'unknown',
        rawBytes: Array.from(accountInfo.data.slice(0, 32)),
      });
    } catch (err: any) {
      setError(err.message || 'Invalid Solana address');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-slate-100 selection:bg-[#14F195]/20 selection:text-[#14F195]">
      <SolanaNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        
        {/* Header */}
        <div className="space-y-4 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00C2FF]/10 border border-[#00C2FF]/30 text-[#00C2FF] text-xs font-mono">
            <span>ON-CHAIN DEVNET EXPLORER</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Account Explorer
          </h1>
          
          <p className="text-base text-slate-400">
            Direct RPC binary inspector to query and decode any 113-byte Escrow account on Solana Devnet.
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-3xl">
          <div className="flex gap-2 p-2 rounded-2xl bg-[#090B0F] border border-white/[0.08]">
            <div className="relative flex-1 flex items-center">
              <Search className="w-4 h-4 absolute left-3.5 text-slate-500 pointer-events-none" />
              <input
                type="text"
                placeholder="Enter 32-44 char Escrow Public Key..."
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                className="w-full bg-transparent pl-10 pr-4 py-2.5 text-xs font-mono text-white placeholder-slate-600 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading || addressInput.trim().length < 32}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#9945FF] to-[#14F195] text-slate-950 font-bold text-xs uppercase tracking-wider disabled:opacity-30 transition-all cursor-pointer"
            >
              {loading ? 'Decoding...' : 'Query Account'}
            </button>
          </div>
        </form>

        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono max-w-3xl">
            {error}
          </div>
        )}

        {/* Account Details Result */}
        {accountData && (
          <div className="space-y-6 max-w-3xl font-mono text-xs">
            <div className="p-6 rounded-3xl bg-[#090B0F] border border-white/[0.08] space-y-6">
              
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase">ESCROW ACCOUNT</span>
                  <div className="text-sm font-bold text-white select-all">{accountData.address}</div>
                </div>

                <span className="px-3 py-1 rounded-full bg-[#14F195]/15 text-[#14F195] font-bold text-xs border border-[#14F195]/30">
                  {accountData.stateLabel}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-[#030406] space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase">BUYER WALLET</span>
                  <div className="text-slate-200 select-all truncate">{accountData.buyer}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#030406] space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase">SELLER WALLET</span>
                  <div className="text-slate-200 select-all truncate">{accountData.seller}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#030406] space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase">LOCKED AMOUNT</span>
                  <div className="text-[#14F195] font-extrabold">{accountData.amountSol} SOL</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#030406] space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase">TIMEOUT DEADLINE</span>
                  <div className="text-slate-200">{accountData.deadlineIso}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#030406] space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase">NFT MINT</span>
                  <div className="text-slate-200 select-all truncate">{accountData.nftMint}</div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#030406] space-y-1">
                  <span className="text-[10px] text-slate-500 uppercase">VAULT PDA</span>
                  <div className="text-[#00C2FF] select-all truncate">{accountData.vaultPda}</div>
                </div>
              </div>

              {/* Explorer Links */}
              <div className="pt-2 flex items-center gap-4 text-slate-400">
                <a
                  href={explorerAddress(accountData.address)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#14F195] hover:underline flex items-center gap-1"
                >
                  <span>Solana Explorer</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <span>•</span>
                <a
                  href={solscanAddress(accountData.address)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#00C2FF] hover:underline flex items-center gap-1"
                >
                  <span>Solscan</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          </div>
        )}

      </main>

      <SolanaFooter />
    </div>
  );
};
