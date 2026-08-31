import React, { FC, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRightLeft, 
  ShieldCheck, 
  Lock, 
  Cpu, 
  ExternalLink, 
  Search, 
  ArrowRight, 
  Layers, 
  Sparkles, 
  Coins, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { TiltCard } from '../components/TiltCard';
import { VirtualEscrowCard } from '../components/VirtualEscrowCard';
import { PROGRAM_ID, CLUSTER_LABEL, explorerAddress } from '../constants';

export const RoleSelect: FC = () => {
  const navigate = useNavigate();
  const [inspectAddress, setInspectAddress] = useState('');

  const handleInspect = (e: React.FormEvent) => {
    e.preventDefault();
    if (inspectAddress.trim().length >= 32) {
      navigate(`/buyer?escrow=${inspectAddress.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0C10] text-[#F8FAFC] selection:bg-emerald-500/20 selection:text-emerald-400">
      <Header />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden bg-radial-gradient-hero">
        {/* Ambient Top Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[400px] bg-gradient-to-tr from-emerald-500/15 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-bold">⚡ SOLANA DEVNET ANCHOR PROTOCOL</span>
              </div>

              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.1] text-white">
                NFT ⇄ SOL Swaps. <br />
                <span className="text-gradient-solana">
                  Settled by Code, Not Promises.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Deterministic, non-custodial escrow on Solana. Assets are locked in isolated 
                Program Derived Addresses (PDAs) and execute atomically. If the seller never delivers, 
                the buyer reclaims 100% of their SOL after the deadline.
              </p>

              {/* Quick Role Selection Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-left">
                {/* Buyer Card */}
                <Link to="/buyer" className="group">
                  <TiltCard className="p-6 h-full bg-[#12161F]/90 border border-white/[0.08] hover:border-emerald-400/60 hover:shadow-lg hover:shadow-emerald-500/15 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono uppercase font-bold text-emerald-400">
                        BUYER PORTAL
                      </span>
                      <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="font-display font-bold text-lg text-white mb-1">
                      Create or Fund Deal →
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Lock up SOL, set a timeout deadline, monitor NFT deposit, and execute atomic swap.
                    </p>
                  </TiltCard>
                </Link>

                {/* Seller Card */}
                <Link to="/seller" className="group">
                  <TiltCard className="p-6 h-full bg-[#12161F]/90 border border-white/[0.08] hover:border-purple-400/60 hover:shadow-lg hover:shadow-purple-500/15 transition-all">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono uppercase font-bold text-purple-400">
                        SELLER PORTAL
                      </span>
                      <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="font-display font-bold text-lg text-white mb-1">
                      Fulfill & Deposit NFT →
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Paste escrow address, verify locked SOL in vault, deposit your NFT, and claim SOL.
                    </p>
                  </TiltCard>
                </Link>
              </div>

              {/* Inspect Escrow Bar */}
              <form onSubmit={handleInspect} className="pt-2">
                <div className="flex flex-col sm:flex-row gap-2 bg-[#12161F]/90 border border-white/[0.1] p-2 rounded-2xl backdrop-blur-xl">
                  <div className="relative flex-1 flex items-center">
                    <Search className="w-4 h-4 absolute left-3.5 text-slate-500 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Paste any Escrow Public Key to inspect on-chain state..."
                      value={inspectAddress}
                      onChange={(e) => setInspectAddress(e.target.value)}
                      className="w-full bg-transparent pl-10 pr-4 py-2 text-xs font-mono text-slate-200 placeholder-slate-500 outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={inspectAddress.trim().length < 32}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shrink-0"
                  >
                    Inspect Deal
                  </button>
                </div>
              </form>

            </div>

            {/* Right 3D Virtual Escrow Card (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center gap-4">
              <VirtualEscrowCard />
              <p className="text-[11px] font-mono text-slate-500 text-center">
                ✨ Click the card above to inspect PDA seed derivation & byte layout.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. PROTOCOL ARCHITECTURE & TRUST MATRIX                                   */}
      {/* ========================================================================= */}
      <section className="py-20 relative bg-[#0C0F16] border-y border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest">
              DETERMINISTIC SECURITY
            </h2>
            <p className="font-display text-3xl sm:text-4xl font-extrabold text-white">
              Why LetsDeal Eliminates Counterparty Fraud
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-white text-lg">No Private Keys in Custody</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Locked assets are held by a Program Derived Address derived from <code className="text-emerald-400">[b"vault", escrow.key()]</code>. Only program instruction CPIs can move funds.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-white text-lg">Atomic CPI Settlement</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                NFT and SOL execute simultaneously in the <code className="text-cyan-400">execute_trade</code> instruction. Either both transfers succeed or the entire transaction reverts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <Clock className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-white text-lg">Guaranteed Timeout Refund</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                If the seller doesn't deposit the NFT before the unix timestamp deadline, the buyer unilaterally triggers <code className="text-purple-400">refund()</code> to reclaim 100% of their SOL.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
