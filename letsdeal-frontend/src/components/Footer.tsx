import React, { FC } from 'react';
import { ExternalLink, ShieldCheck, Terminal } from 'lucide-react';
import { PROGRAM_ID, CLUSTER_LABEL, explorerAddress } from '../constants';

export const Footer: FC = () => {
  return (
    <footer className="bg-[#08090b] border-t border-[#21252e] text-[#5c657a] text-xs py-8 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-[#949eb2]">
            <span className="w-2 h-2 rounded-full bg-[#ff5500]" />
            <span className="font-bold text-white">lets_deal</span>
            <span>// Solana Devnet Anchor Smart Contract</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a
              href={explorerAddress(PROGRAM_ID.toBase58())}
              target="_blank"
              rel="noreferrer"
              className="text-[#949eb2] hover:text-[#ff5500] flex items-center gap-1 transition-colors"
            >
              <span>Contract Bytecode ({CLUSTER_LABEL})</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span>•</span>
            <span className="text-[#949eb2]">MIT Open Source</span>
          </div>
        </div>

        <div className="pt-4 border-t border-[#181b22] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px]">
          <div>
            Program ID: <code className="text-[#949eb2] select-all">{PROGRAM_ID.toBase58()}</code>
          </div>
          <div>
            113-Byte Borsh Layout • Non-Custodial Vault PDA
          </div>
        </div>
      </div>
    </footer>
  );
};
