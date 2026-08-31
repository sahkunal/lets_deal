import React, { useState, FC } from 'react';
import { Shield, Sparkles, Cpu, Lock, CheckCircle2, ArrowRightLeft, Clock } from 'lucide-react';
import { EscrowAccount, EscrowState, EscrowStateLabel } from '../lib/escrowAccount';
import { PROGRAM_ID } from '../constants';
import { getVaultPda } from '../lib/pda';

interface VirtualEscrowCardProps {
  escrow?: EscrowAccount | null;
  sampleAmount?: number;
  sampleMint?: string;
}

export const VirtualEscrowCard: FC<VirtualEscrowCardProps> = ({
  escrow,
  sampleAmount = 1.5,
  sampleMint = '8Yx1...4829'
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const displayAmount = escrow
    ? (Number(escrow.amount.toString()) / 1e9).toFixed(3)
    : sampleAmount.toFixed(3);

  const state = escrow?.state ?? EscrowState.FundsDeposited;
  const stateLabel = EscrowStateLabel[state] ?? 'vault active';

  const buyerShort = escrow?.buyer ? `${escrow.buyer.toBase58().slice(0, 4)}...${escrow.buyer.toBase58().slice(-4)}` : '8Xqp...9921';
  const sellerShort = escrow?.seller ? `${escrow.seller.toBase58().slice(0, 4)}...${escrow.seller.toBase58().slice(-4)}` : '4Tzz...1102';
  const mintShort = escrow?.nftMint ? `${escrow.nftMint.toBase58().slice(0, 4)}...${escrow.nftMint.toBase58().slice(-4)}` : sampleMint;
  
  const [vaultPda] = escrow ? getVaultPda(escrow.address) : ['7Fka...PDA'];

  return (
    <div className="relative group max-w-sm sm:max-w-md w-full select-none">
      {/* 3D Wrapper */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="cursor-pointer transition-transform duration-700 [perspective:1000px]"
      >
        <div
          className={`relative w-full aspect-[1.586/1] rounded-3xl transition-all duration-700 [transform-style:preserve-3d] shadow-2xl shadow-black/80 ${
            isFlipped ? '[transform:rotateY(180deg)]' : ''
          }`}
        >
          {/* FRONT OF THE CARD */}
          <div className="absolute inset-0 w-full h-full rounded-3xl p-6 flex flex-col justify-between [backface-visibility:hidden] overflow-hidden border border-white/15 bg-gradient-to-br from-[#121b28] via-[#0d121c] to-[#06090e]">
            {/* Holographic metallic glare overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.04] to-emerald-400/[0.08] pointer-events-none" />
            <div className="absolute -right-16 -top-16 w-52 h-52 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 w-52 h-52 rounded-full bg-purple-500/15 blur-3xl pointer-events-none" />

            {/* Header: Brand & State Pill */}
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-400 to-teal-300 p-[1px] shadow-lg shadow-emerald-500/30">
                  <div className="w-full h-full bg-[#0A0C10] rounded-[11px] flex items-center justify-center">
                    <ArrowRightLeft className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
                <div>
                  <div className="font-display font-bold text-sm tracking-wider text-white">
                    LETS<span className="text-emerald-400">DEAL</span>
                  </div>
                  <div className="text-[9px] font-mono text-slate-400">SOLANA DEVNET ESCROW</div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-400 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>{stateLabel}</span>
              </div>
            </div>

            {/* Middle: Amount & Swap Preview */}
            <div className="my-auto z-10 py-2">
              <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                LOCKED COLLATERAL VALUE
              </div>
              <div className="text-3xl font-extrabold font-display text-white mt-0.5 flex items-baseline gap-2">
                <span>{displayAmount}</span>
                <span className="text-gradient-solana text-xl font-bold">SOL</span>
                <span className="text-xs font-mono text-slate-400 font-normal">⇄ 1x NFT Mint</span>
              </div>
            </div>

            {/* Footer: Parties & Vault Info */}
            <div className="flex items-end justify-between z-10 text-xs font-mono pt-2 border-t border-white/[0.08]">
              <div>
                <div className="text-[9px] text-slate-400 uppercase">BUYER</div>
                <div className="font-semibold text-slate-200 text-[11px]">{buyerShort}</div>
              </div>

              <div>
                <div className="text-[9px] text-slate-400 uppercase">SELLER</div>
                <div className="font-semibold text-slate-200 text-[11px]">{sellerShort}</div>
              </div>

              <div>
                <div className="text-[9px] text-slate-400 uppercase">NFT MINT</div>
                <div className="font-semibold text-purple-400 text-[11px]">{mintShort}</div>
              </div>
            </div>
          </div>

          {/* BACK OF THE CARD */}
          <div className="absolute inset-0 w-full h-full rounded-3xl p-6 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)] overflow-hidden border border-white/15 bg-gradient-to-br from-[#06090e] via-[#0d121c] to-[#121b28]">
            <div className="space-y-3 z-10">
              <div className="flex items-center justify-between text-xs font-mono border-b border-white/[0.08] pb-2">
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  <span>ON-CHAIN PDA PROOF</span>
                </span>
                <span className="text-[10px] text-slate-400">NON-CUSTODIAL</span>
              </div>

              <div className="space-y-2 text-xs font-mono">
                <div>
                  <div className="text-[10px] text-slate-400">PROGRAM ID</div>
                  <div className="text-[11px] text-slate-300 truncate">
                    {PROGRAM_ID.toBase58()}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400">DERIVATION SEEDS</div>
                  <div className="text-[11px] text-emerald-400">
                    [b"vault", escrow.key()]
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-400">ANCHOR BYTE SIZE</div>
                  <div className="text-[11px] text-slate-200">
                    113 Bytes (Zero Rent Leakage)
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono pt-2 border-t border-white/[0.08] z-10">
              <div className="flex items-center gap-1 text-emerald-400">
                <Shield className="w-3.5 h-3.5" />
                <span>ATOMIC SWAP GUARANTEE</span>
              </div>
              <span>TAP TO FLIP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
