import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, Github, Twitter, ShieldCheck } from 'lucide-react';
import { PROGRAM_ID, CLUSTER_LABEL, explorerAddress } from '../constants';

export const SolanaFooter: FC = () => {
  return (
    <footer className="bg-[#000000] border-t border-white/[0.08] text-slate-400 text-xs pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Brand & Tagline (2 cols) */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-[#9945FF] to-[#14F195] p-[1px]">
                <div className="w-full h-full bg-black rounded-[7px] flex items-center justify-center font-bold text-white text-xs">
                  LD
                </div>
              </div>
              <span className="font-extrabold text-white text-base">
                LetsDeal <span className="text-solana-gradient">Protocol</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
              Deterministic, non-custodial Program Derived Address (PDA) escrow protocol for atomic SOL ⇄ SPL NFT over-the-counter swaps on Solana.
            </p>

            <div className="pt-2 text-[11px] font-mono text-slate-500">
              Contract: <a href={explorerAddress(PROGRAM_ID.toBase58())} target="_blank" rel="noreferrer" className="text-[#14F195] hover:underline">{PROGRAM_ID.toBase58().slice(0, 12)}...{PROGRAM_ID.toBase58().slice(-8)}</a>
            </div>
          </div>

          {/* Col 1: Platform */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Protocol</h4>
            <ul className="space-y-2">
              <li><Link to="/app" className="hover:text-white transition-colors">Trade Terminal</Link></li>
              <li><Link to="/developers" className="hover:text-white transition-colors">Documentation</Link></li>
              <li><Link to="/explorer" className="hover:text-white transition-colors">Account Explorer</Link></li>
            </ul>
          </div>

          {/* Col 2: Developers */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Developers</h4>
            <ul className="space-y-2">
              <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">GitHub Repo <ExternalLink className="w-3 h-3"/></a></li>
              <li><a href="https://anchor-lang.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">Anchor Framework <ExternalLink className="w-3 h-3"/></a></li>
              <li><a href={explorerAddress(PROGRAM_ID.toBase58())} target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">Solana Explorer <ExternalLink className="w-3 h-3"/></a></li>
            </ul>
          </div>

          {/* Col 3: Ecosystem */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Solana Ecosystem</h4>
            <ul className="space-y-2">
              <li><a href="https://solana.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Solana.com</a></li>
              <li><a href="https://solfaucet.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Devnet Faucet</a></li>
              <li><a href="https://solscan.io" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Solscan</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#14F195]" />
            <span>Open Source • Non-Custodial • Governed by Solana Smart Contract Bytecode</span>
          </div>

          <div>
            © {new Date().getFullYear()} LetsDeal. Built on Solana {CLUSTER_LABEL.toUpperCase()}.
          </div>
        </div>

      </div>
    </footer>
  );
};
