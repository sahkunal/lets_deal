import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  Lock, 
  RefreshCw, 
  Code2, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  ArrowRightLeft,
  Copy,
  Check
} from 'lucide-react';
import { SolanaNavbar } from '../components/SolanaNavbar';
import { SolanaFooter } from '../components/SolanaFooter';
import { PROGRAM_ID, CLUSTER_LABEL, explorerAddress } from '../constants';

export const HomePage: FC = () => {
  const [activeCodeTab, setActiveCodeTab] = useState<'rust' | 'ts' | 'anchor'>('rust');
  const [copiedCode, setCopiedCode] = useState(false);

  const rustCode = `// programs/lets_deal/src/lib.rs
#[program]
pub mod lets_deal {
    use super::*;

    pub fn initialize(
        ctx: Context<Initialize>, 
        amount: u64, 
        deadline: i64, 
        nft_mint: Pubkey
    ) -> Result<()> {
        let escrow = &mut ctx.accounts.escrow;
        escrow.buyer = ctx.accounts.buyer.key();
        escrow.seller = ctx.accounts.seller.key();
        escrow.amount = amount;
        escrow.deadline = deadline;
        escrow.nft_mint = nft_mint;
        escrow.state = EscrowState::Initialized;
        Ok(())
    }
}`;

  const tsCode = `// TypeScript CPI Client
const ix = buildExecuteTradeIx({
  escrow: escrowPubkey,
  seller: escrowAccount.seller,
  buyer: escrowAccount.buyer,
  vaultNftAccount: vaultAta,
  buyerNftAccount: buyerAta,
});

const tx = new Transaction().add(ix);
await sendTransaction(tx, connection);`;

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-slate-100 selection:bg-[#14F195]/20 selection:text-[#14F195]">
      <SolanaNavbar />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (SOLANA.COM STYLE)                                        */}
      {/* ========================================================================= */}
      <section className="relative pt-24 pb-20 sm:pt-32 sm:pb-28 overflow-hidden">
        {/* Subtle Ambient Solana Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-tr from-[#9945FF]/15 via-[#00C2FF]/10 to-[#14F195]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-slate-300">
            <span className="w-2 h-2 rounded-full bg-[#14F195] animate-pulse" />
            <span>SOLANA DEVNET ANCHOR PROTOCOL</span>
          </div>

          <h1 className="font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white max-w-4xl mx-auto leading-[1.08]">
            Deterministic OTC Swaps. <br />
            <span className="text-solana-gradient">
              Built for Solana.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Non-custodial smart contract escrow for atomic SOL ⇄ SPL NFT trades. 
            Assets are locked in isolated Program Derived Addresses (PDAs) with guaranteed timeout refunds.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/app"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-[#9945FF] via-[#00C2FF] to-[#14F195] text-slate-950 font-bold text-sm uppercase tracking-wider hover:opacity-95 shadow-xl shadow-[#14F195]/20 flex items-center justify-center gap-2 group transition-all"
            >
              <span>Launch Trade Terminal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/developers"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-white font-bold text-sm tracking-wide transition-colors flex items-center justify-center gap-2"
            >
              <Code2 className="w-4 h-4 text-slate-400" />
              <span>Read Protocol Spec</span>
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. STATS COUNTER STRIP                                                    */}
      {/* ========================================================================= */}
      <section className="border-y border-white/[0.08] bg-[#050608] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center sm:text-left">
            
            <div className="space-y-1 sm:border-r border-white/[0.08] sm:pr-4">
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                &lt; $0.0005
              </div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Average Transaction Fee
              </div>
            </div>

            <div className="space-y-1 sm:border-r border-white/[0.08] sm:pr-4">
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                ~400 ms
              </div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Settlement Finality
              </div>
            </div>

            <div className="space-y-1 sm:border-r border-white/[0.08] sm:pr-4">
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                113 Bytes
              </div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Fixed Account Rent Layout
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl sm:text-4xl font-extrabold text-[#14F195] tracking-tight">
                100%
              </div>
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Non-Custodial PDA Custody
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. BENTO GRID ARCHITECTURE (SOLANA.COM STYLE)                             */}
      {/* ========================================================================= */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="space-y-3 text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#14F195]">
            PROTOCOL SECURITY & SPEED
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
            Designed for Trustless Execution
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Bento 1: Large Span */}
          <div className="solana-card p-8 md:col-span-2 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#9945FF]/20 to-[#14F195]/20 border border-[#14F195]/30 flex items-center justify-center text-[#14F195]">
                <ArrowRightLeft className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">Atomic Bilateral CPI Settlement</h3>
              <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
                In a single Solana transaction, <code className="text-[#14F195]">execute_trade</code> transfers 
                the NFT from Vault ATA to Buyer and simultaneously releases the locked SOL to Seller. 
                Either both transfers succeed or the entire instruction reverts.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.06] text-xs font-mono text-slate-500">
              Deterministic CPI via <code>invoke_signed</code> with PDA seeds.
            </div>
          </div>

          {/* Bento 2 */}
          <div className="solana-card p-8 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#00C2FF]/20 to-[#9945FF]/20 border border-[#00C2FF]/30 flex items-center justify-center text-[#00C2FF]">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Isolated PDA Vaults</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Assets are held inside individual Program Derived Addresses generated from <code className="text-[#00C2FF]">[b"vault", escrow.key()]</code>. No central admin wallet.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.06] text-xs font-mono text-slate-500">
              Zero counterparty private keys.
            </div>
          </div>

          {/* Bento 3 */}
          <div className="solana-card p-8 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#14F195]/20 to-[#00C2FF]/20 border border-[#14F195]/30 flex items-center justify-center text-[#14F195]">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white">Guaranteed Timeout Refunds</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                If the seller doesn't deposit the NFT before the unix timestamp deadline, the buyer unilaterally triggers <code className="text-[#14F195]">refund()</code> to reclaim 100% of their SOL.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.06] text-xs font-mono text-slate-500">
              Clock sysvar enforced on-chain.
            </div>
          </div>

          {/* Bento 4: Large Span */}
          <div className="solana-card p-8 md:col-span-2 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#9945FF]/20 to-[#00C2FF]/20 border border-[#9945FF]/30 flex items-center justify-center text-[#9945FF]">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-white">Zero-IDL Runtime Decoding</h3>
              <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
                Instruction discriminators are computed on-the-fly via <code className="text-[#9945FF]">sha256("global:&lt;name&gt;")[0..8]</code>. 
                Escrow buffers (113 bytes) are decoded directly using zero-dependency Borsh binary layouts.
              </p>
            </div>
            <div className="pt-4 border-t border-white/[0.06] text-xs font-mono text-slate-500">
              Ultra-resilient to Anchor IDL schema version drifts.
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. DEVELOPER CODE SHOWCASE                                                */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#050608] border-y border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#14F195]">
                DEVELOPER FIRST
              </span>
              <h2 className="text-3xl font-extrabold text-white tracking-tight mt-1">
                Interact with Clean Anchor Code
              </h2>
            </div>

            <div className="flex items-center gap-2 bg-white/[0.04] p-1 rounded-xl border border-white/[0.08] text-xs font-mono">
              <button
                onClick={() => setActiveCodeTab('rust')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeCodeTab === 'rust' ? 'bg-[#14F195] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                Rust (lib.rs)
              </button>
              <button
                onClick={() => setActiveCodeTab('ts')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeCodeTab === 'ts' ? 'bg-[#14F195] text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                TypeScript Client
              </button>
            </div>
          </div>

          <div className="relative rounded-2xl bg-[#090B0F] border border-white/[0.08] p-6 font-mono text-xs overflow-x-auto text-slate-300">
            <button
              onClick={() => copyCode(activeCodeTab === 'rust' ? rustCode : tsCode)}
              className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-slate-400 hover:text-white border border-white/[0.08] flex items-center gap-1.5 text-[11px] transition-colors"
            >
              {copiedCode ? <Check className="w-3 h-3 text-[#14F195]" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCode ? 'Copied' : 'Copy'}</span>
            </button>
            <pre className="text-[#14F195]">
              {activeCodeTab === 'rust' ? rustCode : tsCode}
            </pre>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. BOTTOM CALL TO ACTION                                                  */}
      {/* ========================================================================= */}
      <section className="py-24 text-center space-y-6">
        <div className="max-w-3xl mx-auto px-4 space-y-4">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Ready to trade without counterparty risk?
          </h2>
          <p className="text-slate-400 text-base">
            Connect your Solana wallet and deploy your first escrow deal in seconds on Devnet.
          </p>
          <div className="pt-4">
            <Link
              to="/app"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-gradient-to-r from-[#9945FF] via-[#00C2FF] to-[#14F195] text-slate-950 font-bold text-sm uppercase tracking-wider hover:opacity-95 shadow-xl shadow-[#14F195]/20"
            >
              <span>Launch LetsDeal Terminal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <SolanaFooter />
    </div>
  );
};
