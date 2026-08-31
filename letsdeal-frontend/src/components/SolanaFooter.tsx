import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import { PROGRAM_ID, CLUSTER_LABEL, explorerAddress } from '../constants';

export const SolanaFooter: FC = () => {
  return (
    <footer className="bg-[#000000] border-t border-[#1C1C22] text-zinc-400 text-xs pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          
          {/* Brand & Tagline (2 cols) */}
          <div className="col-span-2 space-y-3.5">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-white flex items-center justify-center font-bold text-black text-[11px]">
                LD
              </div>
              <span className="font-bold text-white text-sm">
                LetsDeal <span className="text-zinc-500 font-normal">Protocol</span>
              </span>
            </div>

            <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
              Non-custodial smart contract escrow protocol for atomic SOL ⇄ SPL NFT over-the-counter swaps on Solana.
            </p>

            <div className="pt-1 text-[11px] font-mono text-zinc-500">
              Program ID: <a href={explorerAddress(PROGRAM_ID.toBase58())} target="_blank" rel="noreferrer" className="text-zinc-300 hover:text-white hover:underline">{PROGRAM_ID.toBase58().slice(0, 12)}...{PROGRAM_ID.toBase58().slice(-8)}</a>
            </div>
          </div>

          {/* Col 1: Platform */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-white text-xs tracking-wider uppercase">Protocol</h4>
            <ul className="space-y-2 text-zinc-400">
              <li><Link to="/app" className="hover:text-white transition-colors">Trade Terminal</Link></li>
              <li><Link to="/developers" className="hover:text-white transition-colors">Documentation</Link></li>
              <li><Link to="/explorer" className="hover:text-white transition-colors">Account Explorer</Link></li>
            </ul>
          </div>

          {/* Col 2: Developers */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-white text-xs tracking-wider uppercase">Developers</h4>
            <ul className="space-y-2 text-zinc-400">
              <li><a href="https://github.com/sahkunal/lets_deal" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">GitHub Repo <ExternalLink className="w-3 h-3 text-zinc-500"/></a></li>
              <li><a href="https://anchor-lang.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">Anchor Framework <ExternalLink className="w-3 h-3 text-zinc-500"/></a></li>
              <li><a href={explorerAddress(PROGRAM_ID.toBase58())} target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-1">Solana Explorer <ExternalLink className="w-3 h-3 text-zinc-500"/></a></li>
            </ul>
          </div>

          {/* Col 3: Ecosystem */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-white text-xs tracking-wider uppercase">Solana Ecosystem</h4>
            <ul className="space-y-2 text-zinc-400">
              <li><a href="https://solana.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Solana.com</a></li>
              <li><a href="https://solfaucet.com" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Devnet Faucet</a></li>
              <li><a href="https://solscan.io" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Solscan</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#1C1C22] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500 font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-300" />
            <span>Open Source • Non-Custodial • Verified Bytecode on Solana {CLUSTER_LABEL.toUpperCase()}</span>
          </div>

          <div>
            © {new Date().getFullYear()} LetsDeal Protocol
          </div>
        </div>

      </div>
    </footer>
  );
};
