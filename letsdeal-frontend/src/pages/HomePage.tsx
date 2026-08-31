import React, { FC, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Lock, 
  RefreshCw, 
  Code2, 
  ArrowRightLeft,
  Copy,
  Check,
  Cpu,
  Shield
} from 'lucide-react';
import { SolanaNavbar } from '../components/SolanaNavbar';
import { SolanaFooter } from '../components/SolanaFooter';

export const HomePage: FC = () => {
  const [activeCodeTab, setActiveCodeTab] = useState<'rust' | 'ts'>('rust');
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
    <div className="min-h-screen bg-[#000000] text-[#FFFFFF] selection:bg-white selection:text-black">
      <SolanaNavbar />

      {/* ========================================================================= */}
      {/* 1. HERO SECTION (CLEAN MONOCHROME SOLANA STYLE)                           */}
      {/* ========================================================================= */}
      <section className="pt-24 pb-20 sm:pt-32 sm:pb-28 border-b border-[#1A1A20]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-7">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#101014] border border-[#22222A] text-xs font-mono text-zinc-300">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span>SOLANA DEVNET ANCHOR PROTOCOL</span>
          </div>

          <h1 className="font-extrabold text-4xl sm:text-6xl lg:text-7xl tracking-tight text-white max-w-4xl mx-auto leading-[1.08]">
            Deterministic OTC Swaps. <br />
            <span className="text-zinc-400 font-normal">
              Built for Solana.
            </span>
          </h1>

          <p className="text-sm sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal">
            Non-custodial smart contract escrow for atomic SOL ⇄ SPL NFT trades. 
            Assets are held in isolated Program Derived Addresses with automated timeout refunds.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              to="/app"
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-white hover:bg-zinc-200 text-black font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
            >
              <span>Launch Trade Terminal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              to="/developers"
              className="w-full sm:w-auto px-7 py-3 rounded-full bg-[#121216] hover:bg-[#18181E] border border-[#24242E] text-white font-medium text-xs tracking-wide transition-colors flex items-center justify-center gap-2"
            >
              <Code2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>Read Protocol Spec</span>
            </Link>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. STATS STRIP                                                            */}
      {/* ========================================================================= */}
      <section className="border-b border-[#1A1A20] bg-[#050507] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center sm:text-left">
            
            <div className="space-y-1 sm:border-r border-[#1C1C22] sm:pr-4">
              <div className="text-3xl font-bold text-white tracking-tight">
                &lt; $0.0005
              </div>
              <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                Average Transaction Fee
              </div>
            </div>

            <div className="space-y-1 sm:border-r border-[#1C1C22] sm:pr-4">
              <div className="text-3xl font-bold text-white tracking-tight">
                ~400 ms
              </div>
              <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                Settlement Finality
              </div>
            </div>

            <div className="space-y-1 sm:border-r border-[#1C1C22] sm:pr-4">
              <div className="text-3xl font-bold text-white tracking-tight">
                113 Bytes
              </div>
              <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                Fixed Account Rent Layout
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-3xl font-bold text-white tracking-tight">
                100%
              </div>
              <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                Non-Custodial PDA Custody
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. BENTO GRID ARCHITECTURE (SHARP MONOCHROME)                             */}
      {/* ========================================================================= */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="space-y-2 text-center max-w-2xl mx-auto">
          <span className="text-[11px] font-mono font-medium uppercase tracking-widest text-zinc-400">
            PROTOCOL SPECIFICATION
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Designed for Trustless Execution
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* Bento 1: Large */}
          <div className="mono-card p-7 md:col-span-2 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#121216] border border-[#22222A] flex items-center justify-center text-white">
                <ArrowRightLeft className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">Atomic Bilateral CPI Settlement</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-lg">
                In a single transaction, <code className="text-zinc-200">execute_trade</code> transfers 
                the NFT from Vault ATA to Buyer and simultaneously releases the locked SOL to Seller. 
                Either both transfers succeed or the transaction reverts.
              </p>
            </div>
            <div className="pt-3 border-t border-[#181820] text-[11px] font-mono text-zinc-400">
              Deterministic CPI via <code>invoke_signed</code> with PDA seeds.
            </div>
          </div>

          {/* Bento 2 */}
          <div className="mono-card p-7 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#121216] border border-[#22222A] flex items-center justify-center text-white">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Isolated PDA Vaults</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Assets are held inside individual Program Derived Addresses generated from <code className="text-zinc-200">[b"vault", escrow.key()]</code>.
              </p>
            </div>
            <div className="pt-3 border-t border-[#181820] text-[11px] font-mono text-zinc-400">
              Zero counterparty private keys.
            </div>
          </div>

          {/* Bento 3 */}
          <div className="mono-card p-7 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#121216] border border-[#22222A] flex items-center justify-center text-white">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white">Guaranteed Timeout Refunds</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                If the seller doesn't deposit the NFT before the deadline, the buyer unilaterally triggers <code className="text-zinc-200">refund()</code> to reclaim 100% of their SOL.
              </p>
            </div>
            <div className="pt-3 border-t border-[#181820] text-[11px] font-mono text-zinc-400">
              Clock sysvar enforced on-chain.
            </div>
          </div>

          {/* Bento 4: Large */}
          <div className="mono-card p-7 md:col-span-2 space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#121216] border border-[#22222A] flex items-center justify-center text-white">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white">Zero-IDL Runtime Decoding</h3>
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-lg">
                Instruction discriminators are computed on-the-fly via <code className="text-zinc-200">sha256("global:&lt;name&gt;")[0..8]</code>. 
                Escrow buffers (113 bytes) are decoded directly using zero-dependency Borsh binary layouts.
              </p>
            </div>
            <div className="pt-3 border-t border-[#181820] text-[11px] font-mono text-zinc-400">
              Resilient to Anchor IDL schema version drifts.
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. DEVELOPER CODE SHOWCASE                                                */}
      {/* ========================================================================= */}
      <section className="py-20 bg-[#050507] border-y border-[#1A1A20]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <span className="text-[11px] font-mono font-medium uppercase tracking-widest text-zinc-400">
                DEVELOPER FIRST
              </span>
              <h2 className="text-2xl font-bold text-white tracking-tight mt-0.5">
                Clean Anchor Smart Contract Code
              </h2>
            </div>

            <div className="flex items-center gap-1.5 bg-[#101014] p-1 rounded-xl border border-[#22222A] text-xs font-mono">
              <button
                onClick={() => setActiveCodeTab('rust')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeCodeTab === 'rust' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                Rust (lib.rs)
              </button>
              <button
                onClick={() => setActiveCodeTab('ts')}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeCodeTab === 'ts' ? 'bg-white text-black font-semibold' : 'text-zinc-400 hover:text-white'
                }`}
              >
                TypeScript Client
              </button>
            </div>
          </div>

          <div className="relative rounded-2xl bg-[#08080B] border border-[#1E1E26] p-6 font-mono text-xs overflow-x-auto text-zinc-300">
            <button
              onClick={() => copyCode(activeCodeTab === 'rust' ? rustCode : tsCode)}
              className="absolute top-4 right-4 px-3 py-1.5 rounded-lg bg-[#141418] hover:bg-[#1E1E26] text-zinc-300 hover:text-white border border-[#262630] flex items-center gap-1.5 text-[11px] transition-colors"
            >
              {copiedCode ? <Check className="w-3 h-3 text-white" /> : <Copy className="w-3 h-3" />}
              <span>{copiedCode ? 'Copied' : 'Copy'}</span>
            </button>
            <pre className="text-zinc-200 leading-relaxed">
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
          <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Ready to trade without counterparty risk?
          </h2>
          <p className="text-zinc-400 text-sm max-w-xl mx-auto">
            Connect your Solana wallet and deploy your first escrow deal in seconds on Devnet.
          </p>
          <div className="pt-2">
            <Link
              to="/app"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-white hover:bg-zinc-200 text-black font-semibold text-xs uppercase tracking-wider transition-colors"
            >
              <span>Launch LetsDeal Terminal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <SolanaFooter />
    </div>
  );
};
