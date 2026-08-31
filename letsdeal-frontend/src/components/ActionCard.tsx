import React, { FC, ReactNode } from 'react';
import { Loader2, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ActionCardProps {
  title: string;
  description: string;
  ready: boolean;
  readyLabel?: string;
  buttonLabel: string;
  loading?: boolean;
  danger?: boolean;
  onClick: () => void;
  extra?: ReactNode;
}

export const ActionCard: FC<ActionCardProps> = ({
  title,
  description,
  ready,
  readyLabel = 'Ready',
  buttonLabel,
  loading = false,
  danger = false,
  onClick,
  extra,
}) => {
  return (
    <div
      className={`p-5 rounded-xl border font-mono transition-all flex flex-col justify-between ${
        ready
          ? danger
            ? 'bg-[#1e1313] border-rose-600/40 text-rose-200'
            : 'bg-[#181a20] border-[#ff5500]/50 text-[#f1f3f7] shadow-[0_0_15px_rgba(255,85,0,0.08)]'
          : 'bg-[#101216] border-[#1e222b] opacity-60'
      }`}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-white flex items-center gap-1.5">
            <span>{title}</span>
          </h3>

          {ready && (
            <span
              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                danger
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'bg-[#ff5500] text-black font-bold'
              }`}
            >
              {readyLabel}
            </span>
          )}
        </div>

        <p className="text-xs text-[#949eb2] leading-relaxed">
          {description}
        </p>

        {extra}
      </div>

      <div className="mt-4 pt-3 border-t border-[#21252e]">
        <button
          disabled={!ready || loading}
          onClick={onClick}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded font-mono font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-30 disabled:pointer-events-none cursor-pointer ${
            ready
              ? danger
                ? 'bg-rose-600 hover:bg-rose-500 text-white active:translate-y-[1px]'
                : 'tactile-btn-primary active:translate-y-[1px]'
              : 'bg-[#171920] text-[#5c657a] border border-[#21252e]'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin text-current" />
              <span>Broadcasting to Solana...</span>
            </>
          ) : ready ? (
            <>
              <span>{buttonLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          ) : (
            <span>Awaiting Preconditions</span>
          )}
        </button>
      </div>
    </div>
  );
};
