import React, { FC, useState } from 'react';
import { BookOpen, Copy, Check, ExternalLink, Code2, Terminal, Shield, Layers } from 'lucide-react';
import { SolanaNavbar } from '../components/SolanaNavbar';
import { SolanaFooter } from '../components/SolanaFooter';
import { PROGRAM_ID, IDL_METADATA_PDA, CLUSTER_LABEL, explorerAddress } from '../constants';

export const DevelopersPage: FC = () => {
  const [copiedPid, setCopiedPid] = useState(false);

  const copyPid = () => {
    navigator.clipboard.writeText(PROGRAM_ID.toBase58());
    setCopiedPid(true);
    setTimeout(() => setCopiedPid(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-slate-100 selection:bg-[#14F195]/20 selection:text-[#14F195]">
      <SolanaNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        
        {/* Header */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14F195]/10 border border-[#14F195]/30 text-[#14F195] text-xs font-mono">
            <span>ANCHOR PROTOCOL SPECIFICATION</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Developer Documentation
          </h1>
          
          <p className="text-base text-slate-400 leading-relaxed">
            Complete technical specification for the LetsDeal Solana smart contract, including 
            113-byte Borsh memory layouts, CPI instruction schemas, and error code tables.
          </p>
        </div>

        {/* Program Addresses Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          <div className="p-6 rounded-2xl bg-[#090B0F] border border-white/[0.08] space-y-3">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[11px] uppercase">Program ID ({CLUSTER_LABEL})</span>
              <button
                onClick={copyPid}
                className="text-[#14F195] hover:underline flex items-center gap-1"
              >
                {copiedPid ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPid ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="text-sm font-bold text-white select-all break-all">
              {PROGRAM_ID.toBase58()}
            </div>
            <div className="pt-2">
              <a
                href={explorerAddress(PROGRAM_ID.toBase58())}
                target="_blank"
                rel="noreferrer"
                className="text-[#14F195] hover:underline inline-flex items-center gap-1"
              >
                <span>View Bytecode on Solana Explorer</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#090B0F] border border-white/[0.08] space-y-3">
            <div className="text-[11px] text-slate-400 uppercase">IDL Metadata PDA</div>
            <div className="text-sm font-bold text-slate-200 select-all break-all">
              {IDL_METADATA_PDA.toBase58()}
            </div>
            <div className="text-slate-500 pt-2 text-[11px]">
              Seeds: <code>[b"idl"]</code>
            </div>
          </div>
        </div>

        {/* 113-Byte Account Layout Table */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#14F195]" />
            <span>Escrow Account Layout (113 Bytes)</span>
          </h2>

          <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#090B0F] font-mono text-xs">
            <table className="w-full text-left divide-y divide-white/[0.06]">
              <thead className="bg-white/[0.02] text-slate-400">
                <tr>
                  <th className="py-3 px-4">Offset</th>
                  <th className="py-3 px-4">Field Name</th>
                  <th className="py-3 px-4">Rust Type</th>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-slate-300">
                <tr><td className="py-2.5 px-4 text-[#14F195]">0..8</td><td className="font-bold text-white">discriminator</td><td>[u8; 8]</td><td>8 Bytes</td><td>Anchor account discriminator</td></tr>
                <tr><td className="py-2.5 px-4 text-[#14F195]">8..40</td><td className="font-bold text-white">buyer</td><td>Pubkey</td><td>32 Bytes</td><td>Wallet address of the buyer</td></tr>
                <tr><td className="py-2.5 px-4 text-[#14F195]">40..72</td><td className="font-bold text-white">seller</td><td>Pubkey</td><td>32 Bytes</td><td>Wallet address of the seller</td></tr>
                <tr><td className="py-2.5 px-4 text-[#14F195]">72..80</td><td className="font-bold text-white">amount</td><td>u64</td><td>8 Bytes</td><td>Agreed escrow amount in lamports</td></tr>
                <tr><td className="py-2.5 px-4 text-[#14F195]">80..88</td><td className="font-bold text-white">deadline</td><td>i64</td><td>8 Bytes</td><td>Unix timestamp timeout deadline</td></tr>
                <tr><td className="py-2.5 px-4 text-[#14F195]">88..120</td><td className="font-bold text-white">nft_mint</td><td>Pubkey</td><td>32 Bytes</td><td>Required SPL Token NFT mint</td></tr>
                <tr><td className="py-2.5 px-4 text-[#14F195]">120..121</td><td className="font-bold text-white">state</td><td>EscrowState</td><td>1 Byte</td><td>0: Init, 1: SOL, 2: NFT, 3: Done, 4: Refund</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Instruction Call Handlers */}
        <div className="space-y-4 font-mono text-xs">
          <h2 className="text-2xl font-bold text-white font-sans flex items-center gap-2">
            <Terminal className="w-5 h-5 text-[#00C2FF]" />
            <span>Instructions & Signer Requirements</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#090B0F] border border-white/[0.08] space-y-2">
              <div className="text-sm font-bold text-[#14F195]">1. initialize</div>
              <p className="text-slate-400">Deploys new 113-byte escrow account with locked terms.</p>
              <div className="text-slate-500 text-[11px]">Signers: Buyer, Escrow Keypair</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#090B0F] border border-white/[0.08] space-y-2">
              <div className="text-sm font-bold text-[#14F195]">2. deposit_funds</div>
              <p className="text-slate-400">Transfers SOL into Program Derived Address vault locker.</p>
              <div className="text-slate-500 text-[11px]">Signers: Buyer</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#090B0F] border border-white/[0.08] space-y-2">
              <div className="text-sm font-bold text-[#00C2FF]">3. deposit_nft</div>
              <p className="text-slate-400">Transfers 1 token of NFT mint into Vault Associated Token Account.</p>
              <div className="text-slate-500 text-[11px]">Signers: Seller</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#090B0F] border border-white/[0.08] space-y-2">
              <div className="text-sm font-bold text-[#9945FF]">4. execute_trade</div>
              <p className="text-slate-400">Atomic swap: delivers NFT to Buyer & releases SOL to Seller.</p>
              <div className="text-slate-500 text-[11px]">Signers: Either Party</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#090B0F] border border-white/[0.08] space-y-2 md:col-span-2">
              <div className="text-sm font-bold text-rose-400">5. refund</div>
              <p className="text-slate-400">Unilateral buyer refund if clock timestamp exceeds deadline.</p>
              <div className="text-slate-500 text-[11px]">Signers: Buyer (Requires <code>Clock::get()?.unix_timestamp &gt; escrow.deadline</code>)</div>
            </div>
          </div>
        </div>

      </main>

      <SolanaFooter />
    </div>
  );
};
