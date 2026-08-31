import React, { FC } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { Handshake } from 'lucide-react';
import { CLUSTER_LABEL } from '../constants';
import { useSolBalance } from '../hooks/useSolBalance';

export const Header: FC = () => {
  const { publicKey } = useWallet();
  const { balance } = useSolBalance();

  return (
    <header className="w-full border-b border-white/[0.08] bg-[#0d0f14]/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md">
            <Handshake className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              LetsDeal
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {CLUSTER_LABEL}
              </span>
            </span>
          </div>
        </div>

        {/* Right: Balance & Wallet Button */}
        <div className="flex items-center gap-2.5">
          {publicKey && balance !== null && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#161a23] border border-white/[0.08] text-xs font-medium text-slate-300">
              <span className="text-emerald-400 font-bold">◎</span>
              <span>{balance.toFixed(3)} SOL</span>
            </div>
          )}

          <WalletMultiButton />
        </div>

      </div>
    </header>
  );
};
