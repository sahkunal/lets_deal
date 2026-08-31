import React, { FC } from 'react';
import { EscrowState } from '../lib/escrowAccount';

const STAGES = [
  { state: EscrowState.Initialized, code: '01', title: 'TERMS_INIT', subtitle: 'Escrow Created' },
  { state: EscrowState.FundsDeposited, code: '02', title: 'SOL_LOCKED', subtitle: 'Vault Funded' },
  { state: EscrowState.NftDeposited, code: '03', title: 'NFT_LOCKED', subtitle: 'ATA Deposited' },
  { state: EscrowState.Completed, code: '04', title: 'SETTLED', subtitle: 'Swap Finalized' },
];

export const StepTracker: FC<{ current: EscrowState }> = ({ current }) => {
  const isRefunded = current === EscrowState.Refunded;

  return (
    <div className="w-full bg-[#13151a] border border-[#21252e] p-4 rounded-xl font-mono">
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-[#ff5500] font-bold">STATE_MACHINE:</span>
          <span className="text-[#f1f3f7]">
            {isRefunded
              ? 'REFUNDED_TO_BUYER'
              : STAGES[current]?.title ?? 'UNKNOWN'}
          </span>
        </div>

        <span className="text-[10px] text-[#5c657a] uppercase">
          PDA CUSTODY [vault]
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {STAGES.map((s, idx) => {
          const isDone = !isRefunded && current > s.state;
          const isActive = !isRefunded && current === s.state;

          return (
            <div
              key={s.code}
              className={`p-3 rounded-lg border transition-colors ${
                isDone
                  ? 'bg-[#181d18] border-[#2b4c2b] text-[#78d678]'
                  : isActive
                  ? 'bg-[#221c15] border-[#ff5500] text-[#f1f3f7] shadow-[0_0_12px_rgba(255,85,0,0.15)]'
                  : 'bg-[#0b0c0f] border-[#1c1f27] text-[#5c657a]'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] mb-1">
                <span className="font-bold">[{s.code}]</span>
                {isDone ? (
                  <span className="text-[#78d678] font-bold">✓ DONE</span>
                ) : isActive ? (
                  <span className="text-[#ff5500] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#ff5500] animate-ping" />
                    ACTIVE
                  </span>
                ) : (
                  <span>PENDING</span>
                )}
              </div>

              <div className={`text-xs font-bold ${isActive ? 'text-white' : ''}`}>
                {s.title}
              </div>
              <div className="text-[10px] text-[#949eb2] opacity-80 mt-0.5">
                {s.subtitle}
              </div>
            </div>
          );
        })}
      </div>

      {isRefunded && (
        <div className="mt-2.5 p-2 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono text-center">
          ⚠️ Escrow was refunded to buyer due to timeout expiration.
        </div>
      )}
    </div>
  );
};
